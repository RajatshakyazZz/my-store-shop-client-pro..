import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import {
  verifyRazorpaySignature,
  getRazorpayCredentials,
  getRazorpayOrder,
  getRazorpayOrderPayments,
  getRazorpayPaymentDetails,
} from '@/lib/razorpay';
import { sendSaleSuccessTelegramAlert } from '@/lib/telegram';
import { sendResellerSaleTelegramAlert } from '@/lib/telegramReseller';
import { getResellerProfile, getResellerWallet, recordSaleEarning } from '@/lib/resellerService';
import { sendMetaCapiPurchase } from '@/lib/metaCapi';
import { extractClientMetadata, generateOrderToken } from '@/lib/orderToken';

export const runtime = 'nodejs';

/**
 * Official Razorpay Web Callback Handler
 * Receives synchronous HTTP POST/GET from Razorpay Standard Web Checkout (callback_url).
 * Verifies authenticity, marks order complete, fires alerts, and redirects user to /order-success.
 */
async function processCallback(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  let queryOrderId = searchParams.get('order_id') || searchParams.get('orderNumber') || '';
  let token = searchParams.get('token') || '';

  let razorpayPaymentId = searchParams.get('razorpay_payment_id') || '';
  let razorpayOrderId = searchParams.get('razorpay_order_id') || '';
  let razorpaySignature = searchParams.get('razorpay_signature') || '';
  let errorCode = searchParams.get('error[code]') || searchParams.get('error_code') || '';
  let errorDesc = searchParams.get('error[description]') || searchParams.get('error_description') || '';

  // Parse POST body if present (form-urlencoded or json)
  if (request.method === 'POST') {
    try {
      const contentType = request.headers.get('content-type') || '';
      if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
        const formData = await request.formData();
        razorpayPaymentId = (formData.get('razorpay_payment_id') as string) || razorpayPaymentId;
        razorpayOrderId = (formData.get('razorpay_order_id') as string) || razorpayOrderId;
        razorpaySignature = (formData.get('razorpay_signature') as string) || razorpaySignature;
        errorCode = (formData.get('error[code]') as string) || errorCode;
        errorDesc = (formData.get('error[description]') as string) || errorDesc;
        if (!queryOrderId && formData.get('order_id')) {
          queryOrderId = formData.get('order_id') as string;
        }
      } else if (contentType.includes('application/json')) {
        const json = await request.json().catch(() => ({}));
        razorpayPaymentId = json.razorpay_payment_id || razorpayPaymentId;
        razorpayOrderId = json.razorpay_order_id || razorpayOrderId;
        razorpaySignature = json.razorpay_signature || razorpaySignature;
        errorCode = json.error?.code || errorCode;
        errorDesc = json.error?.description || errorDesc;
        if (!queryOrderId && json.order_id) {
          queryOrderId = json.order_id;
        }
      }
    } catch (parseErr) {
      console.warn('[Razorpay Callback] Body parse notice:', parseErr);
    }
  }

  // Handle explicit payment cancellation or failure from Razorpay
  if (errorCode || errorDesc) {
    console.warn(`[Razorpay Callback] Payment failed: ${errorCode} - ${errorDesc}`);
    const redirectFailUrl = new URL('/checkout', request.url);
    redirectFailUrl.searchParams.set('error', errorDesc || 'Payment was not completed. Please try again.');
    return NextResponse.redirect(redirectFailUrl, 303);
  }

  const orderId = queryOrderId.trim();
  if (!orderId) {
    console.error('[Razorpay Callback] Missing order_id in callback request');
    return NextResponse.redirect(new URL('/checkout?error=missing_order_id', request.url), 303);
  }

  // Fetch stored order
  let storedOrder: any = null;
  if (db) {
    try {
      const snap = await getDoc(doc(db, 'orders', orderId));
      if (snap.exists()) {
        storedOrder = snap.data();
      }
    } catch (dbErr) {
      console.warn('[Razorpay Callback] Error reading order doc:', dbErr);
    }
  }

  const validToken = token || storedOrder?.order_token || generateOrderToken(orderId);
  const targetRzpOrderId = razorpayOrderId || storedOrder?.razorpay_order_id || '';

  // Verify HMAC-SHA256 signature
  const creds = await getRazorpayCredentials();
  let isSignatureValid = false;
  if (targetRzpOrderId && razorpayPaymentId && razorpaySignature && creds.keySecret) {
    isSignatureValid = verifyRazorpaySignature({
      razorpayOrderId: targetRzpOrderId,
      razorpayPaymentId,
      razorpaySignature,
      keySecret: creds.keySecret,
    });
  }

  // API Verification Fallback
  let isApiVerified = false;
  if (!isSignatureValid && targetRzpOrderId) {
    try {
      const [rzpOrder, rzpPayments] = await Promise.all([
        getRazorpayOrder(targetRzpOrderId).catch(() => null),
        getRazorpayOrderPayments(targetRzpOrderId).catch(() => null),
      ]);
      const paymentsList = Array.isArray(rzpPayments?.items) ? rzpPayments.items : [];
      const capturedPayment = paymentsList.find(
        (p: any) => p && (p.status === 'captured' || p.status === 'authorized' || p.captured === true)
      );

      if (
        Boolean(capturedPayment) ||
        rzpOrder?.status === 'paid' ||
        (rzpOrder?.amount_paid && rzpOrder.amount_paid >= (rzpOrder.amount || 100))
      ) {
        isApiVerified = true;
        if (capturedPayment?.id) {
          razorpayPaymentId = capturedPayment.id;
        }
      }
    } catch (apiErr) {
      console.warn('[Razorpay Callback] API check warning:', apiErr);
    }
  }

  const isConfirmedPaid = isSignatureValid || isApiVerified || storedOrder?.status === 'completed';

  if (isConfirmedPaid) {
    const isAlreadyPaid = storedOrder?.status === 'completed' || storedOrder?.razorpay_verified === true;

    if (!isAlreadyPaid && db) {
      try {
        const updatePayload: Record<string, any> = {
          status: 'completed',
          payment_status: 'PAID',
          paymentMethod: 'Razorpay Payment Gateway (UPI / QR / Cards)',
          razorpay_order_id: targetRzpOrderId || razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId || `pay_${Date.now()}`,
          razorpay_signature: razorpaySignature || null,
          razorpay_verified: true,
          paid_at: new Date().toISOString(),
          payment_verified_at: new Date().toISOString(),
        };

        if (storedOrder) {
          await updateDoc(doc(db, 'orders', orderId), updatePayload);
        } else {
          await setDoc(doc(db, 'orders', orderId), {
            orderNumber: orderId,
            customer: { fullName: 'Valued Customer', email: '', phone: '' },
            items: [{ id: 'bundle', title: 'Viral Reels Bundle', license: 'personal' }],
            totalAmount: 99,
            createdAt: new Date(),
            timestampIso: new Date().toISOString(),
            order_token: validToken,
            ...updatePayload,
          }, { merge: true });
        }

        // Write to order_success_records for fast fallback
        await setDoc(
          doc(db, 'order_success_records', orderId),
          {
            order_id: orderId,
            orderNumber: orderId,
            customer: storedOrder?.customer || {},
            items: storedOrder?.items || [],
            totalAmount: storedOrder?.totalAmount || 0,
            status: 'completed',
            paymentMethod: 'Razorpay',
            razorpay_payment_id: razorpayPaymentId,
            created_at: new Date().toISOString(),
          },
          { merge: true }
        ).catch(() => null);
      } catch (saveErr) {
        console.error('[Razorpay Callback] Error updating order status:', saveErr);
      }

      // Telegram notification
      try {
        const alertPayload = {
          orderNumber: orderId,
          customer: storedOrder?.customer || { fullName: 'Valued Customer', email: '', phone: '' },
          items: (storedOrder?.items || []).map((it: any) => ({
            id: it.id || it.slug,
            title: it.title || 'Reels Bundle',
            license: it.license || 'personal',
            price: Number(it.price || 0),
            googleDriveLink: it.googleDriveLink || it.google_drive_link,
          })),
          orderBump: storedOrder?.orderBump
            ? {
                title: storedOrder.orderBump.title || 'Growth Booster Pack',
                price: Number(storedOrder.orderBump.price || 99),
              }
            : null,
          totalAmount: Number(storedOrder?.totalAmount || 0),
          paymentMethod: 'Razorpay Payment Gateway (UPI / QR / Cards)',
        };
        sendSaleSuccessTelegramAlert(alertPayload).catch(() => {});
      } catch {}

      // Meta CAPI
      try {
        const clientMeta = extractClientMetadata(request);
        sendMetaCapiPurchase({
          orderId,
          totalAmount: Number(storedOrder?.totalAmount || 0),
          currency: 'INR',
          items: storedOrder?.items || [],
          customer: storedOrder?.customer,
          clientIp: clientMeta?.clientIp,
          clientUserAgent: clientMeta?.clientUserAgent,
        }).catch(() => {});
      } catch {}
    }

    // Redirect to Order Success Page
    const successUrl = new URL('/order-success', request.url);
    successUrl.searchParams.set('order_id', orderId);
    successUrl.searchParams.set('token', validToken);
    if (razorpayPaymentId) successUrl.searchParams.set('razorpay_payment_id', razorpayPaymentId);
    if (targetRzpOrderId) successUrl.searchParams.set('razorpay_order_id', targetRzpOrderId);
    if (razorpaySignature) successUrl.searchParams.set('razorpay_signature', razorpaySignature);

    return NextResponse.redirect(successUrl, 303);
  }

  // If not confirmed paid yet, redirect to order-success where background polling will resolve it
  const pendingUrl = new URL('/order-success', request.url);
  pendingUrl.searchParams.set('order_id', orderId);
  pendingUrl.searchParams.set('token', validToken);
  if (razorpayPaymentId) pendingUrl.searchParams.set('razorpay_payment_id', razorpayPaymentId);
  if (targetRzpOrderId) pendingUrl.searchParams.set('razorpay_order_id', targetRzpOrderId);

  return NextResponse.redirect(pendingUrl, 303);
}

export async function POST(request: Request) {
  return processCallback(request);
}

export async function GET(request: Request) {
  return processCallback(request);
}
