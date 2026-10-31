import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-key',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const apiKey = String(body.api_key || '').trim();

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Please enter an ImgBB API Key before testing.' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Tiny 1x1 transparent GIF base64
    const testPixelBase64 = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    const formData = new FormData();
    formData.append('image', testPixelBase64);
    formData.append('name', 'test_key_ping');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    const text = await res.text();
    let data: any = {};
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: `ImgBB returned unexpected response (HTTP ${res.status}): ${text.slice(0, 120)}`,
        },
        { status: 502, headers: CORS_HEADERS }
      );
    }

    if (!res.ok || !data.success) {
      const msg = data?.error?.message || data?.message || `ImgBB error (HTTP ${res.status})`;
      return NextResponse.json(
        { success: false, error: msg },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'ImgBB API Key verified successfully! CDN is ready for product images.',
        url: data.data?.url || data.data?.display_url,
      },
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Connection to ImgBB timed out after 8s. Check your network or try direct browser upload.',
        },
        { status: 504, headers: CORS_HEADERS }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || 'Internal error while testing ImgBB key' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
