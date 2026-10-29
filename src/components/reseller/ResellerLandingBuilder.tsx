'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  Zap,
  Check,
  Copy,
  ExternalLink,
  AlertCircle,
  Eye,
  Smartphone,
  Monitor,
  Flame,
  CheckCircle2,
  Plus,
  Trash2,
  Palette,
  Layers,
  DollarSign,
  Share2,
  Lock,
  ArrowRight,
  Star,
  Download,
  FolderOpen,
  Clock,
  Video,
} from 'lucide-react';
import { BundleProduct } from '@/types';
import { ResellerListing, ListingThemePreset, ListingStatus } from '@/types/reseller';
import { useResellerAuth } from '@/context/ResellerAuthContext';
import {
  createResellerListing,
  updateResellerListing,
  getWhatsAppShareUrl,
  generateShareText,
} from '@/lib/resellerService';
import { WhatsAppSvgIcon } from '@/components/WhatsAppButton';

interface ResellerLandingBuilderProps {
  originalProduct: BundleProduct;
  initialListing?: ResellerListing | null;
  mode: 'create' | 'edit';
}

const THEME_OPTIONS: { id: ListingThemePreset; name: string; gradient: string; dotColor: string }[] = [
  { id: 'dark', name: 'Dark Violet', gradient: 'from-[#6734f7] to-[#ec288d]', dotColor: 'bg-[#6734f7]' },
  { id: 'midnight', name: 'Midnight Cyan', gradient: 'from-cyan-500 to-blue-600', dotColor: 'bg-cyan-400' },
  { id: 'neon', name: 'Neon Pink', gradient: 'from-fuchsia-500 to-purple-600', dotColor: 'bg-fuchsia-400' },
  { id: 'sunset', name: 'Sunset Amber', gradient: 'from-amber-500 to-rose-600', dotColor: 'bg-amber-400' },
  { id: 'emerald', name: 'Emerald Forest', gradient: 'from-emerald-500 to-teal-600', dotColor: 'bg-emerald-400' },
  { id: 'minimal', name: 'Modern Slate', gradient: 'from-indigo-500 to-violet-600', dotColor: 'bg-indigo-400' },
];

