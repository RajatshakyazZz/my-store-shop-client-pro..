'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cookie, ShieldCheck, X, Check } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'ztore_cookie_consent_v1';

export default function CookieConsentBanner() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a cookie choice
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consent) {
        // Small delay so it smoothly animates in after initial page load
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage may fail in restricted/private modes
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
        status: 'accepted',
        timestamp: new Date().toISOString(),
        essential: true,
        analytics: true,
      }));
    } catch {}
    setIsVisible(false);
  };

  const handleAcceptEssentialOnly = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
        status: 'essential_only',
        timestamp: new Date().toISOString(),
        essential: true,
        analytics: false,
      }));
    } catch {}
    setIsVisible(false);
  };

  // Hide on admin portal, checkout or order success pages
  if (
    !isVisible ||
    pathname?.startsWith('/asdf') ||
    pathname?.includes('/checkout') ||
    pathname?.includes('/order-success')
  ) {
    return null;
  }

  const isProductPage = pathname?.startsWith('/product/');

  return (
    <aside
      role="region"
      aria-label="Cookie consent"
      className={`fixed z-[9990] left-3 right-3 sm:left-6 sm:right-auto sm:max-w-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
        isProductPage
          ? 'bottom-[140px] sm:bottom-6'
          : 'bottom-20 sm:bottom-6'
      }`}
    >
      <div className="bg-slate-950/95 backdrop-blur-xl text-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-3.5">
        
        {/* Header Icon + Title + Close */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-red-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-red-500/30">
              <Cookie className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-white tracking-tight flex items-center gap-1.5">
                <span>We Value Your Privacy</span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  GDPR / IT Act
                </span>
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAcceptEssentialOnly}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Decline non-essential cookies"
            title="Decline non-essential cookies"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Descriptive Text */}
        <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
          We use essential cookies to manage your shopping cart and secure checkout. With your consent, we also use analytical cookies to improve website performance and user experience.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-0.5">
          <button
            type="button"
            onClick={handleAcceptAll}
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-xs shadow-md shadow-red-600/30 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Accept All Cookies</span>
          </button>

          <button
            type="button"
            onClick={handleAcceptEssentialOnly}
            className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white font-bold text-xs border border-white/10 active:scale-95 transition-all text-center cursor-pointer"
          >
            Necessary Only
          </button>
        </div>

        {/* Policy Link */}
        <div className="text-[10px] text-slate-400 text-center sm:text-left flex items-center justify-between pt-0.5 border-t border-white/10">
          <span>Read our full policies:</span>
          <div className="flex items-center gap-2 font-semibold">
            <Link
              href="/privacy-policy"
              className="text-rose-400 hover:text-rose-300 underline underline-offset-2"
            >
              Privacy Policy
            </Link>
            <span>•</span>
            <Link
              href="/terms-and-conditions"
              className="text-rose-400 hover:text-rose-300 underline underline-offset-2"
            >
              Terms
            </Link>
          </div>
        </div>

      </div>
    </aside>
  );
}
