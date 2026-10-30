import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { DEFAULT_EARNING_PROOFS, EarningProofsConfig, EarningProofItem } from '@/lib/proofSettings';

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
          return NextResponse.json({ success: true, config }, { headers: CORS_HEADERS });
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
            return NextResponse.json({ success: true, config }, { headers: CORS_HEADERS });
          }
        }
      } catch (err) {
        console.warn('Error reading earning_proofs in admin API:', err);
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
    const badge = String(body.badge || DEFAULT_EARNING_PROOFS.badge).trim();
    const headline = String(body.headline || DEFAULT_EARNING_PROOFS.headline).trim();
    const subheadline = String(body.subheadline || DEFAULT_EARNING_PROOFS.subheadline).trim();

    const rawItems = Array.isArray(body.items) ? body.items : [];
    const sanitizedItems: EarningProofItem[] = rawItems
      .filter((it: any) => it && (it.image || it.amount || it.caption))
      .map((it: any, index: number) => ({
        id: String(it.id || `ep-${Date.now()}-${index}`),
        image: String(it.image || '').trim(),
        amount: String(it.amount || '₹0').trim(),
        tag: String(it.tag || 'UPI Received').trim(),
        caption: String(it.caption || '').trim(),
        date: String(it.date || 'Verified').trim(),
      }));

    const updatedAt = new Date().toISOString();

    const payload = {
      enabled,
      badge,
      headline,
      subheadline,
      items: sanitizedItems,
      updatedAt,
    };

    if (db) {
      try {
        await setDoc(
          doc(db, 'store_settings', 'general'),
          {
            earning_proofs: payload,
          },
          { merge: true }
        );

        try {
          await setDoc(doc(db, 'store_settings', 'earning_proofs'), payload, { merge: true });
        } catch {}
      } catch (err: any) {
        console.error('Error saving earning proofs to Firestore:', err);
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
          action: 'UPDATE_EARNING_PROOFS',
          module: 'COMMERCE',
          details: `Updated Earning Proofs Showcase: ${sanitizedItems.length} payment screenshots (Status: ${enabled ? 'ACTIVE' : 'OFF'})`,
          createdAt: serverTimestamp(),
        });
      } catch (auditErr) {
        console.warn('Failed to record audit log for earning proofs:', auditErr);
      }
    }

    return NextResponse.json({ success: true, config: payload }, { headers: CORS_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: CORS_HEADERS });
  }
}
