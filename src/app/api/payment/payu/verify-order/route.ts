import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { sendSaleSuccessTelegramAlert } from '@/lib/telegram';
import { sendResellerSaleTelegramAlert } from '@/lib/telegramReseller';
import { getResellerProfile, getResellerWallet, recordSaleEarning } from '@/lib/resellerService';
import { BUNDLE_PRODUCTS } from '@/data/bundles';
import serverProductLinks from '@/data/productDriveLinks.server.json';
import { sendMetaCapiPurchase } from '@/lib/metaCapi';
import { extractClientMetadata, generateOrderToken } from '@/lib/orderToken';

export const runtime = 'nodejs';

interface ResolvedProductFiles {
  primaryLink: string;
  files: Array<{ id?: string; name: string; file_url: string }>;
}

async function resolveDriveFilesForProduct(item: { id?: string; title?: string }): Promise<ResolvedProductFiles> {
  const cleanId = String(item.id || '').trim();
  const cleanTitle = String(item.title || '').trim().toLowerCase();

  // 1. Check Firestore products collection directly
  if (db && cleanId) {
    try {
      const snap = await getDoc(doc(db, 'products', cleanId));
      if (snap.exists()) {
        const data = snap.data();
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

        if (filesList.length > 0 || (primaryLink && primaryLink.startsWith('http'))) {
          return {
            primaryLink: primaryLink || filesList[0]?.file_url,
            files:
              filesList.length > 0
                ? filesList
                : [{ name: `${item.title || 'Reels Bundle'} Google Drive Access`, file_url: primaryLink }],
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
      for (const d of snap.docs) {
        const data = d.data();
        const matchesName = data.name && data.name.toLowerCase() === cleanTitle;
        const matchesSlug = data.slug && (data.slug === cleanId || cleanTitle.includes(data.slug));
        if (matchesName || matchesSlug) {
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

          if (filesList.length > 0 || (primaryLink && primaryLink.startsWith('http'))) {
            return {
              primaryLink: primaryLink || filesList[0]?.file_url,
              files:
                filesList.length > 0
                  ? filesList
                  : [{ name: `${data.name || item.title || 'Reels Bundle'} Google Drive Access`, file_url: primaryLink }],
            };
          }
        }
      }
    } catch (e) {
      console.warn('Error scanning Firestore products for drive link:', e);
    }
  }

  // 2.5 Check server-side master product drive links registry
  try {
    const pdl = (serverProductLinks as any)?.byId?.[cleanId] ||
      (serverProductLinks as any)?.byId?.[`rb-${cleanId}`] ||
      (serverProductLinks as any)?.bySlug?.[cleanId];
    if (pdl && pdl.primaryLink && !pdl.primaryLink.includes('/demo-')) {
      return {
        primaryLink: pdl.primaryLink,
        files: pdl.files && pdl.files.length > 0 ? pdl.files : [{ name: `${pdl.title || item.title || 'Reels Bundle'} Google Drive Access`, file_url: pdl.primaryLink }],
      };
    }
  } catch (e) {
    console.warn('Error reading serverProductLinks:', e);
  }

  // 3. Fallback to internal catalog
  const matched = BUNDLE_PRODUCTS.find(
    (b) =>
      b.id === cleanId ||
      b.slug === cleanId ||
      b.title.toLowerCase() === cleanTitle ||
      (cleanTitle && cleanTitle.includes(b.slug))
  );

  const matchedLink = matched?.googleDriveLink || 'https://drive.google.com/drive/folders/vaultworld-master-access';
  const matchedFiles = Array.isArray(matched?.files) && matched.files.length > 0
    ? matched.files
    : [{ name: `${matched?.title || item.title || 'Reels Bundle'} Google Drive Access`, file_url: matchedLink }];

  return {
    primaryLink: matchedLink,
    files: matchedFiles,
  };
}

async function handleVerify(
  orderId: string,
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
      console.warn('[PayU Verify] Error reading stored order doc:', e);
    }
  }

  const validToken = generateOrderToken(orderId);
  const isPaid = storedOrder?.status === 'completed' || storedOrder?.payu_verified === true;

  if (isPaid) {
    const isClientFired = storedOrder?.purchase_client_fired === true;
    const isCapiDelivered = storedOrder?.purchase_event_status === 'delivered';

    // Send server-side Meta Conversions API (CAPI) purchase event once if not sent yet
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
        console.error('[Meta CAPI] Error dispatching event during PayU verification:', capiErr);
      }
    }

    // Resolve secure download links exclusively for paid orders
    const rawItems = storedOrder?.items && storedOrder.items.length > 0
      ? storedOrder.items
      : [{ id: 'bundle', title: 'Viral Reels Bundle', license: 'personal' }];

    const verifiedItems = await Promise.all(
      rawItems.map(async (it: any) => {
        const resolved = await resolveDriveFilesForProduct(it);
        return {
          id: it.id,
          title: it.title,
          license: it.license || 'personal',
          googleDriveLink: resolved.primaryLink,
          files: resolved.files,
          thumbnail: it.thumbnail,
        };
      })
    );

    const eligibleForBrowserEvent = !isClientFired;

    return {
      success: true,
      paid: true,
      order_status: 'PAID',
      order_amount: storedOrder?.totalAmount || 0,
      orderNumber: orderId,
      customer: storedOrder?.customer || { fullName: 'Customer', email: '' },
      items: verifiedItems,
      hasBump: Boolean(storedOrder?.orderBump),
      purchase_event_id: `purchase_${orderId}`,
      eligible_for_browser_event: eligibleForBrowserEvent,
      order_token: storedOrder?.order_token || validToken,
      reseller_id: storedOrder?.reseller_id || null,
      reseller_slug: storedOrder?.reseller_slug || null,
      reseller_name: storedOrder?.reseller_name || null,
    };
  }

  return {
    success: false,
    paid: false,
    order_status: storedOrder?.status || 'PENDING',
    order_amount: storedOrder?.totalAmount || 0,
    orderNumber: orderId,
    customer: storedOrder?.customer || { fullName: 'Customer', email: '' },
    items: [],
    hasBump: false,
    eligible_for_browser_event: false,
    order_token: validToken,
    error: 'Payment incomplete or pending confirmation',
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id') || searchParams.get('orderId');
    const token = searchParams.get('token');

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'order_id parameter is required' },
        { status: 400 }
      );
    }

    const clientMeta = {
      ...extractClientMetadata(request),
      token: token || undefined,
    };

    const verification = await handleVerify(orderId, clientMeta);
    return NextResponse.json(verification, { status: verification.paid ? 200 : 200 });
  } catch (error: any) {
    console.error('Error verifying PayU order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to verify PayU order' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId = body.orderId || body.order_id;
    const action = body.action;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'orderId is required' },
        { status: 400 }
      );
    }

    if (action === 'mark_client_fired') {
      if (db) {
        try {
          await updateDoc(doc(db, 'orders', orderId), {
            purchase_client_fired: true,
          });
        } catch (err) {
          console.warn('Could not mark purchase_client_fired in Firestore:', err);
        }
      }
      return NextResponse.json({ success: true, marked: true });
    }

    const clientMeta = {
      ...extractClientMetadata(request),
      token: body.token || undefined,
    };

    const verification = await handleVerify(orderId, clientMeta);
    return NextResponse.json(verification, { status: 200 });
  } catch (error: any) {
    console.error('Error verifying PayU order in POST:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to verify PayU order' },
      { status: 500 }
    );
  }
}
