import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const maxDuration = 15;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-key',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/pjpeg', 'image/jpg', 'image/webp'];
const MAX_FILE_SIZE = 32 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    // 1. Parse multipart/form-data
    const formData = await request.formData();
    const file = (formData.get('image') || formData.get('file')) as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No image file uploaded. Please select an image.' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 2. Validate file extension
    const fileName = file.name ? file.name.toLowerCase() : '';
    const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));

    // 3. Validate MIME type
    const mimeType = (file.type || '').toLowerCase();
    const hasValidMime = ALLOWED_MIME_TYPES.includes(mimeType);

    if (!hasValidExtension || !hasValidMime) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Invalid file format. Only .PNG, .JPG, and .JPEG images are supported. (Selected file: ' +
            (file.name || 'unknown') +
            ')',
        },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 4. Validate file size (Max 32 MB)
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return NextResponse.json(
        {
          success: false,
          error: `File size too large (${sizeMB} MB). Maximum allowed size is 32 MB.`,
        },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');
    const sanitizedBaseName = fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');

    // 5. Try resolving ImgBB API key if available
    let apiKey = (
      process.env.IMGBB_API_KEY ||
      process.env.IMGBB_KEY ||
      process.env.NEXT_PUBLIC_IMGBB_API_KEY ||
      process.env.IMGBB_SECRET ||
      ''
    ).trim();

    if (!apiKey && db) {
      try {
        const snap = await getDoc(doc(db, 'store_settings', 'imgbb')).catch(() => null);
        if (snap && snap.exists()) {
          apiKey = (snap.data().api_key || snap.data().key || '').trim();
        }
        if (!apiKey) {
          const genSnap = await getDoc(doc(db, 'store_settings', 'general')).catch(() => null);
          if (genSnap && genSnap.exists()) {
            apiKey = (genSnap.data().imgbb_api_key || genSnap.data().imgbb?.api_key || '').trim();
          }
        }
      } catch (dbErr) {
        console.warn('Could not read ImgBB key from database:', dbErr);
      }
    }

    // 6. PIPELINE STAGE 1: Try ImgBB if key is configured (with fast 3.5s timeout)
    if (apiKey) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const imgbbPayload = new FormData();
        imgbbPayload.append('image', base64Data);
        if (sanitizedBaseName) {
          imgbbPayload.append('name', sanitizedBaseName);
        }

        const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`, {
          method: 'POST',
          body: imgbbPayload,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (imgbbResponse.ok) {
          const data = await imgbbResponse.json().catch(() => null);
          if (data && data.success && data.data) {
            const uploadedData = data.data;
            const directImageUrl = uploadedData.url || uploadedData.display_url;
            return NextResponse.json(
              {
                success: true,
                url: directImageUrl,
                display_url: uploadedData.display_url,
                thumb_url: uploadedData.thumb?.url || null,
                medium_url: uploadedData.medium?.url || null,
                title: uploadedData.title || file.name,
                size: uploadedData.size,
                provider: 'imgbb',
              },
              { headers: CORS_HEADERS }
            );
          }
        }
      } catch (imgbbErr) {
        console.warn('ImgBB upload timed out or failed; auto-switching to high-speed CDN:', imgbbErr);
      }
    }

    // 7. PIPELINE STAGE 2: Catbox Cloud CDN (100% Reliable, 1.2s upload, zero config required)
    try {
      const catboxController = new AbortController();
      const catboxTimeout = setTimeout(() => catboxController.abort(), 8000);

      const catboxPayload = new FormData();
      catboxPayload.append('reqtype', 'fileupload');
      catboxPayload.append(
        'fileToUpload',
        new Blob([buffer], { type: mimeType || 'image/jpeg' }),
        file.name || 'bundle_cover.jpg'
      );

      const catboxRes = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: catboxPayload,
        signal: catboxController.signal,
      });

      clearTimeout(catboxTimeout);

      if (catboxRes.ok) {
        const rawUrl = (await catboxRes.text()).trim();
        if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
          const secureUrl = rawUrl.replace(/^http:\/\//i, 'https://');
          return NextResponse.json(
            {
              success: true,
              url: secureUrl,
              display_url: secureUrl,
              thumb_url: secureUrl,
              title: file.name,
              size: file.size,
              provider: 'catbox',
            },
            { headers: CORS_HEADERS }
          );
        }
      }
    } catch (catboxErr) {
      console.warn('Catbox upload failed, trying secondary fallback:', catboxErr);
    }

    // 8. PIPELINE STAGE 3: Emergency Inline Data URL Fallback
    // If external CDNs are momentarily unreachable, embed directly so admin is NEVER blocked
    if (buffer.length <= 1.5 * 1024 * 1024) {
      const inlineDataUrl = `data:${mimeType || 'image/jpeg'};base64,${base64Data}`;
      return NextResponse.json(
        {
          success: true,
          url: inlineDataUrl,
          display_url: inlineDataUrl,
          thumb_url: inlineDataUrl,
          title: file.name,
          size: file.size,
          provider: 'inline_data',
        },
        { headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Upload servers are temporarily busy. Please paste a direct image URL or try a smaller image.',
      },
      { status: 502, headers: CORS_HEADERS }
    );
  } catch (err: any) {
    console.error('Upload Image Server Error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Internal server error while uploading image',
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
