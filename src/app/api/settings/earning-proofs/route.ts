import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { DEFAULT_EARNING_PROOFS, EarningProofsConfig } from '@/lib/proofSettings';

export const runtime = 'nodejs';

export async function GET() {
  try {
    let config: EarningProofsConfig = { ...DEFAULT_EARNING_PROOFS };

    if (db) {
      try {
        const snap = await getDoc(doc(db, 'store_settings', 'earning_proofs')).catch(() => null);
        if (snap && snap.exists()) {
          const data = snap.data();
          config = {
            enabled: typeof data.enabled === 'boolean' ? data.enabled : true,
            badge: data.badge || DEFAULT_EARNING_PROOFS.badge,
            headline: data.headline || DEFAULT_EARNING_PROOFS.headline,
            subheadline: data.subheadline || DEFAULT_EARNING_PROOFS.subheadline,
            items: Array.isArray(data.items) ? data.items : DEFAULT_EARNING_PROOFS.items,
            updatedAt: data.updatedAt || data.updated_at,
          };
          return NextResponse.json({ success: true, config });
        }

        const genSnap = await getDoc(doc(db, 'store_settings', 'general')).catch(() => null);
        if (genSnap && genSnap.exists()) {
          const gData = genSnap.data();
          if (gData.earning_proofs && typeof gData.earning_proofs === 'object') {
            const data = gData.earning_proofs;
            config = {
              enabled: typeof data.enabled === 'boolean' ? data.enabled : true,
              badge: data.badge || DEFAULT_EARNING_PROOFS.badge,
              headline: data.headline || DEFAULT_EARNING_PROOFS.headline,
              subheadline: data.subheadline || DEFAULT_EARNING_PROOFS.subheadline,
              items: Array.isArray(data.items) ? data.items : DEFAULT_EARNING_PROOFS.items,
              updatedAt: data.updatedAt || data.updated_at,
            };
            return NextResponse.json({ success: true, config });
          }
        }
      } catch (err) {
        console.warn('Error reading earning_proofs in storefront API:', err);
      }
    }

    return NextResponse.json({ success: true, config });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
