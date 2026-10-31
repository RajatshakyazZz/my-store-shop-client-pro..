'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Gift,
  ShoppingCart,
  Search,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Plus,
  Check,
  Zap,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { BUNDLE_PRODUCTS } from '@/data/bundles';
import { fetchCustomProducts, getAllCatalogBundles, getLocalCustomProductsSync } from '@/lib/customProducts';
import { optimizeImageUrl } from '@/lib/imageOptimized';
import { BundleProduct } from '@/types';
import FreeBundleOfferBanner from '@/components/FreeBundleOfferBanner';
import { isMegaAllAccessBundle } from '@/lib/freeBundleOffer';

export default function ClaimOfferClient() {
  const {
    items,
    addToCart,
    subtotal,
    isQualifiedForFreeOffer,
    freeOfferProgress,
    freeBundles,
    setIsFreeBundleModalOpen,
    setIsCartOpen,
    freeBundleOffer,
  } = useCart();

  const isOfferActive = freeBundleOffer?.enabled !== false;
  const minCart = freeBundleOffer?.minCartValue || 149;
  const freeQty = freeBundleOffer?.freeBundleQuantity || 2;

  const [customProducts, setCustomProducts] = useState<BundleProduct[]>(() => getLocalCustomProductsSync());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Load custom products from Firestore on mount
  useEffect(() => {
    fetchCustomProducts().then((res) => {
      if (res && res.length > 0) {
        setCustomProducts(res);
      }
    }).catch(() => {});
  }, []);

  const allBundles = useMemo(() => {
    return getAllCatalogBundles(customProducts, BUNDLE_PRODUCTS);
  }, [customProducts]);

  // Extract categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    allBundles.forEach((b) => {
      if (b.category && !isMegaAllAccessBundle(b)) {
        set.add(b.category);
      }
    });
    return ['all', ...Array.from(set)];
  }, [allBundles]);

  // Filtered bundles list
  const eligibleBundles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return allBundles.filter((b) => {
      // Exclude All-Access Mega Bundles (Personal or Reseller) from regular items list
      if (isMegaAllAccessBundle(b)) {
        return false;
      }
      const matchesSearch =
        !query ||
        b.title.toLowerCase().includes(query) ||
        b.category.toLowerCase().includes(query) ||
        b.tags.some((t) => t.toLowerCase().includes(query));

      const matchesCat =
        selectedCategory === 'all' ||
        b.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [allBundles, searchQuery, selectedCategory]);

  const remainingToQualify = Math.max(0, minCart - subtotal);
  const claimedCount = freeBundles.length;

  return (
    <div className="min-h-screen bg-slate-50/50 text-[#182247] pb-24 sm:pb-16">
      {/* =========================================================================
          1. STICKY TOP OFFER BAR & LIVE CART VALUE TRACKER
          ========================================================================= */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white py-6 sm:py-9 px-4 sm:px-6 relative overflow-hidden shadow-lg border-b border-red-500/20">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-red-600/20 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto space-y-4 relative z-10 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-200 text-xs font-black uppercase tracking-wider">
                <Gift className="w-3.5 h-3.5 text-red-400" />
                <span>Special Promotion</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                Add minimum <span className="text-red-400">₹{minCart}</span> value in cart to claim{' '}
                <span className="text-rose-300">{freeQty} free {freeQty === 1 ? 'bundle' : 'bundles'}</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
                Add any bundles to reach ₹{minCart}. As soon as your cart reaches ₹{minCart}, you will get a popup to unlock and choose any {freeQty} bundles for 100% FREE!
              </p>
            </div>

            {/* Quick Action Button */}
            <div className="shrink-0 flex justify-center sm:justify-end">
              {isQualifiedForFreeOffer ? (
                <button
                  type="button"
                  onClick={() => setIsFreeBundleModalOpen(true)}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-xs sm:text-sm shadow-xl shadow-red-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-red-100" />
                  <span>
                    {claimedCount > 0 ? `Change Free Bundles (${claimedCount}/${freeQty})` : `🎉 Claim ${freeQty} Free Bundles (₹0)`}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all"
                >
                  <ShoppingCart className="w-4 h-4 text-red-300" />
                  <span>View Cart (₹{subtotal})</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Progress Meter */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm font-bold gap-2">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Cart Value: <strong className="text-white text-base">₹{subtotal}</strong> / ₹149</span>
              </span>
              <span>
                {isQualifiedForFreeOffer ? (
                  <span className="text-emerald-400 font-extrabold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Offer Unlocked! (2 Free Bundles Ready)
                  </span>
                ) : (
                  <span className="text-red-300 font-extrabold">
                    Add ₹{remainingToQualify} more to unlock 2 free bundles!
                  </span>
                )}
              </span>
            </div>

            {/* Visual Bar */}
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isQualifiedForFreeOffer
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                    : 'bg-gradient-to-r from-red-500 via-rose-500 to-red-600'
                }`}
                style={{ width: `${freeOfferProgress}%` }}
              />
            </div>

            {claimedCount > 0 && (
              <div className="pt-1 flex items-center justify-between text-xs text-rose-200">
                <span>
                  🎁 Claimed Free Gifts: <strong className="text-white">{claimedCount} of 2</strong> ({freeBundles.map(b => b.title).join(', ')})
                </span>
                <button
                  type="button"
                  onClick={() => setIsFreeBundleModalOpen(true)}
                  className="underline text-red-300 hover:text-white font-bold"
                >
                  Edit Selection
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. FILTER & SEARCH CONTROLS
          ========================================================================= */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-4">
        <FreeBundleOfferBanner variant="home" />

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search bundles to add (AI, Motivation, Gym, Horror)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 rounded-2xl text-xs sm:text-sm bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-900 placeholder:text-slate-400 shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick info chip */}
          <div className="text-xs text-slate-600 font-medium flex items-center gap-1.5 self-start md:self-auto">
            <Zap className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>Showing {eligibleBundles.length} eligible store bundles</span>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors capitalize ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-red-400 hover:text-red-600'
              }`}
            >
              {cat === 'all' ? 'All Niches' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          3. BUNDLES LIST (WITH REQUIRED PROMINENT ADD TO CART & OFFER LINE)
          ========================================================================= */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {eligibleBundles.map((bundle) => {
            const isInCart = items.some((i) => i.product.id === bundle.id);

            return (
              <div
                key={bundle.id}
                className="rounded-3xl bg-white border border-[#e3dbfa] p-4 shadow-[0_4px_16px_rgba(81,38,201,0.04)] hover:shadow-[0_8px_24px_rgba(81,38,201,0.08)] transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 mb-3.5">
                    <img
                      src={optimizeImageUrl(bundle.thumbnail, 400, 75)}
                      alt={bundle.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-1 rounded-full text-[10.5px] font-black uppercase tracking-wider bg-black/75 backdrop-blur-md text-white">
                        {bundle.reelCount}+ Reels
                      </span>
                    </div>
                    {bundle.category && (
                      <div className="absolute top-2.5 right-2.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#ede5ff] text-[#5126c9] capitalize">
                          {bundle.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-extrabold text-sm sm:text-[15px] text-[#182247] leading-snug line-clamp-2">
                    {bundle.title}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-lg font-black text-[#182247] tabular-nums">
                      ₹{bundle.personalPrice}
                    </span>
                    <span className="text-xs text-slate-400 line-through tabular-nums">
                      ₹{bundle.personalOriginalPrice || Math.round(bundle.personalPrice * 1.5)}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-green-100 text-green-700">
                      Save {Math.round((1 - bundle.personalPrice / (bundle.personalOriginalPrice || bundle.personalPrice * 1.5)) * 100)}%
                    </span>
                  </div>

                  {/* MANDATORY OFFER LINE REQUIRED BY USER */}
                  <div className="mt-3 p-2.5 rounded-xl bg-red-50/70 border border-red-200/60 flex items-center gap-2 text-[11px] font-bold text-red-900 leading-tight">
                    <Gift className="w-3.5 h-3.5 shrink-0 text-red-600" />
                    <span>Add minimum ₹{minCart} value in cart to claim {freeQty} free {freeQty === 1 ? 'bundle' : 'bundles'}</span>
                  </div>
                </div>

                {/* ADD TO CART ACTION BUTTON */}
                <div className="pt-4 mt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => addToCart(bundle, 'personal')}
                    className={`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-[13px] flex items-center justify-center gap-2 transition-all shadow-sm ${
                      isInCart
                        ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                        : 'bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-700 hover:to-rose-700 text-white shadow-md shadow-red-500/25 hover:scale-[1.01] active:scale-[0.99]'
                    }`}
                  >
                    {isInCart ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>In Cart (+ Add Another)</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 stroke-[2.8]" />
                        <span>Add to Cart (₹{bundle.personalPrice})</span>
                      </>
                    )}
                  </button>

                  <Link
                    href={`/product/${bundle.slug || bundle.id}`}
                    className="p-3 rounded-xl border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-300 hover:bg-red-50/30 transition-colors"
                    title="View details"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* =========================================================================
          4. STICKY BOTTOM QUICK ACTION BAR
          ========================================================================= */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 shadow-[0_-6px_20px_rgba(0,0,0,0.06)]">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-[#182247]">
                Cart Total: <span className="text-red-600 text-base sm:text-lg">₹{subtotal}</span>
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-xs text-[#4e4668] font-bold truncate">
                {isQualifiedForFreeOffer ? (
                  <span className="text-emerald-600 font-extrabold">🎉 {freeQty} Free Bundles Unlocked!</span>
                ) : (
                  <span>Add ₹{remainingToQualify} for {freeQty} Free Bundles</span>
                )}
              </span>
            </div>
            {claimedCount > 0 && (
              <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
                ✓ {claimedCount} of {freeQty} Free Gifts Selected
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isQualifiedForFreeOffer ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsFreeBundleModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-black text-xs hover:bg-red-100 transition-all"
                >
                  {claimedCount > 0 ? `Free Gifts (${claimedCount}/${freeQty})` : `🎁 Claim ${freeQty} Free`}
                </button>
                <Link
                  href="/checkout"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-xs sm:text-sm shadow-md shadow-red-500/25 flex items-center gap-1.5"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-xs sm:text-sm shadow-md shadow-red-500/25 flex items-center gap-1.5"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>View Cart ({items.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
