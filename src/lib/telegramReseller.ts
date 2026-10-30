// Telegram Reseller Notifications & Admin Command Bot for VaultWorld Store
import {
  TELEGRAM_BOT_TOKEN,
  OWNER_CHAT_ID,
  AUTHORIZED_TELEGRAM_ADMINS,
  sendTelegramMessage,
  getIstTimestamp,
  TelegramInlineButton,
} from '@/lib/telegram';
import {
  getResellerProfileByUid,
  getResellerAnalytics,
  getAllResellersAnalytics,
  maskUpiId,
} from '@/lib/resellerService';
import { ResellerProfile, WithdrawalRequest } from '@/types/reseller';

export { AUTHORIZED_TELEGRAM_ADMINS };

// Allowed Telegram Admin User IDs (dynamically loaded from store settings)
export function getAuthorizedTelegramUserIds(): string[] {
  const envList = process.env.TELEGRAM_ALLOWED_USER_IDS
    ? process.env.TELEGRAM_ALLOWED_USER_IDS.split(',').map((s) => s.trim())
    : [];
  const list = Array.from(new Set([...AUTHORIZED_TELEGRAM_ADMINS, ...envList].filter(Boolean)));
  return list;
}

export function isAuthorizedTelegramAdmin(fromId?: string | number, chatId?: string | number): boolean {
  const authorized = getAuthorizedTelegramUserIds();
  const fId = String(fromId || '').trim();
  const cId = String(chatId || '').trim();
  return authorized.includes(fId) || authorized.includes(cId);
}

