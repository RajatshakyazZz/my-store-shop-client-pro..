import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { generateOrderToken } from '@/lib/orderToken';
import { resolveDriveFilesForProduct } from '@/lib/productDriveResolver';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id') || searchParams.get('orderId') || '';
    const token = searchParams.get('token') || '';

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Missing order_id' }, { status: 400 });
    }

    let storedOrder: any = null;
    if (db) {
      try {
        const snap = await getDoc(doc(db, 'orders', orderId));
        if (snap.exists()) {
          storedOrder = snap.data();
        } else {
          // Check fallback record
          const fallbackSnap = await getDoc(doc(db, 'order_success_records', orderId));
          if (fallbackSnap.exists()) {
            storedOrder = fallbackSnap.data();
          }
        }
      } catch (e) {
        console.warn('[Orders Verify] Firestore lookup warning:', e);
      }
    }

    if (!storedOrder) {
      return NextResponse.json(
        { success: false, verified: false, paid: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    const isPaid =
      storedOrder.status === 'completed' ||
      storedOrder.payment_status === 'PAID' ||
      storedOrder.razorpay_verified === true;

    if (!isPaid) {
      return NextResponse.json({
        success: false,
        verified: false,
        paid: false,
        order_id: orderId,
        status: storedOrder.status || 'pending',
        message: 'Order is pending completion',
      });
    }

    const validToken = generateOrderToken(orderId);
    const isClientFired = storedOrder.purchase_client_fired === true;

    // Resolve secure Google Drive download links
    const rawItems = storedOrder.items && storedOrder.items.length > 0
      ? storedOrder.items
      : [{ id: 'bundle', title: 'Viral Reels Bundle', license: 'personal' }];

    const verifiedItems = await Promise.all(
      rawItems.map(async (it: any) => {
        const resolved = await resolveDriveFilesForProduct(it);
        const resolvedThumb =
          it.thumbnail ||
          it.featured_image ||
          it.image ||
          it.coverImage ||
          resolved.thumbnail ||
          '';

        return {
          id: it.id || 'bundle',
          title: it.title || 'Viral Reels Bundle',
          slug: it.slug || (it as any).productSlug || '',
          license: it.license || 'personal',
          price: Number(it.price || 0),
          format: resolved.format || it.format || 'MP4 Video',
          resolution: resolved.resolution || it.resolution || '1080P FULL HD',
          thumbnail: resolvedThumb,
          featured_image: resolvedThumb,
          googleDriveLink: resolved.primaryLink,
          files: resolved.files,
          access_instructions: [
            'Click the Google Drive link to access your complete bundle folder instantly.',
            'You can download individual video files or save the entire folder directly to your Drive.',
            'Keep your checkout email saved — you can re-access all files anytime via the My Orders portal.',
          ],
        };
      })
    );

    return NextResponse.json({
      success: true,
      verified: true,
      paid: true,
      order_id: orderId,
      order: {
        orderNumber: orderId,
        customer: storedOrder.customer || {},
        items: verifiedItems,
        orderBump: storedOrder.orderBump || null,
        totalAmount: storedOrder.totalAmount || 0,
        paymentStatus: 'PAID',
        paymentMethod: storedOrder.paymentMethod || 'Direct Instant Access',
        orderToken: storedOrder.order_token || validToken,
        createdAt: storedOrder.createdAt || storedOrder.timestampIso || new Date().toISOString(),
      },
      clientMeta: {
        shouldFireClientPixel: !isClientFired,
      },
    });
  } catch (error: any) {
    console.error('Error verifying order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, orderId, token } = body;

    if (action === 'mark_client_fired' && orderId && db) {
      try {
        await updateDoc(doc(db, 'orders', orderId), {
          purchase_client_fired: true,
          purchase_client_fired_at: new Date().toISOString(),
        });
        return NextResponse.json({ success: true, updated: true });
      } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
