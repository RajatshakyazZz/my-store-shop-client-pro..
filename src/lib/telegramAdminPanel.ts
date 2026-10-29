// Premium Interactive Telegram Bot Admin Panel for MYZTORE
// Supporting Persistent 5-Row Footer Keyboard (ReplyKeyboardMarkup),
// Contextual Inline Dashboards (InlineKeyboardMarkup), Multi-Step Search Flows,
// Real-Time Database Queries, and Strict Admin Authorization.

import {
  TELEGRAM_BOT_TOKEN,
  AUTHORIZED_TELEGRAM_ADMINS,
  sendTelegramMessage,
  editTelegramMessage,
  answerTelegramCallback,
  getIstTimestamp,
  TelegramInlineButton,
  fetchActiveFirestoreOrders,
} from '@/lib/telegram';
import {
  getResellerProfileByUid,
  getResellerAnalytics,
  getAllResellersAnalytics,
  maskUpiId,
  getResellerWallet,
  getResellerTransactions,
  updateWithdrawalStatus,
  getWithdrawalRequestById,
  getAllWithdrawals,
} from '@/lib/resellerService';
import { db } from '@/lib/firebase';
import { collection, getDocs, Firestore } from 'firebase/firestore';
import { BUNDLE_PRODUCTS } from '@/data/bundles';
import { WithdrawalRequest, WalletTransaction } from '@/types/reseller';

// -----------------------------------------------------------------------------
// 1. PERSISTENT FOOTER KEYBOARD (ReplyKeyboardMarkup)
// -----------------------------------------------------------------------------
// 5 Rows x 2 Buttons = 10 Main Navigation Sections
export const PERSISTENT_FOOTER_KEYBOARD = {
  keyboard: [
    [{ text: '📊 Dashboard' }, { text: '👥 Resellers' }],
    [{ text: '💰 Sales' }, { text: '🛍 Products' }],
    [{ text: '👛 Wallets' }, { text: '💸 Withdrawals' }],
    [{ text: '🛡 Fraud Monitor' }, { text: '📈 Analytics' }],
    [{ text: '🔔 Notifications' }, { text: '⚙️ Settings' }],
  ],
  resize_keyboard: true,
  one_time_keyboard: false,
  is_persistent: true,
};

// -----------------------------------------------------------------------------
// 2. CONVERSATIONAL SESSION MANAGER
// -----------------------------------------------------------------------------
interface AdminSession {
  pendingAction?: 'search_reseller_uid' | 'search_product' | 'search_withdrawal';
  page?: number;
  lastActive: number;
}

const adminSessions = new Map<string, AdminSession>();

function getSession(chatId: string): AdminSession {
  const existing = adminSessions.get(chatId);
  const now = Date.now();
  // 15-minute expiration
  if (existing && now - existing.lastActive < 15 * 60 * 1000) {
    existing.lastActive = now;
    return existing;
  }
  const fresh: AdminSession = { lastActive: now };
  adminSessions.set(chatId, fresh);
  return fresh;
}

function clearSessionAction(chatId: string) {
  const session = getSession(chatId);
  delete session.pendingAction;
}

// -----------------------------------------------------------------------------
// 3. UTILITY FORMATTERS & TIME BOUNDARIES
// -----------------------------------------------------------------------------
function escapeHtml(text: string): string {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatInr(amount: number): string {
  const rounded = Math.round(Number(amount) || 0);
  return `₹${rounded.toLocaleString('en-IN')}`;
}

export function getIstDateKey(dateInput?: string | number | Date): string {
  try {
    const d = dateInput ? new Date(dateInput) : new Date();
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // YYYY-MM-DD in IST
  } catch {
    return '';
  }
}

export function isAuthorizedAdmin(fromId?: string | number, chatId?: string | number): boolean {
  const fId = String(fromId || '').trim();
  const cId = String(chatId || '').trim();
  return (
    AUTHORIZED_TELEGRAM_ADMINS.includes(fId) ||
    AUTHORIZED_TELEGRAM_ADMINS.includes(cId)
  );
}

// -----------------------------------------------------------------------------
// 4. DATABASE QUERIES & METRICS CALCULATIONS
// -----------------------------------------------------------------------------

export async function fetchAllWithdrawals(): Promise<WithdrawalRequest[]> {
  try {
    return await getAllWithdrawals();
  } catch (err) {
    console.warn('Error querying withdrawal requests:', err);
    return [];
  }
}

export async function fetchAllWalletTransactions(): Promise<WalletTransaction[]> {
  const list: WalletTransaction[] = [];
  if (db) {
    try {
      const snap = await getDocs(collection(db as Firestore, 'wallet_transactions'));
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as WalletTransaction);
      });
    } catch (err) {}
  }
  if (list.length === 0) {
    try {
      const resellers = await getAllResellersAnalytics();
      for (const r of resellers) {
        const txs = await getResellerTransactions(r.profile.userId);
        list.push(...txs);
      }
    } catch {}
  }
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// -----------------------------------------------------------------------------
// 5. VIEW RENDERERS (Contextual Screens with Inline Buttons)
// -----------------------------------------------------------------------------

// Helper to send or edit
async function renderView(
  chatId: string,
  messageId: number | undefined,
  htmlText: string,
  inlineButtons?: Array<Array<TelegramInlineButton>>
): Promise<boolean> {
  if (messageId) {
    return await editTelegramMessage(chatId, messageId, htmlText, inlineButtons);
  }
  return await sendTelegramMessage(htmlText, inlineButtons, chatId, PERSISTENT_FOOTER_KEYBOARD);
}

// --- 5.1 DASHBOARD VIEW ---
export async function renderDashboard(chatId: string, messageId?: number): Promise<boolean> {
  clearSessionAction(chatId);
  const todayKey = getIstDateKey();

  const [resellers, orders, withdrawals] = await Promise.all([
    getAllResellersAnalytics(),
    fetchActiveFirestoreOrders(),
    fetchAllWithdrawals(),
  ]);

  const totalResellers = resellers.length;
  const newResellersToday = resellers.filter(
    (r) => getIstDateKey(r.profile.createdAt) === todayKey
  ).length;

  const todayVerifiedOrders = orders.filter(
    (o) =>
      getIstDateKey(o.timestampIso || o.createdAt) === todayKey &&
      (o.status === 'completed' || o.status === 'paid')
  );

  const todayNetSales = todayVerifiedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const pendingWithdrawals = withdrawals.filter(
    (w) => w.status === 'pending' || w.status === 'pending_review'
  );
  const pendingWithdrawalAmount = pendingWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);

  const text = `👑 <b>RESELLER ADMIN CENTER</b>
━━━━━━━━━━━━━━━━━━
Welcome to your reseller management dashboard.

📅 <b>Reporting Date:</b> ${escapeHtml(getIstTimestamp())} IST

📊 <b>BUSINESS OVERVIEW</b>
• Registered resellers: <b>${totalResellers}</b>
• New resellers today: <b>${newResellersToday}</b>
• Verified orders today: <b>${todayVerifiedOrders.length}</b>
• Net sales today: <b>${formatInr(todayNetSales)}.00</b>
• Pending withdrawals: <b>${pendingWithdrawals.length}</b>
• Pending withdrawal amount: <b>${formatInr(pendingWithdrawalAmount)}.00</b>
━━━━━━━━━━━━━━━━━━
Select a section from the persistent menu below to manage your business.`;

  const inlineButtons: Array<Array<TelegramInlineButton>> = [
    [
      { text: '👥 Manage Resellers', callback_data: 'nav:res' },
      { text: '💸 Withdrawals', callback_data: 'nav:wdr' },
    ],
    [
      { text: '📈 View Analytics', callback_data: 'nav:ana' },
      { text: '🛡 Fraud Monitor', callback_data: 'nav:fraud' },
    ],
    [{ text: '🔄 Refresh Dashboard', callback_data: 'nav:dash' }],
  ];

  return renderView(chatId, messageId, text, inlineButtons);
}

// --- 5.2 RESELLERS VIEW ---
export async function renderResellersMenu(chatId: string, messageId?: number): Promise<boolean> {
  clearSessionAction(chatId);
  const todayKey = getIstDateKey();
  const allResellers = await getAllResellersAnalytics();

  // Filter out any automated test accounts
  const resellers = allResellers.filter((r) => {
    const uid = r.profile.userId || '';
    const email = r.profile.email || '';
    const name = r.profile.displayName || '';
    return (
      !uid.startsWith('usr_reseller_audit') &&
      !uid.startsWith('usr_cross_device') &&
      !email.includes('reseller_audit') &&
      !name.toLowerCase().includes('reseller audit') &&
      !r.profile.resellerUid.includes('TEST')
    );
  });

  const total = resellers.length;
  const activeCount = resellers.filter((r) => r.profile.status === 'active').length;
  const suspendedCount = resellers.filter((r) => r.profile.status !== 'active').length;
  const todayCount = resellers.filter(
    (r) => getIstDateKey(r.profile.createdAt) === todayKey
  ).length;

  const sorted = [...resellers].sort(
    (a, b) => b.resellerEarnings - a.resellerEarnings || b.totalOrders - a.totalOrders
  );

  let listSummary = '• <i>No registered resellers yet</i>';
  if (sorted.length > 0) {
    listSummary = sorted
      .slice(0, 5)
      .map(
        (r, idx) =>
          `${idx + 1}. <b>${escapeHtml(r.profile.displayName)}</b> (<code>${escapeHtml(r.profile.resellerUid)}</code>)\n   • Balance: <b>₹${formatInr(r.wallet.availableBalance)}.00</b> | Sales: <b>${r.totalOrders}</b> | Earned: <b>₹${formatInr(r.resellerEarnings)}.00</b>`
      )
      .join('\n\n');
  }

  const text = `👥 <b>REGISTERED RESELLERS DIRECTORY</b>
━━━━━━━━━━━━━━━━━━
Overview of verified store partners:

• Total Registered: <b>${total} Resellers</b>
• Active Resellers: <b>${activeCount}</b>
• Suspended / Inactive: <b>${suspendedCount}</b>
• New Registered Today: <b>${todayCount}</b>

🏆 <b>ACTIVE PARTNERS OVERVIEW:</b>
${listSummary}
━━━━━━━━━━━━━━━━━━
👇 <b>Tap any partner button below to view full details (Balance, Sales, Withdrawals, UPI):</b>`;

  // Dynamic animated buttons for each real registered reseller
  const inlineButtons: Array<Array<TelegramInlineButton>> = [];

  sorted.forEach((r) => {
    inlineButtons.push([
      {
        text: `👤 ${r.profile.displayName || 'Partner'} • ${r.profile.resellerUid}`,
        callback_data: `res:view:${r.profile.resellerUid}`,
      },
    ]);
  });

  inlineButtons.push([
    { text: '🔎 Search by UID', callback_data: 'res:search' },
    { text: '🏆 Leaderboard', callback_data: 'res:top' },
  ]);

  inlineButtons.push([
    { text: '🏠 Main Dashboard', callback_data: 'nav:home' },
  ]);

  return renderView(chatId, messageId, text, inlineButtons);
}

