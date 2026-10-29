'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, Search, Menu, X, Play, ArrowRight, Sparkles, Copy, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useStoreSettings } from '@/context/StoreSettingsContext';
import { BUNDLE_PRODUCTS } from '@/data/bundles';
import { getAllCatalogBundles, getLocalCustomProductsSync, fetchCustomProducts } from '@/lib/customProducts';
import { filterBundlesByQuery } from '@/lib/search';
import { BundleProduct } from '@/types';
import { HeaderOfferConfig, getHeaderOfferSync, fetchHeaderOffer } from '@/lib/headerOffer';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, setIsCartOpen } = useCart();
  const { settings } = useStoreSettings();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isResellerRoute, setIsResellerRoute] = useState(false);
  const [headerOffer, setHeaderOffer] = useState<HeaderOfferConfig>(() => getHeaderOfferSync());
  const [isCouponBannerVisible, setIsCouponBannerVisible] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  // Sync header offer from Cloud Firestore & listen for admin real-time updates
  useEffect(() => {
    fetchHeaderOffer().then((res) => {
      if (res) setHeaderOffer(res);
    }).catch(() => {});

    const handleOfferUpdated = (e: Event) => {
      const customEvt = e as CustomEvent<HeaderOfferConfig>;
      if (customEvt.detail) {
        setHeaderOffer(customEvt.detail);
      }
    };
    window.addEventListener('vaultzet:header_offer_updated', handleOfferUpdated);
    return () => window.removeEventListener('vaultzet:header_offer_updated', handleOfferUpdated);
  }, []);

  // Check if coupon banner was previously dismissed in the current session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = sessionStorage.getItem('vaultzet_dismiss_coupon_banner');
      if (dismissed === 'true') {
        setIsCouponBannerVisible(false);
      }
    }
  }, []);

  const handleDismissCoupon = () => {
    setIsCouponBannerVisible(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('vaultzet_dismiss_coupon_banner', 'true');
    }
  };

  const handleCopyCoupon = () => {
    if (typeof window !== 'undefined') {
      const promoCode = headerOffer?.coupon_code || 'OFF20';
      navigator.clipboard?.writeText(promoCode);
      sessionStorage.setItem('vaultzet_applied_coupon', promoCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Completely hide store header on reseller landing pages (/r/[slug])
  // or on reseller checkout/order-success flows
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isR = pathname?.startsWith('/r/') || pathname === '/r';
      const params = new URLSearchParams(window.location.search);
      const hasResellerParam = Boolean(
        params.get('r') ||
        params.get('reseller_slug') ||
        sessionStorage.getItem('vaultzet_reseller_slug')
      );
      const isResellerCheckoutOrSuccess =
        (pathname === '/checkout' || pathname === '/order-success') && hasResellerParam;
      setIsResellerRoute(isR || isResellerCheckoutOrSuccess);
    }
  }, [pathname]);

  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const searchQueryRef = useRef(searchQuery);
  searchQueryRef.current = searchQuery;

  // Catalog bundles for instant header autocomplete
  const [catalogBundles, setCatalogBundles] = useState<BundleProduct[]>(() => {
    return getAllCatalogBundles(getLocalCustomProductsSync(), BUNDLE_PRODUCTS);
  });

  useEffect(() => {
    fetchCustomProducts().then((res) => {
      if (res && res.length > 0) {
        setCatalogBundles(getAllCatalogBundles(res, BUNDLE_PRODUCTS));
      }
    }).catch(() => {});
  }, []);

  // Instant matching results for live autocomplete dropdown
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return filterBundlesByQuery(catalogBundles, searchQuery);
  }, [catalogBundles, searchQuery]);

  // Close desktop dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync header search box with URL query when on /shop or when pathname changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const s = params.get('s') || params.get('q') || '';
      if (pathname === '/shop') {
        setSearchQuery(s);
      } else if (!s) {
        setSearchQuery('');
      }
    }
  }, [pathname]);

  // Listen to custom cross-component search sync event (e.g. from /shop page search bar)
  useEffect(() => {
    const handleVaultzetSearch = (e: Event) => {
      const customEvt = e as CustomEvent<string>;
      if (typeof customEvt.detail === 'string' && customEvt.detail !== searchQueryRef.current) {
        setSearchQuery(customEvt.detail);
      }
    };
    window.addEventListener('vaultzet:search', handleVaultzetSearch);
    return () => window.removeEventListener('vaultzet:search', handleVaultzetSearch);
  }, []);

  // Real-time live search on every keystroke to power instant dropdown
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setIsDropdownOpen(Boolean(val.trim()));
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsDropdownOpen(false);
  };

  const handleViewAllResults = () => {
    setIsDropdownOpen(false);
    setIsMobileSearchOpen(false);
    setIsMobileMenuOpen(false);
    const q = searchQuery.trim();
    if (typeof window !== 'undefined') {
      window.location.href = q ? `/shop?s=${encodeURIComponent(q)}` : '/shop';
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleViewAllResults();
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: '🎁 Offer', href: '/claim-offer' },
    { name: 'Reels Feed', href: '/reels' },
    { name: 'Resell & Earn', href: '/earn' },
    { name: 'My Orders', href: '/my-order' },
    { name: 'About Us', href: '/about-us' },
  ];

  // Hide header on full-screen reels page or reseller landing / checkout / success pages
  if (
    pathname?.startsWith('/reels') ||
    pathname?.startsWith('/r/') ||
    pathname === '/r' ||
    isResellerRoute
  ) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-[0_2px_10px_rgba(20,10,50,0.02)]">
      {/* Top Promotional Coupon Header Bar (Fully synced with Admin Panel /asdf/header-offer) */}
      {isCouponBannerVisible && headerOffer.enabled && (
        <div
          className={`relative ${
            (headerOffer.bg_gradient &&
              {
                pure_dark: 'bg-gradient-to-r from-[#09090b] via-[#18181b] to-[#09090b] border-b border-white/10',
                neon_ruby: 'bg-gradient-to-r from-[#38090f] via-[#540d16] to-[#26050a] border-b border-red-500/40',
                golden_amber: 'bg-gradient-to-r from-[#1f1605] via-[#2e2008] to-[#1a1203] border-b border-amber-500/30',
                emerald_deals: 'bg-gradient-to-r from-[#041a0e] via-[#092a18] to-[#04140a] border-b border-emerald-500/30',
              }[headerOffer.bg_gradient]) ||
            'bg-gradient-to-r from-[#1a0507] via-[#2d0a0f] to-[#140305] border-b border-red-500/20'
          } text-white overflow-hidden`}
        >
          {/* Subtle diagonal ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                headerOffer.bg_gradient === 'pure_dark'
                  ? 'radial-gradient(ellipse 70% 80% at 50% -20%, rgba(255,255,255,0.08), rgba(255,255,255,0))'
                  : headerOffer.bg_gradient === 'golden_amber'
                  ? 'radial-gradient(ellipse 70% 80% at 50% -20%, rgba(245,158,11,0.25), rgba(255,255,255,0))'
                  : headerOffer.bg_gradient === 'emerald_deals'
                  ? 'radial-gradient(ellipse 70% 80% at 50% -20%, rgba(16,185,129,0.25), rgba(255,255,255,0))'
                  : 'radial-gradient(ellipse 70% 80% at 50% -20%, rgba(239,68,68,0.25), rgba(255,255,255,0))',
            }}
          />

          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 relative flex items-center justify-between gap-2 text-xs">
            {/* Left: Red Sparkle + Offer Pill */}
            {headerOffer.show_badge && (
              <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 z-10">
                <span className="w-5 h-5 rounded-full bg-red-500/20 text-rose-300 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 fill-rose-400 text-rose-300" />
                </span>
                <span className="px-2 sm:px-2.5 py-0.5 rounded-full border border-red-400/40 bg-red-500/20 text-[10px] font-black uppercase tracking-wider text-rose-200 shadow-2xs flex items-center gap-1">
                  <span>{headerOffer.badge_emoji || '🔥'}</span>
                  <span>{headerOffer.badge_text || 'EXCLUSIVE OFFER'}</span>
                </span>
              </div>
            )}

            {/* Center: Offer Notice */}
            <div className="flex-1 overflow-hidden px-1 text-center min-w-0">
              {headerOffer.redirect_url ? (
                <Link
                  href={headerOffer.redirect_url}
                  className="animate-diwali-ltr font-bold text-[11px] sm:text-xs md:text-[13px] text-white tracking-wide hover:opacity-90 transition-opacity inline-block"
                >
                  {headerOffer.prefix_text && <span>{headerOffer.prefix_text}</span>}
                  {headerOffer.text_regular && <span>{headerOffer.text_regular}</span>}
                  {headerOffer.highlight_text && (
                    <span className="text-rose-300 font-extrabold underline decoration-rose-400/50">
                      {headerOffer.highlight_text}
                    </span>
                  )}
                  {headerOffer.suffix_text && <span>{headerOffer.suffix_text}</span>}
                </Link>
              ) : (
                <div className="animate-diwali-ltr font-bold text-[11px] sm:text-xs md:text-[13px] text-white tracking-wide">
                  {headerOffer.prefix_text && <span>{headerOffer.prefix_text}</span>}
                  {headerOffer.text_regular && <span>{headerOffer.text_regular}</span>}
                  {headerOffer.highlight_text && (
                    <span className="text-rose-300 font-extrabold underline decoration-rose-400/50">
                      {headerOffer.highlight_text}
                    </span>
                  )}
                  {headerOffer.suffix_text && <span>{headerOffer.suffix_text}</span>}
                </div>
              )}
            </div>

            {/* Right: Coupon Badge with Copy Action + Close */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 z-10">
              {headerOffer.show_coupon && (
                <button
                  type="button"
                  onClick={handleCopyCoupon}
                  className="px-2.5 sm:px-3 py-1 rounded-lg bg-white hover:bg-slate-50 border border-white/90 text-slate-900 shadow-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer select-none group"
                  title="Click to copy code and auto-apply discount"
                >
                  <span className="text-[9px] sm:text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {headerOffer.coupon_label || 'CODE'}
                  </span>
                  <span className="text-xs font-black text-red-950 tracking-wider">
                    {isCopied ? 'COPIED!' : (headerOffer.coupon_code || 'OFF20')}
                  </span>
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-red-600 group-hover:scale-110 transition-transform shrink-0" />
                  )}
                </button>
              )}

              {headerOffer.allow_dismiss && (
                <button
                  type="button"
                  onClick={handleDismissCoupon}
                  className="w-6 h-6 rounded-md hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  aria-label="Dismiss coupon bar"
                  title="Dismiss"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[66px] sm:h-[74px] gap-3">
          
          {/* Dynamic Brand Logo synced with Admin Panel */}
          <Link href="/" prefetch={false} className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black border border-red-500/30 overflow-hidden flex items-center justify-center shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform shrink-0">
              <img
                src="/logo.webp?v=2"
                alt="MYZTORE Logo"
                width={44}
                height={44}
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-[16px] sm:text-[17px] text-[#162048] tracking-tight leading-tight">
                {settings.storeName}
              </span>
              <span className="text-[11px] sm:text-[12px] font-medium text-[#4a5270] tracking-tight">
                {settings.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  prefetch={false}
                  className={`text-[15px] font-bold transition-all relative py-1 ${
                    isActive ? 'text-slate-900 font-extrabold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-red-600 via-rose-500 to-red-600 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Tools matching Competitor Screenshots */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Pill Search Box with Instant Live Autocomplete Dropdown */}
            <div ref={desktopSearchRef} className="relative hidden sm:block">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center bg-slate-50 hover:bg-slate-100/80 focus-within:bg-white border border-slate-200 rounded-full pl-3.5 pr-2 py-0.5 focus-within:ring-2 focus-within:ring-red-500/20 focus-within:border-red-500 transition-all"
              >
                <Search className="w-4 h-4 text-red-600 shrink-0" />
                <input
                  type="text"
                  autoComplete="off"
                  spellCheck="false"
                  aria-label="Search bundles"
                  placeholder="Search bundles..."
                  value={searchQuery}
                  onFocus={() => {
                    if (searchQuery.trim()) setIsDropdownOpen(true);
                  }}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-44 lg:w-56 py-2 px-2 bg-transparent text-[13px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                    className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : null}
              </form>

              {/* Instant Dropdown Results for Desktop */}
              {isDropdownOpen && searchQuery.trim() && (
                <div className="absolute top-full right-0 mt-2 w-80 lg:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-2.5 bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-100 flex items-center justify-between">
                    <span className="text-[11px] font-black text-red-900 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-red-600" />
                      <span>{searchResults.length} Bundle{searchResults.length !== 1 ? 's' : ''} Found</span>
                    </span>
                    {searchResults.length > 0 && (
                      <span className="text-[10px] text-slate-500 font-medium">Click to open</span>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-rose-50 p-1">
                    {searchResults.slice(0, 5).map((bundle) => (
                      <Link
                        key={bundle.id}
                        href={`/product/${bundle.slug}`}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-red-50/60 transition-colors group"
                      >
                        <img
                          src={bundle.thumbnail}
                          alt={bundle.title}
                          className="w-11 h-11 rounded-lg object-cover shrink-0 bg-slate-900 border border-slate-200"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-red-600 transition-colors">
                            {bundle.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold text-red-700 bg-red-100/70 px-1.5 py-0.5 rounded">
                              {bundle.reelCount}+ Reels
                            </span>
                            <span className="text-xs font-black text-slate-900">
                              ₹{bundle.personalPrice || 49}
                            </span>
                            {bundle.personalOriginalPrice && (
                              <span className="text-[10px] text-gray-400 line-through">
                                ₹{bundle.personalOriginalPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}

                    {searchResults.length === 0 && (
                      <div className="py-6 text-center text-xs text-gray-500 space-y-1">
                        <p className="font-semibold text-gray-700">No matching bundles</p>
                        <p className="text-[11px] text-gray-400">Try AI, Horror, Gym, Premanand, Car</p>
                      </div>
                    )}
                  </div>

                  {searchResults.length > 0 && (
                    <button
                      type="button"
                      onClick={handleViewAllResults}
                      className="w-full py-2.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-xs text-center block transition-all shadow-sm"
                    >
                      View all {searchResults.length} results in Shop &rarr;
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Search Button */}
            <button
              type="button"
              onClick={() => {
                setIsMobileSearchOpen(!isMobileSearchOpen);
                if (isMobileMenuOpen) setIsMobileMenuOpen(false);
              }}
              aria-label="Search"
              className="sm:hidden w-9 h-9 rounded-xl bg-red-50 text-red-800 border border-red-200/60 flex items-center justify-center hover:bg-red-100 transition-colors shrink-0"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Mobile Cart Button */}
            <Link
              href="/cart"
              prefetch={false}
              className="sm:hidden px-2.5 h-9 rounded-xl bg-red-50 text-red-900 border border-red-200/60 flex items-center gap-1.5 hover:bg-red-100 transition-colors text-xs font-bold relative shrink-0"
              aria-label="Cart"
            >
              <ShoppingCart className="w-4 h-4 text-red-600" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-600 text-[9px] font-black text-white flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Desktop Cart Button Pill */}
            <Link
              href="/cart"
              prefetch={false}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-900 font-bold text-sm transition-all group"
              aria-label="Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 w-4 h-4 rounded-full bg-red-600 text-[10px] font-black text-white flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span>Cart</span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                if (isMobileSearchOpen) setIsMobileSearchOpen(false);
              }}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              className="md:hidden px-2.5 h-9 rounded-xl border border-slate-200 text-slate-900 flex items-center gap-1.5 hover:bg-slate-100 text-xs font-bold shrink-0"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              <span>Menu</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Dropdown Bar with Instant Keystroke Search & Product Preview List */}
        {isMobileSearchOpen && (
          <div className="sm:hidden border-t border-slate-100 bg-white py-2.5 px-1 animate-in fade-in duration-150">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center bg-slate-50 border border-slate-200 rounded-full pl-3 pr-2 py-0.5 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20"
            >
              <Search className="w-4 h-4 text-red-600 shrink-0" />
              <input
                type="text"
                autoFocus
                autoComplete="off"
                spellCheck="false"
                placeholder="Type to search bundles instantly..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full py-1.5 px-2 bg-transparent text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0">
                  <Search className="w-3 h-3" />
                </div>
              )}
            </form>

            {/* Mobile Instant Results List */}
            {searchQuery.trim() && (
              <div className="mt-2.5 bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden animate-in fade-in duration-150">
                <div className="p-2 bg-red-50/80 border-b border-red-100 flex items-center justify-between text-[11px] font-bold text-red-900">
                  <span>
                    {searchResults.length} Bundle{searchResults.length !== 1 ? 's' : ''} Found
                  </span>
                  {searchResults.length > 0 && (
                    <button
                      type="button"
                      onClick={handleViewAllResults}
                      className="text-[10px] text-red-700 underline font-extrabold"
                    >
                      See All in Shop &rarr;
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 p-1">
                  {searchResults.slice(0, 5).map((bundle) => (
                    <Link
                      key={bundle.id}
                      href={`/product/${bundle.slug}`}
                      onClick={() => {
                        setIsMobileSearchOpen(false);
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center gap-2.5 p-2 rounded-xl active:bg-red-50/70 transition-colors"
                    >
                      <img
                        src={bundle.thumbnail}
                        alt={bundle.title}
                        className="w-10 h-10 rounded-lg object-cover shrink-0 bg-slate-900 border border-slate-200"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                          {bundle.title}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[9px] font-bold text-red-700 bg-red-100/70 px-1 py-0.2 rounded">
                            {bundle.reelCount}+ Reels
                          </span>
                          <span className="text-xs font-black text-slate-900">
                            ₹{bundle.personalPrice || 49}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}

                  {searchResults.length === 0 && (
                    <div className="py-4 text-center text-xs text-gray-500">
                      No bundles found. Try AI, Horror, Gym, Premanand...
                    </div>
                  )}
                </div>

                {searchResults.length > 0 && (
                  <button
                    type="button"
                    onClick={handleViewAllResults}
                    className="w-full py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs text-center block"
                  >
                    View all {searchResults.length} results in Shop &rarr;
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-3">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl text-[15px] font-bold text-slate-900 hover:bg-red-50 active:bg-red-100 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
