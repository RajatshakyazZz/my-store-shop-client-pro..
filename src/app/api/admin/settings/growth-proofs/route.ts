import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { DEFAULT_GROWTH_PROOFS, GrowthProofsConfig, GrowthProofItem } from '@/lib/proofSettings';

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
          return NextResponse.json({ success: true, config }, { headers: CORS_HEADERS });
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
            return NextResponse.json({ success: true, config }, { headers: CORS_HEADERS });
          }
        }
      } catch (err) {
        console.warn('Error reading growth_proofs in admin API:', err);
      }
    }

    return NextResponse.json({ success: true, config }, { headers: CORS_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: CORS_HEADERS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const enabled = typeof body.enabled === 'boolean' ? body.enabled : true;
    const badge = String(body.badge || DEFAULT_GROWTH_PROOFS.badge).trim();
    const headline = String(body.headline || DEFAULT_GROWTH_PROOFS.headline).trim();
    const subheadline = String(body.subheadline || DEFAULT_GROWTH_PROOFS.subheadline).trim();
    const autoplay = typeof body.autoplay === 'boolean' ? body.autoplay : true;
    const autoplayInterval = Math.max(1000, Number(body.autoplayInterval || body.autoplay_interval || 4000));

    const rawItems = Array.isArray(body.items) ? body.items : [];
    const sanitizedItems: GrowthProofItem[] = rawItems
      .filter((it: any) => it && (it.image || it.title))
      .map((it: any, index: number) => ({
        id: String(it.id || `gp-${Date.now()}-${index}`),
        image: String(it.image || '').trim(),
        title: String(it.title || `@creator_${index + 1}`).trim(),
        followers: String(it.followers || '').trim(),
        metric: String(it.metric || '').trim(),
        tag: String(it.tag || '').trim(),
        productId: it.productId ? String(it.productId).trim() : undefined,
        productSlug: it.productSlug ? String(it.productSlug).trim() : undefined,
        productTitle: it.productTitle ? String(it.productTitle).trim() : undefined,
      }));

    const updatedAt = new Date().toISOString();

    const payload = {
      enabled,
      badge,
      headline,
      subheadline,
      autoplay,
      autoplayInterval,
      items: sanitizedItems,
      updatedAt,
    };

    if (db) {
      try {
        await setDoc(
          doc(db, 'store_settings', 'general'),
          {
            growth_proofs: payload,
          },
          { merge: true }
        );

        try {
          await setDoc(doc(db, 'store_settings', 'growth_proofs'), payload, { merge: true });
        } catch {}
      } catch (err: any) {
        console.error('Error saving growth proofs to Firestore:', err);
        return NextResponse.json(
          { success: false, error: `Firestore write error: ${err.message}` },
          { status: 500, headers: CORS_HEADERS }
        );
      }
    }

    // Log admin audit action
    if (db) {
      try {
        await addDoc(collection(db, 'admin_audit_logs'), {
          adminEmail: 'admin@vaultzet.com',
          action: 'UPDATE_GROWTH_PROOFS',
          module: 'COMMERCE',
          details: `Updated Growth Proofs Showcase: ${sanitizedItems.length} screenshots (Status: ${enabled ? 'ACTIVE' : 'OFF'})`,
          createdAt: serverTimestamp(),
        });
      } catch (auditErr) {
        console.warn('Failed to record audit log for growth proofs:', auditErr);
      }
    }

    return NextResponse.json({ success: true, config: payload }, { headers: CORS_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: CORS_HEADERS });
  }
}