function escapeHtml(text: string): string {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// -----------------------------------------------------------------------------
// 1. TELEGRAM ALERT: NEW RESELLER REGISTERED
// -----------------------------------------------------------------------------
export async function sendNewResellerTelegramAlert(profile: ResellerProfile): Promise<boolean> {
  const registeredTime = profile.createdAt
    ? new Date(profile.createdAt).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : getIstTimestamp();

  const text = `🆕 <b>NEW RESELLER REGISTERED</b>
━━━━━━━━━━━━━━━━━━
🆔 <b>Reseller UID:</b> <code>${escapeHtml(profile.resellerUid)}</code>
👤 <b>Name:</b> ${escapeHtml(profile.displayName)}
📧 <b>Email:</b> ${escapeHtml(profile.email)}
${profile.phone ? `📱 <b>Phone:</b> <code>${escapeHtml(profile.phone)}</code>\n` : ''}📅 <b>Registered At:</b> ${escapeHtml(registeredTime)} IST
🛡️ <b>Account Status:</b> ${escapeHtml(profile.status.toUpperCase())}

📊 <b>SALES OVERVIEW</b>
• Total verified sales: <b>0</b>
• Total units sold: <b>0</b>
• Total gross sales value: <b>₹0</b>
• Total reseller earnings: <b>₹0</b>
• Available wallet balance: <b>₹0</b>
• Pending wallet balance: <b>₹0</b>
━━━━━━━━━━━━━━━━━━
🔍 <i>View in Admin Panel:</i> https://vaultworld.shop/asdf/resellers`;

  const buttons: Array<Array<TelegramInlineButton>> = [
    [
      { text: `👤 Inspect /reseller ${profile.resellerUid}`, callback_data: `reseller_${profile.resellerUid}` },
      { text: '📊 All Resellers', callback_data: 'cmd_report' },
    ],
  ];

  return sendTelegramMessage(text, buttons);
}

// -----------------------------------------------------------------------------
// 2. TELEGRAM ALERT: WITHDRAWAL REQUEST
// -----------------------------------------------------------------------------
export async function sendWithdrawalRequestTelegramAlert(wdr: WithdrawalRequest): Promise<boolean> {
  const requestedTime = wdr.createdAt
    ? new Date(wdr.createdAt).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : getIstTimestamp();

  // Full UPI ID is permitted only for private owner/admin chat; mask for broad contexts
  const displayUpi = wdr.payoutDetails?.upiId
    ? maskUpiId(wdr.payoutDetails.upiId)
    : 'N/A';
  const fullUpi = wdr.payoutDetails?.upiId || 'N/A';

  const recipient = wdr.payoutDetails?.accountHolderName || wdr.resellerName;
  const availAfter = wdr.walletBalanceAfterReservation ?? 0;
  const pendingEarnings = wdr.pendingEarningsSnapshot ?? 0;
  const lifetimeEarned = wdr.totalLifetimeEarningsSnapshot ?? 0;
  const totalWithdrawn = wdr.totalWithdrawalsSnapshot ?? 0;
  const verifiedOrders = wdr.verifiedSalesCountSnapshot ?? 0;
  const unitsSold = wdr.unitsSoldSnapshot ?? verifiedOrders;

  // Product breakdown lines
  let productBreakdownText = '• <i>No specific bundle data</i>';
  if (wdr.productSummarySnapshot && Object.keys(wdr.productSummarySnapshot).length > 0) {
    productBreakdownText = Object.entries(wdr.productSummarySnapshot)
      .slice(0, 5)
      .map(([title, qty]) => `• ${escapeHtml(title)}: <b>${qty} units</b>`)
      .join('\n');
  }

  const text = `💸 <b>NEW WITHDRAWAL REQUEST</b>
━━━━━━━━━━━━━━━━━━
🧾 <b>Withdrawal ID:</b> <code>${escapeHtml(wdr.id)}</code>
🆔 <b>Reseller UID:</b> <code>${escapeHtml(wdr.resellerUid)}</code>
👤 <b>Reseller:</b> ${escapeHtml(wdr.resellerName)}
📧 <b>Email:</b> ${escapeHtml(wdr.resellerEmail)}

💰 <b>WITHDRAWAL DETAILS</b>
• Requested amount: <b>₹${wdr.amount}.00</b>
• UPI ID (Masked): <code>${escapeHtml(displayUpi)}</code>
• UPI ID (Full): <code>${escapeHtml(fullUpi)}</code>
• Payout recipient: <b>${escapeHtml(recipient)}</b>
• Status: <b>⏳ Pending Review</b>

👛 <b>WALLET SUMMARY</b>
• Available balance after reservation: <b>₹${availAfter}.00</b>
• Pending earnings: <b>₹${pendingEarnings}.00</b>
• Lifetime earnings: <b>₹${lifetimeEarned}.00</b>
• Total withdrawals completed: <b>₹${totalWithdrawn}.00</b>

📦 <b>SALES SUMMARY</b>
• Verified orders: <b>${verifiedOrders}</b>
• Total units sold: <b>${unitsSold}</b>
${productBreakdownText}

🕒 <b>Requested At:</b> ${escapeHtml(requestedTime)} IST
━━━━━━━━━━━━━━━━━━
🔎 <i>Review & process in the authenticated admin panel:</i>
👉 https://vaultworld.shop/asdf/resellers`;

  const buttons: Array<Array<TelegramInlineButton>> = [
    [
      { text: '✅ Approve', callback_data: `wdr:act:approve:${wdr.id}` },
      { text: '⚙️ Mark Processing', callback_data: `wdr:act:processing:${wdr.id}` },
    ],
    [
      { text: '❌ Reject', callback_data: `wdr:act:reject:${wdr.id}` },
      { text: '👁 View Request', callback_data: `wdr:view:${wdr.id}` },
    ],
    [
      { text: `👛 Wallet: ${wdr.resellerUid}`, callback_data: `wallet_${wdr.resellerUid}` },
      { text: '📋 Admin Panel', url: 'https://vaultworld.shop/asdf/resellers' },
    ],
  ];

  return sendTelegramMessage(text, buttons);
}

// -----------------------------------------------------------------------------
// 2B. TELEGRAM ALERT: WITHDRAWAL STATUS UPDATE (Approved, Processing, Paid, Rejected)
// -----------------------------------------------------------------------------
export async function sendWithdrawalStatusTelegramAlert(params: {
  withdrawal: WithdrawalRequest;
  previousStatus?: string;
  adminEmail?: string;
}): Promise<boolean> {
  const { withdrawal: wdr, adminEmail } = params;
  if (!wdr) return false;

  const nowIst = getIstTimestamp();
  const fullUpi = wdr.payoutDetails?.upiId || 'N/A';
  const recipient = wdr.payoutDetails?.accountHolderName || wdr.resellerName;

  let title = '';
  let statusBadge = '';
  let detailsText = '';

  switch (wdr.status) {
    case 'approved':
      title = '✅ <b>WITHDRAWAL REQUEST APPROVED</b>';
      statusBadge = '🟢 <b>Approved</b> (Awaiting Manual Settlement)';
      detailsText = `• Note: <i>${escapeHtml(wdr.adminNotes || 'Request verified. Ready for manual payout.')}</i>\n👉 <i>Next Step: Transfer ₹${wdr.amount} via UPI, then Mark as Paid with UTR in Admin Panel.</i>`;
      break;

    case 'processing':
      title = '⚙️ <b>WITHDRAWAL IN PROCESSING</b>';
      statusBadge = '🟣 <b>Processing</b> (Transfer in Progress)';
      detailsText = `• Admin Note: <i>${escapeHtml(wdr.adminNotes || 'Admin is actively initiating manual UPI transfer')}</i>`;
      break;

    case 'paid':
      title = '💸 <b>WITHDRAWAL PAYMENT COMPLETED</b>';
      statusBadge = '✅ <b>Paid & Settled</b>';
      detailsText = `• <b>Bank/UPI UTR Ref:</b> <code>${escapeHtml(wdr.payoutReference || 'Manual UPI Transfer')}</code>\n• Processed By: <b>${escapeHtml(wdr.processedBy || adminEmail || 'Admin')}</b>`;
      break;

    case 'rejected':
      title = '❌ <b>WITHDRAWAL REQUEST REJECTED</b>';
      statusBadge = '🔴 <b>Rejected & Refunded</b>';
      detailsText = `• <b>Reason:</b> <i>${escapeHtml(wdr.rejectionReason || wdr.adminNotes || 'Declined by admin')}</i>\n• <b>Wallet Action:</b> ₹${wdr.amount}.00 refunded to reseller available balance.`;
      break;

    default:
      return false;
  }

  const messageText = `${title}
━━━━━━━━━━━━━━━━━━
🧾 <b>Withdrawal ID:</b> <code>${escapeHtml(wdr.id)}</code>
🆔 <b>Reseller UID:</b> <code>${escapeHtml(wdr.resellerUid)}</code>
👤 <b>Reseller:</b> ${escapeHtml(wdr.resellerName)} (${escapeHtml(wdr.resellerEmail)})
💰 <b>Amount:</b> <b>₹${wdr.amount}.00</b>
💳 <b>UPI ID:</b> <code>${escapeHtml(fullUpi)}</code>
👤 <b>Recipient:</b> ${escapeHtml(recipient)}

📊 <b>STATUS UPDATE</b>
• Current Status: ${statusBadge}
${detailsText}

🕒 <b>Timestamp:</b> ${escapeHtml(nowIst)} IST
━━━━━━━━━━━━━━━━━━`;

  const buttons: Array<Array<TelegramInlineButton>> = [
    [
      { text: `👛 Wallet: ${wdr.resellerUid}`, callback_data: `wallet_${wdr.resellerUid}` },
      { text: '📋 Admin Panel', url: 'https://vaultworld.shop/asdf/resellers' },
    ],
  ];

  return sendTelegramMessage(messageText, buttons);
}

// -----------------------------------------------------------------------------
// 2C. TELEGRAM ALERT: RESELLER SALE NOTIFICATION
// -----------------------------------------------------------------------------
export async function sendResellerSaleTelegramAlert(params: {
  orderNumber: string;
  resellerId: string;
  resellerUid?: string;
  resellerName?: string;
  resellerEmail?: string;
  resellerPhone?: string;
  productTitle: string;
  totalAmount: number;
  basePrice?: number;
  resellerEarning: number;
  customer: {
    fullName: string;
    email: string;
    phone?: string;
  };
  availableBalance?: number;
  totalEarned?: number;
  verifiedSalesCount?: number;
}): Promise<boolean> {
  const {
    orderNumber,
    resellerId,
    resellerUid = 'RSL-VAULTWORLD',
    resellerName = 'Reseller',
    resellerEmail = '',
    resellerPhone = '',
    productTitle,
    totalAmount,
    basePrice = 0,
    resellerEarning,
    customer,
    availableBalance = resellerEarning,
    totalEarned = resellerEarning,
    verifiedSalesCount = 1,
  } = params;

  const nowIst = getIstTimestamp();
  const calculatedBase = basePrice > 0 ? basePrice : Math.max(0, totalAmount - resellerEarning);

  const text = `🎉 <b>NEW RESELLER SALE COMPLETED!</b>
━━━━━━━━━━━━━━━━━━
🧾 <b>Order ID:</b> <code>${escapeHtml(orderNumber)}</code>
📦 <b>Reels Bundle:</b> ${escapeHtml(productTitle)}
💰 <b>Customer Paid:</b> <b>₹${totalAmount}.00</b>
🏷️ <b>VaultWorld Base Cost:</b> ₹${calculatedBase}.00
💵 <b>Reseller Commission:</b> <b>+₹${resellerEarning}.00</b> (Instant Credit)

👤 <b>RESELLER DETAILS</b>
• Reseller UID: <code>${escapeHtml(resellerUid)}</code>
• Name: <b>${escapeHtml(resellerName)}</b>
• Email: ${escapeHtml(resellerEmail || 'N/A')}
${resellerPhone ? `• Phone: <code>${escapeHtml(resellerPhone)}</code>\n` : ''}• Account: <b>✅ ACTIVE</b>

👛 <b>RESELLER WALLET SNAPSHOT</b>
• Available Balance: <b>₹${availableBalance}.00</b>
• Lifetime Earned: <b>₹${totalEarned}.00</b>
• Total Verified Sales: <b>${verifiedSalesCount}</b>

👤 <b>CUSTOMER DETAILS</b>
• Name: ${escapeHtml(customer?.fullName || 'Customer')}
• Email: <code>${escapeHtml(customer?.email || 'N/A')}</code>
${customer?.phone ? `• Phone: <code>${escapeHtml(customer.phone)}</code>\n` : ''}• Payment Gateway: <b>Cashfree UPI / Card (PAID)</b>

🕒 <b>Time:</b> ${escapeHtml(nowIst)} IST
━━━━━━━━━━━━━━━━━━
🔎 <i>Manage Resellers in Admin:</i> https://vaultworld.shop/asdf/resellers`;

  const buttons: Array<Array<TelegramInlineButton>> = [
    [
      { text: `👤 Reseller: ${resellerUid}`, callback_data: `reseller_${resellerUid}` },
      { text: `👛 Wallet: ${resellerUid}`, callback_data: `wallet_${resellerUid}` },
    ],
    [
      { text: `📦 Order #${orderNumber}`, callback_data: `order_${orderNumber}` },
      { text: '📋 Admin Panel', url: 'https://vaultworld.shop/asdf/resellers' },
    ],
  ];

  return sendTelegramMessage(text, buttons);
}

// -----------------------------------------------------------------------------
// 3. ADMIN TELEGRAM COMMAND DISPATCHER
// -----------------------------------------------------------------------------

export async function handleAdminTelegramCommand(
  rawText: string,
  fromId: string,
  chatId: string
): Promise<boolean> {
  if (!isAuthorizedTelegramAdmin(fromId, chatId)) {
    await sendTelegramMessage(
      '⛔ <b>Access Denied:</b> This bot command interface is restricted to authorized VaultWorld Store administrators.',
      undefined,
      chatId
    );
    return true;
  }

  const parts = rawText.trim().split(/\s+/);
  const command = (parts[0] || '').toLowerCase().split('@')[0];
  const arg = (parts[1] || '').trim();

  // /help or /start
  if (command === '/help' || command === '/start' || command === 'help') {
    const helpMsg = `🤖 <b>VAULTWORLD RESELLER ADMIN BOT COMMANDS</b>
━━━━━━━━━━━━━━━━━━
Available Admin Commands:

🔍 <b>Reseller Lookup:</b>
• <code>/reseller &lt;UID&gt;</code> — Profile, status, sales & activity
• <code>/sales &lt;UID&gt;</code> — Verified orders, units & revenue breakdown
• <code>/products &lt;UID&gt;</code> — Product-level sales & margins
• <code>/wallet &lt;UID&gt;</code> — Balance reconciliation & ledger audit
• <code>/withdrawals &lt;UID&gt;</code> — Payout request history & statuses

📊 <b>Store Reports & Leaderboards:</b>
• <code>/topresellers</code> — Leaderboard by verified revenue & sales
• <code>/today</code> — Today's sales, revenue & payout requests (IST)
• <code>/report</code> — Comprehensive store-wide reseller report

ℹ️ <i>Example:</i> <code>/reseller RSL-8K4M2P9X</code>`;

    return sendTelegramMessage(helpMsg, undefined, chatId);
  }

  // /reseller <UID>
  if (command === '/reseller') {
    if (!arg) {
      return sendTelegramMessage('⚠️ <b>Usage:</b> <code>/reseller &lt;UID&gt;</code>\n<i>Example:</i> <code>/reseller RSL-8K4M2P9X</code>', undefined, chatId);
    }
    return handleResellerCommand(arg, chatId);
  }

  // /sales <UID>
  if (command === '/sales' && arg.startsWith('RSL-')) {
    return handleSalesCommand(arg, chatId);
  }

  // /products <UID>
  if (command === '/products') {
    if (!arg) {
      return sendTelegramMessage('⚠️ <b>Usage:</b> <code>/products &lt;UID&gt;</code>', undefined, chatId);
    }
    return handleProductsCommand(arg, chatId);
  }

  // /wallet <UID>
  if (command === '/wallet') {
    if (!arg) {
      return sendTelegramMessage('⚠️ <b>Usage:</b> <code>/wallet &lt;UID&gt;</code>', undefined, chatId);
    }
    return handleWalletCommand(arg, chatId);
  }

  // /withdrawals <UID>
  if (command === '/withdrawals') {
    if (!arg) {
      return sendTelegramMessage('⚠️ <b>Usage:</b> <code>/withdrawals &lt;UID&gt;</code>', undefined, chatId);
    }
    return handleWithdrawalsCommand(arg, chatId);
  }

  // /topresellers
  if (command === '/topresellers') {
    return handleTopResellersCommand(chatId);
  }

  // /report
  if (command === '/report') {
    return handleReportCommand(chatId);
  }

  return false;
}

// -----------------------------------------------------------------------------
// 4. COMMAND IMPLEMENTATIONS
// -----------------------------------------------------------------------------

async function handleResellerCommand(uid: string, chatId: string): Promise<boolean> {
  const data = await getResellerAnalytics(uid);
  if (!data) {
    return sendTelegramMessage(`❌ Reseller with UID <code>${escapeHtml(uid)}</code> not found.`, undefined, chatId);
  }

  const { profile, wallet, listingsCount, totalOrders, unitsSold, grossSales, resellerEarnings, recentOrders } = data;
  const regDate = profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN') : 'N/A';
  const lastActivity = recentOrders.length > 0 && recentOrders[0].createdAt
    ? new Date(recentOrders[0].createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'short', timeStyle: 'short' }) + ' IST'
    : 'None yet';

  const text = `👤 <b>RESELLER PROFILE: ${escapeHtml(profile.resellerUid)}</b>
━━━━━━━━━━━━━━━━━━
🆔 <b>UID:</b> <code>${escapeHtml(profile.resellerUid)}</code>
👤 <b>Name:</b> ${escapeHtml(profile.displayName)}
📧 <b>Email:</b> ${escapeHtml(profile.email)}
🛡️ <b>Status:</b> <b>${escapeHtml(profile.status.toUpperCase())}</b>
📅 <b>Joined:</b> ${escapeHtml(regDate)}
⚡ <b>Last Activity:</b> ${escapeHtml(lastActivity)}

📊 <b>PERFORMANCE SUMMARY</b>
• Active Listings: <b>${listingsCount}</b>
• Verified Orders: <b>${totalOrders}</b>
• Units Sold: <b>${unitsSold}</b>
• Gross Sales Value: <b>₹${grossSales}.00</b>
• Reseller Earnings: <b>₹${resellerEarnings}.00</b>

👛 <b>WALLET BALANCE</b>
• Available to Withdraw: <b>₹${wallet.availableBalance}.00</b>
• Pending Settlement: <b>₹${wallet.pendingBalance}.00</b>
• Completed Withdrawals: <b>₹${wallet.totalWithdrawn}.00</b>
━━━━━━━━━━━━━━━━━━`;

  const buttons: Array<Array<TelegramInlineButton>> = [
    [
      { text: `📦 Products (${data.products.length})`, callback_data: `products_${profile.resellerUid}` },
      { text: `💰 Wallet Ledger`, callback_data: `wallet_${profile.resellerUid}` },
    ],
  ];

  return sendTelegramMessage(text, buttons, chatId);
}