// --- 5.2.1 RESELLER SEARCH PROMPT ---
export async function promptResellerUidSearch(chatId: string, messageId?: number): Promise<boolean> {
  const session = getSession(chatId);
  session.pendingAction = 'search_reseller_uid';

  const text = `🔎 <b>SEARCH RESELLER BY UID</b>
━━━━━━━━━━━━━━━━━━
Please type and send the permanent <b>Reseller UID</b> to inspect.

<i>Example:</i> <code>RSL-ZB47ZAK9</code> or <code>RSL-8K4M2P9X</code>

Type your search or click Cancel below:`;

  const inlineButtons: Array<Array<TelegramInlineButton>> = [
    [{ text: '❌ Cancel Search', callback_data: 'nav:res' }],
    [{ text: '🏠 Main Dashboard', callback_data: 'nav:home' }],
  ];

  return renderView(chatId, messageId, text, inlineButtons);
}

// --- 5.2.2 RESELLER DETAIL VIEW ---
export async function renderResellerDetail(
  uid: string,
  chatId: string,
  messageId?: number
): Promise<boolean> {
  clearSessionAction(chatId);
  const cleanUid = uid.trim().toUpperCase();
  const data = await getResellerAnalytics(cleanUid);

  if (!data) {
    const errorText = `❌ <b>Reseller Not Found</b>
━━━━━━━━━━━━━━━━━━
No reseller matches UID: <code>${escapeHtml(cleanUid)}</code>

Please verify the UID format (e.g. <code>RSL-ZB47ZAK9</code>).`;
    const buttons: Array<Array<TelegramInlineButton>> = [
      [{ text: '🔎 Search Again', callback_data: 'res:search' }],
      [{ text: '⬅️ Back to Resellers', callback_data: 'nav:res' }],
      [{ text: '🏠 Main Dashboard', callback_data: 'nav:home' }],
    ];
    return renderView(chatId, messageId, errorText, buttons);
  }

  const { profile, wallet, totalOrders, unitsSold, grossSales, netSales, resellerEarnings } = data;
  const regDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })
    : 'N/A';

  const upiId = profile.payoutDetails?.upiId || 'Not Saved';
  const recipient = profile.payoutDetails?.accountHolderName || profile.displayName || 'N/A';

  // Fetch recent withdrawals for this reseller
  let wdrLines = '• <i>No payout requests made yet</i>';
  try {
    const { getWithdrawalRequests } = await import('@/lib/resellerService');
    const wdrs = await getWithdrawalRequests(profile.userId);
    if (wdrs.length > 0) {
      wdrLines = wdrs
        .slice(0, 3)
        .map((w) => {
          const badge = w.status === 'paid' ? '✅ Paid' : w.status === 'rejected' ? '❌ Rejected' : '⏳ ' + w.status.toUpperCase();
          return `• <code>${escapeHtml(w.id)}</code>: <b>₹${w.amount}.00</b> (${badge})`;
        })
        .join('\n');
    }
  } catch {}

  const text = `🆔 <b>RESELLER PROFILE:</b> <code>${escapeHtml(profile.resellerUid)}</code>
━━━━━━━━━━━━━━━━━━
👤 <b>Partner Name:</b> ${escapeHtml(profile.displayName)}
📧 <b>Email:</b> ${escapeHtml(profile.email)}
${profile.phone ? `📱 <b>Phone:</b> <code>${escapeHtml(profile.phone)}</code>\n` : ''}📅 <b>Registered At:</b> ${escapeHtml(regDate)} (IST)
🛡️ <b>Account Status:</b> <b>✅ ${escapeHtml(profile.status.toUpperCase())}</b>

👛 <b>WALLET OVERVIEW</b>
• Available to Withdraw: <b>₹${formatInr(wallet.availableBalance)}.00</b>
• Pending Clearance: <b>₹${formatInr(wallet.pendingBalance)}.00</b>
• Total Profit Earned: <b>₹${formatInr(resellerEarnings)}.00</b>
• Total Withdrawn: <b>₹${formatInr(wallet.totalWithdrawn)}.00</b>

🏦 <b>PAYOUT UPI DETAILS</b>
• UPI ID: <code>${escapeHtml(upiId)}</code>
• Recipient: <b>${escapeHtml(recipient)}</b>

📊 <b>SALES & REVENUE STATS</b>
• Verified Orders: <b>${totalOrders}</b> (Units Sold: <b>${unitsSold}</b>)
• Gross Sales Volume: <b>₹${formatInr(grossSales)}.00</b>
• Net Sales Revenue: <b>₹${formatInr(netSales)}.00</b>

💸 <b>RECENT WITHDRAWALS:</b>
${wdrLines}
━━━━━━━━━━━━━━━━━━
Choose a section below to audit or manage:`;

  const inlineButtons: Array<Array<TelegramInlineButton>> = [
    [
      { text: '👛 Audit Wallet', callback_data: `res:wall:${profile.resellerUid}` },
      { text: '📦 View Orders', callback_data: `res:sales:${profile.resellerUid}` },
    ],
    [
      { text: '💸 Withdrawals', callback_data: `res:wdr:${profile.resellerUid}` },
      { text: '🛍 Products', callback_data: `res:prod:${profile.resellerUid}` },
    ],
    [
      { text: '⬅️ Back to Resellers', callback_data: 'nav:res' },
      { text: '🏠 Main Dashboard', callback_data: 'nav:home' },
    ],
  ];

  return renderView(chatId, messageId, text, inlineButtons);
}

// --- 5.2.3 RESELLER WALLET DETAIL VIEW ---
export async function renderResellerWalletDetail(
  uid: string,
  chatId: string,
  messageId?: number
): Promise<boolean> {
  const cleanUid = uid.trim().toUpperCase();
  const data = await getResellerAnalytics(cleanUid);
  if (!data) return renderResellerDetail(cleanUid, chatId, messageId);

  const { profile, wallet } = data;
  const txs = await getResellerTransactions(profile.userId);

  let txLines = '• <i>No ledger transactions recorded yet</i>';
  if (txs.length > 0) {
    txLines = txs
      .slice(0, 6)
      .map((t) => {
        const sign = t.amount >= 0 ? '+' : '';
        const dateStr = new Date(t.createdAt).toLocaleDateString('en-IN');
        return `• <b>${sign}₹${t.amount}.00</b> — ${escapeHtml(t.description || t.type)} <small>(${dateStr})</small>`;
      })
      .join('\n');
  }

  const text = `👛 <b>WALLET RECONCILIATION:</b> <code>${escapeHtml(profile.resellerUid)}</code>
━━━━━━━━━━━━━━━━━━
👤 <b>Partner:</b> ${escapeHtml(profile.displayName)}
📧 <b>Email:</b> ${escapeHtml(profile.email)}

💰 <b>BALANCE SNAPSHOT:</b>
• Available to Withdraw: <b>₹${formatInr(wallet.availableBalance)}.00</b>
• Pending Balance: <b>₹${formatInr(wallet.pendingBalance)}.00</b>
• Lifetime Profit Earned: <b>₹${formatInr(wallet.totalEarned)}.00</b>
• Total Payouts Completed: <b>₹${formatInr(wallet.totalWithdrawn)}.00</b>

🏦 <b>REGISTERED PAYOUT METHOD:</b>
• UPI ID: <code>${escapeHtml(profile.payoutDetails?.upiId || 'Not Saved')}</code>
• Recipient: <b>${escapeHtml(profile.payoutDetails?.accountHolderName || profile.displayName)}</b>

📜 <b>RECENT LEDGER TRANSACTIONS:</b>
${txLines}
━━━━━━━━━━━━━━━━━━`;

  const buttons: Array<Array<TelegramInlineButton>> = [
    [
      { text: '💸 Withdrawals', callback_data: `res:wdr:${profile.resellerUid}` },
      { text: '📦 View Orders', callback_data: `res:sales:${profile.resellerUid}` },
    ],
    [
      { text: `⬅️ Back to ${profile.resellerUid}`, callback_data: `res:view:${profile.resellerUid}` },
      { text: '👥 All Resellers', callback_data: 'nav:res' },
    ],
    [{ text: '🏠 Main Dashboard', callback_data: 'nav:home' }],
  ];

  return renderView(chatId, messageId, text, buttons);
}

// --- 5.2.4 RESELLER SALES DETAIL VIEW ---
export async function renderResellerSalesDetail(
  uid: string,
  chatId: string,
  messageId?: number
): Promise<boolean> {
  const cleanUid = uid.trim().toUpperCase();
  const data = await getResellerAnalytics(cleanUid);
  if (!data) return renderResellerDetail(cleanUid, chatId, messageId);

  const { profile, totalOrders, unitsSold, grossSales, resellerEarnings, recentOrders } = data;

  let orderLines = '• <i>No verified orders yet</i>';
  if (recentOrders && recentOrders.length > 0) {
    orderLines = recentOrders
      .slice(0, 6)
      .map((o) => {
        const dateStr = new Date(o.createdAt).toLocaleDateString('en-IN');
        return `• <code>${escapeHtml(o.orderId)}</code>: <b>${escapeHtml(o.productTitle)}</b>\n   Sold at <b>₹${o.resalePrice}.00</b> | Reseller Profit: <b>+₹${o.earningAmount}.00</b> (${dateStr})`;
      })
      .join('\n\n');
  }

  const text = `📦 <b>ATTRIBUTED SALES:</b> <code>${escapeHtml(profile.resellerUid)}</code>
━━━━━━━━━━━━━━━━━━
👤 <b>Partner:</b> ${escapeHtml(profile.displayName)}
📧 <b>Email:</b> ${escapeHtml(profile.email)}

📊 <b>PERFORMANCE METRICS:</b>
• Total Verified Orders: <b>${totalOrders}</b>
• Total Units Sold: <b>${unitsSold}</b>
• Gross Sales Volume: <b>₹${formatInr(grossSales)}.00</b>
• Net Reseller Commission: <b>₹${formatInr(resellerEarnings)}.00</b>

🛍 <b>RECENT ORDERS LIST:</b>
${orderLines}
━━━━━━━━━━━━━━━━━━`;

  const buttons: Array<Array<TelegramInlineButton>> = [
    [
      { text: '👛 Audit Wallet', callback_data: `res:wall:${profile.resellerUid}` },
      { text: '💸 Withdrawals', callback_data: `res:wdr:${profile.resellerUid}` },
    ],
    [
      { text: `⬅️ Back to ${profile.resellerUid}`, callback_data: `res:view:${profile.resellerUid}` },
      { text: '👥 All Resellers', callback_data: 'nav:res' },
    ],
    [{ text: '🏠 Main Dashboard', callback_data: 'nav:home' }],
  ];

  return renderView(chatId, messageId, text, buttons);
}

