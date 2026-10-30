import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getMetaCredentials } from '@/lib/metaCapi';

export const runtime = 'nodejs';

function sha256(val: string): string {
  return crypto.createHash('sha256').update(val.trim().toLowerCase(), 'utf8').digest('hex');
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    let pixelId = String(body.pixel_id || body.meta_pixel_id || '').trim();
    let accessToken = String(body.capi_token || body.access_token || '').trim();
    let testEventCode = String(body.test_event_code || '').trim();
    const eventName = String(body.event_name || 'PageView').trim();

    if (!pixelId || !accessToken) {
      const storedCreds = await getMetaCredentials();
      if (storedCreds) {
        if (!pixelId) pixelId = storedCreds.pixelId;
        if (!accessToken) accessToken = storedCreds.accessToken;
        if (!testEventCode && storedCreds.testEventCode) testEventCode = storedCreds.testEventCode;
      }
    }

    if (!pixelId) {
      return NextResponse.json(
        { success: false, error: 'Meta Pixel ID is missing. Please enter your Meta Pixel ID first.' },
        { status: 400 }
      );
    }

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Conversions API (CAPI) Access Token is missing. In Meta Events Manager > Settings > Conversions API, generate an access token and paste it here.',
        },
        { status: 400 }
      );
    }

    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '1.1.1.1';
    const clientUserAgent =
      request.headers.get('user-agent') ||
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

    const eventPayload: Record<string, any> = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: `test_admin_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      action_source: 'website',
      event_source_url: 'https://www.ztoredigital.com',
      user_data: {
        client_ip_address: clientIp,
        client_user_agent: clientUserAgent,
        em: [sha256('admin.test@ztoredigital.com')],
        ph: [sha256('919999999999')],
      },
      custom_data: {
        currency: 'INR',
        value: 199.0,
        content_name: 'Meta Pixel & CAPI Diagnostics Test',
      },
    };

    const requestBody: Record<string, any> = {
      data: [eventPayload],
    };

    if (testEventCode) {
      requestBody.test_event_code = testEventCode;
    }

    const endpoint = `https://graph.facebook.com/v19.0/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(accessToken)}`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(requestBody),
      cache: 'no-store',
    });

    const data = await res.json();

    if (res.ok) {
      return NextResponse.json({
        success: true,
        events_received: data.events_received || 1,
        fbtrace_id: data.fbtrace_id,
        test_event_code: testEventCode || null,
        message: testEventCode
          ? `Test event '${eventName}' successfully delivered to Meta! Check your Events Manager 'Test Events' tab.`
          : `Live event '${eventName}' successfully received by Meta Graph API!`,
      });
    }

    const errorMsg = data.error?.message || JSON.stringify(data);
    return NextResponse.json(
      {
        success: false,
        error: `Meta Graph API error: ${errorMsg}`,
        fbtrace_id: data.fbtrace_id,
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error in /api/admin/meta-pixel/test:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal test dispatch error' },
      { status: 500 }
    );
  }
}