async function handleSalesCommand(uid: string, chatId: string): Promise<boolean> {
  const data = await getResellerAnalytics(uid);
  if (!data) {
    return sendTelegramMessage(`❌ Reseller with UID <code>${escapeHtml(uid)}</code> not found.`, undefined, chatId);
  }

  const { profile, totalOrders, unitsSold, grossSales, netSales, resellerEarnings, recentOrders } = data;
  const refundedCount = recentOrders.filter((o) => o.orderStatus === 'refunded').length;

  let orderList = '<i>No verified sales yet.</i>';
  if (recentOrders.length > 0) {
    orderList = recentOrders
      .slice(0, 5)
      .map((o, idx) => `${idx + 1}. <b>#${escapeHtml(o.orderNumber)}</b> — ₹${o.resalePrice} (Earned: <b>₹${o.earningAmount}</b>)\n   📦 ${escapeHtml(o.productTitle)}`)
      .join('\n\n');
  }

  const text = `📈 <b>SALES REPORT: ${escapeHtml(profile.resellerUid)} (${escapeHtml(profile.displayName)})</b>
━━━━━━━━━━━━━━━━━━
✅ <b>Verified Paid Orders:</b> <b>${totalOrders}</b>
📦 <b>Total Units Sold:</b> <b>${unitsSold}</b>
↩️ <b>Refunded Orders:</b> <b>${refundedCount}</b>
💵 <b>Gross Sales:</b> <b>₹${grossSales}.00</b>
💎 <b>Net Sales:</b> <b>₹${netSales}.00</b>
💰 <b>Reseller Net Earnings:</b> <b>₹${resellerEarnings}.00</b>

📋 <b>RECENT ATTRIBUTED SALES:</b>
${orderList}
━━━━━━━━━━━━━━━━━━`;

  return sendTelegramMessage(text, undefined, chatId);
}

