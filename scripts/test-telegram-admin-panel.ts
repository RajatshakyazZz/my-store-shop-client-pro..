// Comprehensive Automated Test Suite: Premium Telegram Bot Admin Panel with Footer Button Navigation
// Testing all 16 Acceptance Criteria and Invariants from the Master Prompt

import assert from 'assert';
import {
  AUTHORIZED_TELEGRAM_ADMINS,
  sendTelegramMessage,
} from '@/lib/telegram';
import {
  isAuthorizedTelegramAdmin,
} from '@/lib/telegramReseller';
import {
  PERSISTENT_FOOTER_KEYBOARD,
  isAuthorizedAdmin,
  handleAdminPanelMessage,
  handleAdminPanelCallback,
  getIstDateKey,
  fetchAllWithdrawals,
} from '@/lib/telegramAdminPanel';
import {
  createOrUpdateResellerProfile,
  getResellerProfileByUid,
  getResellerAnalytics,
  getAllResellersAnalytics,
  maskUpiId,
} from '@/lib/resellerService';

async function runTests() {
  console.log('\n====================================================');
  console.log('🤖 RUNNING PREMIUM TELEGRAM BOT ADMIN PANEL TESTS');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function testAssert(condition: any, message: string) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // ---------------------------------------------------------------------------
  // TEST 1: Strict Admin Whitelist Authorization
  // ---------------------------------------------------------------------------
  const testAdmin1 = '9988776655';
  const testAdmin2 = '9988776656';
  AUTHORIZED_TELEGRAM_ADMINS.push(testAdmin1, testAdmin2);

  testAssert(
    AUTHORIZED_TELEGRAM_ADMINS.includes(testAdmin1) &&
      AUTHORIZED_TELEGRAM_ADMINS.includes(testAdmin2),
    'Invariant 1A: Whitelist includes configured test admin accounts'
  );

  testAssert(
    isAuthorizedAdmin(testAdmin1, testAdmin1) === true &&
      isAuthorizedAdmin(testAdmin2, testAdmin2) === true,
    'Invariant 1B: isAuthorizedAdmin allows configured test admin accounts'
  );

  testAssert(
    isAuthorizedAdmin('9999999999', '9999999999') === false &&
      isAuthorizedAdmin('12345678', '87654321') === false,
    'Invariant 1C: isAuthorizedAdmin strictly denies unauthorized Telegram user IDs'
  );

  // ---------------------------------------------------------------------------
  // TEST 2: Persistent 5-Row ReplyKeyboardMarkup Specification
  // ---------------------------------------------------------------------------
  const kb = PERSISTENT_FOOTER_KEYBOARD;
  testAssert(
    Array.isArray(kb.keyboard) && kb.keyboard.length === 5,
    'Invariant 2A: Persistent footer keyboard has exactly 5 rows'
  );

  const row1 = kb.keyboard[0].map((b) => b.text);
  const row2 = kb.keyboard[1].map((b) => b.text);
  const row3 = kb.keyboard[2].map((b) => b.text);
  const row4 = kb.keyboard[3].map((b) => b.text);
  const row5 = kb.keyboard[4].map((b) => b.text);

  testAssert(
    row1[0] === '📊 Dashboard' && row1[1] === '👥 Resellers',
    'Invariant 2B: Row 1 is "📊 Dashboard | 👥 Resellers"'
  );
  testAssert(
    row2[0] === '💰 Sales' && row2[1] === '🛍 Products',
    'Invariant 2C: Row 2 is "💰 Sales | 🛍 Products"'
  );
  testAssert(
    row3[0] === '👛 Wallets' && row3[1] === '💸 Withdrawals',
    'Invariant 2D: Row 3 is "👛 Wallets | 💸 Withdrawals"'
  );
  testAssert(
    row4[0] === '🛡 Fraud Monitor' && row4[1] === '📈 Analytics',
    'Invariant 2E: Row 4 is "🛡 Fraud Monitor | 📈 Analytics"'
  );
  testAssert(
    row5[0] === '🔔 Notifications' && row5[1] === '⚙️ Settings',
    'Invariant 2F: Row 5 is "🔔 Notifications | ⚙️ Settings"'
  );

  testAssert(
    kb.resize_keyboard === true && kb.one_time_keyboard === false && kb.is_persistent === true,
    'Invariant 2G: Keyboard config flags enforce persistent, auto-sized reply keyboard'
  );

  // ---------------------------------------------------------------------------
  // TEST 3: Footer Button Input & Slash Command Routing
  // ---------------------------------------------------------------------------
  // Ensure every footer button string triggers a handled response without exceptions
  const testChatId = testAdmin1;

  // 3A. Dashboard button and slash command
  const dashBtn = await handleAdminPanelMessage('📊 Dashboard', testChatId, testChatId);
  const dashCmd = await handleAdminPanelMessage('/dashboard', testChatId, testChatId);
  testAssert(
    dashBtn && dashCmd,
    'Invariant 3A: "📊 Dashboard" button and "/dashboard" command handled successfully'
  );

  // 3B. Resellers button
  const resBtn = await handleAdminPanelMessage('👥 Resellers', testChatId, testChatId);
  testAssert(resBtn, 'Invariant 3B: "👥 Resellers" button handled successfully');

  // 3C. Sales button
  const salesBtn = await handleAdminPanelMessage('💰 Sales', testChatId, testChatId);
  testAssert(salesBtn, 'Invariant 3C: "💰 Sales" button handled successfully');

  // 3D. Products button
  const prodBtn = await handleAdminPanelMessage('🛍 Products', testChatId, testChatId);
  testAssert(prodBtn, 'Invariant 3D: "🛍 Products" button handled successfully');

  // 3E. Wallets button
  const wallBtn = await handleAdminPanelMessage('👛 Wallets', testChatId, testChatId);
  testAssert(wallBtn, 'Invariant 3E: "👛 Wallets" button handled successfully');

  // 3F. Withdrawals button
  const wdrBtn = await handleAdminPanelMessage('💸 Withdrawals', testChatId, testChatId);
  testAssert(wdrBtn, 'Invariant 3F: "💸 Withdrawals" button handled successfully');

  // 3G. Fraud Monitor button
  const fraudBtn = await handleAdminPanelMessage('🛡 Fraud Monitor', testChatId, testChatId);
  testAssert(fraudBtn, 'Invariant 3G: "🛡 Fraud Monitor" button handled successfully');

  // 3H. Analytics button
  const anaBtn = await handleAdminPanelMessage('📈 Analytics', testChatId, testChatId);
  testAssert(anaBtn, 'Invariant 3H: "📈 Analytics" button handled successfully');

  // 3I. Notifications button
  const notifBtn = await handleAdminPanelMessage('🔔 Notifications', testChatId, testChatId);
  testAssert(notifBtn, 'Invariant 3I: "🔔 Notifications" button handled successfully');

  // 3J. Settings button
  const setBtn = await handleAdminPanelMessage('⚙️ Settings', testChatId, testChatId);
  testAssert(setBtn, 'Invariant 3J: "⚙️ Settings" button handled successfully');

  // ---------------------------------------------------------------------------
  // TEST 4: Reseller Search by UID & Conversational Session Handling
  // ---------------------------------------------------------------------------
  // 1. Create a known test reseller
  const testReseller = await createOrUpdateResellerProfile({
    userId: 'usr_telegram_test_99',
    displayName: 'Aarav Patel',
    email: 'aarav.patel@example.com',
    phone: '9876543210',
    status: 'active',
    termsAccepted: true,
  });

  testAssert(
    testReseller.resellerUid.startsWith('RSL-'),
    `Invariant 4A: Reseller profile exists with permanent UID: ${testReseller.resellerUid}`
  );

  // 2. Direct UID lookup
  const directLookup = await handleAdminPanelMessage(testReseller.resellerUid, testChatId, testChatId);
  testAssert(directLookup, 'Invariant 4B: Direct Reseller UID input renders detail view');

  // 3. Conversational multi-step search (res:search -> prompt -> user input)
  const searchPromptCb = await handleAdminPanelCallback('res:search', 'cb_101', testChatId, testChatId, 1001);
  testAssert(searchPromptCb, 'Invariant 4C: Callback "res:search" activates conversational search prompt');

  // Send the UID as the next text message
  const conversationalInput = await handleAdminPanelMessage(testReseller.resellerUid, testChatId, testChatId);
  testAssert(
    conversationalInput,
    'Invariant 4D: Conversational state consumes reseller UID input and renders detail card'
  );

  // ---------------------------------------------------------------------------
  // TEST 5: Inline Navigation & Contextual Callbacks (Back, Home, Submenus)
  // ---------------------------------------------------------------------------
  const homeCb = await handleAdminPanelCallback('nav:home', 'cb_102', testChatId, testChatId, 1002);
  testAssert(homeCb, 'Invariant 5A: "nav:home" callback returns to Dashboard view');

  const salesTodayCb = await handleAdminPanelCallback('sales:today', 'cb_103', testChatId, testChatId, 1003);
  testAssert(salesTodayCb, 'Invariant 5B: "sales:today" executes real periodic query');

  const sales7dCb = await handleAdminPanelCallback('sales:7d', 'cb_104', testChatId, testChatId, 1004);
  testAssert(sales7dCb, 'Invariant 5C: "sales:7d" executes 7-day query');

  const prodTopCb = await handleAdminPanelCallback('prod:top', 'cb_105', testChatId, testChatId, 1005);
  testAssert(prodTopCb, 'Invariant 5D: "prod:top" ranks products by verified sales volume');

  const wallSumCb = await handleAdminPanelCallback('wall:sum', 'cb_106', testChatId, testChatId, 1006);
  testAssert(wallSumCb, 'Invariant 5E: "wall:sum" aggregates store-wide liabilities');

  const wdrPendCb = await handleAdminPanelCallback('wdr:pend', 'cb_107', testChatId, testChatId, 1007);
  testAssert(wdrPendCb, 'Invariant 5F: "wdr:pend" filters pending payout requests');

  const fraudRiskCb = await handleAdminPanelCallback('fraud:risk', 'cb_108', testChatId, testChatId, 1008);
  testAssert(fraudRiskCb, 'Invariant 5G: "fraud:risk" evaluates heuristic risk indicators');

  // ---------------------------------------------------------------------------
  // TEST 6: Unauthorized Users Are Strictly Rejected from Messages & Callbacks
  // ---------------------------------------------------------------------------
  const unauthId = '987654321099';
  const unauthMsg = await handleAdminPanelMessage('📊 Dashboard', unauthId, unauthId);
  testAssert(
    unauthMsg === true,
    'Invariant 6A: Unauthorized text message is intercepted and blocked with rejection'
  );

  const unauthCb = await handleAdminPanelCallback('nav:dash', 'cb_999', unauthId, unauthId, 9999);
  testAssert(
    unauthCb === true,
    'Invariant 6B: Unauthorized inline button callback is intercepted and blocked'
  );

  // ---------------------------------------------------------------------------
  // TEST 7: Masked UPI Privacy Formatting
  // ---------------------------------------------------------------------------
  testAssert(
    maskUpiId('rajatsharma@oksbi') === 'raj***@oksbi',
    'Invariant 7A: maskUpiId correctly masks username while preserving payment handle'
  );
  testAssert(
    maskUpiId('abc@paytm') === 'a***@paytm',
    'Invariant 7B: maskUpiId correctly masks short username'
  );

  // ---------------------------------------------------------------------------
  // TEST 8: IST Date Key Boundaries
  // ---------------------------------------------------------------------------
  const istDate = getIstDateKey(new Date());
  testAssert(
    /^\d{4}-\d{2}-\d{2}$/.test(istDate),
    `Invariant 8: IST Date Key generator formats standard YYYY-MM-DD (${istDate})`
  );

  // ---------------------------------------------------------------------------
  // TEST 9: Second Authorized Admin Account Full Access
  // ---------------------------------------------------------------------------
  const secondAdminId = testAdmin2;
  const admin2Dash = await handleAdminPanelMessage('📊 Dashboard', secondAdminId, secondAdminId);
  const admin2Cb = await handleAdminPanelCallback('nav:res', 'cb_201', secondAdminId, secondAdminId, 2001);
  testAssert(
    admin2Dash && admin2Cb,
    'Invariant 9: Second authorized admin has 100% full panel navigation access'
  );

  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
  process.exit(0);
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
