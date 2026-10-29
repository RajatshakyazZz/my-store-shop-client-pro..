import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const runtime = 'nodejs';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-key',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    let token = String(body.bot_token || '').trim();
    let rawIds = String(body.admin_chat_ids || '').trim();

    // If not provided in body, load from Firestore
    if (!token || !rawIds) {
      if (db) {
        try {
          const snap = await getDoc(doc(db, 'store_settings', 'telegram'));
          if (snap.exists()) {
            const data = snap.data();
            if (!token) token = String(data.bot_token || '').trim();
            if (!rawIds) rawIds = String(data.admin_chat_ids || '').trim();
          }
        } catch {}
      }
    }

    if (!token) {
      token = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Telegram Bot Token is missing. Please enter your Bot Token first.' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    if (!rawIds) {
      rawIds = (process.env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_OWNER_CHAT_ID || '').trim();
    }

    if (!rawIds) {
      return NextResponse.json(
        { success: false, error: 'Admin Chat ID is missing. Please enter at least one Telegram Chat ID.' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const targetChatIds = rawIds
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const istTime = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'medium',
    });

    const msg = `⚡🔔 <b>MYZTORE — TELEGRAM BOT TEST ALERT</b> 🚀
━━━━━━━━━━━━━━━━━━━━━━
✅ <b>Bot Connection:</b> Active & Verified
📱 <b>Admin Chat IDs:</b> ${targetChatIds.join(', ')}
🕒 <b>Dispatched At (IST):</b> ${istTime}
🏬 <b>Admin Panel:</b> /asdf/settings
━━━━━━━━━━━━━━━━━━━━━━
<i>If you received this message, your Telegram alerts are working 100% properly!</i>`;

    let successCount = 0;
    const errors: string[] = [];

    await Promise.allSettled(
      targetChatIds.map(async (chatId) => {
        try {
          const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: msg,
              parse_mode: 'HTML',
            }),
          });
          const json = await res.json();
          if (json.ok) {
            successCount++;
          } else {
            errors.push(`Chat ${chatId}: ${json.description || 'Failed'}`);
          }
        } catch (err: any) {
          errors.push(`Chat ${chatId}: ${err.message}`);
        }
      })
    );

    if (successCount > 0) {
      const statusText = `Verified (${successCount}/${targetChatIds.length} chats)`;
      const timestamp = new Date().toISOString();

      if (db) {
        try {
          await setDoc(
            doc(db, 'store_settings', 'telegram'),
            {
              last_test_status: statusText,
              last_test_at: timestamp,
            },
            { merge: true }
          );
        } catch {}
      }

      return NextResponse.json(
        {
          success: true,
          message: `Test alert sent successfully to ${successCount} admin chat(s)!`,
          status: statusText,
          timestamp,
        },
        { headers: CORS_HEADERS }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: `Failed to dispatch alert: ${errors.join('; ') || 'Telegram API error'}`,
        },
        { status: 500, headers: CORS_HEADERS }
      );
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: CORS_HEADERS });
  }
}
