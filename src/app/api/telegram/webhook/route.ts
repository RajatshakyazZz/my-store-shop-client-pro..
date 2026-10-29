import { NextResponse } from 'next/server';
import {
  TELEGRAM_ALERTS_ENABLED,
  TELEGRAM_BOT_TOKEN,
  OWNER_CHAT_ID,
  AUTHORIZED_TELEGRAM_ADMINS,
  sendStoreCommandReport,
  fetchDynamicTelegramConfig,
} from '@/lib/telegram';
import {
  isAuthorizedTelegramAdmin,
  handleAdminTelegramCommand,
} from '@/lib/telegramReseller';
import {
  handleAdminPanelCallback,
  handleAdminPanelMessage,
} from '@/lib/telegramAdminPanel';

async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  try {
    const config = await fetchDynamicTelegramConfig().catch(() => null);
    const token = (config?.botToken || TELEGRAM_BOT_TOKEN || '').trim();
    if (!token) return;
    await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text: text || 'Processing...',
      }),
    });
  } catch {}
}

/**
 * POST /api/telegram/webhook
 * Receives live commands & button clicks from Telegram
 * Strictly authorized to configured Admin user IDs (7483268297, 5950203511, and 6206169480)
 */
export async function POST(request: Request) {
  const tgConfig = await fetchDynamicTelegramConfig().catch(() => null);
  const isEnabled = tgConfig ? tgConfig.enabled !== false : TELEGRAM_ALERTS_ENABLED;
  if (!isEnabled) {
    return NextResponse.json({ ok: true, disabled: true });
  }
  try {
    // 0. Secret Token Validation (if configured in environment)
    const secretHeader = request.headers.get('x-telegram-bot-api-secret-token');
    const configuredSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (configuredSecret && secretHeader !== configuredSecret) {
      return NextResponse.json({ error: 'Unauthorized secret token' }, { status: 401 });
    }

    const update = await request.json();

    // 1. Handle Inline Button Clicks (callback_query)
    if (update.callback_query) {
      const cb = update.callback_query;
      const fromId = String(cb.from?.id || '');
      const chatId = String(cb.message?.chat?.id || '');
      const messageId = cb.message?.message_id;

      if (!isAuthorizedTelegramAdmin(fromId, chatId)) {
        await answerCallbackQuery(cb.id, '⛔ Unauthorized: Restricted to authorized administrators.');
        return NextResponse.json({ ok: true });
      }

      const action = String(cb.data || '');

      // 1A. First pass to Interactive Admin Panel Callback Engine
      const handledByPanel = await handleAdminPanelCallback(
        action,
        cb.id,
        fromId,
        chatId,
        messageId
      );
      if (handledByPanel) {
        return NextResponse.json({ ok: true });
      }

      await answerCallbackQuery(cb.id);

      // 1B. Reseller legacy callbacks (e.g. reseller_RSL-..., products_RSL-..., wallet_RSL-...)
      if (action.startsWith('reseller_')) {
        const uid = action.replace('reseller_', '');
        await handleAdminTelegramCommand(`/reseller ${uid}`, fromId, chatId);
        return NextResponse.json({ ok: true });
      }
      if (action.startsWith('products_')) {
        const uid = action.replace('products_', '');
        await handleAdminTelegramCommand(`/products ${uid}`, fromId, chatId);
        return NextResponse.json({ ok: true });
      }
      if (action.startsWith('wallet_')) {
        const uid = action.replace('wallet_', '');
        await handleAdminTelegramCommand(`/wallet ${uid}`, fromId, chatId);
        return NextResponse.json({ ok: true });
      }
      if (action === 'cmd_report') {
        await handleAdminTelegramCommand('/report', fromId, chatId);
        return NextResponse.json({ ok: true });
      }
      if (action === 'cmd_topresellers') {
        await handleAdminTelegramCommand('/topresellers', fromId, chatId);
        return NextResponse.json({ ok: true });
      }

      // 1C. Store commands fallback
      if (action === 'cmd_today') {
        await sendStoreCommandReport('today');
      } else if (action === 'cmd_orders') {
        await sendStoreCommandReport('orders');
      } else if (action === 'cmd_pending') {
        await sendStoreCommandReport('pending');
      } else if (action === 'cmd_summary') {
        await sendStoreCommandReport('night_summary');
      } else {
        await sendStoreCommandReport('help');
      }

      return NextResponse.json({ ok: true });
    }

    // 2. Handle Text Commands & Footer Keyboard Button Clicks
    const msg = update.message || update.edited_message;
    if (!msg) {
      return NextResponse.json({ ok: true });
    }

    const chatId = String(msg.chat?.id || '');
    const fromId = String(msg.from?.id || '');

    // Strict authorized admin check
    if (!isAuthorizedTelegramAdmin(fromId, chatId)) {
      console.warn(`[Telegram Webhook] Rejected unauthorized message from fromId=${fromId}, chatId=${chatId}`);
      return NextResponse.json({ ok: true });
    }

    const rawText = String(msg.text || '').trim();

    // 2A. Primary: Route through Premium Interactive Admin Panel Engine
    // (Handles 5-row persistent footer buttons, conversational search, and all 10 sections)
    const handledByAdminPanel = await handleAdminPanelMessage(rawText, fromId, chatId);
    if (handledByAdminPanel) {
      return NextResponse.json({ ok: true });
    }

    // 2B. Legacy Reseller Commands Fallback
    const handledByReseller = await handleAdminTelegramCommand(rawText, fromId, chatId);
    if (handledByReseller) {
      return NextResponse.json({ ok: true });
    }

    // 2C. Legacy Store Commands Fallback
    const parts = rawText.split(/\s+/);
    const cmd = parts[0].toLowerCase().split('@')[0];

    if (cmd === '/today' || cmd === 'today') {
      await sendStoreCommandReport('today');
    } else if (cmd === '/orders' || cmd === 'orders') {
      await sendStoreCommandReport('orders');
    } else if (cmd === '/pending' || cmd === 'pending' || cmd === '/abandoned') {
      await sendStoreCommandReport('pending');
    } else if (cmd === '/summary' || cmd === 'summary') {
      await sendStoreCommandReport('night_summary');
    } else if (cmd === '/start' || cmd === '/help' || cmd === 'help' || cmd === 'menu') {
      await sendStoreCommandReport('help');
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Telegram webhook error:', err);
    return NextResponse.json({ ok: true });
  }
}

/**
 * GET /api/telegram/webhook
 * Registers the Telegram Webhook & Bot Command Menu
 */
export async function GET(request: Request) {
  const config = await fetchDynamicTelegramConfig().catch(() => null);
  const isEnabled = config ? config.enabled !== false : TELEGRAM_ALERTS_ENABLED;
  if (!isEnabled) {
    return NextResponse.json({
      success: false,
      disabled: true,
      message: 'Telegram alerts are temporarily disabled in settings.',
    });
  }
  try {
    const token = (config?.botToken || TELEGRAM_BOT_TOKEN || '').trim();
    if (!token) {
      return NextResponse.json({ success: false, error: 'Missing Telegram Bot Token' }, { status: 400 });
    }
    const host = request.headers.get('host') || (process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).host : 'vaultworld.shop');
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const webhookUrl = `${protocol}://${host}/api/telegram/webhook`;

    const registerWebhookUrl = `https://api.telegram.org/bot${token}/setWebhook`;
    const webhookPayload: Record<string, any> = {
      url: webhookUrl,
      drop_pending_updates: true,
      allowed_updates: ['message', 'edited_message', 'callback_query'],
    };

    if (process.env.TELEGRAM_WEBHOOK_SECRET) {
      webhookPayload.secret_token = process.env.TELEGRAM_WEBHOOK_SECRET;
    }

    const res = await fetch(registerWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload),
    });
    const webhookResult = await res.json();

    // Register bot commands list with Telegram
    const commandsUrl = `https://api.telegram.org/bot${token}/setMyCommands`;
    await fetch(commandsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        commands: [
          { command: 'reseller', description: 'Look up reseller by UID (/reseller RSL-XXXX)' },
          { command: 'sales', description: 'View sales breakdown for reseller UID' },
          { command: 'products', description: 'View product sales for reseller UID' },
          { command: 'wallet', description: 'View wallet ledger for reseller UID' },
          { command: 'withdrawals', description: 'View withdrawal history for reseller UID' },
          { command: 'topresellers', description: 'Leaderboard of top performing resellers' },
          { command: 'report', description: 'Store-wide reseller performance report' },
          { command: 'today', description: 'Today sales & revenue overview (IST)' },
          { command: 'orders', description: 'Recent paid orders' },
          { command: 'pending', description: 'Abandoned & pending checkout leads' },
          { command: 'summary', description: 'Daily store totals & health' },
          { command: 'help', description: 'Command menu & help' },
        ],
      }),
    });

    return NextResponse.json({
      success: true,
      message: 'Telegram Webhook & Command Menu configured successfully',
      webhookUrl,
      webhookResult,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
