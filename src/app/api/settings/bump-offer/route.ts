import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { DEFAULT_GLOBAL_BUMP, GlobalBumpOfferConfig } from '@/lib/bumpOffer';

export const runtime = 'nodejs';

export async function GET() {
  try {
    let bumpOffer: GlobalBumpOfferConfig = { ...DEFAULT_GLOBAL_BUMP };

    if (db) {
      try {
        const snap = await getDoc(doc(db, 'store_settings', 'bump_offer')).catch(() => null);
        if (snap && snap.exists()) {
          const data = snap.data();
          const discountPercentage =
            data.regular_price && data.price
              ? Math.max(1, Math.round(((Number(data.regular_price) - Number(data.price)) / Number(data.regular_price)) * 100))
              : data.discount_percentage || 80;

          bumpOffer = {
            enabled: typeof data.enabled === 'boolean' ? data.enabled : (data.bump_enabled ?? true),
            bumpType: data.bump_type || data.bumpType || (data.product_slug ? 'store_product' : 'custom'),
            productId: data.product_id || data.bump_product_id || DEFAULT_GLOBAL_BUMP.productId,
            productSlug: data.product_slug || data.bump_product_slug || DEFAULT_GLOBAL_BUMP.productSlug,
            title: data.title || data.bump_title || DEFAULT_GLOBAL_BUMP.title,
            subtitle: data.subtitle || data.bump_subtitle || DEFAULT_GLOBAL_BUMP.subtitle,
            price: data.price != null ? Number(data.price) : DEFAULT_GLOBAL_BUMP.price,
            regularPrice: data.regular_price != null ? Number(data.regular_price) : DEFAULT_GLOBAL_BUMP.regularPrice,
            discountPercentage,
            thumbnail: data.thumbnail || data.bump_thumbnail || DEFAULT_GLOBAL_BUMP.thumbnail,
            reelCount: data.reel_count != null ? Number(data.reel_count) : DEFAULT_GLOBAL_BUMP.reelCount,
            googleDriveLink: data.google_drive_link || data.googleDriveLink || DEFAULT_GLOBAL_BUMP.googleDriveLink,
            updatedAt: data.updated_at || data.updatedAt,
          };
          return NextResponse.json({ success: true, bumpOffer });
        }

        const genSnap = await getDoc(doc(db, 'store_settings', 'general')).catch(() => null);
        if (genSnap && genSnap.exists()) {
          const gData = genSnap.data();
          if (gData.bump_offer && typeof gData.bump_offer === 'object') {
            const b = gData.bump_offer;
            const discountPercentage =
              b.regular_price && b.price
                ? Math.max(1, Math.round(((Number(b.regular_price) - Number(b.price)) / Number(b.regular_price)) * 100))
                : b.discount_percentage || 80;

            bumpOffer = {
              enabled: typeof b.enabled === 'boolean' ? b.enabled : true,
              productId: b.product_id || DEFAULT_GLOBAL_BUMP.productId,
              productSlug: b.product_slug || DEFAULT_GLOBAL_BUMP.productSlug,
              title: b.title || DEFAULT_GLOBAL_BUMP.title,
              subtitle: b.subtitle || DEFAULT_GLOBAL_BUMP.subtitle,
              price: b.price != null ? Number(b.price) : DEFAULT_GLOBAL_BUMP.price,
              regularPrice: b.regular_price != null ? Number(b.regular_price) : DEFAULT_GLOBAL_BUMP.regularPrice,
              discountPercentage,
              thumbnail: b.thumbnail || DEFAULT_GLOBAL_BUMP.thumbnail,
              reelCount: b.reel_count != null ? Number(b.reel_count) : DEFAULT_GLOBAL_BUMP.reelCount,
              googleDriveLink: b.google_drive_link || DEFAULT_GLOBAL_BUMP.googleDriveLink,
            };
            return NextResponse.json({ success: true, bumpOffer });
          }
        }
      } catch (err) {
        console.warn('Error reading store bump offer in API route:', err);
      }
    }

    return NextResponse.json({ success: true, bumpOffer });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
