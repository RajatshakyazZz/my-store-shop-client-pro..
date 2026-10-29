import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { DEFAULT_GLOBAL_BUMP, GlobalBumpOfferConfig } from '@/lib/bumpOffer';

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
          return NextResponse.json({ success: true, bumpOffer }, { headers: CORS_HEADERS });
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
              bumpType: b.bump_type || b.bumpType || (b.product_slug ? 'store_product' : 'custom'),
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
            return NextResponse.json({ success: true, bumpOffer }, { headers: CORS_HEADERS });
          }
        }
      } catch (err) {
        console.warn('Error reading store bump offer in admin API:', err);
      }
    }

    return NextResponse.json({ success: true, bumpOffer }, { headers: CORS_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: CORS_HEADERS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const enabled = typeof body.enabled === 'boolean' ? body.enabled : true;
    const price = Math.max(0, Number(body.price != null ? body.price : DEFAULT_GLOBAL_BUMP.price));
    const regular_price = Math.max(price, Number(body.regular_price || body.regularPrice || price * 5));
    const discount_percentage = Math.max(
      1,
      Math.round(((regular_price - price) / regular_price) * 100)
    );

    const product_id = String(body.product_id || body.productId || DEFAULT_GLOBAL_BUMP.productId).trim();
    const product_slug = String(body.product_slug || body.productSlug || DEFAULT_GLOBAL_BUMP.productSlug).trim();
    const title = String(body.title || DEFAULT_GLOBAL_BUMP.title).trim();
    const subtitle = String(body.subtitle || DEFAULT_GLOBAL_BUMP.subtitle).trim();
    const thumbnail = String(body.thumbnail || DEFAULT_GLOBAL_BUMP.thumbnail).trim();
    const reel_count = Math.max(0, Number(body.reel_count || body.reelCount || DEFAULT_GLOBAL_BUMP.reelCount));
    const google_drive_link = String(body.google_drive_link || body.googleDriveLink || DEFAULT_GLOBAL_BUMP.googleDriveLink || '').trim();
    const bump_type = (body.bump_type || body.bumpType || 'store_product') as 'store_product' | 'custom';
    const updated_at = new Date().toISOString();

    const payload = {
      enabled,
      bump_enabled: enabled,
      bump_type,
      bump_mode: bump_type,
      product_id,
      bump_product_id: product_id,
      product_slug,
      bump_product_slug: product_slug,
      title,
      bump_title: title,
      subtitle,
      bump_subtitle: subtitle,
      price,
      bump_price: price,
      regular_price,
      bump_regular_price: regular_price,
      discount_percentage,
      thumbnail,
      bump_thumbnail: thumbnail,
      reel_count,
      bump_reel_count: reel_count,
      google_drive_link,
      updated_at,
    };

    if (db) {
      try {
        // Save to dedicated document store_settings/bump_offer
        await setDoc(doc(db, 'store_settings', 'bump_offer'), payload, { merge: true });

        // Also save nested inside store_settings/general for fallback compatibility
        await setDoc(
          doc(db, 'store_settings', 'general'),
          {
            bump_offer: {
              enabled,
              product_id,
              product_slug,
              title,
              subtitle,
              price,
              regular_price,
              discount_percentage,
              thumbnail,
              reel_count,
              google_drive_link,
              updated_at,
            },
          },
          { merge: true }
        );
      } catch (err: any) {
        console.error('Error saving bump offer to Firestore:', err);
        return NextResponse.json(
          { success: false, error: `Firestore write error: ${err.message}` },
          { status: 500, headers: CORS_HEADERS }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        bumpOffer: {
          enabled,
          productId: product_id,
          productSlug: product_slug,
          title,
          subtitle,
          price,
          regularPrice: regular_price,
          discountPercentage: discount_percentage,
          thumbnail,
          reelCount: reel_count,
          googleDriveLink: google_drive_link,
          updatedAt: updated_at,
        },
      },
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: CORS_HEADERS });
  }
}
