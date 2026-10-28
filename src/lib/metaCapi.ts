import crypto from 'crypto';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export interface MetaUserData {
  email?: string;
  phone?: string;
  fullName?: string;
  clientIp?: string;
  clientUserAgent?: string;
  fbp?: string;
  fbc?: string;
}

export interface MetaCustomItem {
  id: string;
  title?: string;
  price?: number;
  quantity?: number;
}

export interface MetaPurchaseEventParams {
  orderId: string;
  totalAmount: number;
  currency?: string;
  items?: MetaCustomItem[];
  customer?: {
    email?: string;
    phone?: string;
    fullName?: string;
  };
  clientIp?: string;
  clientUserAgent?: string;
  fbp?: string;
  fbc?: string;
  eventSourceUrl?: string;
}

export interface MetaCapiResult {
  success: boolean;
  eventId: string;
  eventsReceived?: number;
  fbtraceId?: string;
  error?: string;
  skipped?: boolean;
}

/**
 * Standard SHA-256 hashing conforming to Meta Conversions API specifications.
 */
export function hashForMeta(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  const clean = value.trim().toLowerCase();
  if (!clean) return undefined;
  return crypto.createHash('sha256').update(clean, 'utf8').digest('hex');
}

/**
 * Normalizes and hashes phone numbers to international E.164 digits format (without '+').
 */
export function hashPhoneForMeta(phone: string | undefined | null): string | undefined {
  if (!phone) return undefined;
  let digits = phone.replace(/\D/g, '');
  if (!digits) return undefined;

  // If 10 digits (standard Indian mobile starting with 6-9), prepend country code 91
  if (digits.length === 10 && /^[6-9]/.test(digits)) {
    digits = `91${digits}`;
  }
  return crypto.createHash('sha256').update(digits, 'utf8').digest('hex');
}

/**
 * Normalizes and extracts first name for hashing.
 */
export function hashFirstNameForMeta(fullName: string | undefined | null): string | undefined {
  if (!fullName) return undefined;
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] ? parts[0].toLowerCase() : '';
  if (!firstName) return undefined;
  return crypto.createHash('sha256').update(firstName, 'utf8').digest('hex');
}

interface MetaCredentials {
  pixelId: string;
  accessToken: string;
  testEventCode?: string;
}

/**
 * Resolves Meta credentials from Environment Variables or Firestore store_settings/meta_pixel & dnp_meta.
 */
export async function getMetaCredentials(): Promise<MetaCredentials | null> {
  let pixelId = (
    process.env.META_PIXEL_ID ||
    process.env.NEXT_PUBLIC_META_PIXEL_ID ||
    ''
  ).trim();

  let accessToken = (
    process.env.META_CAPI_ACCESS_TOKEN ||
    process.env.META_ACCESS_TOKEN ||
    process.env.FACEBOOK_CONVERSIONS_API_TOKEN ||
    process.env.FB_CAPI_TOKEN ||
    ''
  ).trim();

  let testEventCode = (
    process.env.META_TEST_EVENT_CODE ||
    process.env.NEXT_PUBLIC_META_TEST_EVENT_CODE ||
    ''
  ).trim();

  // Check Firestore store_settings/meta_pixel and store_settings/dnp_meta
  if (db) {
    try {
      const [metaSnap, dnpSnap] = await Promise.all([
        getDoc(doc(db, 'store_settings', 'meta_pixel')).catch(() => null),
        getDoc(doc(db, 'store_settings', 'dnp_meta')).catch(() => null),
      ]);

      if (metaSnap && metaSnap.exists()) {
        const data = metaSnap.data();
        if (data.pixel_id) {
          pixelId = String(data.pixel_id).trim();
        }
        if (data.capi_token || data.access_token) {
          accessToken = String(data.capi_token || data.access_token).trim();
        }
        if (data.test_event_code) {
          testEventCode = String(data.test_event_code).trim();
        }
      }

      if (dnpSnap && dnpSnap.exists()) {
        const dnpData = dnpSnap.data();
        if (dnpData.meta_pixel_id || dnpData.pixel_id) {
          pixelId = String(dnpData.meta_pixel_id || dnpData.pixel_id).trim();
        }
        if (dnpData.capi_token || dnpData.access_token) {
          accessToken = String(dnpData.capi_token || dnpData.access_token).trim();
        }
        if (dnpData.test_event_code) {
          testEventCode = String(dnpData.test_event_code).trim();
        }
      }
    } catch (err) {
      console.warn('[Meta CAPI] Could not read credentials from Firestore:', err);
    }
  }

  // Fallback to default configured pixel ID if still empty
  if (!pixelId) {
    pixelId = '1715650960276913';
  }

  if (!accessToken) {
    return null;
  }

  return {
    pixelId,
    accessToken,
    testEventCode: testEventCode || undefined,
  };
}