async function handleProductsCommand(uid: string, chatId: string): Promise<boolean> {
  const data = await getResellerAnalytics(uid);
  if (!data) {
    return sendTelegramMessage(`❌ Reseller with UID <code>${escapeHtml(uid)}</code> not found.`, undefined, chatId);
  }

  let tableText = '<i>No product sales recorded yet.</i>';
  if (data.products.length > 0) {
    tableText = data.products
      .map((p, idx) => {
        return `${idx + 1}. <b>${escapeHtml(p.productTitle)}</b>\n   • Orders: <b>${p.verifiedOrders}</b> | Units: <b>${p.unitsSold}</b>\n   • Gross: <b>₹${p.grossSales}</b> | Net: <b>₹${p.netSales}</b>\n   • Reseller Margin: <b>₹${p.resellerEarnings}</b>`;
      })
      .join('\n\n');
  }

  const text = `📦 <b>PRODUCT SALES BREAKDOWN: ${escapeHtml(data.profile.resellerUid)}</b>
━━━━━━━━━━━━━━━━━━
${tableText}
━━━━━━━━━━━━━━━━━━`;

  return sendTelegramMessage(text, undefined, chatId);
}

async function handleWalletCommand(uid: string, chatId: string): Promise<boolean> {
  const data = await getResellerAnalytics(uid);
  if (!data) {
    return sendTelegramMessage(`❌ Reseller with UID <code>${escapeHtml(uid)}</code> not found.`, undefined, chatId);
  }

  const { profile, wallet, ledger, withdrawals } = data;
  const reservedFunds = withdrawals
    .filter((w) => w.status === 'pending' || w.status === 'pending_review')
    .reduce((sum, w) => sum + w.amount, 0);

  let recentTxs = '<i>No transactions recorded yet.</i>';
  if (ledger.length > 0) {
    recentTxs = ledger
      .slice(0, 5)
      .map((t, idx) => {
        const sign = t.amount >= 0 ? '+' : '';
        return `${idx + 1}. <b>${sign}₹${t.amount}</b> [${escapeHtml(t.type)}] — ${escapeHtml(t.status)}\n   📝 ${escapeHtml(t.description)}`;
      })
      .join('\n\n');
  }

  const text = `👛 <b>WALLET RECONCILIATION: ${escapeHtml(profile.resellerUid)}</b>
━━━━━━━━━━━━━━━━━━
👤 <b>Reseller:</b> ${escapeHtml(profile.displayName)}

💰 <b>BALANCES:</b>
• Available Balance: <b>₹${wallet.availableBalance}.00</b>
• Pending Balance: <b>₹${wallet.pendingBalance}.00</b>
• Reserved in Requests: <b>₹${reservedFunds}.00</b>
• Lifetime Earned: <b>₹${wallet.totalEarned}.00</b>
• Completed Payouts: <b>₹${wallet.totalWithdrawn}.00</b>

📜 <b>RECENT LEDGER ENTRIES:</b>
${recentTxs}
━━━━━━━━━━━━━━━━━━`;

  return sendTelegramMessage(text, undefined, chatId);
}

