'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Check,
  Copy,
  ExternalLink,
  AlertCircle,
  TrendingUp,
  Share2,
  DollarSign,
  Package,
  Layers,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react';
import { BUNDLE_PRODUCTS } from '@/data/bundles';
import { useResellerAuth } from '@/context/ResellerAuthContext';
import { createResellerListing } from '@/lib/resellerService';
import { ResellerListing } from '@/types/reseller';

interface CreateListingPageProps {
  params: Promise<{ productId: string }>;
}

export default function CreateListingWizard({ params }: CreateListingPageProps) {
  const { productId } = use(params);
  const router = useRouter();
  const { user, profile } = useResellerAuth();

  // Find original product by id or slug
  const product = BUNDLE_PRODUCTS.find((p) => p.id === productId || p.slug === productId);

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form states
  const basePrice = Number(product?.personalPrice || 299);
  const [customTitle, setCustomTitle] = useState(product?.title || '');
  const [customSubtitle, setCustomSubtitle] = useState('Premium Ready-to-Post HD Reels Bundle');
  const [customShortDescription, setCustomShortDescription] = useState(product?.shortDescription || '');
  const [customDescription, setCustomDescription] = useState(product?.description || product?.shortDescription || '');
  const [resalePrice, setResalePrice] = useState<number>(basePrice + 100);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdListing, setCreatedListing] = useState<ResellerListing | null>(null);
  const [copied, setCopied] = useState(false);

  if (!product) {
    return (
      <div className="p-8 rounded-3xl bg-white border border-purple-100 text-center space-y-4">
        <h2 className="text-lg font-black text-red-600">Product Not Found</h2>
        <p className="text-xs text-gray-500">The selected bundle does not exist or has been removed.</p>
        <Link href="/earn/create" className="inline-block px-4 py-2 rounded-xl bg-purple-100 text-[#6734f7] text-xs font-bold">
          Choose Another Product
        </Link>
      </div>
    );
  }

  const grossMargin = Number(resalePrice) - basePrice;
  const isPriceValid = Number(resalePrice) > basePrice;

  const handleNext = () => {
    setError(null);
    if (step === 2) {
      if (!customTitle.trim()) {
        setError('Please enter a product title');
        return;
      }
    }
    if (step === 3) {
      if (!isPriceValid) {
        setError(`Resale price must be greater than original base price of ₹${basePrice}`);
        return;
      }
    }
    setStep((prev) => (Math.min(prev + 1, 4) as any));
  };

  const handlePublish = async () => {
    if (!user) {
      setError('You must be signed in to create a reseller link');
      return;
    }
    if (!isPriceValid) {
      setError(`Resale price must be greater than base price of ₹${basePrice}`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const listing = await createResellerListing({
        userId: user.uid,
        resellerName: profile?.displayName || user.displayName || user.email?.split('@')[0] || 'Partner',
        originalProductId: product.id,
        customTitle: customTitle.trim(),
        customSubtitle: customSubtitle.trim(),
        customShortDescription: customShortDescription.trim(),
        customDescription: customDescription.trim(),
        resalePrice: Number(resalePrice),
        coverImage: product.thumbnail,
      });

      setCreatedListing(listing);
      setStep(5);
    } catch (err: any) {
      setError(err?.message || 'Failed to create reseller listing');
    } finally {
      setIsLoading(false);
    }
  };

  const shareUrl = typeof window !== 'undefined' && createdListing ? `${window.location.origin}/r/${createdListing.slug}` : '';

  const copyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20 sm:pb-8">
      {/* Header & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/earn/create"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#6734f7] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Product Selection</span>
        </Link>

        {step < 5 && (
          <div className="text-xs font-black text-purple-600">
            Step {step} of 4
          </div>
        )}
      </div>

      {/* Progress Pills */}
      {step < 5 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {['Confirm Product', 'Customize Copy', 'Set Price & Margin', 'Review & Publish'].map((label, idx) => {
            const stepNum = idx + 1;
            const isCompleted = step > stepNum;
            const isCurrent = step === stepNum;
            return (
              <div
                key={label}
                className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? 'bg-purple-50 border-[#6734f7] text-[#6734f7] font-black shadow-xs'
                    : isCompleted
                    ? 'bg-green-50 border-green-200 text-green-700 font-bold'
                    : 'bg-white border-gray-200 text-gray-400 font-medium'
                } text-[11px] truncate`}
              >
                {stepNum}. {label}
              </div>
            );
          })}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: CONFIRM PRODUCT */}
      {step === 1 && (
        <div className="p-5 sm:p-8 rounded-3xl bg-white border border-purple-100 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-black text-[#162048]">Step 1: Confirm Base Product</h2>
            <p className="text-xs text-slate-500 mt-1">
              Verify the underlying reels bundle. Ztore Digital automatically handles secure file delivery to your buyers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full sm:w-44 aspect-video sm:aspect-square object-cover rounded-xl bg-slate-900 shrink-0"
            />
            <div className="space-y-2 flex-1 min-w-0">
              <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-[#6734f7] font-bold text-[10px] uppercase">
                {product.category}
              </span>
              <h3 className="text-base font-black text-[#162048]">{product.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                {product.shortDescription}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-[11px]">
                <div className="p-2 rounded-lg bg-white border border-purple-50">
                  <span className="text-gray-400 block text-[9px] font-bold uppercase">Reel Count</span>
                  <span className="font-black text-[#162048]">{product.reelCount || 1000}+ Reels</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-purple-50">
                  <span className="text-gray-400 block text-[9px] font-bold uppercase">Official Base Price</span>
                  <span className="font-black text-[#6734f7]">₹{basePrice}</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-purple-50 col-span-2 sm:col-span-1">
                  <span className="text-gray-400 block text-[9px] font-bold uppercase">Delivery</span>
                  <span className="font-black text-green-600">Google Drive Access</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleNext}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#6734f7] to-[#ec288d] text-white text-xs font-black flex items-center justify-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
              <span>Continue to Customization</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: CUSTOMIZE LISTING */}
      {step === 2 && (
        <div className="p-5 sm:p-8 rounded-3xl bg-white border border-purple-100 shadow-xs space-y-5">
          <div>
            <h2 className="text-xl font-black text-[#162048]">Step 2: Customize Your Marketing Text</h2>
            <p className="text-xs text-slate-500 mt-1">
              You can personalize the title and sales pitch to best match your target audience or niche.
            </p>
          </div>

          <div className="space-y-4 text-xs font-medium">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Custom Product Title</label>
              <input
                type="text"
                required
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. 1000+ Viral AI Motivational Reels Bundle"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#162048] focus:outline-none focus:border-[#6734f7] focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Promotional Subtitle</label>
              <input
                type="text"
                value={customSubtitle}
                onChange={(e) => setCustomSubtitle(e.target.value)}
                placeholder="e.g. Instant Google Drive Download • Ready to Post • High Quality"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-[#162048] focus:outline-none focus:border-[#6734f7] focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Short Description (Hook)</label>
              <textarea
                rows={2}
                value={customShortDescription}
                onChange={(e) => setCustomShortDescription(e.target.value)}
                placeholder="A compelling 1-2 sentence hook highlighting the main value."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-[#162048] focus:outline-none focus:border-[#6734f7] focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Full Description</label>
              <textarea
                rows={4}
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                placeholder="Describe what is inside the bundle, why creators need it, and how it helps them grow."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-[#162048] focus:outline-none focus:border-[#6734f7] focus:ring-2 focus:ring-purple-100"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6734f7] to-[#ec288d] text-white text-xs font-black flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
              <span>Continue to Pricing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SET PRICE & MARGIN CALCULATOR */}
      {step === 3 && (
        <div className="p-5 sm:p-8 rounded-3xl bg-white border border-purple-100 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-black text-[#162048]">Step 3: Set Your Resale Price</h2>
            <p className="text-xs text-slate-500 mt-1">
              Base price is ₹{basePrice}. Set any price higher than this. You keep 100% of the difference!
            </p>
          </div>

          {/* Pricing Controls & Margin Calculator Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#162048] to-[#2b1754] text-white space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1">
                  Your Selling Price (₹ INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-sm font-black text-gray-400">₹</span>
                  <input
                    type="number"
                    min={basePrice + 1}
                    max={99999}
                    value={resalePrice}
                    onChange={(e) => setResalePrice(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-black text-lg focus:outline-none focus:border-pink-400"
                  />
                </div>
                <span className="text-[10px] text-purple-200/80 mt-1 block">
                  Minimum allowed: ₹{basePrice + 1}
                </span>
              </div>

              {/* Live Margin Calculation */}
              <div className="p-4 rounded-xl bg-white/10 border border-white/10 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-pink-300 tracking-wider">
                  Your Net Margin Per Sale
                </span>
                <div className={`text-2xl font-black ${isPriceValid ? 'text-green-400' : 'text-red-400'}`}>
                  {isPriceValid ? `+₹${grossMargin}` : 'Invalid Price'}
                </div>
                <span className="text-[10px] text-slate-300 block">
                  (₹{resalePrice} customer price &minus; ₹{basePrice} base price)
                </span>
              </div>
            </div>

            {/* Quick Price Suggestions */}
            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[11px] text-purple-200 font-bold">Suggested:</span>
              {[basePrice + 50, basePrice + 100, basePrice + 200, basePrice + 300].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setResalePrice(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-colors ${
                    resalePrice === p ? 'bg-pink-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  ₹{p} (+₹{p - basePrice})
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="button"
              disabled={!isPriceValid}
              onClick={handleNext}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6734f7] to-[#ec288d] text-white text-xs font-black flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 cursor-pointer"
            >
              <span>Preview Product Page</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: LIVE PREVIEW & PUBLISH */}
      {step === 4 && (
        <div className="p-5 sm:p-8 rounded-3xl bg-white border border-purple-100 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#162048]">Step 4: Live Customer Preview</h2>
              <p className="text-xs text-slate-500 mt-1">
                This is exactly how your customer will see the product on your unique link.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-[#6734f7] text-[10px] font-black uppercase">
              Preview Mode
            </span>
          </div>

          {/* Realistic Landing Preview Box */}
          <div className="rounded-2xl border-2 border-red-200 overflow-hidden shadow-sm bg-white">
            <div className="p-3 bg-red-50 border-b border-red-100 flex items-center justify-between text-[11px] text-gray-500">
              <span className="font-bold">Landing URL: /r/your-slug</span>
              <span className="text-green-600 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SSL Secured</span>
              </span>
            </div>

            <div className="p-6 space-y-4">
              <div className="aspect-video w-full max-w-md mx-auto rounded-xl overflow-hidden bg-slate-900 shadow-sm">
                <img src={product.thumbnail} alt={customTitle} className="w-full h-full object-cover" />
              </div>

              <div className="text-center space-y-2 max-w-lg mx-auto">
                <span className="text-xs font-bold text-[#6734f7] uppercase tracking-wider">
                  {customSubtitle}
                </span>
                <h3 className="text-xl font-black text-[#162048]">{customTitle}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {customShortDescription}
                </p>

                <div className="pt-2">
                  <div className="text-2xl font-black text-[#162048]">₹{resalePrice}.00</div>
                  <span className="text-[10px] text-gray-400">One-time purchase • Instant Google Drive Delivery</span>
                </div>

                <div className="pt-2 max-w-xs mx-auto">
                  <button
                    type="button"
                    disabled
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6734f7] to-[#ec288d] text-white font-black text-xs shadow-md opacity-90 cursor-not-allowed"
                  >
                    Buy Now — ₹{resalePrice}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Margin Summary Callout */}
          <div className="p-4 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
              <div>
                <h4 className="text-xs font-black text-green-900">Your Net Margin: +₹{grossMargin}</h4>
                <p className="text-[11px] text-green-700">Credited directly to your wallet on every verified sale.</p>
              </div>
            </div>
            <span className="text-xs font-black text-green-800">100% Margin Retention</span>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50"
            >
              Back to Pricing
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={handlePublish}
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#6734f7] to-[#ec288d] text-white text-xs font-black flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'Generating Link...' : 'Publish & Get Share Link'}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: SUCCESS & SHARE LINK */}
      {step === 5 && createdListing && (
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-purple-100 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-sm">
            <Check className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-[#162048]">Your Reseller Link is Ready!</h2>
            <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
              Share this exclusive link. Every time someone buys through it, ₹{createdListing.grossMargin} will be automatically credited to your wallet.
            </p>
          </div>

          {/* Link Box */}
          <div className="max-w-xl mx-auto p-4 rounded-2xl bg-purple-50/70 border border-purple-200 flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 text-left min-w-0">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Your Shareable URL</span>
              <span className="text-xs font-black text-[#6734f7] truncate block select-all">
                {shareUrl}
              </span>
            </div>
            <button
              type="button"
              onClick={copyLink}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#6734f7] hover:bg-[#5827dc] text-white text-xs font-black flex items-center justify-center gap-1.5 transition-colors shadow-sm shrink-0 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          {/* Social Share Buttons */}
          <div className="pt-2 max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold text-gray-500 block">Share Directly to Social Platforms</span>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `Check out ${createdListing.customTitle} on Ztore Digital!\nInstant Download: ${shareUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(
                  createdListing.customTitle
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>Telegram</span>
              </a>

              {/* X / Twitter */}
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(
                  `Get ${createdListing.customTitle} — viral ready-to-post reels!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>X (Twitter)</span>
              </a>

              {/* Open Public Page */}
              <Link
                href={`/r/${createdListing.slug}`}
                target="_blank"
                className="px-4 py-2.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-[#6734f7] text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <span>View Live Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Navigation CTAs */}
          <div className="pt-6 border-t border-purple-50 flex items-center justify-center gap-4">
            <Link
              href="/earn/products"
              className="text-xs font-bold text-gray-600 hover:text-[#6734f7]"
            >
              View My Products List
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/earn/dashboard"
              className="text-xs font-black text-[#6734f7] hover:underline"
            >
              Go to Reseller Dashboard &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
