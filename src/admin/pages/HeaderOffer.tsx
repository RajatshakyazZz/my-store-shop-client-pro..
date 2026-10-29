import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Sparkles,
  Save,
  RotateCcw,
  Eye,
  Sliders,
  Copy,
  Check,
  X,
  ExternalLink,
  Flame,
  Zap,
  Tag,
  Palette,
  Link as LinkIcon,
  HelpCircle,
} from 'lucide-react';
import { portalApi } from '../api/client';
import { HeaderOfferConfig } from '../api/types';
import { useToast } from '../context/ToastContext';
import { useAdminTheme } from '../context/AdminThemeContext';

const DEFAULT_FORM: HeaderOfferConfig = {
  enabled: true,
  show_badge: true,
  badge_emoji: '🔥',
  badge_text: 'EXCLUSIVE OFFER',
  prefix_text: '🔥 Mega Sale: ',
  text_regular: 'Flat ',
  highlight_text: '20% Extra Discount',
  suffix_text: ' on All Reels Bundles! ✨',
  show_coupon: true,
  coupon_label: 'CODE',
  coupon_code: 'OFF20',
  allow_dismiss: true,
  redirect_url: '',
  bg_gradient: 'luxury_red',
};

const PRESETS = [
  {
    name: '🔥 Mega Sale 20% Off (Current)',
    config: {
      badge_emoji: '🔥',
      badge_text: 'EXCLUSIVE OFFER',
      prefix_text: '🔥 Mega Sale: ',
      text_regular: 'Flat ',
      highlight_text: '20% Extra Discount',
      suffix_text: ' on All Reels Bundles! ✨',
      coupon_label: 'CODE',
      coupon_code: 'OFF20',
      bg_gradient: 'luxury_red',
    },
  },
  {
    name: '⚡ 50% Off Flash Deal',
    config: {
      badge_emoji: '⚡',
      badge_text: 'FLASH SALE',
      prefix_text: '⚡ Midnight Deal: ',
      text_regular: 'Instant ',
      highlight_text: 'Flat 50% OFF',
      suffix_text: ' on Entire Reels Catalog! 🚀',
      coupon_label: 'CODE',
      coupon_code: 'FLASH50',
      bg_gradient: 'neon_ruby',
    },
  },
  {
    name: '🎉 Buy 1 Get 2 Free Bonus',
    config: {
      badge_emoji: '🎁',
      badge_text: 'SPECIAL PROMO',
      prefix_text: '🎁 Limited Promo: ',
      text_regular: 'Get ',
      highlight_text: '2 Free Bonus Packs',
      suffix_text: ' on Any Order Above ₹149! 🔥',
      coupon_label: 'CODE',
      coupon_code: 'FREE2',
      bg_gradient: 'golden_amber',
    },
  },
  {
    name: '💎 VIP Creator Discount',
    config: {
      badge_emoji: '💎',
      badge_text: 'VIP ACCESS',
      prefix_text: '💎 Member Special: ',
      text_regular: 'Save ',
      highlight_text: 'Extra ₹50 Instant Discount',
      suffix_text: ' at Checkout! ✨',
      coupon_label: 'CODE',
      coupon_code: 'VIP50',
      bg_gradient: 'pure_dark',
    },
  },
];

const GRADIENT_THEMES: Record<string, { label: string; class: string; border: string; highlight: string; glow: string }> = {
  luxury_red: {
    label: 'Luxury Velvet Red (MYZTORE Default)',
    class: 'bg-gradient-to-r from-[#1a0507] via-[#2d0a0f] to-[#140305]',
    border: 'border-red-500/20',
    highlight: 'text-rose-300 decoration-rose-400/50',
    glow: 'rgba(239,68,68,0.25)',
  },
  pure_dark: {
    label: 'Obsidian Black Minimal',
    class: 'bg-gradient-to-r from-[#09090b] via-[#18181b] to-[#09090b]',
    border: 'border-white/10',
    highlight: 'text-amber-300 decoration-amber-400/50',
    glow: 'rgba(255,255,255,0.1)',
  },
  neon_ruby: {
    label: 'Neon Ruby Blaze',
    class: 'bg-gradient-to-r from-[#38090f] via-[#540d16] to-[#26050a]',
    border: 'border-red-500/40',
    highlight: 'text-rose-200 decoration-rose-300/60',
    glow: 'rgba(244,63,94,0.35)',
  },
  golden_amber: {
    label: 'Golden Amber Festive',
    class: 'bg-gradient-to-r from-[#1f1605] via-[#2e2008] to-[#1a1203]',
    border: 'border-amber-500/30',
    highlight: 'text-amber-300 decoration-amber-400/60',
    glow: 'rgba(245,158,11,0.25)',
  },
  emerald_deals: {
    label: 'Emerald Growth',
    class: 'bg-gradient-to-r from-[#041a0e] via-[#092a18] to-[#04140a]',
    border: 'border-emerald-500/30',
    highlight: 'text-emerald-300 decoration-emerald-400/60',
    glow: 'rgba(16,185,129,0.25)',
  },
};