/**
 * Sends a verified server-side Purchase event to Meta Conversions API.
 * Uses a deterministic event_id = 'purchase_' + orderId for 100% accurate deduplication with Pixel.
 */
export async function sendMetaCapiPurchase(params: MetaPurchaseEventParams): Promise<MetaCapiResult> {
  const eventId = `purchase_${params.orderId}`;

  const creds = await getMetaCredentials();
  if (!creds || !creds.accessToken) {
    console.warn(`[Meta CAPI] Skipped CAPI for order ${params.orderId}: META_CAPI_ACCESS_TOKEN is not yet configured.`);
    return {
      success: false,
      eventId,
      skipped: true,
      error: 'META_CAPI_ACCESS_TOKEN_MISSING',
    };
  }

  const emailHash = hashForMeta(params.customer?.email);
  const phoneHash = hashPhoneForMeta(params.customer?.phone);
  const fnHash = hashFirstNameForMeta(params.customer?.fullName);

  const userData: Record<string, any> = {};
  if (emailHash) userData.em = [emailHash];
  if (phoneHash) userData.ph = [phoneHash];
  if (fnHash) userData.fn = [fnHash];
  if (params.clientIp && params.clientIp !== '127.0.0.1') {
    userData.client_ip_address = params.clientIp;
  }
  if (params.clientUserAgent) {
    userData.client_user_agent = params.clientUserAgent;
  }
  if (params.fbp) {
    userData.fbp = params.fbp;
  }
  if (params.fbc) {
    userData.fbc = params.fbc;
  }

  const items = params.items && params.items.length > 0
    ? params.items
    : [{ id: 'reels-bundle', price: params.totalAmount, quantity: 1, title: 'Viral Reels Bundle' }];

  const contents = items.map((item) => ({
    id: String(item.id),
    quantity: Number(item.quantity || 1),
    item_price: Number(item.price || params.totalAmount),
  }));

  const contentIds = items.map((item) => String(item.id));

  const eventPayload: Record<string, any> = {
    event_name: 'Purchase',
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    event_source_url: params.eventSourceUrl || `${(process.env.NEXT_PUBLIC_SITE_URL || 'https://vaultworld.shop').replace(/\/+$/, '')}/order-success?orderId=${encodeURIComponent(params.orderId)}`,
    action_source: 'website',
    user_data: userData,
    custom_data: {
      currency: params.currency || 'INR',
      value: Number(params.totalAmount),
      content_type: 'product',
      contents,
      content_ids: contentIds,
      order_id: params.orderId,
    },
  };

  const requestBody: Record<string, any> = {
    data: [eventPayload],
  };

  if (creds.testEventCode) {
    requestBody.test_event_code = creds.testEventCode;
  }

  const endpoint = `https://graph.facebook.com/v19.0/${creds.pixelId}/events?access_token=${encodeURIComponent(creds.accessToken)}`;

  // Retry up to 2 times on transient network / 5xx errors with exponential backoff
  let lastError = '';
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
        cache: 'no-store',
      });

      const responseData = await res.json();

      if (res.ok) {
        return {
          success: true,
          eventId,
          eventsReceived: responseData.events_received || 1,
          fbtraceId: responseData.fbtrace_id,
        };
      }

      // Check if fatal error (e.g. 400 Bad Request / Invalid Token) vs temporary server error (5xx)
      if (res.status >= 400 && res.status < 500) {
        const msg = responseData.error?.message || JSON.stringify(responseData);
        console.error(`[Meta CAPI] Permanent rejection for order ${params.orderId}:`, msg);
        return {
          success: false,
          eventId,
          error: msg,
          fbtraceId: responseData.fbtrace_id,
        };
      }

      lastError = `Status ${res.status}: ${JSON.stringify(responseData)}`;
    } catch (networkErr: any) {
      lastError = networkErr.message || String(networkErr);
    }

    if (attempt < 3) {
      // Exponential backoff: 300ms, 900ms
      await new Promise((r) => setTimeout(r, attempt * 300));
    }
  }

  console.error(`[Meta CAPI] Delivery failed after 3 attempts for order ${params.orderId}:`, lastError);
  return {
    success: false,
    eventId,
    error: lastError,
  };
}
