import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const runtime = 'nodejs';

export interface TelegramSettingsConfig {
  enabled: boolean;
  bot_token: string;
  admin_chat_ids: string;
  new_order_alert: boolean;
  product_alert: boolean;
  daily_summary_alert: boolean;
  last_test_status?: string;
  last_test_at?: string;
}

const DEFAULT_CONFIG: TelegramSettingsConfig = {
  enabled: true,
  bot_token: process.env.TELEGRAM_BOT_TOKEN || '',
  admin_chat_ids: process.env.TELEGRAM_ALLOWED_USER_IDS || process.env.TELEGRAM_CHAT_ID || '',
  new_order_alert: true,
  product_alert: true,
  daily_summary_alert: true,
};

export async function GET() {
  try {
    let config = { ...DEFAULT_CONFIG };

    if (db) {
      try {
        const snap = await getDoc(doc(db, 'store_settings', 'telegram')).catch(() => null);
        if (snap && snap.exists()) {
          const data = snap.data();
          config = {
            enabled: typeof data.enabled === 'boolean' ? data.enabled : String(data.enabled || '').toLowerCase() !== 'false',
            bot_token: String(data.bot_token || '').trim() || DEFAULT_CONFIG.bot_token,
            admin_chat_ids: String(data.admin_chat_ids || '').trim() || DEFAULT_CONFIG.admin_chat_ids,
            new_order_alert: typeof data.new_order_alert === 'boolean' ? data.new_order_alert : String(data.new_order_alert || '').toLowerCase() !== 'false',
            product_alert: typeof data.product_alert === 'boolean' ? data.product_alert : String(data.product_alert || '').toLowerCase() !== 'false',
            daily_summary_alert: typeof data.daily_summary_alert === 'boolean' ? data.daily_summary_alert : String(data.daily_summary_alert || '').toLowerCase() !== 'false',
            last_test_status: data.last_test_status,
            last_test_at: data.last_test_at,
          };
          return NextResponse.json({ success: true, config });
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
            return NextResponse.json({ success: true, config });
          }
        }
      } catch (err) {
        console.warn('Error reading store_settings/telegram in public settings API:', err);
      }
    }

    return NextResponse.json({ success: true, config });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
