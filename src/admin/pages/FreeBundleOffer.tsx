import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Gift,
  Save,
  Check,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Sliders,
  DollarSign,
  Layers,
  ArrowRight,
  Eye,
  RotateCcw,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { portalApi } from '../api/client';
import { FreeBundleOffer } from '../api/types';
import { useToast } from '../context/ToastContext';
import { useAdminTheme } from '../context/AdminThemeContext';
import ImageUploadField from '../components/common/ImageUploadField';

const DEFAULT_FORM: FreeBundleOffer = {
  enabled: true,
  banner_image: '/banner-free-bundles.png',
  banner_fallback_image: '/banner-free-bundles.png',
  min_cart_value: 149,
  free_bundle_quantity: 2,
  headline: 'Get 2 of Any Bundle FREE',
  subheadline: 'PAY ₹149 OR MORE & PICK ANY 2 ADDITIONAL REELS BUNDLES AT NO EXTRA COST!',
  button_text: '🎁 Claim 2 Free Bundles on Min. ₹149 Order →',
};

export default function FreeBundleOfferPage() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const { isLight } = useAdminTheme();

  // 1. Data query
  const { data: offerConfig, isLoading } = useQuery({
    queryKey: ['free-bundle-offer'],
    queryFn: () => portalApi.getFreeBundleOffer(),
  });

  // 2. Form state
  const [form, setForm] = useState<FreeBundleOffer>(DEFAULT_FORM);

  useEffect(() => {
    if (offerConfig) {
      setForm(offerConfig);
    }
  }, [offerConfig]);

  // 3. Save mutation
  const mutation = useMutation({
    mutationFn: (data: FreeBundleOffer) => portalApi.updateFreeBundleOffer(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['free-bundle-offer'], data);
      success(
        'Offer Settings Saved',
        `Promotional offer updated: Min ₹${data.min_cart_value}, ${data.free_bundle_quantity} Free Bundles (${data.enabled ? 'Active' : 'Turned Off'})`
      );
    },
    onError: (err: any) => {
      error('Failed to Save', err.message || 'Could not update promotional offer settings');
    },
  });

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    mutation.mutate(form);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset offer configuration to default settings (₹149 min cart, 2 free bundles)?')) {
      setForm(DEFAULT_FORM);
    }
  };

  const handleMinCartChange = (val: number) => {
    const num = Math.max(1, Number(val) || 1);
    setForm((prev) => ({
      ...prev,
      min_cart_value: num,
      // Auto-update subheadline & button text if they follow default pattern
      subheadline: `PAY ₹${num} OR MORE & PICK ANY ${prev.free_bundle_quantity} ADDITIONAL REELS BUNDLES AT NO EXTRA COST!`,
      button_text: `🎁 Claim ${prev.free_bundle_quantity} Free Bundles on Min. ₹${num} Order →`,
    }));
  };

  const handleQuantityChange = (val: number) => {
    const num = Math.max(1, Math.min(20, Number(val) || 1));
    setForm((prev) => ({
      ...prev,
      free_bundle_quantity: num,
      headline: `Get ${num} of Any Bundle FREE`,
      subheadline: `PAY ₹${prev.min_cart_value} OR MORE & PICK ANY ${num} ADDITIONAL REELS BUNDLES AT NO EXTRA COST!`,
      button_text: `🎁 Claim ${num} Free Bundles on Min. ₹${prev.min_cart_value} Order →`,
    }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <Gift className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
                Free Bundle Offer & Banner
              </h1>
              <p className={`text-xs sm:text-sm font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Manage the promotional hero banner, minimum cart threshold, and free gift bundle quantity across your entire store.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleResetDefaults}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
              isLight
                ? 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                : 'border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={mutation.isPending || isLoading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            {mutation.isPending ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Settings Left, Live Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Configuration */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          {/* 1. Master Toggle Card */}
          <div
            className={`p-5 sm:p-6 rounded-2xl border ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
            } shadow-sm space-y-4`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-500" />
                <h2 className={`text-sm font-extrabold ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  Offer Activation Status
                </h2>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                  form.enabled
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                }`}
              >
                {form.enabled ? '● Active on Storefront' : '○ Turned Off (Hidden)'}
              </span>
            </div>

            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                className="w-5 h-5 mt-0.5 rounded text-amber-500 accent-amber-500 cursor-pointer"
              />
              <div>
                <span className={`text-sm font-bold block ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Enable Free Bundle Offer Across Store
                </span>
                <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  When enabled, buyers see the promotional banner, unlock progress in their cart drawer, and can claim free gift bundles upon reaching the minimum order value. When turned off, the banner and free bonus popups are completely hidden from the entire store.
                </span>
              </div>
            </label>
          </div>

          {/* 2. Banner Image Upload Card */}
          <div
            className={`p-5 sm:p-6 rounded-2xl border ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
            } shadow-sm space-y-4`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h2 className={`text-sm font-extrabold ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  Promotional Banner Image
                </h2>
              </div>
              <span className={`text-xs ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                Recommended ratio 16:6 or 1280x480
              </span>
            </div>

            {/* Upload from Gallery / Device or Direct URL */}
            <ImageUploadField
              label="Banner Image URL / Upload from Gallery"
              value={form.banner_image}
              onChange={(url) => setForm({ ...form, banner_image: url })}
              placeholder="https://... or upload from your device gallery"
              helperText="Upload a new promotional banner from your phone/laptop gallery, or paste a CDN image URL."
              required
            />

            {/* Quick Presets */}
            <div className="pt-2">
              <span className={`text-xs font-bold block mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Quick Banner Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      banner_image: '/banner-free-bundles.png',
                      banner_fallback_image: '/banner-free-bundles.png',
                    })
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    form.banner_image === '/banner-free-bundles.png'
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-500 font-bold'
                      : isLight
                      ? 'border-slate-200 hover:bg-slate-100 text-slate-600'
                      : 'border-slate-800 hover:bg-slate-800 text-slate-400'
                  }`}
                >
                  Local High-Res (/banner-free-bundles.png)
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      banner_image: '/banner-free-bundles.png',
                    })
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    form.banner_image === '/banner-free-bundles.png'
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-500 font-bold'
                      : isLight
                      ? 'border-slate-200 hover:bg-slate-100 text-slate-600'
                      : 'border-slate-800 hover:bg-slate-800 text-slate-400'
                  }`}
                >
                  CDN Backup (Neon Sale Banner)
                </button>
              </div>
            </div>
          </div>

          {/* 3. Offer Threshold & Bundle Quantity Card */}
          <div
            className={`p-5 sm:p-6 rounded-2xl border ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
            } shadow-sm space-y-4`}
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <DollarSign className="w-4 h-4 text-amber-500" />
              <h2 className={`text-sm font-extrabold ${isLight ? 'text-slate-950' : 'text-white'}`}>
                Pricing Threshold & Free Bundle Limit
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Minimum Cart Value */}
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Minimum Cart Value (₹) *
                </label>
                <div
                  className={`flex items-center rounded-xl border px-3 py-2.5 transition-colors ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 focus-within:border-amber-500'
                      : 'bg-slate-950 border-slate-800 focus-within:border-amber-500'
                  }`}
                >
                  <span className="text-amber-500 font-black text-sm mr-1.5">₹</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={form.min_cart_value}
                    onChange={(e) => handleMinCartChange(Number(e.target.value))}
                    className="w-full bg-transparent text-sm font-black focus:outline-none"
                    placeholder="149"
                  />
                </div>
                <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                  Cart subtotal customer must reach before unlocking free bundles.
                </p>
              </div>

              {/* Free Bundle Quantity */}
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Free Bundles Allowed *
                </label>
                <div
                  className={`flex items-center rounded-xl border px-3 py-2.5 transition-colors ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 focus-within:border-amber-500'
                      : 'bg-slate-950 border-slate-800 focus-within:border-amber-500'
                  }`}
                >
                  <Layers className="w-4 h-4 text-amber-500 mr-2 shrink-0" />
                  <input
                    type="number"
                    min="1"
                    max="20"
                    step="1"
                    required
                    value={form.free_bundle_quantity}
                    onChange={(e) => handleQuantityChange(Number(e.target.value))}
                    className="w-full bg-transparent text-sm font-black focus:outline-none"
                    placeholder="2"
                  />
                  <span className="text-xs font-bold text-slate-400 shrink-0 ml-1">bundles</span>
                </div>
                <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                  Number of free bundles (₹0) the customer can claim in one order.
                </p>
              </div>
            </div>

            {/* Quick Quantity Shortcuts */}
            <div className="flex items-center gap-2 pt-1">
              <span className={`text-[11px] font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Quick select:</span>
              {[1, 2, 3, 4, 5].map((qty) => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => handleQuantityChange(qty)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                    form.free_bundle_quantity === qty
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                      : isLight
                      ? 'border-slate-200 hover:bg-slate-100 text-slate-600'
                      : 'border-slate-800 hover:bg-slate-800 text-slate-400'
                  }`}
                >
                  {qty} {qty === 1 ? 'Bundle' : 'Bundles'}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Promotional Copy / Headings Card */}
          <div
            className={`p-5 sm:p-6 rounded-2xl border ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
            } shadow-sm space-y-4`}
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h2 className={`text-sm font-extrabold ${isLight ? 'text-slate-950' : 'text-white'}`}>
                Promotional Copy & CTA Text
              </h2>
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Banner Main Headline
              </label>
              <input
                type="text"
                value={form.headline}
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}
                placeholder="Get 2 of Any Bundle FREE"
              />
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Offer Subtitle / Conditions
              </label>
              <input
                type="text"
                value={form.subheadline}
                onChange={(e) => setForm({ ...form, subheadline: e.target.value })}
                className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}
                placeholder="PAY ₹149 OR MORE & PICK ANY 2 ADDITIONAL REELS BUNDLES AT NO EXTRA COST!"
              />
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Banner CTA Button Text
              </label>
              <input
                type="text"
                value={form.button_text}
                onChange={(e) => setForm({ ...form, button_text: e.target.value })}
                className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}
                placeholder="🎁 Claim 2 Free Bundles on Min. ₹149 Order →"
              />
            </div>
          </div>
        </form>

        {/* Right Column: Live Interactive Storefront Preview */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
          <div
            className={`p-5 sm:p-6 rounded-2xl border ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
            } shadow-sm space-y-4`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-500" />
                <h3 className={`text-sm font-extrabold ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  Live Storefront Banner Preview
                </h3>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-500">
                Live Preview
              </span>
            </div>

            {/* Status indicator badge */}
            {!form.enabled && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Notice: Offer is currently TURNED OFF. This banner is hidden from real buyers.</span>
              </div>
            )}

            {/* Exact Storefront Banner Card */}
            <div
              className={`w-full flex flex-col rounded-2xl overflow-hidden border border-amber-500/40 bg-slate-950 shadow-[0_12px_36px_rgba(245,158,11,0.18)] transition-all ${
                !form.enabled ? 'opacity-50 grayscale' : ''
              }`}
            >
              {/* Banner Image Preview */}
              <div className="w-full relative aspect-[16/6] bg-slate-900 overflow-hidden">
                <img
                  src={form.banner_image || '/banner-free-bundles.png'}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      form.banner_fallback_image ||
                      '/banner-free-bundles.png';
                  }}
                  alt={form.headline || 'Promotional Offer Banner'}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Shimmering Amber Gold CTA Button */}
              <div className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 relative overflow-hidden shadow-inner">
                <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950 shrink-0" />
                <span className="truncate">
                  {form.button_text || `🎁 Claim ${form.free_bundle_quantity} Free Bundles on Min. ₹${form.min_cart_value} Order →`}
                </span>
                <ArrowRight className="w-4 h-4 stroke-[3] shrink-0" />
              </div>
            </div>

            {/* Cart Drawer Unlock Preview */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
              <span className={`text-xs font-bold block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Cart Drawer In-App Prompt Preview:
              </span>

              {/* Case 1: Unlocked */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-emerald-500/10 border border-amber-300/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-black text-amber-900 dark:text-amber-300">
                  <Gift className="w-4 h-4 shrink-0 text-amber-500" />
                  <span>🎉 {form.free_bundle_quantity} Free Bundles Unlocked!</span>
                </div>
                <button
                  type="button"
                  className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-[11px] font-black pointer-events-none"
                >
                  Select Now
                </button>
              </div>

              {/* Case 2: Progress nudge */}
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs text-amber-800 dark:text-amber-400 font-bold">
                <span>Add ₹{Math.max(1, form.min_cart_value - 99)} more to claim {form.free_bundle_quantity} Free Bundles!</span>
                <span className="underline font-extrabold text-[11px]">View Offer</span>
              </div>
            </div>

            {/* Summary details */}
            <div
              className={`p-4 rounded-xl border text-xs space-y-2 ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>Offer Status:</span>
                <span className={`font-black ${form.enabled ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {form.enabled ? 'ACTIVE ON STOREFRONT' : 'DISABLED / HIDDEN'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Min Cart Value:</span>
                <span className="font-black text-amber-500">₹{form.min_cart_value}.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Free Bundle Gift Cap:</span>
                <span className="font-black text-amber-500">{form.free_bundle_quantity} Bundles</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Catalog Sync:</span>
                <span className="font-semibold text-emerald-500">Live & Realtime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
