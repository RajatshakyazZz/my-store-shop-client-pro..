'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingCart, Film } from 'lucide-react';
import { BUNDLE_PRODUCTS } from '@/data/bundles';
import { useCart } from '@/context/CartContext';
import { optimizeImageUrl } from '@/lib/imageOptimized';
import {
  fetchCustomProducts,
  getAllCatalogBundles,
  getLocalCustomProductsSync,
} from '@/lib/customProducts';
import { BundleProduct } from '@/types';

export default function TrendingMarquee() {
  const { addToCart, buyNow } = useCart();
  const [items, setItems] = useState<BundleProduct[]>(() => {
    const local = getLocalCustomProductsSync();
    const all = getAllCatalogBundles(local, BUNDLE_PRODUCTS);
    return all.filter((b) => !b.isUpcoming).slice(0, 6);
  });

  useEffect(() => {
    fetchCustomProducts().then((res) => {
      const all = getAllCatalogBundles(res, BUNDLE_PRODUCTS);
      setItems(all.filter((b) => !b.isUpcoming).slice(0, 6));
    }).catch(() => {});
  }, []);

  const loopItems = [...items, ...items];

  return (
    <section className="py-6 sm:py-8 overflow-hidden [contain:layout_style]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Outer Section Card Wrapper */}
        <div className="rounded-[28px] sm:rounded-[36px] bg-white border border-canvas-200 p-3 sm:p-5 space-y-5 sm:space-y-6 shadow-[0_24px_48px_-36px_rgba(11,16,25,0.35)]">
          
          {/* Header Banner */}
          <div className="rounded-[22px] cm-ink-panel px-5 py-5 sm:px-7 sm:py-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_20px_40px_-26px_rgba(7,10,17,0.8)]">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="font-display text-[22px] sm:text-[28px] font-extrabold text-white tracking-[-0.025em] leading-tight flex items-center gap-2.5">
                  <span>Trending Bundles Creators Love</span>
                  <span className="font-sans text-[10px] px-2 py-0.5 rounded-full bg-volt text-ink font-extrabold tracking-[0.1em] hidden sm:inline-block">VIRAL PACKS</span>
                </h2>
                <p className="text-xs sm:text-[13px] text-ink-300 font-medium mt-0.5">
                  Popular packs creators are choosing right now.
                </p>
              </div>
            </div>

            <Link
              href="/shop"
              prefetch={false}
              className="group pl-4 pr-1.5 py-1.5 rounded-full bg-mint-500 hover:bg-mint-300 text-ink text-xs font-extrabold transition-colors shrink-0 flex items-center gap-2"
            >
              <span>View All</span>
              <span className="w-6 h-6 rounded-full bg-ink text-mint-300 flex items-center justify-center transition-transform group-hover:translate-x-0.5"><ArrowRight className="w-3.5 h-3.5" /></span>
            </Link>
          </div>

          {/* Marquee Rail inside the Section Card */}
          <div className="relative w-full overflow-hidden marquee-mask">
            <div className="flex gap-4 w-max animate-marquee hover:[animation-play-state:paused] py-2 will-change-transform">
              {loopItems.map((bundle, index) => {
                const origPrice = bundle.personalOriginalPrice || 499;
                const currPrice = bundle.personalPrice || 99;
                const discount =
                  origPrice > currPrice
                    ? Math.round(((origPrice - currPrice) / origPrice) * 100)
                    : 80;

                return (
                  <div
                    key={`${bundle.id}-${index}`}
                    className="w-72 sm:w-[305px] bg-white rounded-[24px] border border-canvas-200/90 shadow-sm hover:shadow-xl hover:border-leaf-400/60 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group shrink-0"
                  >
                    {/* 4:3 Thumbnail */}
                    <Link
                      href={`/product/${bundle.slug}`}
                      prefetch={false}
                      className="relative aspect-[4/3] overflow-hidden bg-ink block"
                    >
                      <img
                        src={optimizeImageUrl(bundle.thumbnail, 384, 75)}
                        alt={bundle.title}
                        width={384}
                        height={288}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Corner Ribbon Badge */}
                      <div className="absolute top-0 right-0 overflow-hidden w-24 h-24 pointer-events-none">
                        <div className="absolute transform rotate-45 bg-mint-500 text-ink font-black text-[9px] py-1 right-[-32px] top-[18px] w-[120px] text-center shadow-md flex items-center justify-center gap-1">
                          <span>👑</span>
                          <span>HOT</span>
                        </div>
                      </div>

                      {/* 1080P Badge in Bottom Right */}
                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-black bg-black/85 text-white border border-white/20">
                        1080P
                      </span>
                    </Link>

                    {/* Card Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
                      <div className="space-y-2">
                        {/* Title (2 lines) */}
                        <Link href={`/product/${bundle.slug}`} prefetch={false}>
                          <h3 className="font-extrabold text-[14px] text-ink hover:text-leaf-600 transition-colors line-clamp-2 leading-snug">
                            {bundle.title}
                          </h3>
                        </Link>

                        {/* Meta Pills: Reel Count & MP4 Format */}
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black bg-leaf-50 text-leaf-900 border border-leaf-200/50">
                            {bundle.reelCount}+ Reels
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-canvas text-ink-600 flex items-center gap-1">
                            <Film className="w-3 h-3" />
                            <span>MP4</span>
                          </span>
                        </div>
                      </div>

                      {/* Pricing and Action Buttons */}
                      <div className="pt-2 border-t border-canvas-200 space-y-2.5">
                        <div className="flex items-baseline justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs text-ink-300 line-through font-semibold">
                              ₹{bundle.personalOriginalPrice}.00
                            </span>
                            <span className="text-xl font-black text-ink">
                              ₹{bundle.personalPrice}.00
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-mint-50 text-leaf-700 border border-mint-200/50">
                            {discount}% OFF
                          </span>
                        </div>

                        {/* 2 Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => addToCart(bundle, 'personal')}
                            className="py-2.5 px-2 rounded-xl bg-canvas hover:bg-leaf-50 text-ink hover:text-leaf-600 border border-canvas-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <ShoppingCart className="w-3.5 h-3.5 text-leaf-600" />
                            <span>Add to Cart</span>
                          </button>

                          <button
                            onClick={() => buyNow(bundle, 'personal')}
                            className="py-2.5 px-2 rounded-xl bg-mint-500 hover:bg-mint-300 text-ink font-black text-xs flex items-center justify-center gap-1 shadow-md shadow-ink/10 active:scale-95 transition-all"
                          >
                            <span>Buy Now</span>
                            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
