import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
// Allow up to 60s for large 32MB image uploads
export const maxDuration = 60;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-key',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

// Allowed file extensions & MIME types (Strictly .PNG and .JPG/.JPEG as requested)
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg'];
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/pjpeg', 'image/jpg'];
// Max file size allowed: 32 MB (ImgBB limit)
const MAX_FILE_SIZE = 32 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    // 1. Verify ImgBB API key from environment variables (NEVER exposed to frontend)
    const apiKey = process.env.IMGBB_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            'ImgBB API Key is not configured. Please add IMGBB_API_KEY in your Vercel Project Settings > Environment Variables (or .env.local).',
        },
        { status: 500, headers: CORS_HEADERS }
      );
    }

    // 2. Parse multipart/form-data
    const formData = await request.formData();
    const file = (formData.get('image') || formData.get('file')) as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No image file uploaded. Please select an image.' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 3. Validate file extension
    const fileName = file.name ? file.name.toLowerCase() : '';
    const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));

    // 4. Validate MIME type
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

    // 5. Validate file size (Max 32 MB)
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

    // 6. Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');

    // 7. Prepare payload for ImgBB API v1
    const imgbbPayload = new FormData();
    imgbbPayload.append('image', base64Data);

    const sanitizedBaseName = fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    if (sanitizedBaseName) {
      imgbbPayload.append('name', sanitizedBaseName);
    }

    // 8. Upload to ImgBB securely
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout

    const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      body: imgbbPayload,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await imgbbResponse.json();

    if (!imgbbResponse.ok || !data.success) {
      const errorMsg =
        data?.error?.message ||
        data?.message ||
        `ImgBB API error (HTTP ${imgbbResponse.status}): Failed to process upload`;
      return NextResponse.json(
        {
          success: false,
          error: errorMsg,
        },
        { status: imgbbResponse.status || 502, headers: CORS_HEADERS }
      );
    }

    // 9. Successfully uploaded to ImgBB!
    // Return direct image URLs
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
        delete_url: uploadedData.delete_url || null,
      },
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return NextResponse.json(
        { success: false, error: 'Upload timed out. Please try with a smaller image or check network.' },
        { status: 504, headers: CORS_HEADERS }
      );
    }
    console.error('ImgBB Upload Handler Exception:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Internal server error while uploading image',
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
