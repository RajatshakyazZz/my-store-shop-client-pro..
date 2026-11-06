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
  isDemoOrInvalidBundle,
} from '@/lib/customProducts';
import { BundleProduct } from '@/types';

export default function FreshReelsGrid() {
  const { addToCart, buyNow } = useCart();
  const [freshBundles, setFreshBundles] = useState<BundleProduct[]>(() => {
    const local = getLocalCustomProductsSync();
    const all = getAllCatalogBundles(local, BUNDLE_PRODUCTS);
    return all.filter((b) => !b.isUpcoming && !isDemoOrInvalidBundle(b)).slice(0, 8);
  });

  useEffect(() => {
    fetchCustomProducts().then((res) => {
      const all = getAllCatalogBundles(res, BUNDLE_PRODUCTS);
      setFreshBundles(all.filter((b) => !b.isUpcoming && !isDemoOrInvalidBundle(b)).slice(0, 8));
    }).catch(() => {});
  }, []);

  return (
    <section className="py-6 sm:py-8 [contain:layout_style]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Outer Section Card Wrapper */}
        <div className="rounded-[28px] sm:rounded-[36px] bg-white border border-canvas-200 p-3 sm:p-5 space-y-5 sm:space-y-6 shadow-[0_24px_48px_-36px_rgba(11,16,25,0.35)]">
          
          {/* Header Banner */}
          <div className="rounded-[22px] cm-ink-panel px-5 py-5 sm:px-7 sm:py-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_20px_40px_-26px_rgba(7,10,17,0.8)]">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="font-display text-[22px] sm:text-[28px] font-extrabold text-white tracking-[-0.025em] leading-tight flex items-center gap-2.5">
                  <span>Fresh Reels, Ready to Post</span>
                  <span className="font-sans text-[10px] px-2 py-0.5 rounded-full bg-volt text-ink font-extrabold tracking-[0.1em] hidden sm:inline-block">NEW DROP</span>
                </h2>
                <p className="text-xs sm:text-[13px] text-ink-300 font-medium mt-0.5">
                  Freshly curated reels bundles to keep your posting schedule consistent and viral.
                </p>
              </div>
            </div>

            <Link
              href="/shop"
              prefetch={false}
              className="group pl-4 pr-1.5 py-1.5 rounded-full bg-mint-500 hover:bg-mint-300 text-ink text-xs font-extrabold transition-colors shrink-0 flex items-center gap-2"
            >
              <span>View All Catalog</span>
              <span className="w-6 h-6 rounded-full bg-ink text-mint-300 flex items-center justify-center transition-transform group-hover:translate-x-0.5"><ArrowRight className="w-3.5 h-3.5" /></span>
            </Link>
          </div>

          {/* Product Cards Grid: 2 columns on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
            {freshBundles.map((bundle) => {
              const origPrice = bundle.personalOriginalPrice || 499;
              const currPrice = bundle.personalPrice || 99;
              const discount =
                origPrice > currPrice
                  ? Math.round(((origPrice - currPrice) / origPrice) * 100)
                  : 80;

              const isTrending =
                (Array.isArray(bundle.tags) && bundle.tags.includes('TRENDING')) ||
                bundle.isTrending;

              return (
                <div
                  key={bundle.id}
                  className="bg-white rounded-2xl sm:rounded-[24px] border border-canvas-200/90 shadow-sm hover:shadow-xl hover:border-leaf-400/60 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  {/* Thumbnail */}
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

                    {/* Corner Ribbon */}
                    <div className="absolute top-0 right-0 overflow-hidden w-20 h-20 sm:w-24 sm:h-24 pointer-events-none">
                      {isTrending ? (
                        <div className="absolute transform rotate-45 bg-mint-500 text-ink font-black text-[7px] sm:text-[8px] py-0.5 sm:py-1 right-[-34px] sm:right-[-32px] top-[14px] sm:top-[18px] w-[110px] sm:w-[120px] text-center shadow-md flex items-center justify-center gap-0.5">
                          <span>👑</span>
                          <span>TRENDING</span>
                        </div>
                      ) : (
                        <div className="absolute transform rotate-45 bg-mint-500 text-ink font-black text-[7.5px] sm:text-[9px] py-0.5 sm:py-1 right-[-34px] sm:right-[-32px] top-[14px] sm:top-[18px] w-[110px] sm:w-[120px] text-center shadow-md flex items-center justify-center gap-0.5">
                          <span>🔥</span>
                          <span>HOT</span>
                        </div>
                      )}
                    </div>

                    {/* 1080P Badge in Bottom Right with green dot */}
                    <span className="absolute bottom-1.5 right-1.5 sm:bottom-2.5 sm:right-2.5 px-1.5 py-0.5 sm:px-2 rounded-md text-[9px] sm:text-[10px] font-black bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-mint-500" />
                      <span>{String(bundle.resolution || '').includes('1080') ? '1080P' : 'HD'}</span>
                    </span>
                  </Link>

                  {/* Body */}
                  <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3.5">
                    <div className="space-y-1.5 sm:space-y-2">
                      <Link href={`/product/${bundle.slug}`} prefetch={false}>
                        <h3 className="font-extrabold text-xs sm:text-[14px] text-ink hover:text-leaf-600 transition-colors line-clamp-2 leading-snug min-h-[32px] sm:min-h-[40px]">
                          {bundle.title}
                        </h3>
                      </Link>

                      {/* Meta Pills */}
                      <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                        <span className="px-1.5 sm:px-2.5 py-0.5 rounded-md text-[9px] sm:text-[11px] font-black bg-leaf-50 text-leaf-900 border border-leaf-200/50">
                          {bundle.reelCount}+ Reels
                        </span>
                        <span className="px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[11px] font-bold bg-canvas text-ink-600 flex items-center gap-0.5">
                          <Film className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span>MP4</span>
                        </span>
                      </div>
                    </div>

                    {/* Pricing & Buttons */}
                    <div className="pt-2 border-t border-canvas-200 space-y-2 sm:space-y-2.5">
                      <div className="flex items-baseline justify-between gap-1 flex-wrap">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[10px] sm:text-xs text-ink-300 line-through font-semibold">
                            ₹{bundle.personalOriginalPrice}.00
                          </span>
                          <span className="text-sm sm:text-xl font-black text-ink">
                            ₹{bundle.personalPrice}.00
                          </span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black bg-mint-50 text-leaf-700 border border-mint-200/50">
                          {discount}% OFF
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                        <button
                          type="button"
                          onClick={() => addToCart(bundle, 'personal')}
                          className="py-2 sm:py-2.5 px-1.5 sm:px-2 rounded-xl bg-canvas hover:bg-canvas-200/80 text-ink border border-canvas-200 font-bold text-[10px] sm:text-xs flex items-center justify-center gap-1 transition-colors"
                        >
                          <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-leaf-600 shrink-0" />
                          <span className="truncate">Add to Cart</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => buyNow(bundle, 'personal')}
                          className="py-2 sm:py-2.5 px-1.5 sm:px-2 rounded-xl bg-mint-500 hover:bg-mint-300 text-ink font-black text-[10px] sm:text-xs flex items-center justify-center gap-1 shadow-md shadow-ink/10 active:scale-95 transition-all"
                        >
                          <span className="truncate">Buy Now</span>
                          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5] shrink-0" />
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
    </section>
  );
}
