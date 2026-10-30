'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ArrowUpRight,
  Package,
  Wallet,
  Users,
  Search,
  RefreshCw,
  ExternalLink,
  Download,
  Eye,
  EyeOff,
  X,
  FileSpreadsheet,
  ArrowUpDown,
  Filter,
  Trash2,
  ArrowLeft,
} from 'lucide-react';
import { ResellerListing, WithdrawalRequest, ResellerFullAnalytics } from '@/types/reseller';
import { maskUpiId } from '@/lib/resellerService';

export default function AdminResellersManagementPage() {
  const [activeTab, setActiveTab] = useState<'resellers' | 'withdrawals' | 'listings' | 'settings'>('resellers');
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

  // Search & Filter state for Resellers
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [sortBy, setSortBy] = useState<'earnings' | 'sales' | 'revenue' | 'date'>('earnings');

  // Reseller deep dive modal
  const [selectedResellerUid, setSelectedResellerUid] = useState<string | null>(null);
  const [resellerDetail, setResellerDetail] = useState<ResellerFullAnalytics | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Payout confirmation modal state
  const [payoutModalReq, setPayoutModalReq] = useState<WithdrawalRequest | null>(null);
  const [payoutRef, setPayoutRef] = useState('');
  const [payoutAdminNote, setPayoutAdminNote] = useState('');
  const [rejectModalReq, setRejectModalReq] = useState<WithdrawalRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [revealedUpiIds, setRevealedUpiIds] = useState<Record<string, boolean>>({});
  const [withdrawalFilter, setWithdrawalFilter] = useState<'all' | 'pending' | 'processing' | 'approved' | 'paid' | 'rejected'>('all');

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setIsLoading(true);
    try {
      const [rRes, wRes, lRes, sRes] = await Promise.all([
        fetch('/api/admin/reseller/resellers').then((r) => r.json()),
        fetch('/api/admin/reseller/withdrawals').then((r) => r.json()),
        fetch('/api/admin/reseller/listings').then((r) => r.json()),
        fetch('/api/admin/reseller/settings').then((r) => r.json()),
      ]);

      if (rRes.success) setResellers(rRes.resellers || []);
      if (wRes.success) setWithdrawals(wRes.withdrawals || []);
      if (lRes.success) setListings(lRes.listings || []);
      if (sRes.success) setSettings(sRes.settings || {});
    } catch (e) {
      console.warn('Error loading admin reseller data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const openResellerDetail = async (uid: string) => {
    setSelectedResellerUid(uid);
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/admin/reseller/resellers?uid=${encodeURIComponent(uid)}`);
      const data = await res.json();
      if (data.success) {
        setResellerDetail(data.reseller);
      }
    } catch (e) {
      console.warn('Error fetching reseller detail:', e);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleQuickStatus = async (withdrawalId: string, status: 'approved' | 'processing') => {
    setProcessingId(withdrawalId);
    try {
      const res = await fetch('/api/admin/reseller/withdrawals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          withdrawalId,
          status,
          adminNotes: status === 'approved' ? 'Approved by Admin — Awaiting UPI Transfer' : 'Processing manual UPI transfer',
        }),
      });
      const data = await res.json();
      if (data.success) {
        await loadAll();
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (e) {
      console.warn('Error updating status:', e);
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
      const res = await fetch('/api/admin/reseller/withdrawals', {
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
    } catch (e) {
      console.warn('Error marking paid:', e);
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
      const res = await fetch('/api/admin/reseller/withdrawals', {
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
        alert(data.error || 'Failed to reject request');
      }
    } catch (e) {
      console.warn('Error rejecting payout:', e);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteWithdrawal = async (id: string) => {
    if (!confirm(`Are you sure you want to permanently delete withdrawal #${id}? This will remove it from the Admin Panel and Telegram Bot.`)) {
      return;
    }
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/reseller/withdrawals?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        await loadAll();
      } else {
        alert(data.error || 'Failed to delete withdrawal');
      }
    } catch (e) {
      console.warn('Error deleting withdrawal:', e);
      alert('Network error while deleting withdrawal');
    } finally {
      setProcessingId(null);
    }
  };

  const toggleListingStatus = async (listingId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'paused' : 'active';
    setProcessingId(listingId);
    try {
      const res = await fetch('/api/admin/reseller/listings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, status: nextStatus }),
      });
      if (res.ok) {
        await loadAll();
      }
    } catch (e) {
      console.warn('Error toggling listing:', e);
    } finally {
      setProcessingId(null);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessingId('settings');
    try {
      await fetch('/api/admin/reseller/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      alert('Reseller global settings saved successfully.');
    } catch (e) {
      console.warn('Error saving settings:', e);
    } finally {
      setProcessingId(null);
    }
  };

  const toggleRevealUpi = (id: string) => {
    setRevealedUpiIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Export Reseller Directory to CSV
  const exportToCsv = () => {
    const headers = [
      'Reseller UID',
      'Name',
      'Email',
      'Status',
      'Registered At',
      'Verified Orders',
      'Units Sold',
      'Gross Sales (INR)',
      'Net Sales (INR)',
      'Total Earnings (INR)',
      'Available Balance (INR)',
      'Total Withdrawn (INR)',
    ];

    const rows = resellers.map((r) => [
      r.profile.resellerUid || '',
      `"${r.profile.displayName || ''}"`,
      r.profile.email || '',
      r.profile.status || '',
      r.profile.createdAt ? new Date(r.profile.createdAt).toLocaleDateString('en-IN') : '',
      r.totalOrders || 0,
      r.unitsSold || 0,
      r.grossSales || 0,
      r.netSales || 0,
      r.resellerEarnings || 0,
      r.wallet.availableBalance || 0,
      r.wallet.totalWithdrawn || 0,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ztore_resellers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered & Sorted Resellers
  const filteredResellers = resellers
    .filter((r) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        r.profile.resellerUid?.toLowerCase().includes(q) ||
        r.profile.displayName?.toLowerCase().includes(q) ||
        r.profile.email?.toLowerCase().includes(q);

      const matchStatus = statusFilter === 'all' || r.profile.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'earnings') return b.resellerEarnings - a.resellerEarnings;
      if (sortBy === 'sales') return b.totalOrders - a.totalOrders;
      if (sortBy === 'revenue') return b.grossSales - a.grossSales;
      return new Date(b.profile.createdAt).getTime() - new Date(a.profile.createdAt).getTime();
    });

  const pendingWithdrawalsCount = withdrawals.filter(
    (w) => w.status === 'pending' || w.status === 'pending_review'
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Admin Control Center
              </span>
              <span className="text-xs text-slate-500">Reseller Management & Payouts</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mt-1">
              Resell & Earn Ecosystem
            </h1>
          </div>
          <div className="flex items-center flex-wrap gap-3">
            <Link
              href="/admin"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-1.5 transition hover:text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
            <button
              onClick={loadAll}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 flex items-center gap-2 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
            <Link
              href="/earn/dashboard"
              target="_blank"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Reseller View
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('resellers')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition ${
              activeTab === 'resellers'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            Resellers Directory ({resellers.length})
          </button>
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition relative ${
              activeTab === 'withdrawals'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Wallet className="w-4 h-4" />
            Withdrawal Queue
            {pendingWithdrawalsCount > 0 && (
              <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs font-black bg-rose-500 text-white">
                {pendingWithdrawalsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition ${
              activeTab === 'listings'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            Product Listings ({listings.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition ${
              activeTab === 'settings'
                ? 'bg-purple-500 text-slate-950 shadow-lg shadow-purple-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Global Rules
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: RESELLER DIRECTORY & PRODUCT ANALYTICS */}
        {/* ========================================================================= */}
        {activeTab === 'resellers' && (
          <div className="space-y-6">
            {/* Search, Filter & Export Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by Reseller UID (RSL-XXXX), name, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active Only</option>
                  <option value="suspended">Suspended Only</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
                >
                  <option value="earnings">Sort by Net Earnings</option>
                  <option value="sales">Sort by Verified Orders</option>
                  <option value="revenue">Sort by Gross Revenue</option>
                  <option value="date">Sort by Joined Date</option>
                </select>

                <button
                  onClick={exportToCsv}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Reseller Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              {filteredResellers.length === 0 ? (
                <div className="py-16 text-center text-slate-500 text-sm">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                  No resellers match your search criteria.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-800/60 text-xs text-slate-400 uppercase font-semibold">
                      <tr>
                        <th className="py-3 px-6">Reseller UID</th>
                        <th className="py-3 px-6">Reseller</th>
                        <th className="py-3 px-6">Status</th>
                        <th className="py-3 px-6">Verified Sales</th>
                        <th className="py-3 px-6">Gross Sales</th>
                        <th className="py-3 px-6">Reseller Margin</th>
                        <th className="py-3 px-6">Wallet Available</th>
                        <th className="py-3 px-6">Withdrawn</th>
                        <th className="py-3 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredResellers.map((r) => (
                        <tr key={r.profile.userId} className="hover:bg-slate-800/40 transition">
                          <td className="py-4 px-6 font-mono text-xs font-bold text-amber-400">
                            {r.profile.resellerUid || 'RSL-USER'}
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-semibold text-white">{r.profile.displayName}</div>
                            <div className="text-xs text-slate-500">{r.profile.email}</div>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                r.profile.status === 'active'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              }`}
                            >
                              {r.profile.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-mono text-xs text-white">
                            <strong>{r.totalOrders}</strong> orders ({r.unitsSold} units)
                          </td>
                          <td className="py-4 px-6 font-bold text-white">
                            ₹{r.grossSales.toLocaleString('en-IN')}
                          </td>
                          <td className="py-4 px-6 font-bold text-emerald-400">
                            ₹{r.resellerEarnings.toLocaleString('en-IN')}
                          </td>
                          <td className="py-4 px-6 font-mono text-xs text-cyan-400">
                            ₹{r.wallet.availableBalance.toLocaleString('en-IN')}
                          </td>
                          <td className="py-4 px-6 font-mono text-xs text-slate-400">
                            ₹{r.wallet.totalWithdrawn.toLocaleString('en-IN')}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => openResellerDetail(r.profile.resellerUid)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs font-semibold border border-slate-700 transition"
                            >
                              Inspect / Analytics
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

        {/* ========================================================================= */}
        {/* TAB 2: WITHDRAWAL MANAGEMENT QUEUE */}
        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* TAB 2: WITHDRAWAL MANAGEMENT QUEUE (Manual Approval Workflow) */}
        {/* ========================================================================= */}
        {activeTab === 'withdrawals' && (() => {
          const pendingCount = withdrawals.filter((w) => w.status === 'pending' || w.status === 'pending_review').length;
          const processingCount = withdrawals.filter((w) => w.status === 'processing').length;
          const approvedCount = withdrawals.filter((w) => w.status === 'approved').length;
          const paidCount = withdrawals.filter((w) => w.status === 'paid').length;
          const rejectedCount = withdrawals.filter((w) => w.status === 'rejected').length;

          const displayedWithdrawals = withdrawals.filter((w) => {
            if (withdrawalFilter === 'all') return true;
            if (withdrawalFilter === 'pending') return w.status === 'pending' || w.status === 'pending_review';
            return w.status === withdrawalFilter;
          });

          return (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden space-y-0">
              <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-emerald-400" />
                    Manual Reseller Withdrawal Queue
                  </h2>
                  <p className="text-slate-400 text-xs mt-0.5">
                    No automatic payouts. Verify reseller sales, check risk metrics, transfer via UPI manually, and mark as Paid with Bank UTR.
                  </p>
                </div>

                <button
                  onClick={loadAll}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition self-start md:self-auto border border-slate-700"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refresh Queue
                </button>
              </div>

              {/* Status Filter Tab Pills */}
              <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center gap-2">
                {[
                  { key: 'all', label: 'All Requests', count: withdrawals.length },
                  { key: 'pending', label: 'Pending Review', count: pendingCount, color: 'text-amber-400' },
                  { key: 'processing', label: 'Processing', count: processingCount, color: 'text-purple-400' },
                  { key: 'approved', label: 'Approved (Awaiting UPI)', count: approvedCount, color: 'text-cyan-400' },
                  { key: 'paid', label: 'Paid & Settled', count: paidCount, color: 'text-emerald-400' },
                  { key: 'rejected', label: 'Rejected (Refunded)', count: rejectedCount, color: 'text-rose-400' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setWithdrawalFilter(tab.key as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 border ${
                      withdrawalFilter === tab.key
                        ? 'bg-slate-800 text-white border-slate-600 shadow-sm'
                        : 'bg-slate-900/40 text-slate-400 border-slate-800/80 hover:bg-slate-800/50 hover:text-slate-300'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-slate-950/80 border border-slate-800 ${tab.color || 'text-slate-400'}`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {displayedWithdrawals.length === 0 ? (
                <div className="py-16 text-center text-slate-500 text-sm">
                  Zero withdrawal requests matching filter &quot;{withdrawalFilter}&quot;.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-800/50 text-xs text-slate-400 uppercase font-semibold">
                      <tr>
                        <th className="py-3 px-6">Request ID</th>
                        <th className="py-3 px-6">Reseller UID</th>
                        <th className="py-3 px-6">Reseller Info</th>
                        <th className="py-3 px-6">Amount</th>
                        <th className="py-3 px-6">UPI Details</th>
                        <th className="py-3 px-6">Status</th>
                        <th className="py-3 px-6">Requested</th>
                        <th className="py-3 px-6 text-right">Verification &amp; Payout Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {displayedWithdrawals.map((w) => {
                        const isRevealed = Boolean(revealedUpiIds[w.id]);
                        const fullUpi = w.payoutDetails?.upiId || 'N/A';
                        const maskedUpi = maskUpiId(fullUpi);
                        const isActionable = ['pending', 'pending_review', 'processing', 'approved'].includes(w.status);

                        return (
                          <tr key={w.id} className="hover:bg-slate-800/30 transition">
                            <td className="py-4 px-6 font-mono text-xs font-bold text-white">
                              {w.id}
                            </td>
                            <td className="py-4 px-6 font-mono text-xs text-amber-400">
                              <button
                                onClick={() => openResellerDetail(w.resellerUid)}
                                className="hover:underline flex items-center gap-1 font-bold"
                                title="Inspect reseller profile & performance"
                              >
                                {w.resellerUid}
                                <ExternalLink className="w-3 h-3 text-slate-500" />
                              </button>
                            </td>
                            <td className="py-4 px-6">
                              <div className="font-semibold text-white">{w.resellerName}</div>
                              <div className="text-xs text-slate-500">{w.resellerEmail}</div>
                              {w.verifiedSalesCountSnapshot !== undefined && (
                                <div className="text-[11px] text-slate-400 mt-0.5">
                                  Sales: <strong>{w.verifiedSalesCountSnapshot} orders</strong> ({w.unitsSoldSnapshot || w.verifiedSalesCountSnapshot} units)
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-6 font-bold text-emerald-400 font-mono text-base">
                              ₹{w.amount.toLocaleString('en-IN')}
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs text-white">
                                  {isRevealed ? fullUpi : maskedUpi}
                                </span>
                                <button
                                  onClick={() => toggleRevealUpi(w.id)}
                                  className="text-slate-500 hover:text-slate-300 p-0.5"
                                  title={isRevealed ? 'Hide full UPI' : 'Reveal full UPI'}
                                >
                                  {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                Recipient: {w.payoutDetails?.accountHolderName || w.resellerName}
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              {w.status === 'paid' ? (
                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Paid
                                </span>
                              ) : w.status === 'approved' ? (
                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 inline-flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3" /> Approved
                                </span>
                              ) : w.status === 'processing' ? (
                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 inline-flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> Processing
                                </span>
                              ) : w.status === 'rejected' ? (
                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 inline-flex items-center gap-1">
                                  <XCircle className="w-3 h-3" /> Rejected
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> Pending Review
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-6 text-xs text-slate-400">
                              {new Date(w.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </td>
                            <td className="py-4 px-6 text-right">
                              {isActionable ? (
                                <div className="flex items-center justify-end flex-wrap gap-1.5">
                                  {(w.status === 'pending' || w.status === 'pending_review') && (
                                    <button
                                      onClick={() => handleQuickStatus(w.id, 'approved')}
                                      disabled={processingId === w.id}
                                      className="px-2.5 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-lg text-xs font-semibold transition"
                                      title="Mark as Approved to signify request verification before manual payout"
                                    >
                                      Approve
                                    </button>
                                  )}
                                  {w.status !== 'processing' && (
                                    <button
                                      onClick={() => handleQuickStatus(w.id, 'processing')}
                                      disabled={processingId === w.id}
                                      className="px-2.5 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-lg text-xs font-semibold transition"
                                      title="Mark Processing while you execute manual transfer"
                                    >
                                      Processing
                                    </button>
                                  )}
                                  <button
                                    onClick={() => setPayoutModalReq(w)}
                                    disabled={processingId === w.id}
                                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg text-xs transition shadow-sm"
                                    title="Open modal to enter UPI UTR/bank reference and mark as Paid"
                                  >
                                    Mark Paid
                                  </button>
                                  <button
                                    onClick={() => setRejectModalReq(w)}
                                    disabled={processingId === w.id}
                                    className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-lg text-xs font-semibold transition"
                                    title="Reject request and refund reserved balance to reseller"
                                  >
                                    Reject
                                  </button>
                                  <button
                                    onClick={() => handleDeleteWithdrawal(w.id)}
                                    disabled={processingId === w.id}
                                    className="p-1.5 bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 border border-slate-700/80 rounded-lg text-xs transition ml-1"
                                    title="Permanently delete withdrawal request"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : w.status === 'paid' ? (
                                <div className="flex items-center justify-end gap-3 text-right">
                                  <div>
                                    <div className="font-mono text-xs text-emerald-400 font-bold">
                                      UTR: {w.payoutReference || 'Settled'}
                                    </div>
                                    {w.adminNotes && (
                                      <div className="text-[11px] text-slate-500 italic mt-0.5">
                                        {w.adminNotes}
                                      </div>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => handleDeleteWithdrawal(w.id)}
                                    disabled={processingId === w.id}
                                    className="p-1.5 bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 border border-slate-700/80 rounded-lg text-xs transition"
                                    title="Permanently delete withdrawal record"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-end gap-3 text-right">
                                  <div>
                                    <div className="text-xs text-rose-400 font-medium">
                                      {w.rejectionReason || w.adminNotes || 'Declined by admin'}
                                    </div>
                                    <div className="text-[10px] text-slate-500 mt-0.5">
                                      Balance refunded to reseller
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteWithdrawal(w.id)}
                                    disabled={processingId === w.id}
                                    className="p-1.5 bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 border border-slate-700/80 rounded-lg text-xs transition"
                                    title="Permanently delete withdrawal record"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
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
          );
        })()}

        {/* ========================================================================= */}
        {/* TAB 3: PRODUCT LISTINGS MODERATION */}
        {/* ========================================================================= */}
        {activeTab === 'listings' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-cyan-400" />
                Reseller Custom Listings
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">
                Audit customized product descriptions, resale prices, and pause suspicious listings.
              </p>
            </div>

            {listings.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-sm">
                Zero reseller listings created yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-800/50 text-xs text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="py-3 px-6">Product Title</th>
                      <th className="py-3 px-6">Reseller UID</th>
                      <th className="py-3 px-6">Base Price</th>
                      <th className="py-3 px-6">Resale Price</th>
                      <th className="py-3 px-6">Margin</th>
                      <th className="py-3 px-6">Sales</th>
                      <th className="py-3 px-6">Status</th>
                      <th className="py-3 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {listings.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-4 px-6">
                          <div className="font-semibold text-white">{l.customTitle}</div>
                          <div className="text-xs text-slate-500 font-mono">/r/{l.slug}</div>
                        </td>
                        <td className="py-4 px-6 font-mono text-xs text-amber-400">
                          {l.resellerUid || 'RSL-USER'}
                        </td>
                        <td className="py-4 px-6 font-mono text-xs text-slate-400">
                          ₹{l.basePrice}
                        </td>
                        <td className="py-4 px-6 font-bold text-white">
                          ₹{l.resalePrice}
                        </td>
                        <td className="py-4 px-6 font-bold text-emerald-400">
                          +₹{l.grossMargin}
                        </td>
                        <td className="py-4 px-6 font-mono text-xs text-slate-300">
                          {l.salesCount || 0}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              l.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {l.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/r/${l.slug}`}
                              target="_blank"
                              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                              title="Inspect Landing Page"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => toggleListingStatus(l.id, l.status)}
                              disabled={processingId === l.id}
                              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                                l.status === 'active'
                                  ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                                  : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                              }`}
                            >
                              {l.status === 'active' ? 'Pause' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: GLOBAL SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
              Reseller Program Rules & Safeguards
            </h2>
            <p className="text-slate-400 text-xs mb-6">
              Configure global price boundaries, commission limits, and program participation.
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-5">
              <div className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-slate-700/60">
                <div>
                  <div className="text-sm font-semibold text-white">Enable Resell & Earn Feature</div>
                  <div className="text-xs text-slate-400">Allow visitors to register as resellers and create custom links</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                  className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Minimum Required Markup (₹)
                </label>
                <input
                  type="number"
                  min={1}
                  value={settings.min_markup}
                  onChange={(e) => setSettings({ ...settings, min_markup: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Resellers cannot set resale price below base price + this markup.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Maximum Allowable Resale Price (₹)
                </label>
                <input
                  type="number"
                  min={100}
                  value={settings.max_price}
                  onChange={(e) => setSettings({ ...settings, max_price: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Earning Settlement Policy
                </label>
                <select
                  value={settings.settlement_policy}
                  onChange={(e) => setSettings({ ...settings, settlement_policy: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="immediate">Immediate (Credited to Available on verified order)</option>
                  <option value="hold_7d">7-Day Cooling Period (Credited to Pending first)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={processingId === 'settings'}
                  className="px-6 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl text-sm transition"
                >
                  {processingId === 'settings' ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* RESELLER DETAIL & PRODUCT ANALYTICS MODAL */}
        {/* ========================================================================= */}
        {selectedResellerUid && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl relative space-y-6">
              <button
                onClick={() => {
                  setSelectedResellerUid(null);
                  setResellerDetail(null);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              {loadingDetail || !resellerDetail ? (
                <div className="py-16 text-center text-slate-400">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-amber-400" />
                  Loading reseller sales & product analytics...
                </div>
              ) : (
                <>
                  {/* Reseller Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-black text-white">{resellerDetail.profile.displayName}</h3>
                        <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                          {resellerDetail.profile.resellerUid}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Email: <strong>{resellerDetail.profile.email}</strong>
                        {resellerDetail.profile.phone && ` • Phone: ${resellerDetail.profile.phone}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-xs">
                      <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                        <div className="text-slate-400">Available:</div>
                        <div className="text-base font-bold text-emerald-400">
                          ₹{resellerDetail.wallet.availableBalance}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                        <div className="text-slate-400">Lifetime Earned:</div>
                        <div className="text-base font-bold text-white">
                          ₹{resellerDetail.resellerEarnings}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Product-Level Sales Breakdown Table */}
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                      <Package className="w-4 h-4 text-cyan-400" />
                      Product-by-Product Performance
                    </h4>
                    {resellerDetail.products.length === 0 ? (
                      <div className="py-6 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                        No product sales recorded yet for this reseller.
                      </div>
                    ) : (
                      <div className="overflow-x-auto border border-slate-800 rounded-xl">
                        <table className="w-full text-left text-xs text-slate-300">
                          <thead className="bg-slate-800/60 uppercase text-slate-400 font-semibold">
                            <tr>
                              <th className="py-2.5 px-4">Product Name</th>
                              <th className="py-2.5 px-4">Verified Orders</th>
                              <th className="py-2.5 px-4">Units Sold</th>
                              <th className="py-2.5 px-4">Gross Sales</th>
                              <th className="py-2.5 px-4">Net Sales</th>
                              <th className="py-2.5 px-4">Reseller Earnings</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {resellerDetail.products.map((p) => (
                              <tr key={p.productId} className="hover:bg-slate-800/30">
                                <td className="py-3 px-4 font-semibold text-white">{p.productTitle}</td>
                                <td className="py-3 px-4 font-mono">{p.verifiedOrders}</td>
                                <td className="py-3 px-4 font-mono">{p.unitsSold}</td>
                                <td className="py-3 px-4 font-bold text-white">₹{p.grossSales}</td>
                                <td className="py-3 px-4 font-bold text-white">₹{p.netSales}</td>
                                <td className="py-3 px-4 font-bold text-emerald-400">+₹{p.resellerEarnings}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Attributed Orders */}
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      Recent Attributed Orders ({resellerDetail.recentOrders.length})
                    </h4>
                    {resellerDetail.recentOrders.length === 0 ? (
                      <div className="py-4 text-center text-slate-500 text-xs">No orders yet.</div>
                    ) : (
                      <div className="overflow-x-auto border border-slate-800 rounded-xl max-h-48 overflow-y-auto">
                        <table className="w-full text-left text-xs text-slate-300">
                          <thead className="bg-slate-800/60 uppercase text-slate-400 font-semibold">
                            <tr>
                              <th className="py-2 px-4">Order #</th>
                              <th className="py-2 px-4">Product</th>
                              <th className="py-2 px-4">Resale Price</th>
                              <th className="py-2 px-4">Earning</th>
                              <th className="py-2 px-4">Status</th>
                              <th className="py-2 px-4">Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {resellerDetail.recentOrders.map((o) => (
                              <tr key={o.orderId} className="hover:bg-slate-800/20">
                                <td className="py-2 px-4 font-mono">{o.orderNumber}</td>
                                <td className="py-2 px-4 text-white">{o.productTitle}</td>
                                <td className="py-2 px-4 font-bold">₹{o.resalePrice}</td>
                                <td className="py-2 px-4 font-bold text-emerald-400">+₹{o.earningAmount}</td>
                                <td className="py-2 px-4">{o.orderStatus}</td>
                                <td className="py-2 px-4 text-slate-500">
                                  {new Date(o.createdAt).toLocaleDateString('en-IN')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Close button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setSelectedResellerUid(null)}
                      className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* MODAL: MARK PAID */}
        {payoutModalReq && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative space-y-4">
              <button
                onClick={() => setPayoutModalReq(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Confirm Payout Transfer
              </h3>
              <p className="text-xs text-slate-400">
                Record bank or UPI settlement reference for Withdrawal <strong>#{payoutModalReq.id}</strong>.
              </p>

              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs space-y-1 font-mono">
                <div>Reseller UID: <span className="text-amber-400 font-bold">{payoutModalReq.resellerUid}</span></div>
                <div>Amount: <span className="text-emerald-400 font-bold">₹{payoutModalReq.amount}</span></div>
                <div>Full UPI: <span className="text-white font-bold">{payoutModalReq.payoutDetails?.upiId || 'N/A'}</span></div>
                <div>Recipient: <span className="text-white">{payoutModalReq.payoutDetails?.accountHolderName || payoutModalReq.resellerName}</span></div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Bank Reference / UTR Number <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 429182910291 (12-digit UPI UTR) or IMPS-9812921"
                  value={payoutRef}
                  onChange={(e) => setPayoutRef(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Optional Admin Note (Internal Audit)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Paid via PhonePe Business / ICICI UPI"
                  value={payoutAdminNote}
                  onChange={(e) => setPayoutAdminNote(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-slate-500"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => setPayoutModalReq(null)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMarkPaid}
                  disabled={processingId === payoutModalReq.id}
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-bold transition"
                >
                  {processingId === payoutModalReq.id ? 'Recording...' : 'Confirm Paid'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: REJECT PAYOUT */}
        {rejectModalReq && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative space-y-4">
              <button
                onClick={() => setRejectModalReq(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-400" />
                Reject Payout Request
              </h3>
              <p className="text-xs text-slate-400">
                Rejecting will automatically restore <strong>₹{rejectModalReq.amount}</strong> back to the reseller&apos;s available wallet balance.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Rejection Reason (Visible to Reseller)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Invalid UPI VPA, Bank account inactive, please update your UPI ID in wallet."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => setRejectModalReq(null)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectPayout}
                  disabled={processingId === rejectModalReq.id}
                  className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition"
                >
                  {processingId === rejectModalReq.id ? 'Reversing...' : 'Reject & Refund'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
