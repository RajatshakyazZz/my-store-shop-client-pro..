import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Palette, Save, Play, Sparkles, ArrowRight } from 'lucide-react';
import { portalApi } from '../api/client';
import { StoreBranding } from '../api/types';
import { useToast } from '../context/ToastContext';
import ImageUploadField from '../components/common/ImageUploadField';

export default function Branding() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const { data: branding, isLoading } = useQuery({
    queryKey: ['branding'],
    queryFn: () => portalApi.getBranding(),
  });

  const [form, setForm] = useState<StoreBranding>({
    store_name: 'Ztore Digital',
    tagline: 'Premium Reels for Your Growth',
    logo_url: '/logo.png',
    favicon_url: '/favicon.ico',
    primary_color: '#6d36e8',
    secondary_color: '#fe5f9b',
    accent_color: '#10b981',
    font_family: 'Plus Jakarta Sans',
  });

  React.useEffect(() => {
    if (branding) setForm(branding);
  }, [branding]);

  const mutation = useMutation({
    mutationFn: (updated: StoreBranding) => portalApi.updateBranding(updated),
    onSuccess: (data) => {
      queryClient.setQueryData(['branding'], data);
      try {
        localStorage.setItem('rb_portal_settings_branding', JSON.stringify(data));
        window.dispatchEvent(new CustomEvent('vaultworld:branding_updated', { detail: data }));
      } catch {}
      success('Branding Saved', 'Logo and palette updated across all customer touchpoints.');
    },
    onError: () => error('Save Failed', 'Could not save branding configuration.'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Store Branding & Appearance
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
          Customize brand logos, vibrant gradients, and live storefront themes.
        </p>
      </div>

      {/* Top Header Offer Banner Shortcut */}
      <Link
        to="/header-offer"
        className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-500/30 flex items-center justify-between gap-4 hover:border-red-500/60 transition-all group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 text-rose-300 border border-red-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 fill-rose-400 text-rose-300" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Top Header Promotional Offer Bar</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-500/20 text-rose-300 border border-red-500/30">
                New Feature
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 truncate">
              Storefront ke sabse upar ka Exclusive Offer, 20% Off Sale Text, Coupon Code aur Close button customize karein.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-red-400 group-hover:text-red-300 shrink-0">
          <span>Customize Offer Bar</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">Store Name</label>
            <input
              type="text"
              value={form.store_name}
              onChange={(e) => setForm({ ...form, store_name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">Tagline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Logo & Favicon URLs */}
          <div className="space-y-4 pt-1">
            <ImageUploadField
              label="Store Logo"
              value={form.logo_url}
              onChange={(url) => setForm({ ...form, logo_url: url })}
              placeholder="/logo.webp?v=2"
              helperText="Main header and brand logo. Upload .PNG or .JPG from your gallery."
            />

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block flex items-center justify-between">
                <span>Store Favicon URL / Path</span>
                {form.favicon_url && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, favicon_url: '/favicon.ico' })}
                    className="text-[10px] text-purple-400 hover:underline"
                  >
                    Reset Default
                  </button>
                )}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="/favicon.ico"
                  value={form.favicon_url}
                  onChange={(e) => setForm({ ...form, favicon_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                />
                {form.favicon_url && (
                  <img
                    src={form.favicon_url}
                    alt="Favicon preview"
                    className="w-8 h-8 rounded-lg object-contain bg-slate-950 border border-slate-800 p-1 shrink-0"
                    onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Color pickers */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 block">Primary Color</label>
              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                <input
                  type="color"
                  value={form.primary_color}
                  onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                  className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                />
                <span className="text-[11px] font-mono text-slate-300">{form.primary_color}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 block">Secondary Color</label>
              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                <input
                  type="color"
                  value={form.secondary_color}
                  onChange={(e) => setForm({ ...form, secondary_color: e.target.value })}
                  className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                />
                <span className="text-[11px] font-mono text-slate-300">{form.secondary_color}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 block">Accent Color</label>
              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                <input
                  type="color"
                  value={form.accent_color}
                  onChange={(e) => setForm({ ...form, accent_color: e.target.value })}
                  className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                />
                <span className="text-[11px] font-mono text-slate-300">{form.accent_color}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <Save className="w-4 h-4" />
            <span>Save Branding Changes</span>
          </button>
        </form>

        {/* Live Preview Panel */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Live Storefront Preview</span>
            </h3>
            <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Interactive
            </span>
          </div>

          {/* Mock Header */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div
                  style={{
                    background: `linear-gradient(135deg, ${form.secondary_color}, ${form.primary_color})`,
                  }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                </div>
                <div>
                  <div className="text-xs font-black text-white">{form.store_name}</div>
                  <div className="text-[10px] text-slate-400">{form.tagline}</div>
                </div>
              </div>
            </div>

            {/* Mock CTA Button */}
            <button
              style={{
                background: `linear-gradient(135deg, ${form.primary_color}, ${form.secondary_color})`,
              }}
              className="w-full py-2.5 rounded-xl text-white font-bold text-xs shadow-md"
            >
              Get Instant Access Now (Sample CTA)
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
