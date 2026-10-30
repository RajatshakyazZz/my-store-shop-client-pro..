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
  orderAmount: number; // in INR rupees
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  productInfo?: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResponse {
  id: string; // razorpay order id (e.g. order_EKwxwAgItmmXdp)
  entity: string;
  amount: number; // in paise
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  created_at: number;
}

let cachedRazorpayCreds: RazorpayCredentials | null = null;
let razorpayCredsCachedAt = 0;
const RAZORPAY_CREDS_TTL = 30 * 1000; // 30 seconds cache

export function clearRazorpayCredentialsCache(): void {
  cachedRazorpayCreds = null;
  razorpayCredsCachedAt = 0;
}

/**
 * Retrieve Razorpay credentials primarily from Cloud Firestore Database (store_settings/general & razorpay)
 * with environment variable fallback.
 */
export async function getRazorpayCredentials(forceRefresh = false): Promise<RazorpayCredentials> {
  if (!forceRefresh && cachedRazorpayCreds && cachedRazorpayCreds.keyId && Date.now() - razorpayCredsCachedAt < RAZORPAY_CREDS_TTL) {
    return cachedRazorpayCreds;
  }

  let keyId = '';
  let keySecret = '';
  let environment: 'PRODUCTION' | 'TEST' = 'PRODUCTION';
  let enabled = true;

  // 1. Primary Source: Cloud Firestore Database (store_settings/general, store_settings/razorpay)
  if (db) {
    try {
      const [generalSnap, razorpaySnap, payuSnap] = await Promise.all([
        getDoc(doc(db, 'store_settings', 'general')).catch(() => null),
        getDoc(doc(db, 'store_settings', 'razorpay')).catch(() => null),
        getDoc(doc(db, 'store_settings', 'payu')).catch(() => null),
      ]);

      // Check general doc first (universally allowed by all Firestore rules)
      if (generalSnap && generalSnap.exists()) {
        const data = generalSnap.data();
        if (data.razorpay_key_id) keyId = String(data.razorpay_key_id).trim();
        if (data.razorpay_key_secret) keySecret = String(data.razorpay_key_secret).trim();
        // Also support generic field names if saved under razorpay profile
        if (!keyId && data.key_id && String(data.key_id).startsWith('rzp_')) keyId = String(data.key_id).trim();
        if (!keySecret && data.key_secret && data.key_id && String(data.key_id).startsWith('rzp_')) keySecret = String(data.key_secret).trim();
        if (data.environment) {
          environment = data.environment === 'TEST' || data.environment === 'SANDBOX' ? 'TEST' : 'PRODUCTION';
        }
        if (typeof data.enabled === 'boolean') enabled = data.enabled;
      }

      // Check razorpay doc
      if (razorpaySnap && razorpaySnap.exists()) {
        const data = razorpaySnap.data();
        if (!keyId && data.key_id) keyId = String(data.key_id).trim();
        if (!keyId && data.razorpay_key_id) keyId = String(data.razorpay_key_id).trim();
        if (!keySecret && data.key_secret) keySecret = String(data.key_secret).trim();
        if (!keySecret && data.razorpay_key_secret) keySecret = String(data.razorpay_key_secret).trim();
        if (data.environment && (!generalSnap || !generalSnap.data()?.environment)) {
          environment = data.environment === 'TEST' || data.environment === 'SANDBOX' ? 'TEST' : 'PRODUCTION';
        }
        if (typeof data.enabled === 'boolean' && (!generalSnap || typeof generalSnap.data()?.enabled !== 'boolean')) {
          enabled = data.enabled;
        }
      }

      // Check payu doc if keys were stored there as fallback
      if ((!keyId || !keySecret) && payuSnap && payuSnap.exists()) {
        const data = payuSnap.data();
        if (!keyId && data.razorpay_key_id) keyId = String(data.razorpay_key_id).trim();
        if (!keySecret && data.razorpay_key_secret) keySecret = String(data.razorpay_key_secret).trim();
      }
    } catch (err) {
      console.warn('[Razorpay Creds] Database read warning:', err);
    }
  }

  // 2. Fallback: Environment Variables (.env.local / Vercel Environment Variables)
  if (!keyId) {
    keyId = String(
      process.env.RAZORPAY_KEY_ID ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      ''
    ).trim();
  }

  if (!keySecret) {
    keySecret = String(
      process.env.RAZORPAY_KEY_SECRET ||
      process.env.RAZORPAY_SECRET_KEY ||
      ''
    ).trim();
  }

  // Detect test vs production from key prefix if applicable
  if (keyId.startsWith('rzp_test_')) {
    environment = 'TEST';
  } else if (keyId.startsWith('rzp_live_')) {
    environment = 'PRODUCTION';
  }

  cachedRazorpayCreds = {
    keyId,
    keySecret,
    environment,
    enabled,
  };
  razorpayCredsCachedAt = Date.now();

  return cachedRazorpayCreds;
}

