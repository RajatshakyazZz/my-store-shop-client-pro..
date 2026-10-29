'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Sparkles, ArrowRight, FolderKanban, Flame, Tag } from 'lucide-react';
import { BUNDLE_PRODUCTS } from '@/data/bundles';

export default function SelectProductToResellPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(BUNDLE_PRODUCTS.map((p) => p.category)))];

  const filtered = BUNDLE_PRODUCTS.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.tags && p.tags.some((t: string) => t.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-red-100 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-[#dc2626] text-[10px] font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 1: Choose Bundle</span>
        </div>
        <div className="space-y-1">
          <h1 className="text-xl sm:text-3xl font-black text-[#162048] tracking-tight">
            Select a Viral Reels Bundle to Resell
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">
            Pick any high-converting bundle from our catalog. You can set your own price, write your own marketing copy, and start earning instantly.
          </p>
        </div>

        {/* Search Input & Category Pills */}
        <div className="pt-2 space-y-3">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, niche, or topic (e.g. AI, Gym, Devotional)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50/70 border border-red-100 text-xs font-medium text-[#162048] focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 shadow-2xs"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#dc2626] text-white shadow-xs'
                    : 'bg-white border border-red-100 text-slate-600 hover:bg-red-50/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-red-100 shadow-xs space-y-2">
          <FolderKanban className="w-10 h-10 text-rose-200 mx-auto" />
          <h3 className="text-sm font-black text-[#162048]">No Reels Bundles Found</h3>
          <p className="text-xs text-slate-400 font-medium">
            Try adjusting your search query or selecting a different category filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filtered.map((product) => {
            const basePrice = Number(product.personalPrice || 299);
            const suggestedResale = basePrice + 200;

            return (
              <div
                key={product.id}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-red-100/90 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-red-200 transition-all group"
              >
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-inner">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5 text-pink-400" />
                      <span>{product.category}</span>
                    </div>

                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-emerald-500/90 backdrop-blur-md text-[10px] font-black text-white">
                      Instant Delivery
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-[#162048] line-clamp-1 group-hover:text-[#dc2626] transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 font-medium leading-relaxed">
                      {product.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-purple-50 mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                      Base Store Price
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-black text-[#162048]">₹{basePrice}</span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.2 rounded-md">
                        Earn ₹200+
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/earn/create/${product.id}`}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-red-500/20 hover:scale-[1.03] active:scale-[0.97] transition-all"
                  >
                    <span>Resell This</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
