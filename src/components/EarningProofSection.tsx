'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  DollarSign,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  Wallet,
} from 'lucide-react';
import {
  EarningProofsConfig,
  EarningProofItem,
  getEarningProofsSync,
  fetchEarningProofs,
} from '@/lib/proofSettings';
import LightboxModal from './LightboxModal';

interface EarningProofSectionProps {
  initialConfig?: EarningProofsConfig;
  className?: string;
  showResellCta?: boolean;
}

export default function EarningProofSection({
  initialConfig,
  className = '',
  showResellCta = true,
}: EarningProofSectionProps) {
  const [config, setConfig] = useState<EarningProofsConfig>(initialConfig || getEarningProofsSync());
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchEarningProofs().then((cfg) => {
      if (cfg) setConfig(cfg);
    });
  }, []);

  const items = config.items && config.items.length > 0 ? config.items : [];

  if (!config.enabled || items.length === 0) {
    return null;
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className={`relative w-full py-14 sm:py-20 bg-slate-950 text-white overflow-hidden [contain:layout_style] ${className}`}>
      {/* Background Accent Glows */}
      <div className="absolute top-1/4 -left-20 w-[350px] h-[350px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[350px] h-[350px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-black tracking-wider uppercase mb-3 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{config.badge || '💰 VERIFIED EARNINGS & PAYOUTS'}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {config.headline || 'Real Creator & Reseller Earnings'}
            </h2>

            <p className="text-sm sm:text-base text-slate-400 mt-2 font-normal leading-relaxed">
              {config.subheadline ||
                'Genuine payment receipts, bank transfers and reseller profits made with our reels bundles.'}
            </p>
          </div>

          {/* Desktop Arrow Controls */}
          {items.length > 3 && (
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <button
                onClick={() => scroll('left')}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all hover:scale-105 active:scale-95 shadow-md"
                aria-label="Scroll proofs left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all hover:scale-105 active:scale-95 shadow-md"
                aria-label="Scroll proofs right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Proof Cards Scroll / Grid Container */}
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 px-1 no-scrollbar snap-x snap-mandatory touch-pan-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((proof, idx) => (
            <div
              key={proof.id}
              onClick={() => setActiveLightboxIndex(idx)}
              className="w-[280px] sm:w-[320px] shrink-0 snap-start rounded-3xl bg-slate-900/90 border border-white/10 hover:border-emerald-500/40 p-3 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(16,185,129,0.15)] cursor-pointer group"
            >
              {/* Top Meta Bar */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-black">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {proof.amount || 'Verified'}
                </span>

                <span className="text-[11px] font-semibold text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                  {proof.tag || 'Payment Proof'}
                </span>
              </div>

              {/* Screenshot Frame Container */}
              <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden bg-black/60 border border-white/10 mb-3.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={proof.image}
                  alt={proof.caption || 'Earning proof screenshot'}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500 pointer-events-none select-none"
                />

                {/* Subtle Inner Glow Border */}
                <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />

                {/* Hover / Tap Zoom Pill */}
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-medium border border-white/15 flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tap to view</span>
                </div>
              </div>

              {/* Bottom Details */}
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-semibold text-slate-200 line-clamp-2 leading-snug">
                  {proof.caption || 'Verified Reseller Payout'}
                </p>
                {proof.date && (
                  <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between pt-1">
                    <span>{proof.date}</span>
                    <span className="text-emerald-400 font-bold text-[10px] uppercase tracking-wider">
                      ✓ Instant Settled
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Swipe Notice */}
        <div className="text-center mt-4 text-xs text-slate-500 sm:hidden">
          👉 Swipe horizontally to view all earning proofs
        </div>

        {/* Resell & Earn Action Banner */}
        {showResellCta && (
          <div className="mt-12 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-purple-950/60 border border-emerald-500/20 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Want to Earn Daily Like Them?
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Get Reseller Rights on any bundle and keep 100% margin on every customer sale.
                </p>
              </div>
            </div>

            <a
              href="/earn"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 shrink-0"
            >
              <span>Start Reselling Today</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>

      {/* Full-Screen Lightbox for Earning Proofs */}
      <LightboxModal
        isOpen={activeLightboxIndex !== null}
        onClose={() => setActiveLightboxIndex(null)}
        items={items.map((it) => ({
          id: it.id,
          image: it.image,
          title: `${it.amount} — ${it.tag}`,
          subtitle: it.caption,
          badge: 'Verified Payout',
        }))}
        currentIndex={activeLightboxIndex ?? 0}
        onNavigate={setActiveLightboxIndex}
      />
    </section>
  );
}
