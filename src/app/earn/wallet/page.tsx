'use client';

import React, { useState, useEffect } from 'react';
import {
  Wallet,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  Building,
  ShieldCheck,
  RefreshCw,
  QrCode,
  Edit2,
  Lock,
  ExternalLink,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { useResellerAuth } from '@/context/ResellerAuthContext';
import {
  getResellerWallet,
  getResellerTransactions,
  getWithdrawalRequests,
  requestWithdrawal,
  saveResellerPayoutMethod,
  getResellerPayoutMethod,
  maskUpiId,
  isValidUpiId,
  deleteWithdrawalRequest,
} from '@/lib/resellerService';
import {
  WalletAccount,
  WalletTransaction,
  WithdrawalRequest,
  ResellerPayoutMethod,
} from '@/types/reseller';

export default function ResellerWalletPage() {
  const { user, profile } = useResellerAuth();

  // Instant 0ms cache hydration from localStorage
  const [wallet, setWallet] = useState<WalletAccount | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const cached = localStorage.getItem('vaultzet_reseller_wallet_cached');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const cached = localStorage.getItem('vaultzet_reseller_txs_cached');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const cached = localStorage.getItem('vaultzet_reseller_wdrs_cached');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [payoutMethod, setPayoutMethod] = useState<ResellerPayoutMethod | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const cached = localStorage.getItem('vaultzet_reseller_pm_cached');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  // UPI Method Modal state
  const [isMethodModalOpen, setIsMethodModalOpen] = useState(false);
  const [upiIdInput, setUpiIdInput] = useState('');
  const [holderNameInput, setHolderNameInput] = useState('');
  const [labelInput, setLabelInput] = useState('My Primary UPI');
  const [isSavingMethod, setIsSavingMethod] = useState(false);
  const [methodError, setMethodError] = useState<string | null>(null);
  const [methodSuccess, setMethodSuccess] = useState<string | null>(null);

  // Withdrawal modal state
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [amount, setAmount] = useState<number>(1);
  const [inlineUpiInput, setInlineUpiInput] = useState('');
  const [inlineHolderInput, setInlineHolderInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [confirmedWithdrawal, setConfirmedWithdrawal] = useState<WithdrawalRequest | null>(null);
  const [isCancellingWithdrawal, setIsCancellingWithdrawal] = useState(false);

  // Resolve active userId
  const effectiveUserId =
    user?.uid ||
    profile?.userId ||
    (typeof window !== 'undefined'
      ? (() => {
          try {
            const demo = localStorage.getItem('vaultzet_demo_reseller');
            return demo ? JSON.parse(demo).uid : localStorage.getItem('vaultzet_reseller_user_id') || '';
          } catch {
            return '';
          }
        })()
      : '');

  useEffect(() => {
    if (effectiveUserId) {
      loadWalletData(effectiveUserId);
    }
  }, [effectiveUserId]);

  const loadWalletData = async (targetUid?: string) => {
    const uid = targetUid || effectiveUserId;
    if (!uid) return;

    try {
      const [w, t, wdr, pm] = await Promise.all([
        getResellerWallet(uid),
        getResellerTransactions(uid),
        getWithdrawalRequests(uid),
        getResellerPayoutMethod(uid),
      ]);
      setWallet(w);
      setTransactions(t);
      setWithdrawals(wdr);
      setPayoutMethod(pm);

      // Save to instant local cache for 0ms load next time
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('vaultzet_reseller_wallet_cached', JSON.stringify(w));
          localStorage.setItem('vaultzet_reseller_txs_cached', JSON.stringify(t));
          localStorage.setItem('vaultzet_reseller_wdrs_cached', JSON.stringify(wdr));
          if (pm) localStorage.setItem('vaultzet_reseller_pm_cached', JSON.stringify(pm));
        } catch {}
      }

      if (pm?.upiId) {
        setUpiIdInput(pm.upiId);
        setHolderNameInput(pm.accountHolderName);
        setLabelInput(pm.label || 'My Primary UPI');
        setInlineUpiInput(pm.upiId);
        setInlineHolderInput(pm.accountHolderName);
      } else if (profile?.payoutDetails?.upiId) {
        setUpiIdInput(profile.payoutDetails.upiId);
        setHolderNameInput(profile.payoutDetails.accountHolderName || profile.displayName || '');
        setInlineUpiInput(profile.payoutDetails.upiId);
        setInlineHolderInput(profile.payoutDetails.accountHolderName || profile.displayName || '');
      }
    } catch (e) {
      console.warn('Error loading wallet data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveUpiMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    const uid = effectiveUserId;
    if (!uid) return;
    setMethodError(null);
    setMethodSuccess(null);

    if (!isValidUpiId(upiIdInput)) {
      setMethodError('Please enter a valid UPI ID (e.g. yourname@okaxis, mobile@upi)');
      return;
    }
    if (!holderNameInput.trim()) {
      setMethodError('Please enter the account holder or recipient name');
      return;
    }

    setIsSavingMethod(true);
    try {
      const saved = await saveResellerPayoutMethod(uid, {
        upiId: upiIdInput.trim().toLowerCase(),
        accountHolderName: holderNameInput.trim(),
        label: labelInput.trim() || 'My UPI',
      });
      setPayoutMethod(saved);
      if (typeof window !== 'undefined') {
        localStorage.setItem('vaultzet_reseller_pm_cached', JSON.stringify(saved));
      }
      setMethodSuccess('UPI payout details saved successfully!');
      setTimeout(() => {
        setIsMethodModalOpen(false);
        setMethodSuccess(null);
      }, 1200);
    } catch (err: any) {
      setMethodError(err.message || 'Failed to save UPI details');
    } finally {
      setIsSavingMethod(false);
    }
  };

  const handleCancelPendingWithdrawal = async (wdrId: string) => {
    if (!confirm('Are you sure you want to cancel this pending withdrawal request? The reserved amount will be returned to your available balance immediately.')) {
      return;
    }
    setIsCancellingWithdrawal(true);
    try {
      const res = await deleteWithdrawalRequest(wdrId);
      if (res.success) {
        await loadWalletData(effectiveUserId);
      } else {
        alert(res.error || 'Failed to cancel withdrawal');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to cancel withdrawal');
    } finally {
      setIsCancellingWithdrawal(false);
    }
  };

  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const uid = effectiveUserId;
    if (!uid) return;
    setWithdrawError(null);

    const available = wallet?.availableBalance || 0;
    if (amount < 1) {
      setWithdrawError('Minimum withdrawal amount is ₹1');
      return;
    }
    if (amount > available) {
      setWithdrawError(`Insufficient balance! Your available balance is ₹${available}`);
      return;
    }

    let activeUpi = payoutMethod?.upiId || profile?.payoutDetails?.upiId || inlineUpiInput.trim().toLowerCase();
    let recipientName = payoutMethod?.accountHolderName || profile?.payoutDetails?.accountHolderName || inlineHolderInput.trim() || profile?.displayName || 'Reseller';

    if (!activeUpi || !isValidUpiId(activeUpi)) {
      setWithdrawError('Please enter a valid UPI ID (e.g. yourname@paytm, mobile@upi) to receive your payout.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (!payoutMethod?.upiId) {
        try {
          const savedPm = await saveResellerPayoutMethod(uid, {
            upiId: activeUpi,
            accountHolderName: recipientName,
            label: 'Primary UPI',
          });
          setPayoutMethod(savedPm);
          if (typeof window !== 'undefined') {
            localStorage.setItem('vaultzet_reseller_pm_cached', JSON.stringify(savedPm));
          }
        } catch {}
      }

      // Submit via server-authoritative API
      const res = await fetch('/api/reseller/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: uid,
          resellerName: profile?.displayName || user?.displayName || recipientName,
          resellerEmail: profile?.email || user?.email || '',
          amount: Math.floor(amount),
          payoutMethod: 'upi',
          payoutDetails: {
            upiId: activeUpi,
            accountHolderName: recipientName,
          },
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to submit withdrawal request');
      }

      const wdr = resData.withdrawal;

      fetch('/api/reseller/withdrawal-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ withdrawal: wdr }),
      }).catch(() => {});

      setConfirmedWithdrawal(wdr);
      await loadWalletData(uid);
    } catch (err: any) {
      setWithdrawError(err.message || 'Failed to submit withdrawal request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const reservedFunds = withdrawals
    .filter((w) => ['pending', 'pending_review', 'processing', 'approved'].includes(w.status))
    .reduce((sum, w) => sum + w.amount, 0);

  const activePendingWithdrawal = withdrawals.find((w) =>
    ['pending', 'pending_review', 'processing'].includes(w.status)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 sm:pb-12 text-[#162048]">
      {/* ------------------------------------------------------------- */}
      {/* HEADER BANNER */}
      {/* ------------------------------------------------------------- */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#162048] via-[#221652] to-[#3a1b63] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-xl shadow-purple-950/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Earnings & Payout Portal</span>
            </div>
            {profile?.resellerUid && (
              <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                🆔 {profile.resellerUid}
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            Earnings Wallet &amp; Payouts
          </h1>
          <p className="text-xs text-slate-300 font-medium max-w-xl leading-relaxed">
            Track commissions, manage your UPI withdrawal method, and transfer earnings directly to your bank account with an instant ₹1 threshold.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setConfirmedWithdrawal(null);
              setWithdrawError(null);
              setAmount(Math.max(1, wallet?.availableBalance || 1));
              setIsWithdrawModalOpen(true);
            }}
            disabled={isSubmitting}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all cursor-pointer"
            title="Request payout"
          >
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            <span>{activePendingWithdrawal ? 'View Pending Withdrawal' : 'Request Payout'}</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4 CORE FINANCIAL KPI CARDS */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Available Balance */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-emerald-200/80 shadow-xs space-y-2 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Available Balance</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
              ₹{wallet?.availableBalance?.toLocaleString('en-IN') || '0'}
            </div>
            <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
              Eligible for instant UPI payout
            </span>
          </div>
        </div>

        {/* Reserved in Requests */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-amber-200/80 shadow-xs space-y-2 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-inner">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Reserved in Requests</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 tracking-tight">
              ₹{reservedFunds.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-amber-700 font-bold block mt-0.5">
              Under admin verification
            </span>
          </div>
        </div>

        {/* Lifetime Gross Margin */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-red-100/90 shadow-xs space-y-2 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-2xl bg-red-100 text-[#dc2626] flex items-center justify-center shadow-inner">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lifetime Gross Margin</div>
            <div className="text-2xl sm:text-3xl font-black text-[#162048] tracking-tight">
              ₹{wallet?.totalEarned?.toLocaleString('en-IN') || '0'}
            </div>
            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
              100% of your product markups
            </span>
          </div>
        </div>

        {/* Total Transferred */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-blue-100 shadow-xs space-y-2 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Transferred</div>
            <div className="text-2xl sm:text-3xl font-black text-[#162048] tracking-tight">
              ₹{wallet?.totalWithdrawn?.toLocaleString('en-IN') || '0'}
            </div>
            <span className="text-[10px] text-blue-600 font-bold block mt-0.5">
              Settled to your UPI
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* WITHDRAWAL METHODS SECTION */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white border border-red-100/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-50 pb-4">
          <div>
            <h2 className="text-base font-black text-[#162048] flex items-center gap-2">
              <QrCode className="w-5 h-5 text-emerald-600" />
              <span>Withdrawal Method</span>
            </h2>
            <p className="text-slate-400 text-xs mt-0.5 font-medium">
              Save your UPI VPA to receive direct payouts when you request a withdrawal.
            </p>
          </div>
          <button
            onClick={() => {
              setMethodError(null);
              setMethodSuccess(null);
              setIsMethodModalOpen(true);
            }}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-[#dc2626] rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer self-start sm:self-auto"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{payoutMethod?.upiId ? 'Update UPI Details' : 'Add UPI Method'}</span>
          </button>
        </div>

        <div>
          {payoutMethod?.upiId ? (
            <div className="p-4 rounded-2xl bg-red-50/40 border border-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#162048] font-mono">
                      {maskUpiId(payoutMethod.upiId)}
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Primary UPI
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Recipient: <strong className="text-slate-800 font-bold">{payoutMethod.accountHolderName}</strong>
                    {payoutMethod.label && ` • ${payoutMethod.label}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Masked for Security</span>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No UPI withdrawal method saved yet</p>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                Add your UPI ID to receive instant direct payouts whenever your balance reaches ₹1.
              </p>
              <button
                onClick={() => setIsMethodModalOpen(true)}
                className="mt-2 px-4 py-2 bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl text-xs font-bold transition shadow-sm"
              >
                + Add UPI Payout Method
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* PAYOUT REQUEST HISTORY */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white border border-red-100/90 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 sm:p-6 border-b border-purple-50 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-[#162048] flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span>Payout Request History</span>
            </h2>
            <p className="text-slate-400 text-xs mt-0.5 font-medium">
              Review all submitted withdrawal requests, statuses, and payment reference numbers.
            </p>
          </div>
          <button
            onClick={() => loadWalletData()}
            className="p-2 text-slate-400 hover:text-[#dc2626] rounded-xl hover:bg-red-50 transition"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {withdrawals.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs font-medium space-y-1">
            <Clock className="w-8 h-8 mx-auto text-slate-300" />
            <p>No payout requests made yet. When your balance reaches ₹1, you can request your first withdrawal.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-red-100 text-slate-400 uppercase font-extrabold text-[10px] bg-red-50/30">
                <tr>
                  <th className="py-3 px-4">Reference ID</th>
                  <th className="py-3 px-3">Reseller UID</th>
                  <th className="py-3 px-3">Requested Amount</th>
                  <th className="py-3 px-3">Payout UPI</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-4 text-right">Payment UTR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {withdrawals.map((w) => {
                  const displayUpi = w.payoutDetails?.upiId
                    ? maskUpiId(w.payoutDetails.upiId)
                    : w.payoutDetails?.accountNumber
                    ? `••••${w.payoutDetails.accountNumber.slice(-4)}`
                    : 'UPI';

                  return (
                    <tr key={w.id} className="hover:bg-red-50/30 transition">
                      <td className="py-3.5 px-4 font-mono text-xs text-[#162048] font-bold">
                        {w.id}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-xs text-amber-700 font-bold">
                        {w.resellerUid || profile?.resellerUid || 'RSL-USER'}
                      </td>
                      <td className="py-3.5 px-3 font-black text-emerald-600 text-sm">
                        ₹{w.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-xs text-slate-600">
                        {displayUpi}
                      </td>
                      <td className="py-3.5 px-3">
                        {w.status === 'paid' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Paid
                          </span>
                        ) : w.status === 'approved' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <ShieldCheck className="w-3 h-3" /> Approved
                          </span>
                        ) : w.status === 'processing' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                            <Clock className="w-3 h-3" /> Processing
                          </span>
                        ) : w.status === 'rejected' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertCircle className="w-3 h-3" /> Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3" /> Under Review
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">
                        {new Date(w.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {w.status === 'paid' && w.payoutReference ? (
                          <span className="text-emerald-700 font-mono font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            UTR: {w.payoutReference}
                          </span>
                        ) : w.status === 'rejected' ? (
                          <span className="text-rose-600 text-xs font-medium">
                            {w.rejectionReason || 'Declined'}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FINANCIAL LEDGER TRANSACTIONS */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white border border-red-100/90 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 sm:p-6 border-b border-purple-50">
          <h2 className="text-base font-black text-[#162048] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>Financial Activity Ledger</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5 font-medium">
            Immutable log of all earnings, withdrawal reservations, and payout adjustments.
          </p>
        </div>

        {transactions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs font-medium">
            Zero transactions recorded yet. Share your product links to generate your first resale earnings!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-red-100 text-slate-400 uppercase font-extrabold text-[10px] bg-red-50/30">
                <tr>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-red-50/30 transition">
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                      {tx.id}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-red-50 font-mono text-[#dc2626] font-bold">
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-black text-sm">
                      <span className={tx.amount >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                        {tx.amount >= 0 ? `+₹${tx.amount}` : `-₹${Math.abs(tx.amount)}`}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-700 font-medium">
                      {tx.description}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-500 font-mono whitespace-nowrap">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: ADD / UPDATE UPI METHOD */}
      {/* ------------------------------------------------------------- */}
      {isMethodModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-red-100 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative text-[#162048]">
            <button
              onClick={() => setIsMethodModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#162048]">Save UPI Payout Method</h3>
                <p className="text-xs text-slate-500">Payouts will be sent directly to this UPI address</p>
              </div>
            </div>

            {methodError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{methodError}</span>
              </div>
            )}
            {methodSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{methodSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveUpiMethod} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  UPI ID / VPA <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. yourname@okaxis, 9876543210@paytm"
                  value={upiIdInput}
                  onChange={(e) => setUpiIdInput(e.target.value)}
                  className="w-full bg-slate-50 border border-red-100 rounded-xl px-4 py-2.5 text-sm text-[#162048] focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 font-mono font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Must be in valid <code>username@provider</code> format
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Account Holder / Recipient Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={holderNameInput}
                  onChange={(e) => setHolderNameInput(e.target.value)}
                  className="w-full bg-slate-50 border border-red-100 rounded-xl px-4 py-2.5 text-sm text-[#162048] focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Label (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Primary Bank UPI"
                  value={labelInput}
                  onChange={(e) => setLabelInput(e.target.value)}
                  className="w-full bg-slate-50 border border-red-100 rounded-xl px-4 py-2.5 text-sm text-[#162048] focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 font-medium"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSavingMethod}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 text-white font-black rounded-xl text-sm transition shadow-md shadow-emerald-500/20 active:scale-95"
                >
                  {isSavingMethod ? 'Saving Payout Method...' : 'Save UPI Method'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: REQUEST PAYOUT */}
      {/* ------------------------------------------------------------- */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-red-100 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative text-[#162048]">
            <button
              onClick={() => setIsWithdrawModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            {confirmedWithdrawal ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-[#162048]">Withdrawal Request Submitted!</h3>
                  <p className="text-xs text-slate-500">
                    Your request has been placed under review and dispatched to admin for instant processing.
                  </p>
                </div>

                <div className="bg-red-50/60 border border-red-100 rounded-2xl p-4 text-left space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reference ID:</span>
                    <span className="text-[#162048] font-bold">{confirmedWithdrawal.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reseller UID:</span>
                    <span className="text-amber-800 font-bold">{confirmedWithdrawal.resellerUid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Requested Amount:</span>
                    <span className="text-emerald-700 font-bold text-sm">₹{confirmedWithdrawal.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payout Method:</span>
                    <span className="text-[#162048]">{maskUpiId(confirmedWithdrawal.payoutDetails?.upiId || '')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className="text-amber-700 font-bold">Pending Review</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="w-full py-3.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold rounded-2xl text-sm transition shadow-md shadow-red-500/20 active:scale-95"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <ArrowUpRight className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#162048]">Request Payout</h3>
                    <p className="text-xs text-slate-500">Transfer available commission to your bank account via UPI</p>
                  </div>
                </div>

                {withdrawError && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{withdrawError}</span>
                  </div>
                )}

                {activePendingWithdrawal && (
                  <div className="mb-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold flex items-center gap-1.5 text-amber-800 text-xs">
                        <Clock className="w-4 h-4" />
                        Active Withdrawal Request
                      </div>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 font-bold uppercase">
                        {activePendingWithdrawal.status}
                      </span>
                    </div>

                    <div className="bg-white rounded-xl p-3 space-y-1.5 font-mono text-xs text-slate-700 border border-amber-100">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Request ID:</span>
                        <strong className="text-[#162048]">{activePendingWithdrawal.id}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Reserved Amount:</span>
                        <strong className="text-emerald-700">₹{activePendingWithdrawal.amount}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Payout UPI:</span>
                        <span className="text-slate-800">
                          {maskUpiId(activePendingWithdrawal.payoutDetails?.upiId || '')}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCancelPendingWithdrawal(activePendingWithdrawal.id)}
                      disabled={isCancellingWithdrawal}
                      className="w-full py-2.5 px-3 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50 active:scale-95 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isCancellingWithdrawal ? 'Cancelling Request...' : 'Cancel Request & Restore Balance'}</span>
                    </button>
                  </div>
                )}

                <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
                  <div className="bg-red-50/60 border border-red-100 rounded-2xl p-4 space-y-1">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available to Withdraw:</div>
                    <div className="text-3xl font-black text-emerald-600 tracking-tight">
                      ₹{wallet?.availableBalance?.toLocaleString('en-IN') || 0}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Minimum threshold: <strong>₹1</strong> • Instant notification dispatched
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Amount to Withdraw (₹)
                      </label>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Min ₹1 – Max ₹{wallet?.availableBalance || 0}
                      </span>
                    </div>
                    <input
                      type="number"
                      min={1}
                      max={wallet?.availableBalance || 1}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-red-100 rounded-xl px-4 py-2.5 text-lg font-black text-[#162048] focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 font-mono"
                    />

                    {/* Quick Amount Chips */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {[1, 10, 50, 100].filter((val) => val <= (wallet?.availableBalance || 0)).map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setAmount(val)}
                          className="px-3 py-1 text-xs rounded-lg bg-red-50 hover:bg-red-100 text-[#dc2626] font-bold font-mono transition"
                        >
                          ₹{val}
                        </button>
                      ))}
                      {(wallet?.availableBalance || 0) >= 1 && (
                        <button
                          type="button"
                          onClick={() => setAmount(wallet?.availableBalance || 1)}
                          className="px-3 py-1 text-xs rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-black transition font-mono"
                        >
                          All (₹{wallet?.availableBalance})
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Payout Destination
                    </label>
                    {payoutMethod?.upiId ? (
                      <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <div className="font-mono text-[#162048] font-bold">
                            {maskUpiId(payoutMethod.upiId)}
                          </div>
                          <div className="text-slate-400 text-[11px]">
                            {payoutMethod.accountHolderName} ({payoutMethod.label || 'UPI'})
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsWithdrawModalOpen(false);
                            setIsMethodModalOpen(true);
                          }}
                          className="text-xs text-[#dc2626] hover:underline font-bold"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#162048]">Enter Direct UPI ID</span>
                          <span className="text-[10px] text-emerald-600 font-bold">Direct Bank Transfer</span>
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-500 mb-1 font-medium">
                            UPI ID (VPA) <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. yourname@okaxis, 9876543210@paytm"
                            value={inlineUpiInput}
                            onChange={(e) => setInlineUpiInput(e.target.value)}
                            className="w-full bg-white border border-red-100 rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#162048] focus:outline-none focus:border-[#dc2626]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-500 mb-1 font-medium">
                            Account Holder Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Rahul Sharma"
                            value={inlineHolderInput}
                            onChange={(e) => setInlineHolderInput(e.target.value)}
                            className="w-full bg-white border border-red-100 rounded-xl px-3 py-2 text-xs font-medium text-[#162048] focus:outline-none focus:border-[#dc2626]"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        (wallet?.availableBalance || 0) < 1 ||
                        amount < 1 ||
                        amount > (wallet?.availableBalance || 0) ||
                        (!payoutMethod?.upiId && !inlineUpiInput.trim())
                      }
                      className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 text-white font-black rounded-2xl text-sm transition shadow-lg shadow-emerald-500/25 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isSubmitting
                        ? 'Reserving Balance & Notifying Admin...'
                        : (wallet?.availableBalance || 0) < 1
                        ? 'Insufficient Available Balance (Min ₹1)'
                        : `Confirm & Withdraw ₹${amount}`}
                    </button>

                    {(wallet?.availableBalance || 0) < 1 && (
                      <p className="text-[11px] text-amber-700 text-center mt-2 font-medium">
                        ⚠️ Available balance is ₹0. Make a sale via your reseller link to earn commissions and withdraw!
                      </p>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
