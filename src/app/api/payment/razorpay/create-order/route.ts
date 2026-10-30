import { NextResponse } from 'next/server';
import { createRazorpayOrder, getRazorpayCredentials } from '@/lib/razorpay';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { sendAbandonedOrPendingTelegramAlert } from '@/lib/telegram';
import { generateOrderToken } from '@/lib/orderToken';
import { getResellerListingBySlug } from '@/lib/resellerService';
import { BUNDLE_PRODUCTS, ORDER_BUMP } from '@/data/bundles';
import { calculateCouponDiscount } from '@/lib/coupon';
import { fetchCustomProductBySlug } from '@/lib/customProducts';
import { fetchFreeBundleOffer } from '@/lib/freeBundleOffer';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderNumber, customer, items, orderBump, totalAmount, resellerSlug, couponCode } = body;

    // Maintenance mode enforcement
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

    // Check credentials early
    const creds = await getRazorpayCredentials();
    if (!creds.keyId || !creds.keySecret) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Razorpay gateway is not configured yet. Please enter your Razorpay Key ID & Secret in the Admin Panel (Settings & Integrations > Razorpay Gateway).',
        },
        { status: 400 }
      );
    }

    // Server-authoritative price calculation and anti-tampering enforcement
    let finalTotalAmount = Number(totalAmount);
    let resellerAttribution: Record<string, any> = {};
    let appliedCouponDetails: any = null;

    if (resellerSlug) {
      const cleanSlug = String(resellerSlug).trim();
      let listing: any = null;
      try {
        listing = await getResellerListingBySlug(cleanSlug);
      } catch (e) {
        console.warn('Error fetching reseller listing for attribution:', e);
      }

      if (listing && listing.status === 'active') {
        const expectedResellerPrice = Number(listing.resalePrice || 0);
        let expectedTotal = expectedResellerPrice;
        if (orderBump) {
          expectedTotal += Number(orderBump.discountPrice || 49);
        }

        resellerAttribution = {
          is_reseller_order: true,
          reseller_slug: cleanSlug,
          reseller_uid: listing.resellerUid,
          reseller_name: listing.resellerName || 'Partner',
          reseller_listing_id: listing.id,
          reseller_base_price: Number(listing.basePrice || 0),
          reseller_resale_price: expectedResellerPrice,
          reseller_margin: Number(listing.margin || 0),
        };

        if (expectedTotal > 0) {
          finalTotalAmount = expectedTotal;
        }
      }
    } else {
      let expectedCatalogTotal = 0;
      if (Array.isArray(items)) {
        for (const it of items) {
          const catProduct = BUNDLE_PRODUCTS.find((p) => p.id === it.id || p.slug === it.slug);
          if (catProduct) {
            const expectedItemPrice = it.license === 'reseller' ? catProduct.resellerPrice : catProduct.personalPrice;
            expectedCatalogTotal += expectedItemPrice;
          } else {
            const customProd = await fetchCustomProductBySlug(it.slug || it.id);
            if (customProd) {
              const expectedItemPrice = it.license === 'reseller' ? customProd.resellerPrice : customProd.personalPrice;
              expectedCatalogTotal += expectedItemPrice;
            } else {
              expectedCatalogTotal += Number(it.price || 0);
            }
          }
        }
      }

      if (orderBump) {
        expectedCatalogTotal += Number(ORDER_BUMP?.discountPrice || orderBump.discountPrice || 49);
      }

      // Check coupon
      if (couponCode) {
        const cleanCode = String(couponCode).trim().toUpperCase();
        const couponResult = await calculateCouponDiscount(cleanCode, expectedCatalogTotal);
        if (couponResult.isValid && couponResult.discountAmount > 0) {
          expectedCatalogTotal = Math.max(1, expectedCatalogTotal - couponResult.discountAmount);
          appliedCouponDetails = {
            code: couponResult.code,
            discount_type: couponResult.discountType,
            discount_amount: couponResult.discountAmount,
            discount_percent: couponResult.discountPercent || null,
          };
        }
      }

      if (expectedCatalogTotal > 0) {
        finalTotalAmount = expectedCatalogTotal;
      }
    }

    if (finalTotalAmount < 1) {
      return NextResponse.json(
        { success: false, error: 'Invalid order amount (minimum ₹1 required).' },
        { status: 400 }
      );
    }

    const orderToken = generateOrderToken(orderNumber);

    const firstItemTitle = items && items[0]?.title
      ? String(items[0].title).replace(/[^a-zA-Z0-9\s_-]/g, ' ')
      : 'Ztore Digital Reels Bundle';

    // 1. Create Razorpay Order on Razorpay's API
    const { order: rzpOrder } = await createRazorpayOrder({
      orderId: orderNumber,
      orderAmount: Number(finalTotalAmount),
      customer: {
        fullName: cleanName || 'Customer',
        email: cleanEmail,
        phone: cleanPhone || '9999999999',
      },
      productInfo: firstItemTitle.slice(0, 100),
      notes: {
        order_token: orderToken,
        reseller_slug: resellerSlug ? String(resellerSlug).slice(0, 50) : '',
        coupon_code: couponCode ? String(couponCode).slice(0, 30) : '',
      },
    });

    // 2. Persist Pending Order to Firestore
    if (db) {
      try {
        const orderRef = doc(db, 'orders', orderNumber);
        await setDoc(orderRef, {
          orderNumber,
          customer: {
            fullName: cleanName || 'Customer',
            email: cleanEmail,
            phone: cleanPhone || '',
          },
          items: items && items.length > 0 ? items : [{ id: 'bundle', title: 'Viral Reels Bundle', price: Number(finalTotalAmount), license: 'personal' }],
          orderBump: orderBump || null,
          totalAmount: Number(finalTotalAmount),
          paymentMethod: 'Razorpay Payment Gateway',
          transactionId: String(orderNumber).slice(0, 95),
          razorpay_order_id: rzpOrder.id,
          status: 'pending',
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

    // 3. Dispatch Instant Telegram Alert for Checkout Started (non-blocking)
    sendAbandonedOrPendingTelegramAlert(
      {
        orderNumber,
        customer: {
          fullName: cleanName || 'Customer',
          email: cleanEmail,
          phone: cleanPhone || '',
        },
        items: items || [],
        orderBump: orderBump || null,
        totalAmount: Number(finalTotalAmount),
        paymentStatus: 'CHECKOUT_STARTED',
        paymentMethod: 'Razorpay India (UPI / Card / NetBanking)',
      },
      'checkout_initiated'
    ).catch((tErr) => {
      console.warn('Non-blocking Telegram alert warning:', tErr);
    });

    return NextResponse.json({
      success: true,
      gateway: 'razorpay',
      order_id: orderNumber,
      razorpay_order_id: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency || 'INR',
      key_id: creds.keyId,
      order_token: orderToken,
      customer: {
        name: cleanName,
        email: cleanEmail,
        contact: cleanPhone,
      },
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Payment initiation failed. Please check Razorpay credentials in Admin Panel.',
      },
      { status: 500 }
    );
  }
}
