import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { sendSaleSuccessTelegramAlert } from '@/lib/telegram';
import { sendResellerSaleTelegramAlert } from '@/lib/telegramReseller';
import { getResellerProfile, getResellerWallet, recordSaleEarning } from '@/lib/resellerService';
import { BUNDLE_PRODUCTS } from '@/data/bundles';
import serverProductLinks from '@/data/productDriveLinks.server.json';
import { sendMetaCapiPurchase } from '@/lib/metaCapi';
import { extractClientMetadata, generateOrderToken } from '@/lib/orderToken';
import { verifyRazorpaySignature, getRazorpayCredentials, getRazorpayOrder, getRazorpayOrderPayments } from '@/lib/razorpay';

export const runtime = 'nodejs';

interface ResolvedProductFiles {
  primaryLink: string;
  files: Array<{ id?: string; name: string; file_url: string }>;
  thumbnail?: string;
  resolution?: string;
  format?: string;
}

async function resolveDriveFilesForProduct(item: { id?: string; title?: string; slug?: string }): Promise<ResolvedProductFiles> {
  const cleanId = String(item.id || '').trim();
  const cleanSlug = String((item as any).slug || '').trim().toLowerCase();
  const cleanTitle = String(item.title || '').trim().toLowerCase();

  const getDocThumb = (docData: any): string => {
    if (!docData) return '';
    return String(
      docData.featured_image ||
      docData.thumbnail ||
      docData.image ||
      docData.coverImage ||
      (Array.isArray(docData.gallery_images) ? docData.gallery_images[0] : '') ||
      (Array.isArray(docData.images) ? docData.images[0] : '') ||
      ''
    ).trim();
  };

  // 1. Check Firestore products collection directly by ID or Slug
  if (db && (cleanId || cleanSlug)) {
    try {
      const candidates = [cleanId, cleanSlug, `rb-${cleanSlug}`, cleanId.replace(/^rb-/, '')].filter(Boolean);
      for (const targetId of candidates) {
        if (!targetId || targetId === 'bundle') continue;
        const snap = await getDoc(doc(db, 'products', targetId));
        if (snap.exists()) {
          const data = snap.data();
          const thumb = getDocThumb(data);
          const filesList: any[] = Array.isArray(data.files) && data.files.length > 0
            ? data.files
                .filter((f: any) => f && (f.file_url || f.url))
                .map((f: any, idx: number) => ({
                  id: f.id || `file-${idx + 1}`,
                  name: f.name || `Drive File ${idx + 1}`,
                  file_url: f.file_url || f.url,
                }))
            : [];

          const primaryLink =
            filesList[0]?.file_url ||
            data.google_drive_link ||
            data.googleDriveLink ||
            '';

          return {
            primaryLink: primaryLink || filesList[0]?.file_url || 'https://drive.google.com/drive/folders/ztore-digital-master-access',
            files:
              filesList.length > 0
                ? filesList
                : [{ name: `${data.name || item.title || 'Reels Bundle'} Google Drive Access`, file_url: primaryLink || 'https://drive.google.com' }],
            thumbnail: thumb,
            resolution: data.resolution || '1080P FULL HD',
            format: data.format || 'MP4 Video',
          };
        }
      }
    } catch (e) {
      console.warn('Error reading product doc for drive link:', e);
    }
  }

  // 2. Search Firestore products collection by title or slug
  if (db) {
    try {
      const snap = await getDocs(collection(db, 'products'));
      const normCleanTitle = cleanTitle.replace(/[+_\-\/\\:.,()]/g, ' ').replace(/\s+/g, ' ').trim();
      const normCleanSlug = cleanSlug.replace(/[+_\-\/\\:.,()]/g, ' ').replace(/\s+/g, ' ').trim();

      for (const d of snap.docs) {
        const data = d.data();
        const docName = String(data.name || data.title || '').toLowerCase().trim();
        const docSlug = String(data.slug || '').toLowerCase().trim();
        const normDocName = docName.replace(/[+_\-\/\\:.,()]/g, ' ').replace(/\s+/g, ' ').trim();
        const normDocSlug = docSlug.replace(/[+_\-\/\\:.,()]/g, ' ').replace(/\s+/g, ' ').trim();

        const matchesDocId = d.id === cleanId || d.id === cleanSlug || (cleanSlug && d.id.includes(cleanSlug));
        const matchesExactName = docName && (docName === cleanTitle || cleanTitle.includes(docName) || docName.includes(cleanTitle));
        const matchesExactSlug = docSlug && (docSlug === cleanId || docSlug === cleanSlug || cleanSlug.includes(docSlug) || cleanTitle.includes(docSlug));
        const matchesNormName = normDocName && (normDocName === normCleanTitle || normCleanTitle.includes(normDocName) || normDocName.includes(normCleanTitle));
        const matchesNormSlug = normDocSlug && (normDocSlug === normCleanSlug || normCleanSlug.includes(normDocSlug) || normDocName.includes(normCleanSlug));

        if (matchesDocId || matchesExactName || matchesExactSlug || matchesNormName || matchesNormSlug) {
          const thumb = getDocThumb(data);
          const filesList: any[] = Array.isArray(data.files) && data.files.length > 0
            ? data.files
                .filter((f: any) => f && (f.file_url || f.url))
                .map((f: any, idx: number) => ({
                  id: f.id || `file-${idx + 1}`,
                  name: f.name || `Drive File ${idx + 1}`,
                  file_url: f.file_url || f.url,
                }))
            : [];

          const primaryLink =
            filesList[0]?.file_url ||
            data.google_drive_link ||
            data.googleDriveLink ||
            '';

          return {
            primaryLink: primaryLink || filesList[0]?.file_url || 'https://drive.google.com/drive/folders/ztore-digital-master-access',
            files:
              filesList.length > 0
                ? filesList
                : [{ name: `${data.name || item.title || 'Reels Bundle'} Google Drive Access`, file_url: primaryLink || 'https://drive.google.com' }],
            thumbnail: thumb,
            resolution: data.resolution || '1080P FULL HD',
            format: data.format || 'MP4 Video',
          };
        }
      }
    } catch (e) {
      console.warn('Error querying products collection:', e);
    }
  }

  // 3. Fallback: Search Static BUNDLE_PRODUCTS
  const staticFound = BUNDLE_PRODUCTS.find((p) => {
    const pId = String(p.id).trim().toLowerCase();
    const pSlug = String(p.slug).trim().toLowerCase();
    const pTitle = String(p.title).trim().toLowerCase();
    return (
      (cleanId && pId === cleanId) ||
      (cleanSlug && pSlug === cleanSlug) ||
      (cleanTitle && pTitle === cleanTitle) ||
      (cleanTitle && (pTitle.includes(cleanTitle) || cleanTitle.includes(pTitle))) ||
      (cleanSlug && pSlug.includes(cleanSlug))
    );
  });

  if (staticFound) {
    const rawLink =
      (staticFound as any).googleDriveLink ||
      (staticFound as any).google_drive_link ||
      (staticFound as any).driveLink ||
      '';

    const serverLinkMap = (serverProductLinks as unknown as Record<string, any>);
    const serverMappedLink =
      (serverLinkMap[staticFound.slug]?.primaryLink || serverLinkMap[staticFound.slug]) ||
      (serverLinkMap[staticFound.id]?.primaryLink || serverLinkMap[staticFound.id]) ||
      (serverLinkMap[cleanSlug]?.primaryLink || serverLinkMap[cleanSlug]) ||
      (serverLinkMap[cleanId]?.primaryLink || serverLinkMap[cleanId]) ||
      '';

    const finalPrimary = serverMappedLink || rawLink || 'https://drive.google.com/drive/folders/ztore-digital-master-access';

    return {
      primaryLink: finalPrimary,
      files: [{ name: `${staticFound.title} Google Drive Access`, file_url: finalPrimary }],
      thumbnail: staticFound.thumbnail,
      resolution: (staticFound as any).resolution || '1080P FULL HD',
      format: (staticFound as any).format || 'MP4 Video',
    };
  }

  // 4. Server product drive links fallback map
  const serverLinkMap = (serverProductLinks as unknown as Record<string, any>);
  const serverMappedLink =
    (cleanSlug && (serverLinkMap[cleanSlug]?.primaryLink || serverLinkMap[cleanSlug])) ||
    (cleanId && (serverLinkMap[cleanId]?.primaryLink || serverLinkMap[cleanId])) ||
    '';

  const defaultLink = serverMappedLink || 'https://drive.google.com/drive/folders/ztore-digital-master-access';
  return {
    primaryLink: defaultLink,
    files: [{ name: `${item.title || 'Reels Bundle'} Google Drive Access`, file_url: defaultLink }],
    thumbnail: '',
    resolution: '1080P FULL HD',
    format: 'MP4 Video',
  };
}