// --- 5.2.5 RESELLER WITHDRAWALS DETAIL VIEW ---
export async function renderResellerWithdrawalsDetail(
  uid: string,
  chatId: string,
  messageId?: number
): Promise<boolean> {
  const cleanUid = uid.trim().toUpperCase();
  const data = await getResellerAnalytics(cleanUid);
  if (!data) return renderResellerDetail(cleanUid, chatId, messageId);

  const { profile, wallet } = data;
  let wdrs: any[] = [];
  try {
    const { getWithdrawalRequests } = await import('@/lib/resellerService');
    wdrs = await getWithdrawalRequests(profile.userId);
  } catch {}

  let wdrLines = '• <i>No payout requests submitted yet</i>';
  if (wdrs.length > 0) {
    wdrLines = wdrs
      .slice(0, 6)
      .map((w) => {
        const badge = w.status === 'paid' ? '✅ PAID' : w.status === 'rejected' ? '❌ REJECTED' : '⏳ ' + w.status.toUpperCase();
        const dateStr = new Date(w.createdAt).toLocaleDateString('en-IN');
        return `• <code>${escapeHtml(w.id)}</code>: <b>₹${w.amount}.00</b> — <b>${badge}</b>\n   UPI: <code>${escapeHtml(w.payoutDetails?.upiId || 'N/A')}</code> (${dateStr})`;
      })
      .join('\n\n');
  }

  const text = `💸 <b>PAYOUT REQUESTS:</b> <code>${escapeHtml(profile.resellerUid)}</code>
━━━━━━━━━━━━━━━━━━
👤 <b>Partner:</b> ${escapeHtml(profile.displayName)}
📧 <b>Email:</b> ${escapeHtml(profile.email)}

💰 <b>WALLET STATUS:</b>
• Available to Withdraw: <b>₹${formatInr(wallet.availableBalance)}.00</b>
• Total Successfully Paid: <b>₹${formatInr(wallet.totalWithdrawn)}.00</b>
• Registered UPI: <code>${escapeHtml(profile.payoutDetails?.upiId || 'Not Saved')}</code>

📋 <b>WITHDRAWAL HISTORY:</b>
${wdrLines}
━━━━━━━━━━━━━━━━━━`;

  const buttons: Array<Array<TelegramInlineButton>> = [
    [
      { text: '👛 Audit Wallet', callback_data: `res:wall:${profile.resellerUid}` },
      { text: '📦 View Orders', callback_data: `res:sales:${profile.resellerUid}` },
    ],
    [
      { text: `⬅️ Back to ${profile.resellerUid}`, callback_data: `res:view:${profile.resellerUid}` },
      { text: '👥 All Resellers', callback_data: 'nav:res' },
    ],
    [{ text: '🏠 Main Dashboard', callback_data: 'nav:home' }],
  ];

  return renderView(chatId, messageId, text, buttons);
}

// --- 5.2.6 RESELLER PRODUCTS DETAIL VIEW ---
export async function renderResellerProductsDetail(
  uid: string,
  chatId: string,
  messageId?: number
): Promise<boolean> {
  const cleanUid = uid.trim().toUpperCase();
  const data = await getResellerAnalytics(cleanUid);
  if (!data) return renderResellerDetail(cleanUid, chatId, messageId);

  const { profile } = data;
  let listings: any[] = [];
  try {
    const { getResellerListingsByUser } = await import('@/lib/resellerService');
    listings = await getResellerListingsByUser(profile.userId);
  } catch {}

  let listLines = '• <i>No bundles published yet</i>';
  if (listings.length > 0) {
    listLines = listings
      .slice(0, 6)
      .map((l) => {
        return `• <b>${escapeHtml(l.customTitle)}</b>\n   Resale: <b>₹${l.resalePrice}.00</b> | Slug: <code>${escapeHtml(l.slug)}</code>\n   Sales: <b>${l.salesCount || 0}</b> | Earned: <b>₹${l.totalEarned || 0}.00</b>`;
      })
      .join('\n\n');
  }

  const text = `🛍 <b>PUBLISHED BUNDLES:</b> <code>${escapeHtml(profile.resellerUid)}</code>
━━━━━━━━━━━━━━━━━━
👤 <b>Partner:</b> ${escapeHtml(profile.displayName)}
📧 <b>Email:</b> ${escapeHtml(profile.email)}

📦 <b>RESELLER LISTINGS:</b>
${listLines}
━━━━━━━━━━━━━━━━━━`;

  const buttons: Array<Array<TelegramInlineButton>> = [
    [
      { text: '👛 Audit Wallet', callback_data: `res:wall:${profile.resellerUid}` },
      { text: '📦 View Orders', callback_data: `res:sales:${profile.resellerUid}` },
    ],
    [
      { text: `⬅️ Back to ${profile.resellerUid}`, callback_data: `res:view:${profile.resellerUid}` },
      { text: '👥 All Resellers', callback_data: 'nav:res' },
    ],
    [{ text: '🏠 Main Dashboard', callback_data: 'nav:home' }],
  ];

  return renderView(chatId, messageId, text, buttons);
}

// --- 5.3 SALES VIEW ---
export async function renderSalesMenu(
  chatId: string,
  messageId?: number,
  filter: 'today' | '7d' | 'month' | 'all' | 'by_reseller' | 'by_product' | 'refunds' = 'today'
): Promise<boolean> {
  clearSessionAction(chatId);
  const now = new Date();
  const todayKey = getIstDateKey(now);
  const currentMonthKey = todayKey.slice(0, 7); // YYYY-MM
  const sevenDaysAgoTime = now.getTime() - 7 * 24 * 60 * 60 * 1000;

  const orders = await fetchActiveFirestoreOrders();

  let filteredOrders = orders;
  let periodLabel = 'Today';

  if (filter === 'today') {
    periodLabel = `Today (${todayKey} IST)`;
    filteredOrders = orders.filter(
      (o) => getIstDateKey(o.timestampIso || o.createdAt) === todayKey
    );
  } else if (filter === '7d') {
    periodLabel = 'Last 7 Days (IST)';
    filteredOrders = orders.filter((o) => {
      const t = new Date(o.timestampIso || o.createdAt).getTime();
      return !isNaN(t) && t >= sevenDaysAgoTime;
    });
  } else if (filter === 'month') {
    periodLabel = `This Month (${currentMonthKey} IST)`;
    filteredOrders = orders.filter((o) => {
      const key = getIstDateKey(o.timestampIso || o.createdAt);
      return key.startsWith(currentMonthKey);
    });
  } else if (filter === 'refunds') {
    periodLabel = 'Refunded Orders (All Time)';
    filteredOrders = orders.filter((o) => o.status === 'refunded');
  } else if (filter === 'all') {
    periodLabel = 'All Time';
    filteredOrders = orders;
  }

  // Calculate metrics
  const verifiedOrders = filteredOrders.filter(
    (o) => o.status === 'completed' || o.status === 'paid'
  );
  const refundedOrders = filteredOrders.filter((o) => o.status === 'refunded');

  const verifiedOrderCount = verifiedOrders.length;
  const unitsSold = verifiedOrders.reduce(
    (sum, o) => sum + (Array.isArray(o.items) && o.items.length > 0 ? o.items.length : 1),
    0
  );
  const grossAttributedSales = verifiedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const refundTotals = refundedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const netSales = Math.max(0, grossAttributedSales - refundTotals);
  const resellerEarnings = verifiedOrders.reduce((sum, o) => sum + (o.reseller_earning || 0), 0);

  // Breakdown lines
  let recentLines = '<i>No orders found for this period.</i>';
  if (verifiedOrders.length > 0) {
    recentLines = verifiedOrders
      .slice(0, 5)
      .map((o, idx) => {
        const rslTag = o.reseller_uid ? ` [${escapeHtml(o.reseller_uid)}]` : '';
        const itemName =
          Array.isArray(o.items) && o.items[0]?.title ? o.items[0].title : 'Reels Bundle';
        return `${idx + 1}. <b>#${escapeHtml(o.orderNumber)}</b> — ${formatInr(o.totalAmount)}${rslTag}\n   📦 ${escapeHtml(itemName)}`;
      })
      .join('\n');
  }

  const text = `💰 <b>SALES REPORT: ${escapeHtml(periodLabel)}</b>
━━━━━━━━━━━━━━━━━━
• Verified Orders: <b>${verifiedOrderCount}</b>
• Units Sold: <b>${unitsSold}</b>
• Gross Attributed Sales: <b>${formatInr(grossAttributedSales)}.00</b>
• Refund Totals: <b>${formatInr(refundTotals)}.00</b>
• Net Sales After Refunds: <b>${formatInr(netSales)}.00</b>
• Reseller Earnings: <b>${formatInr(resellerEarnings)}.00</b>
• Reporting Period: <b>${escapeHtml(periodLabel)}</b>

📋 <b>RECENT ORDERS:</b>
${recentLines}
━━━━━━━━━━━━━━━━━━
Select another time filter or breakdown:`;

  const inlineButtons: Array<Array<TelegramInlineButton>> = [
    [
      { text: filter === 'today' ? '• 📅 Today •' : '📅 Today', callback_data: 'sales:today' },
      { text: filter === '7d' ? '• 📆 Last 7 Days •' : '📆 Last 7 Days', callback_data: 'sales:7d' },
    ],
    [
      { text: filter === 'month' ? '• 🗓 This Month •' : '🗓 This Month', callback_data: 'sales:month' },
      { text: filter === 'all' ? '• 📊 All Time •' : '📊 All Time', callback_data: 'sales:all' },
    ],
    [
      { text: '👤 Sales by Reseller', callback_data: 'sales:by_reseller' },
      { text: '🛍 Sales by Product', callback_data: 'sales:by_product' },
    ],
    [
      { text: filter === 'refunds' ? '• ↩️ Refunds •' : '↩️ Refunds', callback_data: 'sales:refunds' },
      { text: '🏠 Home', callback_data: 'nav:home' },
    ],
  ];

  return renderView(chatId, messageId, text, inlineButtons);
}

