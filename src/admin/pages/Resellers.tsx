import React, { useState, useEffect } from 'react';
import {
  Users,
  Wallet,
  Clock,
  TrendingUp,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  XCircle,
  X,
  CreditCard,
  Copy,
  Check,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
  ShieldCheck,
  ArrowUpRight,
  Filter,
  DollarSign,
  Package,
  Layers,
} from 'lucide-react';

interface ResellerProfile {
  userId: string;
  resellerUid: string;
  displayName: string;
  email: string;
  phone?: string;
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
  payoutDetails?: {
    upiId?: string;
    accountHolderName?: string;
    label?: string;
  };
}

interface WalletAccount {
  availableBalance: number;
  pendingBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
}

interface WithdrawalRequest {
  id: string;
  resellerId: string;
  resellerUid?: string;
  resellerName: string;
  resellerEmail: string;
  amount: number;
  status: 'pending' | 'pending_review' | 'processing' | 'approved' | 'paid' | 'rejected' | 'cancelled';
  payoutMethod: string;
  payoutDetails?: {
    upiId?: string;
    accountHolderName?: string;
    label?: string;
  };
  payoutReference?: string;
  adminNotes?: string;
  rejectionReason?: string;
  createdAt: string;
  paidAt?: string;
}

interface ResellerListing {
  id: string;
  resellerId: string;
  resellerUid?: string;
  customTitle: string;
  basePrice: number;
  resalePrice: number;
  grossMargin: number;
  slug: string;
  status: 'active' | 'paused' | 'suspended';
  createdAt: string;
}

const STORE_API_BASE = '';

