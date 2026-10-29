'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowUpRight, CheckCircle2, Clock, ShieldCheck, Search, Package, Sparkles } from 'lucide-react';
import { useResellerAuth } from '@/context/ResellerAuthContext';
import { getResellerAttributedOrders } from '@/lib/resellerService';
import { AttributedOrder } from '@/types/reseller';

export default function ResellerOrdersPage() {
  const { user, profile } = useResellerAuth();
  const [orders, setOrders] = useState<AttributedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) return;
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getResellerAttributedOrders(user.uid);
      setOrders(data);
    } catch (e) {
      console.warn('Error loading orders:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === 'completed' && o.orderStatus !== 'completed') return false;
    if (filter === 'pending' && o.orderStatus !== 'pending') return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.orderNumber?.toLowerCase().includes(q) ||
      o.productTitle?.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.listingSlug?.toLowerCase().includes(q)
    );
  });

  const totalCommissionsEarned = orders
    .filter((o) => o.orderStatus === 'completed')
    .reduce((sum, o) => sum + (o.earningAmount || 0), 0);

  return (
    <div className="space-y-6 pb-24 sm:pb-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-red-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-[#162048] tracking-tight">
              Attributed Customer Orders
            </h1>
            {profile?.resellerUid && (
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-800 border border-amber-500/20 font-bold">
                🆔 {profile.resellerUid}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Every customer purchase made through your custom reseller links is tracked and recorded here in real time.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 via-pink-50/30 to-purple-50 border border-red-100/90 flex items-center justify-between sm:block sm:text-right shrink-0">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Total Commissions Earned
          </span>
          <span className="text-2xl font-black text-emerald-600 tracking-tight">
            ₹{totalCommissionsEarned.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
              filter === 'all'
                ? 'bg-[#dc2626] text-white shadow-xs'
                : 'bg-white border border-red-100 text-slate-600 hover:bg-red-50/50'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
              filter === 'completed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-red-100 text-slate-600 hover:bg-red-50/50'
            }`}
          >
            Completed ({orders.filter((o) => o.orderStatus === 'completed').length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
              filter === 'pending'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white border border-red-100 text-slate-600 hover:bg-red-50/50'
            }`}
          >
            Pending ({orders.filter((o) => o.orderStatus === 'pending').length})
          </button>
        </div>

        {orders.length > 0 && (
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order #, title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-red-100 text-xs font-medium text-[#162048] focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-red-100"
            />
          </div>
        )}
      </div>

      {/* Orders Container */}
      <div className="rounded-3xl bg-white border border-red-100/90 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-400 font-bold">
            Loading attributed orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-10 sm:p-14 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-[#dc2626] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-[#162048]">No Attributed Orders Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
              Sales made through your reseller links will automatically show up here with live commission calculations.
            </p>
          </div>
        ) : (
          <div>
            {/* Mobile Cards (block md:hidden) */}
            <div className="block md:hidden divide-y divide-purple-50">
              {filteredOrders.map((ord) => (
                <div key={ord.orderId} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#162048]">#{ord.orderNumber}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                        ord.orderStatus === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {ord.orderStatus}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-[#162048]">{ord.productTitle}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">/r/{ord.listingSlug}</span>
                  </div>

                  <div className="grid grid-cols-2 p-3 rounded-2xl bg-red-50/50 border border-red-100 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block font-bold">Customer</span>
                      <span className="font-medium text-[#162048] truncate block">{ord.customerName}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 text-[10px] block font-bold">Your Commission</span>
                      <span className="font-black text-emerald-600">+₹{ord.earningAmount}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                    <span>Sale Price: ₹{ord.resalePrice}</span>
                    <span>{new Date(ord.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table (hidden md:block) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-red-100 text-slate-400 font-extrabold uppercase text-[10px] bg-red-50/40">
                    <th className="py-3.5 px-4">Order Number</th>
                    <th className="py-3.5 px-3">Product</th>
                    <th className="py-3.5 px-3">Customer</th>
                    <th className="py-3.5 px-3">Sale Price</th>
                    <th className="py-3.5 px-3">Your Commission</th>
                    <th className="py-3.5 px-3">Order Status</th>
                    <th className="py-3.5 px-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-50">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.orderId} className="hover:bg-red-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold font-mono text-[#162048]">
                        #{ord.orderNumber}
                      </td>

                      <td className="py-3.5 px-3 max-w-xs pr-2">
                        <span className="font-bold text-[#162048] line-clamp-1 block">{ord.productTitle}</span>
                        <span className="text-[10px] text-slate-400 font-mono">/r/{ord.listingSlug}</span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-bold text-slate-700 block">{ord.customerName}</span>
                        <span className="text-[10px] text-slate-400">
                          {ord.customerEmail
                            ? ord.customerEmail.replace(/(.{2})(.*)(@.*)/, '$1***$3')
                            : 'Customer'}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 font-black text-[#162048]">₹{ord.resalePrice}</td>

                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-black text-[11px] border border-emerald-200">
                          +₹{ord.earningAmount}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                            ord.orderStatus === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-medium text-slate-500 whitespace-nowrap">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