// --- 5.4 PRODUCTS VIEW ---
export async function renderProductsMenu(
  chatId: string,
  messageId?: number,
  filter: 'top' | 'low' | 'perf' | 'search' = 'top',
  page: number = 0
): Promise<boolean> {
  clearSessionAction(chatId);
  const orders = await fetchActiveFirestoreOrders();
  const verifiedOrders = orders.filter((o) => o.status === 'completed' || o.status === 'paid');

  // Compute product stats map
  const productStats = new Map<
    string,
    { title: string; orders: number; units: number; gross: number; earnings: number }
  >();

  BUNDLE_PRODUCTS.forEach((p) => {
    productStats.set(p.id, {
      title: p.title,
      orders: 0,
      units: 0,
      gross: 0,
      earnings: 0,
    });
  });

  verifiedOrders.forEach((o) => {
    const items = Array.isArray(o.items) ? o.items : [];
    items.forEach((it: any) => {
      const match = BUNDLE_PRODUCTS.find(
        (b) => b.id === it.id || b.title.toLowerCase() === (it.title || '').toLowerCase()
      );
      const key = match ? match.id : it.id || it.title;
      const cur = productStats.get(key) || {
        title: it.title || 'Unknown Product',
        orders: 0,
        units: 0,
        gross: 0,
        earnings: 0,
      };
      cur.orders += 1;
      cur.units += it.quantity || 1;
      cur.gross += it.price || o.totalAmount || 0;
      cur.earnings += o.reseller_earning || 0;
      productStats.set(key, cur);
    });
  });

  let productList = Array.from(productStats.values());

  if (filter === 'top') {
    productList.sort((a, b) => b.orders - a.orders || b.gross - a.gross);
  } else if (filter === 'low') {
    productList.sort((a, b) => a.orders - b.orders || a.gross - b.gross);
  } else {
    productList.sort((a, b) => b.gross - a.gross);
  }

  const PAGE_SIZE = 5;
  const totalPages = Math.ceil(productList.length / PAGE_SIZE) || 1;
  const validPage = Math.max(0, Math.min(page, totalPages - 1));
  const pageSlice = productList.slice(validPage * PAGE_SIZE, (validPage + 1) * PAGE_SIZE);

  let listText = '<i>No products found.</i>';
  if (pageSlice.length > 0) {
    listText = pageSlice
      .map((p, idx) => {
        const rank = validPage * PAGE_SIZE + idx + 1;
        return `${rank}. <b>${escapeHtml(p.title)}</b>\n   • Orders: <b>${p.orders}</b> | Units: <b>${p.units}</b>\n   • Gross: <b>${formatInr(p.gross)}</b> | Reseller Margins: <b>${formatInr(p.earnings)}</b>`;
      })
      .join('\n\n');
  }

  const titlePrefix =
    filter === 'top'
      ? '🏆 TOP-SELLING PRODUCTS'
      : filter === 'low'
      ? '📉 LOWEST-SELLING PRODUCTS'
      : '📊 PRODUCT CATALOG PERFORMANCE';

  const text = `🛍 <b>${titlePrefix}</b>
━━━━━━━━━━━━━━━━━━
Page ${validPage + 1} of ${totalPages}

${listText}
━━━━━━━━━━━━━━━━━━
Filter products or navigate pages:`;

  const navRow: TelegramInlineButton[] = [];
  if (validPage > 0) {
    navRow.push({ text: '◀️ Prev', callback_data: `prod:page:${filter}:${validPage - 1}` });
  }
  if (validPage < totalPages - 1) {
    navRow.push({ text: 'Next ▶️', callback_data: `prod:page:${filter}:${validPage + 1}` });
  }

  const inlineButtons: Array<Array<TelegramInlineButton>> = [
    [
      { text: filter === 'top' ? '• 🏆 Top Products •' : '🏆 Top-Selling', callback_data: 'prod:top' },
      { text: filter === 'low' ? '• 📉 Lowest •' : '📉 Lowest-Selling', callback_data: 'prod:low' },
    ],
    [
      { text: filter === 'perf' ? '• 📊 Performance •' : '📊 Full Performance', callback_data: 'prod:perf' },
      { text: '🔎 Search Product', callback_data: 'prod:search' },
    ],
  ];

  if (navRow.length > 0) {
    inlineButtons.push(navRow);
  }
  inlineButtons.push([{ text: '🏠 Home', callback_data: 'nav:home' }]);

  return renderView(chatId, messageId, text, inlineButtons);
}

// --- 5.5 WALLETS VIEW ---
export async function renderWalletsMenu(
  chatId: string,
  messageId?: number,
  sub: 'summary' | 'pending' | 'available' | 'reserved' | 'transactions' = 'summary'
): Promise<boolean> {
  clearSessionAction(chatId);
  const [resellers, withdrawals, transactions] = await Promise.all([
    getAllResellersAnalytics(),
    fetchAllWithdrawals(),
    fetchAllWalletTransactions(),
  ]);

  const totalAvailable = resellers.reduce((sum, r) => sum + (r.wallet.availableBalance || 0), 0);
  const totalPending = resellers.reduce((sum, r) => sum + (r.wallet.pendingBalance || 0), 0);
  const totalLifetime = resellers.reduce((sum, r) => sum + (r.wallet.totalEarned || 0), 0);
  const totalWithdrawn = resellers.reduce((sum, r) => sum + (r.wallet.totalWithdrawn || 0), 0);

  const pendingWdrs = withdrawals.filter(
    (w) => w.status === 'pending' || w.status === 'pending_review'
  );
  const reservedFunds = pendingWdrs.reduce((sum, w) => sum + (w.amount || 0), 0);

  let bodyContent = '';

  if (sub === 'transactions') {
    let txLines = '<i>No ledger transactions recorded yet.</i>';
    if (transactions.length > 0) {
      txLines = transactions
        .slice(0, 5)
        .map((t, idx) => {
          const sign = t.amount >= 0 ? '+' : '';
          const uidTag = t.resellerUid ? ` [${escapeHtml(t.resellerUid)}]` : '';
          return `${idx + 1}. <b>${sign}${formatInr(t.amount)}</b> [${escapeHtml(t.type)}]${uidTag}\n   Status: <b>${escapeHtml(t.status)}</b> | ${escapeHtml(t.description)}`;
        })
        .join('\n\n');
    }
    bodyContent = `📜 <b>RECENT FINANCIAL LEDGER TRANSACTIONS</b>\n\n${txLines}`;
  } else if (sub === 'available') {
    const sortedByAvail = [...resellers].sort(
      (a, b) => b.wallet.availableBalance - a.wallet.availableBalance
    );
    const lines = sortedByAvail
      .slice(0, 5)
      .map(
        (r, idx) =>
          `${idx + 1}. <b>${escapeHtml(r.profile.resellerUid)}</b> (${escapeHtml(r.profile.displayName)}): <b>${formatInr(r.wallet.availableBalance)}</b>`
      )
      .join('\n');
    bodyContent = `💵 <b>TOP WITHDRAWABLE BALANCES</b>\n\n${lines || '<i>No balances</i>'}`;
  } else if (sub === 'reserved') {
    const lines = pendingWdrs
      .slice(0, 5)
      .map(
        (w, idx) =>
          `${idx + 1}. <b>#${escapeHtml(w.id)}</b> [${escapeHtml(w.resellerUid)}]: <b>${formatInr(w.amount)}</b> (${escapeHtml(w.status)})`
      )
      .join('\n');
    bodyContent = `🔒 <b>RESERVED WITHDRAWAL FUNDS: ${formatInr(reservedFunds)}</b>\n\n${lines || '<i>No active reservations</i>'}`;
  } else {
    bodyContent = `💰 <b>STORE-WIDE WALLET LIABILITIES:</b>
• Total Available to Withdraw: <b>${formatInr(totalAvailable)}.00</b>
• Total Pending Settlement: <b>${formatInr(totalPending)}.00</b>
• Total Reserved in Payouts: <b>${formatInr(reservedFunds)}.00</b>
• Total Lifetime Reseller Earnings: <b>${formatInr(totalLifetime)}.00</b>
• Total Completed Withdrawals: <b>${formatInr(totalWithdrawn)}.00</b>`;
  }

  const text = `👛 <b>RESELLER WALLETS & FINANCIAL LEDGER</b>
━━━━━━━━━━━━━━━━━━
${bodyContent}
━━━━━━━━━━━━━━━━━━
Select wallet views or search partner:`;

  const inlineButtons: Array<Array<TelegramInlineButton>> = [
    [
      { text: sub === 'summary' ? '• 💰 Summary •' : '💰 Summary', callback_data: 'wall:sum' },
      { text: sub === 'pending' ? '• ⏳ Pending •' : '⏳ Pending', callback_data: 'wall:pend' },
    ],
    [
      { text: sub === 'available' ? '• 💵 Available •' : '💵 Available', callback_data: 'wall:avail' },
      { text: sub === 'reserved' ? '• 🔒 Reserved •' : '🔒 Reserved', callback_data: 'wall:res' },
    ],
    [
      { text: '📜 Recent Ledger Txs', callback_data: 'wall:txs' },
      { text: '🔎 Find Reseller', callback_data: 'res:search' },
    ],
    [{ text: '🏠 Home', callback_data: 'nav:home' }],
  ];

  return renderView(chatId, messageId, text, inlineButtons);
}

// --- 5.6 WITHDRAWALS VIEW ---
export async function renderWithdrawalsMenu(
  chatId: string,
  messageId?: number,
  filter: 'pending' | 'processing' | 'completed' | 'rejected' | 'summary' = 'pending'
): Promise<boolean> {
  clearSessionAction(chatId);
  const withdrawals = await fetchAllWithdrawals();

  let filtered = withdrawals;
  let statusTitle = 'PENDING REQUESTS';

  if (filter === 'pending') {
    statusTitle = 'PENDING REQUESTS';
    filtered = withdrawals.filter((w) => w.status === 'pending' || w.status === 'pending_review');
  } else if (filter === 'processing') {
    statusTitle = 'PROCESSING PAYOUTS';
    filtered = withdrawals.filter((w) => w.status === 'approved');
  } else if (filter === 'completed') {
    statusTitle = 'COMPLETED PAYOUTS';
    filtered = withdrawals.filter((w) => w.status === 'paid');
  } else if (filter === 'rejected') {
    statusTitle = 'REJECTED REQUESTS';
    filtered = withdrawals.filter((w) => w.status === 'rejected');
  }

  let listText = '<i>No records matching status.</i>';
  if (filtered.length > 0) {
    listText = filtered
      .slice(0, 5)
      .map((w, idx) => {
        const date = w.createdAt ? new Date(w.createdAt).toLocaleDateString('en-IN') : 'N/A';
        const maskedUpi = w.payoutDetails?.upiId ? maskUpiId(w.payoutDetails.upiId) : 'N/A';
        return `${idx + 1}. <b>#${escapeHtml(w.id)}</b> — <b>${formatInr(w.amount)}</b> [${escapeHtml(w.resellerUid)}]\n   UPI: <code>${escapeHtml(maskedUpi)}</code> | Date: ${date}\n   Status: <b>${escapeHtml(w.status)}</b>`;
      })
      .join('\n\n');
  }

  const text = `💸 <b>WITHDRAWAL WORKFLOW: ${statusTitle}</b>
━━━━━━━━━━━━━━━━━━
Total matching: <b>${filtered.length}</b>

${listText}
━━━━━━━━━━━━━━━━━━
Select status filter or search:`;

  const inlineButtons: Array<Array<TelegramInlineButton>> = [
    [
      { text: filter === 'pending' ? '• 🆕 Pending •' : '🆕 Pending Requests', callback_data: 'wdr:pend' },
      { text: filter === 'processing' ? '• ⏳ Processing •' : '⏳ Processing', callback_data: 'wdr:proc' },
    ],
    [
      { text: filter === 'completed' ? '• ✅ Completed •' : '✅ Completed Payouts', callback_data: 'wdr:done' },
      { text: filter === 'rejected' ? '• ❌ Rejected •' : '❌ Rejected Requests', callback_data: 'wdr:rej' },
    ],
    [
      { text: '📊 Withdrawal Summary', callback_data: 'wdr:sum' },
      { text: '🌐 Admin Panel', url: 'https://vaultworld.shop/asdf/resellers' },
    ],
    [{ text: '🏠 Home', callback_data: 'nav:home' }],
  ];

  return renderView(chatId, messageId, text, inlineButtons);
}

