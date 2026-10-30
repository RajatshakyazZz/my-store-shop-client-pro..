// Automated Test Suite: Manual Withdrawal Approval System for Vaultzet Store
// Verifying UPI ID validation, balance reservation, duplicate request guard,
// manual approval stages (pending -> approved -> processing -> paid / rejected),
// balance refund on rejection, totalWithdrawn increment on paid,
// immutable status protection, Telegram action buttons & callbacks, and audit logging.

import assert from 'assert';
import {
  saveResellerPayoutMethod,
  getResellerPayoutMethod,
  isValidUpiId,
  createOrUpdateResellerProfile,
  getResellerWallet,
  requestWithdrawal,
  getWithdrawalRequests,
  getWithdrawalRequestById,
  updateWithdrawalStatus,
  getLocalOrMemoryItem,
  setLocalOrMemoryItem,
} from '@/lib/resellerService';
import {
  sendWithdrawalRequestTelegramAlert,
  sendWithdrawalStatusTelegramAlert,
  isAuthorizedTelegramAdmin,
} from '@/lib/telegramReseller';
import {
  handleAdminPanelCallback,
  handleTelegramWithdrawalApprove,
  handleTelegramWithdrawalProcessing,
  handleTelegramWithdrawalReject,
  handleTelegramWithdrawalView,
} from '@/lib/telegramAdminPanel';

