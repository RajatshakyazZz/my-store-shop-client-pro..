import crypto from 'crypto';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export interface CashfreeCredentials {
  appId: string;
  secretKey: string;
  environment: 'PRODUCTION' | 'SANDBOX';
  apiVersion: string;
  returnUrl: string;
  enabled: boolean;
}

export interface CreateCashfreeOrderParams {
  orderId: string;
  orderAmount: number;
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  returnUrl?: string;
  orderNote?: string;
}

export interface CashfreeOrderResponse {
  cf_order_id?: string;
  order_id: string;
  order_status: string;
  payment_session_id: string;
  order_amount: number;
  order_currency: string;
  environment: 'PRODUCTION' | 'SANDBOX';
}

let cachedCashfreeCreds: CashfreeCredentials | null = null;
let cashfreeCredsCachedAt = 0;
const CASHFREE_CREDS_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Retrieve Cashfree credentials from Environment Variables or Firestore (Cached in-memory)
 */
export async function getCashfreeCredentials(forceRefresh = false): Promise<CashfreeCredentials> {
  if (!forceRefresh && cachedCashfreeCreds && Date.now() - cashfreeCredsCachedAt < CASHFREE_CREDS_TTL) {
    return cachedCashfreeCreds;
  }

  // Check all common environment variable naming patterns
  let appId = (
    process.env.CASHFREE_APP_ID ||
    process.env.NEXT_PUBLIC_CASHFREE_APP_ID ||
    process.env.CASHFREE_CLIENT_ID ||
    process.env.NEXT_PUBLIC_CASHFREE_CLIENT_ID ||
    process.env.CASHFREE_API_KEY ||
    process.env.NEXT_PUBLIC_CASHFREE_API_KEY ||
    process.env.CF_APP_ID ||
    process.env.CF_CLIENT_ID ||
    ''
  ).trim();

  let secretKey = (
    process.env.CASHFREE_SECRET_KEY ||
    process.env.NEXT_PUBLIC_CASHFREE_SECRET_KEY ||
    process.env.CASHFREE_CLIENT_SECRET ||
    process.env.NEXT_PUBLIC_CASHFREE_CLIENT_SECRET ||
    process.env.CASHFREE_API_SECRET ||
    process.env.NEXT_PUBLIC_CASHFREE_API_SECRET ||
    process.env.CF_SECRET_KEY ||
    process.env.CF_CLIENT_SECRET ||
    ''
  ).trim();

  const envVar = (
    process.env.CASHFREE_ENV ||
    process.env.NEXT_PUBLIC_CASHFREE_ENV ||
    ''
  ).toUpperCase().trim();

  let environment: 'PRODUCTION' | 'SANDBOX' = 'PRODUCTION';
  if (envVar === 'SANDBOX' || envVar === 'TEST') {
    environment = 'SANDBOX';
  } else if (envVar === 'PRODUCTION' || envVar === 'PROD' || envVar === 'LIVE') {
    environment = 'PRODUCTION';
  }

  let apiVersion = process.env.CASHFREE_API_VERSION || '2023-08-01';
  const siteBase = (process.env.NEXT_PUBLIC_SITE_URL || 'https://vaultworld.shop').replace(/\/+$/, '');
  let returnUrl = (
    process.env.CASHFREE_RETURN_URL ||
    process.env.NEXT_PUBLIC_CASHFREE_RETURN_URL ||
    `${siteBase}/api/payment/cashfree/return`
  ).replace('store.vaultzet.shop', 'vaultworld.shop').replace('vaultzet.shop', 'vaultworld.shop').trim();
  let enabled = true;

  // If not configured in environment variables, read from Firestore store_settings/cashfree
  if ((!appId || !secretKey) && db) {
    try {
      const snap = await getDoc(doc(db, 'store_settings', 'cashfree'));
      if (snap.exists()) {
        const data = snap.data();
        if (data.app_id || data.appId) {
          appId = (data.app_id || data.appId).trim();
        }
        if (data.secret_key || data.secretKey) {
          secretKey = (data.secret_key || data.secretKey).trim();
        }
        if (data.environment) {
          environment = data.environment === 'SANDBOX' ? 'SANDBOX' : 'PRODUCTION';
        }
        if (data.api_version) apiVersion = data.api_version;
        if (data.return_url) {
          returnUrl = data.return_url.replace('store.vaultzet.shop', 'vaultzet.shop').trim();
        }
        if (typeof data.enabled === 'boolean') enabled = data.enabled;
      }
    } catch (err) {
      console.warn('Failed to load Cashfree credentials from Firestore:', err);
    }
  }

  // Final sanitation to ensure return URL always points to https://vaultzet.shop
  returnUrl = returnUrl.replace('store.vaultzet.shop', 'vaultzet.shop').trim();

  // Intelligent auto-detection of environment from key prefix
  if (appId.startsWith('TEST') || secretKey.startsWith('cfsk_ma_test_')) {
    environment = 'SANDBOX';
  } else if (appId.startsWith('PROD') || secretKey.startsWith('cfsk_ma_prod_')) {
    environment = 'PRODUCTION';
  }

  const result: CashfreeCredentials = {
    appId,
    secretKey,
    environment,
    apiVersion,
    returnUrl,
    enabled,
  };

  cachedCashfreeCreds = result;
  cashfreeCredsCachedAt = Date.now();
  return result;
}

/**
 * Create Cashfree Order via official PG Orders API v2023-08-01
 */
