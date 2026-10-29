import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const runtime = 'nodejs';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-key',
};

export interface TelegramSettingsConfig {
  enabled: boolean;
  bot_token: string;
  admin_chat_ids: string;
  new_order_alert: boolean;
  product_alert: boolean;
  daily_summary_alert: boolean;
  last_test_status?: string;
  last_test_at?: string;
  updated_at?: string;
}

const DEFAULT_CONFIG: TelegramSettingsConfig = {
  enabled: false,
  bot_token: process.env.TELEGRAM_BOT_TOKEN || '',
  admin_chat_ids: '',
  new_order_alert: true,
  product_alert: true,
  daily_summary_alert: true,
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  try {
    let config = { ...DEFAULT_CONFIG };

    if (db) {
      try {
        const snap = await getDoc(doc(db, 'store_settings', 'telegram')).catch(() => null);
        if (snap && snap.exists()) {
          const data = snap.data();
          config = {
            enabled: typeof data.enabled === 'boolean' ? data.enabled : true,
            bot_token: String(data.bot_token || '').trim() || DEFAULT_CONFIG.bot_token,
            admin_chat_ids: String(data.admin_chat_ids || '').trim() || DEFAULT_CONFIG.admin_chat_ids,
            new_order_alert: typeof data.new_order_alert === 'boolean' ? data.new_order_alert : true,
            product_alert: typeof data.product_alert === 'boolean' ? data.product_alert : true,
            daily_summary_alert: typeof data.daily_summary_alert === 'boolean' ? data.daily_summary_alert : true,
            last_test_status: data.last_test_status,
            last_test_at: data.last_test_at,
          };
          return NextResponse.json({ success: true, config }, { headers: CORS_HEADERS });
        }

        const genSnap = await getDoc(doc(db, 'store_settings', 'general')).catch(() => null);
        if (genSnap && genSnap.exists()) {
          const gData = genSnap.data();
          if (gData.telegram && typeof gData.telegram === 'object') {
            const t = gData.telegram;
            config = {
              enabled: typeof t.enabled === 'boolean' ? t.enabled : true,
              bot_token: String(t.bot_token || '').trim() || DEFAULT_CONFIG.bot_token,
              admin_chat_ids: String(t.admin_chat_ids || '').trim() || DEFAULT_CONFIG.admin_chat_ids,
              new_order_alert: typeof t.new_order_alert === 'boolean' ? t.new_order_alert : true,
              product_alert: typeof t.product_alert === 'boolean' ? t.product_alert : true,
              daily_summary_alert: typeof t.daily_summary_alert === 'boolean' ? t.daily_summary_alert : true,
              last_test_status: t.last_test_status,
              last_test_at: t.last_test_at,
            };
            return NextResponse.json({ success: true, config }, { headers: CORS_HEADERS });
          }
        }
      } catch (err) {
        console.warn('Error reading store_settings/telegram in admin API:', err);
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
    const bot_token = String(body.bot_token || DEFAULT_CONFIG.bot_token).trim();
    const admin_chat_ids = String(body.admin_chat_ids || DEFAULT_CONFIG.admin_chat_ids).trim();
    const new_order_alert = typeof body.new_order_alert === 'boolean' ? body.new_order_alert : true;
    const product_alert = typeof body.product_alert === 'boolean' ? body.product_alert : true;
    const daily_summary_alert = typeof body.daily_summary_alert === 'boolean' ? body.daily_summary_alert : true;
    const updated_at = new Date().toISOString();

    const payload: Record<string, any> = {
      enabled,
      bot_token,
      admin_chat_ids,
      new_order_alert,
      product_alert,
      daily_summary_alert,
      updated_at,
    };

    if (body.last_test_status) payload.last_test_status = body.last_test_status;
    if (body.last_test_at) payload.last_test_at = body.last_test_at;

    if (db) {
      try {
        await setDoc(doc(db, 'store_settings', 'telegram'), payload, { merge: true });
        await setDoc(
          doc(db, 'store_settings', 'general'),
          { telegram: payload },
          { merge: true }
        );
      } catch (err: any) {
        console.error('Error saving telegram config to Firestore:', err);
        return NextResponse.json(
          { success: false, error: `Firestore write error: ${err.message}` },
          { status: 500, headers: CORS_HEADERS }
        );
      }
    }

    // Record audit log
    if (db) {
      try {
        await addDoc(collection(db, 'admin_audit_logs'), {
          adminEmail: 'admin@vaultzet.com',
          action: 'UPDATE_TELEGRAM_CONFIG',
          module: 'Telegram Alerts',
          details: `Updated Telegram bot token & admin chat IDs (${admin_chat_ids}, Status: ${enabled ? 'ACTIVE' : 'DISABLED'})`,
          createdAt: serverTimestamp(),
        });
      } catch (auditErr) {
        console.warn('Failed to record audit log for telegram update:', auditErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        config: payload,
      },
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: CORS_HEADERS });
  }
}
