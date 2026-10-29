import crypto from 'crypto';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export interface RazorpayCredentials {
  keyId: string;
  keySecret: string;
  environment: 'PRODUCTION' | 'TEST';
  enabled: boolean;
}

export interface CreateRazorpayOrderParams {
  orderId: string;
  orderAmount: number; // in INR
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  productInfo?: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResult {
  id: string;
  amount: number; // in paise
  currency: string;
  receipt: string;
  status: string;
}

let cachedRazorpayCreds: RazorpayCredentials | null = null;
let razorpayCredsCachedAt = 0;
const RAZORPAY_CREDS_TTL = 30 * 1000; // 30 seconds cache (refreshes quickly when admin updates keys)

export function clearRazorpayCredentialsCache(): void {
  cachedRazorpayCreds = null;
  razorpayCredsCachedAt = 0;
}

/**
 * Retrieve Razorpay credentials primarily from Cloud Database (Firestore store_settings/general & razorpay)
 * with environment variable fallback.
 */
export async function getRazorpayCredentials(forceRefresh = false): Promise<RazorpayCredentials> {
  if (
    !forceRefresh &&
    cachedRazorpayCreds &&
    cachedRazorpayCreds.keyId &&
    Date.now() - razorpayCredsCachedAt < RAZORPAY_CREDS_TTL
  ) {
    return cachedRazorpayCreds;
  }

  let keyId = '';
  let keySecret = '';
  let environment: 'PRODUCTION' | 'TEST' = 'PRODUCTION';
  let enabled = true;

  // 1. Primary Source: Cloud Firestore Database (store_settings/general, store_settings/razorpay)
  if (db) {
    try {
      const [generalSnap, rzpSnap, payuSnap] = await Promise.all([
        getDoc(doc(db, 'store_settings', 'general')).catch(() => null),
        getDoc(doc(db, 'store_settings', 'razorpay')).catch(() => null),
        getDoc(doc(db, 'store_settings', 'payu')).catch(() => null),
      ]);

      // Check general doc first (universally allowed by live Firestore rules)
      if (generalSnap && generalSnap.exists()) {
        const data = generalSnap.data();
        if (data.razorpay_key_id) keyId = String(data.razorpay_key_id).trim();
        else if (data.key_id) keyId = String(data.key_id).trim();
        else if (data.merchant_key && String(data.merchant_key).startsWith('rzp_')) keyId = String(data.merchant_key).trim();
        else if (data.app_id && String(data.app_id).startsWith('rzp_')) keyId = String(data.app_id).trim();

        if (data.razorpay_key_secret) keySecret = String(data.razorpay_key_secret).trim();
        else if (data.key_secret) keySecret = String(data.key_secret).trim();
        else if (data.merchant_salt && !keySecret && keyId) keySecret = String(data.merchant_salt).trim();
        else if (data.secret_key && !keySecret && keyId) keySecret = String(data.secret_key).trim();

        if (data.environment) {
          environment = data.environment === 'TEST' || data.environment === 'SANDBOX' ? 'TEST' : 'PRODUCTION';
        }
        if (typeof data.enabled === 'boolean') enabled = data.enabled;
      }

      // Check razorpay doc if keys not in general
      if ((!keyId || !keySecret) && rzpSnap && rzpSnap.exists()) {
        const data = rzpSnap.data();
        if (!keyId && data.key_id) keyId = String(data.key_id).trim();
        if (!keyId && data.razorpay_key_id) keyId = String(data.razorpay_key_id).trim();
        if (!keyId && data.merchant_key) keyId = String(data.merchant_key).trim();

        if (!keySecret && data.key_secret) keySecret = String(data.key_secret).trim();
        if (!keySecret && data.razorpay_key_secret) keySecret = String(data.razorpay_key_secret).trim();
        if (!keySecret && data.merchant_salt) keySecret = String(data.merchant_salt).trim();

        if (data.environment) {
          environment = data.environment === 'TEST' || data.environment === 'SANDBOX' ? 'TEST' : 'PRODUCTION';
        }
        if (typeof data.enabled === 'boolean') enabled = data.enabled;
      }

      // Check legacy doc fallback if it starts with rzp_
      if ((!keyId || !keySecret) && payuSnap && payuSnap.exists()) {
        const data = payuSnap.data();
        if (!keyId && (data.key_id || (data.merchant_key && String(data.merchant_key).startsWith('rzp_')))) {
          keyId = String(data.key_id || data.merchant_key).trim();
        }
        if (!keySecret && (data.key_secret || data.merchant_salt)) {
          keySecret = String(data.key_secret || data.merchant_salt).trim();
        }
      }
    } catch (err) {
      console.warn('[Razorpay] Failed to load credentials from Firestore:', err);
    }
  }

  // 2. Secondary Fallback: Environment Variables
  if (!keyId) {
    keyId = (
      process.env.RAZORPAY_KEY_ID ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      process.env.RAZORPAY_KEY ||
      ''
    ).trim();
  }

  if (!keySecret) {
    keySecret = (
      process.env.RAZORPAY_KEY_SECRET ||
      process.env.RAZORPAY_SECRET ||
      ''
    ).trim();
  }

  if (keyId.startsWith('rzp_test_')) {
    environment = 'TEST';
  } else if (keyId.startsWith('rzp_live_')) {
    environment = 'PRODUCTION';
  }

  const result: RazorpayCredentials = {
    keyId,
    keySecret,
    environment,
    enabled,
  };

  cachedRazorpayCreds = result;
  razorpayCredsCachedAt = Date.now();
  return result;
}

/**
 * Create a new Razorpay Order on Razorpay's API
 */
export async function createRazorpayOrder(
  params: CreateRazorpayOrderParams
): Promise<{ order: RazorpayOrderResult; creds: RazorpayCredentials }> {
  const creds = await getRazorpayCredentials();

  if (!creds.keyId || !creds.keySecret) {
    throw new Error(
      'Razorpay Key ID or Key Secret is not configured. Please add your Razorpay Key ID and Secret in the Admin Panel (Settings & Integrations > Razorpay Gateway).'
    );
  }

  if (!creds.enabled) {
    throw new Error('Razorpay Payment Gateway is currently disabled in store settings.');
  }

  const amountInPaise = Math.round(params.orderAmount * 100);

  const authHeader = 'Basic ' + Buffer.from(`${creds.keyId}:${creds.keySecret}`).toString('base64');

  const notes: Record<string, string> = {
    order_id: params.orderId,
    customer_email: params.customer.email,
    customer_phone: params.customer.phone,
    customer_name: params.customer.fullName,
    ...(params.notes || {}),
  };

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: 'INR',
      receipt: String(params.orderId).slice(0, 40),
      notes,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.id) {
    console.error('[Razorpay] Order creation failed:', data);
    throw new Error(
      data?.error?.description ||
      data?.message ||
      'Failed to create Razorpay order. Please check Razorpay Key ID & Secret.'
    );
  }