// --- 5.7 FRAUD MONITOR VIEW ---
export async function renderFraudMonitorMenu(
  chatId: string,
  messageId?: number,
  filter: 'risk' | 'suspicious_wdr' | 'dup' | 'refunds' | 'flagged' | 'history' = 'risk'
): Promise<boolean> {
  clearSessionAction(chatId);
  const [resellers, orders, withdrawals] = await Promise.all([
    getAllResellersAnalytics(),
    fetchActiveFirestoreOrders(),
    fetchAllWithdrawals(),
  ]);

  // Risk heuristics:
  // 1. Suspicious withdrawals: amount >= 5000 or reseller has 0 verified orders
  const suspiciousWdrs = withdrawals.filter((w) => {
    const r = resellers.find((res) => res.profile.resellerUid === w.resellerUid);
    return w.amount >= 5000 || (r && r.totalOrders === 0);
  });

  // 2. High refund resellers: refund count / total > 0.2
  const highRefundResellers = resellers.filter((r) => {
    return r.totalOrders > 0 && r.netSales < r.grossSales * 0.7;
  });

  // 3. Flagged resellers: status !== 'active'
  const flaggedResellers = resellers.filter((r) => r.profile.status !== 'active');

  // 4. Duplicate transaction patterns
  const duplicateOrders = orders.filter((o, idx, arr) => {
    return (
      arr.findIndex(
        (other) =>
          other.id !== o.id &&
          other.customer?.phone &&
          other.customer.phone === o.customer?.phone &&
          other.totalAmount === o.totalAmount
      ) !== -1
    );
  });

  let filterTitle = '🚨 HIGH-RISK CASES';
  let reportText = '';

  if (filter === 'suspicious_wdr') {
    filterTitle = '💸 SUSPICIOUS WITHDRAWAL ATTEMPTS';
    reportText =
      suspiciousWdrs.length > 0
        ? suspiciousWdrs
            .slice(0, 5)
            .map(
              (w, idx) =>
                `${idx + 1}. <b>#${escapeHtml(w.id)}</b> [${escapeHtml(w.resellerUid)}]: <b>${formatInr(w.amount)}</b>\n   Reason: High amount or 0 prior orders | Status: <b>${escapeHtml(w.status)}</b>`
            )
            .join('\n\n')
        : '✅ <i>No suspicious withdrawal patterns detected.</i>';
  } else if (filter === 'dup') {
    filterTitle = '🔁 DUPLICATE PAYMENT & REPLAY CHECKS';
    reportText =
      duplicateOrders.length > 0
        ? duplicateOrders
            .slice(0, 5)
            .map(
              (o, idx) =>
                `${idx + 1}. <b>#${escapeHtml(o.orderNumber)}</b> — ${formatInr(o.totalAmount)}\n   Phone: <code>${escapeHtml(o.customer?.phone || 'N/A')}</code> | Status: ${escapeHtml(o.status)}`
            )
            .join('\n\n')
        : '✅ <i>No duplicate payment anomalies found.</i>';
  } else if (filter === 'refunds') {
    filterTitle = '↩️ ABNORMAL REFUND VELOCITY';
    reportText =
      highRefundResellers.length > 0
        ? highRefundResellers
            .slice(0, 5)
            .map(
              (r, idx) =>
                `${idx + 1}. <b>${escapeHtml(r.profile.resellerUid)}</b> (${escapeHtml(r.profile.displayName)})\n   Gross: ${formatInr(r.grossSales)} | Net: ${formatInr(r.netSales)} (High refund delta)`
            )
            .join('\n\n')
        : '✅ <i>All partner refund ratios within safe bounds (<15%).</i>';
  } else if (filter === 'flagged') {
    filterTitle = '👤 FLAGGED & SUSPENDED PARTNERS';
    reportText =
      flaggedResellers.length > 0
        ? flaggedResellers
            .slice(0, 5)
            .map(
              (r, idx) =>
                `${idx + 1}. <b>${escapeHtml(r.profile.resellerUid)}</b> (${escapeHtml(r.profile.displayName)})\n   Status: <b>${escapeHtml(r.profile.status.toUpperCase())}</b>`
            )
            .join('\n\n')
        : '✅ <i>Zero suspended reseller accounts. All active.</i>';
  } else {
    reportText = `• Suspicious Withdrawals Flagged: <b>${suspiciousWdrs.length}</b>
• Duplicate Payment Signals: <b>${duplicateOrders.length}</b>
• High Refund Risk Partners: <b>${highRefundResellers.length}</b>
• Suspended / Inactive Accounts: <b>${flaggedResellers.length}</b>

🛡️ <b>Heuristic Rules Active:</b>
1. Auto-hold withdrawals > ₹5,000 on accounts under 7 days.
2. Immediate flag on refund ratios exceeding 20%.
3. Replay protection active on Cashfree webhook verification.`;
  }

  const text = `🛡 <b>FRAUD MONITOR: ${filterTitle}</b>
━━━━━━━━━━━━━━━━━━
${reportText}
━━━━━━━━━━━━━━━━━━
Inspect risk categories or review in Admin Panel:`;

  const inlineButtons: Array<Array<TelegramInlineButton>> = [
    [
      { text: '🚨 High-Risk Cases', callback_data: 'fraud:risk' },
      { text: '💸 Suspicious Wdrs', callback_data: 'fraud:wdr' },
    ],
    [
      { text: '🔁 Duplicate Payments', callback_data: 'fraud:dup' },
      { text: '↩️ Refund Patterns', callback_data: 'fraud:ref' },
    ],
    [
      { text: '👤 Flagged Partners', callback_data: 'fraud:flag' },
      { text: '🌐 Open Admin Panel', url: 'https://vaultworld.shop/asdf/resellers' },
    ],
    [{ text: '🏠 Home', callback_data: 'nav:home' }],
  ];

  return renderView(chatId, messageId, text, inlineButtons);
}

// --- 5.8 ANALYTICS VIEW ---
export async function renderAnalyticsMenu(
  chatId: string,
  messageId?: number,
  reportType: 'daily' | 'weekly' | 'monthly' | 'reseller' | 'product' | 'withdrawals' | 'export' = 'daily'
): Promise<boolean> {
  clearSessionAction(chatId);
  const todayKey = getIstDateKey();
  const [resellers, orders, withdrawals] = await Promise.all([
    getAllResellersAnalytics(),
    fetchActiveFirestoreOrders(),
    fetchAllWithdrawals(),
  ]);

  const verifiedOrders = orders.filter((o) => o.status === 'completed' || o.status === 'paid');
  const totalGross = verifiedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalRefunds = orders
    .filter((o) => o.status === 'refunded')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalNet = Math.max(0, totalGross - totalRefunds);
  const totalEarnings = verifiedOrders.reduce((sum, o) => sum + (o.reseller_earning || 0), 0);

  const completedWdrs = withdrawals.filter((w) => w.status === 'paid');
  const paidWdrAmount = completedWdrs.reduce((sum, w) => sum + (w.amount || 0), 0);

  let bodyText = '';
  let subTitle = 'EXECUTIVE SUMMARY';

  if (reportType === 'daily') {
    subTitle = `DAILY REPORT (${todayKey} IST)`;
    const todayOrders = verifiedOrders.filter(
      (o) => getIstDateKey(o.timestampIso || o.createdAt) === todayKey
    );
    const todayGross = todayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const todayReseller = todayOrders.reduce((sum, o) => sum + (o.reseller_earning || 0), 0);
    bodyText = `• Verified Orders Today: <b>${todayOrders.length}</b>
• Gross Sales Today: <b>${formatInr(todayGross)}.00</b>
• Reseller Earnings Today: <b>${formatInr(todayReseller)}.00</b>
• Net Store Retention: <b>${formatInr(todayGross - todayReseller)}.00</b>`;
  } else if (reportType === 'export') {
    subTitle = 'EXPORT REPORT SUMMARY';
    bodyText = `📊 <b>CSV EXPORT READY</b>
All records are archived in Firestore and accessible via the secure web admin:
👉 https://vaultworld.shop/asdf/resellers

• Total Partners: <b>${resellers.length}</b>
• Total Orders: <b>${verifiedOrders.length}</b>
• Lifetime Attributed: <b>${formatInr(totalGross)}.00</b>`;
  } else {
    bodyText = `• Total Registered Partners: <b>${resellers.length}</b>
• Total Attributed Orders: <b>${verifiedOrders.length}</b>
• Gross Attributed Sales: <b>${formatInr(totalGross)}.00</b>
• Total Refunds Deducted: <b>${formatInr(totalRefunds)}.00</b>
• Net Attributed Volume: <b>${formatInr(totalNet)}.00</b>
• Reseller Partner Earnings: <b>${formatInr(totalEarnings)}.00</b>
• Completed Payouts: <b>${formatInr(paidWdrAmount)}.00</b>`;
  }

  const text = `📈 <b>ANALYTICS: ${subTitle}</b>
━━━━━━━━━━━━━━━━━━
${bodyText}
━━━━━━━━━━━━━━━━━━
Choose a detailed breakdown report:`;

  const inlineButtons: Array<Array<TelegramInlineButton>> = [
    [
      { text: '📅 Daily Report', callback_data: 'ana:daily' },
      { text: '📆 Weekly Report', callback_data: 'ana:weekly' },
    ],
    [
      { text: '🗓 Monthly Report', callback_data: 'ana:monthly' },
      { text: '👥 Reseller Perf', callback_data: 'ana:res' },
    ],
    [
      { text: '🛍 Product Perf', callback_data: 'ana:prod' },
      { text: '💸 Withdrawal Stats', callback_data: 'ana:wdr' },
    ],
    [
      { text: '📤 Export Summary', callback_data: 'ana:export' },
      { text: '🏠 Home', callback_data: 'nav:home' },
    ],
  ];

  return renderView(chatId, messageId, text, inlineButtons);
}

