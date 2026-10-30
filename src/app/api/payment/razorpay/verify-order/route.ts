import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { sendSaleSuccessTelegramAlert } from '@/lib/telegram';
import { sendResellerSaleTelegramAlert } from '@/lib/telegramReseller';
import { getResellerProfile, getResellerWallet, recordSaleEarning } from '@/lib/resellerService';
import { BUNDLE_PRODUCTS } from '@/data/bundles';
import serverProductLinks from '@/data/productDriveLinks.server.json';
import { sendMetaCapiPurchase } from '@/lib/metaCapi';
import { extractClientMetadata, generateOrderToken } from '@/lib/orderToken';
import { getRazorpayCredentials, verifyRazorpaySignature } from '@/lib/razorpay';

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
            primaryLink: primaryLink || filesList[0]?.file_url || 'https://drive.google.com/drive/folders/ztore-master-access',
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

        if (matchesDocId || matchesExactName || matchesExactSlug || matchesNormName) {
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
            primaryLink: primaryLink || filesList[0]?.file_url || 'https://drive.google.com/drive/folders/ztore-master-access',
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

  // 3. Fallback to bundled server JSON links
  const linksMap = serverProductLinks as Record<string, string>;
  const matchedKey = Object.keys(linksMap).find((k) => {
    const lk = k.toLowerCase().trim();
    return (
      (cleanId && lk.includes(cleanId)) ||
      (cleanSlug && lk.includes(cleanSlug)) ||
      (cleanTitle && lk.includes(cleanTitle)) ||
      (cleanTitle && cleanTitle.includes(lk))
    );
  });

  const primaryLink = matchedKey ? linksMap[matchedKey] : 'https://drive.google.com/drive/folders/ztore-master-access';

  // 4. Catalog metadata fallback
  const catalogProd = BUNDLE_PRODUCTS.find((p) => {
    return p.id === cleanId || p.slug === cleanSlug || p.title.toLowerCase().includes(cleanTitle);
  });

  return {
    primaryLink,
    files: [{ name: `${item.title || 'Reels Bundle'} Google Drive Link`, file_url: primaryLink }],
    thumbnail: catalogProd?.thumbnail || '',
    resolution: catalogProd?.resolution || '1080P FULL HD',
    format: catalogProd?.format || 'MP4 Video',
  };
}