  return {
    order: {
      id: data.id,
      amount: data.amount,
      currency: data.currency,
      receipt: data.receipt,
      status: data.status,
    },
    creds,
  };
}

/**
 * Verify Razorpay payment signature
 * Razorpay generates signature as: HMAC-SHA256(order_id + "|" + payment_id, secret)
 */
export function verifyRazorpaySignature(params: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  keySecret: string;
}): boolean {
  if (!params.razorpayOrderId || !params.razorpayPaymentId || !params.razorpaySignature || !params.keySecret) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', params.keySecret)
    .update(`${params.razorpayOrderId}|${params.razorpayPaymentId}`)
    .digest('hex');

  return expectedSignature === params.razorpaySignature;
}

/**
 * Test Razorpay credentials by making a lightweight API call
 */
export async function testRazorpayCredentials(
  keyId: string,
  keySecret: string
): Promise<{ success: boolean; message: string }> {
  try {
    const authHeader = 'Basic ' + Buffer.from(`${keyId.trim()}:${keySecret.trim()}`).toString('base64');
    const res = await fetch('https://api.razorpay.com/v1/payments?count=1', {
      method: 'GET',
      headers: {
        Authorization: authHeader,
      },
    });

    if (res.ok) {
      return {
        success: true,
        message: 'Razorpay API credentials verified successfully! Live and ready for checkout.',
      };
    }

    const data = await res.json().catch(() => ({}));
    return {
      success: false,
      message: data?.error?.description || 'Invalid Razorpay Key ID or Key Secret.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Could not connect to Razorpay API.',
    };
  }
}
