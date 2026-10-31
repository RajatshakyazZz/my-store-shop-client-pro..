import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { getRazorpayOrder, getRazorpayOrderPayments, getRazorpayOrderByReceipt } from '@/lib/razorpay';
import { sendSaleSuccessTelegramAlert } from '@/lib/telegram';
import { sendMetaCapiPurchase } from '@/lib/metaCapi';
import { generateOrderToken, extractClientMetadata } from '@/lib/orderToken';

export const runtime = 'nodejs';

async function verifyAndProcessOrder(
  orderId: string,
  razorpayOrderId?: string,
  clientMeta?: any
) {
  if (!orderId) {
    return { success: false, paid: false, error: 'Missing order_id' };
  }

  let storedOrder: any = null;
  if (db) {
    try {
      const snap = await getDoc(doc(db, 'orders', orderId));
      if (snap.exists()) {
        storedOrder = snap.data();
      }
    } catch (e) {
      console.warn('[Razorpay Check-Status] Error reading order doc:', e);
    }
  }

  // 1. If already completed in Firestore, return instant success
  if (storedOrder?.status === 'completed' || storedOrder?.razorpay_verified === true) {
    return {
      success: true,
      paid: true,
      status: 'completed',
      order_id: orderId,
      order_token: storedOrder?.order_token || generateOrderToken(orderId),
      payment_id: storedOrder?.razorpay_payment_id || null,
      message: 'Order already verified and completed.',
    };
  }

  // 2. Resolve razorpay_order_id (from params, Firestore, or search by receipt)
  let targetRzpOrderId = razorpayOrderId || storedOrder?.razorpay_order_id;
  if (!targetRzpOrderId) {
    try {
      const orderMatch = await getRazorpayOrderByReceipt(orderId);
      if (orderMatch?.id) {
        targetRzpOrderId = orderMatch.id;
      }
    } catch {}
  }

  if (!targetRzpOrderId) {
    return {
      success: true,
      paid: false,
      status: storedOrder?.status || 'pending',
      order_id: orderId,
      message: 'No Razorpay order ID associated with this order yet.',
    };
  }

  // 3. Query Razorpay API directly
  try {
    const [rzpOrder, rzpPayments] = await Promise.all([
      getRazorpayOrder(targetRzpOrderId).catch((err) => {
        console.warn('[Razorpay Check-Status] Error fetching order:', err);
        return null;
      }),
      getRazorpayOrderPayments(targetRzpOrderId).catch((err) => {
        console.warn('[Razorpay Check-Status] Error fetching payments:', err);
        return null;
      }),
    ]);

    const paymentsList: any[] = Array.isArray(rzpPayments?.items) ? rzpPayments.items : [];
    const capturedPayment = paymentsList.find(
      (p: any) => p && (p.status === 'captured' || p.status === 'authorized' || p.captured === true)
    );

    const isOrderPaid =
      Boolean(capturedPayment) ||
      rzpOrder?.status === 'paid' ||
      (rzpOrder?.amount_paid != null && rzpOrder.amount_paid > 0 && rzpOrder.amount_paid >= (rzpOrder.amount || 100));

    if (isOrderPaid) {
      const paymentId = capturedPayment?.id || paymentsList[0]?.id || `pay_${Date.now()}`;
      const token = storedOrder?.order_token || generateOrderToken(orderId);

      // Persist completion to Firestore
      if (db) {
        try {
          const updatePayload: Record<string, any> = {
            status: 'completed',
            payment_status: 'PAID',
            paymentMethod: 'Razorpay Payment Gateway (UPI / QR / Cards)',
            razorpay_order_id: targetRzpOrderId,
            razorpay_payment_id: paymentId,
            razorpay_verified: true,
            paid_at: new Date().toISOString(),
            payment_verified_at: new Date().toISOString(),
          };

          if (storedOrder) {
            await updateDoc(doc(db, 'orders', orderId), updatePayload);
          } else {
            // Document might have failed during create-order, write it now!
            await setDoc(doc(db, 'orders', orderId), {
              orderNumber: orderId,
              customer: {
                fullName: rzpOrder?.notes?.customer_name || 'Customer',
                email: rzpOrder?.notes?.customer_email || '',
                phone: rzpOrder?.notes?.customer_phone || '',
              },
              items: [{ id: 'bundle', title: rzpOrder?.notes?.product_info || 'Viral Reels Bundle', price: Number(rzpOrder?.amount ? rzpOrder.amount / 100 : 99), license: 'personal' }],
              totalAmount: Number(rzpOrder?.amount ? rzpOrder.amount / 100 : 99),
              createdAt: new Date(),
              timestampIso: new Date().toISOString(),
              order_token: token,
              ...updatePayload,
            }, { merge: true });
          }

          // Also write to order_success_records for instant failover
          await setDoc(
            doc(db, 'order_success_records', orderId),
            {
              order_id: orderId,
              orderNumber: orderId,
              customer: storedOrder?.customer || {
                fullName: rzpOrder?.notes?.customer_name || 'Customer',
                email: rzpOrder?.notes?.customer_email || '',
                phone: rzpOrder?.notes?.customer_phone || '',
              },
              items: storedOrder?.items || [{ id: 'bundle', title: rzpOrder?.notes?.product_info || 'Viral Reels Bundle', license: 'personal' }],
              totalAmount: Number(storedOrder?.totalAmount || (rzpOrder?.amount ? rzpOrder.amount / 100 : 99)),
              status: 'completed',
              paymentMethod: 'Razorpay',
              razorpay_payment_id: paymentId,
              created_at: new Date().toISOString(),
            },
            { merge: true }
          ).catch(() => {});
        } catch (dbErr) {
          console.warn('[Razorpay Check-Status] Firestore update warning:', dbErr);
        }
      }

      // Dispatch Telegram Alert
      try {
        await sendSaleSuccessTelegramAlert({
          orderNumber: orderId,
          customer: storedOrder?.customer || {
            fullName: rzpOrder?.notes?.customer_name || 'Customer',
            email: rzpOrder?.notes?.customer_email || '',
            phone: rzpOrder?.notes?.customer_phone || '',
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
          totalAmount: Number(storedOrder?.totalAmount || (rzpOrder?.amount ? rzpOrder.amount / 100 : 0)),
          paymentMethod: 'Razorpay UPI QR (Instant Auto-Detected)',
        });
      } catch (tErr) {
        console.warn('[Razorpay Check-Status] Telegram alert warning:', tErr);
      }

      // Dispatch Meta CAPI Purchase Event
      try {
        await sendMetaCapiPurchase({
          orderId,
          totalAmount: Number(storedOrder?.totalAmount || (rzpOrder?.amount ? rzpOrder.amount / 100 : 0)),
          currency: 'INR',
          items: storedOrder?.items || [],
          customer: storedOrder?.customer,
          clientIp: clientMeta?.clientIp,
          clientUserAgent: clientMeta?.clientUserAgent,
        });
      } catch (cErr) {
        console.warn('[Razorpay Check-Status] Meta CAPI warning:', cErr);
      }

      return {
        success: true,
        paid: true,
        status: 'completed',
        order_id: orderId,
        order_token: token,
        payment_id: paymentId,
      };
    }

    return {
      success: true,
      paid: false,
      status: 'pending',
      order_id: orderId,
      message: 'Payment not yet confirmed by Razorpay.',
    };
  } catch (apiErr: any) {
    console.error('[Razorpay Check-Status] API query error:', apiErr);
    return {
      success: false,
      paid: false,
      status: storedOrder?.status || 'pending',
      order_id: orderId,
      error: apiErr.message || 'Error querying Razorpay API',
    };
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = String(
      searchParams.get('order_id') ||
      searchParams.get('orderId') ||
      searchParams.get('orderNumber') ||
      ''
    ).trim();
    const razorpayOrderId = String(searchParams.get('razorpay_order_id') || '').trim();
    const clientMeta = extractClientMetadata(request);

    const result = await verifyAndProcessOrder(orderId, razorpayOrderId, clientMeta);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[Razorpay Check-Status GET Error]:', error);
    return NextResponse.json(
      { success: false, paid: false, error: error.message || 'Status check failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const orderId = String(body.order_id || body.orderId || body.orderNumber || '').trim();
    const razorpayOrderId = String(body.razorpay_order_id || '').trim();
    const clientMeta = extractClientMetadata(request);

    const result = await verifyAndProcessOrder(orderId, razorpayOrderId, clientMeta);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[Razorpay Check-Status POST Error]:', error);
    return NextResponse.json(
      { success: false, paid: false, error: error.message || 'Status check failed' },
      { status: 500 }
    );
  }
}