async function handleWithdrawalsCommand(uid: string, chatId: string): Promise<boolean> {
  const data = await getResellerAnalytics(uid);
  if (!data) {
    return sendTelegramMessage(`❌ Reseller with UID <code>${escapeHtml(uid)}</code> not found.`, undefined, chatId);
  }

  let list = '<i>No withdrawal requests found.</i>';
  if (data.withdrawals.length > 0) {
    list = data.withdrawals
      .map((w, idx) => {
        const date = w.createdAt ? new Date(w.createdAt).toLocaleDateString('en-IN') : 'N/A';
        const upi = w.payoutDetails?.upiId ? maskUpiId(w.payoutDetails.upiId) : 'N/A';
        const ref = w.payoutReference ? `\n   Ref: <code>${escapeHtml(w.payoutReference)}</code>` : '';
        const notes = w.adminNotes ? `\n   Note: <i>${escapeHtml(w.adminNotes)}</i>` : '';
        return `${idx + 1}. <b>#${escapeHtml(w.id)}</b> — <b>₹${w.amount}</b> (${escapeHtml(w.status)})\n   Date: ${date} | UPI: <code>${escapeHtml(upi)}</code>${ref}${notes}`;
      })
      .join('\n\n');
  }

  const text = `💸 <b>WITHDRAWAL HISTORY: ${escapeHtml(data.profile.resellerUid)}</b>
━━━━━━━━━━━━━━━━━━
${list}
━━━━━━━━━━━━━━━━━━`;

  return sendTelegramMessage(text, undefined, chatId);
}