export async function createCashfreePgOrder(
  params: CreateCashfreeOrderParams
): Promise<CashfreeOrderResponse> {
  const creds = await getCashfreeCredentials();

  if (!creds.appId || !creds.secretKey) {
    throw new Error(
      'Cashfree App ID or Secret Key is not configured in Storefront (vaultzet.shop). If you set them in Vercel, please ensure they are added to the Storefront project (CASHFREE_APP_ID & CASHFREE_SECRET_KEY) and then click "Redeploy".'
    );
  }

  const baseUrl = creds.environment === 'SANDBOX'
    ? 'https://sandbox.cashfree.com/pg/orders'
    : 'https://api.cashfree.com/pg/orders';

  // Format and sanitize order ID: alphanumeric, underscore, hyphen only (max 50 chars)
  const cleanOrderId = params.orderId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 45);

  // Clean phone number (extract digits, ensure at least 10 digits for Indian standard)
  const digitsOnly = params.customer.phone.replace(/\D/g, '');
  const cleanPhone = digitsOnly.length >= 10 ? digitsOnly.slice(-10) : '9999999999';

  // Clean customer ID
  const cleanCustomerId = `cust_${params.customer.email.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}`;

  const defaultReturnUrl = `${(process.env.NEXT_PUBLIC_SITE_URL || 'https://vaultworld.shop').replace(/\/+$/, '')}/api/payment/cashfree/return`;
  const rawReturnUrl = (params.returnUrl || creds.returnUrl || defaultReturnUrl)
    .replace('store.vaultzet.shop', 'vaultworld.shop')
    .replace('vaultzet.shop', 'vaultworld.shop');
  const finalReturnUrl = rawReturnUrl.includes('{order_id}')
    ? rawReturnUrl
    : `${rawReturnUrl}${rawReturnUrl.includes('?') ? '&' : '?'}order_id={order_id}`;

  const payload = {
    order_id: cleanOrderId,
    order_amount: Number(params.orderAmount.toFixed(2)),
    order_currency: 'INR',
    customer_details: {
      customer_id: cleanCustomerId,
      customer_name: params.customer.fullName.trim() || 'Valued Customer',
      customer_email: params.customer.email.trim().toLowerCase(),
      customer_phone: cleanPhone,
    },
    order_meta: {
      return_url: finalReturnUrl,
    },
    order_note: params.orderNote || 'Ztore Digital Digital Assets Bundle',
  };

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'x-client-id': creds.appId,
      'x-client-secret': creds.secretKey,
      'x-api-version': creds.apiVersion || '2023-08-01',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  const responseData = await response.json();

  if (!response.ok || !responseData.payment_session_id) {
    const errorMsg = responseData.message || responseData.error_description || JSON.stringify(responseData);
    throw new Error(`Cashfree Order Creation Failed: ${errorMsg}`);
  }

  return {
    cf_order_id: responseData.cf_order_id,
    order_id: responseData.order_id,
    order_status: responseData.order_status,
    payment_session_id: responseData.payment_session_id,
    order_amount: responseData.order_amount,
    order_currency: responseData.order_currency,
    environment: creds.environment,
  };
}

/**
 * Verify Cashfree Order Status via official PG Orders API
 */
export async function verifyCashfreePgOrder(orderId: string): Promise<{
  paid: boolean;
  order_status: string;
  order_amount: number;
  transaction_id?: string;
  payment_method?: string;
  data: any;
}> {
  const creds = await getCashfreeCredentials();

  if (!creds.appId || !creds.secretKey) {
    throw new Error('Cashfree App ID or Secret Key missing.');
  }

  const baseUrl = creds.environment === 'SANDBOX'
    ? `https://sandbox.cashfree.com/pg/orders/${orderId}`
    : `https://api.cashfree.com/pg/orders/${orderId}`;

  const response = await fetch(baseUrl, {
    method: 'GET',
    headers: {
      'x-client-id': creds.appId,
      'x-client-secret': creds.secretKey,
      'x-api-version': creds.apiVersion || '2023-08-01',
      'Accept': 'application/json',
    },
    cache: 'no-store',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to verify Cashfree order');
  }

  const isPaid = data.order_status === 'PAID';

  return {
    paid: isPaid,
    order_status: data.order_status,
    order_amount: data.order_amount,
    data,
  };
}

/**
 * Fetch payments for an order via official PG API /pg/orders/{order_id}/payments
 */
export async function getCashfreePgPayments(orderId: string): Promise<any[]> {
  const creds = await getCashfreeCredentials();

  if (!creds.appId || !creds.secretKey) {
    throw new Error('Cashfree App ID or Secret Key missing.');
  }

  const baseUrl = creds.environment === 'SANDBOX'
    ? `https://sandbox.cashfree.com/pg/orders/${orderId}/payments`
    : `https://api.cashfree.com/pg/orders/${orderId}/payments`;

  const response = await fetch(baseUrl, {
    method: 'GET',
    headers: {
      'x-client-id': creds.appId,
      'x-client-secret': creds.secretKey,
      'x-api-version': creds.apiVersion || '2023-08-01',
      'Accept': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

/**
 * Verifies official Cashfree webhook signature using HMAC-SHA256.
 */
export function verifyCashfreeWebhookSignature(
  rawBody: string,
  signature: string,
  timestamp: string,
  secretKey: string = process.env.CASHFREE_SECRET_KEY || ''
): boolean {
  if (!signature || !timestamp || !secretKey) return false;
  try {
    const payload = `${timestamp}${rawBody}`;
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(payload)
      .digest('base64');
    return crypto.timingSafeEqual(
      Buffer.from(signature.trim()),
      Buffer.from(expectedSignature.trim())
    );
  } catch {
    return false;
  }
}

