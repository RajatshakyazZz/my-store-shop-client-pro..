'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Cookie, ShieldCheck, X, ChevronDown, ChevronUp, Check, Settings2 } from 'lucide-react';

const STORAGE_KEY = 'vaultworld_cookie_consent';
const STORAGE_DATE_KEY = 'vaultworld_cookie_consent_date';
const STORAGE_PREFS_KEY = 'vaultworld_cookie_preferences';

export default function CookieConsentBanner() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  
  // Customizable preferences
  const [analyticsAllowed, setAnalyticsAllowed] = useState(true);
  const [marketingAllowed, setMarketingAllowed] = useState(true);

  // Check consent state on mount & register listener for footer "Cookie Preferences"
  useEffect(() => {
    setMounted(true);

    const savedConsent = localStorage.getItem(STORAGE_KEY);
    const savedPrefs = localStorage.getItem(STORAGE_PREFS_KEY);

    if (savedPrefs) {
      try {
        const parsed = JSON.parse(savedPrefs);
        setAnalyticsAllowed(Boolean(parsed.analytics));
        setMarketingAllowed(Boolean(parsed.marketing));
      } catch (e) {
        // Ignore JSON error
      }
    }

    // If no consent saved yet, show after a graceful delay (800ms)
    if (!savedConsent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 800);
      return () => clearTimeout(timer);
    }

    // Global event listener so user can reopen cookie settings from Footer
    const handleOpenConsent = () => {
      setIsVisible(true);
      setShowCustomize(true);
    };

    window.addEventListener('vaultworld:open_cookie_consent', handleOpenConsent);
    return () => {
      window.removeEventListener('vaultworld:open_cookie_consent', handleOpenConsent);
    };
  }, []);

  // Update Google Consent Mode v2 if window.gtag is available
  const updateGoogleConsent = (granted: boolean) => {
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      try {
        (window as any).gtag('consent', 'update', {
          ad_storage: granted && marketingAllowed ? 'granted' : 'denied',
          analytics_storage: granted && analyticsAllowed ? 'granted' : 'denied',
          ad_user_data: granted && marketingAllowed ? 'granted' : 'denied',
          ad_personalization: granted && marketingAllowed ? 'granted' : 'denied',
        });
      } catch (err) {
        console.warn('gtag consent update notice:', err);
      }
    }
  };

  const handleAcceptAll = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    localStorage.setItem(STORAGE_DATE_KEY, new Date().toISOString());
    localStorage.setItem(
      STORAGE_PREFS_KEY,
      JSON.stringify({ essential: true, analytics: true, marketing: true })
    );
    setAnalyticsAllowed(true);
    setMarketingAllowed(true);
    updateGoogleConsent(true);
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem(STORAGE_KEY, 'essential');
    localStorage.setItem(STORAGE_DATE_KEY, new Date().toISOString());
    localStorage.setItem(
      STORAGE_PREFS_KEY,
      JSON.stringify({ essential: true, analytics: false, marketing: false })
    );
    setAnalyticsAllowed(false);
    setMarketingAllowed(false);
    updateGoogleConsent(false);
    setIsVisible(false);
  };

  const handleSaveCustom = () => {
    const isAnyNonEssential = analyticsAllowed || marketingAllowed;
    localStorage.setItem(STORAGE_KEY, isAnyNonEssential ? 'custom' : 'essential');
    localStorage.setItem(STORAGE_DATE_KEY, new Date().toISOString());
    localStorage.setItem(
      STORAGE_PREFS_KEY,
      JSON.stringify({
        essential: true,
        analytics: analyticsAllowed,
        marketing: marketingAllowed,
      })
    );
    updateGoogleConsent(isAnyNonEssential);
    setIsVisible(false);
  };

  // Don't render until client mount
  if (!mounted || !isVisible) {
    return null;
  }

  // Do not show on checkout, order success or order status pages to keep buying experience distraction-free
  const isExcludedPath =
    pathname?.includes('/checkout') ||
    pathname?.includes('/order-success') ||
    pathname?.includes('/order-status');

  if (isExcludedPath) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-20 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md z-[9999] animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="relative bg-slate-950/95 backdrop-blur-2xl border border-red-500/35 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-slate-100 max-h-[85vh] overflow-y-auto">
        {/* Red top highlight glow */}
        <div className="absolute -top-[1px] left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_12px_rgba(239,68,68,0.8)]" />

        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500/20 to-rose-500/10 border border-red-500/30 flex items-center justify-center shrink-0 text-red-400 shadow-sm">
              <Cookie className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-white tracking-tight">
                  Cookie &amp; Privacy Choices
                </h3>
                <span className="hidden xs:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  DPDP &amp; GDPR
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                We value your security and privacy
              </p>
            </div>
          </div>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={handleEssentialOnly}
            className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
            aria-label="Dismiss and accept essential only"
            title="Dismiss and keep essential only"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Brief description */}
        <p className="text-xs text-slate-300 leading-relaxed font-normal mb-3">
          We use essential cookies to power your cart, process instant UPI &amp; card checkouts, and deliver your Google Drive downloads. In compliance with the DPDP Act 2023 &amp; GDPR, you can choose which cookies to allow.
        </p>

        {/* Expandable Preferences Section */}
        {showCustomize && (
          <div className="mb-3.5 space-y-2.5 pt-3 border-t border-slate-800/80">
            {/* Category 1: Essential */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
              <div className="pr-2">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <span>Essential Store Cookies</span>
                  <span className="text-[10px] text-red-400 font-medium">(Required)</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Cart management, payment verification &amp; order download tokens.
                </p>
              </div>
              <span className="shrink-0 px-2.5 py-1 rounded-md bg-red-500/15 text-red-400 border border-red-500/30 text-[10px] font-bold">
                Always Active
              </span>
            </div>

            {/* Category 2: Analytics */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
              <div className="pr-2">
                <p className="font-bold text-white">Analytics &amp; Performance</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Helps us measure site speeds and popular bundle requests (GA4).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAnalyticsAllowed(!analyticsAllowed)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  analyticsAllowed ? 'bg-red-600' : 'bg-slate-700'
                }`}
                aria-label="Toggle Analytics Cookies"
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    analyticsAllowed ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Category 3: Marketing */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
              <div className="pr-2">
                <p className="font-bold text-white">Marketing &amp; Attribution</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Prevents duplicate ad impressions and tracks campaign performance.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMarketingAllowed(!marketingAllowed)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  marketingAllowed ? 'bg-red-600' : 'bg-slate-700'
                }`}
                aria-label="Toggle Marketing Cookies"
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    marketingAllowed ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* Links and Customize toggle */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-0.5">
          <Link
            href="/privacy-policy#cookies"
            prefetch={false}
            className="text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors font-semibold text-[11px]"
          >
            Read Privacy &amp; Cookie Policy
          </Link>

          <button
            type="button"
            onClick={() => setShowCustomize(!showCustomize)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <Settings2 className="w-3 h-3 text-red-400" />
            <span>{showCustomize ? 'Hide Details' : 'Customize'}</span>
            {showCustomize ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
          {showCustomize ? (
            <>
              <button
                type="button"
                onClick={handleSaveCustom}
                className="col-span-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all active:scale-[0.98] border border-slate-700"
              >
                <Check className="w-3.5 h-3.5 text-red-400" />
                <span>Save Choices</span>
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="col-span-1 inline-flex items-center justify-center gap-1 px-3 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-xs shadow-md shadow-red-500/25 transition-all hover:scale-[1.01] active:scale-[0.98]"
              >
                <span>Accept All</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleEssentialOnly}
                className="col-span-1 inline-flex items-center justify-center px-3 py-2 sm:py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs transition-all active:scale-[0.98] border border-slate-800"
              >
                <span>Essential Only</span>
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="col-span-1 inline-flex items-center justify-center gap-1 px-3 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-xs shadow-md shadow-red-500/25 transition-all hover:scale-[1.01] active:scale-[0.98]"
              >
                <span>Accept All</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
