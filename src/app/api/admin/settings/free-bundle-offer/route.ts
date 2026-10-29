import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { DEFAULT_FREE_BUNDLE_OFFER, FreeBundleOfferConfig } from '@/lib/freeBundleOffer';

export const runtime = 'nodejs';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-key',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  try {
    let offer: FreeBundleOfferConfig = { ...DEFAULT_FREE_BUNDLE_OFFER };

    if (db) {
      try {
        const snap = await getDoc(doc(db, 'store_settings', 'free_bundle_offer')).catch(() => null);
        if (snap && snap.exists()) {
          const data = snap.data();
          const minVal = data.min_cart_value != null ? Number(data.min_cart_value) : DEFAULT_FREE_BUNDLE_OFFER.minCartValue;
          const freeQty = data.free_bundle_quantity != null ? Number(data.free_bundle_quantity) : DEFAULT_FREE_BUNDLE_OFFER.freeBundleQuantity;

          offer = {
            enabled: typeof data.enabled === 'boolean' ? data.enabled : true,
            bannerImage: data.banner_image || DEFAULT_FREE_BUNDLE_OFFER.bannerImage,
            bannerFallbackImage: data.banner_fallback_image || DEFAULT_FREE_BUNDLE_OFFER.bannerFallbackImage,
            minCartValue: minVal,
            freeBundleQuantity: freeQty,
            headline: data.headline || `Get ${freeQty} of Any Bundle FREE`,
            subheadline: data.subheadline || `PAY ₹${minVal} OR MORE & PICK ANY ${freeQty} ADDITIONAL REELS BUNDLES AT NO EXTRA COST!`,
            buttonText: data.button_text || `🎁 Claim ${freeQty} Free Bundles on Min. ₹${minVal} Order →`,
            updatedAt: data.updated_at || data.updatedAt,
          };
          return NextResponse.json({ success: true, offer }, { headers: CORS_HEADERS });
        }

        const genSnap = await getDoc(doc(db, 'store_settings', 'general')).catch(() => null);
        if (genSnap && genSnap.exists()) {
          const gData = genSnap.data();
          if (gData.free_bundle_offer && typeof gData.free_bundle_offer === 'object') {
            const f = gData.free_bundle_offer;
            const minVal = f.min_cart_value != null ? Number(f.min_cart_value) : DEFAULT_FREE_BUNDLE_OFFER.minCartValue;
            const freeQty = f.free_bundle_quantity != null ? Number(f.free_bundle_quantity) : DEFAULT_FREE_BUNDLE_OFFER.freeBundleQuantity;

            offer = {
              enabled: typeof f.enabled === 'boolean' ? f.enabled : true,
              bannerImage: f.banner_image || DEFAULT_FREE_BUNDLE_OFFER.bannerImage,
              bannerFallbackImage: f.banner_fallback_image || DEFAULT_FREE_BUNDLE_OFFER.bannerFallbackImage,
              minCartValue: minVal,
              freeBundleQuantity: freeQty,
              headline: f.headline || `Get ${freeQty} of Any Bundle FREE`,
              subheadline: f.subheadline || `PAY ₹${minVal} OR MORE & PICK ANY ${freeQty} ADDITIONAL REELS BUNDLES AT NO EXTRA COST!`,
              buttonText: f.button_text || `🎁 Claim ${freeQty} Free Bundles on Min. ₹${minVal} Order →`,
              updatedAt: f.updated_at,
            };
            return NextResponse.json({ success: true, offer }, { headers: CORS_HEADERS });
          }
        }
      } catch (err) {
        console.warn('Error reading store free_bundle_offer in admin API:', err);
      }
    }

    return NextResponse.json({ success: true, offer }, { headers: CORS_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: CORS_HEADERS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const enabled = typeof body.enabled === 'boolean' ? body.enabled : true;
    const banner_image = String(body.banner_image || body.bannerImage || DEFAULT_FREE_BUNDLE_OFFER.bannerImage).trim();
    const banner_fallback_image = String(body.banner_fallback_image || body.bannerFallbackImage || DEFAULT_FREE_BUNDLE_OFFER.bannerFallbackImage).trim();
    const min_cart_value = Math.max(1, Number(body.min_cart_value != null ? body.min_cart_value : (body.minCartValue != null ? body.minCartValue : 149)));
    const free_bundle_quantity = Math.max(1, Math.min(20, Number(body.free_bundle_quantity != null ? body.free_bundle_quantity : (body.freeBundleQuantity != null ? body.freeBundleQuantity : 2))));

    const headline = String(body.headline || `Get ${free_bundle_quantity} of Any Bundle FREE`).trim();
    const subheadline = String(body.subheadline || `PAY ₹${min_cart_value} OR MORE & PICK ANY ${free_bundle_quantity} ADDITIONAL REELS BUNDLES AT NO EXTRA COST!`).trim();
    const button_text = String(body.button_text || body.buttonText || `🎁 Claim ${free_bundle_quantity} Free Bundles on Min. ₹${min_cart_value} Order →`).trim();
    const updated_at = new Date().toISOString();

    const payload = {
      enabled,
      banner_image,
      banner_fallback_image,
      min_cart_value,
      free_bundle_quantity,
      headline,
      subheadline,
      button_text,
      updated_at,
    };

    if (db) {
      try {
        // Save to store_settings/general first (guaranteed permitted by firestore.rules)
        await setDoc(
          doc(db, 'store_settings', 'general'),
          {
            free_bundle_offer: payload,
          },
          { merge: true }
        );

        // Also attempt writing to dedicated document in case permitted
        try {
          await setDoc(doc(db, 'store_settings', 'free_bundle_offer'), payload, { merge: true });
        } catch {}
      } catch (err: any) {
        console.error('Error saving free bundle offer to Firestore:', err);
        return NextResponse.json(
          { success: false, error: `Firestore write error: ${err.message}` },
          { status: 500, headers: CORS_HEADERS }
        );
      }
    }

    // Log admin audit action safely
    if (db) {
      try {
        await addDoc(collection(db, 'admin_audit_logs'), {
          adminEmail: 'admin@vaultzet.com',
          action: 'UPDATE_FREE_BUNDLE_OFFER',
          module: 'COMMERCE',
          details: `Updated promotional offer: Min ₹${min_cart_value}, ${free_bundle_quantity} Free Bundles (Status: ${enabled ? 'ACTIVE' : 'OFF'})`,
          createdAt: serverTimestamp(),
        });
      } catch (auditErr) {
        console.warn('Failed to record audit log for free bundle offer update:', auditErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        offer: {
          enabled,
          bannerImage: banner_image,
          bannerFallbackImage: banner_fallback_image,
          minCartValue: min_cart_value,
          freeBundleQuantity: free_bundle_quantity,
          headline,
          subheadline,
          buttonText: button_text,
          updatedAt: updated_at,
        },
      },
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: CORS_HEADERS });
  }
}
