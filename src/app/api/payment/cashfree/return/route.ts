import { NextResponse } from 'next/server';
import { verifyCashfreePgOrder } from '@/lib/cashfree';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import {
  sendSaleSuccessTelegramAlert,
  sendAbandonedOrPendingTelegramAlert,
} from '@/lib/telegram';
import { sendResellerSaleTelegramAlert } from '@/lib/telegramReseller';
import { getResellerProfile, getResellerWallet } from '@/lib/resellerService';
import { generateOrderToken } from '@/lib/orderToken';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get('order_id');
  const tokenParam = url.searchParams.get('token');
  const isLocalhost = url.host.includes('localhost');
  const baseUrl = isLocalhost
    ? `${url.protocol}//${url.host}`
    : (url.origin && !url.origin.includes('0.0.0.0') ? url.origin : (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ztoredigital.com'));

  if (!orderId) {
    return NextResponse.redirect(`${baseUrl}/checkout?error=missing_order_id`);
  }

  const orderToken = tokenParam || generateOrderToken(orderId);

  try {
    const verification = await verifyCashfreePgOrder(orderId);

    // Fetch stored order details from Firestore for rich Telegram alert
    let storedOrder: any = null;
    if (db) {
      try {
        const snap = await getDoc(doc(db, 'orders', orderId));
        if (snap.exists()) {
          storedOrder = snap.data();
        }
      } catch (e) {
        console.warn('Could not read order doc for Telegram alert:', e);
      }
    }

    const alertPayload = {
      orderNumber: orderId,
      customer: {
        fullName: storedOrder?.customer?.fullName || 'Customer',
        email: storedOrder?.customer?.email || '',
        phone: storedOrder?.customer?.phone || '',
      },
      items: storedOrder?.items || [],
      orderBump: storedOrder?.orderBump || null,
      totalAmount: Number(storedOrder?.totalAmount || verification.order_amount || 0),
      paymentStatus: verification.order_status || (verification.paid ? 'PAID' : 'ABANDONED'),
      paymentMethod: 'Cashfree UPI / Card',
    };

    const expectedAmount = Number(storedOrder?.totalAmount || 0);
    const paidAmount = Number(verification.order_amount || 0);

    // CRITICAL SECURITY ENFORCEMENT: Verify paid amount matches expected order amount
    if (verification.paid && expectedAmount > 0 && paidAmount < expectedAmount - 1) {
      console.error(
        `[Security Warning] Underpaid order on return: #${orderId}! Expected: ₹${expectedAmount}, Paid: ₹${paidAmount}`
      );
      if (db) {
        try {
          const orderRef = doc(db, 'orders', orderId);
          await updateDoc(orderRef, {
            status: 'failed_underpaid',
            security_tamper_flag: true,
          });
        } catch {}
      }
      return NextResponse.redirect(
        `${baseUrl}/checkout?error=payment_amount_tampered&orderId=${encodeURIComponent(orderId)}`
      );
    }

    if (verification.paid) {
      const isAlreadyCompleted = storedOrder?.status === 'completed';

      if (db && !isAlreadyCompleted) {
        try {
          const orderRef = doc(db, 'orders', orderId);
          await updateDoc(orderRef, {
            status: 'completed',
          });
        } catch (err) {
          console.warn('Error updating Firestore order on return:', err);
        }
      }

      // Send celebratory Sale Telegram Alert only if not already sent
      if (!isAlreadyCompleted) {
        if (storedOrder?.reseller_id) {
          try {
            const profile = await getResellerProfile(storedOrder.reseller_id);
            const wallet = await getResellerWallet(storedOrder.reseller_id);
            await sendResellerSaleTelegramAlert({
              orderNumber: orderId,
              resellerId: storedOrder.reseller_id,
              resellerUid: profile?.resellerUid || storedOrder.reseller_uid || 'RSL-VAULTZET',
              resellerName: profile?.displayName || storedOrder.reseller_name || 'Reseller',
              resellerEmail: profile?.email || '',
              resellerPhone: profile?.phone || '',
              productTitle: storedOrder.items?.[0]?.title || 'Viral Reels Bundle',
              totalAmount: Number(storedOrder.totalAmount || verification.order_amount || 0),
              basePrice: Number(
                storedOrder.base_price_snapshot ||
                  (Number(storedOrder.totalAmount || 0) - Number(storedOrder.reseller_earning || 0))
              ),
              resellerEarning: Number(storedOrder.reseller_earning || 0),
              customer: alertPayload.customer,
              availableBalance: wallet?.availableBalance ?? Number(storedOrder.reseller_earning || 0),
              totalEarned: wallet?.totalEarned ?? Number(storedOrder.reseller_earning || 0),
            });
          } catch (e) {
            console.warn('Error dispatching reseller alert in return route:', e);
            await sendSaleSuccessTelegramAlert(alertPayload);
          }
        } else {
          await sendSaleSuccessTelegramAlert(alertPayload);
        }
      }

      const resellerQuery = storedOrder?.reseller_slug
        ? `&r=${encodeURIComponent(storedOrder.reseller_slug)}&reseller_slug=${encodeURIComponent(storedOrder.reseller_slug)}`
        : '';

      return NextResponse.redirect(
        `${baseUrl}/order-success?orderId=${encodeURIComponent(orderId)}&token=${encodeURIComponent(orderToken)}${resellerQuery}`
      );
    } else {
      if (db && storedOrder?.status === 'pending') {
        try {
          const orderRef = doc(db, 'orders', orderId);
          await updateDoc(orderRef, {
            status: 'failed',
          });
        } catch (err) {
          console.warn('Error updating abandoned Firestore order:', err);
        }
      }

      // Send Abandoned Payment Telegram Alert with WhatsApp Follow-Up button
      if (storedOrder?.status !== 'failed') {
        await sendAbandonedOrPendingTelegramAlert(alertPayload, 'payment_abandoned');
      }

      const resellerQuery = storedOrder?.reseller_slug
        ? `&r=${encodeURIComponent(storedOrder.reseller_slug)}&reseller_slug=${encodeURIComponent(storedOrder.reseller_slug)}`
        : '';

      return NextResponse.redirect(
        `${baseUrl}/checkout?error=payment_${verification.order_status?.toLowerCase() || 'incomplete'}&orderId=${encodeURIComponent(orderId)}${resellerQuery}`
      );
    }
  } catch (err: any) {
    console.error('Error handling Cashfree return redirect:', err);
    return NextResponse.redirect(
      `${baseUrl}/order-success?orderId=${encodeURIComponent(orderId)}&token=${encodeURIComponent(orderToken)}`
    );
  }
}
