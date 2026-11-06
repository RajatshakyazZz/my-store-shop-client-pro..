'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BUNDLE_PRODUCTS } from '@/data/bundles';
import { fetchCustomCategories, getLocalCategoriesSync, calculateCategoryCounts, CategoryItem } from '@/lib/categories';
import { fetchCustomProducts, getAllCatalogBundles, getLocalCustomProductsSync } from '@/lib/customProducts';
import { BundleProduct } from '@/types';

export default function CategoryGrid() {
  const [categories, setCategories] = useState<CategoryItem[]>(() => getLocalCategoriesSync());
  const [customProducts, setCustomProducts] = useState<BundleProduct[]>(() => getLocalCustomProductsSync());

  useEffect(() => {
    fetchCustomCategories(true).then((res) => {
      if (res && res.length > 0) {
        setCategories(res);
      }
    }).catch(() => {});

    fetchCustomProducts().then((res) => {
      if (res && res.length > 0) {
        setCustomProducts(res);
      }
    }).catch(() => {});
  }, []);

  const allBundles = useMemo(() => {
    return getAllCatalogBundles(customProducts, BUNDLE_PRODUCTS);
  }, [customProducts]);

  const categoryCounts = useMemo(() => {
    return calculateCategoryCounts(allBundles, categories);
  }, [allBundles, categories]);

  return (
    <section className="py-4 sm:py-6 [contain:layout_style]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Outer Section Card Wrapper */}
        <div className="rounded-[28px] sm:rounded-[34px] bg-white border border-canvas-200/90 p-4 sm:p-6 space-y-5 shadow-[0_12px_40px_rgba(11,16,25,0.03)]">
          
          {/* Midnight Slate & Vibrant Red Header Banner */}
          <div className="relative overflow-hidden rounded-[20px] cm-ink-panel border border-white/[0.06] px-5 py-4 sm:px-6 sm:py-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_20px_40px_-26px_rgba(7,10,17,0.8)]">
            {/* Decorative translucent glow on right */}
            <div className="absolute -right-10 -bottom-16 w-52 h-52 rounded-full bg-mint-500/10 blur-xl pointer-events-none" />

            <div className="flex items-stretch gap-3.5 relative z-10">
              {/* Red vertical bar indicator on left */}
              <div>
                <h2 className="text-xl sm:text-[25px] font-black text-white tracking-tight leading-tight">
                  Discover Reels for Every Niche
                </h2>
                <p className="text-xs sm:text-[13px] text-ink-300 font-medium mt-1">
                  Browse curated categories and find ready-to-post content built for your audience.
                </p>
              </div>
            </div>

            <Link
              href="/shop"
              prefetch={false}
              className="relative z-10 px-4 py-2 rounded-full bg-mint-500/15 hover:bg-mint-500/25 text-leaf-200 border border-mint-500/30 text-xs font-extrabold transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 8 Category Cards in 2 Rows of 4 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.slug}
                href={`/shop?cat=${cat.slug}`}
                prefetch={false}
                className="py-5 px-4 rounded-[20px] bg-canvas-50/70 border border-canvas-200/90 shadow-[0_2px_10px_rgba(11,16,25,0.02)] hover:shadow-[0_10px_25px_rgba(11,16,25,0.09)] hover:border-leaf-300 hover:-translate-y-0.5 transition-all text-center flex flex-col items-center justify-center group relative"
              >
                {cat.is_custom && (
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-leaf-50 text-leaf-900 border border-leaf-200/60 shadow-2xs">
                    New
                  </span>
                )}
                {/* Pastel Icon Box */}
                <div
                  style={{
                    backgroundColor: cat.bg || '#F7FEE7',
                    color: (cat as any).iconColor || '#9AE600',
                  }}
                  className="w-11 h-11 rounded-[14px] flex items-center justify-center text-lg font-bold mb-2.5 group-hover:scale-105 transition-transform"
                >
                  {cat.icon || '✨'}
                </div>
                <h3 className="font-extrabold text-[14px] sm:text-[15px] text-ink group-hover:text-leaf-600 transition-colors leading-snug">
                  {cat.name}
                </h3>
                <p className="text-[11px] font-semibold text-ink-400 mt-0.5">
                  {categoryCounts[cat.slug] ?? cat.count ?? 0} Bundles
                </p>
              </Link>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
