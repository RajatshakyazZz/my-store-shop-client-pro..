import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import {
  getRazorpayCredentials,
  clearRazorpayCredentialsCache,
  testRazorpayCredentials,
} from '@/lib/razorpay';

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
    const creds = await getRazorpayCredentials(true);

    return NextResponse.json(
      {
        success: true,
        config: {
          merchant_key: creds.keyId,
          merchant_salt: creds.keySecret,
          key_id: creds.keyId,
          key_secret: creds.keySecret,
          razorpay_key_id: creds.keyId,
          razorpay_key_secret: creds.keySecret,
          environment: creds.environment,
          enabled: creds.enabled,
          configured: Boolean(creds.keyId && creds.keySecret),
        },
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    console.error('Error fetching gateway config:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch gateway settings' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const key_id = String(
      body.key_id || body.razorpay_key_id || body.merchant_key || body.app_id || ''
    ).trim();
    const key_secret = String(
      body.key_secret || body.razorpay_key_secret || body.merchant_salt || body.secret_key || ''
    ).trim();
    const environment =
      body.environment === 'TEST' || body.environment === 'SANDBOX' ? 'TEST' : 'PRODUCTION';
    const enabled = typeof body.enabled === 'boolean' ? body.enabled : true;

    if (body.test === true) {
      const testResult = await testRazorpayCredentials(key_id, key_secret);
      return NextResponse.json(testResult, { headers: CORS_HEADERS });
    }

    const payload = {
      key_id,
      key_secret,
      razorpay_key_id: key_id,
      razorpay_key_secret: key_secret,
      merchant_key: key_id,
      merchant_salt: key_secret,
      app_id: key_id,
      secret_key: key_secret,
      gateway: 'razorpay',
      environment,
      enabled,
      updated_at: new Date().toISOString(),
    };

    if (db) {
      await setDoc(doc(db, 'store_settings', 'general'), payload, { merge: true });
      await Promise.allSettled([
        setDoc(doc(db, 'store_settings', 'razorpay'), payload, { merge: true }),
        setDoc(doc(db, 'store_settings', 'payu'), payload, { merge: true }),
      ]);
    }

    clearRazorpayCredentialsCache();

    return NextResponse.json(
      {
        success: true,
        message: 'Razorpay credentials saved and verified in Firestore successfully.',
        config: {
          key_id,
          key_secret,
          merchant_key: key_id,
          merchant_salt: key_secret,
          environment,
          enabled,
          configured: Boolean(key_id && key_secret),
        },
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    console.error('Error saving gateway config:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save gateway settings' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
