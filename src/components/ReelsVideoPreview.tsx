'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Play, Pause, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { BUNDLE_PRODUCTS } from '@/data/bundles';
import { useCart } from '@/context/CartContext';
import { ReelItem, BundleProduct } from '@/types';
import { getStoreReels, initialStoreReels, parseVideoUrl } from '@/lib/reels';
import { resolveBundleSlug, getProductUrlForReel } from '@/lib/bundleResolver';
import { optimizeImageUrl } from '@/lib/imageOptimized';

export default function ReelsVideoPreview() {
  const { buyNow } = useCart();
  const [reels, setReels] = useState<ReelItem[]>(initialStoreReels);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  useEffect(() => {
    let isMounted = true;
    let hasFetched = false;

    const loadLiveReels = () => {
      if (hasFetched || !isMounted) return;
      hasFetched = true;
      cleanup();
      getStoreReels().then((data) => {
        if (isMounted && data && data.length > 0) {
          setReels(data);
        }
      });
    };

    const events = ['scroll', 'pointerdown', 'touchstart', 'keydown'] as const;
    const cleanup = () => {
      events.forEach((evt) => window.removeEventListener(evt, loadLiveReels));
    };

    events.forEach((evt) =>
      window.addEventListener(evt, loadLiveReels, { once: true, passive: true })
    );

    return () => {
      isMounted = false;
      cleanup();
    };
  }, []);

  const handleTogglePlay = (id: string) => {
    const video = videoRefs.current[id];

    if (activeVideoId === id) {
      if (video) video.pause();
      setActiveVideoId(null);
    } else {
      if (activeVideoId && videoRefs.current[activeVideoId]) {
        videoRefs.current[activeVideoId]?.pause();
      }
      setActiveVideoId(id);
    }
  };

  const handleBuy = (reel: ReelItem) => {
    const matched = resolveBundleSlug(reel.bundleSlug || reel.title || '');

    if (matched) {
      buyNow(matched, 'personal');
      return;
    }

    const customBundle: BundleProduct = {
      id: reel.bundleId || `custom-${reel.id}`,
      slug: reel.bundleSlug || 'viral-reels-pack',
      title: reel.bundleTitle || reel.title,
      shortDescription: `Curated digital video reel package: ${reel.title}`,
      category: reel.category || 'AI Reels',
      categorySlug: 'ai-reels',
      reelCount: 1000,
      personalPrice: reel.bundlePrice || 49,
      personalOriginalPrice: (reel.bundlePrice || 49) * 5,
      resellerPrice: (reel.bundlePrice || 49) * 2,
      resellerOriginalPrice: (reel.bundlePrice || 49) * 10,
      thumbnail: reel.poster || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
      galleryImages: [reel.poster || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600'],
      tags: ['INSTANT ACCESS', 'HD'],
      rating: 5.0,
      reviewCount: 120,
      resolution: '1080P Full HD',
      aspectRatio: '9:16 Vertical',
      format: 'MP4',
      audioIncluded: true,
      googleDriveLink: '',
      features: ['Direct Instant Download', 'Commercial Rights'],
      faqs: [],
    };

    buyNow(customBundle, 'personal');
  };

  return (
    <section id="rbui-preview" className="py-6 sm:py-8 [contain:layout_style]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Outer Section Card Wrapper */}
        <div className="rounded-[28px] sm:rounded-[36px] bg-white border border-canvas-200 p-3 sm:p-5 space-y-5 sm:space-y-6 shadow-[0_24px_48px_-36px_rgba(11,16,25,0.35)]">
          
          {/* Header Banner */}
          <div className="rounded-[22px] cm-ink-panel px-5 py-5 sm:px-7 sm:py-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_20px_40px_-26px_rgba(7,10,17,0.8)]">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="font-display text-[22px] sm:text-[28px] font-extrabold text-white tracking-[-0.025em] leading-tight flex items-center gap-2.5">
                  <span>Preview the Reels Before You Buy</span>
                  <span className="font-sans text-[10px] px-2 py-0.5 rounded-full bg-volt text-ink font-extrabold tracking-[0.1em] hidden sm:inline-block">LIVE DEMO</span>
                </h2>
                <p className="text-xs sm:text-[13px] text-ink-300 font-medium mt-0.5">
                  Watch real samples, check video quality, and choose the bundle that fits your content.
                </p>
              </div>
            </div>

            <Link
              href="/reels"
              prefetch={false}
              className="group pl-4 pr-1.5 py-1.5 rounded-full bg-mint-500 hover:bg-mint-300 text-ink text-xs font-extrabold transition-colors shrink-0 flex items-center gap-2"
            >
              <span>View All Previews</span>
              <span className="w-6 h-6 rounded-full bg-ink text-mint-300 flex items-center justify-center transition-transform group-hover:translate-x-0.5"><ArrowRight className="w-3.5 h-3.5" /></span>
            </Link>
          </div>

          {/* Video Preview Phones Horizontal Track */}
          <div className="flex gap-4 overflow-x-auto pb-4 pt-2 scrollbar-none">
            {reels.map((item) => {
              const isPlaying = activeVideoId === item.id;
              const parsed = parseVideoUrl(item.videoUrl);
              const isYouTube = item.videoType === 'youtube' || parsed.videoType === 'youtube' || Boolean(item.youtubeId);
              const ytId = item.youtubeId || parsed.youtubeId;

              const reelPoster =
                item.poster ||
                resolveBundleSlug(item.bundleSlug || item.title)?.thumbnail ||
                '/baby-strawberry-reel.webp';

              return (
                <div
                  key={item.id}
                  className="w-48 sm:w-52 aspect-[9/16] rounded-[26px] bg-[#10161F] p-2.5 shadow-xl border-[3px] border-[#1E2733] relative flex flex-col justify-between overflow-hidden shrink-0 group select-none"
                >
                  {/* YouTube Iframe OR Lazy Poster / HTML5 Video on Play */}
                  {isYouTube && ytId ? (
                    isPlaying ? (
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=${
                          isMuted ? 1 : 0
                        }&loop=1&playlist=${ytId}&controls=1&modestbranding=1&playsinline=1&rel=0`}
                        className="absolute inset-0 w-full h-full border-0 z-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <img
                        src={optimizeImageUrl(reelPoster, 256, 75)}
                        alt={item.title}
                        width={256}
                        height={455}
                        loading="lazy"
                        decoding="async"
                        onClick={() => handleTogglePlay(item.id)}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/baby-strawberry-reel.webp';
                        }}
                        className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                      />
                    )
                  ) : isPlaying ? (
                    <video
                      ref={(el) => {
                        videoRefs.current[item.id] = el;
                      }}
                      src={item.videoUrl}
                      poster={optimizeImageUrl(reelPoster, 256, 75)}
                      autoPlay
                      loop
                      playsInline
                      muted={isMuted}
                      onClick={() => handleTogglePlay(item.id)}
                      className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                    />
                  ) : (
                    <img
                      src={optimizeImageUrl(reelPoster, 256, 75)}
                      alt={item.title}
                      width={256}
                      height={455}
                      loading="lazy"
                      decoding="async"
                      onClick={() => handleTogglePlay(item.id)}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/baby-strawberry-reel.webp';
                      }}
                      className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                    />
                  )}

                  {/* Top bar controls */}
                  <div className="relative z-20 flex justify-between items-center">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-black/80 text-white">
                      {item.category || (isYouTube ? 'YouTube' : 'Reel')}
                    </span>
                    <button
                      type="button"
                      aria-label={isMuted ? `Unmute ${item.title}` : `Mute ${item.title}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMuted(!isMuted);
                        Object.values(videoRefs.current).forEach((v) => {
                          if (v) v.muted = !isMuted;
                        });
                      }}
                      className="p-1.5 rounded-full bg-black/80 text-white"
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Center Play Button */}
                  {(!isYouTube || !isPlaying) && (
                    <div
                      onClick={() => handleTogglePlay(item.id)}
                      className={`absolute inset-0 z-10 flex items-center justify-center cursor-pointer transition-opacity ${
                        isPlaying ? 'opacity-0 hover:opacity-100 bg-black/20' : 'opacity-100 bg-black/30'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-mint-500 shadow-xl shadow-ink/10 flex items-center justify-center text-ink transform group-hover:scale-110 transition-transform">
                        {isPlaying ? (
                          <Pause className="w-5 h-5 fill-ink" />
                        ) : (
                          <Play className="w-5 h-5 fill-ink ml-0.5" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Bottom Bar: Title & Buy Now */}
                  <div className="relative z-20 flex items-center justify-between gap-1 pt-2 bg-gradient-to-t from-black/95 via-black/75 to-transparent p-2 rounded-xl">
                    <Link
                      href={getProductUrlForReel(item)}
                      prefetch={false}
                      className="text-xs font-bold text-white hover:text-leaf-400 hover:underline truncate max-w-[95px] transition-colors"
                      title={item.bundleTitle || item.title}
                    >
                      {item.bundleTitle || item.title}
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleBuy(item)}
                      className="px-2.5 py-1 rounded-full bg-mint-500 hover:bg-mint-300 text-ink text-[11px] font-black shrink-0 flex items-center gap-0.5 shadow-md active:scale-95 transition-all"
                    >
                      <span>Buy Now</span>
                      <span className="text-[13px] leading-none">›</span>
                    </button>
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
