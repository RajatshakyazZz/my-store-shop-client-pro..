'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Play,
  Check,
} from 'lucide-react';
import { BUNDLE_PRODUCTS } from '@/data/bundles';
import { useCart } from '@/context/CartContext';
import { ReelItem, BundleProduct } from '@/types';
import { getStoreReels, initialStoreReels, parseVideoUrl } from '@/lib/reels';
import { resolveBundleSlug, getProductUrlForReel } from '@/lib/bundleResolver';
import { track } from '@/lib/analytics';

interface FeedReelItem extends ReelItem {
  feedKey: string;
  originalId: string;
}

export default function ReelsFeedPage() {
  const router = useRouter();
  const { addToCart, buyNow, setIsCartOpen } = useCart();
  
  // Base reels pool
  const [baseReels, setBaseReels] = useState<ReelItem[]>(initialStoreReels);
  
  // Infinite feed list with unique feed keys
  const [feedReels, setFeedReels] = useState<FeedReelItem[]>(() =>
    initialStoreReels.map((r, i) => ({
      ...r,
      feedKey: `${r.id}-0-${i}`,
      originalId: r.id,
    }))
  );

  const [activeReelKey, setActiveReelKey] = useState<string>(
    initialStoreReels[0] ? `${initialStoreReels[0].id}-0-0` : ''
  );
  const [isMuted, setIsMuted] = useState(true);
  const [likes, setLikes] = useState<{ [key: string]: number }>({});
  const [likedReels, setLikedReels] = useState<{ [key: string]: boolean }>({});
  const [addedAnimation, setAddedAnimation] = useState<{ [key: string]: boolean }>({});
  const [isPlayingMap, setIsPlayingMap] = useState<{ [key: string]: boolean }>({});
  const [progressMap, setProgressMap] = useState<{ [key: string]: number }>({});

  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const containerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const feedScrollRef = useRef<HTMLDivElement | null>(null);
  const loopCountRef = useRef<number>(1);

  // 1. Fetch live reels from Firestore / Local storage
  useEffect(() => {
    let isMounted = true;
    getStoreReels().then((data) => {
      if (isMounted && data && data.length > 0) {
        setBaseReels(data);
        const mapped = data.map((r, i) => ({
          ...r,
          feedKey: `${r.id}-0-${i}`,
          originalId: r.id,
        }));
        setFeedReels(mapped);
        setActiveReelKey(mapped[0]?.feedKey || '');

        const initialLikes: { [key: string]: number } = {};
        data.forEach((r) => {
          initialLikes[r.id] = r.likes ?? 0;
        });
        setLikes(initialLikes);

        track('view_item_list', {
          item_list_name: 'Reels Feed Showcase',
          items: data.slice(0, 10).map((r, i) => ({
            item_id: r.bundleId || r.id,
            item_name: r.bundleTitle || r.title,
            price: Number(r.bundlePrice || 49),
            index: i + 1,
          })),
        });
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Infinite Loop Reel Appender (kabhi end na ho)
  const appendMoreReels = useCallback(() => {
    if (baseReels.length === 0) return;
    const currentLoop = loopCountRef.current++;
    setFeedReels((prev) => {
      // Avoid excessive DOM nodes by keeping maximum 180 items
      const trimmed = prev.length > 200 ? prev.slice(prev.length - 80) : prev;
      const nextBatch: FeedReelItem[] = baseReels.map((r, idx) => ({
        ...r,
        feedKey: `${r.id}-${currentLoop}-${idx}`,
        originalId: r.id,
      }));
      return [...trimmed, ...nextBatch];
    });
  }, [baseReels]);

  // 3. Scroll handler for infinite looping
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = el;

    // Trigger next loop cycle when user reaches within last 3 reels
    if (scrollTop + clientHeight >= scrollHeight - clientHeight * 2.5) {
      appendMoreReels();
    }
  };

  // 4. IntersectionObserver to detect active video on swipe
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            const targetKey = entry.target.getAttribute('data-reel-key');
            if (targetKey) {
              setActiveReelKey(targetKey);
            }
          }
        });
      },
      {
        threshold: [0.55],
      }
    );

    Object.values(containerRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [feedReels]);

  // 5. Auto-play active video and pause non-active videos
  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([key, video]) => {
      if (!video) return;
      if (key === activeReelKey) {
        video.muted = isMuted;
        video
          .play()
          .then(() => {
            setIsPlayingMap((prev) => ({ ...prev, [key]: true }));
          })
          .catch(() => {
            setIsPlayingMap((prev) => ({ ...prev, [key]: false }));
          });
      } else {
        video.pause();
        setIsPlayingMap((prev) => ({ ...prev, [key]: false }));
      }
    });
  }, [activeReelKey, isMuted]);

  // Toggle Play / Pause on direct tap
  const handleTogglePlay = (key: string) => {
    const video = videoRefs.current[key];
    if (video) {
      if (video.paused) {
        video.play().catch(() => {});
        setIsPlayingMap((prev) => ({ ...prev, [key]: true }));
      } else {
        video.pause();
        setIsPlayingMap((prev) => ({ ...prev, [key]: false }));
      }
    } else {
      setIsPlayingMap((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  // Like button toggle (tracked by original bundle/reel ID)
  const handleLike = (originalId: string) => {
    setLikedReels((prev) => {
      const alreadyLiked = !!prev[originalId];
      setLikes((currLikes) => ({
        ...currLikes,
        [originalId]: (currLikes[originalId] || 0) + (alreadyLiked ? -1 : 1),
      }));
      return { ...prev, [originalId]: !alreadyLiked };
    });
  };

  // Sound toggle across all videos
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    Object.values(videoRefs.current).forEach((v) => {
      if (v) v.muted = nextMuted;
    });
  };

  // Helper to resolve bundle product
  const getBundleForReel = (reel: FeedReelItem): BundleProduct => {
    const matched = resolveBundleSlug(reel.bundleSlug || reel.title || '');

    if (matched) return matched;

    return {
      id: reel.bundleId || `bundle-${reel.originalId}`,
      slug: reel.bundleSlug || 'viral-reels-bundle',
      title: reel.bundleTitle || reel.title,
      shortDescription: 'Viral ready-to-post vertical reels bundle with instant Google Drive access.',
      category: reel.category || 'AI Reels',
      categorySlug: 'ai-reels',
      reelCount: reel.reelCount || 1000,
      personalPrice: reel.bundlePrice || 69,
      personalOriginalPrice: reel.bundleOriginalPrice || 399,
      resellerPrice: (reel.bundlePrice || 69) * 2,
      resellerOriginalPrice: (reel.bundleOriginalPrice || 399) * 2,
      thumbnail: reel.poster || '/baby-strawberry-reel.jpg',
      galleryImages: [reel.poster || '/baby-strawberry-reel.jpg'],
      tags: ['BESTSELLER', '1080P'],
      rating: 5.0,
      reviewCount: 140,
      resolution: '1080P Full HD',
      aspectRatio: '9:16 Vertical',
      format: 'MP4',
      audioIncluded: true,
      googleDriveLink: '',
      features: ['Instant Access', 'Zero Watermark', 'Viral Retention'],
      faqs: [],
    };
  };

  // Add to Cart handler
  const handleAddToCart = (reel: FeedReelItem) => {
    const bundle = getBundleForReel(reel);
    addToCart(bundle, 'personal');
    setAddedAnimation((prev) => ({ ...prev, [reel.feedKey]: true }));
    setTimeout(() => {
      setAddedAnimation((prev) => ({ ...prev, [reel.feedKey]: false }));
      setIsCartOpen(true);
    }, 500);
  };

  // Buy Now handler
  const handleBuyNow = (reel: FeedReelItem) => {
    const bundle = getBundleForReel(reel);
    buyNow(bundle, 'personal');
  };

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://vaultworld.shop').replace(/\/+$/, '');
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'MYZTORE Viral Reels Video Previews',
    numberOfItems: baseReels.length,
    itemListElement: baseReels.slice(0, 20).map((r, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: r.title,
      url: `${siteUrl}${getProductUrlForReel(r)}`,
    })),
  };

  return (
    <div className="fixed inset-0 bg-[#09080d] text-white select-none overflow-hidden z-30">
      {/* ItemList Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <style jsx global>{`
        @keyframes rbreels-shine {
          0% {
            left: -45%;
          }
          55%,
          100% {
            left: 125%;
          }
        }
      `}</style>

      {/* =========================================================================
          DESKTOP TOP BAR (Only visible on tablet & desktop screens >= 768px)
          ========================================================================= */}
      <div className="hidden md:flex max-w-lg mx-auto pt-4 pb-2 px-4 items-center justify-between z-30">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 backdrop-blur-md transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Store</span>
        </Link>

        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/10 border border-white/20 text-white backdrop-blur-md">
          INFINITE REELS PREVIEW
        </span>

        <button
          onClick={handleToggleMute}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white backdrop-blur-md transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* =========================================================================
          MAIN FULLSCREEN INFINITE FEED CONTAINER
          - Mobile: Fixed from top: 0 down to bottom: 74px (Clean space for MobileBottomNav)
          - Desktop: Centered 9:16 vertical card with smooth scroll & infinite loop
          ========================================================================= */}
      <div
        ref={feedScrollRef}
        onScroll={handleScroll}
        className="fixed inset-x-0 top-0 bottom-[74px] md:static md:h-[88vh] md:max-w-[420px] md:mx-auto md:my-auto md:rounded-[28px] md:border-[4px] md:border-white/10 overflow-y-scroll snap-y snap-mandatory scrollbar-none z-20"
      >
        {feedReels.map((reel) => {
          const isActive = activeReelKey === reel.feedKey;
          const parsed = parseVideoUrl(reel.videoUrl);
          const isYouTube =
            reel.videoType === 'youtube' || parsed.videoType === 'youtube' || Boolean(reel.youtubeId);
          const ytId = reel.youtubeId || parsed.youtubeId;
          const isPlaying = isPlayingMap[reel.feedKey] ?? isActive;

          const regularPrice =
            reel.bundleOriginalPrice || (reel.bundlePrice ? reel.bundlePrice * 6 : 399);
          const salePrice = reel.bundlePrice || 69;
          const discountPct = Math.round((1 - salePrice / regularPrice) * 100);
          const feedPoster =
            reel.poster ||
            resolveBundleSlug(reel.bundleSlug || reel.title)?.thumbnail ||
            '/baby-strawberry-reel.jpg';

          return (
            <div
              key={reel.feedKey}
              ref={(el) => {
                containerRefs.current[reel.feedKey] = el;
              }}
              data-reel-key={reel.feedKey}
              className="h-full w-full snap-start snap-always relative overflow-hidden bg-[#09080d] flex flex-col justify-between"
            >
              {/* Progress bar at the top */}
              <div className="absolute top-2 left-2 right-2 z-20 h-[2.5px] rounded-full bg-white/20 overflow-hidden pointer-events-none">
                <span
                  className="block h-full bg-white transition-[width] duration-150 rounded-full"
                  style={{ width: `${progressMap[reel.feedKey] || 0}%` }}
                />
              </div>

              {/* =================================================================
                  VIDEO LAYER: Full-Bleed Video or YouTube Embed
                  ================================================================= */}
              <div
                onClick={() => handleTogglePlay(reel.feedKey)}
                className="absolute inset-0 w-full h-full cursor-pointer overflow-hidden bg-black"
              >
                    {isYouTube && ytId ? (
                      isActive ? (
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=${
                            isMuted ? 1 : 0
                          }&loop=1&playlist=${ytId}&controls=0&modestbranding=1&playsinline=1&rel=0&showinfo=0`}
                          className="absolute inset-0 w-full h-full border-0 pointer-events-none scale-105"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <img
                          src={feedPoster}
                          alt={reel.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/baby-strawberry-reel.jpg';
                          }}
                        />
                      )
                    ) : (
                      <video
                        ref={(el) => {
                          videoRefs.current[reel.feedKey] = el;
                        }}
                        src={reel.videoUrl}
                        poster={feedPoster}
                        loop
                        playsInline
                        muted={isMuted}
                    onTimeUpdate={(e) => {
                      const v = e.currentTarget;
                      if (v.duration) {
                        setProgressMap((prev) => ({
                          ...prev,
                          [reel.feedKey]: (v.currentTime / v.duration) * 100,
                        }));
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Subtle dark gradient overlay for text readability matching competitor */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.18) 50%, rgba(0,0,0,0.9) 100%)',
                  }}
                />

                {/* PAUSED OVERLAY INDICATOR */}
                {!isPlaying && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity z-10 pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-2xl">
                      <Play className="w-7 h-7 fill-white ml-1" />
                    </div>
                  </div>
                )}
              </div>

              {/* =================================================================
                  RIGHT VERTICAL ENGAGEMENT ICONS
                  - Heart (Likes)
                  - Eye (Views)
                  - Sound (Mute/Unmute)
                  ================================================================= */}
              <div className="absolute right-3 bottom-[154px] z-30 flex flex-col items-center gap-3 pointer-events-auto">
                {/* 1. Heart (Like) button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(reel.originalId);
                  }}
                  className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
                  aria-label="Like this reel"
                >
                  <div
                    className={`w-[42px] h-[42px] rounded-full flex items-center justify-center backdrop-blur-md shadow-[0_8px_22px_rgba(0,0,0,0.2)] transition-all ${
                      likedReels[reel.originalId]
                        ? 'bg-gradient-to-br from-[#ff315f] to-[#ff4e91] text-white border-0 scale-105'
                        : 'bg-[#0c0a12]/45 border border-white/20 text-white'
                    }`}
                  >
                    <svg
                      className="w-[21px] h-[21px]"
                      viewBox="0 0 24 24"
                      fill={likedReels[reel.originalId] ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-extrabold text-white leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
                    {likes[reel.originalId] ?? 0}
                  </span>
                </button>

                {/* 2. Eye (Views) counter */}
                <div className="flex flex-col items-center gap-1 cursor-default" title="Views">
                  <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center bg-[#0c0a12]/45 border border-white/20 text-white backdrop-blur-md shadow-[0_8px_22px_rgba(0,0,0,0.2)]">
                    <svg
                      className="w-[21px] h-[21px]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6Z" />
                      <circle cx="12" cy="12" r="2.6" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-extrabold text-white leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
                    {reel.views || 4}
                  </span>
                </div>

                {/* 3. Mute/Unmute sound button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleMute();
                  }}
                  className="flex flex-col items-center active:scale-90 transition-transform"
                  aria-label={isMuted ? 'Unmute reel' : 'Mute reel'}
                  title="Sound"
                >
                  <div
                    className={`w-[42px] h-[42px] rounded-full flex items-center justify-center backdrop-blur-md shadow-[0_8px_22px_rgba(0,0,0,0.2)] transition-all ${
                      !isMuted
                        ? 'bg-gradient-to-br from-[#6d42ed] to-[#a348e9] text-white border-0'
                        : 'bg-[#0c0a12]/45 border border-white/20 text-white'
                    }`}
                  >
                    {isMuted ? (
                      <svg
                        className="w-[20px] h-[20px]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 5 6.8 8.5H3v7h3.8L11 19V5Z" />
                        <path d="m16 9 5 5m0-5-5 5" />
                      </svg>
                    ) : (
                      <svg
                        className="w-[20px] h-[20px]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 5 6.8 8.5H3v7h3.8L11 19V5Z" />
                        <path d="M15 9.2a4 4 0 0 1 0 5.6M17.8 6.6a7.5 7.5 0 0 1 0 10.8" />
                      </svg>
                    )}
                  </div>
                </button>
              </div>

              {/* =================================================================
                  BOTTOM OVERLAY DETAILS (.rbreels-copy)
                  ================================================================= */}
              <div className="absolute left-3.5 right-3.5 bottom-[72px] z-20 flex flex-col gap-1 pointer-events-auto">
                {/* 1. Category Pill */}
                <div>
                  <span className="inline-block px-2 py-0.5 rounded-full text-[8.5px] font-bold bg-black/50 border border-white/20 text-white/90 backdrop-blur-sm">
                    {reel.category || 'AI Reels'}
                  </span>
                </div>

                {/* 2. Bundle Title with external arrow */}
                <h2 className="max-w-[84%] text-[15px] sm:text-[17px] font-extrabold leading-snug tracking-tight text-white drop-shadow-md">
                  <Link
                    href={getProductUrlForReel(reel)}
                    className="hover:text-rose-300 transition-colors inline"
                  >
                    <span>{reel.bundleTitle || reel.title}</span>
                    <span className="inline-block ml-1 text-white/90 text-sm">↗</span>
                  </Link>
                </h2>

                {/* 3. Subtitle / Product description snippet */}
                <div className="max-w-[84%] text-[9.5px] sm:text-[10.5px] text-white/75 font-semibold truncate drop-shadow-sm">
                  {reel.title}
                </div>

                {/* 4. Badges Row: {reelCount}+ Reels REELS & PRICE Pill */}
                <div className="flex items-center flex-wrap gap-1.5 pt-0.5">
                  {/* Reel Count Badge */}
                  <span className="inline-flex items-center gap-1 min-h-[23px] px-2 py-0.5 rounded-full border border-white/25 bg-[#0f0c17]/60 text-white backdrop-blur-md">
                    <b className="text-[10px] font-black">{reel.reelCount || 250}+ Reels</b>
                    <small className="text-[7.5px] font-black tracking-wider text-white/75 uppercase">
                      REELS
                    </small>
                  </span>

                  {/* Price Pill matching Screenshot */}
                  <span className="inline-flex items-center gap-1.5 min-h-[23px] px-2.5 py-0.5 rounded-full bg-white text-slate-900 shadow-md">
                    <small className="text-[7px] font-black text-slate-400 uppercase tracking-wider">
                      PRICE
                    </small>
                    <del className="text-[9px] font-bold text-slate-400">
                      ₹{regularPrice}.00
                    </del>
                    <strong className="text-[11px] font-black text-red-600">
                      ₹{salePrice}.00
                    </strong>
                    <em className="not-italic text-[7.5px] font-black px-1.5 py-0.5 rounded-full bg-[#e9faef] text-[#138a4c]">
                      {discountPct}% OFF
                    </em>
                  </span>
                </div>
              </div>

              {/* =================================================================
                  TWO PROMINENT ACTION BUTTONS (.rbreels-actions)
                  ================================================================= */}
              <div className="absolute left-3 right-3 bottom-3 z-30 grid grid-cols-[minmax(0,0.88fr)_minmax(0,1.25fr)] gap-2 items-stretch pointer-events-auto">
                {/* Button 1: Add to Cart */}
                <button
                  type="button"
                  onClick={() => handleAddToCart(reel)}
                  className={`relative flex items-center justify-center gap-2 min-h-[46px] px-2.5 rounded-[14px] text-white font-extrabold text-[11px] backdrop-blur-md shadow-[0_10px_26px_rgba(0,0,0,0.2)] active:scale-95 transition-all ${
                    addedAnimation[reel.feedKey]
                      ? 'bg-emerald-600/85 border border-emerald-400/60'
                      : 'bg-[#14101c]/55 hover:bg-[#14101c]/75 border border-white/25'
                  }`}
                >
                  <span className="flex items-center justify-center w-[20px] h-[20px]">
                    {addedAnimation[reel.feedKey] ? (
                      <Check className="w-[18px] h-[18px] text-white" />
                    ) : (
                      <svg
                        className="w-[18px] h-[18px]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 4h2l2.1 10.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L20 8H6.2M9 20h.01M17 20h.01" />
                      </svg>
                    )}
                  </span>
                  <small className="text-[10px] font-extrabold whitespace-nowrap">
                    {addedAnimation[reel.feedKey] ? 'Added!' : 'Add to Cart'}
                  </small>
                </button>

                {/* Button 2: Buy Now */}
                <button
                  type="button"
                  onClick={() => handleBuyNow(reel)}
                  className="relative flex items-center justify-center gap-2 min-h-[46px] px-3 rounded-[14px] bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:via-rose-500 hover:to-red-600 text-white font-black text-[12px] tracking-wide shadow-[0_10px_24px_rgba(225,29,72,0.35)] active:scale-95 transition-all overflow-hidden group cursor-pointer"
                >
                  {/* Subtle shine sweep */}
                  <span
                    className="absolute top-[-70%] left-[-35%] w-[32%] h-[240%] rotate-[20deg] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
                    style={{ animation: 'rbreels-shine 2.8s linear infinite' }}
                  />
                  <span className="relative z-10 font-black">Buy Now</span>
                  <b className="relative z-10 text-[16px] font-black leading-none">→</b>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
