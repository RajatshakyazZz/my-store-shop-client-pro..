import Link from 'next/link';
import { Search, Home, Film, Sparkles, ArrowRight } from 'lucide-react';

export const metadata = {
  title: '404 - Bundle Not Found | CreatorMint',
  description: 'The requested reels bundle or page could not be found. Explore our 222,000+ viral reels bundles in shop.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-leaf-50/50 to-white flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-leaf-100 text-leaf-600 font-black text-3xl shadow-inner">
          404
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1019] tracking-tight">
            Bundle Ya Page Nahi Mila
          </h1>
          <p className="text-sm text-ink-400 max-w-md mx-auto">
            Ye URL change ho gaya hai ya bundle remove ho chuka hai. Niche diye gaye links se hamare viral reels bundles explore karein.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-white text-xs font-bold hover:bg-black transition-all shadow-sm"
          >
            <Home className="w-3.5 h-3.5" />
            Home Page
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full btn-gradient-primary text-ink text-xs font-bold hover:opacity-95 transition-all shadow-md"
          >
            <Search className="w-3.5 h-3.5" />
            Explore All Bundles
          </Link>
          <Link
            href="/reels"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-canvas-200 text-ink-600 text-xs font-bold hover:border-leaf-300 transition-all shadow-sm"
          >
            <Film className="w-3.5 h-3.5" />
            Watch Video Previews
          </Link>
        </div>

        {/* Popular Categories */}
        <div className="pt-6 border-t border-canvas-200">
          <p className="text-xs font-bold text-ink-300 uppercase tracking-wider mb-3">
            Popular Categories
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { name: 'AI Reels', href: '/category/ai-reels' },
              { name: 'Motivational', href: '/category/motivation-reels' },
              { name: 'Animation', href: '/category/animation-reels' },
              { name: 'Story & History', href: '/category/story-reels' },
              { name: 'Fitness & Gym', href: '/category/fitness-reels' },
            ].map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="px-3 py-1 rounded-full text-xs font-medium bg-canvas text-ink-500 hover:bg-leaf-100 hover:text-leaf-700 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
