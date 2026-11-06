'use client';

import React, { useState, useRef } from 'react';
import { Bell, Clock, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { BUNDLE_PRODUCTS } from '@/data/bundles';
import { optimizeImageUrl } from '@/lib/imageOptimized';

export default function UpcomingBundles() {
  const upcoming = BUNDLE_PRODUCTS.filter((b) => b.isUpcoming);
  const [selectedBundle, setSelectedBundle] = useState<typeof upcoming[0] | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setSelectedBundle(null);
      setName('');
      setEmail('');
      setWhatsapp('');
    }, 2500);
  };

  return (
    <section className="py-6 sm:py-8 [contain:layout_style]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Outer Section Card Wrapper */}
        <div className="rounded-[28px] sm:rounded-[36px] bg-white border border-canvas-200/90 p-4 sm:p-6 space-y-6 shadow-sm">
          
          {/* Midnight Obsidian & Red Header Banner */}
          <div className="rounded-[20px] cm-ink-panel p-4 sm:p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_20px_40px_-26px_rgba(7,10,17,0.8)] border border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                  Upcoming Reels Bundles
                </h2>
                <p className="text-xs sm:text-[13px] text-ink-300 font-medium mt-0.5">
                  Exciting new bundles currently in preparation for creators.
                </p>
              </div>
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center gap-2">
              <span className="text-white/40 text-sm hidden sm:inline">|</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={scrollLeft}
                  className="w-8 h-8 rounded-lg bg-mint-500/15 hover:bg-mint-500/25 border border-mint-500/30 text-leaf-300 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={scrollRight}
                  className="w-8 h-8 rounded-lg bg-mint-500/15 hover:bg-mint-500/25 border border-mint-500/30 text-leaf-300 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Carousel Slider */}
          <div
            ref={carouselRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory"
          >
            {upcoming.map((bundle) => (
              <div
                key={bundle.id}
                className="w-72 sm:w-[290px] bg-white rounded-[24px] border border-canvas-200/90 shadow-[0_4px_18px_rgba(11,16,25,0.03)] hover:shadow-[0_14px_32px_rgba(11,16,25,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group shrink-0 snap-start"
              >
                <div className="relative aspect-[4/3] bg-ink overflow-hidden">
                  <img
                    src={optimizeImageUrl(bundle.thumbnail, 384, 75)}
                    alt={bundle.title}
                    width={384}
                    height={288}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent flex items-end p-3">
                    <span className="px-3 py-1 rounded-full bg-white/95 text-ink text-[11px] font-black shadow-md flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-leaf-600" />
                      <span>Dropping Soon</span>
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold text-leaf-900 bg-leaf-50 border border-leaf-200/50 px-2 py-0.5 rounded-md inline-block">
                      {bundle.category}
                    </span>
                    <h3 className="font-extrabold text-[14px] text-ink line-clamp-2 leading-snug">
                      {bundle.title}
                    </h3>
                    <p className="text-xs text-ink-500 line-clamp-2 font-medium">
                      {bundle.shortDescription}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedBundle(bundle)}
                    className="w-full py-2.5 px-3 rounded-xl border border-mint-500/30 bg-leaf-50/70 hover:bg-mint-500 hover:text-ink text-leaf-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Notify Me on Launch</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Notify Me Modal */}
        {selectedBundle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-canvas-200">
              <button
                onClick={() => setSelectedBundle(null)}
                className="absolute top-5 right-5 p-2 text-ink-300 hover:text-ink-600 rounded-full hover:bg-canvas cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-leaf-50 border border-leaf-200/60 text-leaf-600 flex items-center justify-center mb-4">
                <Bell className="w-6 h-6" />
              </div>

              <span className="text-[11px] font-black uppercase text-leaf-800 tracking-wider">
                UPCOMING BUNDLE ALERT
              </span>
              <h3 className="text-xl font-black text-ink mt-1">
                Get notified when it’s live
              </h3>
              <p className="text-xs text-ink-400 mt-1 leading-relaxed">
                Enter your details to receive an instant WhatsApp alert and early-bird launch pricing for <strong className="text-ink">{selectedBundle.title}</strong>.
              </p>

              {isSuccess ? (
                <div className="mt-6 p-4 rounded-2xl bg-mint-50 border border-mint-200 text-leaf-800 text-center font-bold text-sm flex items-center justify-center gap-2">
                  <Check className="w-5 h-5 text-leaf-600" />
                  <span>Success! We will notify you directly upon release.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-ink-600 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aman"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-200 text-sm focus:outline-none focus:ring-2 focus:ring-mint-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink-600 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="you@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-200 text-sm focus:outline-none focus:ring-2 focus:ring-mint-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink-600 mb-1">WhatsApp Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-200 text-sm focus:outline-none focus:ring-2 focus:ring-mint-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-mint-500 hover:bg-mint-300 text-ink font-black text-sm shadow-md shadow-ink/10 mt-2 cursor-pointer"
                  >
                    Save & Notify Me →
                  </button>
                  <p className="text-[10px] text-center text-ink-300">
                    We hate spam. Your contact info will only be used for this bundle release.
                  </p>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
