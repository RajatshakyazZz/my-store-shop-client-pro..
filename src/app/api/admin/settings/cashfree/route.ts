import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getCashfreeCredentials, clearCashfreeCredentialsCache } from '@/lib/cashfree';

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
    const creds = await getCashfreeCredentials(true);

    return NextResponse.json(
      {
        success: true,
        config: {
          app_id: creds.appId,
          secret_key: creds.secretKey,
          environment: creds.environment,
          api_version: creds.apiVersion,
          return_url: creds.returnUrl,
          enabled: creds.enabled,
          configured: Boolean(creds.appId && creds.secretKey),
        },
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    console.error('Error fetching Cashfree config:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch Cashfree settings' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const app_id = String(
      body.app_id ||
      body.cashfree_app_id ||
      body.client_id ||
      body.key_id ||
      body.merchant_key ||
      ''
    ).trim();

    const secret_key = String(
      body.secret_key ||
      body.cashfree_secret_key ||
      body.client_secret ||
      body.key_secret ||
      body.merchant_salt ||
      ''
    ).trim();

    let environment: 'PRODUCTION' | 'SANDBOX' = 'PRODUCTION';
    if (body.environment === 'TEST' || body.environment === 'SANDBOX' || app_id.startsWith('TEST') || secret_key.startsWith('cfsk_ma_test_')) {
      environment = 'SANDBOX';
    }

    const enabled = typeof body.enabled === 'boolean' ? body.enabled : true;
    const api_version = body.api_version || '2023-08-01';

    const payload = {
      app_id,
      secret_key,
      cashfree_app_id: app_id,
      cashfree_secret_key: secret_key,
      environment,
      enabled,
      api_version,
      updated_at: new Date().toISOString(),
    };

    if (db) {
      try {
        // 1. Write to store_settings/cashfree
        await setDoc(doc(db, 'store_settings', 'cashfree'), payload, { merge: true });
        // 2. Also sync to store_settings/general
        await setDoc(doc(db, 'store_settings', 'general'), payload, { merge: true });
      } catch (firestoreErr: any) {
        console.error('Firestore error saving Cashfree config:', firestoreErr);
        return NextResponse.json(
          {
            success: false,
            error: `Firestore write error: ${firestoreErr.message || 'Permission denied'}`,
          },
          { status: 500, headers: CORS_HEADERS }
        );
      }
    }

    clearCashfreeCredentialsCache();

    return NextResponse.json(
      {
        success: true,
        message: 'Cashfree credentials saved and synchronized successfully',
        config: {
          app_id,
          secret_key,
          environment,
          enabled,
          api_version,
          configured: Boolean(app_id && secret_key),
        },
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    console.error('Error saving Cashfree config:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save Cashfree settings' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
