import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { DEFAULT_HEADER_OFFER, HeaderOfferConfig } from '@/lib/headerOffer';

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
    let offer: HeaderOfferConfig = { ...DEFAULT_HEADER_OFFER };

    if (db) {
      try {
        const snap = await getDoc(doc(db, 'store_settings', 'header_offer')).catch(() => null);
        if (snap && snap.exists()) {
          const data = snap.data();
          offer = {
            ...DEFAULT_HEADER_OFFER,
            ...data,
            enabled: typeof data.enabled === 'boolean' ? data.enabled : true,
            show_badge: typeof data.show_badge === 'boolean' ? data.show_badge : true,
            show_coupon: typeof data.show_coupon === 'boolean' ? data.show_coupon : true,
            allow_dismiss: typeof data.allow_dismiss === 'boolean' ? data.allow_dismiss : true,
          };
          return NextResponse.json({ success: true, offer }, { headers: CORS_HEADERS });
        }

        const genSnap = await getDoc(doc(db, 'store_settings', 'general')).catch(() => null);
        if (genSnap && genSnap.exists()) {
          const gData = genSnap.data();
          if (gData.header_offer && typeof gData.header_offer === 'object') {
            const h = gData.header_offer;
            offer = {
              ...DEFAULT_HEADER_OFFER,
              ...h,
              enabled: typeof h.enabled === 'boolean' ? h.enabled : true,
              show_badge: typeof h.show_badge === 'boolean' ? h.show_badge : true,
              show_coupon: typeof h.show_coupon === 'boolean' ? h.show_coupon : true,
              allow_dismiss: typeof h.allow_dismiss === 'boolean' ? h.allow_dismiss : true,
            };
            return NextResponse.json({ success: true, offer }, { headers: CORS_HEADERS });
          }
        }
      } catch (err) {
        console.warn('Error reading header offer in admin API:', err);
      }
    }

    return NextResponse.json({ success: true, offer }, { headers: CORS_HEADERS });
  } catch (error: any) {
    console.error('Error fetching header offer in admin route:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch header offer' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const payload: HeaderOfferConfig = {
      enabled: typeof body.enabled === 'boolean' ? body.enabled : true,
      show_badge: typeof body.show_badge === 'boolean' ? body.show_badge : true,
      badge_emoji: String(body.badge_emoji || '🔥').trim(),
      badge_text: String(body.badge_text || 'EXCLUSIVE OFFER').trim(),
      prefix_text: String(body.prefix_text || '🔥 Mega Sale: ').trim(),
      text_regular: String(body.text_regular || 'Flat ').trim(),
      highlight_text: String(body.highlight_text || '20% Extra Discount').trim(),
      suffix_text: String(body.suffix_text || ' on All Reels Bundles! ✨').trim(),
      show_coupon: typeof body.show_coupon === 'boolean' ? body.show_coupon : true,
      coupon_label: String(body.coupon_label || 'CODE').trim(),
      coupon_code: String(body.coupon_code || 'OFF20').trim().toUpperCase(),
      allow_dismiss: typeof body.allow_dismiss === 'boolean' ? body.allow_dismiss : true,
      redirect_url: String(body.redirect_url || '').trim(),
      bg_gradient: String(body.bg_gradient || 'luxury_red').trim(),
      updated_at: new Date().toISOString(),
    };

    if (db) {
      try {
        // 1. Primary write to store_settings/general (universally allowed in live rules)
        await setDoc(
          doc(db, 'store_settings', 'general'),
          { header_offer: payload, updated_at: new Date().toISOString() },
          { merge: true }
        );

        // 2. Secondary write to store_settings/header_offer
        await setDoc(doc(db, 'store_settings', 'header_offer'), payload, { merge: true }).catch(() => null);
      } catch (firestoreErr: any) {
        console.error('Firestore write error in header-offer admin API:', firestoreErr);
        return NextResponse.json(
          { success: false, error: `Firestore error: ${firestoreErr.message || 'Permission denied'}` },
          { status: 500, headers: CORS_HEADERS }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Header offer configuration saved to Cloud Database successfully.',
        offer: payload,
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    console.error('Error saving header offer:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save header offer' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