async function handleVerification(
  orderId: string,
  razorpayData?: {
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
  },
  clientMeta?: {
    clientIp?: string;
    clientUserAgent?: string;
    fbp?: string;
    fbc?: string;
    token?: string;
  }
) {
  let storedOrder: any = null;
  if (db) {
    try {
      const snap = await getDoc(doc(db, 'orders', orderId));
      if (snap.exists()) {
        storedOrder = snap.data();
      }
    } catch (e) {
      console.warn('[Razorpay Verify] Error reading stored order doc:', e);
    }
  }

  const validToken = generateOrderToken(orderId);
  const creds = await getRazorpayCredentials();

  // Signature verification if razorpay signature parameters are present
  let isSignatureValid = false;
  if (
    razorpayData?.razorpayOrderId &&
    razorpayData?.razorpayPaymentId &&
    razorpayData?.razorpaySignature
  ) {
    isSignatureValid = verifyRazorpaySignature({
      razorpayOrderId: razorpayData.razorpayOrderId,
      razorpayPaymentId: razorpayData.razorpayPaymentId,
      razorpaySignature: razorpayData.razorpaySignature,
      keySecret: creds.keySecret,
    });

    if (!isSignatureValid) {
      console.error(
        `[Razorpay Signature Verification Failed] Order: ${orderId}, Razorpay Order: ${razorpayData.razorpayOrderId}, Payment: ${razorpayData.razorpayPaymentId}`
      );
      return NextResponse.json(
        { success: false, error: 'Payment signature verification failed. Please contact support.' },
        { status: 400 }
      );
    }
  }

  // Check if order was already marked as paid
  const isAlreadyPaid =
    storedOrder?.status === 'completed' ||
    storedOrder?.razorpay_verified === true;

  // Direct Razorpay API lookup if signature is absent (e.g. UPI QR scan flow)
  let isApiVerified = false;
  let resolvedPaymentId = razorpayData?.razorpayPaymentId || storedOrder?.razorpay_payment_id || '';
  const targetRzpOrderId = razorpayData?.razorpayOrderId || storedOrder?.razorpay_order_id;

  if (!isSignatureValid && !isAlreadyPaid && targetRzpOrderId) {
    try {
      const [rzpOrder, rzpPayments] = await Promise.all([
        getRazorpayOrder(targetRzpOrderId).catch(() => null),
        getRazorpayOrderPayments(targetRzpOrderId).catch(() => null),
      ]);

      const paymentsList: any[] = Array.isArray(rzpPayments?.items) ? rzpPayments.items : [];
      const capturedPayment = paymentsList.find(
        (p: any) => p && (p.status === 'captured' || p.status === 'authorized' || p.captured === true)
      );

      if (
        Boolean(capturedPayment) ||
        rzpOrder?.status === 'paid' ||
        (rzpOrder?.amount_paid != null && rzpOrder.amount_paid > 0 && rzpOrder.amount_paid >= (rzpOrder.amount || 100))
      ) {
        isApiVerified = true;
        if (capturedPayment?.id) {
          resolvedPaymentId = capturedPayment.id;
        }
      }
    } catch (checkErr) {
      console.warn('[Razorpay Verify] API status check fallback warning:', checkErr);
    }
  }

  const isConfirmedPaid = isSignatureValid || isApiVerified || isAlreadyPaid;

  if ((isSignatureValid || isApiVerified) && !isAlreadyPaid) {
    // Mark as completed in Firestore
    if (db) {
      try {
        const updatePayload: Record<string, any> = {
          status: 'completed',
          payment_status: 'PAID',
          paymentMethod: 'Razorpay (India)',
          razorpay_payment_id: resolvedPaymentId || razorpayData?.razorpayPaymentId || `pay_${Date.now()}`,
          razorpay_order_id: targetRzpOrderId || razorpayData?.razorpayOrderId,
          razorpay_signature: razorpayData?.razorpaySignature || null,
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

        // Also persist to order_success_records for instant offline recovery
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
            razorpay_payment_id: resolvedPaymentId || razorpayData?.razorpayPaymentId,
            created_at: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        console.error('[Razorpay Verify] Error updating order status in Firestore:', err);
      }
    }

    // Process Reseller Payout attribution safely
    if (storedOrder?.reseller_id && !isAlreadyPaid) {
      const baseSnapshot = Number(storedOrder.base_price_snapshot || storedOrder.reseller_base_cost || 0);
      const resaleSnapshot = Number(storedOrder.resale_price_snapshot || storedOrder.reseller_sale_price || storedOrder.totalAmount || 0);
      const maxPossibleEarning = Math.max(0, resaleSnapshot - baseSnapshot);
      const safeEarning = Math.min(Number(storedOrder.reseller_earning || storedOrder.reseller_commission || 0), maxPossibleEarning);

      if (safeEarning > 0) {
        try {
          await recordSaleEarning({
            orderId,
            resellerId: storedOrder.reseller_id,
            listingId: storedOrder.reseller_listing_id || '',
            amount: safeEarning,
            productTitle: storedOrder.items?.[0]?.title || 'Viral Reels Bundle',
            settleImmediately: true,
          });
        } catch (resellerErr) {
          console.error('[Razorpay Verify] Error recording reseller earning:', resellerErr);
        }
      }
    }

    // Send Telegram Alerts
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

    try {
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
            totalAmount: Number(storedOrder.totalAmount || 0),
            basePrice: Number(
              storedOrder.base_price_snapshot ||
                (Number(storedOrder.totalAmount || 0) - Number(storedOrder.reseller_earning || storedOrder.reseller_commission || 0))
            ),
            resellerEarning: Number(storedOrder.reseller_earning || storedOrder.reseller_commission || 0),
            customer: alertPayload.customer,
            availableBalance: wallet?.availableBalance ?? 0,
            totalEarned: wallet?.totalEarned ?? 0,
          });
        } catch (rErr) {
          console.warn('[Razorpay Verify] Fallback to standard telegram alert:', rErr);
          await sendSaleSuccessTelegramAlert(alertPayload);
        }
      } else {
        await sendSaleSuccessTelegramAlert(alertPayload);
      }
    } catch (tErr) {
      console.warn('Non-blocking Telegram sale alert warning:', tErr);
    }
  }

  // If order is paid, return verified response with Drive links
  if (isConfirmedPaid) {
    const isClientFired = storedOrder?.purchase_client_fired === true;
    const isCapiDelivered = storedOrder?.purchase_event_status === 'delivered';

    // Meta CAPI
    if (!isCapiDelivered) {
      try {
        const capiResult = await sendMetaCapiPurchase({
          orderId,
          totalAmount: Number(storedOrder?.totalAmount || 0),
          currency: 'INR',
          items: storedOrder?.items || [],
          customer: storedOrder?.customer,
          clientIp: clientMeta?.clientIp,
          clientUserAgent: clientMeta?.clientUserAgent,
          fbp: clientMeta?.fbp,
          fbc: clientMeta?.fbc,
        });

        if (capiResult.success && db) {
          try {
            await updateDoc(doc(db, 'orders', orderId), {
              purchase_event_status: 'delivered',
              purchase_event_sent_at: new Date().toISOString(),
            });
          } catch {}
        }
      } catch (capiErr) {
        console.error('[Meta CAPI] Error dispatching event during Razorpay verification:', capiErr);
      }
    }

    // Resolve secure download links exclusively for paid orders
    const rawItems = storedOrder?.items && storedOrder.items.length > 0
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
          id: it.id,
          title: it.title,
          slug: it.slug || (it as any).productSlug || '',
          license: it.license || 'personal',
          googleDriveLink: resolved.primaryLink,
          files: resolved.files,
          thumbnail: resolvedThumb,
          featured_image: resolvedThumb,
          resolution: resolved.resolution || '1080P FULL HD',
          format: resolved.format || 'MP4 Video',
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
      order_id: orderId,
      order: {
        orderNumber: orderId,
        customer: storedOrder?.customer || {},
        items: verifiedItems,
        orderBump: storedOrder?.orderBump || null,
        totalAmount: storedOrder?.totalAmount || 0,
        paymentStatus: 'PAID',
        paymentMethod: 'Razorpay',
        paymentId: razorpayData?.razorpayPaymentId || storedOrder?.razorpay_payment_id || null,
        orderToken: validToken,
        createdAt: storedOrder?.createdAt || storedOrder?.timestampIso || new Date().toISOString(),
      },
      clientMeta: {
        shouldFireClientPixel: !isClientFired,
      },
    });
  }

  // If not yet verified or pending
  return NextResponse.json({
    success: false,
    verified: false,
    order_id: orderId,
    status: storedOrder?.status || 'pending',
    message: 'Payment verification is pending or in progress.',
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId = String(body.order_id || body.orderId || body.orderNumber || '').trim();

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Missing order_id' }, { status: 400 });
    }

    const clientMeta = extractClientMetadata(request);
    const razorpayData = {
      razorpayOrderId: String(body.razorpay_order_id || '').trim(),
      razorpayPaymentId: String(body.razorpay_payment_id || '').trim(),
      razorpaySignature: String(body.razorpay_signature || '').trim(),
    };

    return await handleVerification(orderId, razorpayData, clientMeta);
  } catch (error: any) {
    console.error('Error verifying Razorpay payment:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
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

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Missing order_id' }, { status: 400 });
    }

    const clientMeta = extractClientMetadata(request);
    const razorpayData = {
      razorpayOrderId: String(searchParams.get('razorpay_order_id') || '').trim(),
      razorpayPaymentId: String(searchParams.get('razorpay_payment_id') || '').trim(),
      razorpaySignature: String(searchParams.get('razorpay_signature') || '').trim(),
    };

    return await handleVerification(orderId, razorpayData, clientMeta);
  } catch (error: any) {
    console.error('Error in GET verify Razorpay payment:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