// --- 5.9 NOTIFICATIONS VIEW ---
export async function renderNotificationsMenu(
  chatId: string,
  messageId?: number,
  filter?: string
): Promise<boolean> {
  clearSessionAction(chatId);

  const text = `🔔 <b>NOTIFICATION CENTER</b>
━━━━━━━━━━━━━━━━━━
Telegram webhook and real-time alert dispatch health:

• Bot Token: <b>Active &amp; Connected</b> (@Vault_World_bot)
• Webhook Status: <b>200 OK (Vercel Production)</b>
• Registered Authorized Admins: <b>${AUTHORIZED_TELEGRAM_ADMINS.length} accounts</b>
${AUTHORIZED_TELEGRAM_ADMINS.map((id, idx) => `  ${idx + 1}. <code>${id}</code>`).join('\n')}
• Notification Events Active:
  ✅ New Reseller Registration
  ✅ Instant Cashfree Verified Sale
  ✅ Abandoned Checkout / Lead Recovery
  ✅ Withdrawal Requests
  ✅ Nightly Store Financial Summary

━━━━━━━━━━━━━━━━━━
Click Test Notification below to verify real-time bot latency:`;

  const inlineButtons: Array<Array<TelegramInlineButton>> = [
    [
      { text: '🔔 Delivery Status', callback_data: 'notif:status' },
      { text: '🧪 Test Notification', callback_data: 'notif:test' },
    ],
    [
      { text: '🆕 Reseller Alerts', callback_data: 'notif:newres' },
      { text: '💸 Withdrawal Alerts', callback_data: 'notif:wdr' },
    ],
    [{ text: '🏠 Home', callback_data: 'nav:home' }],
  ];

  return renderView(chatId, messageId, text, inlineButtons);
}

// --- 5.10 SETTINGS VIEW ---
export async function renderSettingsMenu(
  chatId: string,
  messageId?: number,
  sub?: string
): Promise<boolean> {
  clearSessionAction(chatId);

  const text = `⚙️ <b>BOT & SYSTEM SETTINGS</b>
━━━━━━━━━━━━━━━━━━
• Application: <b>MYZTORE Digital Reseller Network</b>
• Bot API Endpoint: <code>https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN.slice(0, 10)}...</code>
• Authorized Administrator User IDs:
${AUTHORIZED_TELEGRAM_ADMINS.map((id, idx) => `  ${idx + 1}. <code>${id}</code>`).join('\n')}
• Timezone: <b>Asia/Kolkata (IST)</b>
• Webhook URL: <code>https://www.vaultworld.shop/api/telegram/webhook</code>
• Fallback Slash Commands: <b>100% Retained &amp; Active</b>
• Security Mode: <b>Strict Allowlist Only</b> (Others Rejected)
━━━━━━━━━━━━━━━━━━
Select an action to inspect or test connection:`;

  const inlineButtons: Array<Array<TelegramInlineButton>> = [
    [
      { text: '🔐 Admin Access', callback_data: 'set:admin' },
      { text: '🧪 Test Bot Connection', callback_data: 'set:test' },
    ],
    [
      { text: '🔔 Alert Preferences', callback_data: 'set:alert' },
      { text: 'ℹ️ Bot Information', callback_data: 'set:info' },
    ],
    [{ text: '🏠 Home', callback_data: 'nav:home' }],
  ];

  return renderView(chatId, messageId, text, inlineButtons);
}

// -----------------------------------------------------------------------------
// 5.11 WITHDRAWAL ACTION HANDLERS (Manual Approval Workflow)
// -----------------------------------------------------------------------------
export async function handleTelegramWithdrawalApprove(
  chatId: string,
  messageId: number | undefined,
  withdrawalId: string,
  fromId: string
): Promise<boolean> {
  const result = await updateWithdrawalStatus({
    withdrawalId,
    status: 'approved',
    processedBy: `telegram:${fromId}`,
    adminNotes: 'Approved via Telegram control panel',
  });

  if (!result.success || !result.withdrawal) {
    const errText = `⚠️ <b>FAILED TO APPROVE WITHDRAWAL</b>\n━━━━━━━━━━━━━━━━━━\n${result.error || 'Unknown error occurred.'}`;
    const buttons: Array<Array<TelegramInlineButton>> = [
      [{ text: '⬅️ Back to Withdrawals', callback_data: 'nav:wdr' }],
      [{ text: '🏠 Home', callback_data: 'nav:home' }],
    ];
    return renderView(chatId, messageId, errText, buttons);
  }

  const w = result.withdrawal;
  const fullUpi = w.payoutDetails?.upiId || 'N/A';
  const recipient = w.payoutDetails?.accountHolderName || w.resellerName;

  const text = `✅ <b>WITHDRAWAL REQUEST APPROVED</b>
━━━━━━━━━━━━━━━━━━
🧾 <b>Withdrawal ID:</b> <code>#${escapeHtml(w.id)}</code>
🆔 <b>Reseller UID:</b> <code>${escapeHtml(w.resellerUid)}</code>
👤 <b>Reseller:</b> ${escapeHtml(w.resellerName)}
💰 <b>Amount:</b> <b>₹${w.amount}.00</b>
💳 <b>Pay to UPI:</b> <code>${escapeHtml(fullUpi)}</code>
👤 <b>Recipient:</b> ${escapeHtml(recipient)}

Status: 🟢 <b>Approved</b> (Funds remain reserved)

⚠️ <b>Next Step (Manual Settlement):</b>
1. Open your UPI app (Google Pay / PhonePe / Paytm / Cred).
2. Transfer ₹${w.amount} to UPI: <code>${escapeHtml(fullUpi)}</code>.
3. Once completed, open the Admin Panel to mark as Paid with the Bank/UPI UTR reference number.`;

  const buttons: Array<Array<TelegramInlineButton>> = [
    [
      { text: '⚙️ Mark Processing', callback_data: `wdr:act:processing:${w.id}` },
      { text: '❌ Reject', callback_data: `wdr:act:reject:${w.id}` },
    ],
    [{ text: '🌐 Open Admin Panel (Mark Paid)', url: 'https://vaultworld.shop/asdf/resellers' }],
    [
      { text: '⬅️ Back to Withdrawals', callback_data: 'nav:wdr' },
      { text: '🏠 Home', callback_data: 'nav:home' },
    ],
  ];

  return renderView(chatId, messageId, text, buttons);
}

export async function handleTelegramWithdrawalProcessing(
  chatId: string,
  messageId: number | undefined,
  withdrawalId: string,
  fromId: string
): Promise<boolean> {
  const result = await updateWithdrawalStatus({
    withdrawalId,
    status: 'processing',
    processedBy: `telegram:${fromId}`,
    adminNotes: 'Marked processing via Telegram control panel',
  });

  if (!result.success || !result.withdrawal) {
    const errText = `⚠️ <b>FAILED TO UPDATE WITHDRAWAL</b>\n━━━━━━━━━━━━━━━━━━\n${result.error || 'Unknown error occurred.'}`;
    const buttons: Array<Array<TelegramInlineButton>> = [
      [{ text: '⬅️ Back to Withdrawals', callback_data: 'nav:wdr' }],
      [{ text: '🏠 Home', callback_data: 'nav:home' }],
    ];
    return renderView(chatId, messageId, errText, buttons);
  }

  const w = result.withdrawal;
  const fullUpi = w.payoutDetails?.upiId || 'N/A';

  const text = `⚙️ <b>WITHDRAWAL MARKED PROCESSING</b>
━━━━━━━━━━━━━━━━━━
🧾 <b>Withdrawal ID:</b> <code>#${escapeHtml(w.id)}</code>
🆔 <b>Reseller UID:</b> <code>${escapeHtml(w.resellerUid)}</code>
💰 <b>Amount:</b> <b>₹${w.amount}.00</b>
💳 <b>Pay to UPI:</b> <code>${escapeHtml(fullUpi)}</code>

Status: 🟣 <b>Processing</b> (Admin is executing transfer)

Transfer funds to the reseller via UPI and then record the Bank UTR reference in the Admin Panel to finalize.`;

  const buttons: Array<Array<TelegramInlineButton>> = [
    [{ text: '❌ Reject & Refund', callback_data: `wdr:act:reject:${w.id}` }],
    [{ text: '🌐 Open Admin Panel to Mark Paid', url: 'https://vaultworld.shop/asdf/resellers' }],
    [
      { text: '⬅️ Back to Withdrawals', callback_data: 'nav:wdr' },
      { text: '🏠 Home', callback_data: 'nav:home' },
    ],
  ];

  return renderView(chatId, messageId, text, buttons);
}

export async function handleTelegramWithdrawalReject(
  chatId: string,
  messageId: number | undefined,
  withdrawalId: string,
  fromId: string
): Promise<boolean> {
  const result = await updateWithdrawalStatus({
    withdrawalId,
    status: 'rejected',
    rejectionReason: 'Declined by administrator via Telegram bot',
    processedBy: `telegram:${fromId}`,
  });

  if (!result.success || !result.withdrawal) {
    const errText = `⚠️ <b>FAILED TO REJECT WITHDRAWAL</b>\n━━━━━━━━━━━━━━━━━━\n${result.error || 'Unknown error occurred.'}`;
    const buttons: Array<Array<TelegramInlineButton>> = [
      [{ text: '⬅️ Back to Withdrawals', callback_data: 'nav:wdr' }],
      [{ text: '🏠 Home', callback_data: 'nav:home' }],
    ];
    return renderView(chatId, messageId, errText, buttons);
  }

  const w = result.withdrawal;

  const text = `❌ <b>WITHDRAWAL REQUEST REJECTED</b>
━━━━━━━━━━━━━━━━━━
🧾 <b>Withdrawal ID:</b> <code>#${escapeHtml(w.id)}</code>
🆔 <b>Reseller UID:</b> <code>${escapeHtml(w.resellerUid)}</code>
💰 <b>Amount:</b> <b>₹${w.amount}.00</b>

Status: 🔴 <b>Rejected</b>
🔄 <b>Wallet Action:</b> ₹${w.amount}.00 has been safely refunded to reseller's available balance.
Reason: <i>Declined by administrator via Telegram bot</i>`;

  const buttons: Array<Array<TelegramInlineButton>> = [
    [{ text: '⬅️ Back to Withdrawals', callback_data: 'nav:wdr' }],
    [{ text: '🏠 Home', callback_data: 'nav:home' }],
  ];

  return renderView(chatId, messageId, text, buttons);
}

