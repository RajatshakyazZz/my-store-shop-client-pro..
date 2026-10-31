import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { resolveDriveFilesForProduct } from '@/lib/productDriveResolver';

export const runtime = 'nodejs';

/**
 * Verifies purchase authorization and safely unlocks Google Drive download links
 * for a specific product based on checkout email or completed order ID.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || '').trim().toLowerCase();
    const orderId = String(body.orderId || body.order_id || '').trim();
    const productId = String(body.productId || body.id || '').trim();
    const slug = String(body.slug || '').trim().toLowerCase();
    const title = String(body.title || '').trim().toLowerCase();

    if (!productId && !slug && !title) {
      return NextResponse.json({ success: false, unlocked: false, error: 'Product identifier required' }, { status: 400 });
    }

    if (!email && !orderId) {
      return NextResponse.json({ success: false, unlocked: false, error: 'Customer email or Order ID required' }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({ success: false, unlocked: false, error: 'Database unavailable' }, { status: 500 });
    }

    let matchingOrder: any = null;

    // 1. Direct Lookup by Order ID
    if (orderId) {
      const snap = await getDoc(doc(db, 'orders', orderId)).catch(() => null);
      if (snap && snap.exists()) {
        const orderData = snap.data();
        const isPaid = orderData.status === 'completed' || orderData.payment_status === 'PAID' || orderData.razorpay_verified === true;
        if (isPaid) {
          const items: any[] = Array.isArray(orderData.items) ? orderData.items : [];
          const hasItem = items.some((it) => {
            const itId = String(it.id || '').trim();
            const itSlug = String(it.slug || '').trim().toLowerCase();
            const itTitle = String(it.title || '').trim().toLowerCase();
            return (
              (productId && (itId === productId || itId.includes(productId) || productId.includes(itId))) ||
              (slug && (itSlug === slug || itId.includes(slug) || slug.includes(itId))) ||
              (title && (itTitle.includes(title) || title.includes(itTitle)))
            );
          });
          if (hasItem) {
            matchingOrder = orderData;
          }
        }
      }
    }

    // 2. Lookup by Customer Email
    if (!matchingOrder && email) {
      const q = query(
        collection(db, 'orders'),
        where('customer.email', '==', email)
      );
      const snap = await getDocs(q).catch(() => null);
      if (snap && !snap.empty) {
        for (const d of snap.docs) {
          const orderData = d.data();
          const isPaid = orderData.status === 'completed' || orderData.payment_status === 'PAID' || orderData.razorpay_verified === true;
          if (isPaid) {
            const items: any[] = Array.isArray(orderData.items) ? orderData.items : [];
            const hasItem = items.some((it) => {
              const itId = String(it.id || '').trim();
              const itSlug = String(it.slug || '').trim().toLowerCase();
              const itTitle = String(it.title || '').trim().toLowerCase();
              return (
                (productId && (itId === productId || itId.includes(productId) || productId.includes(itId))) ||
                (slug && (itSlug === slug || itId.includes(slug) || slug.includes(itId))) ||
                (title && (itTitle.includes(title) || title.includes(itTitle)))
              );
            });
            if (hasItem) {
              matchingOrder = orderData;
              break;
            }
          }
        }
      }
    }

    if (!matchingOrder) {
      return NextResponse.json({
        success: true,
        unlocked: false,
        message: 'No completed purchase found for this product with the provided email or Order ID.',
      });
    }

    // Resolve secure Google Drive download links
    const resolved = await resolveDriveFilesForProduct({
      id: productId,
      slug,
      title: title || matchingOrder.items?.[0]?.title,
    });

    return NextResponse.json({
      success: true,
      unlocked: true,
      orderNumber: matchingOrder.orderNumber || orderId,
      customerEmail: matchingOrder.customer?.email,
      driveLink: resolved.primaryLink,
      files: resolved.files,
      thumbnail: resolved.thumbnail,
      resolution: resolved.resolution || '1080P FULL HD',
      format: resolved.format || 'MP4 Video',
    });
  } catch (err: any) {
    console.error('Error in product unlock API:', err);
    return NextResponse.json({ success: false, unlocked: false, error: err.message }, { status: 500 });
  }
}
