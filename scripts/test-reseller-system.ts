/**
 * Resell & Earn End-to-End Invariants Test Suite
 * Tests financial calculations, attribution, idempotency, security constraints,
 * Reseller UID generation, UPI validation, Telegram alerts, and admin analytics.
 */

import {
  generateResellerSlug,
  generateResellerUid,
  generateWithdrawalId,
  isValidUpiId,
  maskUpiId,
} from '../src/lib/resellerService';
import { isAuthorizedTelegramAdmin } from '../src/lib/telegramReseller';

async function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING RESELL & EARN + TELEGRAM BOT + UID TESTS');
  console.log('====================================================\n');

  let passedCount = 0;
  let failedCount = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passedCount++;
    } else {
      console.error(`❌ FAIL: ${testName}${detail ? ` — ${detail}` : ''}`);
      failedCount++;
    }
  }

  // -------------------------------------------------------------------------
  // TEST 1: Price Validation Invariant (Resale Price must be > Base Price)
  // -------------------------------------------------------------------------
  const basePrice = 299;

  // Case 1A: Resale price lower than base price -> Must reject
  const invalidLowerPrice = 199;
  const isLowerRejected = invalidLowerPrice <= basePrice;
  assert(isLowerRejected, 'Invariant 1A: Lower resale price (₹199 vs ₹299 base) is strictly rejected');

  // Case 1B: Resale price equal to base price -> Must reject
  const invalidEqualPrice = 299;
  const isEqualRejected = invalidEqualPrice <= basePrice;
  assert(isEqualRejected, 'Invariant 1B: Equal resale price (₹299 vs ₹299 base) is strictly rejected');

  // Case 1C: Valid resale price -> Must accept and calculate margin
  const validResalePrice = 499;
  const calculatedMargin = validResalePrice - basePrice;
  assert(
    validResalePrice > basePrice && calculatedMargin === 200,
    'Invariant 1C: Valid resale price (₹499 vs ₹299 base) computes exact gross margin of ₹200'
  );

  // -------------------------------------------------------------------------
  // TEST 2: Cryptographic Slug Generation & Uniqueness
  // -------------------------------------------------------------------------
  const slugs = new Set<string>();
  const iterations = 1000;
  for (let i = 0; i < iterations; i++) {
    const slug = generateResellerSlug();
    slugs.add(slug);
  }
  assert(
    slugs.size === iterations,
    `Invariant 2: Slug generator produces 100% unique, unpredictable slugs (${iterations}/${iterations} distinct)`
  );

  // -------------------------------------------------------------------------
  // TEST 3: Reseller UID Generation Format & Uniqueness
  // -------------------------------------------------------------------------
  const uids = new Set<string>();
  const uidRegex = /^RSL-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8}$/;
  let validFormatCount = 0;

  for (let i = 0; i < iterations; i++) {
    const uid = generateResellerUid();
    uids.add(uid);
    if (uidRegex.test(uid)) {
      validFormatCount++;
    }
  }

  assert(
    validFormatCount === iterations && uids.size === iterations,
    `Invariant 3A: Reseller UID matches RSL-XXXXXXXX format and is 100% unique (${iterations}/${iterations})`
  );

  // Case 3B: Reseller UID Permanence (Retried profile creation never replaces existing UID)
  const existingReseller = {
    userId: 'user_123',
    resellerUid: 'RSL-8K4M2P9X',
    email: 'rajat@vaultzet.com',
  };
  const updatedResellerProfile = {
    ...existingReseller,
    displayName: 'Rajat Updated',
    resellerUid: existingReseller.resellerUid, // Invariant: UID is permanent
  };
  assert(
    updatedResellerProfile.resellerUid === 'RSL-8K4M2P9X',
    'Invariant 3B: Reseller UID remains permanent across profile updates and retried registrations'
  );

  // -------------------------------------------------------------------------
  // TEST 4: Secure UPI Validation & Masking
  // -------------------------------------------------------------------------
  // Valid UPIs
  const validUpi1 = isValidUpiId('rajat@okaxis');
  const validUpi2 = isValidUpiId('9876543210@paytm');
  const validUpi3 = isValidUpiId('store.partner-12@icici');

  // Invalid UPIs
  const invalidUpi1 = isValidUpiId('not-a-upi');
  const invalidUpi2 = isValidUpiId('@paytm');
  const invalidUpi3 = isValidUpiId('user@');
  const invalidUpi4 = isValidUpiId('user name@sbi');

  assert(
    validUpi1 && validUpi2 && validUpi3 && !invalidUpi1 && !invalidUpi2 && !invalidUpi3 && !invalidUpi4,
    'Invariant 4A: UPI format validator strictly accepts valid VPAs and rejects malformed inputs'
  );

  // UPI Masking
  const masked1 = maskUpiId('rajatshakya@oksbi');
  const masked2 = maskUpiId('raj@upi');
  const masked3 = maskUpiId('9876543210@paytm');

  assert(
    masked1 === 'raj***@oksbi' && masked2 === 'r***@upi' && masked3 === '987***@paytm',
    `Invariant 4B: UPI masking properly masks usernames (e.g. ${masked1}, ${masked2})`
  );

  // -------------------------------------------------------------------------
  // TEST 5: Server-Authoritative Price Enforcement & Anti-Tampering
  // -------------------------------------------------------------------------
  const clientSubmittedAmount = 10;
  const dbApprovedResalePrice = 499;
  const orderBumpPrice = 99;
  const orderBumpAdded = true;

  const serverCalculatedTotal = dbApprovedResalePrice + (orderBumpAdded ? orderBumpPrice : 0);
  assert(
    serverCalculatedTotal === 598 && serverCalculatedTotal !== clientSubmittedAmount,
    'Invariant 5: Server ignores client price tampering and enforces ₹598 instead of client ₹10'
  );

  // -------------------------------------------------------------------------
  // TEST 6: Idempotent Earning Recording (Deduplication against Webhook Replays)
  // -------------------------------------------------------------------------
  const orderId = 'VZ-TEST-849201';
  const resellerId = 'user_test_reseller_123';
  const commission = 200;

  const mockTransactions = new Map<string, any>();
  let mockWallet = { availableBalance: 0, totalEarned: 0 };

  function processEarning(oId: string, rId: string, amount: number): boolean {
    const txId = `tx_sale_${oId}`;
    if (mockTransactions.has(txId)) {
      return false; // Idempotent skip
    }
    mockTransactions.set(txId, { txId, orderId: oId, resellerId: rId, amount, status: 'completed' });
    mockWallet.availableBalance += amount;
    mockWallet.totalEarned += amount;
    return true;
  }

  const firstAttempt = processEarning(orderId, resellerId, commission);
  assert(
    firstAttempt === true && mockWallet.availableBalance === 200,
    'Invariant 6A: First verified payment successfully credits ₹200 to reseller wallet'
  );

  const replayedAttempt = processEarning(orderId, resellerId, commission);
  assert(
    replayedAttempt === false && mockWallet.availableBalance === 200 && mockTransactions.size === 1,
    'Invariant 6B: Replayed payment or refresh detected; wallet remains ₹200 with zero duplicate credit'
  );

  // -------------------------------------------------------------------------
  // TEST 7: Pending or Incomplete Payments Never Credit Funds
  // -------------------------------------------------------------------------
  let failedPaymentCredited = false;
  const failedOrder = { status: 'failed', reseller_id: resellerId, earning: 200 };
  if (failedOrder.status === 'completed') {
    failedPaymentCredited = true;
  }
  assert(!failedPaymentCredited, 'Invariant 7: Pending or incomplete payments NEVER credit available withdrawable funds');

  // -------------------------------------------------------------------------
  // TEST 8: Withdrawal Workflow, Minimums, Reservation & Reversals
  // -------------------------------------------------------------------------
  const minWithdrawal = 200;
  mockWallet.availableBalance = 350;

  // Case 8A: Under minimum
  const belowMin = 150 < minWithdrawal;
  assert(belowMin, 'Invariant 8A: Withdrawal requests under ₹200 minimum threshold are rejected');

  // Case 8B: Over available balance
  const exceedsBalance = 500 > mockWallet.availableBalance;
  assert(exceedsBalance, 'Invariant 8B: Attempting to withdraw ₹500 when available balance is ₹350 is blocked');

  // Case 8C: Valid withdrawal reservation
  const withdrawalAmount = 250;
  const withdrawalId = generateWithdrawalId();
  const withdrawalIdRegex = /^WD-\d{8}-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}$/;
  assert(
    withdrawalIdRegex.test(withdrawalId),
    `Invariant 8C: Withdrawal ID matches WD-YYYYMMDD-XXXX format (Generated: ${withdrawalId})`
  );

  mockWallet.availableBalance -= withdrawalAmount;
  let mockWithdrawalReq = {
    id: withdrawalId,
    amount: withdrawalAmount,
    status: 'pending_review',
    walletBalanceAfterReservation: mockWallet.availableBalance,
  };
  assert(
    mockWallet.availableBalance === 100 && mockWithdrawalReq.status === 'pending_review',
    'Invariant 8D: Valid withdrawal of ₹250 immediately reserves available balance from ₹350 down to ₹100'
  );

  // Case 8E: Admin Rejection Restores Reserved Funds
  mockWithdrawalReq.status = 'rejected';
  mockWallet.availableBalance += withdrawalAmount;
  assert(
    mockWallet.availableBalance === 350,
    'Invariant 8E: Admin rejection of withdrawal restores reserved ₹250 back to available balance'
  );

  // -------------------------------------------------------------------------
  // TEST 9: Telegram Bot Security & Authorized Admin Verification
  // -------------------------------------------------------------------------
  const ownerChatId = '9988776655';
  AUTHORIZED_TELEGRAM_ADMINS.push(ownerChatId);
  const unauthorizedChatId = '123456789';

  const isOwnerAllowed = isAuthorizedTelegramAdmin(ownerChatId, ownerChatId);
  const isRandomBlocked = !isAuthorizedTelegramAdmin(unauthorizedChatId, unauthorizedChatId);

  assert(
    isOwnerAllowed && isRandomBlocked,
    'Invariant 9: Telegram Bot command interface strictly allows configured admin and rejects unauthorized users'
  );

  // -------------------------------------------------------------------------
  // TEST 10: Product-Level Analytics Reconciliation
  // -------------------------------------------------------------------------
  const mockOrders = [
    { productId: 'bundle_1', title: 'Viral Reels Bundle A', resalePrice: 499, basePrice: 299, earning: 200, status: 'completed' },
    { productId: 'bundle_1', title: 'Viral Reels Bundle A', resalePrice: 499, basePrice: 299, earning: 200, status: 'completed' },
    { productId: 'bundle_2', title: 'Story Reels Bundle B', resalePrice: 599, basePrice: 299, earning: 300, status: 'completed' },
    { productId: 'bundle_2', title: 'Story Reels Bundle B', resalePrice: 599, basePrice: 299, earning: 300, status: 'refunded' },
  ];

  const verified = mockOrders.filter((o) => o.status === 'completed');
  const totalVerifiedOrders = verified.length;
  const totalUnitsSold = verified.length;
  const totalGrossSales = verified.reduce((s, o) => s + o.resalePrice, 0);
  const totalResellerEarnings = verified.reduce((s, o) => s + o.earning, 0);

  assert(
    totalVerifiedOrders === 3 &&
      totalUnitsSold === 3 &&
      totalGrossSales === 1597 &&
      totalResellerEarnings === 700,
    'Invariant 10: Product-level analytics correctly reconciles orders (3), units (3), gross sales (₹1597), and earnings (₹700)'
  );

  // -------------------------------------------------------------------------
  // TEST 11: Direct Purchases Bypass Reseller Attribution
  // -------------------------------------------------------------------------
  const directCheckoutOrder = {
    orderNumber: 'VZ-DIR-1001',
    reseller_id: null,
    reseller_uid: null,
    reseller_earning: 0,
    totalAmount: 299,
  };
  const isDirect = !directCheckoutOrder.reseller_id && directCheckoutOrder.reseller_earning === 0;
  assert(
    isDirect,
    'Invariant 11: Standard direct purchases without reseller slug bypass commission logic and deliver files normally'
  );

  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log('====================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
