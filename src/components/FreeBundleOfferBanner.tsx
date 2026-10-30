'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { sanitizeOfferBannerUrl } from '@/lib/freeBundleOffer';

interface FreeBundleOfferBannerProps {
  variant?: 'home' | 'checkout' | 'product';
  currentTotal?: number;
}

export default function FreeBundleOfferBanner({
  variant = 'home',
  currentTotal = 0,
}: FreeBundleOfferBannerProps) {
  const { setIsFreeBundleModalOpen, freeBundles, subtotal, freeBundleOffer } = useCart();

  // If the admin turned off the promotion, don't show the banner
  if (!freeBundleOffer || freeBundleOffer.enabled === false) {
    return null;
  }

  // Only render if a custom banner image has been uploaded from the Admin Panel
  const bannerImgSrc = sanitizeOfferBannerUrl(freeBundleOffer.bannerImage);
  if (!bannerImgSrc) {
    // No hardcoded Vaultzet banners allowed. Only displays when uploaded from Admin Panel!
    return null;
  }

  const bannerFallbackSrc = sanitizeOfferBannerUrl(freeBundleOffer.bannerFallbackImage);
  const effectiveTotal = currentTotal || subtotal;
  const minCart = freeBundleOffer?.minCartValue || 149;
  const freeQty = freeBundleOffer?.freeBundleQuantity || 2;
  const isUnlocked = effectiveTotal >= minCart;
  const claimedCount = freeBundles.length;

  const isCheckoutAction = variant === 'checkout' && isUnlocked;

  const content = (
    <div className="w-full flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden border border-red-500/30 bg-slate-950 shadow-[0_12px_36px_rgba(239,68,68,0.18)] group transition-all">
      {/* 1. Image Banner Uploaded from Admin Panel */}
      <Link
        href={isCheckoutAction ? '#' : '/claim-offer'}
        onClick={(e) => {
          if (isCheckoutAction) {
            e.preventDefault();
            setIsFreeBundleModalOpen(true);
          }
        }}
        prefetch={false}
        className="block w-full overflow-hidden relative cursor-pointer"
        aria-label={`Claim ${freeQty} Free Bundles Special Offer`}
      >
        <img
          key={bannerImgSrc}
          src={bannerImgSrc}
          onError={(e) => {
            if (bannerFallbackSrc) {
              (e.target as HTMLImageElement).src = bannerFallbackSrc;
            } else {
              (e.target as HTMLImageElement).style.display = 'none';
            }
          }}
          alt={
            freeBundleOffer?.headline ||
            `Special Offer - Get ${freeQty} Free Bundles on Min ₹${minCart} Order`
          }
          width={1280}
          height={480}
          loading={variant === 'home' ? 'eager' : 'lazy'}
          decoding="async"
          className="w-full h-auto object-cover block group-hover:scale-[1.01] transition-transform duration-300"
        />
      </Link>

      {/* 2. Red Gradient Button right below the banner */}
      {isCheckoutAction ? (
        <button
          type="button"
          onClick={() => setIsFreeBundleModalOpen(true)}
          className="w-full py-3.5 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-700 hover:via-rose-700 hover:to-red-700 text-white font-extrabold text-xs sm:text-sm md:text-base uppercase tracking-wider shadow-[0_0_24px_rgba(239,68,68,0.4),0_8px_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_36px_rgba(239,68,68,0.6)] flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-[1.005] active:scale-[0.99] cursor-pointer ring-1 ring-red-400/50 relative overflow-hidden"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white animate-pulse shrink-0" />
          <span className="truncate">
            {claimedCount > 0
              ? `🎁 Change Claimed Free Bundles (${claimedCount}/${freeQty})`
              : `🎁 Select Your ${freeQty} Free Bundles (₹0) Now →`}
          </span>
        </button>
      ) : (
        <Link
          href="/claim-offer"
          prefetch={false}
          className="w-full py-3.5 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-700 hover:via-rose-700 hover:to-red-700 text-white font-extrabold text-xs sm:text-sm md:text-base uppercase tracking-wider shadow-[0_0_24px_rgba(239,68,68,0.4),0_8px_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_36px_rgba(239,68,68,0.6)] flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-[1.005] active:scale-[0.99] cursor-pointer ring-1 ring-red-400/50 relative overflow-hidden"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white animate-pulse shrink-0" />
          <span className="truncate">
            {variant === 'checkout'
              ? `🎁 Add ₹${Math.max(0, minCart - effectiveTotal)} More to Claim ${freeQty} Free Bundles →`
              : freeBundleOffer?.buttonText || `🎁 Claim ${freeQty} Free Bundles on Min. ₹${minCart} Order →`}
          </span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3] shrink-0" />
        </Link>
      )}
    </div>
  );

  if (variant === 'product') {
    return <div className="w-full my-3">{content}</div>;
  }

  if (variant === 'checkout') {
    return <div className="w-full mb-6">{content}</div>;
  }

  return (
    <section aria-label="Special bundle offer banner" className="py-2 sm:py-4">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {content}
      </div>
    </section>
  );
}
