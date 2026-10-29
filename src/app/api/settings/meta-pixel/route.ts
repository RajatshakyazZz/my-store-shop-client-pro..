import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const runtime = 'nodejs';

export async function GET() {
  try {
    let pixelId = '';
    let testEventCode = '';
    let enabled = true;

    // 1. Check Firestore store_settings/meta_pixel and store_settings/dnp_meta
    if (db) {
      try {
        const [metaSnap, dnpSnap] = await Promise.all([
          getDoc(doc(db, 'store_settings', 'meta_pixel')).catch(() => null),
          getDoc(doc(db, 'store_settings', 'dnp_meta')).catch(() => null),
        ]);

        if (metaSnap && metaSnap.exists()) {
          const data = metaSnap.data();
          if (data.pixel_id && data.pixel_id !== '1715650960276913') {
            pixelId = String(data.pixel_id).trim();
          }
          if (data.test_event_code) testEventCode = String(data.test_event_code).trim();
          if (typeof data.enabled === 'boolean') enabled = data.enabled;
        }

        if (dnpSnap && dnpSnap.exists()) {
          const dnpData = dnpSnap.data();
          const dnpPixel = String(dnpData.meta_pixel_id || dnpData.pixel_id || '').trim();
          if (!pixelId && dnpPixel && dnpPixel !== '1715650960276913') {
            pixelId = dnpPixel;
          }
          if (!testEventCode && dnpData.test_event_code) {
            testEventCode = String(dnpData.test_event_code).trim();
          }
          if (typeof dnpData.enabled === 'boolean') enabled = dnpData.enabled;
        }
      } catch (err) {
        console.warn('Error reading Meta Pixel config from Firestore:', err);
      }
    }

    // 2. Check environment variable fallback (strictly ignoring personal dev pixel)
    if (!pixelId) {
      const envPixel = (process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID || '').trim();
      if (envPixel && envPixel !== '1715650960276913') {
        pixelId = envPixel;
      }
    }

    if (!testEventCode) {
      testEventCode = (
        process.env.META_TEST_EVENT_CODE ||
        process.env.NEXT_PUBLIC_META_TEST_EVENT_CODE ||
        ''
      ).trim();
    }

    return NextResponse.json(
      {
        success: true,
        pixel_id: pixelId,
        test_event_code: testEventCode || null,
        enabled: Boolean(pixelId && enabled),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (err: any) {
    console.error('Error in /api/settings/meta-pixel:', err);
    return NextResponse.json(
      {
        success: false,
        pixel_id: '',
        enabled: false,
      },
      { status: 200 }
    );
  }
}