/**
 * Creates an order directly via the official Razorpay REST API
 * POST https://api.razorpay.com/v1/orders
 */
export async function createRazorpayOrder(params: CreateRazorpayOrderParams): Promise<{
  order: RazorpayOrderResponse;
  keyId: string;
}> {
  const creds = await getRazorpayCredentials();

  if (!creds.keyId || !creds.keySecret) {
    throw new Error(
      'Razorpay credentials are not configured! Please enter your Razorpay Key ID and Key Secret in the Admin Portal (Settings > Integrations > Razorpay Gateway).'
    );
  }

  if (!creds.enabled) {
    throw new Error('Razorpay payment gateway is currently disabled in the Admin Portal.');
  }

  // Razorpay requires amount in paise (1 INR = 100 paise)
  const amountInPaise = Math.round(Number(params.orderAmount) * 100);

  if (amountInPaise < 100) {
    throw new Error('Minimum order amount on Razorpay is ₹1.00 (100 paise).');
  }

  const receipt = String(params.orderId).slice(0, 40); // max 40 chars for receipt
  const authHeader = `Basic ${Buffer.from(`${creds.keyId}:${creds.keySecret}`).toString('base64')}`;

  const payload = {
    amount: amountInPaise,
    currency: 'INR',
    receipt,
    notes: {
      order_id: params.orderId,
      customer_name: params.customer.fullName,
      customer_email: params.customer.email,
      customer_phone: params.customer.phone,
      product_info: (params.productInfo || 'Ztore Digital Reels Bundle').slice(0, 100),
      ...(params.notes || {}),
    },
  };

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
    body: JSON.stringify(payload),
  });

  const responseData = await response.json();

  if (!response.ok) {
    console.error('[Razorpay Order Creation Failed]', responseData);
    const errMsg = responseData.error?.description || responseData.error?.message || 'Failed to create Razorpay order';
    throw new Error(`Razorpay Error: ${errMsg}`);
  }

  return {
    order: responseData as RazorpayOrderResponse,
    keyId: creds.keyId,
  };
}

/**
 * Validates Razorpay Payment Signature using HMAC-SHA256
 * Signature = HMAC_SHA256(order_id + "|" + payment_id, secret)
 */
export function verifyRazorpaySignature(params: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  keySecret?: string;
}): boolean {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, keySecret } = params;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return false;
  }

  const secretToUse = keySecret || cachedRazorpayCreds?.keySecret;
  if (!secretToUse) {
    console.error('[Razorpay Verification] Key secret is missing for signature check');
    return false;
  }

  const generatedSignature = crypto
    .createHmac('sha256', secretToUse)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  return generatedSignature.toLowerCase() === razorpaySignature.trim().toLowerCase();
}

/**
 * Fetches verified payment details from Razorpay to verify capture status
 * GET https://api.razorpay.com/v1/payments/{payment_id}
 */
export async function getRazorpayPaymentDetails(paymentId: string): Promise<any> {
  const creds = await getRazorpayCredentials();

  if (!creds.keyId || !creds.keySecret) {
    throw new Error('Razorpay credentials missing');
  }

  const authHeader = `Basic ${Buffer.from(`${creds.keyId}:${creds.keySecret}`).toString('base64')}`;
  const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
    headers: {
      Authorization: authHeader,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch payment details from Razorpay: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetches all payments associated with a Razorpay Order
 * GET https://api.razorpay.com/v1/orders/{order_id}/payments
 */
export async function getRazorpayOrderPayments(razorpayOrderId: string): Promise<any> {
  const creds = await getRazorpayCredentials();

  if (!creds.keyId || !creds.keySecret) {
    throw new Error('Razorpay credentials missing');
  }

  const authHeader = `Basic ${Buffer.from(`${creds.keyId}:${creds.keySecret}`).toString('base64')}`;
  const response = await fetch(`https://api.razorpay.com/v1/orders/${razorpayOrderId}/payments`, {
    headers: {
      Authorization: authHeader,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch order payments from Razorpay: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetches the current status and details of a Razorpay Order
 * GET https://api.razorpay.com/v1/orders/{order_id}
 */
export async function getRazorpayOrder(razorpayOrderId: string): Promise<any> {
  const creds = await getRazorpayCredentials();

  if (!creds.keyId || !creds.keySecret) {
    throw new Error('Razorpay credentials missing');
  }

  const authHeader = `Basic ${Buffer.from(`${creds.keyId}:${creds.keySecret}`).toString('base64')}`;
  const response = await fetch(`https://api.razorpay.com/v1/orders/${razorpayOrderId}`, {
    headers: {
      Authorization: authHeader,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch order from Razorpay: ${response.statusText}`);
  }

  return response.json();
}

