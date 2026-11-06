'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, ArrowRight, Zap, ShieldCheck, Download } from 'lucide-react';
import { BUNDLE_PRODUCTS } from '@/data/bundles';
import { optimizeImageUrl } from '@/lib/imageOptimized';

export default function Hero() {
  const phrases = ['Ready to Post.', 'Built to Engage.', 'Made to Grow.'];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState('Ready to Post.');
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Dynamic rotation state for the 3 hero preview cards
  const [activeOffset, setActiveOffset] = useState(0);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    const onInteract = () => setHasInteracted(true);
    const events = ['scroll', 'pointerdown', 'touchstart', 'keydown'] as const;
    events.forEach((evt) =>
      window.addEventListener(evt, onInteract, { once: true, passive: true })
    );
    return () => {
      events.forEach((evt) => window.removeEventListener(evt, onInteract));
    };
  }, []);

  // Typewriter effect (starts after first user interaction to prevent initial-load reflows)
  useEffect(() => {
    if (!hasInteracted) return;
    const currentPhrase = phrases[phraseIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayText.length < currentPhrase.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        }, 85);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length - 1));
        }, 45);
      } else {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, phraseIndex, hasInteracted]);

  // Continuous auto-rotation every 5.5 seconds after user interaction unless user hovers
  useEffect(() => {
    if (!hasInteracted || !isRotating) return;
    const interval = setInterval(() => {
      setActiveOffset((prev) => (prev + 1) % BUNDLE_PRODUCTS.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [hasInteracted, isRotating]);

  const totalBundles = BUNDLE_PRODUCTS.length;
  const leftCard = BUNDLE_PRODUCTS[activeOffset % totalBundles];
  const centerCard = BUNDLE_PRODUCTS[(activeOffset + 1) % totalBundles];
  const rightCard = BUNDLE_PRODUCTS[(activeOffset + 2) % totalBundles];

  const renderCard = (
    card: (typeof BUNDLE_PRODUCTS)[number] | undefined,
    pos: 'left' | 'center' | 'right'
  ) => {
    if (!card) return null;
    const isCenter = pos === 'center';
    const posClass =
      pos === 'left'
        ? 'absolute z-10 -rotate-[8deg] -translate-x-[54px] sm:-translate-x-[74px] lg:-translate-x-[86px] translate-y-2 opacity-90 hover:opacity-100'
        : pos === 'right'
        ? 'absolute z-10 rotate-[8deg] translate-x-[54px] sm:translate-x-[74px] lg:translate-x-[86px] translate-y-2 opacity-90 hover:opacity-100'
        : 'relative z-20 -translate-y-1 sm:-translate-y-2';
    const sizeClass = isCenter
      ? 'w-[128px] sm:w-[172px] lg:w-[198px] rounded-[22px] sm:rounded-[28px] border-[3px] sm:border-[4px] border-mint-500 shadow-[0_30px_60px_-24px_rgba(154,230,0,0.55)]'
      : 'w-[104px] sm:w-[142px] lg:w-[162px] rounded-[18px] sm:rounded-[24px] border-[3px] sm:border-[4px] border-ink-700 shadow-[0_24px_40px_-20px_rgba(0,0,0,0.8)]';
    return (
      <Link
        href={`/product/${card.slug}`}
        prefetch={false}
        key={`${pos}-${card.id}`}
        className={`${posClass} ${sizeClass} aspect-[9/16] overflow-hidden transition-all duration-500 hover:scale-[1.03] block bg-ink-800 group`}
      >
        <img
          src={optimizeImageUrl(card.thumbnail, 384, 75)}
          alt={card.title}
          width={384}
          height={683}
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent flex flex-col justify-between p-2.5 sm:p-3.5 text-white">
          <div />
          <div
            className={`${
              isCenter ? 'w-9 h-9 sm:w-12 sm:h-12 bg-volt' : 'w-7 h-7 sm:w-9 sm:h-9 bg-white/90'
            } rounded-full flex items-center justify-center mx-auto text-ink shadow-[0_10px_20px_-8px_rgba(0,0,0,0.6)] transition-transform group-hover:scale-110`}
          >
            <Play className={`${isCenter ? 'w-3.5 h-3.5 sm:w-4 sm:h-4' : 'w-2.5 h-2.5 sm:w-3.5 sm:h-3.5'} fill-ink ml-0.5`} />
          </div>
          <div>
            <span className="text-[7.5px] sm:text-[9px] font-bold uppercase tracking-[0.16em] text-mint-300 block mb-0.5 sm:mb-1">
              {isCenter ? 'Hot preview' : 'Preview'}
            </span>
            <p className={`${isCenter ? 'text-[10.5px] sm:text-[12.5px] font-black' : 'text-[9px] sm:text-[11px] font-extrabold'} text-white line-clamp-2 leading-snug`}>
              {card.title}
            </p>
          </div>
        </div>
      </Link>
    );
  };

  const stats = [
    { icon: Zap, value: `${totalBundles || 131}`, label: 'Published bundles' },
    { icon: Download, value: '222K+', label: 'Ready-to-post reels' },
    { icon: ShieldCheck, value: '1080P', label: 'Max quality' },
  ];

  return (
    <section className="pt-2 pb-2 sm:pt-6 sm:pb-6">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="cm-ink-panel relative rounded-[26px] sm:rounded-[38px] p-5 sm:p-10 lg:px-14 lg:py-14 overflow-hidden isolate">
          {/* Lime aura behind the phone stack */}
          <div
            className="pointer-events-none absolute -right-24 -top-10 w-[640px] h-[640px] max-w-[120%] -z-10 opacity-80"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(154,230,0,0.22) 0%, rgba(154,230,0,0.08) 38%, transparent 66%)',
            }}
          />
          {/* Thin lime edge highlight */}
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-mint-500/50 to-transparent" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-10 lg:gap-6 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-7">
              <div>
                <h1 className="font-display text-[36px] sm:text-[56px] lg:text-[68px] font-extrabold text-white tracking-[-0.035em] leading-[1.02]">
                  Viral Reels.
                </h1>
                <div className="font-display text-[36px] sm:text-[56px] lg:text-[68px] font-extrabold tracking-[-0.035em] leading-[1.06] mt-0.5 flex items-center min-h-[42px] sm:min-h-[66px] lg:min-h-[76px]">
                  <span className="text-mint-500 pb-1">{displayText}</span>
                  <span className="w-[4px] h-[0.82em] bg-volt ml-1.5 inline-block animate-pulse shrink-0 rounded-full" />
                </div>
              </div>

              <p className="text-[14px] sm:text-[16.5px] text-ink-300 font-medium max-w-[34rem] leading-[1.6]">
                Download high-converting, professional reels bundles for Instagram, YouTube Shorts and Facebook. Pick your niche, preview sample videos, and get instant cloud access after purchase.
              </p>

              <div className="flex flex-col min-[400px]:flex-row min-[400px]:flex-wrap items-stretch min-[400px]:items-center gap-2.5 sm:gap-3">
                <Link
                  href="/shop"
                  prefetch={false}
                  className="group pl-5 sm:pl-6 pr-1.5 py-1.5 rounded-full bg-mint-500 hover:bg-mint-300 text-ink font-extrabold text-[14px] sm:text-[15px] flex items-center justify-between min-[400px]:justify-center gap-4 shadow-[0_18px_36px_-16px_rgba(154,230,0,0.65)] active:scale-[0.98] transition-colors"
                >
                  <span>Browse Bundles</span>
                  <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-volt flex items-center justify-center shrink-0 ring-1 ring-ink/10 transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </span>
                </Link>

                <a
                  href="#rbui-preview"
                  className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-full border border-white/15 hover:border-mint-500/60 bg-white/[0.04] hover:bg-white/[0.08] text-white font-bold text-[14px] sm:text-[15px] flex items-center justify-center gap-2.5 transition-colors active:scale-[0.98]"
                >
                  <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-ink shrink-0">
                    <Play className="w-2.5 h-2.5 fill-ink ml-0.5" />
                  </span>
                  <span>View Previews</span>
                </a>
              </div>

              {/* Proof strip */}
              <dl className="grid grid-cols-3 max-w-xl pt-5 sm:pt-6 border-t border-white/10">
                {stats.map(({ icon: Icon, value, label }, i) => (
                  <div key={label} className={`${i > 0 ? 'pl-3 sm:pl-6 border-l border-white/10' : ''} pr-2 flex flex-col-reverse justify-end gap-1.5`}>
                    <dt className="flex items-center gap-1.5 text-[10px] sm:text-[12px] font-semibold text-ink-300">
                      <Icon className="w-3.5 h-3.5 text-mint-500 shrink-0" />
                      <span className="truncate">{label}</span>
                    </dt>
                    <dd className="font-display tabular text-[22px] sm:text-[30px] font-extrabold text-white tracking-[-0.02em] leading-none">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Right: phone stack */}
            <div
              className="lg:col-span-5 flex flex-col items-center justify-center relative"
              onMouseEnter={() => setIsRotating(false)}
              onMouseLeave={() => setIsRotating(true)}
            >
              <div className="relative w-full max-w-[340px] sm:max-w-[380px] h-[245px] sm:h-[320px] lg:h-[352px] flex items-center justify-center">
                {renderCard(leftCard, 'left')}
                {renderCard(rightCard, 'right')}
                {renderCard(centerCard, 'center')}
              </div>

              <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
                <span className="px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-white/[0.06] text-white border border-white/10">
                  9:16 Vertical
                </span>
                <span className="px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-extrabold bg-volt text-ink">
                  1080P Full HD
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