export default function HeaderOfferPage() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { isLight } = useAdminTheme();

  const [previewCopied, setPreviewCopied] = useState(false);

  // 1. Data Query
  const { data: offerConfig, isLoading } = useQuery({
    queryKey: ['header-offer'],
    queryFn: () => portalApi.getHeaderOffer(),
  });

  // 2. Form State
  const [form, setForm] = useState<HeaderOfferConfig>(DEFAULT_FORM);

  useEffect(() => {
    if (offerConfig) {
      setForm(offerConfig);
    }
  }, [offerConfig]);

  // 3. Save Mutation
  const mutation = useMutation({
    mutationFn: (data: HeaderOfferConfig) => portalApi.updateHeaderOffer(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['header-offer'], data);
      addToast({
        type: 'success',
        title: 'Header Offer Saved to Cloud Database 🚀',
        message: `Top announcement banner is now ${data.enabled ? 'ACTIVE' : 'TURNED OFF'} on storefront!`,
      });
    },
    onError: (err: any) => {
      addToast({
        type: 'error',
        title: 'Failed to Save Header Offer',
        message: err.message || 'Could not update header offer settings.',
      });
    },
  });

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    mutation.mutate(form);
  };

  const handleApplyPreset = (presetConfig: Partial<HeaderOfferConfig>) => {
    setForm((prev) => ({
      ...prev,
      ...presetConfig,
    }));
    addToast({
      type: 'info',
      title: 'Preset Applied',
      message: 'Preview updated! Click "Save Configuration" to make it live.',
    });
  };

  const currentTheme = GRADIENT_THEMES[form.bg_gradient || 'luxury_red'] || GRADIENT_THEMES.luxury_red;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-red-500" />
            Header Offer Bar Customization
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Storefront ke sabse upar dikhne wale promotional announcement bar ko fully customize karein (Badge, Sale Text, Coupon Code, Theme &amp; Links).
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setForm(DEFAULT_FORM)}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={mutation.isPending}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{mutation.isPending ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>

      {/* 1. REAL-TIME INTERACTIVE LIVE PREVIEW */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-red-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
              Live Real-Time Storefront Preview
            </h3>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
            form.enabled
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {form.enabled ? '● Active on Storefront' : '○ Turned Off (Hidden)'}
          </span>
        </div>

        {/* The Exact Visual Simulation of Header Banner */}
        <div className="rounded-xl overflow-hidden border border-slate-700/80 shadow-2xl">
          <div className="bg-slate-950 px-3 py-1.5 text-[10px] text-slate-500 font-mono border-b border-slate-800 flex items-center justify-between">
            <span>Desktop &amp; Mobile Top Announcement Header Bar</span>
            <span>Real-time Live Sync</span>
          </div>

          {!form.enabled ? (
            <div className="p-6 bg-slate-950/80 text-center text-xs text-slate-500 font-medium">
              Banner is currently <span className="text-rose-400 font-bold">DISABLED</span>. Enable it below to show on the storefront.
            </div>
          ) : (
            <div className={`relative ${currentTheme.class} border-b ${currentTheme.border} text-white overflow-hidden py-2 sm:py-2.5`}>
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse 70% 80% at 50% -20%, ${currentTheme.glow}, rgba(255,255,255,0))`,
                }}
              />
              <div className="max-w-7xl mx-auto px-3 sm:px-6 relative flex items-center justify-between gap-2 text-xs">
                {/* Left Badge */}
                {form.show_badge && (
                  <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 z-10">
                    <span className="w-5 h-5 rounded-full bg-red-500/20 text-rose-300 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5 fill-rose-400 text-rose-300" />
                    </span>
                    <span className="px-2 sm:px-2.5 py-0.5 rounded-full border border-red-400/40 bg-red-500/20 text-[10px] font-black uppercase tracking-wider text-rose-200 shadow-2xs flex items-center gap-1">
                      <span>{form.badge_emoji || '🔥'}</span>
                      <span>{form.badge_text || 'EXCLUSIVE OFFER'}</span>
                    </span>
                  </div>
                )}

                {/* Center Announcement Text */}
                <div className="flex-1 overflow-hidden px-1 text-center min-w-0">
                  <div className="font-bold text-[11px] sm:text-xs md:text-[13px] text-white tracking-wide">
                    {form.prefix_text && <span>{form.prefix_text}</span>}
                    {form.text_regular && <span>{form.text_regular}</span>}
                    {form.highlight_text && (
                      <span className={`font-extrabold underline ${currentTheme.highlight}`}>
                        {form.highlight_text}
                      </span>
                    )}
                    {form.suffix_text && <span>{form.suffix_text}</span>}
                  </div>
                </div>

                {/* Right Coupon Badge + Close */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 z-10">
                  {form.show_coupon && (
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewCopied(true);
                        setTimeout(() => setPreviewCopied(false), 2000);
                      }}
                      className="px-2.5 sm:px-3 py-1 rounded-lg bg-white hover:bg-slate-50 border border-white/90 text-slate-900 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer select-none"
                    >
                      <span className="text-[9px] sm:text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        {form.coupon_label || 'CODE'}
                      </span>
                      <span className="text-xs font-black text-red-950 tracking-wider">
                        {previewCopied ? 'COPIED!' : (form.coupon_code || 'OFF20')}
                      </span>
                      {previewCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      )}
                    </button>
                  )}

                  {form.allow_dismiss && (
                    <button
                      type="button"
                      className="w-6 h-6 rounded-md hover:bg-white/15 text-white/70 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      title="Dismiss Button (Optional)"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. 1-CLICK POPULAR TEMPLATES PRESETS */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Quick 1-Click Offer Presets:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(p.config)}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-red-500/50 hover:bg-slate-900/80 transition-all text-left group cursor-pointer"
            >
              <div className="text-xs font-bold text-white group-hover:text-red-400 transition-colors flex items-center justify-between">
                <span>{p.name}</span>
                <span className="text-[10px] font-mono text-slate-500">[{p.config.coupon_code}]</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 truncate">
                {p.config.highlight_text}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. MAIN FORM CONTROLS */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section A: Master Toggle */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="space-y-0.5">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Enable Header Offer Bar on Storefront</span>
              </div>
              <div className="text-xs text-slate-400">
                Turn on to display this promotional announcement bar at the very top of all store pages.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, enabled: !form.enabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                form.enabled ? 'bg-red-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  form.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Section B: Left Badge Pill */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-red-400" />
                <span>Left Badge Pill (Optional)</span>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.show_badge}
                  onChange={(e) => setForm({ ...form, show_badge: e.target.checked })}
                  className="rounded border-slate-700 text-red-600 focus:ring-red-500"
                />
                <span>Show Left Badge</span>
              </label>
            </div>

            {form.show_badge && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400">Badge Emoji / Icon</label>
                  <input
                    type="text"
                    value={form.badge_emoji}
                    onChange={(e) => setForm({ ...form, badge_emoji: e.target.value })}
                    placeholder="e.g. 🔥 or ⚡ or 🎁"
                    className="w-full mt-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-red-500 font-medium"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Single emoji displayed inside badge.</p>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-400">Badge Text</label>
                  <input
                    type="text"
                    value={form.badge_text}
                    onChange={(e) => setForm({ ...form, badge_text: e.target.value })}
                    placeholder="e.g. EXCLUSIVE OFFER or LIMITED TIME"
                    className="w-full mt-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-red-500 uppercase font-black tracking-wider"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Short badge label text.</p>
                </div>
              </div>
            )}
          </div>

          {/* Section C: Center Announcement Message */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
            <div className="font-bold text-xs text-slate-200 flex items-center gap-1.5 pb-3 border-b border-slate-800">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Center Announcement Text (With Underlined Highlight)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400">Prefix Text</label>
                <input
                  type="text"
                  value={form.prefix_text}
                  onChange={(e) => setForm({ ...form, prefix_text: e.target.value })}
                  placeholder="e.g. 🔥 Mega Sale: "
                  className="w-full mt-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-red-500 font-medium"
                />
                <p className="text-[10px] text-slate-500 mt-1">Opening headline phrase.</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400">Regular Text Before Highlight</label>
                <input
                  type="text"
                  value={form.text_regular}
                  onChange={(e) => setForm({ ...form, text_regular: e.target.value })}
                  placeholder="e.g. Flat "
                  className="w-full mt-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-red-500 font-medium"
                />
                <p className="text-[10px] text-slate-500 mt-1">Standard weight text.</p>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-rose-300 flex items-center gap-1">
                  <span>★ Highlighted &amp; Underlined Text *</span>
                </label>
                <input
                  type="text"
                  value={form.highlight_text}
                  onChange={(e) => setForm({ ...form, highlight_text: e.target.value })}
                  placeholder="e.g. 20% Extra Discount or Flat 50% OFF"
                  className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-slate-900 border border-red-500/50 text-xs text-white font-extrabold focus:outline-none focus:border-red-400 shadow-inner"
                />
                <p className="text-[10px] text-slate-500 mt-1">This text is bold, colored, and underlined to catch buyer attention instantly.</p>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-400">Suffix Text</label>
                <input
                  type="text"
                  value={form.suffix_text}
                  onChange={(e) => setForm({ ...form, suffix_text: e.target.value })}
                  placeholder="e.g.  on All Reels Bundles! ✨"
                  className="w-full mt-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-red-500 font-medium"
                />
                <p className="text-[10px] text-slate-500 mt-1">Ending text after the highlighted portion.</p>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>Optional Click Redirect URL</span>
                </label>
                <input
                  type="text"
                  value={form.redirect_url || ''}
                  onChange={(e) => setForm({ ...form, redirect_url: e.target.value })}
                  placeholder="e.g. /shop or /claim-offer (Leave blank if you only want coupon copy)"
                  className="w-full mt-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                />
                <p className="text-[10px] text-slate-500 mt-1">If provided, clicking the center announcement redirects the customer here.</p>
              </div>
            </div>
          </div>

          {/* Section D: Right Coupon Action Button */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                <Copy className="w-4 h-4 text-red-400" />
                <span>Right Coupon Code Button</span>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.show_coupon}
                  onChange={(e) => setForm({ ...form, show_coupon: e.target.checked })}
                  className="rounded border-slate-700 text-red-600 focus:ring-red-500"
                />
                <span>Show Coupon Button</span>
              </label>
            </div>

            {form.show_coupon && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400">Button Label Prefix</label>
                  <input
                    type="text"
                    value={form.coupon_label}
                    onChange={(e) => setForm({ ...form, coupon_label: e.target.value })}
                    placeholder="e.g. CODE or USE"
                    className="w-full mt-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-red-500 font-bold uppercase"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Small label above/before code.</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400">Coupon Promo Code *</label>
                  <input
                    type="text"
                    value={form.coupon_code}
                    onChange={(e) => setForm({ ...form, coupon_code: e.target.value.toUpperCase() })}
                    placeholder="e.g. OFF20 or SAVE50"
                    className="w-full mt-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-red-500 font-mono font-black tracking-wider uppercase"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Code copied to visitor clipboard when clicked.</p>
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-slate-800/80">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.allow_dismiss}
                      onChange={(e) => setForm({ ...form, allow_dismiss: e.target.checked })}
                      className="rounded border-slate-700 text-red-600 focus:ring-red-500"
                    />
                    <span>Allow visitors to close/dismiss the banner with ✕ icon</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Section E: Color & Gradient Theme */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
            <div className="font-bold text-xs text-slate-200 flex items-center gap-1.5 pb-3 border-b border-slate-800">
              <Palette className="w-4 h-4 text-purple-400" />
              <span>Color Theme &amp; Gradient</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(GRADIENT_THEMES).map(([key, theme]) => {
                const isSelected = (form.bg_gradient || 'luxury_red') === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setForm({ ...form, bg_gradient: key })}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-red-500 bg-red-950/20 shadow-md shadow-red-500/10'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white">{theme.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-red-400 shrink-0" />}
                    </div>
                    <div className={`h-6 rounded-md ${theme.class} border ${theme.border}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Changes save directly to Cloud Database and update across all visitors immediately.
          </div>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{mutation.isPending ? 'Saving to Database...' : 'Save Header Offer Config'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
