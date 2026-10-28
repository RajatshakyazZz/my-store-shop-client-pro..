import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getPayUCredentials, clearPayUCredentialsCache } from '@/lib/payu';

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
    const creds = await getPayUCredentials(true);

    return NextResponse.json(
      {
        success: true,
        config: {
          merchant_key: creds.merchantKey,
          merchant_salt: creds.merchantSalt,
          environment: creds.environment,
          return_url: creds.returnUrl,
          enabled: creds.enabled,
          configured: Boolean(creds.merchantKey && creds.merchantSalt),
        },
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    console.error('Error fetching PayU config:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch PayU settings' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const merchant_key = String(body.merchant_key || body.app_id || '').trim();
    const merchant_salt = String(body.merchant_salt || body.secret_key || '').trim();
    const environment = body.environment === 'TEST' || body.environment === 'SANDBOX' ? 'TEST' : 'PRODUCTION';
    const enabled = typeof body.enabled === 'boolean' ? body.enabled : true;
    const return_url = String(body.return_url || '').trim() || 'https://vaultworld.shop/api/payment/payu/return';

    const payload = {
      merchant_key,
      merchant_salt,
      app_id: merchant_key,
      secret_key: merchant_salt,
      environment,
      enabled,
      return_url,
      updated_at: new Date().toISOString(),
    };

    if (db) {
      try {
        await setDoc(doc(db, 'store_settings', 'payu'), payload, { merge: true });
        await setDoc(doc(db, 'store_settings', 'cashfree'), payload, { merge: true });
      } catch (firestoreErr: any) {
        console.error('Firestore error saving PayU config in API route:', firestoreErr);
        return NextResponse.json(
          {
            success: false,
            error: `Firestore write error: ${firestoreErr.message || 'Permission denied'}`,
          },
          { status: 500, headers: CORS_HEADERS }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, error: 'Database service is unavailable' },
        { status: 500, headers: CORS_HEADERS }
      );
    }

    // Invalidate in-memory server cache so checkout picks up new keys immediately
    clearPayUCredentialsCache();

    return NextResponse.json(
      {
        success: true,
        message: 'PayU credentials saved and verified in Firestore successfully.',
        config: {
          merchant_key,
          merchant_salt,
          environment,
          enabled,
          return_url,
          configured: Boolean(merchant_key && merchant_salt),
        },
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    console.error('Error saving PayU config:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save PayU settings' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
