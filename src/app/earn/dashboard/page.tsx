'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Wallet,
  Clock,
  TrendingUp,
  Package,
  ShoppingBag,
  ArrowRight,
  PlusCircle,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Share2,
  ArrowUpRight,
  MessageCircle,
  DollarSign,
  ChevronRight,
} from 'lucide-react';
import { useResellerAuth } from '@/context/ResellerAuthContext';
import {
  getResellerWallet,
  getResellerListingsByUser,
  getResellerAttributedOrders,
  getResellerTransactions,
  getWhatsAppShareUrl,
} from '@/lib/resellerService';
import {
  WalletAccount,
  ResellerListing,
  AttributedOrder,
  WalletTransaction,
} from '@/types/reseller';

export default function ResellerDashboardOverview() {
  const { user, profile } = useResellerAuth();
  const [wallet, setWallet] = useState<WalletAccount | null>(null);
  const [listings, setListings] = useState<ResellerListing[]>([]);
  const [orders, setOrders] = useState<AttributedOrder[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function loadData() {
      setIsLoading(true);
      try {
        const [w, l, o, t] = await Promise.all([
          getResellerWallet(user!.uid),
          getResellerListingsByUser(user!.uid, profile?.resellerUid),
          getResellerAttributedOrders(user!.uid),
          getResellerTransactions(user!.uid),
        ]);
        setWallet(w);
        setListings(l);
        setOrders(o);
        setTransactions(t);
      } catch (e) {
        console.warn('Error loading dashboard data:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [user, profile?.resellerUid]);

  const copyToClipboard = (slug: string) => {
    const url = `${window.location.origin}/r/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const totalSalesCount = orders.filter((o) => o.orderStatus === 'completed').length;

  return (
    <div className="space-y-6 pb-24 sm:pb-8">
      {/* ------------------------------------------------------------- */}
      {/* WELCOME BANNER */}
      {/* ------------------------------------------------------------- */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#162048] via-[#221652] to-[#3a1b63] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-xl shadow-purple-950/20 relative overflow-hidden">
        {/* Glow orb */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ec288d]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-pink-300 text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>MYZTORE Verified Partner</span>
            </div>
            {profile?.resellerUid && (
              <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                🆔 {profile.resellerUid}
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white">
            Welcome, {profile?.displayName || user?.email?.split('@')[0]}!
          </h1>
          <p className="text-xs text-slate-300 font-medium max-w-xl leading-relaxed">
            Track real-time attributed sales, manage custom product prices, and request instant payouts to your UPI.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2.5 shrink-0">
          <Link
            href="/earn/create"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#6734f7] to-[#ec288d] text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Link</span>
          </Link>

          <Link
            href="/earn/wallet"
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
          >
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span>Wallet</span>
          </Link>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4 CORE FINANCIAL METRIC CARDS */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Total Earned */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-purple-100/90 shadow-xs space-y-2 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#6734f7] flex items-center justify-center shadow-inner">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Earned</div>
            <div className="text-xl sm:text-2xl font-black text-[#162048] tracking-tight">
              ₹{wallet?.totalEarned?.toLocaleString('en-IN') || 0}
            </div>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Lifetime Profit</span>
          </div>
        </div>

        {/* Available Balance */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-emerald-100 shadow-xs space-y-2 relative overflow-hidden hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Available</span>
              <Link href="/earn/wallet" className="text-[10px] text-emerald-700 font-extrabold hover:underline">
                Withdraw &rarr;
              </Link>
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight">
              ₹{wallet?.availableBalance?.toLocaleString('en-IN') || 0}
            </div>
            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Min Payout: ₹1</span>
          </div>
        </div>

        {/* Total Attributed Sales */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-pink-100 shadow-xs space-y-2 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-2xl bg-pink-100 text-[#ec288d] flex items-center justify-center shadow-inner">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Sales</div>
            <div className="text-xl sm:text-2xl font-black text-[#162048] tracking-tight">
              {totalSalesCount}
            </div>
            <span className="text-[10px] text-pink-600 font-bold block mt-0.5">Completed Orders</span>
          </div>
        </div>

        {/* Active Links */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-blue-100 shadow-xs space-y-2 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Links</div>
            <div className="text-xl sm:text-2xl font-black text-[#162048] tracking-tight">
              {listings.filter((l) => l.status === 'active').length}
            </div>
            <span className="text-[10px] text-blue-600 font-bold block mt-0.5">Ready to Share</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MY RESELLER PRODUCT LINKS */}
      {/* ------------------------------------------------------------- */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-purple-100/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#6734f7] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-[#162048]">
                My Reseller Product Links
              </h2>
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                Share these links on social media to earn on every order
              </span>
            </div>
          </div>
          <Link
            href="/earn/products"
            className="text-xs font-black text-[#6734f7] hover:underline flex items-center gap-1"
          >
            <span>View All ({listings.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="p-8 sm:p-10 rounded-2xl bg-purple-50/50 border border-purple-100 text-center space-y-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#6734f7] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-[#162048]">No Reseller Links Created Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                Pick any of our 222,000+ viral reel bundles, customize your price, and start generating daily income.
              </p>
            </div>
            <Link
              href="/earn/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6734f7] to-[#ec288d] text-white text-xs font-black shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create First Reseller Link</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-purple-100 text-slate-400 font-extrabold uppercase text-[10px]">
                  <th className="py-3 px-2">Product Title</th>
                  <th className="py-3 px-2">Your Price</th>
                  <th className="py-3 px-2">Your Net Profit</th>
                  <th className="py-3 px-2">Sales</th>
                  <th className="py-3 px-2 text-right">Quick Share & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {listings.slice(0, 5).map((listing) => {
                  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/r/${listing.slug}` : '';
                  const waUrl = getWhatsAppShareUrl(listing, typeof window !== 'undefined' ? window.location.origin : '');

                  return (
                    <tr key={listing.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="py-3 px-2">
                        <div className="font-bold text-[#162048] max-w-xs truncate">
                          {listing.customTitle}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">/r/{listing.slug}</span>
                      </td>
                      <td className="py-3 px-2 font-black text-[#162048]">
                        ₹{listing.resalePrice}
                      </td>
                      <td className="py-3 px-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-black text-[11px] border border-emerald-200">
                          +₹{listing.grossMargin}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-bold text-slate-600">
                        {listing.salesCount || 0}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Copy Link Button */}
                          <button
                            type="button"
                            onClick={() => copyToClipboard(listing.slug)}
                            className="px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#6734f7] font-bold text-[11px] flex items-center gap-1 transition-all active:scale-95"
                            title="Copy link"
                          >
                            {copiedSlug === listing.slug ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-600">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          {/* WhatsApp Share Button */}
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-all active:scale-95"
                            title="Share on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          {/* View Landing Page */}
                          <Link
                            href={`/r/${listing.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-all active:scale-95"
                            title="Open Link Preview"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
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

      {/* ------------------------------------------------------------- */}
      {/* RECENT ATTRIBUTED SALES & RECENT WALLET ACTIVITY */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Recent Attributed Orders */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-purple-100/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-pink-100 text-[#ec288d] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-black text-[#162048]">
                Recent Attributed Sales
              </h2>
            </div>
            <Link href="/earn/orders" className="text-xs font-black text-[#6734f7] hover:underline">
              All Orders
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <p className="text-xs text-slate-400 font-medium">
                No orders recorded yet. Share your reseller link on WhatsApp & Instagram to generate your first sale!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 4).map((ord) => (
                <div key={ord.orderId} className="p-3 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="min-w-0 flex-1 pr-2">
                    <h5 className="font-bold text-[#162048] truncate">{ord.productTitle}</h5>
                    <p className="text-[10px] text-slate-400">Order #{ord.orderNumber} &bull; {ord.customerName}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-black text-emerald-600 block">+₹{ord.earningAmount}</span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Commission</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Wallet Activity */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-purple-100/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-black text-[#162048]">
                Recent Wallet Activity
              </h2>
            </div>
            <Link href="/earn/wallet" className="text-xs font-black text-[#6734f7] hover:underline">
              Full Ledger
            </Link>
          </div>

          {transactions.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <p className="text-xs text-slate-400 font-medium">
                No transactions recorded yet. Earnings will appear automatically after customers purchase through your link.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.slice(0, 4).map((tx) => (
                <div key={tx.id} className="p-3 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="min-w-0 flex-1 pr-2">
                    <h5 className="font-bold text-[#162048] truncate">{tx.description}</h5>
                    <p className="text-[10px] text-slate-400">{new Date(tx.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`font-black ${tx.amount > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {tx.amount > 0 ? `+₹${tx.amount}` : `-₹${Math.abs(tx.amount)}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