// -------------------------------------------------------------
// POST: Process Razorpay client verification right after modal
// -------------------------------------------------------------
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const cleanOrderId = String(orderId || body.orderNumber || '').trim();

    if (body.action === 'mark_client_fired') {
      const targetId = String(body.orderId || cleanOrderId || '').trim();
      if (db && targetId) {
        await updateDoc(doc(db, 'orders', targetId), {
          client_pixel_fired: true,
          client_pixel_fired_at: serverTimestamp(),
        }).catch(() => null);
      }
      return NextResponse.json({ success: true, marked: true });
    }

    if (!cleanOrderId) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }

    const creds = await getRazorpayCredentials();

    // Verify signature if provided
    let isSignatureValid = false;
    if (razorpay_order_id && razorpay_payment_id && razorpay_signature && creds.keySecret) {
      isSignatureValid = verifyRazorpaySignature({
        razorpayOrderId: String(razorpay_order_id).trim(),
        razorpayPaymentId: String(razorpay_payment_id).trim(),
        razorpaySignature: String(razorpay_signature).trim(),
        keySecret: creds.keySecret,
      });
    }

    let storedOrder: any = null;
    if (db) {
      try {
        const orderSnap = await getDoc(doc(db, 'orders', cleanOrderId));
        if (orderSnap.exists()) {
          storedOrder = orderSnap.data();
        }
      } catch (err) {
        console.warn('Error reading order from Firestore:', err);
      }
    }

    const isAlreadyPaid = storedOrder?.status === 'completed' || storedOrder?.paid === true;

    if (!isSignatureValid && !isAlreadyPaid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Razorpay payment signature verification failed. Please contact support if amount was deducted.',
        },
        { status: 400 }
      );
    }

    // Mark as completed in Firestore
    if (db && !isAlreadyPaid) {
      try {
        await updateDoc(doc(db, 'orders', cleanOrderId), {
          status: 'completed',
          paid: true,
          payment_status: 'SUCCESS',
          paymentMethod: 'Razorpay Payment Gateway',
          razorpay_payment_id: razorpay_payment_id || storedOrder?.razorpay_payment_id || '',
          razorpay_order_id: razorpay_order_id || storedOrder?.razorpay_order_id || '',
          razorpay_signature: razorpay_signature || '',
          paid_at: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (uErr) {
        console.warn('Error updating order to completed in Firestore:', uErr);
      }
    }

    // If reseller order, record earnings and dispatch reseller Telegram alert
    if (storedOrder?.is_reseller_order && storedOrder?.reseller_uid && !isAlreadyPaid) {
      try {
        const marginEarned = Number(storedOrder.reseller_margin || 0);
        if (marginEarned > 0) {
          await recordSaleEarning({
            resellerUid: storedOrder.reseller_uid,
            orderId: cleanOrderId,
            listingId: storedOrder.reseller_listing_id || '',
            productTitle: storedOrder.items?.[0]?.title || 'Viral Reels Bundle',
            sellingPrice: Number(storedOrder.reseller_resale_price || storedOrder.totalAmount),
            basePrice: Number(storedOrder.reseller_base_price || 0),
            marginEarned,
            customerName: storedOrder.customer?.fullName || 'Customer',
            customerEmail: storedOrder.customer?.email || '',
          });

          const profile = await getResellerProfile(storedOrder.reseller_uid);
          const wallet = await getResellerWallet(storedOrder.reseller_uid);
          sendResellerSaleTelegramAlert({
            orderId: cleanOrderId,
            resellerUid: storedOrder.reseller_uid,
            resellerName: storedOrder.reseller_name || profile?.displayName || 'Partner',
            resellerEmail: profile?.email || '',
            resellerPhone: profile?.phone || '',
            productTitle: storedOrder.items?.[0]?.title || 'Viral Reels Bundle',
            resalePrice: Number(storedOrder.reseller_resale_price || storedOrder.totalAmount),
            basePrice: Number(storedOrder.reseller_base_price || 0),
            marginEarned,
            customerName: storedOrder.customer?.fullName || 'Customer',
            customerEmail: storedOrder.customer?.email || '',
            walletBalance: wallet?.availableBalance || marginEarned,
          }).catch((err) => console.warn('Reseller Telegram alert error:', err));
        }
      } catch (rErr) {
        console.error('Error recording reseller earnings:', rErr);
      }
    }

    // Send store Telegram sale alert if not sent already
    if (!isAlreadyPaid) {
      sendSaleSuccessTelegramAlert({
        orderNumber: cleanOrderId,
        customer: storedOrder?.customer || { fullName: 'Customer', email: '', phone: '' },
        items: storedOrder?.items || [],
        orderBump: storedOrder?.orderBump || null,
        totalAmount: Number(storedOrder?.totalAmount || 0),
        paymentMethod: 'Razorpay India (UPI / Card / NetBanking)',
      }).catch((tErr) => console.warn('Telegram sale alert error:', tErr));
    }

    // Send server-side Meta Conversions API (CAPI) purchase event
    const clientMeta = extractClientMetadata(request);
    sendMetaCapiPurchase({
      orderId: cleanOrderId,
      totalAmount: Number(storedOrder?.totalAmount || 0),
      currency: 'INR',
      items: storedOrder?.items || [],
      customer: storedOrder?.customer,
      clientIp: clientMeta?.clientIp,
      clientUserAgent: clientMeta?.clientUserAgent,
      fbp: clientMeta?.fbp,
      fbc: clientMeta?.fbc,
    }).catch((capiErr) => console.warn('Meta CAPI purchase event warning:', capiErr));

    // Resolve secure download links
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
          image: resolvedThumb,
          resolution: it.resolution || resolved.resolution || '1080P FULL HD',
          format: it.format || resolved.format || 'MP4 Video',
        };
      })
    );

    let resolvedBump: any = null;
    if (storedOrder?.orderBump) {
      const bumpDrive = await resolveDriveFilesForProduct(storedOrder.orderBump);
      const bumpThumb =
        storedOrder.orderBump.thumbnail ||
        storedOrder.orderBump.featured_image ||
        storedOrder.orderBump.image ||
        bumpDrive.thumbnail ||
        '';

      resolvedBump = {
        ...storedOrder.orderBump,
        googleDriveLink: bumpDrive.primaryLink || storedOrder.orderBump.googleDriveLink || 'https://drive.google.com/drive/folders/bonus-pack-twisted-world',
        files: bumpDrive.files,
        thumbnail: bumpThumb,
        featured_image: bumpThumb,
        image: bumpThumb,
      };
    }

    const orderToken = generateOrderToken(cleanOrderId);

    return NextResponse.json({
      success: true,
      paid: true,
      order_status: 'PAID',
      orderNumber: cleanOrderId,
      orderId: cleanOrderId,
      order_amount: storedOrder?.totalAmount || 0,
      customer: storedOrder?.customer || { fullName: 'Customer', email: '' },
      items: verifiedItems,
      hasBump: Boolean(storedOrder?.orderBump),
      orderBump: resolvedBump,
      order_token: orderToken,
    });
  } catch (error: any) {
    console.error('Error verifying Razorpay order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}

// -------------------------------------------------------------
// GET: Status check for Order Success page & polling fallback
// -------------------------------------------------------------
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id') || searchParams.get('orderId');
    const token = searchParams.get('token');

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }

    const cleanOrderId = String(orderId).trim();

    let storedOrder: any = null;
    if (db) {
      try {
        const orderSnap = await getDoc(doc(db, 'orders', cleanOrderId));
        if (orderSnap.exists()) {
          storedOrder = orderSnap.data();
        }
      } catch (err) {
        console.warn('Error reading order from Firestore:', err);
      }
    }

    const isPaid = storedOrder?.status === 'completed' || storedOrder?.paid === true;

    if (!isPaid) {
      return NextResponse.json({
        success: false,
        paid: false,
        order_status: storedOrder?.status || 'PENDING',
        orderNumber: cleanOrderId,
        message: 'Payment is being processed. Please wait...',
      });
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
          image: resolvedThumb,
          resolution: it.resolution || resolved.resolution || '1080P FULL HD',
          format: it.format || resolved.format || 'MP4 Video',
        };
      })
    );

    let resolvedBump: any = null;
    if (storedOrder?.orderBump) {
      const bumpDrive = await resolveDriveFilesForProduct(storedOrder.orderBump);
      const bumpThumb =
        storedOrder.orderBump.thumbnail ||
        storedOrder.orderBump.featured_image ||
        storedOrder.orderBump.image ||
        bumpDrive.thumbnail ||
        '';

      resolvedBump = {
        ...storedOrder.orderBump,
        googleDriveLink: bumpDrive.primaryLink || storedOrder.orderBump.googleDriveLink || 'https://drive.google.com/drive/folders/bonus-pack-twisted-world',
        files: bumpDrive.files,
        thumbnail: bumpThumb,
        featured_image: bumpThumb,
        image: bumpThumb,
      };
    }

    const validToken = generateOrderToken(cleanOrderId);
    const eligibleForBrowserEvent = !Boolean(storedOrder?.client_pixel_fired);

    return NextResponse.json({
      success: true,
      paid: true,
      order_status: 'PAID',
      orderNumber: cleanOrderId,
      orderId: cleanOrderId,
      order_amount: storedOrder?.totalAmount || 0,
      customer: storedOrder?.customer || { fullName: 'Customer', email: '' },
      items: verifiedItems,
      hasBump: Boolean(storedOrder?.orderBump),
      orderBump: resolvedBump,
      order_token: validToken,
      purchase_event_id: `purchase_${cleanOrderId}`,
      eligible_for_browser_event: eligibleForBrowserEvent,
    });
  } catch (error: any) {
    console.error('Error fetching Razorpay order verification:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Verification lookup failed' },
      { status: 500 }
    );
  }
}
