import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getRazorpayCredentials } from '@/lib/razorpay';
import { sendSaleSuccessTelegramAlert } from '@/lib/telegram';
import { sendMetaCapiPurchase } from '@/lib/metaCapi';
import { generateOrderToken } from '@/lib/orderToken';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    let body: any;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const event = body?.event;
    console.log(`[Razorpay Webhook] Received event: ${event}`);

    // If webhook secret is configured in env, verify signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        console.error('[Razorpay Webhook] Invalid signature');
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = body?.payload?.payment?.entity;
      const orderEntity = body?.payload?.order?.entity;

      const rzpOrderId = paymentEntity?.order_id || orderEntity?.id;
      const rzpPaymentId = paymentEntity?.id;
      const notes = paymentEntity?.notes || orderEntity?.notes || {};

      let orderNumber = String(notes.orderNumber || notes.order_id || '').trim();

      // If orderNumber not in notes, search Firestore for order with this razorpay_order_id
      if (!orderNumber && rzpOrderId && db) {
        try {
          const q = query(collection(db, 'orders'), where('razorpay_order_id', '==', rzpOrderId));
          const snap = await getDocs(q);
          if (!snap.empty) {
            orderNumber = snap.docs[0].id;
          }
        } catch (findErr) {
          console.warn('[Razorpay Webhook] Search by razorpay_order_id warning:', findErr);
        }
      }

      if (orderNumber) {
        console.log(`[Razorpay Webhook] Processing successful payment for order #${orderNumber}`);
        let storedOrder: any = null;

        if (db) {
          try {
            const snap = await getDoc(doc(db, 'orders', orderNumber));
            if (snap.exists()) {
              storedOrder = snap.data();
            }

            const updatePayload: Record<string, any> = {
              status: 'completed',
              payment_status: 'PAID',
              paymentMethod: 'Razorpay (Webhook Captured)',
              razorpay_order_id: rzpOrderId,
              razorpay_payment_id: rzpPaymentId,
              razorpay_verified: true,
              paid_at: new Date().toISOString(),
              payment_verified_at: new Date().toISOString(),
            };

            if (storedOrder) {
              await updateDoc(doc(db, 'orders', orderNumber), updatePayload);
            } else {
              await setDoc(doc(db, 'orders', orderNumber), {
                orderNumber,
                customer: {
                  fullName: notes.customer_name || 'Customer',
                  email: notes.customer_email || '',
                  phone: notes.customer_phone || '',
                },
                items: [{ id: 'bundle', title: notes.product_info || 'Viral Reels Bundle', license: 'personal' }],
                totalAmount: Number(paymentEntity?.amount ? paymentEntity.amount / 100 : 99),
                createdAt: new Date(),
                timestampIso: new Date().toISOString(),
                order_token: generateOrderToken(orderNumber),
                ...updatePayload,
              }, { merge: true });
            }

            // Also persist to order_success_records
            await setDoc(
              doc(db, 'order_success_records', orderNumber),
              {
                order_id: orderNumber,
                orderNumber,
                customer: storedOrder?.customer || {
                  fullName: notes.customer_name || 'Customer',
                  email: notes.customer_email || '',
                  phone: notes.customer_phone || '',
                },
                items: storedOrder?.items || [{ id: 'bundle', title: notes.product_info || 'Viral Reels Bundle', license: 'personal' }],
                totalAmount: Number(storedOrder?.totalAmount || (paymentEntity?.amount ? paymentEntity.amount / 100 : 99)),
                status: 'completed',
                paymentMethod: 'Razorpay',
                razorpay_payment_id: rzpPaymentId,
                created_at: new Date().toISOString(),
              },
              { merge: true }
            ).catch(() => {});
          } catch (dbErr) {
            console.error('[Razorpay Webhook] Firestore error:', dbErr);
          }
        }

        // Send Telegram alert
        try {
          await sendSaleSuccessTelegramAlert({
            orderNumber,
            customer: storedOrder?.customer || {
              fullName: notes.customer_name || 'Customer',
              email: notes.customer_email || '',
              phone: notes.customer_phone || '',
            },
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
            totalAmount: Number(storedOrder?.totalAmount || (paymentEntity?.amount ? paymentEntity.amount / 100 : 0)),
            paymentMethod: 'Razorpay Gateway (Webhook Confirmed)',
          });
        } catch (tErr) {
          console.warn('[Razorpay Webhook] Telegram warning:', tErr);
        }

        // Send Meta CAPI
        try {
          await sendMetaCapiPurchase({
            orderId: orderNumber,
            totalAmount: Number(storedOrder?.totalAmount || (paymentEntity?.amount ? paymentEntity.amount / 100 : 0)),
            currency: 'INR',
            items: storedOrder?.items || [],
            customer: storedOrder?.customer,
          });
        } catch (cErr) {
          console.warn('[Razorpay Webhook] Meta CAPI warning:', cErr);
        }
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error('[Razorpay Webhook Error]:', error);
    return NextResponse.json({ error: error.message || 'Webhook processing failed' }, { status: 500 });
  }
}
