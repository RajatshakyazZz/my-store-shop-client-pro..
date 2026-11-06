import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { sendAbandonedOrPendingTelegramAlert, sendSaleSuccessTelegramAlert } from '@/lib/telegram';
import { sendResellerSaleTelegramAlert } from '@/lib/telegramReseller';
import { getResellerListingBySlug, getResellerProfile, getResellerWallet, recordSaleEarning } from '@/lib/resellerService';
import { calculateCouponDiscount } from '@/lib/coupon';
import { extractClientMetadata, generateOrderToken } from '@/lib/orderToken';
import { resolveDriveFilesForProduct } from '@/lib/productDriveResolver';
import { sendMetaCapiPurchase } from '@/lib/metaCapi';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderNumber, customer, items, orderBump, totalAmount, resellerSlug, couponCode } = body;

    // 1. Maintenance mode check
    if (db) {
      try {
        const modeSnap = await getDoc(doc(db, 'store_settings', 'site_mode'));
        if (modeSnap.exists() && modeSnap.data()?.mode === 'MAINTENANCE') {
          return NextResponse.json(
            {
              success: false,
              error:
                modeSnap.data()?.maintenance_message ||
                'Store is currently under scheduled maintenance. Orders are temporarily paused. Please check back shortly.',
            },
            { status: 503 }
          );
        }
      } catch (err) {
        console.warn('Site mode check error:', err);
      }
    }

    const cleanEmail = String(customer?.email || '').trim().toLowerCase();
    const cleanPhone = String(customer?.phone || '').replace(/\D/g, '');
    const cleanName = String(customer?.fullName || '').trim();

    if (!orderNumber || !cleanEmail || !totalAmount) {
      return NextResponse.json(
        { success: false, error: 'Missing required order details' },
        { status: 400 }
      );
    }

    if (!cleanEmail.endsWith('@gmail.com') || cleanEmail.slice(0, -10).length < 3) {
      return NextResponse.json(
        { success: false, error: 'Invalid Email! Only a valid @gmail.com address is accepted for Google Drive access.' },
        { status: 400 }
      );
    }

    if (!/^[6-9]\d{9}$/.test(cleanPhone) || /^(\d)\1{9}$/.test(cleanPhone) || cleanPhone === '9876543210') {
      return NextResponse.json(
        { success: false, error: 'Invalid Phone! Please enter a valid 10-digit WhatsApp / mobile number.' },
        { status: 400 }
      );
    }

    if (cleanName.length < 3 || !/^[a-zA-Z\s.]+$/.test(cleanName)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid full name (minimum 3 letters).' },
        { status: 400 }
      );
    }

    // 2. Server-authoritative calculations
    let finalTotalAmount = Number(totalAmount);
    let resellerAttribution: Record<string, any> = {};
    let appliedCouponDetails: any = null;

    if (resellerSlug) {
      const cleanSlug = String(resellerSlug).trim();
      let listing: any = null;
      try {
        listing = await getResellerListingBySlug(cleanSlug, true);
      } catch (rErr: any) {
        console.warn('Error resolving reseller listing during order creation:', rErr);
      }

      if (!listing) {
        return NextResponse.json(
          {
            success: false,
            error: 'Reseller listing not found or expired. Please verify the URL.',
          },
          { status: 400 }
        );
      }

      if (listing.status !== 'active') {
        return NextResponse.json(
          {
            success: false,
            error: `This reseller listing is currently ${listing.status}. Purchases cannot be completed.`,
          },
          { status: 400 }
        );
      }

      const verifiedResalePrice = Number(listing.custom_price || listing.resale_price || 0);
      const verifiedBaseCost = Number(listing.base_cost || 0);
      const verifiedMargin = Number(listing.margin || verifiedResalePrice - verifiedBaseCost);

      let expectedTotal = verifiedResalePrice;
      let orderBumpPrice = 0;
      if (orderBump) {
        orderBumpPrice = Number(orderBump.price || 0);
        expectedTotal += orderBumpPrice;
      }

      finalTotalAmount = expectedTotal;

      resellerAttribution = {
        reseller_slug: cleanSlug,
        reseller_id: listing.reseller_id,
        reseller_listing_id: listing.id,
        reseller_earning: verifiedMargin,
        reseller_base_cost: verifiedBaseCost,
        reseller_sale_price: verifiedResalePrice,
        base_price_snapshot: verifiedBaseCost,
        resale_price_snapshot: verifiedResalePrice,
      };
    }

    // Handle coupon if applied
    if (couponCode && !resellerSlug) {
      try {
        const couponRes = await calculateCouponDiscount(couponCode, finalTotalAmount);
        if (couponRes && couponRes.valid && couponRes.discountAmount) {
          finalTotalAmount = Math.max(1, finalTotalAmount - couponRes.discountAmount);
          appliedCouponDetails = {
            code: couponCode,
            discount_amount: couponRes.discountAmount,
            discount_type: couponRes.discountType || 'FIXED',
          };
        }
      } catch (cErr) {
        console.warn('Coupon calculation warning:', cErr);
      }
    }

    const orderToken = generateOrderToken(orderNumber);
    const clientMeta = extractClientMetadata(request);

    // 3. For locked manual/WhatsApp orders, do NOT expose Google Drive links in unpaid records
    const rawItems = items && items.length > 0
      ? items
      : [{ id: 'bundle', title: 'Viral Reels Bundle', price: Number(finalTotalAmount), license: 'personal' }];

    const orderItems = rawItems.map((it: any) => ({
      id: it.id || 'bundle',
      title: it.title || 'Viral Reels Bundle',
      slug: it.slug || (it as any).productSlug || '',
      license: it.license || 'personal',
      price: Number(it.price || 0),
      format: it.format || 'MP4 Video',
      resolution: it.resolution || '1080P FULL HD',
      thumbnail: it.thumbnail || it.featured_image || it.image || it.coverImage || '',
      googleDriveLink: null, // Strictly locked until payment is verified by store owner
      files: [],
    }));

    // 4. Persist PENDING / UNPAID Order to Firestore (Access Strictly Locked)
    if (db) {
      try {
        const orderRef = doc(db, 'orders', orderNumber);
        await setDoc(orderRef, {
          orderNumber,
          customer: {
            fullName: cleanName,
            email: cleanEmail,
            phone: cleanPhone,
          },
          items: orderItems,
          orderBump: orderBump || null,
          totalAmount: Number(finalTotalAmount),
          paymentMethod: 'WhatsApp UPI (Pending Manual Payment)',
          payment_status: 'UNPAID',
          status: 'pending',
          is_locked: true,
          createdAt: serverTimestamp(),
          timestampIso: new Date().toISOString(),
          purchase_event_id: `purchase_${orderNumber}`,
          purchase_event_status: 'pending',
          purchase_event_attempts: 0,
          purchase_client_fired: false,
          order_token: orderToken,
          applied_coupon: appliedCouponDetails || null,
          discount_amount: appliedCouponDetails?.discount_amount || 0,
          ...resellerAttribution,
        });
      } catch (firestoreErr) {
        console.warn('Could not save pending order to Firestore:', firestoreErr);
      }
    }

    // 5. Build official WhatsApp checkout URL with complete customer & order info
    const supportNumber = '918129797720';
    const itemsTitle = orderItems.map((i: any) => i.title).join(', ');
    const waMessage = `Hi CreatorMint! I want to purchase:\n📦 Bundle: ${itemsTitle}\n💰 Total: ₹${finalTotalAmount}.00\n🆔 Order ID: ${orderNumber}\n👤 Name: ${cleanName}\n📧 Gmail: ${cleanEmail}\n📱 Phone: ${cleanPhone}\n\nPlease share your UPI QR code / payment details so I can complete payment and get my Google Drive access.`;
    const whatsappUrl = `https://wa.me/${supportNumber}?text=${encodeURIComponent(waMessage)}`;

    // 6. Dispatch Alert to Store Owner that customer is waiting on WhatsApp to pay
    sendAbandonedOrPendingTelegramAlert(
      {
        orderNumber,
        customer: {
          fullName: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
        },
        items: orderItems,
        orderBump: orderBump || null,
        totalAmount: Number(finalTotalAmount),
        paymentStatus: 'AWAITING_UPI_PAYMENT_ON_WHATSAPP',
        paymentMethod: 'WhatsApp UPI',
      },
      'checkout_initiated'
    ).catch((tErr: any) => {
      console.warn('Telegram pending alert warning:', tErr);
    });

    return NextResponse.json({
      success: true,
      locked: true,
      status: 'pending',
      payment_status: 'UNPAID',
      order_id: orderNumber,
      order_token: orderToken,
      whatsapp_url: whatsappUrl,
      message: 'Direct automated checkout is locked. Payment required via UPI on WhatsApp.',
    });
  } catch (error: any) {
    console.error('Error creating direct order:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Order creation failed. Please try again.',
      },
      { status: 500 }
    );
  }
}
