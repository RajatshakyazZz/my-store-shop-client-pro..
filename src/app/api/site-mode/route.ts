import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_SITE_MODE = {
  mode: 'LIVE',
  maintenance_message: 'Our store is undergoing scheduled performance upgrades. We will be back online shortly!',
  bypass_ips: ['127.0.0.1'],
  last_updated: new Date().toISOString(),
};

// GET: Fetch current site mode configuration
export async function GET() {
  try {
    if (db) {
      const snap = await getDoc(doc(db, 'store_settings', 'site_mode'));
      if (snap.exists()) {
        const data = snap.data();
        return NextResponse.json({
          success: true,
          mode: data.mode === 'MAINTENANCE' ? 'MAINTENANCE' : 'LIVE',
          maintenance_message: data.maintenance_message || DEFAULT_SITE_MODE.maintenance_message,
          bypass_ips: Array.isArray(data.bypass_ips) ? data.bypass_ips : DEFAULT_SITE_MODE.bypass_ips,
          last_updated: data.last_updated || DEFAULT_SITE_MODE.last_updated,
        });
      }
    }

    return NextResponse.json({
      success: true,
      ...DEFAULT_SITE_MODE,
    });
  } catch (err: any) {
    console.warn('API /site-mode GET error:', err);
    return NextResponse.json(
      { success: false, ...DEFAULT_SITE_MODE, error: err?.message || 'Failed to fetch site mode' },
      { status: 500 }
    );
  }
}

// POST: Update site mode configuration
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const mode = body?.mode === 'MAINTENANCE' ? 'MAINTENANCE' : 'LIVE';
    const maintenance_message = String(body?.maintenance_message || DEFAULT_SITE_MODE.maintenance_message).trim();
    const bypass_ips = Array.isArray(body?.bypass_ips)
      ? body.bypass_ips.map((ip: any) => String(ip).trim()).filter(Boolean)
      : DEFAULT_SITE_MODE.bypass_ips;
    const last_updated = new Date().toISOString();

    const payload = {
      mode,
      maintenance_message,
      bypass_ips,
      last_updated,
    };

    if (db) {
      await setDoc(doc(db, 'store_settings', 'site_mode'), payload, { merge: true });
    }

    return NextResponse.json({
      success: true,
      ...payload,
    });
  } catch (err: any) {
    console.error('API /site-mode POST error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to update site mode' },
      { status: 500 }
    );
  }
}
