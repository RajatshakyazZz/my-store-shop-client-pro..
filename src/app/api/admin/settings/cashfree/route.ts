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
    } else if (app_id.startsWith('PROD') || secret_key.startsWith('cfsk_ma_prod_')) {
      environment = 'PRODUCTION';
    }

    const enabled = typeof body.enabled === 'boolean' ? body.enabled : true;
    const api_version = body.api_version || '2023-08-01';
    const siteBase = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.creatormint.shop').replace(/\/+$/, '');
    const return_url = String(body.return_url || `${siteBase}/api/payment/cashfree/return`).trim();

    const payload = {
      app_id,
      secret_key,
      cashfree_app_id: app_id,
      cashfree_secret_key: secret_key,
      merchant_key: app_id,
      merchant_salt: secret_key,
      environment,
      enabled,
      api_version,
      return_url,
      updated_at: new Date().toISOString(),
    };

    if (db) {
      // 1. Primary write to store_settings/general (universally allowed by live Firestore rules)
      try {
        await setDoc(doc(db, 'store_settings', 'general'), payload, { merge: true });
      } catch (genErr: any) {
        console.error('Firestore write error on store_settings/general:', genErr);
        return NextResponse.json(
          {
            success: false,
            error: `Database persistence error: ${genErr.message || 'Permission denied'}`,
          },
          { status: 500, headers: CORS_HEADERS }
        );
      }

      // 2. Secondary write to store_settings/cashfree (isolated, non-fatal if document rules restrict)
      try {
        await setDoc(doc(db, 'store_settings', 'cashfree'), payload, { merge: true });
      } catch (cfErr: any) {
        console.warn('Non-fatal store_settings/cashfree secondary sync skipped:', cfErr.message);
      }
    }

    clearCashfreeCredentialsCache();

    return NextResponse.json(
      {
        success: true,
        message: 'Cashfree credentials saved and synchronized to Cloud Database successfully.',
        config: {
          app_id,
          secret_key,
          environment,
          enabled,
          api_version,
          return_url,
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
