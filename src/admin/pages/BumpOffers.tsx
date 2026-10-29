import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Sparkles,
  Save,
  Check,
  AlertCircle,
  Clock,
  Package,
  Trash2,
  RefreshCw,
  ExternalLink,
  Tag,
  DollarSign,
  Layers,
  HardDrive,
  ShieldCheck,
  Sliders,
  Lock,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { portalApi } from '../api/client';
import { GlobalBumpOffer, Product } from '../api/types';
import { useToast } from '../context/ToastContext';
import { useAdminTheme } from '../context/AdminThemeContext';
import ImageUploadField from '../components/common/ImageUploadField';

export default function BumpOffers() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const { isLight } = useAdminTheme();

  // 1. Data queries
  const { data: bumpConfig, isLoading: isConfigLoading } = useQuery({
    queryKey: ['global-bump-offer'],
    queryFn: () => portalApi.getGlobalBumpOffer(),
  });

  const { data: products = [], isLoading: isProductsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => portalApi.getProducts(),
  });

  // 2. Form state
  const [form, setForm] = useState<GlobalBumpOffer>({
    enabled: true,
    bump_type: 'store_product',
    product_id: 'bump-special-01',
    product_slug: '1500-ultimate-twisted-world-reel-bundle',
    title: '1500+ Ultimate Twisted World & Viral AI Reels Pack',
    subtitle: 'Add this exclusive bonus pack to your order & get 80% instant discount!',
    price: 99,
    regular_price: 499,
    discount_percentage: 80,
    thumbnail: 'https://reelsbundles.in/wp-content/uploads/2026/10/3200-ultimate-twisted-world-reel-bundle-reels-bundle-1-2-768x576.png',
    reel_count: 1500,
    google_drive_link: 'https://drive.google.com/drive/folders/bonus-pack-twisted-world',
  });

  const [selectedStoreProductSlug, setSelectedStoreProductSlug] = useState<string>('');
  const [productSearch, setProductSearch] = useState<string>('');

  useEffect(() => {
    if (bumpConfig) {
      setForm(bumpConfig);
      setSelectedStoreProductSlug(bumpConfig.product_slug || '');
    }
  }, [bumpConfig]);

  // Filter available products
  const availableProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.is_deleted || p.status === 'trash') return false;
      if (!productSearch.trim()) return true;
      const q = productSearch.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        String(p.id).toLowerCase().includes(q)
      );
    });
  }, [products, productSearch]);

  // Selected store product memo for Option 1
  const selectedStoreProduct = useMemo(() => {
    if (!products.length) return null;
    return (
      products.find(
        (p) =>
          (selectedStoreProductSlug && p.slug === selectedStoreProductSlug) ||
          (form.product_slug && p.slug === form.product_slug) ||
          (form.product_id && String(p.id) === String(form.product_id))
      ) || null
    );
  }, [products, selectedStoreProductSlug, form.product_slug, form.product_id]);

  // Handler when user selects a store product to be the bump offer (Option 1)
  const handleSelectProduct = (prod: Product) => {
    setSelectedStoreProductSlug(prod.slug);
    const driveLink =
      prod.google_drive_link ||
      (prod.files && prod.files[0]?.file_url) ||
      '';

    const prodPrice = prod.price || 99;
    const regPrice = prod.regular_price || prod.price * 5 || 499;
    const discount = Math.max(1, Math.round(((regPrice - prodPrice) / regPrice) * 100));

    setForm((prev) => ({
      ...prev,
      bump_type: 'store_product',
      product_id: String(prod.id),
      product_slug: prod.slug,
      title: prod.name,
      subtitle: prod.short_description || `Add this exclusive ${prod.reel_count || 1000}+ reels pack to your order!`,
      thumbnail: prod.featured_image || prev.thumbnail,
      reel_count: prod.reel_count || 1000,
      price: prodPrice,
      regular_price: regPrice,
      discount_percentage: discount,
      google_drive_link: driveLink || prev.google_drive_link,
    }));
  };

  // Live discount recalculation when price changes
  const handlePriceChange = (newPrice: number) => {
    const regPrice = form.regular_price || newPrice * 5 || 499;
    const discount = Math.max(1, Math.round(((regPrice - newPrice) / regPrice) * 100));
    setForm((prev) => ({
      ...prev,
      price: newPrice,
      discount_percentage: discount,
    }));
  };

  const handleRegularPriceChange = (newRegPrice: number) => {
    const curPrice = form.price || 99;
    const discount = Math.max(1, Math.round(((newRegPrice - curPrice) / newRegPrice) * 100));
    setForm((prev) => ({
      ...prev,
      regular_price: newRegPrice,
      discount_percentage: discount,
    }));
  };

  // 3. Save mutation
  const mutation = useMutation({
    mutationFn: (data: GlobalBumpOffer) => portalApi.updateGlobalBumpOffer(data),
    onSuccess: (saved) => {
      queryClient.setQueryData(['global-bump-offer'], saved);
      success('Bump Offer Saved', 'Global checkout bump offer updated successfully!');
    },
    onError: (err: any) => {
      error('Save Failed', err.message || 'Could not save bump offer configuration.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  const handleResetToDefault = () => {
    if (confirm('Reset global bump offer to factory default bundle?')) {
      const defaultBump: GlobalBumpOffer = {
        enabled: true,
        bump_type: 'store_product',
        product_id: 'bump-special-01',
        product_slug: '1500-ultimate-twisted-world-reel-bundle',
        title: '1500+ Ultimate Twisted World & Viral AI Reels Pack',
        subtitle: 'Add this exclusive bonus pack to your order & get 80% instant discount!',
        price: 99,
        regular_price: 499,
        discount_percentage: 80,
        thumbnail: 'https://reelsbundles.in/wp-content/uploads/2026/10/3200-ultimate-twisted-world-reel-bundle-reels-bundle-1-2-768x576.png',
        reel_count: 1500,
        google_drive_link: 'https://drive.google.com/drive/folders/bonus-pack-twisted-world',
      };
      setForm(defaultBump);
      mutation.mutate(defaultBump);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
                Checkout Bump Offer
              </h1>
              <p className={`text-xs sm:text-sm font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Configure 1-click impulse upsell displayed on the checkout page to maximize Average Order Value.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetToDefault}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
              isLight
                ? 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'
                : 'border-slate-800 text-slate-300 bg-slate-900 hover:bg-slate-800'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>
          
          <button
            type="button"
            onClick={handleSubmit}
            disabled={mutation.isPending}
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

      {/* Main Grid: Form Left, Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Form: Configuration */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          
          {/* Status & Master Switch */}
          <div className={`p-5 sm:p-6 rounded-2xl border ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
          } shadow-sm space-y-4`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-500" />
                <h2 className={`text-sm font-extrabold ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  Checkout Bump Status
                </h2>
              </div>
              
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                form.enabled
                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
              }`}>
                {form.enabled ? '● Active on Checkout' : '○ Turned Off (Hidden)'}
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
                  Enable Bump Offer on Checkout Page
                </span>
                <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  When enabled, buyers see this 1-click bonus offer on the checkout page before completing payment. When disabled, the bump offer box is completely hidden.
                </span>
              </div>
            </label>
          </div>

          {/* 2. Choose Bump Offer Type (2 Options) */}
          <div className={`p-5 sm:p-6 rounded-2xl border ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
          } shadow-sm space-y-4`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h2 className={`text-sm font-extrabold ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  Choose Bump Offer Type
                </h2>
              </div>
              <span className="text-[11px] font-bold text-amber-500">
                2 Modes Available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Ready-Made Bump (Store Catalog Product) */}
              <button
                type="button"
                onClick={() => {
                  setForm((prev) => ({ ...prev, bump_type: 'store_product' }));
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  form.bump_type === 'store_product'
                    ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30'
                    : isLight
                    ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
                        <Package className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        Option 1: Ready-Made Bump
                      </span>
                    </div>
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      form.bump_type === 'store_product' ? 'border-amber-500 bg-amber-500' : 'border-slate-500'
                    }`}>
                      {form.bump_type === 'store_product' && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Select an existing bundle from your store catalog. Title, price, image &amp; access link are fetched directly from the store as-is.
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-amber-500">
                  <Check className="w-3 h-3" />
                  <span>Catalog Bundle (Store As-Is)</span>
                </div>
              </button>

              {/* Option 2: Custom Bump Offer (Create On This Page) */}
              <button
                type="button"
                onClick={() => {
                  setForm((prev) => ({ ...prev, bump_type: 'custom' }));
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  form.bump_type === 'custom'
                    ? 'bg-purple-500/10 border-purple-500 ring-2 ring-purple-500/30'
                    : isLight
                    ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        Option 2: Custom Bump Offer
                      </span>
                    </div>
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      form.bump_type === 'custom' ? 'border-purple-500 bg-purple-500' : 'border-slate-500'
                    }`}>
                      {form.bump_type === 'custom' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Create a custom bump offer on this page. <strong>Upload cover image from gallery</strong> and enter a custom Google Drive link.
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-purple-400">
                  <Upload className="w-3 h-3" />
                  <span>Gallery Image Upload + Custom Drive</span>
                </div>
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* OPTION 1 CONTENT: READY-MADE FROM STORE CATALOG */}
          {/* ======================================================== */}
          {form.bump_type === 'store_product' && (
            <>
              {/* Select Product from Store */}
              <div className={`p-5 sm:p-6 rounded-2xl border ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
              } shadow-sm space-y-4`}>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-amber-500" />
                    <h2 className={`text-sm font-extrabold ${isLight ? 'text-slate-950' : 'text-white'}`}>
                      Select Store Bundle
                    </h2>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">
                    {products.length} Products Available
                  </span>
                </div>

                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Choose any bundle from your store. Its title, locked image, and Google Drive access link will auto-populate.
                </p>

                {/* Product Quick Picker Dropdown */}
                <div className="space-y-2">
                  <label className={`text-xs font-bold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Select Catalog Bundle
                  </label>
                  
                  <div className="relative">
                    <select
                      value={selectedStoreProductSlug}
                      onChange={(e) => {
                        const found = products.find((p) => p.slug === e.target.value);
                        if (found) handleSelectProduct(found);
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-colors ${
                        isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-900'
                          : 'bg-slate-950 border-slate-800 text-white'
                      }`}
                    >
                      <option value="">-- Choose a bundle from store --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.slug}>
                          {p.name} (₹{p.price} • {p.reel_count || 1000} Reels)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Quick Product Search & List */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className={`text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      Or Search Catalog
                    </label>
                    {productSearch && (
                      <button
                        type="button"
                        onClick={() => setProductSearch('')}
                        className="text-[11px] text-amber-500 font-bold hover:underline"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Search products by title or keywords..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className={`w-full px-3.5 py-2 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/40 ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900'
                        : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  />

                  {productSearch.trim() && (
                    <div className={`max-h-48 overflow-y-auto rounded-xl border divide-y ${
                      isLight ? 'bg-slate-50 border-slate-200 divide-slate-100' : 'bg-slate-950 border-slate-800 divide-slate-900'
                    }`}>
                      {availableProducts.slice(0, 8).map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            handleSelectProduct(p);
                            setProductSearch('');
                          }}
                          className={`p-2.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                            selectedStoreProductSlug === p.slug
                              ? 'bg-amber-500/10'
                              : isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {p.featured_image && (
                              <img
                                src={p.featured_image}
                                alt={p.name}
                                className="w-8 h-8 rounded-lg object-cover shrink-0 border border-slate-700/30"
                              />
                            )}
                            <span className={`text-xs font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                              {p.name}
                            </span>
                          </div>
                          <span className="text-xs font-black text-amber-500 shrink-0">
                            Select
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Store Bundle Details (Auto-Synced As-Is) */}
              {selectedStoreProduct && (
                <div className={`p-5 rounded-2xl border ${
                  isLight ? 'bg-amber-50/60 border-amber-200' : 'bg-amber-500/10 border-amber-500/20'
                } space-y-3`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-black text-amber-500 uppercase tracking-wider">
                        Active Store Bundle Selected
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                      Synced from Store Catalog
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    {selectedStoreProduct.featured_image && (
                      <img
                        src={selectedStoreProduct.featured_image}
                        alt={selectedStoreProduct.name}
                        className="w-16 h-16 rounded-xl object-cover border border-amber-500/30 shrink-0 shadow-sm"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className={`text-sm font-extrabold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {selectedStoreProduct.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-xs">
                        <span className="font-black text-emerald-500">₹{selectedStoreProduct.price}</span>
                        {selectedStoreProduct.regular_price && (
                          <span className="line-through text-slate-400 font-bold">₹{selectedStoreProduct.regular_price}</span>
                        )}
                        <span className="text-[11px] text-amber-500 font-bold">
                          {selectedStoreProduct.reel_count || 1000}+ Reels
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                        {selectedStoreProduct.short_description || selectedStoreProduct.description || 'Ready-made bundle from store'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-amber-500/15 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Bundle Cover, Pricing, Title &amp; Drive Link are fetched directly from your store as-is.</span>
                    <span className="font-bold text-amber-500">Store As-Is Mode</span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ======================================================== */}
          {/* OPTION 2 CONTENT: CUSTOM BUMP OFFER (SCREENSHOT 1 LAYOUT) */}
          {/* ======================================================== */}
          {form.bump_type === 'custom' && (
            <div className={`p-5 sm:p-6 rounded-2xl border ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
            } shadow-sm space-y-4`}>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                <Tag className="w-4 h-4 text-amber-500" />
                <h2 className={`text-sm font-extrabold ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  Bump Pricing &amp; Details
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Bump Offer Price */}
                <div>
                  <label className={`text-xs font-bold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Bump Offer Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="1"
                      required
                      value={form.price}
                      onChange={(e) => handlePriceChange(Number(e.target.value))}
                      className={`w-full pl-7 pr-3.5 py-2.5 rounded-xl border text-sm font-black focus:outline-none focus:ring-2 focus:ring-amber-500/40 ${
                        isLight
                          ? 'bg-slate-50 border-slate-200 text-emerald-600'
                          : 'bg-slate-950 border-slate-800 text-emerald-400'
                      }`}
                      placeholder="99"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Amount customer pays when adding bump
                  </span>
                </div>

                {/* Regular / MRP Price */}
                <div>
                  <label className={`text-xs font-bold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    MRP / Original Price (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="1"
                      value={form.regular_price}
                      onChange={(e) => handleRegularPriceChange(Number(e.target.value))}
                      className={`w-full pl-7 pr-3.5 py-2.5 rounded-xl border text-sm font-bold line-through focus:outline-none focus:ring-2 focus:ring-amber-500/40 ${
                        isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-500'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                      placeholder="499"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Strikethrough original MRP
                  </span>
                </div>

                {/* Calculated Discount */}
                <div>
                  <label className={`text-xs font-bold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Discount Badge
                  </label>
                  <div className="flex items-center h-[42px] px-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-black">
                    {form.discount_percentage}% OFF
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Calculated automatically
                  </span>
                </div>
              </div>

              {/* Offer Title / Headline */}
              <div className="space-y-1">
                <label className={`text-xs font-bold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Offer Title / Headline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/40 ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900'
                      : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                  placeholder="1500+ Ultimate Twisted World & Viral AI Reels Pack"
                />
              </div>

              {/* Pitch / Subtitle Description */}
              <div className="space-y-1">
                <label className={`text-xs font-bold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Pitch / Subtitle Description
                </label>
                <textarea
                  rows={2}
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/40 ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900'
                      : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                  placeholder="Add this exclusive bonus pack to your order & get 80% instant discount!"
                />
              </div>

              {/* Bump Cover Image / Thumbnail (With Gallery Upload Button matching Screenshot 1) */}
              <ImageUploadField
                label="Bump Cover Image / Thumbnail"
                value={form.thumbnail}
                onChange={(url) => setForm({ ...form, thumbnail: url })}
                helperText="Cover image displayed inside the checkout bump card."
                placeholder="https://... or upload from your device gallery"
              />

              {/* Google Drive Access Link (For Bonus Fulfillment) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    <HardDrive className="w-3.5 h-3.5 text-amber-500" />
                    <span>Google Drive Access Link (For Bonus Fulfillment)</span>
                  </label>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                    Secure Delivery
                  </span>
                </div>
                <input
                  type="url"
                  placeholder="https://drive.google.com/drive/folders/bonus-pack-twisted-world"
                  value={form.google_drive_link || ''}
                  onChange={(e) => setForm({ ...form, google_drive_link: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/40 ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900'
                      : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                />
                <span className="text-[10px] text-slate-400 block">
                  Customers who add this bump receive this link on the order success confirmation page and via email.
                </span>
              </div>
            </div>
          )}

          {/* Save Button Row */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-60"
            >
              {mutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Bump Offer</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right Column: Live Interactive Checkout Preview */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          
          <div className={`p-4 rounded-2xl border ${
            isLight ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-500/10 border-amber-500/20'
          } flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className={`text-xs font-black uppercase tracking-wider ${isLight ? 'text-amber-900' : 'text-amber-400'}`}>
                Live Checkout Preview
              </span>
            </div>
            <a
              href="/checkout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-amber-500 hover:underline flex items-center gap-1"
            >
              <span>Test Store Checkout</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Actual Card Render matching /checkout layout */}
          {form.enabled ? (
            <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-amber-50/70 via-white to-amber-100/40 border-2 border-amber-400/80 shadow-md relative overflow-hidden">
              {/* Header ribbon */}
              <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-slate-950 text-amber-400 border border-amber-500/30 shadow-xs">
                  ★ SPECIAL 1-TIME OFFER
                </div>
                <div className="flex items-center gap-1.5 text-xs font-black text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200 animate-pulse">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Offer ends in 09:45</span>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <img
                  src={form.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600'}
                  alt={form.title}
                  className="w-20 sm:w-24 aspect-[4/3] rounded-xl object-cover shrink-0 border border-amber-200 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-sm text-slate-950 leading-snug">
                    {form.title || 'Bonus Reel Bundle'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {form.subtitle}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-black text-sm text-emerald-700">
                      ₹{form.price}.00
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      ₹{form.regular_price}.00
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {form.discount_percentage}% OFF
                    </span>
                  </div>
                </div>
              </div>

              {/* Switcher Toggle */}
              <label className="mt-4 pt-3 border-t border-amber-200/80 flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded text-amber-500 focus:ring-amber-500 border-slate-300 cursor-pointer"
                />
                <span className="text-xs font-extrabold text-slate-900">
                  Yes! Add this {form.reel_count || 1000}+ reels mega pack to my order for just ₹{form.price}
                </span>
              </label>
            </div>
          ) : (
            <div className={`p-8 rounded-3xl border border-dashed text-center space-y-2 ${
              isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900/50 border-slate-800'
            }`}>
              <div className="w-10 h-10 rounded-full bg-slate-500/10 flex items-center justify-center mx-auto text-slate-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className={`text-sm font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Bump Offer is Currently Disabled
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                No bump offer box will be shown to buyers on the store checkout page. Enable the toggle above to activate it.
              </p>
            </div>
          )}

          {/* Quick Info Box */}
          <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1.5 ${
            isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-slate-900/80 border-slate-800 text-slate-400'
          }`}>
            <span className="font-extrabold text-amber-500 block">💡 Pro Strategy:</span>
            <p>
              • Bump offers achieve <strong>35%–55% attach rates</strong> when priced between <strong>₹49 – ₹99</strong>.
            </p>
            <p>
              • You can also assign <strong>specific custom bump offers</strong> for individual products in the <em>Upload Product &gt; Bump Offer</em> tab.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
