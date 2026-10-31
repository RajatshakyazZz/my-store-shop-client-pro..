'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, ArrowRight, ArrowUpRight, Play } from 'lucide-react';
import { ALL_ACCESS_PLANS } from '@/data/bundles';
import { fetchCustomProductBySlug } from '@/lib/customProducts';

export default function MembershipPlans() {
  const [selectedTab, setSelectedTab] = useState<'personal' | 'reseller'>('personal');
  const [plans, setPlans] = useState(ALL_ACCESS_PLANS);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetchCustomProductBySlug('all-bundles-personal-use', true),
      fetchCustomProductBySlug('all-bundles-reseller-rights', true),
    ])
      .then(([personalLive, resellerLive]) => {
        if (!isMounted) return;
        setPlans((prev) => {
          const updated = [...prev];
          if (personalLive) {
            const pPrice = Number(personalLive.personalPrice ?? (personalLive as any).price ?? updated[0].price);
            const pOrig = Number(personalLive.personalOriginalPrice ?? (personalLive as any).regular_price ?? updated[0].originalPrice);
            const pDisc = Math.round(((pOrig - pPrice) / Math.max(1, pOrig)) * 100);
            updated[0] = {
              ...updated[0],
              name: personalLive.title || updated[0].name,
              price: pPrice,
              originalPrice: pOrig,
              discountPercentage: pDisc > 0 ? pDisc : updated[0].discountPercentage,
            };
          }
          if (resellerLive) {
            const rPrice = Number(resellerLive.personalPrice ?? (resellerLive as any).price ?? updated[1].price);
            const rOrig = Number(resellerLive.personalOriginalPrice ?? (resellerLive as any).regular_price ?? updated[1].originalPrice);
            const rDisc = Math.round(((rOrig - rPrice) / Math.max(1, rOrig)) * 100);
            updated[1] = {
              ...updated[1],
              name: resellerLive.title || updated[1].name,
              price: rPrice,
              originalPrice: rOrig,
              discountPercentage: rDisc > 0 ? rDisc : updated[1].discountPercentage,
            };
          }
          return updated;
        });
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const isReseller = selectedTab === 'reseller';
  const currentPlan = isReseller ? plans[1] : plans[0];
  const targetProductSlug = isReseller ? 'all-bundles-reseller-rights' : 'all-bundles-personal-use';

  return (
    <section id="vaultworld-plans" className="py-6 sm:py-10 [contain:layout_style]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Outer Section Card Wrapper */}
        <div className="relative rounded-[28px] sm:rounded-[34px] bg-white border border-slate-200/90 p-4 sm:p-7 space-y-6 shadow-[0_12px_40px_rgba(15,23,42,0.04)] overflow-hidden">
          
          {/* Top Gradient Accent Bar */}
          <div className="absolute top-0 left-6 right-6 h-[3px] bg-gradient-to-r from-red-600 via-rose-500 to-red-600 rounded-b-full" />

          {/* Centered Midnight Slate & Imperial Red Header Banner */}
          <div className="max-w-[660px] mx-auto relative rounded-[20px] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-6 py-5 sm:px-8 sm:py-6 text-white border border-red-500/35 shadow-[0_14px_35px_rgba(0,0,0,0.3)] overflow-hidden">
            {/* Subtle glossy curve in top-right */}
            <div className="pointer-events-none absolute -top-12 -right-8 w-44 h-44 rounded-full bg-red-500/10 blur-xl" />
            {/* Left vertical red indicator bar */}
            <div className="hidden sm:block absolute left-3.5 top-4 bottom-4 w-[4px] bg-gradient-to-b from-red-500 to-rose-600 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]" />

            <div className="relative text-center space-y-1.5">
              <h2 className="text-xl sm:text-[29px] font-black text-white tracking-tight leading-tight">
                Unlock Every Reels Bundle in One Plan
              </h2>
              <p className="text-xs sm:text-[13.5px] text-slate-300 font-medium max-w-md mx-auto leading-relaxed">
                Choose Personal or Reseller access, pay once,
                <br className="hidden sm:inline" /> and unlock every bundle included with your plan.
              </p>
            </div>
          </div>

          {/* Segmented Tab Switcher (Personal vs Reseller) */}
          <div className="max-w-[530px] mx-auto bg-slate-100 p-1.5 rounded-[18px] grid grid-cols-2 gap-1.5 border border-slate-200">
            <button
              type="button"
              onClick={() => setSelectedTab('personal')}
              className={`py-2.5 px-4 rounded-[14px] text-left transition-all ${
                !isReseller
                  ? 'bg-white shadow-[0_2px_10px_rgba(15,23,42,0.06)] border border-slate-200/90'
                  : 'hover:bg-white/50 border border-transparent'
              }`}
            >
              <div
                className={`text-xs sm:text-[13.5px] font-extrabold ${
                  !isReseller ? 'text-red-600' : 'text-slate-600'
                }`}
              >
                Personal
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                For your own pages
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTab('reseller')}
              className={`py-2.5 px-4 rounded-[14px] text-left transition-all flex items-start justify-between gap-2 ${
                isReseller
                  ? 'bg-white shadow-[0_2px_10px_rgba(15,23,42,0.06)] border border-slate-200/90'
                  : 'hover:bg-white/50 border border-transparent'
              }`}
            >
              <div>
                <div
                  className={`text-xs sm:text-[13.5px] font-extrabold ${
                    isReseller ? 'text-red-600' : 'text-slate-600'
                  }`}
                >
                  Reseller
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                  For resale &amp; clients
                </div>
              </div>
              <span className="text-[9.5px] font-black uppercase tracking-wider text-red-900 bg-red-100/90 border border-red-300/60 px-2.5 py-0.5 rounded-full shrink-0">
                POPULAR
              </span>
            </button>
          </div>

          {/* Main Plan Card */}
          <div
            className="relative rounded-[26px] p-5 sm:p-7 space-y-6 transition-colors bg-white border border-slate-200/90 shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
          >
            {/* 2-Column Content Grid: Left (Header + Price Box) | Right (Checklist Card) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-stretch">
              
              {/* Left Column: Plan Header + One-Time Price Box */}
              <div className="md:col-span-6 flex flex-col justify-between space-y-5">
                {/* Icon + Badge + Title + Description */}
                <div className="flex items-start gap-3.5">
                  <div
                    className="w-12 h-12 rounded-[16px] text-white flex items-center justify-center shrink-0 bg-gradient-to-br from-red-500 via-rose-600 to-red-600 shadow-[0_6px_16px_rgba(239,68,68,0.3)]"
                  >
                    {isReseller ? (
                      <ArrowUpRight className="w-5 h-5 text-white stroke-[2.5]" />
                    ) : (
                      <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <span
                      className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block bg-red-50 text-red-900 border border-red-200/60"
                    >
                      {isReseller ? 'RESELLER ACCESS' : 'PERSONAL ACCESS'}
                    </span>
                    <h3 className="text-xl sm:text-[22px] font-black text-slate-950 leading-snug">
                      <Link href={`/product/${targetProductSlug}`} className="hover:text-red-600 transition-colors">
                        {currentPlan.name}
                      </Link>
                    </h3>
                    <p className="text-xs sm:text-[13px] text-slate-600 font-medium leading-relaxed">
                      {currentPlan.subtitle}
                    </p>
                  </div>
                </div>

                {/* One-Time Price Box */}
                <div
                  className="rounded-[20px] p-5 space-y-2.5 bg-slate-50 border border-slate-200/90"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-extrabold tracking-wider text-slate-500 uppercase">
                      ONE-TIME PRICE
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-[11px] px-3 py-0.5 rounded-full">
                      {currentPlan.discountPercentage}% OFF
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2.5">
                    <span
                      className="text-4xl sm:text-[42px] font-black leading-none tracking-tight text-slate-950"
                    >
                      ₹{currentPlan.price}
                    </span>
                    <span className="text-slate-400 text-base sm:text-[17px] line-through decoration-rose-500/75 decoration-2 font-bold">
                      ₹{currentPlan.originalPrice}
                    </span>
                  </div>

                  <div className="text-[11.5px] text-slate-600 font-bold">
                    Pay once • Instant access
                  </div>
                </div>
              </div>

              {/* Right Column: Enclosed White Checklist Card */}
              <div
                className="md:col-span-6 relative rounded-[20px] bg-slate-50/70 border border-slate-200 px-5 py-3.5 flex flex-col justify-center divide-y divide-slate-200/60"
              >
                {/* Floating BEST VALUE pill on Reseller tab */}
                {isReseller && (
                  <span className="absolute -top-3 right-4 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md shadow-red-500/25 border border-red-400">
                    BEST VALUE
                  </span>
                )}

                {currentPlan.features.map((item, index) => (
                  <div
                    key={index}
                    className="py-2.5 flex items-center gap-3 first:pt-1 last:pb-1"
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-red-100 text-red-700"
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className="text-xs sm:text-[13px] font-bold text-slate-800">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

            </div>

            {/* Full-Width Red Gradient CTA Button */}
            <Link
              href={`/product/${targetProductSlug}`}
              className="w-full py-3.5 sm:py-4 px-6 rounded-[16px] bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-sm sm:text-[15px] flex items-center justify-center gap-2.5 shadow-[0_10px_25px_rgba(239,68,68,0.28)] transition-all hover:scale-[1.005]"
            >
              <span>
                {isReseller ? 'Get Reseller Access' : 'Get Personal Access'}
              </span>
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5 text-white stroke-[2.5]" />
              </span>
            </Link>

            {/* Bottom Accent Line */}
            <div
              className="absolute bottom-0 left-10 right-10 h-[3px] rounded-t-full bg-gradient-to-r from-red-600 via-rose-500 to-red-600"
            />
          </div>

        </div>

      </div>
    </section>
  );
}

