import { NextResponse } from 'next/server';
import { verifyPayUResponseHash, getPayUCredentials } from '@/lib/payu';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import {
  sendSaleSuccessTelegramAlert,
  sendAbandonedOrPendingTelegramAlert,
} from '@/lib/telegram';
import { sendResellerSaleTelegramAlert } from '@/lib/telegramReseller';
import { getResellerProfile, getResellerWallet, recordSaleEarning } from '@/lib/resellerService';
import { generateOrderToken } from '@/lib/orderToken';
import { sendMetaCapiPurchase } from '@/lib/metaCapi';

export const runtime = 'nodejs';

async function parsePayURequestBody(request: Request): Promise<Record<string, any>> {
  const contentType = request.headers.get('content-type') || '';
  const data: Record<string, any> = {};

  if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
    try {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        data[key] = typeof value === 'string' ? value : String(value);
      });
      return data;
    } catch {
      // Fallback to text parsing
    }
  }

  try {
    const text = await request.text();
    if (text) {
      if (text.startsWith('{')) {
        return JSON.parse(text);
      }
      const params = new URLSearchParams(text);
      params.forEach((value, key) => {
        data[key] = value;
      });
      return data;
    }
  } catch (e) {
    console.warn('Could not parse PayU request body:', e);
  }

  // Also check query search parameters as fallback
  const url = new URL(request.url);
  url.searchParams.forEach((value, key) => {
    if (!data[key]) data[key] = value;
  });

  return data;
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const hostHeader = request.headers.get('host') || url.host || '';
  const isLocalhost = hostHeader.includes('localhost');
  const baseUrl = isLocalhost
    ? `http://${hostHeader}`
    : (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vaultworld.shop').replace(/\/+$/, '');

  try {
    const data = await parsePayURequestBody(request);

    const txnid = String(data.txnid || data.order_id || data.orderId || data.udf1 || '').trim();
    const status = String(data.status || '').trim().toLowerCase();
    const mihpayid = String(data.mihpayid || '').trim();
    const payuHash = String(data.hash || '').trim();
    const tokenParam = String(data.udf2 || '').trim();
    const resellerSlugParam = String(data.udf3 || '').trim();

    if (!txnid) {
      console.error('[PayU Return] Missing txnid/orderId in PayU response payload:', data);
      return NextResponse.redirect(`${baseUrl}/checkout?error=missing_order_id`, { status: 303 });
    }

    const orderToken = tokenParam || generateOrderToken(txnid);

    // Verify SHA-512 reverse hash for security
    const hashCheck = await verifyPayUResponseHash(data);

    // In dev / test environment with mock keys, log clearly if hash does not match
    const creds = await getPayUCredentials();
    const isTestMode = creds.environment === 'TEST';

    const isHashValid = hashCheck.isValid || (isTestMode && !creds.merchantSalt);

    if (!isHashValid) {
      console.warn(
        `[PayU Security Warning] Hash mismatch for txnid #${txnid}! Received: ${payuHash}, Calculated: ${hashCheck.calculatedHash}`
      );
    }

    // Retrieve order document from Firestore
    let storedOrder: any = null;
    if (db) {
      try {
        const snap = await getDoc(doc(db, 'orders', txnid));
        if (snap.exists()) {
          storedOrder = snap.data();
        }
      } catch (e) {
        console.warn('[PayU Return] Error reading Firestore order doc:', e);
      }
    }

    const expectedAmount = Number(storedOrder?.totalAmount || 0);
    const receivedAmount = Number(data.amount || 0);

    // Check anti-tampering: Paid amount must not be lower than expected amount
    if (expectedAmount > 0 && receivedAmount > 0 && receivedAmount < expectedAmount - 1) {
      console.error(
        `[PayU Security Tamper] Underpaid order: #${txnid}! Expected ₹${expectedAmount}, Received ₹${receivedAmount}`
      );
      if (db) {
        try {
          await updateDoc(doc(db, 'orders', txnid), {
            status: 'failed_underpaid',
            security_tamper_flag: true,
            payu_mihpayid: mihpayid,
          });
        } catch {}
      }
      return NextResponse.redirect(
        `${baseUrl}/checkout?error=payment_amount_tampered&orderId=${encodeURIComponent(txnid)}`,
        { status: 303 }
      );
    }

    const isSuccessful = status === 'success' && (isHashValid || isTestMode);

    const alertPayload = {
      orderNumber: txnid,
      customer: {
        fullName: storedOrder?.customer?.fullName || data.firstname || 'Customer',
        email: storedOrder?.customer?.email || data.email || '',
        phone: storedOrder?.customer?.phone || data.phone || '',
      },
      items: storedOrder?.items || [],
      orderBump: storedOrder?.orderBump || null,
      totalAmount: Number(storedOrder?.totalAmount || receivedAmount || 0),
      paymentStatus: isSuccessful ? 'PAID' : 'FAILED',
      paymentMethod: 'PayU India (UPI / Card / NetBanking)',
    };

    if (isSuccessful) {
      const isAlreadyCompleted = storedOrder?.status === 'completed';

      // Update Firestore order
      if (db) {
        try {
          const updatePayload: Record<string, any> = {
            status: 'completed',
            paymentMethod: 'PayU India',
            payu_mihpayid: mihpayid || null,
            payu_bank_ref_num: data.bank_ref_num || null,
            payu_mode: data.mode || 'UPI',
            payu_status: status,
            payu_verified: true,
            paid_at: new Date().toISOString(),
          };

          if (storedOrder?.reseller_id) {
            updatePayload.earning_status = 'recorded';
          }

          await updateDoc(doc(db, 'orders', txnid), updatePayload);
        } catch (err) {
          console.warn('[PayU Return] Error updating Firestore order doc:', err);
        }
      }

      // Record reseller earnings safely
      if (storedOrder?.reseller_id && !isAlreadyCompleted) {
        const baseSnapshot = Number(storedOrder.base_price_snapshot || 0);
        const resaleSnapshot = Number(storedOrder.resale_price_snapshot || storedOrder.totalAmount || 0);
        const maxPossibleEarning = Math.max(0, resaleSnapshot - baseSnapshot);
        const safeEarning = Math.min(Number(storedOrder.reseller_earning || 0), maxPossibleEarning);

        if (safeEarning > 0) {
          try {
            await recordSaleEarning({
              orderId: txnid,
              resellerId: storedOrder.reseller_id,
              listingId: storedOrder.reseller_listing_id || '',
              amount: safeEarning,
              productTitle: storedOrder.items?.[0]?.title || 'Viral Reels Bundle',
              settleImmediately: true,
            });
          } catch (resellerErr) {
            console.error('[PayU Return] Error recording reseller earning:', resellerErr);
          }
        }
      }

      // Send Meta CAPI Purchase Event server-side
      if (!isAlreadyCompleted && storedOrder?.purchase_event_status !== 'delivered') {
        try {
          await sendMetaCapiPurchase({
            orderId: txnid,
            totalAmount: Number(storedOrder?.totalAmount || receivedAmount || 0),
            currency: 'INR',
            items: storedOrder?.items || [],
            customer: storedOrder?.customer,
          });
        } catch (capiErr) {
          console.warn('[PayU Return] Non-blocking CAPI error:', capiErr);
        }
      }

      // Send Instant Telegram Alert
      if (!isAlreadyCompleted) {
        if (storedOrder?.reseller_id) {
          try {
            const profile = await getResellerProfile(storedOrder.reseller_id);
            const wallet = await getResellerWallet(storedOrder.reseller_id);
            await sendResellerSaleTelegramAlert({
              orderNumber: txnid,
              resellerId: storedOrder.reseller_id,
              resellerUid: profile?.resellerUid || storedOrder.reseller_uid || 'RSL-VAULTZET',
              resellerName: profile?.displayName || storedOrder.reseller_name || 'Reseller',
              resellerEmail: profile?.email || '',
              resellerPhone: profile?.phone || '',
              productTitle: storedOrder.items?.[0]?.title || 'Viral Reels Bundle',
              totalAmount: Number(storedOrder.totalAmount || receivedAmount || 0),
              basePrice: Number(
                storedOrder.base_price_snapshot ||
                  (Number(storedOrder.totalAmount || 0) - Number(storedOrder.reseller_earning || 0))
              ),
              resellerEarning: Number(storedOrder.reseller_earning || 0),
              customer: alertPayload.customer,
              availableBalance: wallet?.availableBalance ?? Number(storedOrder.reseller_earning || 0),
              totalEarned: wallet?.totalEarned ?? Number(storedOrder.reseller_earning || 0),
            });
          } catch (rErr) {
            console.warn('[PayU Return] Fallback to standard telegram alert:', rErr);
            await sendSaleSuccessTelegramAlert(alertPayload);
          }
        } else {
          await sendSaleSuccessTelegramAlert(alertPayload);
        }
      }

      const activeResellerSlug = storedOrder?.reseller_slug || resellerSlugParam;
      const resellerQuery = activeResellerSlug
        ? `&r=${encodeURIComponent(activeResellerSlug)}&reseller_slug=${encodeURIComponent(activeResellerSlug)}`
        : '';

      return NextResponse.redirect(
        `${baseUrl}/order-success?orderId=${encodeURIComponent(txnid)}&token=${encodeURIComponent(orderToken)}${resellerQuery}`,
        { status: 303 }
      );
    } else {
      // Payment Failed or Cancelled
      if (db && storedOrder?.status === 'pending') {
        try {
          await updateDoc(doc(db, 'orders', txnid), {
            status: 'failed',
            payu_error: data.error || data.error_Message || 'Payment cancelled or failed',
            payu_status: status,
          });
        } catch (err) {
          console.warn('[PayU Return] Error marking order failed:', err);
        }
      }

      // Send Abandoned / Failed Telegram Alert
      if (storedOrder?.status !== 'failed') {
        await sendAbandonedOrPendingTelegramAlert(alertPayload, 'payment_abandoned');
      }

      const activeResellerSlug = storedOrder?.reseller_slug || resellerSlugParam;
      const resellerQuery = activeResellerSlug
        ? `&r=${encodeURIComponent(activeResellerSlug)}&reseller_slug=${encodeURIComponent(activeResellerSlug)}`
        : '';

      const reason = data.error_Message || data.error || status || 'failed';
      return NextResponse.redirect(
        `${baseUrl}/checkout?error=payment_failed&reason=${encodeURIComponent(reason)}&orderId=${encodeURIComponent(txnid)}${resellerQuery}`,
        { status: 303 }
      );
    }
  } catch (error: any) {
    console.error('[PayU Return] Unhandled error:', error);
    return NextResponse.redirect(`${baseUrl}/checkout?error=payment_processing_error`, { status: 303 });
  }
}

export async function GET(request: Request) {
  // Support GET redirect as well
  return POST(request);
}
