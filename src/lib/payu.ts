import crypto from 'crypto';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export interface PayUCredentials {
  merchantKey: string;
  merchantSalt: string;
  environment: 'PRODUCTION' | 'TEST';
  returnUrl: string;
  enabled: boolean;
}

export interface CreatePayUOrderParams {
  orderId: string;
  orderAmount: number;
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  productInfo?: string;
  returnUrl?: string;
  udf1?: string; // orderNumber / ID
  udf2?: string; // token
  udf3?: string; // resellerSlug
  udf4?: string; // couponCode
  udf5?: string; // extra metadata
}

export interface PayUCheckoutPayload {
  action: string;
  environment: 'PRODUCTION' | 'TEST';
  params: {
    key: string;
    txnid: string;
    amount: string;
    productinfo: string;
    firstname: string;
    email: string;
    phone: string;
    surl: string;
    furl: string;
    hash: string;
    service_provider: string;
    udf1: string;
    udf2: string;
    udf3: string;
    udf4: string;
    udf5: string;
  };
}

let cachedPayUCreds: PayUCredentials | null = null;
let payuCredsCachedAt = 0;
const PAYU_CREDS_TTL = 30 * 1000; // 30 seconds cache (refreshes quickly when admin updates keys)

export function clearPayUCredentialsCache(): void {
  cachedPayUCreds = null;
  payuCredsCachedAt = 0;
}

/**
 * Retrieve PayU credentials primarily from Cloud Database (Firestore store_settings/general & payu)
 * with environment variable fallback.
 */
export async function getPayUCredentials(forceRefresh = false): Promise<PayUCredentials> {
  if (!forceRefresh && cachedPayUCreds && cachedPayUCreds.merchantKey && Date.now() - payuCredsCachedAt < PAYU_CREDS_TTL) {
    return cachedPayUCreds;
  }

  let merchantKey = '';
  let merchantSalt = '';
  let environment: 'PRODUCTION' | 'TEST' = 'PRODUCTION';
  const siteBase = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vaultworld.shop').replace(/\/+$/, '');
  let returnUrl = `${siteBase}/api/payment/payu/return`;
  let enabled = true;

  // 1. Primary Source: Cloud Firestore Database (store_settings/general, store_settings/payu, store_settings/cashfree)
  if (db) {
    try {
      const [generalSnap, payuSnap, cfSnap] = await Promise.all([
        getDoc(doc(db, 'store_settings', 'general')).catch(() => null),
        getDoc(doc(db, 'store_settings', 'payu')).catch(() => null),
        getDoc(doc(db, 'store_settings', 'cashfree')).catch(() => null),
      ]);

      // Check general doc first (universally allowed by all Firestore rules)
      if (generalSnap && generalSnap.exists()) {
        const data = generalSnap.data();
        if (data.merchant_key) merchantKey = String(data.merchant_key).trim();
        if (data.merchant_salt) merchantSalt = String(data.merchant_salt).trim();
        if (!merchantKey && data.app_id && !data.app_id.startsWith('CF')) merchantKey = String(data.app_id).trim();
        if (!merchantSalt && data.secret_key && !data.secret_key.startsWith('cfsk_')) merchantSalt = String(data.secret_key).trim();
        if (data.environment) {
          environment = data.environment === 'TEST' || data.environment === 'SANDBOX' ? 'TEST' : 'PRODUCTION';
        }
        if (typeof data.enabled === 'boolean') enabled = data.enabled;
        if (data.return_url) returnUrl = String(data.return_url).trim();
      }

      // Check payu doc if keys still not found
      if (payuSnap && payuSnap.exists()) {
        const data = payuSnap.data();
        if (!merchantKey && data.merchant_key) merchantKey = String(data.merchant_key).trim();
        if (!merchantSalt && data.merchant_salt) merchantSalt = String(data.merchant_salt).trim();
        if (!merchantKey && data.app_id && !data.app_id.startsWith('CF')) merchantKey = String(data.app_id).trim();
        if (!merchantSalt && data.secret_key && !data.secret_key.startsWith('cfsk_')) merchantSalt = String(data.secret_key).trim();
        if (data.environment && (!generalSnap || !generalSnap.data()?.environment)) {
          environment = data.environment === 'TEST' || data.environment === 'SANDBOX' ? 'TEST' : 'PRODUCTION';
        }
        if (typeof data.enabled === 'boolean' && (!generalSnap || typeof generalSnap.data()?.enabled !== 'boolean')) {
          enabled = data.enabled;
        }
        if (data.return_url && (!generalSnap || !generalSnap.data()?.return_url)) {
          returnUrl = String(data.return_url).trim();
        }
      }

      // Check cashfree doc if keys still not found
      if (cfSnap && cfSnap.exists()) {
        const cfData = cfSnap.data();
        if (!merchantKey && cfData.merchant_key) merchantKey = String(cfData.merchant_key).trim();
        if (!merchantSalt && cfData.merchant_salt) merchantSalt = String(cfData.merchant_salt).trim();
        if (!merchantKey && cfData.app_id && !cfData.app_id.startsWith('CF')) {
          merchantKey = String(cfData.app_id).trim();
        }
        if (!merchantSalt && cfData.secret_key && !cfData.secret_key.startsWith('cfsk_')) {
          merchantSalt = String(cfData.secret_key).trim();
        }
      }
    } catch (err) {
      console.warn('[PayU] Failed to load PayU credentials from Firestore:', err);
    }
  }

  // 2. Secondary Fallback: Environment Variables (if database does not have them)
  if (!merchantKey) {
    merchantKey = (
      process.env.PAYU_MERCHANT_KEY ||
      process.env.PAYU_KEY ||
      process.env.NEXT_PUBLIC_PAYU_MERCHANT_KEY ||
      process.env.NEXT_PUBLIC_PAYU_KEY ||
      ''
    ).trim();
  }

  if (!merchantSalt) {
    merchantSalt = (
      process.env.PAYU_MERCHANT_SALT ||
      process.env.PAYU_SALT ||
      process.env.NEXT_PUBLIC_PAYU_MERCHANT_SALT ||
      process.env.NEXT_PUBLIC_PAYU_SALT ||
      ''
    ).trim();
  }

  if (!merchantKey && !merchantSalt) {
    const envVar = (
      process.env.PAYU_ENV ||
      process.env.NEXT_PUBLIC_PAYU_ENV ||
      ''
    ).toUpperCase().trim();

    if (envVar === 'TEST' || envVar === 'SANDBOX') {
      environment = 'TEST';
    }
  }

  const result: PayUCredentials = {
    merchantKey,
    merchantSalt,
    environment,
    returnUrl,
    enabled,
  };

  cachedPayUCreds = result;
  payuCredsCachedAt = Date.now();
  return result;
}

