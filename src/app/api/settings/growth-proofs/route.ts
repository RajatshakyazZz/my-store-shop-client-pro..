import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { DEFAULT_GROWTH_PROOFS, GrowthProofsConfig } from '@/lib/proofSettings';

export const runtime = 'nodejs';

export async function GET() {
  try {
    let config: GrowthProofsConfig = { ...DEFAULT_GROWTH_PROOFS };

    if (db) {
      try {
        const snap = await getDoc(doc(db, 'store_settings', 'growth_proofs')).catch(() => null);
        if (snap && snap.exists()) {
          const data = snap.data();
          config = {
            enabled: typeof data.enabled === 'boolean' ? data.enabled : true,
            badge: data.badge || DEFAULT_GROWTH_PROOFS.badge,
            headline: data.headline || DEFAULT_GROWTH_PROOFS.headline,
            subheadline: data.subheadline || DEFAULT_GROWTH_PROOFS.subheadline,
            autoplay: typeof data.autoplay === 'boolean' ? data.autoplay : true,
            autoplayInterval: Number(data.autoplayInterval || data.autoplay_interval || 4000),
            items: Array.isArray(data.items) ? data.items : [],
            updatedAt: data.updatedAt || data.updated_at,
          };
          return NextResponse.json({ success: true, config });
        }

        const genSnap = await getDoc(doc(db, 'store_settings', 'general')).catch(() => null);
        if (genSnap && genSnap.exists()) {
          const gData = genSnap.data();
          if (gData.growth_proofs && typeof gData.growth_proofs === 'object') {
            const data = gData.growth_proofs;
            config = {
              enabled: typeof data.enabled === 'boolean' ? data.enabled : true,
              badge: data.badge || DEFAULT_GROWTH_PROOFS.badge,
              headline: data.headline || DEFAULT_GROWTH_PROOFS.headline,
              subheadline: data.subheadline || DEFAULT_GROWTH_PROOFS.subheadline,
              autoplay: typeof data.autoplay === 'boolean' ? data.autoplay : true,
              autoplayInterval: Number(data.autoplayInterval || data.autoplay_interval || 4000),
              items: Array.isArray(data.items) ? data.items : [],
              updatedAt: data.updatedAt || data.updated_at,
            };
            return NextResponse.json({ success: true, config });
          }
        }
      } catch (err) {
        console.warn('Error reading growth_proofs in storefront API:', err);
      }
    }

    return NextResponse.json({ success: true, config });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
