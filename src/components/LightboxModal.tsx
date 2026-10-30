'use client';

import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface LightboxItem {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
  badge?: string;
}

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: LightboxItem[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export default function LightboxModal({
  isOpen,
  onClose,
  items,
  currentIndex,
  onNavigate,
}: LightboxModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && items.length > 1) {
        onNavigate((currentIndex - 1 + items.length) % items.length);
      }
      if (e.key === 'ArrowRight' && items.length > 1) {
        onNavigate((currentIndex + 1) % items.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, currentIndex, items.length, onClose, onNavigate]);

  if (!isOpen || !items[currentIndex]) return null;

  const current = items[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate((currentIndex - 1 + items.length) % items.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate((currentIndex + 1) % items.length);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-3 sm:p-6 animate-fadeIn select-none"
      onClick={onClose}
    >
      {/* Top Header Bar */}
      <div
        className="w-full max-w-5xl flex items-center justify-between text-white/90 z-20 py-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-1 rounded-full bg-white/10 text-white text-xs font-bold border border-white/10">
            {currentIndex + 1} / {items.length}
          </span>
          {current.badge && (
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              {current.badge}
            </span>
          )}
        </div>

        <button
          onClick={onClose}
          className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 active:scale-95"
          aria-label="Close"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Main Image Center Frame */}
      <div
        className="relative w-full max-w-4xl flex-1 flex items-center justify-center p-2 min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Arrow */}
        {items.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 z-20 p-2.5 sm:p-3.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/15 backdrop-blur-md shadow-xl transition-all hover:scale-110 active:scale-95"
            aria-label="Previous proof"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* The Screenshot Preview */}
        <div className="relative max-h-full max-w-full flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.image}
            alt={current.title || 'Proof screenshot'}
            className="max-h-[75vh] sm:max-h-[80vh] w-auto max-w-full object-contain rounded-2xl sm:rounded-3xl shadow-2xl border border-white/15"
          />
        </div>

        {/* Right Arrow */}
        {items.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 z-20 p-2.5 sm:p-3.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/15 backdrop-blur-md shadow-xl transition-all hover:scale-110 active:scale-95"
            aria-label="Next proof"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>

      {/* Bottom Info Bar */}
      <div
        className="w-full max-w-2xl bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-2.5 text-center text-white z-20 mt-2"
        onClick={(e) => e.stopPropagation()}
      >
        {current.title && <div className="text-sm sm:text-base font-bold text-white">{current.title}</div>}
        {current.subtitle && (
          <div className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">{current.subtitle}</div>
        )}
      </div>
    </div>
  );
}