export default function ResellerLandingBuilder({
  originalProduct,
  initialListing,
  mode,
}: ResellerLandingBuilderProps) {
  const router = useRouter();
  const { user, profile } = useResellerAuth();

  const basePrice = Number(originalProduct.personalPrice || 299);

  // Form states
  const [customTitle, setCustomTitle] = useState(initialListing?.customTitle || originalProduct.title || '');
  const [customHeadline, setCustomHeadline] = useState(initialListing?.customHeadline || originalProduct.title || '');
  const [customSubtitle, setCustomSubtitle] = useState(
    initialListing?.customSubtitle || 'Premium Ready-to-Post HD Reels Bundle'
  );
  const [customShortDescription, setCustomShortDescription] = useState(
    initialListing?.customShortDescription || originalProduct.shortDescription || ''
  );
  const [customDescription, setCustomDescription] = useState(
    initialListing?.customDescription || originalProduct.description || ''
  );
  const [resalePrice, setResalePrice] = useState<number>(
    initialListing ? initialListing.resalePrice : basePrice + 100
  );
  const [promoBadge, setPromoBadge] = useState(initialListing?.promoBadge || '🔥 70% OFF TODAY');
  const [ctaText, setCtaText] = useState(initialListing?.ctaText || 'Download HD Bundle Now');
  const [themePreset, setThemePreset] = useState<ListingThemePreset>(
    initialListing?.themePreset || 'dark'
  );
  const [coverImage, setCoverImage] = useState(
    initialListing?.coverImage || originalProduct.thumbnail || (originalProduct as any)?.featuredImage || ''
  );
  const [whatsappButtonEnabled, setWhatsappButtonEnabled] = useState<boolean>(
    initialListing?.whatsappButtonEnabled !== false
  );
  const [whatsappNumber, setWhatsappNumber] = useState<string>(
    initialListing?.whatsappNumber || ''
  );

  const defaultBenefits = [
    'Instant Google Drive Access directly after checkout',
    '1080x1920 Full HD Vertical Format for Reels & Shorts',
    'Trending Background Audios & Soundtracks Included',
    'Zero Watermarks — 100% Commercial-Ready',
    'Lifetime Cloud Download & Future Updates Included',
  ];

  const [benefits, setBenefits] = useState<string[]>(
    initialListing?.benefits && initialListing.benefits.length > 0
      ? initialListing.benefits
      : defaultBenefits
  );

  const [features, setFeatures] = useState<string[]>(
    initialListing?.features && initialListing.features.length > 0
      ? initialListing.features
      : originalProduct.features || [
          'Over 1,000+ viral reel concepts in high definition',
          'Category organized folders for effortless posting',
          'Fully compatible with CapCut, Premiere, InShot & Canva',
          'Optimized for Instagram, YouTube Shorts, and Facebook',
        ]
  );

  const [galleryImages, setGalleryImages] = useState<string[]>(
    initialListing?.galleryImages || originalProduct.galleryImages || []
  );

  const [newBenefitInput, setNewBenefitInput] = useState('');
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [newGalleryInput, setNewGalleryInput] = useState('');

  // UI state
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'pricing' | 'content' | 'visuals' | 'benefits' | 'whatsapp'>('pricing');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publishedListing, setPublishedListing] = useState<ResellerListing | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Mark dirty on changes
  useEffect(() => {
    setIsDirty(true);
  }, [
    customTitle,
    customHeadline,
    customSubtitle,
    customShortDescription,
    customDescription,
    resalePrice,
    promoBadge,
    ctaText,
    themePreset,
    coverImage,
    benefits,
    features,
    whatsappButtonEnabled,
    whatsappNumber,
  ]);

  // Unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !publishedListing) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, publishedListing]);

  // Calculations
  const grossMargin = Number(resalePrice) - basePrice;
  const isPriceValid = Number(resalePrice) > basePrice;

  // Add item helpers
  const handleAddBenefit = () => {
    if (!newBenefitInput.trim()) return;
    setBenefits([...benefits, newBenefitInput.trim()]);
    setNewBenefitInput('');
  };

  const handleRemoveBenefit = (idx: number) => {
    setBenefits(benefits.filter((_, i) => i !== idx));
  };

  const handleAddFeature = () => {
    if (!newFeatureInput.trim()) return;
    setFeatures([...features, newFeatureInput.trim()]);
    setNewFeatureInput('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleAddGallery = () => {
    if (!newGalleryInput.trim()) return;
    setGalleryImages([...galleryImages, newGalleryInput.trim()]);
    setNewGalleryInput('');
  };

  const handleRemoveGallery = (idx: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== idx));
  };

  // Submit handler (Draft or Publish)
  const handleSubmit = async (targetStatus: ListingStatus) => {
    setError(null);

    if (!user) {
      setError('Please sign in to save your listing.');
      return;
    }

    if (!customTitle.trim()) {
      setError('Please enter a product title.');
      setActiveTab('pricing');
      return;
    }

    if (!isPriceValid) {
      setError(`Resale price must be greater than wholesale base price (₹${basePrice}).`);
      setActiveTab('pricing');
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        const created = await createResellerListing({
          userId: user.uid,
          resellerName: profile?.displayName || user.displayName || user.email?.split('@')[0] || 'Reseller',
          originalProductId: originalProduct.id,
          customTitle: customTitle.trim(),
          customHeadline: customHeadline.trim(),
          customSubtitle: customSubtitle.trim(),
          customShortDescription: customShortDescription.trim(),
          customDescription: customDescription.trim(),
          benefits,
          features,
          coverImage: coverImage.trim(),
          galleryImages,
          ctaText: ctaText.trim(),
          themePreset,
          promoBadge: promoBadge.trim(),
          resalePrice: Number(resalePrice),
          whatsappButtonEnabled,
          whatsappNumber: whatsappNumber.trim(),
          status: targetStatus,
        });
        setIsDirty(false);
        setPublishedListing(created);
      } else if (initialListing) {
        await updateResellerListing(initialListing.id, user.uid, {
          customTitle: customTitle.trim(),
          customHeadline: customHeadline.trim(),
          customSubtitle: customSubtitle.trim(),
          customShortDescription: customShortDescription.trim(),
          customDescription: customDescription.trim(),
          benefits,
          features,
          coverImage: coverImage.trim(),
          galleryImages,
          ctaText: ctaText.trim(),
          themePreset,
          promoBadge: promoBadge.trim(),
          resalePrice: Number(resalePrice),
          whatsappButtonEnabled,
          whatsappNumber: whatsappNumber.trim(),
          status: targetStatus,
        });
        setIsDirty(false);
        setPublishedListing({
          ...initialListing,
          customTitle,
          customHeadline,
          customSubtitle,
          customShortDescription,
          customDescription,
          benefits,
          features,
          coverImage,
          galleryImages,
          ctaText,
          themePreset,
          promoBadge,
          resalePrice: Number(resalePrice),
          grossMargin: Number(resalePrice) - basePrice,
          whatsappButtonEnabled,
          whatsappNumber: whatsappNumber.trim(),
          status: targetStatus,
        });
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to save listing. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyShareLink = () => {
    if (!publishedListing) return;
    const url = `${window.location.origin}/r/${publishedListing.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-purple-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/earn/products"
            className="w-10 h-10 rounded-2xl bg-purple-50 hover:bg-purple-100 text-[#162048] flex items-center justify-center transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-[#162048]">
                {mode === 'create' ? 'Create Reseller Landing Page' : 'Edit Reseller Landing Page'}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-[#6734f7] uppercase tracking-wider">
                {mode}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Based on wholesale template: <span className="font-bold text-[#162048]">{originalProduct.title}</span> (Wholesale Base: ₹{basePrice})
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          {/* Device Switcher for Preview */}
          <div className="hidden lg:flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                previewMode === 'desktop' ? 'bg-white shadow-xs text-[#162048]' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                previewMode === 'mobile' ? 'bg-white shadow-xs text-[#162048]' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
          </div>

          <button
            onClick={() => handleSubmit('paused')}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl border border-purple-200 hover:bg-purple-50 text-[#162048] text-xs font-bold transition-all disabled:opacity-50"
          >
            Save Draft
          </button>

          <button
            onClick={() => handleSubmit('active')}
            disabled={isSubmitting || !isPriceValid}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6734f7] to-[#ec288d] text-white text-xs font-black shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>{isSubmitting ? 'Publishing...' : 'Publish Listing'}</span>
          </button>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Modal if Published */}
      {publishedListing && (
        <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50 border border-emerald-200 shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-emerald-900">
                🎉 Your Reseller Listing is {publishedListing.status === 'active' ? 'Live!' : 'Saved as Draft!'}
              </h3>
              <p className="text-xs text-emerald-700 font-medium">
                Your custom link is ready. Share it across social media and keep 100% of your gross margin (₹{publishedListing.grossMargin}) per sale.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
            <div className="px-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-xs font-mono font-bold text-[#162048] truncate flex-1">
              {typeof window !== 'undefined' ? `${window.location.origin}/r/${publishedListing.slug}` : `/r/${publishedListing.slug}`}
            </div>

            <button
              onClick={copyShareLink}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-sm shrink-0"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
            </button>

            <a
              href={typeof window !== 'undefined' ? getWhatsAppShareUrl(publishedListing, window.location.origin) : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-sm shrink-0"
            >
              <Share2 className="w-4 h-4" />
              <span>WhatsApp Share</span>
            </a>

            <Link
              href={`/r/${publishedListing.slug}`}
              target="_blank"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-sm shrink-0"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Page</span>
            </Link>
          </div>
        </div>
      )}

      {/* Main Split Layout: Form on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: CUSTOMIZATION TABS & FIELDS */}
        <div className="lg:col-span-5 space-y-4">
          {/* Tab Navigation */}
          <div className="grid grid-cols-5 p-1 rounded-2xl bg-white border border-purple-100 text-[11px] sm:text-xs font-bold">
            <button
              onClick={() => setActiveTab('pricing')}
              className={`py-2 rounded-xl transition-all ${
                activeTab === 'pricing' ? 'bg-[#6734f7] text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Pricing
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`py-2 rounded-xl transition-all ${
                activeTab === 'content' ? 'bg-[#6734f7] text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Content
            </button>
            <button
              onClick={() => setActiveTab('visuals')}
              className={`py-2 rounded-xl transition-all ${
                activeTab === 'visuals' ? 'bg-[#6734f7] text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Theme
            </button>
            <button
              onClick={() => setActiveTab('benefits')}
              className={`py-2 rounded-xl transition-all ${
                activeTab === 'benefits' ? 'bg-[#6734f7] text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Features
            </button>
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                activeTab === 'whatsapp' ? 'bg-[#25D366] text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>WhatsApp</span>
            </button>
          </div>

          {/* Form Box */}
          <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-xs space-y-5">
            {/* TAB 1: PRICING & ESSENTIALS */}
            {activeTab === 'pricing' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black text-[#162048] block mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="Enter catchy product title..."
                    className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-xs text-[#162048] focus:border-[#6734f7] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-[#162048] block mb-1">
                    Your Selling Price (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs font-bold text-gray-400">₹</span>
                    <input
                      type="number"
                      value={resalePrice}
                      onChange={(e) => setResalePrice(Number(e.target.value))}
                      min={basePrice + 1}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-purple-100 text-xs font-black text-[#162048] focus:border-[#6734f7] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Profit Margin Math Card */}
                <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Wholesale Base Price:</span>
                    <span className="font-bold">₹{basePrice}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Your Selling Price:</span>
                    <span className="font-bold text-[#162048]">₹{resalePrice}</span>
                  </div>
                  <div className="border-t border-purple-200/60 pt-2 flex items-center justify-between font-black">
                    <span className="text-[#162048]">Your Profit Per Sale:</span>
                    <span className={grossMargin > 0 ? 'text-emerald-600' : 'text-red-500'}>
                      {grossMargin > 0 ? `+₹${grossMargin}` : 'Invalid Price'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-[#162048] block mb-1">
                    Promotional Tag Badge
                  </label>
                  <input
                    type="text"
                    value={promoBadge}
                    onChange={(e) => setPromoBadge(e.target.value)}
                    placeholder="e.g. 🔥 70% OFF TODAY or ⚡ BESTSELLER"
                    className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-xs text-[#162048] focus:border-[#6734f7] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-[#162048] block mb-1">
                    Call To Action Button Text
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="e.g. Download HD Bundle Now"
                    className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-xs text-[#162048] focus:border-[#6734f7] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: COPY & HEADLINES */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black text-[#162048] block mb-1">
                    Marketing Headline
                  </label>
                  <textarea
                    rows={2}
                    value={customHeadline}
                    onChange={(e) => setCustomHeadline(e.target.value)}
                    placeholder="Engaging high-converting headline..."
                    className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-xs text-[#162048] focus:border-[#6734f7] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-[#162048] block mb-1">
                    Subtitle / Pill Label
                  </label>
                  <input
                    type="text"
                    value={customSubtitle}
                    onChange={(e) => setCustomSubtitle(e.target.value)}
                    placeholder="e.g. Premium Ready-to-Post HD Reels Bundle"
                    className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-xs text-[#162048] focus:border-[#6734f7] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-[#162048] block mb-1">
                    Short Description
                  </label>
                  <textarea
                    rows={3}
                    value={customShortDescription}
                    onChange={(e) => setCustomShortDescription(e.target.value)}
                    placeholder="Brief 2-3 sentence teaser..."
                    className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-xs text-[#162048] focus:border-[#6734f7] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-[#162048] block mb-1">
                    Full Product Description
                  </label>
                  <textarea
                    rows={5}
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    placeholder="Detailed explanation of what buyers receive..."
                    className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-xs text-[#162048] focus:border-[#6734f7] focus:outline-none font-mono"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: VISUALS & THEMES */}
            {activeTab === 'visuals' && (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-black text-[#162048] block mb-2">
                    Approved Theme Preset
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {THEME_OPTIONS.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setThemePreset(t.id)}
                        className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          themePreset === t.id
                            ? 'border-[#6734f7] bg-purple-50/50 shadow-xs ring-1 ring-[#6734f7]'
                            : 'border-purple-100 hover:border-purple-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${t.dotColor}`} />
                          <span className="text-xs font-bold text-[#162048]">{t.name}</span>
                        </div>
                        {themePreset === t.id && <Check className="w-4 h-4 text-[#6734f7]" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-[#162048] block mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-xs text-[#162048] focus:border-[#6734f7] focus:outline-none"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    Defaults to original product license cover. Custom image must comply with bundle rights.
                  </p>
                </div>

                {/* Gallery Images List */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-[#162048] block">
                    Gallery Images ({galleryImages.length})
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newGalleryInput}
                      onChange={(e) => setNewGalleryInput(e.target.value)}
                      placeholder="Add gallery image URL..."
                      className="flex-1 px-3 py-2 rounded-xl border border-purple-100 text-xs focus:border-[#6734f7] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddGallery}
                      className="px-3 py-2 rounded-xl bg-purple-100 text-[#6734f7] text-xs font-bold hover:bg-purple-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {galleryImages.map((img, i) => (
                      <div key={i} className="relative group w-14 h-14 rounded-xl overflow-hidden border border-purple-100">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGallery(i)}
                          className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: BENEFITS & FEATURES */}
            {activeTab === 'benefits' && (
              <div className="space-y-5">
                {/* Benefits */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-[#162048] block">
                    Product Benefits Checklist ({benefits.length})
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newBenefitInput}
                      onChange={(e) => setNewBenefitInput(e.target.value)}
                      placeholder="e.g. 1080x1920 HD MP4 vertical video format"
                      className="flex-1 px-3 py-2 rounded-xl border border-purple-100 text-xs focus:border-[#6734f7] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddBenefit}
                      className="px-3 py-2 rounded-xl bg-purple-100 text-[#6734f7] text-xs font-bold hover:bg-purple-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {benefits.map((b, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50/50 border border-purple-100 text-xs"
                      >
                        <div className="flex items-center gap-2 text-[#162048] font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{b}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveBenefit(i)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feature Cards */}
                <div className="space-y-2 border-t border-purple-100 pt-4">
                  <label className="text-xs font-black text-[#162048] block">
                    Feature Cards ({features.length})
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeatureInput}
                      onChange={(e) => setNewFeatureInput(e.target.value)}
                      placeholder="e.g. Over 1,000+ viral reel concepts"
                      className="flex-1 px-3 py-2 rounded-xl border border-purple-100 text-xs focus:border-[#6734f7] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-3 py-2 rounded-xl bg-purple-100 text-[#6734f7] text-xs font-bold hover:bg-purple-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {features.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50/50 border border-purple-100 text-xs"
                      >
                        <span className="text-[#162048] font-medium">{f}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(i)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: WHATSAPP SUPPORT BUTTON CONFIGURATION */}
            {activeTab === 'whatsapp' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/70 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <WhatsAppSvgIcon className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-emerald-950">WhatsApp Customer Chat Button</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed font-medium">
                      Control the floating WhatsApp widget on your landing page. You can customize your own contact number, use MYZTORE support, or remove it completely.
                    </p>
                  </div>
                </div>

                {/* Main Toggle Switch: Enable / Remove */}
                <div className="p-4 rounded-2xl border border-purple-100 bg-white flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-xs font-black text-[#162048] block">
                      Show WhatsApp Button on Landing Page
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5 font-medium">
                      {whatsappButtonEnabled ? (
                        <span className="text-emerald-600 font-bold">● Active — Floating chat button is visible to buyers</span>
                      ) : (
                        <span className="text-red-500 font-bold">○ Removed — No WhatsApp button will appear on your page</span>
                      )}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setWhatsappButtonEnabled(!whatsappButtonEnabled)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                      whatsappButtonEnabled ? 'bg-[#25D366]' : 'bg-slate-300'
                    }`}
                    aria-label="Toggle WhatsApp button visibility"
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                        whatsappButtonEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Custom Number Config (Visible when button is active) */}
                {whatsappButtonEnabled ? (
                  <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 space-y-3">
                    <div>
                      <label className="text-xs font-black text-[#162048] block mb-1">
                        Your WhatsApp Number (Optional)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">+91</span>
                        <input
                          type="text"
                          value={whatsappNumber}
                          onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="9142408286"
                          className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-emerald-200 bg-white text-xs font-black text-[#162048] focus:border-[#25D366] focus:outline-none"
                        />
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1.5 font-medium leading-relaxed">
                        💡 <strong>Smart Fallback:</strong> If you leave this empty, buyers will be connected to the MYZTORE 24/7 Store Support desk (<strong className="text-slate-800">+91 9142408286</strong>) who will assist the customer and close the sale for you!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 font-medium">
                    WhatsApp button is currently <strong className="text-slate-700">disabled / removed</strong> for your landing page. Buyers will not see any chat bubble.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE LIVE PREVIEW */}
        <div className="lg:col-span-7 space-y-3 sticky top-6">
          <div className="flex items-center justify-between text-xs px-2 font-bold text-slate-500">
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#6734f7]" />
              <span>Real-Time Customer Preview</span>
            </span>
            <span className="font-mono text-[10px] text-gray-400">
              Live /r/{initialListing?.slug || 'preview'}
            </span>
          </div>

          {/* Preview Container Frame */}
          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-2 sm:p-4 shadow-2xl overflow-hidden">
            <div
              className={`mx-auto transition-all duration-300 rounded-2xl overflow-hidden ${
                previewMode === 'mobile' ? 'max-w-[375px] shadow-2xl border-4 border-slate-800' : 'w-full'
              }`}
            >
              {/* Simulated Page in Preview */}
              <div className="bg-[#0b0819] text-white p-4 sm:p-6 space-y-6 text-xs max-h-[750px] overflow-y-auto">
                {/* Header Badge */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[10px] text-white/60 font-bold">⚡ Instant Google Drive Download</span>
                  <span className="text-[10px] font-bold text-purple-400">MYZTORE Verified</span>
                </div>

                {/* Media & Badge */}
                <div className="relative aspect-[9/11] max-h-[300px] rounded-2xl overflow-hidden border border-purple-500/20 bg-slate-900 group mx-auto w-full">
                  {coverImage ? (
                    <img src={coverImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="w-12 h-12 text-white/20" />
                    </div>
                  )}

                  {promoBadge && (
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-red-600 to-pink-600 text-[10px] font-black text-white shadow-md flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-current" />
                        <span>{promoBadge}</span>
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-2 left-2 right-2 p-2 rounded-xl bg-black/60 backdrop-blur-md text-[10px] flex items-center justify-between">
                    <span>1080x1920 HD MP4</span>
                    <span className="text-green-400 font-bold">No Watermark</span>
                  </div>
                </div>

                {/* Title & Copy */}
                <div className="space-y-1.5 text-center">
                  <span className="text-[10px] text-purple-300 uppercase tracking-wider font-extrabold block">
                    {customSubtitle}
                  </span>
                  <h2 className="text-lg sm:text-xl font-black leading-tight text-white">
                    {customTitle || 'Your Product Title'}
                  </h2>
                  {customHeadline && (
                    <p className="text-[11px] text-purple-200/70 font-medium">
                      {customHeadline}
                    </p>
                  )}
                  <div className="flex items-center justify-center gap-1 text-amber-400 text-[11px] pt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                    <span className="text-white font-bold ml-1">4.9/5</span>
                    <span className="text-white/40">(340+ reviews)</span>
                  </div>
                </div>

                {/* Price Box */}
                <div className="p-4 rounded-2xl bg-white/5 border border-purple-500/20 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-white/50 block">Offer Price</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-white">₹{resalePrice}</span>
                        <span className="text-xs text-white/40 line-through">₹{Math.round(resalePrice * 1.6)}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black border border-emerald-500/20">
                      Save ₹{Math.round(resalePrice * 0.6)}
                    </span>
                  </div>

                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6734f7] to-[#ec288d] text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg">
                    <Zap className="w-4 h-4 fill-current" />
                    <span>{ctaText || 'Download HD Bundle Now'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-between text-[10px] text-white/60 pt-1 font-medium">
                    <span className="flex items-center gap-1">
                      <FolderOpen className="w-3 h-3 text-purple-400" />
                      <span>Google Drive Link</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      <span>SSL Checkout</span>
                    </span>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-1.5 text-[11px]">
                  <span className="text-[10px] font-black uppercase text-white/50 block">
                    What You Get:
                  </span>
                  {benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-white/80">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                {/* Seller Disclosure */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[9px] text-center text-white/40">
                  Authorized MYZTORE Reseller Listing • Instant Cloud Delivery
                </div>

                {/* Floating WhatsApp Live Preview Badge */}
                {whatsappButtonEnabled && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-[#128C7E]/20 to-[#25D366]/20 border border-[#25D366]/40 text-white text-[11px] font-bold">
                    <span className="flex items-center gap-1.5 text-emerald-300">
                      <WhatsAppSvgIcon className="w-4 h-4 fill-current" />
                      <span>WhatsApp Chat Badge: Active</span>
                    </span>
                    <span className="text-[10px] text-white/60">
                      {whatsappNumber ? `+91 ${whatsappNumber}` : 'MYZTORE (+91 9142408286)'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