export async function handleTelegramWithdrawalView(
  chatId: string,
  messageId: number | undefined,
  withdrawalId: string
): Promise<boolean> {
  const wdr = await getWithdrawalRequestById(withdrawalId);
  if (!wdr) {
    const notFound = `⚠️ <b>Withdrawal request #${escapeHtml(withdrawalId)} not found.</b>`;
    const buttons: Array<Array<TelegramInlineButton>> = [
      [{ text: '⬅️ Back to Withdrawals', callback_data: 'nav:wdr' }],
      [{ text: '🏠 Home', callback_data: 'nav:home' }],
    ];
    return renderView(chatId, messageId, notFound, buttons);
  }

  const fullUpi = wdr.payoutDetails?.upiId || 'N/A';
  const recipient = wdr.payoutDetails?.accountHolderName || wdr.resellerName;
  const requestedDate = wdr.createdAt ? new Date(wdr.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'N/A';

  let productBreakdownText = '• <i>No specific bundle data</i>';
  if (wdr.productSummarySnapshot && Object.keys(wdr.productSummarySnapshot).length > 0) {
    productBreakdownText = Object.entries(wdr.productSummarySnapshot)
      .slice(0, 5)
      .map(([title, qty]) => `• ${escapeHtml(title)}: <b>${qty} units</b>`)
      .join('\n');
  }

  const text = `💸 <b>WITHDRAWAL REQUEST DETAILS</b>
━━━━━━━━━━━━━━━━━━
🧾 <b>Withdrawal ID:</b> <code>#${escapeHtml(wdr.id)}</code>
🆔 <b>Reseller UID:</b> <code>${escapeHtml(wdr.resellerUid)}</code>
👤 <b>Reseller:</b> ${escapeHtml(wdr.resellerName)}
📧 <b>Email:</b> ${escapeHtml(wdr.resellerEmail)}

💰 <b>WITHDRAWAL DETAILS</b>
• Requested Amount: <b>₹${wdr.amount}.00</b>
• UPI ID (Full): <code>${escapeHtml(fullUpi)}</code>
• Recipient Name: <b>${escapeHtml(recipient)}</b>
• Status: <b>${escapeHtml(wdr.status.toUpperCase())}</b>
• Date: ${requestedDate} IST

📦 <b>SALES SNAPSHOT</b>
• Verified Orders: <b>${wdr.verifiedSalesCountSnapshot ?? 0}</b>
• Units Sold: <b>${wdr.unitsSoldSnapshot ?? 0}</b>
${productBreakdownText}
━━━━━━━━━━━━━━━━━━`;

  const inlineButtons: Array<Array<TelegramInlineButton>> = [];

  if (wdr.status === 'pending' || wdr.status === 'pending_review') {
    inlineButtons.push([
      { text: '✅ Approve', callback_data: `wdr:act:approve:${wdr.id}` },
      { text: '⚙️ Mark Processing', callback_data: `wdr:act:processing:${wdr.id}` },
    ]);
    inlineButtons.push([
      { text: '❌ Reject', callback_data: `wdr:act:reject:${wdr.id}` },
      { text: '🌐 Admin Panel', url: 'https://vaultworld.shop/asdf/resellers' },
    ]);
  } else if (wdr.status === 'approved') {
    inlineButtons.push([
      { text: '⚙️ Mark Processing', callback_data: `wdr:act:processing:${wdr.id}` },
      { text: '❌ Reject', callback_data: `wdr:act:reject:${wdr.id}` },
    ]);
    inlineButtons.push([{ text: '🌐 Admin Panel (Mark Paid)', url: 'https://vaultworld.shop/asdf/resellers' }]);
  } else if (wdr.status === 'processing') {
    inlineButtons.push([
      { text: '❌ Reject', callback_data: `wdr:act:reject:${wdr.id}` },
      { text: '🌐 Admin Panel (Mark Paid)', url: 'https://vaultworld.shop/asdf/resellers' },
    ]);
  } else {
    inlineButtons.push([{ text: '🌐 View in Admin Panel', url: 'https://vaultworld.shop/asdf/resellers' }]);
  }

  inlineButtons.push([
    { text: '⬅️ Back to Withdrawals', callback_data: 'nav:wdr' },
    { text: '🏠 Home', callback_data: 'nav:home' },
  ]);

  return renderView(chatId, messageId, text, inlineButtons);
}

// -----------------------------------------------------------------------------
// 6. MAIN CALLBACK DISPATCHER
// -----------------------------------------------------------------------------
export async function handleAdminPanelCallback(
  callbackData: string,
  callbackQueryId: string,
  fromId: string,
  chatId: string,
  messageId: number
): Promise<boolean> {
  if (!isAuthorizedAdmin(fromId, chatId)) {
    await answerTelegramCallback(callbackQueryId, '⛔ Unauthorized: Restricted to authorized administrators.');
    return true;
  }

  // Acknowledge callback immediately so button stops spinning
  await answerTelegramCallback(callbackQueryId);

  const action = callbackData.trim();

  // Navigation callbacks
  if (action === 'nav:dash' || action === 'nav:home') {
    return renderDashboard(chatId, messageId);
  }
  if (action === 'nav:res') {
    return renderResellersMenu(chatId, messageId);
  }
  if (action === 'nav:sales') {
    return renderSalesMenu(chatId, messageId, 'today');
  }
  if (action === 'nav:prod') {
    return renderProductsMenu(chatId, messageId, 'top');
  }
  if (action === 'nav:wall') {
    return renderWalletsMenu(chatId, messageId, 'summary');
  }
  if (action === 'nav:wdr') {
    return renderWithdrawalsMenu(chatId, messageId, 'pending');
  }
  if (action === 'nav:fraud') {
    return renderFraudMonitorMenu(chatId, messageId, 'risk');
  }
  if (action === 'nav:ana') {
    return renderAnalyticsMenu(chatId, messageId, 'daily');
  }
  if (action === 'nav:notif') {
    return renderNotificationsMenu(chatId, messageId);
  }
  if (action === 'nav:set') {
    return renderSettingsMenu(chatId, messageId);
  }

  // Resellers sub-callbacks
  if (action === 'res:search') {
    return promptResellerUidSearch(chatId, messageId);
  }
  if (action === 'res:new') {
    const todayKey = getIstDateKey();
    const all = await getAllResellersAnalytics();
    const todayResellers = all.filter((r) => getIstDateKey(r.profile.createdAt) === todayKey);
    let list = '<i>No new registrations today.</i>';
    if (todayResellers.length > 0) {
      list = todayResellers
        .map(
          (r, idx) =>
            `${idx + 1}. <b>${escapeHtml(r.profile.resellerUid)}</b> (${escapeHtml(r.profile.displayName)})`
        )
        .join('\n');
    }
    const text = `🆕 <b>NEW RESELLERS TODAY (${todayKey} IST)</b>\n━━━━━━━━━━━━━━━━━━\n${list}`;
    const buttons: Array<Array<TelegramInlineButton>> = [
      [{ text: '⬅️ Back to Resellers', callback_data: 'nav:res' }],
      [{ text: '🏠 Home', callback_data: 'nav:home' }],
    ];
    return renderView(chatId, messageId, text, buttons);
  }
  if (action === 'res:top') {
    const all = await getAllResellersAnalytics();
    const sorted = [...all].sort(
      (a, b) => b.resellerEarnings - a.resellerEarnings || b.totalOrders - a.totalOrders
    );
    const rows = sorted
      .slice(0, 10)
      .map((r, idx) => {
        const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`;
        return `${medal} <b>${escapeHtml(r.profile.resellerUid)}</b> (${escapeHtml(r.profile.displayName)})\n   • Sales: <b>${r.totalOrders}</b> | Earned: <b>${formatInr(r.resellerEarnings)}</b>`;
      })
      .join('\n\n');
    const text = `🏆 <b>TOP RESELLERS LEADERBOARD</b>\n━━━━━━━━━━━━━━━━━━\n${rows || '<i>No data</i>'}`;
    const buttons: Array<Array<TelegramInlineButton>> = [
      [{ text: '⬅️ Back to Resellers', callback_data: 'nav:res' }],
      [{ text: '🏠 Home', callback_data: 'nav:home' }],
    ];
    return renderView(chatId, messageId, text, buttons);
  }
  if (action === 'res:recent') {
    const all = await getAllResellersAnalytics();
    const rows = all
      .slice(0, 8)
      .map(
        (r, idx) =>
          `${idx + 1}. <b>${escapeHtml(r.profile.resellerUid)}</b> (${escapeHtml(r.profile.displayName)})\n   Joined: ${new Date(r.profile.createdAt).toLocaleDateString('en-IN')}`
      )
      .join('\n\n');
    const text = `📋 <b>RECENT RESELLER REGISTRATIONS</b>\n━━━━━━━━━━━━━━━━━━\n${rows || '<i>No resellers</i>'}`;
    const buttons: Array<Array<TelegramInlineButton>> = [
      [{ text: '⬅️ Back to Resellers', callback_data: 'nav:res' }],
      [{ text: '🏠 Home', callback_data: 'nav:home' }],
    ];
    return renderView(chatId, messageId, text, buttons);
  }

  // Reseller dynamic detail & contextual callbacks
  if (action.startsWith('res:view:')) {
    const uid = action.replace('res:view:', '');
    return renderResellerDetail(uid, chatId, messageId);
  }
  if (action.startsWith('res:sales:')) {
    const uid = action.replace('res:sales:', '');
    return renderResellerSalesDetail(uid, chatId, messageId);
  }
  if (action.startsWith('res:prod:')) {
    const uid = action.replace('res:prod:', '');
    return renderResellerProductsDetail(uid, chatId, messageId);
  }
  if (action.startsWith('res:wall:')) {
    const uid = action.replace('res:wall:', '');
    return renderResellerWalletDetail(uid, chatId, messageId);
  }
  if (action.startsWith('res:wdr:')) {
    const uid = action.replace('res:wdr:', '');
    return renderResellerWithdrawalsDetail(uid, chatId, messageId);
  }

  // Sales callbacks
  if (action.startsWith('sales:')) {
    const period = action.replace('sales:', '') as any;
    return renderSalesMenu(chatId, messageId, period);
  }

  // Products callbacks
  if (action.startsWith('prod:page:')) {
    const parts = action.split(':');
    const filter = (parts[2] as any) || 'top';
    const page = parseInt(parts[3] || '0', 10);
    return renderProductsMenu(chatId, messageId, filter, page);
  }
  if (action.startsWith('prod:')) {
    const filter = action.replace('prod:', '') as any;
    return renderProductsMenu(chatId, messageId, filter, 0);
  }

  // Wallets callbacks
  if (action === 'wall:sum') return renderWalletsMenu(chatId, messageId, 'summary');
  if (action === 'wall:pend') return renderWalletsMenu(chatId, messageId, 'pending');
  if (action === 'wall:avail') return renderWalletsMenu(chatId, messageId, 'available');
  if (action === 'wall:res') return renderWalletsMenu(chatId, messageId, 'reserved');
  if (action === 'wall:txs') return renderWalletsMenu(chatId, messageId, 'transactions');

  // Withdrawals callbacks
  if (action.startsWith('wdr:act:approve:')) {
    const wdrId = action.replace('wdr:act:approve:', '').trim();
    return handleTelegramWithdrawalApprove(chatId, messageId, wdrId, fromId);
  }
  if (action.startsWith('wdr:act:processing:')) {
    const wdrId = action.replace('wdr:act:processing:', '').trim();
    return handleTelegramWithdrawalProcessing(chatId, messageId, wdrId, fromId);
  }
  if (action.startsWith('wdr:act:reject:')) {
    const wdrId = action.replace('wdr:act:reject:', '').trim();
    return handleTelegramWithdrawalReject(chatId, messageId, wdrId, fromId);
  }
  if (action.startsWith('wdr:view:')) {
    const wdrId = action.replace('wdr:view:', '').trim();
    return handleTelegramWithdrawalView(chatId, messageId, wdrId);
  }
  if (action === 'wdr:pend') return renderWithdrawalsMenu(chatId, messageId, 'pending');
  if (action === 'wdr:proc') return renderWithdrawalsMenu(chatId, messageId, 'processing');
  if (action === 'wdr:done') return renderWithdrawalsMenu(chatId, messageId, 'completed');
  if (action === 'wdr:rej') return renderWithdrawalsMenu(chatId, messageId, 'rejected');
  if (action === 'wdr:sum') {
    const wdrs = await fetchAllWithdrawals();
    const pend = wdrs.filter((w) => w.status === 'pending' || w.status === 'pending_review');
    const paid = wdrs.filter((w) => w.status === 'paid');
    const rej = wdrs.filter((w) => w.status === 'rejected');
    const text = `📊 <b>WITHDRAWAL WORKFLOW SUMMARY</b>
━━━━━━━━━━━━━━━━━━
• Total Requests: <b>${wdrs.length}</b>
• Pending Review: <b>${pend.length}</b> (Amount: ${formatInr(pend.reduce((s, w) => s + w.amount, 0))})
• Completed Payouts: <b>${paid.length}</b> (Amount: ${formatInr(paid.reduce((s, w) => s + w.amount, 0))})
• Rejected Requests: <b>${rej.length}</b> (Amount: ${formatInr(rej.reduce((s, w) => s + w.amount, 0))})
━━━━━━━━━━━━━━━━━━`;
    const buttons: Array<Array<TelegramInlineButton>> = [
      [{ text: '⬅️ Back to Withdrawals', callback_data: 'nav:wdr' }],
      [{ text: '🏠 Home', callback_data: 'nav:home' }],
    ];
    return renderView(chatId, messageId, text, buttons);
  }

  // Fraud callbacks
  if (action.startsWith('fraud:')) {
    const filter = action.replace('fraud:', '') as any;
    return renderFraudMonitorMenu(chatId, messageId, filter);
  }

  // Analytics callbacks
  if (action.startsWith('ana:')) {
    const reportType = action.replace('ana:', '') as any;
    return renderAnalyticsMenu(chatId, messageId, reportType);
  }

  // Notification test callback
  if (action === 'notif:test') {
    const start = Date.now();
    await sendTelegramMessage(
      `🧪 <b>LIVE TEST ALERT SUCCESSFUL</b>\n━━━━━━━━━━━━━━━━━━\nVerified test dispatch from MYZTORE Bot to Admin Chat <code>${chatId}</code>.\nTimestamp: ${getIstTimestamp()} IST.`,
      undefined,
      chatId
    );
    const latency = Date.now() - start;
    const alertMsg = `✅ <b>TEST NOTIFICATION DISPATCHED</b>
━━━━━━━━━━━━━━━━━━
• Destination Chat: <code>${chatId}</code>
• Round-trip API Latency: <b>${latency}ms</b>
• Telegram Status: <b>Delivered</b>`;
    const buttons: Array<Array<TelegramInlineButton>> = [
      [{ text: '⬅️ Back to Notifications', callback_data: 'nav:notif' }],
      [{ text: '🏠 Home', callback_data: 'nav:home' }],
    ];
    return renderView(chatId, messageId, alertMsg, buttons);
  }

  // Settings test callback
  if (action === 'set:test') {
    const start = Date.now();
    try {
      const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`);
      const data = await res.json();
      const latency = Date.now() - start;
      const botName = data.result?.first_name || 'MYZTORE Bot';
      const botUser = data.result?.username || 'MYZTORE_Bot';
      const text = `🧪 <b>TELEGRAM BOT CONNECTION: 200 OK</b>
━━━━━━━━━━━━━━━━━━
• Bot Name: <b>${escapeHtml(botName)}</b>
• Username: @${escapeHtml(botUser)}
• API Latency: <b>${latency}ms</b>
• Production Status: <b>Online &amp; Healthy</b>`;
      const buttons: Array<Array<TelegramInlineButton>> = [
        [{ text: '⬅️ Back to Settings', callback_data: 'nav:set' }],
        [{ text: '🏠 Home', callback_data: 'nav:home' }],
      ];
      return renderView(chatId, messageId, text, buttons);
    } catch (err: any) {
      const text = `❌ <b>Connection Error:</b> ${escapeHtml(err.message)}`;
      return renderView(chatId, messageId, text, [[{ text: '⬅️ Back', callback_data: 'nav:set' }]]);
    }
  }

  return false;
}

// -----------------------------------------------------------------------------
// 7. MAIN TEXT COMMAND & FOOTER BUTTON ROUTER
// -----------------------------------------------------------------------------
export async function handleAdminPanelMessage(
  rawText: string,
  fromId: string,
  chatId: string
): Promise<boolean> {
  const text = (rawText || '').trim();

  // Strict administrator authorization
  if (!isAuthorizedAdmin(fromId, chatId)) {
    console.warn(`[Telegram Admin Bot] Unauthorized attempt from user: ${fromId}, chat: ${chatId}`);
    await sendTelegramMessage(
      '⛔ <b>Access Denied:</b> This bot is restricted exclusively to authorized administrators.',
      undefined,
      chatId
    );
    return true;
  }

  const session = getSession(chatId);

  // Check conversational state (e.g. search reseller UID)
  if (session.pendingAction === 'search_reseller_uid') {
    // Treat the incoming text as the UID
    clearSessionAction(chatId);
    return renderResellerDetail(text, chatId);
  }

  // Match persistent footer button labels
  if (text === '📊 Dashboard') return renderDashboard(chatId);
  if (text === '👥 Resellers') return renderResellersMenu(chatId);
  if (text === '💰 Sales') return renderSalesMenu(chatId, undefined, 'today');
  if (text === '🛍 Products') return renderProductsMenu(chatId, undefined, 'top');
  if (text === '👛 Wallets') return renderWalletsMenu(chatId, undefined, 'summary');
  if (text === '💸 Withdrawals') return renderWithdrawalsMenu(chatId, undefined, 'pending');
  if (text === '🛡 Fraud Monitor') return renderFraudMonitorMenu(chatId, undefined, 'risk');
  if (text === '📈 Analytics') return renderAnalyticsMenu(chatId, undefined, 'daily');
  if (text === '🔔 Notifications') return renderNotificationsMenu(chatId);
  if (text === '⚙️ Settings') return renderSettingsMenu(chatId);

  // Match slash commands
  const parts = text.split(/\s+/);
  const cmd = (parts[0] || '').toLowerCase().split('@')[0];
  const arg = (parts[1] || '').trim();

  if (cmd === '/start' || cmd === '/dashboard' || cmd === 'dashboard') {
    return renderDashboard(chatId);
  }
  if (cmd === '/resellers' || cmd === 'resellers') {
    return renderResellersMenu(chatId);
  }
  if (cmd === '/reseller') {
    if (arg) {
      return renderResellerDetail(arg, chatId);
    }
    return promptResellerUidSearch(chatId);
  }
  if (cmd === '/sales' || cmd === 'sales') {
    if (arg && arg.toUpperCase().startsWith('RSL-')) {
      return renderResellerDetail(arg, chatId);
    }
    return renderSalesMenu(chatId, undefined, 'today');
  }
  if (cmd === '/products' || cmd === 'products') {
    return renderProductsMenu(chatId, undefined, 'top');
  }
  if (cmd === '/wallets' || cmd === '/wallet' || cmd === 'wallets') {
    if (arg && arg.toUpperCase().startsWith('RSL-')) {
      return renderResellerDetail(arg, chatId);
    }
    return renderWalletsMenu(chatId, undefined, 'summary');
  }
  if (cmd === '/withdrawals' || cmd === '/withdrawal' || cmd === 'withdrawals') {
    return renderWithdrawalsMenu(chatId, undefined, 'pending');
  }
  if (cmd === '/fraud' || cmd === 'fraud') {
    return renderFraudMonitorMenu(chatId, undefined, 'risk');
  }
  if (cmd === '/analytics' || cmd === 'analytics') {
    return renderAnalyticsMenu(chatId, undefined, 'daily');
  }
  if (cmd === '/notifications' || cmd === 'notifications') {
    return renderNotificationsMenu(chatId);
  }
  if (cmd === '/settings' || cmd === 'settings') {
    return renderSettingsMenu(chatId);
  }
  if (cmd === '/help' || cmd === 'help') {
    return renderDashboard(chatId);
  }

  // If user directly typed a valid Reseller UID (e.g. RSL-8K4M2P9X)
  if (/^RSL-[A-Z0-9]{6,12}$/i.test(text)) {
    return renderResellerDetail(text, chatId);
  }

  // Unrecognized text - show polite welcome with persistent footer attached
  const helpText = `👋 <b>MYZTORE Reseller Admin Bot</b>
━━━━━━━━━━━━━━━━━━
Use the persistent 5-row button menu at the bottom of your screen to navigate, or tap any command below:

• 📊 <b>Dashboard:</b> Overall metrics &amp; store health
• 👥 <b>Resellers:</b> Partner search &amp; leaderboards
• 💰 <b>Sales:</b> Today, 7-day, and monthly reports
• 🛍 <b>Products:</b> Top and low seller velocity
• 👛 <b>Wallets:</b> Liabilities &amp; ledger balances
• 💸 <b>Withdrawals:</b> Review &amp; process payouts
• 🛡 <b>Fraud Monitor:</b> High risk &amp; refund patterns
• 📈 <b>Analytics:</b> Performance reports
• 🔔 <b>Notifications:</b> Delivery status &amp; test alert
• ⚙️ <b>Settings:</b> Allowed admins &amp; bot info`;

  return sendTelegramMessage(helpText, undefined, chatId, PERSISTENT_FOOTER_KEYBOARD);
}