async function handleTopResellersCommand(chatId: string): Promise<boolean> {
  const all = await getAllResellersAnalytics();
  if (all.length === 0) {
    return sendTelegramMessage('📊 <b>Top Resellers:</b> No registered resellers yet.', undefined, chatId);
  }

  // Sort by verified sales / earnings
  const sorted = [...all].sort((a, b) => b.resellerEarnings - a.resellerEarnings || b.totalOrders - a.totalOrders);
  const rows = sorted
    .slice(0, 10)
    .map((r, idx) => {
      const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`;
      return `${medal} <b>${escapeHtml(r.profile.resellerUid)}</b> (${escapeHtml(r.profile.displayName)})\n   • Sales: <b>${r.totalOrders}</b> | Units: <b>${r.unitsSold}</b>\n   • Revenue: <b>₹${r.grossSales}</b> | Earned: <b>₹${r.resellerEarnings}</b>`;
    })
    .join('\n\n');

  const text = `🏆 <b>TOP RESELLERS LEADERBOARD</b>
<i>(Ranked by Net Reseller Earnings & Orders)</i>
━━━━━━━━━━━━━━━━━━
${rows}
━━━━━━━━━━━━━━━━━━`;

  return sendTelegramMessage(text, undefined, chatId);
}

async function handleReportCommand(chatId: string): Promise<boolean> {
  const all = await getAllResellersAnalytics();

  const totalResellers = all.length;
  const activeResellers = all.filter((r) => r.profile.status === 'active').length;
  const totalOrders = all.reduce((acc, r) => acc + r.totalOrders, 0);
  const totalUnits = all.reduce((acc, r) => acc + r.unitsSold, 0);
  const grossSales = all.reduce((acc, r) => acc + r.grossSales, 0);
  const netSales = all.reduce((acc, r) => acc + r.netSales, 0);
  const totalEarnings = all.reduce((acc, r) => acc + r.resellerEarnings, 0);
  const availableBalances = all.reduce((acc, r) => acc + r.wallet.availableBalance, 0);
  const pendingBalances = all.reduce((acc, r) => acc + r.wallet.pendingBalance, 0);
  const totalWithdrawn = all.reduce((acc, r) => acc + r.wallet.totalWithdrawn, 0);

  const text = `📊 <b>STORE-WIDE RESELLER REPORT</b>
━━━━━━━━━━━━━━━━━━
👥 <b>RESELLER NETWORK:</b>
• Total Registered: <b>${totalResellers} Resellers</b>
• Active Resellers: <b>${activeResellers}</b>

📦 <b>ATTRIBUTED SALES:</b>
• Verified Attributed Orders: <b>${totalOrders}</b>
• Total Units Sold: <b>${totalUnits}</b>
• Gross Sales Value: <b>₹${grossSales}.00</b>
• Net Sales After Adjustments: <b>₹${netSales}.00</b>

💰 <b>FINANCIAL & WALLET LIABILITIES:</b>
• Total Reseller Earnings: <b>₹${totalEarnings}.00</b>
• Currently Available Balances: <b>₹${availableBalances}.00</b>
• Currently Pending Earnings: <b>₹${pendingBalances}.00</b>
• Completed Payouts: <b>₹${totalWithdrawn}.00</b>

🕒 <b>Report Date:</b> ${escapeHtml(getIstTimestamp())}
━━━━━━━━━━━━━━━━━━`;

  return sendTelegramMessage(text, undefined, chatId);
}
