import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { DEFAULT_FREE_BUNDLE_OFFER, FreeBundleOfferConfig, sanitizeOfferBannerUrl } from '@/lib/freeBundleOffer';

export const runtime = 'nodejs';

export async function GET() {
  try {
    let offer: FreeBundleOfferConfig = { ...DEFAULT_FREE_BUNDLE_OFFER };

    if (db) {
      try {
        const genSnap = await getDoc(doc(db, 'store_settings', 'general')).catch(() => null);
        if (genSnap && genSnap.exists()) {
          const gData = genSnap.data();
          if (gData.free_bundle_offer && typeof gData.free_bundle_offer === 'object') {
            const f = gData.free_bundle_offer;
            const minVal = f.min_cart_value != null ? Number(f.min_cart_value) : DEFAULT_FREE_BUNDLE_OFFER.minCartValue;
            const freeQty = f.free_bundle_quantity != null ? Number(f.free_bundle_quantity) : DEFAULT_FREE_BUNDLE_OFFER.freeBundleQuantity;

            offer = {
              enabled: typeof f.enabled === 'boolean' ? f.enabled : true,
              bannerImage: sanitizeOfferBannerUrl(f.banner_image),
              bannerFallbackImage: sanitizeOfferBannerUrl(f.banner_fallback_image),
              minCartValue: minVal,
              freeBundleQuantity: freeQty,
              headline: f.headline || `Get ${freeQty} of Any Bundle FREE`,
              subheadline: f.subheadline || `PAY ₹${minVal} OR MORE & PICK ANY ${freeQty} ADDITIONAL REELS BUNDLES AT NO EXTRA COST!`,
              buttonText: f.button_text || `🎁 Claim ${freeQty} Free Bundles on Min. ₹${minVal} Order →`,
              updatedAt: f.updated_at,
            };
            return NextResponse.json({ success: true, offer });
          }
        }

        const snap = await getDoc(doc(db, 'store_settings', 'free_bundle_offer')).catch(() => null);
        if (snap && snap.exists()) {
          const data = snap.data();
          const minVal = data.min_cart_value != null ? Number(data.min_cart_value) : DEFAULT_FREE_BUNDLE_OFFER.minCartValue;
          const freeQty = data.free_bundle_quantity != null ? Number(data.free_bundle_quantity) : DEFAULT_FREE_BUNDLE_OFFER.freeBundleQuantity;

          offer = {
            enabled: typeof data.enabled === 'boolean' ? data.enabled : true,
            bannerImage: sanitizeOfferBannerUrl(data.banner_image),
            bannerFallbackImage: sanitizeOfferBannerUrl(data.banner_fallback_image),
            minCartValue: minVal,
            freeBundleQuantity: freeQty,
            headline: data.headline || `Get ${freeQty} of Any Bundle FREE`,
            subheadline: data.subheadline || `PAY ₹${minVal} OR MORE & PICK ANY ${freeQty} ADDITIONAL REELS BUNDLES AT NO EXTRA COST!`,
            buttonText: data.button_text || `🎁 Claim ${freeQty} Free Bundles on Min. ₹${minVal} Order →`,
            updatedAt: data.updated_at || data.updatedAt,
          };
          return NextResponse.json({ success: true, offer });
        }
      } catch (err) {
        console.warn('Error reading free_bundle_offer in public settings API:', err);
      }
    }

    return NextResponse.json({ success: true, offer });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
