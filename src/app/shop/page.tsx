'use client';

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  Sparkles,
  IndianRupee,
  Film,
  HardDrive,
  X,
  Zap,
  ShieldCheck,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { BUNDLE_PRODUCTS } from '@/data/bundles';
import { useCart } from '@/context/CartContext';
import { fetchCustomProducts, getAllCatalogBundles, getLocalCustomProductsSync } from '@/lib/customProducts';
import { filterBundlesByQuery } from '@/lib/search';
import { track } from '@/lib/analytics';
import { optimizeImageUrl } from '@/lib/imageOptimized';
import { BundleProduct } from '@/types';
import FreeBundleOfferBanner from '@/components/FreeBundleOfferBanner';

const ITEMS_PER_PAGE = 12;

// Quick search tags for instant 1-tap filtering
const POPULAR_SEARCH_TAGS = [
  { label: '🔥 Trending', query: 'trending' },
  { label: '🤖 AI Reels', query: 'ai' },
  { label: '👻 Horror', query: 'horror' },
  { label: '🙏 Spiritual', query: 'premanand' },
  { label: '💪 Fitness & Gym', query: 'gym' },
  { label: '🚘 Cars & Luxury', query: 'car' },
  { label: '🎨 Anime', query: 'anime' },
  { label: '🎭 Comedy', query: 'comedy' },
  { label: '👶 Kids & Cartoons', query: 'cartoon' },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('s') || searchParams.get('q') || '';

  const [customProducts, setCustomProducts] = useState<BundleProduct[]>(() => getLocalCustomProductsSync());
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'reels'>('popular');
  const [currentPage, setCurrentPage] = useState(1);

  const shopSearchRef = useRef<HTMLDivElement>(null);
  const { addToCart, buyNow } = useCart();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shopSearchRef.current && !shopSearchRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync state when URL searchParams change or on popstate (browser back/forward)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const s = params.get('s') || params.get('q') || searchParams.get('s') || searchParams.get('q') || '';
      setSearchTerm(s);
      setCurrentPage(1);
    }
  }, [searchParams]);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const s = params.get('s') || params.get('q') || '';
      setSearchTerm(s);
      setCurrentPage(1);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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

  // Instant matching results for live autocomplete dropdown popup (identical to Header.tsx)
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return filterBundlesByQuery(allBundles, searchTerm);
  }, [allBundles, searchTerm]);

  // Real-time live filtering on the page grid
  const filteredBundles = useMemo(() => {
    const matched = filterBundlesByQuery(allBundles, searchTerm);
    return [...matched].sort((a, b) => {
      if (sortBy === 'price-low') return (a.personalPrice || 0) - (b.personalPrice || 0);
      if (sortBy === 'price-high') return (b.personalPrice || 0) - (a.personalPrice || 0);
      if (sortBy === 'reels') return (b.reelCount || 0) - (a.reelCount || 0);
      return (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0);
    });
  }, [allBundles, searchTerm, sortBy]);

  // Safe pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredBundles.length / ITEMS_PER_PAGE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedBundles = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredBundles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredBundles, safePage]);

  // Track GA4 view_item_list when catalog items are loaded/filtered
  useEffect(() => {
    if (paginatedBundles.length > 0) {
      track('view_item_list', {
        item_list_name: searchTerm ? `Search Results: ${searchTerm}` : 'Shop All Bundles',
        items: paginatedBundles.map((b, idx) => ({
          item_id: b.id,
          item_name: b.title,
          item_category: b.category,
          price: Number(b.personalPrice || 49),
          index: (safePage - 1) * ITEMS_PER_PAGE + idx + 1,
        })),
      });
    }
  }, [safePage, searchTerm, sortBy]);

  // Keystroke live search handler: immediately filters grid and displays instant dropdown
  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
    setIsDropdownOpen(Boolean(val.trim()));
  };

  // Submit on Enter or Search button click: 100% reliable full navigation matching Header.tsx
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsDropdownOpen(false);
    const q = searchTerm.trim();
    if (q) {
      track('search', { search_term: q });
    }
    if (typeof window !== 'undefined') {
      window.location.href = q ? `/shop?s=${encodeURIComponent(q)}` : '/shop';
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setIsDropdownOpen(false);
    if (typeof window !== 'undefined') {
      window.location.href = '/shop';
    }
  };

  const handlePopularTagClick = (tagQuery: string) => {
    setIsDropdownOpen(false);
    if (typeof window !== 'undefined') {
      window.location.href = `/shop?s=${encodeURIComponent(tagQuery)}`;
    }
  };

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://vaultworld.shop').replace(/\/+$/, '');
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'MYZTORE Reels Bundles',
    numberOfItems: filteredBundles.length,
    itemListElement: paginatedBundles.map((b, idx) => ({
      '@type': 'ListItem',
      position: (currentPage - 1) * ITEMS_PER_PAGE + idx + 1,
      url: `${siteUrl}/product/${b.slug}`,
      name: b.title,
    })),
  };

  return (
    <div className="py-4 sm:py-8 pb-24 md:pb-12">
      {/* ItemList Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Top Header & 3 Stat Cards */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#162048] tracking-tight">
              All Reels Bundles
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5 sm:mt-1">
              Search and find high-quality viral reels bundles ready to download and publish.
            </p>
          </div>

          {/* 3 Counter Cards in a compact row */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {/* Counter 1: Published Bundles */}
            <div className="bg-white border border-[#eee8fa] rounded-2xl p-2.5 sm:py-2.5 sm:px-4 shadow-sm flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#f5f1fd] text-[#6f33e8] flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#6f33e8]/20" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-base font-black text-[#162048] leading-tight truncate">
                  {allBundles.length}+
                </div>
                <div className="text-[9px] sm:text-[11px] font-semibold text-gray-400 truncate">
                  Total Bundles
                </div>
              </div>
            </div>

            {/* Counter 2: Instant Access */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:py-2.5 sm:px-4 shadow-sm flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-red-50 border border-red-200/60 text-red-700 flex items-center justify-center shrink-0">
                <HardDrive className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-base font-black text-slate-950 leading-tight truncate">
                  Google Drive
                </div>
                <div className="text-[9px] sm:text-[11px] font-semibold text-slate-500 truncate">
                  Instant Access
                </div>
              </div>
            </div>

            {/* Counter 3: Starting from */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:py-2.5 sm:px-4 shadow-sm flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-red-50 border border-red-200/60 text-red-700 flex items-center justify-center shrink-0">
                <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-base font-black text-slate-950 leading-tight truncate">
                  ₹49.00
                </div>
                <div className="text-[9px] sm:text-[11px] font-semibold text-slate-500 truncate">
                  Starting from
                </div>
              </div>
            </div>
          </div>
        </div>

        <FreeBundleOfferBanner variant="home" />

        {/* PROMINENT SEARCH BAR: Enter to Search + Dedicated Search Button + Instant Live Dropdown */}
        <div ref={shopSearchRef} className="relative rounded-3xl bg-white border border-slate-200/90 p-3.5 sm:p-6 shadow-sm space-y-3.5 z-30">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-5 flex items-center pointer-events-none text-red-600">
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            
            <input
              type="text"
              autoFocus={Boolean(initialSearch)}
              autoComplete="off"
              spellCheck="false"
              placeholder="Search 130+ viral reels bundles (e.g. AI, Horror, Gym, Premanand)..."
              value={searchTerm}
              onFocus={() => {
                if (searchTerm.trim()) setIsDropdownOpen(true);
              }}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 sm:pl-13 pr-28 sm:pr-36 py-3 sm:py-3.5 rounded-2xl bg-slate-50/70 border-2 border-slate-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 text-xs sm:text-base font-bold text-slate-950 placeholder:text-slate-400 focus:outline-none shadow-sm transition-all"
            />

            {/* Clear Button (X) + Dedicated Search Action Button */}
            <div className="absolute inset-y-0 right-1.5 sm:right-2 flex items-center gap-1 sm:gap-1.5">
              {searchTerm ? (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              ) : null}

              <button
                type="submit"
                className="px-3.5 sm:px-5 py-2 sm:py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white text-xs sm:text-sm font-black shadow-md shadow-red-500/20 transition-all flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Instant Dropdown Results Popup */}
          {isDropdownOpen && searchTerm.trim() && (
            <div className="absolute top-[68px] sm:top-[78px] left-3.5 sm:left-6 right-3.5 sm:right-6 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2.5 sm:p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-extrabold text-red-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-red-600" />
                  <span>{searchResults.length} Bundle{searchResults.length !== 1 ? 's' : ''} Found</span>
                </span>
                {searchResults.length > 0 && (
                  <span className="text-[10px] sm:text-[11px] text-slate-400 font-semibold">Click product to open</span>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-1 sm:p-1.5">
                {searchResults.slice(0, 5).map((bundle) => (
                  <Link
                    key={bundle.id}
                    href={`/product/${bundle.slug}`}
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 p-2 sm:p-2.5 rounded-xl hover:bg-red-50/70 transition-colors group"
                  >
                    <img
                      src={bundle.thumbnail}
                      alt={bundle.title}
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover shrink-0 bg-slate-900 border border-slate-200"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-red-600 transition-colors">
                        {bundle.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                        <span className="text-[10px] font-bold text-red-800 bg-red-50 border border-red-200/60 px-2 py-0.5 rounded-md">
                          {bundle.reelCount}+ Reels
                        </span>
                        <span className="text-xs sm:text-sm font-black text-slate-950">
                          ₹{bundle.personalPrice || 49}
                        </span>
                        {bundle.personalOriginalPrice && (
                          <span className="text-[10px] sm:text-[11px] text-slate-400 line-through">
                            ₹{bundle.personalOriginalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}

                {searchResults.length === 0 && (
                  <div className="py-6 sm:py-8 text-center text-xs text-slate-500 space-y-1">
                    <p className="font-bold text-slate-700">No matching bundles found</p>
                    <p className="text-[11px] text-slate-400">Try searching AI, Horror, Gym, Premanand, Cartoon, Car</p>
                  </div>
                )}
              </div>

              {searchResults.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleSearchSubmit()}
                  className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white text-xs sm:text-sm font-black text-center block transition-all cursor-pointer"
                >
                  View all {searchResults.length} results in Shop &rarr;
                </button>
              )}
            </div>
          )}

          {/* Quick 1-Tap Search Filter Tags */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[11px] sm:text-xs font-extrabold text-slate-600 shrink-0 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-red-600" />
              <span>Popular:</span>
            </span>
            {POPULAR_SEARCH_TAGS.map((tag) => {
              const isActive = searchTerm.toLowerCase().trim() === tag.query.toLowerCase();
              return (
                <button
                  key={tag.query}
                  type="button"
                  onClick={() => handlePopularTagClick(tag.query)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-950 text-rose-400 border border-red-500/40 shadow-xs font-black'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-red-50/70 hover:border-red-300'
                  }`}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Toolbar: Showing Count + Sort Dropdown */}
        <div className="flex flex-row items-center justify-between gap-2 bg-white p-3 sm:px-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2 truncate">
            <span className="text-[11px] sm:text-[13px] font-bold text-slate-700 truncate">
              Showing {filteredBundles.length > 0 ? (safePage - 1) * ITEMS_PER_PAGE + 1 : 0}–
              {Math.min(safePage * ITEMS_PER_PAGE, filteredBundles.length)} of {filteredBundles.length} bundles
            </span>
            {searchTerm && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-50 text-red-800 border border-red-200">
                <span>&ldquo;{searchTerm}&rdquo;</span>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="hover:text-red-600"
                  aria-label="Remove search"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any);
                setCurrentPage(1);
              }}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 shadow-2xs cursor-pointer"
            >
              <option value="popular">Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="reels">Largest Reel Count</option>
            </select>
          </div>
        </div>

        {/* Empty State */}
        {paginatedBundles.length === 0 && (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/90 p-8 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-700 border border-red-200/60 flex items-center justify-center mx-auto text-2xl">
              🔍
            </div>
            <h3 className="text-lg font-bold text-slate-950">
              {searchTerm ? `No bundles found for "${searchTerm}"` : 'No bundles found'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try searching with another keyword like AI, Horror, Gym, Premanand, Cartoon, or Cars.
            </p>
            <button
              onClick={handleClearSearch}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-black hover:from-red-500 hover:to-rose-500 transition-colors shadow-sm cursor-pointer"
            >
              Show All Bundles
            </button>
          </div>
        )}

        {/* 2-Column Mobile, 3-Column Tablet, 4-Column Desktop Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
          {paginatedBundles.map((bundle) => {
            const origPrice = bundle.personalOriginalPrice || 499;
            const currPrice = bundle.personalPrice || 99;
            const discount =
              origPrice > currPrice
                ? Math.round(((origPrice - currPrice) / origPrice) * 100)
                : 80;

            const isBestSelling =
              (Array.isArray(bundle.tags) && bundle.tags.includes('BEST SELLING')) ||
              bundle.id === 'rb-premanand-1000';
            const isTrending =
              (Array.isArray(bundle.tags) && bundle.tags.includes('TRENDING')) ||
              bundle.isTrending;

            return (
              <div
                key={bundle.id}
                className="bg-white rounded-2xl sm:rounded-[24px] border border-slate-200/90 shadow-[0_2px_12px_rgba(15,23,42,0.03)] hover:shadow-[0_12px_28px_rgba(225,29,72,0.14)] hover:border-red-400/60 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Thumbnail with Ribbon & Resolution Badge */}
                <Link
                  href={`/product/${bundle.slug}`}
                  onClick={() =>
                    track('select_item', {
                      item_list_name: searchTerm ? `Search: ${searchTerm}` : 'Shop All Bundles',
                      items: [
                        {
                          item_id: bundle.id,
                          item_name: bundle.title,
                          item_category: bundle.category,
                          price: Number(bundle.personalPrice || 49),
                        },
                      ],
                    })
                  }
                  className="relative aspect-[4/3] overflow-hidden bg-slate-900 block"
                >
                  <img
                    src={optimizeImageUrl(bundle.thumbnail, 384, 75)}
                    alt={bundle.title}
                    width={384}
                    height={288}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Diagonal Ribbon: BEST SELLER or TRENDING or HOT */}
                  <div className="absolute top-0 right-0 overflow-hidden w-20 h-20 sm:w-24 sm:h-24 pointer-events-none">
                    {isBestSelling ? (
                      <div className="absolute transform rotate-45 bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-[7px] sm:text-[8px] py-0.5 sm:py-1 right-[-34px] sm:right-[-32px] top-[14px] sm:top-[18px] w-[110px] sm:w-[120px] text-center shadow-md flex items-center justify-center gap-0.5">
                        <span>★</span>
                        <span>BEST SELLER</span>
                      </div>
                    ) : isTrending ? (
                      <div className="absolute transform rotate-45 bg-gradient-to-r from-slate-950 to-slate-900 text-rose-400 border border-red-500/30 font-black text-[7px] sm:text-[8px] py-0.5 sm:py-1 right-[-34px] sm:right-[-32px] top-[14px] sm:top-[18px] w-[110px] sm:w-[120px] text-center shadow-md flex items-center justify-center gap-0.5">
                        <span>↗</span>
                        <span>TRENDING</span>
                      </div>
                    ) : (
                      <div className="absolute transform rotate-45 bg-gradient-to-r from-red-700 to-rose-700 text-white font-black text-[7.5px] sm:text-[9px] py-0.5 sm:py-1 right-[-34px] sm:right-[-32px] top-[14px] sm:top-[18px] w-[110px] sm:w-[120px] text-center shadow-md flex items-center justify-center gap-0.5">
                        <span>🔥</span>
                        <span>HOT</span>
                      </div>
                    )}
                  </div>

                  {/* HD / 1080P Pill */}
                  <span className="absolute bottom-1.5 right-1.5 sm:bottom-2.5 sm:right-2.5 px-1.5 py-0.5 sm:px-2 rounded-md text-[9px] sm:text-[10px] font-black bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{String(bundle.resolution || '').includes('1080') ? '1080P' : 'HD'}</span>
                  </span>
                </Link>

                {/* Card Body */}
                <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3.5">
                  <div className="space-y-1.5 sm:space-y-2">
                    {/* Title (2 lines clamp) */}
                    <Link
                      href={`/product/${bundle.slug}`}
                      onClick={() =>
                        track('select_item', {
                          item_list_name: searchTerm ? `Search: ${searchTerm}` : 'Shop All Bundles',
                          items: [
                            {
                              item_id: bundle.id,
                              item_name: bundle.title,
                              item_category: bundle.category,
                              price: Number(bundle.personalPrice || 49),
                            },
                          ],
                        })
                      }
                    >
                      <h3 className="font-extrabold text-xs sm:text-[14px] text-slate-900 hover:text-red-600 transition-colors line-clamp-2 leading-snug min-h-[32px] sm:min-h-[40px]">
                        {bundle.title}
                      </h3>
                    </Link>

                    {/* Meta Tags */}
                    <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                      <span className="px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-extrabold bg-red-50 text-red-800 border border-red-200/50">
                        {bundle.reelCount}+ Reels
                      </span>
                      <span className="px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold bg-slate-100 text-slate-600 flex items-center gap-0.5">
                        <Film className="w-2.5 h-2.5" />
                        <span>MP4</span>
                      </span>
                    </div>
                  </div>

                  {/* Pricing & Dual Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 space-y-2 sm:space-y-2.5">
                    <div className="flex items-baseline justify-between gap-1 flex-wrap">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[10px] sm:text-xs text-slate-400 line-through font-semibold">
                          ₹{bundle.personalOriginalPrice}.00
                        </span>
                        <span className="text-sm sm:text-lg font-black text-slate-950">
                          ₹{bundle.personalPrice}.00
                        </span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {discount}% OFF
                      </span>
                    </div>

                    {/* Dual Action Buttons: [ 🛒 ] Cart Button + [ Buy Now ] solid button */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <button
                        type="button"
                        onClick={() => addToCart(bundle, 'personal')}
                        className="p-2 sm:p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-red-50 hover:border-red-300 text-slate-700 hover:text-red-700 transition-colors shadow-2xs shrink-0 flex items-center justify-center active:scale-95 cursor-pointer"
                        aria-label="Add to cart"
                        title="Add to cart"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => buyNow(bundle, 'personal')}
                        className="flex-1 py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-[11px] sm:text-xs flex items-center justify-center shadow-md shadow-red-500/20 transition-all active:scale-95 cursor-pointer"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-6">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-slate-200 bg-white text-slate-700 flex items-center justify-center text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors cursor-pointer"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= safePage - 1 && pageNum <= safePage + 1)
              ) {
                const isActive = pageNum === safePage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs font-black transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-slate-950 text-rose-400 border border-red-500/40 shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }

              if (pageNum === safePage - 2 || pageNum === safePage + 2) {
                return (
                  <span key={pageNum} className="text-slate-400 text-xs px-1">
                    ...
                  </span>
                );
              }

              return null;
            })}

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-gray-200 bg-white text-gray-700 flex items-center justify-center text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 3 Trust / Value Cards */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-6 shadow-sm space-y-3.5 mt-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 fill-red-500/20" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-[#162048]">Instant Access</h4>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium">Get Google Drive files immediately after payment</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-[#162048]">High Quality</h4>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium">Curated 1080P Full HD watermark-free digital content</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-[#162048]">Regular Updates</h4>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium">New bundles added regularly with lifetime access</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm font-bold text-gray-500">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