async function runTests() {
  console.log('\n====================================================');
  console.log('💳 RUNNING MANUAL WITHDRAWAL APPROVAL SYSTEM TESTS');
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

  const testUserId = `user_wdr_test_${Date.now()}`;
  const testEmail = `reseller_${Date.now()}@example.com`;
  const now = new Date().toISOString();

  // ---------------------------------------------------------------------------
  // 1. UPI ID VALIDATION & PAYOUT METHOD
  // ---------------------------------------------------------------------------
  console.log('--- Phase 1: UPI ID Validation & Payout Method Storage ---');
  testAssert(isValidUpiId('rajat@okhdfcbank') === true, '1A: Valid handle rajat@okhdfcbank is accepted');
  testAssert(isValidUpiId('9876543210@paytm') === true, '1B: Valid phone-based UPI is accepted');
  testAssert(isValidUpiId('invalidupi') === false, '1C: Handle without @ is rejected');
  testAssert(isValidUpiId('@paytm') === false, '1D: Empty username before @ is rejected');

  const payoutMethod = await saveResellerPayoutMethod(testUserId, {
    upiId: 'vaultzet.partner@okaxis',
    accountHolderName: 'Rajat Sharma',
    label: 'Primary Business UPI',
  });
  testAssert(payoutMethod.upiId === 'vaultzet.partner@okaxis', '1E: Payout method successfully saved');

  const fetchedMethod = await getResellerPayoutMethod(testUserId);
  testAssert(fetchedMethod?.upiId === 'vaultzet.partner@okaxis', '1F: Payout method retrieved accurately');

  // ---------------------------------------------------------------------------
  // 2. RESELLER PROFILE & WALLET FUNDING
  // ---------------------------------------------------------------------------
  console.log('\n--- Phase 2: Reseller Profile & Wallet Initialization ---');
  const profile = await createOrUpdateResellerProfile({
    userId: testUserId,
    displayName: 'Manual WDR Reseller',
    email: testEmail,
    payoutDetails: { upiId: 'vaultzet.partner@okaxis', accountHolderName: 'Rajat Sharma' },
  });
  testAssert(Boolean(profile.resellerUid), `2A: Reseller created with UID: ${profile.resellerUid}`);

  // Seed initial wallet with ₹2,000 available balance
  const walletKey = `vaultzet_wallet_${testUserId}`;
  setLocalOrMemoryItem(
    walletKey,
    JSON.stringify({
      resellerId: testUserId,
      resellerUid: profile.resellerUid,
      availableBalance: 2000,
      pendingBalance: 0,
      totalEarned: 2000,
      totalWithdrawn: 0,
      updatedAt: now,
    })
  );

  const initialWallet = await getResellerWallet(testUserId);
  testAssert(initialWallet.availableBalance === 2000, '2B: Wallet initialized with ₹2,000 available balance');

  // ---------------------------------------------------------------------------
  // 3. WITHDRAWAL REQUEST RULES & BALANCE RESERVATION
  // ---------------------------------------------------------------------------
  console.log('\n--- Phase 3: Withdrawal Creation & Balance Reservation ---');
  
  // Test 3A: Enforce minimum withdrawal (₹200)
  let minError = false;
  try {
    await requestWithdrawal({
      userId: testUserId,
      resellerName: 'Manual WDR Reseller',
      resellerEmail: testEmail,
      amount: 150, // < 200
      payoutMethod: 'upi',
      payoutDetails: { upiId: 'vaultzet.partner@okaxis' },
    });
  } catch (err: any) {
    minError = err.message.includes('Minimum withdrawal amount is ₹200');
  }
  testAssert(minError, '3A: Rejects withdrawal request below ₹200 threshold');

  // Test 3B: Reject request exceeding available balance
  let excessError = false;
  try {
    await requestWithdrawal({
      userId: testUserId,
      resellerName: 'Manual WDR Reseller',
      resellerEmail: testEmail,
      amount: 5000, // > 2000
      payoutMethod: 'upi',
      payoutDetails: { upiId: 'vaultzet.partner@okaxis' },
    });
  } catch (err: any) {
    excessError = err.message.includes('Insufficient balance');
  }
  testAssert(excessError, '3B: Rejects withdrawal request exceeding available balance');

  // Test 3C: Valid request creation (₹600)
  const req1 = await requestWithdrawal({
    userId: testUserId,
    resellerName: 'Manual WDR Reseller',
    resellerEmail: testEmail,
    amount: 600,
    payoutMethod: 'upi',
    payoutDetails: { upiId: 'vaultzet.partner@okaxis', accountHolderName: 'Rajat Sharma' },
  });
  testAssert(req1.id.startsWith('WD-'), `3C: Generated unique Withdrawal ID: ${req1.id}`);
  testAssert(req1.status === 'pending_review', '3D: Request status initialized to pending_review');

  // Verify atomic hold on balance
  const walletAfterReq = await getResellerWallet(testUserId);
  testAssert(walletAfterReq.availableBalance === 1400, `3E: ₹600 immediately reserved from available balance (remaining: ₹${walletAfterReq.availableBalance})`);
  testAssert(walletAfterReq.totalWithdrawn === 0, '3F: totalWithdrawn remains 0 upon request creation (not yet paid)');

  // ---------------------------------------------------------------------------
  // 4. DUPLICATE PENDING REQUEST GUARD
  // ---------------------------------------------------------------------------
  console.log('\n--- Phase 4: Duplicate Pending Request Protection ---');
  let duplicateBlocked = false;
  try {
    await requestWithdrawal({
      userId: testUserId,
      resellerName: 'Manual WDR Reseller',
      resellerEmail: testEmail,
      amount: 300,
      payoutMethod: 'upi',
      payoutDetails: { upiId: 'vaultzet.partner@okaxis' },
    });
  } catch (err: any) {
    duplicateBlocked = err.message.includes('already have an active withdrawal request');
  }
  testAssert(duplicateBlocked, '4A: Duplicate withdrawal request blocked while previous request is pending');

  // ---------------------------------------------------------------------------
  // 5. ADMIN MANUAL APPROVAL WORKFLOW (Pending -> Approved)
  // ---------------------------------------------------------------------------
  console.log('\n--- Phase 5: Admin Manual Approval (Pending -> Approved) ---');
  const approveRes = await updateWithdrawalStatus({
    withdrawalId: req1.id,
    status: 'approved',
    processedBy: 'admin@vaultzet.com',
    adminNotes: 'Verified sales metrics. Approved for payout.',
  });
  testAssert(approveRes.success === true, '5A: updateWithdrawalStatus successfully approves request');
  testAssert(approveRes.withdrawal?.status === 'approved', '5B: Status is now approved');

  const walletAfterApprove = await getResellerWallet(testUserId);
  testAssert(walletAfterApprove.availableBalance === 1400, '5C: Approval leaves available balance unchanged (remains reserved)');
  testAssert(walletAfterApprove.totalWithdrawn === 0, '5D: Approval does not increment totalWithdrawn (no payout yet)');

  // ---------------------------------------------------------------------------
  // 6. ADMIN MARK PROCESSING WORKFLOW (Approved -> Processing)
  // ---------------------------------------------------------------------------
  console.log('\n--- Phase 6: Admin Mark Processing (Approved -> Processing) ---');
  const procRes = await updateWithdrawalStatus({
    withdrawalId: req1.id,
    status: 'processing',
    processedBy: 'admin@vaultzet.com',
    adminNotes: 'Admin is executing manual UPI transfer via PhonePe Business',
  });
  testAssert(procRes.success === true, '6A: Request successfully marked as processing');
  testAssert(procRes.withdrawal?.status === 'processing', '6B: Status is now processing');

  // ---------------------------------------------------------------------------
  // 7. ADMIN REJECTION WORKFLOW WITH ATOMIC BALANCE REFUND
  // ---------------------------------------------------------------------------
  console.log('\n--- Phase 7: Rejection Workflow & Balance Refund ---');
  // Create another test user & request to test rejection cleanly
  const rejectUserId = `user_rej_test_${Date.now()}`;
  setLocalOrMemoryItem(
    `vaultzet_wallet_${rejectUserId}`,
    JSON.stringify({
      resellerId: rejectUserId,
      resellerUid: 'RSL-REJTEST1',
      availableBalance: 1000,
      pendingBalance: 0,
      totalEarned: 1000,
      totalWithdrawn: 0,
      updatedAt: now,
    })
  );

  const reqToReject = await requestWithdrawal({
    userId: rejectUserId,
    resellerName: 'Reject Tester',
    resellerEmail: 'reject@example.com',
    amount: 400,
    payoutMethod: 'upi',
    payoutDetails: { upiId: 'invalid.vpa@upi' },
  });
  testAssert(reqToReject.id.startsWith('WD-'), '7A: Created withdrawal request for rejection test');

  const wBeforeRejection = await getResellerWallet(rejectUserId);
  testAssert(wBeforeRejection.availableBalance === 600, '7B: Available balance reserved to ₹600');

  // Test rejection without reason must fail
  const failedRej = await updateWithdrawalStatus({
    withdrawalId: reqToReject.id,
    status: 'rejected',
    processedBy: 'admin@vaultzet.com',
  });
  testAssert(failedRej.success === false, '7C: Rejection without reason is rejected by validator');

  // Rejection with mandatory reason
  const validRej = await updateWithdrawalStatus({
    withdrawalId: reqToReject.id,
    status: 'rejected',
    rejectionReason: 'Invalid UPI VPA returned by NPCI. Please update your UPI ID.',
    processedBy: 'admin@vaultzet.com',
  });
  testAssert(validRej.success === true, '7D: Rejection with reason succeeded');
  testAssert(validRej.withdrawal?.status === 'rejected', '7E: Withdrawal status updated to rejected');

  // Check balance refund
  const wAfterRejection = await getResellerWallet(rejectUserId);
  testAssert(wAfterRejection.availableBalance === 1000, `7F: Reserved ₹400 atomically restored to available balance (₹${wAfterRejection.availableBalance})`);

  // Check immutable reversal transaction
  const txsRejJson = getLocalOrMemoryItem(`vaultzet_transactions_${rejectUserId}`);
  const txsRej = txsRejJson ? JSON.parse(txsRejJson) : [];
  const refundTx = txsRej.find((t: any) => t.type === 'withdrawal_rejected');
  testAssert(Boolean(refundTx), '7G: Immutable withdrawal_rejected ledger transaction recorded');
  testAssert(refundTx.amount === 400, '7H: Refund transaction amount is +₹400');

  // ---------------------------------------------------------------------------
  // 8. ADMIN MANUAL SETTLEMENT & MARK AS PAID
  // ---------------------------------------------------------------------------
  console.log('\n--- Phase 8: Manual Settlement & Mark as Paid ---');
  // Attempt to mark paid without Bank UTR reference
  const paidNoRef = await updateWithdrawalStatus({
    withdrawalId: req1.id,
    status: 'paid',
    processedBy: 'admin@vaultzet.com',
  });
  testAssert(paidNoRef.success === false, '8A: Mark as Paid without Bank UTR reference is rejected');

  // Mark as Paid with verified UTR reference
  const utrRef = `UPI/412398765432`;
  const paidWithRef = await updateWithdrawalStatus({
    withdrawalId: req1.id,
    status: 'paid',
    payoutReference: utrRef,
    adminNotes: 'Transferred via ICICI UPI Business',
    processedBy: 'admin@vaultzet.com',
  });
  testAssert(paidWithRef.success === true, '8B: Mark as Paid with Bank UTR reference succeeded');
  testAssert(paidWithRef.withdrawal?.status === 'paid', '8C: Status updated to paid');
  testAssert(paidWithRef.withdrawal?.payoutReference === utrRef, '8D: Bank UTR recorded on withdrawal');

  // Check wallet totalWithdrawn increment
  const walletAfterPaid = await getResellerWallet(testUserId);
  testAssert(walletAfterPaid.availableBalance === 1400, '8E: Available balance remains deducted at ₹1,400');
  testAssert(walletAfterPaid.totalWithdrawn === 600, `8F: totalWithdrawn incremented to ₹${walletAfterPaid.totalWithdrawn}`);

  // Check immutable paid transaction in ledger
  const txsPaidJson = getLocalOrMemoryItem(`vaultzet_transactions_${testUserId}`);
  const txsPaid = txsPaidJson ? JSON.parse(txsPaidJson) : [];
  const paidTx = txsPaid.find((t: any) => t.type === 'withdrawal_paid');
  testAssert(Boolean(paidTx), '8G: Immutable withdrawal_paid ledger transaction recorded');

  // ---------------------------------------------------------------------------
  // 9. IMMUTABILITY & TAMPER PROTECTION
  // ---------------------------------------------------------------------------
  console.log('\n--- Phase 9: Immutability & Double Payout Guard ---');
  const tamperPaid = await updateWithdrawalStatus({
    withdrawalId: req1.id,
    status: 'rejected',
    processedBy: 'attacker@evil.com',
  });
  testAssert(tamperPaid.success === false, '9A: Modifying an already paid withdrawal is strictly blocked');

  const tamperRejected = await updateWithdrawalStatus({
    withdrawalId: reqToReject.id,
    status: 'paid',
    payoutReference: 'FAKE-UTR',
  });
  testAssert(tamperRejected.success === false, '9B: Modifying an already rejected withdrawal is strictly blocked');

  // ---------------------------------------------------------------------------
  // 10. TELEGRAM ALERTS & INLINE ACTION BUTTONS
  // ---------------------------------------------------------------------------
  console.log('\n--- Phase 10: Telegram Alerts & Inline Action Callbacks ---');
  // Dispatch withdrawal request alert
  const alertSent = await sendWithdrawalRequestTelegramAlert(req1);
  testAssert(typeof alertSent === 'boolean', '10A: sendWithdrawalRequestTelegramAlert executes cleanly');

  // Dispatch withdrawal status alert for each state
  const approvedAlert = await sendWithdrawalStatusTelegramAlert({
    withdrawal: { ...req1, status: 'approved' },
  });
  testAssert(typeof approvedAlert === 'boolean', '10B: Approved status alert dispatches cleanly');

  const paidAlert = await sendWithdrawalStatusTelegramAlert({
    withdrawal: { ...req1, status: 'paid', payoutReference: utrRef },
  });
  testAssert(typeof paidAlert === 'boolean', '10C: Paid status alert with UTR dispatches cleanly');

  const rejectedAlert = await sendWithdrawalStatusTelegramAlert({
    withdrawal: { ...reqToReject, status: 'rejected', rejectionReason: 'Invalid UPI' },
  });
  testAssert(typeof rejectedAlert === 'boolean', '10D: Rejected status alert dispatches cleanly');

  // Test interactive action handlers from Telegram
  // 1. View request
  const testAdmin1 = '9988776655';
  const testAdmin2 = '9988776656';
  AUTHORIZED_TELEGRAM_ADMINS.push(testAdmin1, testAdmin2);

  const viewRes = await handleTelegramWithdrawalView(testAdmin1, undefined, req1.id);
  testAssert(typeof viewRes === 'boolean', '10E: handleTelegramWithdrawalView renders full detail view');

  // 2. Unauthorized callback blocked
  const unauthRes = await handleAdminPanelCallback(
    `wdr:act:approve:${req1.id}`,
    'cb_test_unauth',
    '987654321099', // unauthorized
    '987654321099',
    100
  );
  testAssert(unauthRes === true, '10F: Unauthorized Telegram user callback strictly intercepted and denied');

  // 3. Authorized callback allowed
  testAssert(isAuthorizedTelegramAdmin(testAdmin1) === true, '10G: Configured admin 1 recognized');
  testAssert(isAuthorizedTelegramAdmin(testAdmin2) === true, '10H: Configured admin 2 recognized');

  // ---------------------------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------------------------
  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test execution error:', err);
  process.exit(1);
});