/**
 * Generate PayU Payment Request Payload with SHA-512 Hash
 */
export async function createPayUPaymentPayload(
  params: CreatePayUOrderParams
): Promise<PayUCheckoutPayload> {
  const creds = await getPayUCredentials();

  if (!creds.merchantKey || !creds.merchantSalt) {
    throw new Error(
      'PayU Merchant Key or Salt is not configured. Please add your PayU Merchant Key and Salt in the Admin Portal (Settings & Integrations > PayU Gateway) or in Vercel environment variables (PAYU_MERCHANT_KEY & PAYU_MERCHANT_SALT).'
    );
  }

  if (!creds.enabled) {
    throw new Error('PayU Payment Gateway is currently disabled in store settings.');
  }

  const txnid = String(params.orderId).trim();
  const amount = Number(params.orderAmount).toFixed(2);
  const cleanFirstName = (params.customer.fullName || 'Customer')
    .trim()
    .slice(0, 50)
    .replace(/[^a-zA-Z0-9\s]/g, '') || 'Customer';
  const cleanEmail = (params.customer.email || 'customer@gmail.com').trim().toLowerCase().slice(0, 80);
  const cleanPhone = (params.customer.phone || '9999999999').replace(/\D/g, '').slice(-10);
  const cleanProductInfo = (params.productInfo || 'Ztore Digital Digital Bundle')
    .trim()
    .slice(0, 100)
    .replace(/[^a-zA-Z0-9\s_-]/g, ' ') || 'Digital Bundle';

  const surl = params.returnUrl || creds.returnUrl;
  const furl = params.returnUrl || creds.returnUrl;

  const udf1 = String(params.udf1 || params.orderId || '').trim();
  const udf2 = String(params.udf2 || '').trim();
  const udf3 = String(params.udf3 || '').trim();
  const udf4 = String(params.udf4 || '').trim();
  const udf5 = String(params.udf5 || '').trim();

  // PayU Mandatory Request Hash Sequence:
  // sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)
  const hashSequence = `${creds.merchantKey}|${txnid}|${amount}|${cleanProductInfo}|${cleanFirstName}|${cleanEmail}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${creds.merchantSalt}`;
  const hash = crypto.createHash('sha512').update(hashSequence).digest('hex').toLowerCase();

  const endpoint = creds.environment === 'TEST'
    ? 'https://test.payu.in/_payment'
    : 'https://secure.payu.in/_payment';

  return {
    action: endpoint,
    environment: creds.environment,
    params: {
      key: creds.merchantKey,
      txnid,
      amount,
      productinfo: cleanProductInfo,
      firstname: cleanFirstName,
      email: cleanEmail,
      phone: cleanPhone,
      surl,
      furl,
      hash,
      service_provider: 'payu_paisa',
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
    },
  };
}

/**
 * Verify PayU Response SHA-512 Hash
 * PayU Reverse Hash Sequence:
 * If additionalCharges present:
 * sha512(additionalCharges|SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 * Else:
 * sha512(SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 */
export async function verifyPayUResponseHash(data: Record<string, any>): Promise<{
  isValid: boolean;
  paid: boolean;
  calculatedHash: string;
  receivedHash: string;
}> {
  const creds = await getPayUCredentials();

  const key = String(data.key || creds.merchantKey || '').trim();
  const txnid = String(data.txnid || '').trim();
  const amount = String(data.amount || '').trim();
  const productinfo = String(data.productinfo || '').trim();
  const firstname = String(data.firstname || '').trim();
  const email = String(data.email || '').trim();
  const status = String(data.status || '').trim();
  const receivedHash = String(data.hash || '').trim().toLowerCase();
  const additionalCharges = data.additionalCharges ? String(data.additionalCharges).trim() : '';

  const udf1 = String(data.udf1 || '').trim();
  const udf2 = String(data.udf2 || '').trim();
  const udf3 = String(data.udf3 || '').trim();
  const udf4 = String(data.udf4 || '').trim();
  const udf5 = String(data.udf5 || '').trim();

  let hashSequence = '';
  if (additionalCharges) {
    hashSequence = `${additionalCharges}|${creds.merchantSalt}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  } else {
    hashSequence = `${creds.merchantSalt}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  }

  const calculatedHash = crypto.createHash('sha512').update(hashSequence).digest('hex').toLowerCase();
  const isValid = calculatedHash === receivedHash;
  const paid = isValid && status.toLowerCase() === 'success';

  return {
    isValid,
    paid,
    calculatedHash,
    receivedHash,
  };
}
