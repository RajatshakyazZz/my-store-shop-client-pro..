import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { DEFAULT_HEADER_OFFER, HeaderOfferConfig } from '@/lib/headerOffer';

export const runtime = 'nodejs';

export async function GET() {
  try {
    let offer: HeaderOfferConfig = { ...DEFAULT_HEADER_OFFER };

    if (db) {
      try {
        // 1. Primary check: store_settings/general (universally allowed by live security rules)
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
            return NextResponse.json({ success: true, offer });
          }
        }

        // 2. Secondary check: store_settings/header_offer
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
          return NextResponse.json({ success: true, offer });
        }
      } catch (err) {
        console.warn('Error reading header_offer in public settings API:', err);
      }
    }

    return NextResponse.json({ success: true, offer });
  } catch (error: any) {
    console.error('Error fetching header offer settings:', error);
    return NextResponse.json(
      { success: true, offer: DEFAULT_HEADER_OFFER },
      { status: 200 }
    );
  }
}