export default function Resellers() {
  const [activeTab, setActiveTab] = useState<'resellers' | 'withdrawals' | 'listings' | 'settings'>('withdrawals');
  const [resellers, setResellers] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [listings, setListings] = useState<ResellerListing[]>([]);
  const [settings, setSettings] = useState({
    enabled: true,
    min_markup: 50,
    max_price: 99999,
    settlement_policy: 'immediate',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [withdrawalFilter, setWithdrawalFilter] = useState<'all' | 'pending' | 'processing' | 'paid' | 'rejected'>('all');
  const [revealedUpiIds, setRevealedUpiIds] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Modals
  const [selectedReseller, setSelectedReseller] = useState<any | null>(null);
  const [payoutModalReq, setPayoutModalReq] = useState<WithdrawalRequest | null>(null);
  const [payoutRef, setPayoutRef] = useState('');
  const [payoutAdminNote, setPayoutAdminNote] = useState('');
  const [rejectModalReq, setRejectModalReq] = useState<WithdrawalRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const loadAll = async () => {
    setIsLoading(true);
    try {
      const [rRes, wRes, lRes, sRes] = await Promise.all([
        fetch(`${STORE_API_BASE}/api/admin/reseller/resellers`).then((r) => r.json()).catch(() => ({ success: false })),
        fetch(`${STORE_API_BASE}/api/admin/reseller/withdrawals`).then((r) => r.json()).catch(() => ({ success: false })),
        fetch(`${STORE_API_BASE}/api/admin/reseller/listings`).then((r) => r.json()).catch(() => ({ success: false })),
        fetch(`${STORE_API_BASE}/api/admin/reseller/settings`).then((r) => r.json()).catch(() => ({ success: false })),
      ]);

      if (rRes.success) setResellers(rRes.resellers || []);
      if (wRes.success) setWithdrawals(wRes.withdrawals || []);
      if (lRes.success) setListings(lRes.listings || []);
      if (sRes.success) setSettings(sRes.settings || {});
    } catch (e) {
      console.warn('Error loading reseller data in admin portal:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleCopy = (text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleQuickStatus = async (withdrawalId: string, status: 'approved' | 'processing') => {
    setProcessingId(withdrawalId);
    try {
      const res = await fetch(`${STORE_API_BASE}/api/admin/reseller/withdrawals`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          withdrawalId,
          status,
          adminNotes: status === 'approved' ? 'Approved by Admin' : 'Processing manual UPI transfer',
        }),
      });
      const data = await res.json();
      if (data.success) {
        await loadAll();
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch {
      alert('Network error while updating status');
    } finally {
      setProcessingId(null);
    }
  };

  const handleMarkPaid = async () => {
    if (!payoutModalReq) return;
    if (!payoutRef.trim()) {
      alert('Bank Reference / UTR Number is required to confirm payment.');
      return;
    }
    setProcessingId(payoutModalReq.id);
    try {
      const res = await fetch(`${STORE_API_BASE}/api/admin/reseller/withdrawals`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          withdrawalId: payoutModalReq.id,
          status: 'paid',
          payoutReference: payoutRef.trim(),
          adminNotes: payoutAdminNote.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPayoutModalReq(null);
        setPayoutRef('');
        setPayoutAdminNote('');
        await loadAll();
      } else {
        alert(data.error || 'Failed to record payment');
      }
    } catch {
      alert('Network error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectPayout = async () => {
    if (!rejectModalReq) return;
    if (!rejectReason.trim()) {
      alert('Rejection reason is required.');
      return;
    }
    setProcessingId(rejectModalReq.id);
    try {
      const res = await fetch(`${STORE_API_BASE}/api/admin/reseller/withdrawals`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          withdrawalId: rejectModalReq.id,
          status: 'rejected',
          rejectionReason: rejectReason.trim(),
          adminNotes: rejectReason.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRejectModalReq(null);
        setRejectReason('');
        await loadAll();
      } else {
        alert(data.error || 'Failed to reject payout');
      }
    } catch {
      alert('Network error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteWithdrawal = async (id: string) => {
    if (!confirm(`Are you sure you want to permanently delete withdrawal #${id}? This will remove it from the system and Telegram Bot.`)) {
      return;
    }
    setProcessingId(id);
    try {
      const res = await fetch(`${STORE_API_BASE}/api/admin/reseller/withdrawals?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        await loadAll();
      } else {
        alert(data.error || 'Failed to delete withdrawal');
      }
    } catch {
      alert('Network error while deleting withdrawal');
    } finally {
      setProcessingId(null);
    }
  };

  // KPI Calculations
  const totalResellersCount = resellers.length;
  const pendingWithdrawalsList = withdrawals.filter((w) =>
    ['pending', 'pending_review', 'processing', 'approved'].includes(w.status)
  );
  const pendingWithdrawalsAmount = pendingWithdrawalsList.reduce((sum, w) => sum + (w.amount || 0), 0);
  const totalWalletLiabilities = resellers.reduce((sum, r) => sum + (r.wallet?.availableBalance || 0), 0);
  const totalLifetimeEarned = resellers.reduce((sum, r) => sum + (r.resellerEarnings || r.wallet?.totalEarned || 0), 0);

  // Filtered lists
  const filteredResellers = resellers.filter((r) => {
    const q = searchQuery.toLowerCase();
    const name = String(r.profile?.displayName || '').toLowerCase();
    const email = String(r.profile?.email || '').toLowerCase();
    const uid = String(r.profile?.resellerUid || '').toLowerCase();
    return name.includes(q) || email.includes(q) || uid.includes(q);
  });

  const filteredWithdrawals = withdrawals.filter((w) => {
    if (withdrawalFilter === 'pending') {
      return ['pending', 'pending_review', 'approved'].includes(w.status);
    }
    if (withdrawalFilter === 'processing') {
      return w.status === 'processing';
    }
    if (withdrawalFilter === 'paid') {
      return w.status === 'paid';
    }
    if (withdrawalFilter === 'rejected') {
      return w.status === 'rejected' || w.status === 'cancelled';
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-purple-400" />
            <span>Resellers &amp; Payouts Command Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage registered partners, approve &amp; process manual UPI payouts, monitor ledger margins, and audit platform settings.
          </p>
        </div>

        <button
          onClick={loadAll}
          disabled={isLoading}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-xl text-xs font-bold flex items-center gap-2 transition disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-purple-400' : ''}`} />
          <span>Sync Data</span>
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Registered Partners</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {totalResellersCount}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Active storefront resellers</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-amber-500/20 bg-gradient-to-br from-amber-950/20 to-slate-900 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Pending Payout Requests</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
            ₹{pendingWithdrawalsAmount.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            {pendingWithdrawalsList.length} request{pendingWithdrawalsList.length === 1 ? '' : 's'} awaiting review
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Available Wallet Liabilities</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            ₹{totalWalletLiabilities.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Total ready to withdraw across wallets</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Lifetime Partner Profit</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
            ₹{totalLifetimeEarned.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">100% credited from verified product sales</div>
        </div>
      </div>

      {/* Tabs Navigation - Mobile Touch Optimized */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-2 admin-touch-scroll admin-no-scrollbar -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === 'withdrawals'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Payouts &amp; Withdrawals</span>
          {pendingWithdrawalsList.length > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-full text-[10px] font-bold">
              {pendingWithdrawalsList.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('resellers')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === 'resellers'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>All Resellers ({resellers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === 'listings'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Custom Listings ({listings.length})</span>
        </button>
      </div>

      {/* TAB 1: WITHDRAWALS & PAYOUTS */}
      {activeTab === 'withdrawals' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {(['all', 'pending', 'processing', 'paid', 'rejected'] as const).map((filterKey) => (
                <button
                  key={filterKey}
                  onClick={() => setWithdrawalFilter(filterKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                    withdrawalFilter === filterKey
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {filterKey}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-400">
              Showing <strong>{filteredWithdrawals.length}</strong> withdrawal request{filteredWithdrawals.length === 1 ? '' : 's'}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {filteredWithdrawals.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <Clock className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-slate-400">No withdrawal requests found</p>
                <p className="text-xs text-slate-500">Payout requests submitted by resellers will appear here in real-time.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/60 text-slate-400 font-bold uppercase border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Request ID</th>
                      <th className="py-3 px-4">Reseller</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Destination (UPI)</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredWithdrawals.map((w) => {
                      const fullUpi = w.payoutDetails?.upiId || 'N/A';
                      const isRevealed = revealedUpiIds[w.id];
                      const displayUpi = isRevealed ? fullUpi : (fullUpi.length > 6 ? `${fullUpi.slice(0, 3)}••••@${fullUpi.split('@')[1] || 'upi'}` : fullUpi);

                      return (
                        <tr key={w.id} className="hover:bg-slate-800/30 transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-white">
                            {w.id}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-200">{w.resellerName}</div>
                            <div className="text-[11px] text-amber-400 font-mono">{w.resellerUid || 'RSL-PARTNER'}</div>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-emerald-400 text-sm font-mono">
                            ₹{w.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 font-mono text-slate-200">
                              <span>{displayUpi}</span>
                              {fullUpi !== 'N/A' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setRevealedUpiIds((prev) => ({ ...prev, [w.id]: !prev[w.id] }))
                                    }
                                    className="p-1 hover:text-white text-slate-400"
                                    title={isRevealed ? 'Mask UPI' : 'Reveal UPI'}
                                  >
                                    {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(fullUpi, `upi-${w.id}`)}
                                    className="p-1 hover:text-white text-slate-400"
                                    title="Copy UPI ID"
                                  >
                                    {copiedKey === `upi-${w.id}` ? (
                                      <Check className="w-3 h-3 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                </>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Recipient: {w.payoutDetails?.accountHolderName || w.resellerName}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                w.status === 'paid'
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                  : w.status === 'processing'
                                  ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                                  : w.status === 'approved'
                                  ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                                  : w.status === 'rejected' || w.status === 'cancelled'
                                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse'
                              }`}
                            >
                              {w.status}
                            </span>
                            {w.payoutReference && (
                              <div className="text-[10px] font-mono text-slate-400 mt-1">
                                Ref: {w.payoutReference}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                            {new Date(w.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {w.status !== 'paid' && (
                                <>
                                  <button
                                    onClick={() => {
                                      setPayoutModalReq(w);
                                      setPayoutRef('');
                                      setPayoutAdminNote('');
                                    }}
                                    disabled={processingId === w.id}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition shadow-sm"
                                    title="Confirm transfer & mark paid"
                                  >
                                    Mark Paid
                                  </button>

                                  {w.status !== 'processing' && (
                                    <button
                                      onClick={() => handleQuickStatus(w.id, 'processing')}
                                      disabled={processingId === w.id}
                                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 font-semibold text-[11px] transition border border-slate-700"
                                    >
                                      Processing
                                    </button>
                                  )}

                                  <button
                                    onClick={() => {
                                      setRejectModalReq(w);
                                      setRejectReason('');
                                    }}
                                    disabled={processingId === w.id}
                                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-rose-400 font-semibold text-[11px] transition border border-slate-700"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}

                              {/* Delete button: removes test / unwanted withdrawals */}
                              <button
                                onClick={() => handleDeleteWithdrawal(w.id)}
                                disabled={processingId === w.id}
                                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                                title="Permanently delete withdrawal request"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ALL REGISTERED RESELLERS */}
      {activeTab === 'resellers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search by name, email, or UID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="text-xs text-slate-400">
              Showing <strong>{filteredResellers.length}</strong> registered partner{filteredResellers.length === 1 ? '' : 's'}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {filteredResellers.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <Users className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-slate-400">No matching resellers</p>
                <p className="text-xs text-slate-500">Resellers register directly from the store at /earn/signup</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/60 text-slate-400 font-bold uppercase border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Partner UID</th>
                      <th className="py-3 px-4">Name &amp; Contact</th>
                      <th className="py-3 px-4">Wallet Balance</th>
                      <th className="py-3 px-4">Lifetime Earned</th>
                      <th className="py-3 px-4">Verified Sales</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Registered Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredResellers.map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                          {r.profile?.resellerUid}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{r.profile?.displayName || 'Reseller'}</div>
                          <div className="text-[11px] text-slate-400">{r.profile?.email}</div>
                          {r.profile?.phone && (
                            <div className="text-[11px] text-slate-500">{r.profile.phone}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-emerald-400 font-mono text-sm">
                          ₹{(r.wallet?.availableBalance || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white font-mono">
                          ₹{(r.resellerEarnings || r.wallet?.totalEarned || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-300 font-mono">
                          {r.totalOrders || 0} order{(r.totalOrders || 0) === 1 ? '' : 's'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              r.profile?.status === 'active'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {r.profile?.status || 'active'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                          {new Date(r.profile?.createdAt || Date.now()).toLocaleDateString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedReseller(r)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-400 hover:text-purple-300 text-xs font-bold transition border border-slate-700"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOM LISTINGS */}
      {activeTab === 'listings' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {listings.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Package className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-400">No custom listings yet</p>
              <p className="text-xs text-slate-500">Products customized by resellers will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400 font-bold uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Listing Title</th>
                    <th className="py-3 px-4">Partner UID</th>
                    <th className="py-3 px-4">Wholesale Base</th>
                    <th className="py-3 px-4">Resale Price</th>
                    <th className="py-3 px-4">Reseller Margin</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Storefront Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {listings.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3.5 px-4 font-bold text-white max-w-xs truncate">
                        {l.customTitle}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-amber-400">
                        {l.resellerUid || 'RSL-PARTNER'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        ₹{l.basePrice}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        ₹{l.resalePrice}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        +₹{l.grossMargin}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {l.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <a
                          href={`/r/${l.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-400 text-xs font-bold transition border border-slate-700"
                        >
                          <span>Open /r/{l.slug}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: MARK PAID CONFIRMATION */}
      {payoutModalReq && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setPayoutModalReq(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Confirm UPI Transfer</h3>
                <p className="text-xs text-slate-400">Mark payout #{payoutModalReq.id} as settled</p>
              </div>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Recipient:</span>
                <span className="text-white font-bold">{payoutModalReq.resellerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount to Transfer:</span>
                <span className="text-emerald-400 font-bold text-sm">₹{payoutModalReq.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">UPI ID:</span>
                <span className="text-amber-400 font-bold">{payoutModalReq.payoutDetails?.upiId || 'N/A'}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Bank UTR / Transaction Reference <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. UPI/123456789012 or IMPS-987654"
                value={payoutRef}
                onChange={(e) => setPayoutRef(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Admin Note (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Paid via Paytm UPI business"
                value={payoutAdminNote}
                onChange={(e) => setPayoutAdminNote(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPayoutModalReq(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleMarkPaid}
                disabled={processingId === payoutModalReq.id || !payoutRef.trim()}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs transition shadow-lg shadow-emerald-600/20"
              >
                {processingId === payoutModalReq.id ? 'Saving...' : 'Confirm Paid'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: REJECT WITHDRAWAL */}
      {rejectModalReq && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setRejectModalReq(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Reject Withdrawal Request</h3>
                <p className="text-xs text-slate-400">Amount will be returned to reseller available balance</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Reason for Rejection <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Invalid UPI ID provided, please update UPI VPA in wallet settings and re-request."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalReq(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectPayout}
                disabled={processingId === rejectModalReq.id || !rejectReason.trim()}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs transition"
              >
                {processingId === rejectModalReq.id ? 'Rejecting...' : 'Reject & Return Funds'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: RESELLER DETAIL */}
      {selectedReseller && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedReseller(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                {selectedReseller.profile?.resellerUid}
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                {selectedReseller.profile?.displayName}
              </h3>
              <p className="text-xs text-slate-400">{selectedReseller.profile?.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-800/60 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Available Balance</span>
                <strong className="text-emerald-400 text-sm">
                  ₹{(selectedReseller.wallet?.availableBalance || 0).toLocaleString('en-IN')}
                </strong>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Lifetime Earned</span>
                <strong className="text-white text-sm">
                  ₹{(selectedReseller.resellerEarnings || 0).toLocaleString('en-IN')}
                </strong>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Total Transferred</span>
                <strong className="text-sky-400 text-sm">
                  ₹{(selectedReseller.wallet?.totalWithdrawn || 0).toLocaleString('en-IN')}
                </strong>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Verified Sales</span>
                <strong className="text-purple-400 text-sm">
                  {selectedReseller.totalOrders || 0} orders
                </strong>
              </div>
            </div>

            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60 space-y-1 text-xs">
              <div className="font-bold text-white flex items-center justify-between">
                <span>Payout UPI Details</span>
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="font-mono text-slate-200">
                UPI ID: <strong>{selectedReseller.profile?.payoutDetails?.upiId || 'No UPI saved yet'}</strong>
              </div>
              <div className="text-slate-400 text-[11px]">
                Holder: {selectedReseller.profile?.payoutDetails?.accountHolderName || selectedReseller.profile?.displayName}
              </div>
            </div>

            <button
              onClick={() => setSelectedReseller(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
