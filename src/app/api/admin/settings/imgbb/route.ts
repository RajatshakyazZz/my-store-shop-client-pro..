import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const runtime = 'nodejs';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-key',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  try {
    let apiKey = (
      process.env.IMGBB_API_KEY ||
      process.env.IMGBB_KEY ||
      process.env.NEXT_PUBLIC_IMGBB_API_KEY ||
      process.env.IMGBB_SECRET ||
      ''
    ).trim();
    let source = apiKey ? 'environment' : 'none';

    if (db) {
      try {
        const snap = await getDoc(doc(db, 'store_settings', 'imgbb')).catch(() => null);
        if (snap && snap.exists()) {
          const dbKey = (snap.data().api_key || snap.data().key || '').trim();
          if (dbKey) {
            apiKey = dbKey;
            source = 'database_imgbb';
          }
        }

        if (!apiKey) {
          const genSnap = await getDoc(doc(db, 'store_settings', 'general')).catch(() => null);
          if (genSnap && genSnap.exists()) {
            const dbKey = (genSnap.data().imgbb_api_key || genSnap.data().imgbb?.api_key || '').trim();
            if (dbKey) {
              apiKey = dbKey;
              source = 'database_general';
            }
          }
        }
      } catch (dbErr) {
        console.warn('Error fetching ImgBB config from Firestore:', dbErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        config: {
          api_key: apiKey,
          configured: Boolean(apiKey),
          source,
          enabled: true,
        },
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    console.error('Error in GET /api/admin/settings/imgbb:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch ImgBB settings' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const apiKey = String(body.api_key || body.key || body.imgbb_api_key || '').trim();

    const payload = {
      api_key: apiKey,
      imgbb_api_key: apiKey,
      configured: Boolean(apiKey),
      enabled: true,
      updated_at: new Date().toISOString(),
    };

    if (db) {
      try {
        // 1. Save to primary store_settings/general
        await setDoc(doc(db, 'store_settings', 'general'), {
          imgbb_api_key: apiKey,
          updated_at: new Date().toISOString(),
        }, { merge: true });

        // 2. Save to store_settings/imgbb document
        await setDoc(doc(db, 'store_settings', 'imgbb'), payload, { merge: true });
      } catch (dbErr: any) {
        console.error('Firestore save error in ImgBB settings:', dbErr);
        return NextResponse.json(
          {
            success: false,
            error: 'Failed to persist ImgBB key to Cloud Database: ' + (dbErr.message || 'Unknown error'),
          },
          { status: 500, headers: CORS_HEADERS }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'ImgBB API Key saved successfully to Cloud Database.',
        config: {
          api_key: apiKey,
          configured: Boolean(apiKey),
        },
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    console.error('Error in POST /api/admin/settings/imgbb:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update ImgBB settings' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
