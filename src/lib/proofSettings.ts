import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export interface GrowthProofItem {
  id: string;
  image: string;
  title: string;
  followers?: string;
  metric?: string;
  tag?: string;
}

export interface GrowthProofsConfig {
  enabled: boolean;
  badge: string;
  headline: string;
  subheadline: string;
  autoplay: boolean;
  autoplayInterval: number; // in milliseconds (default: 4000)
  items: GrowthProofItem[];
  updatedAt?: string;
}

export interface EarningProofItem {
  id: string;
  image: string;
  amount: string;
  tag: string;
  caption: string;
  date?: string;
}

export interface EarningProofsConfig {
  enabled: boolean;
  badge: string;
  headline: string;
  subheadline: string;
  items: EarningProofItem[];
  updatedAt?: string;
}

export const DEFAULT_GROWTH_PROOFS: GrowthProofsConfig = {
  enabled: true,
  badge: 'REAL GROWTH PROOF',
  headline: 'Real Growth By Our Bundle Users',
  subheadline: 'These creators acquired our bundles, scaled to 100K+ followers, and monetize daily.',
  autoplay: true,
  autoplayInterval: 4000,
  items: [
    {
      id: 'gp-1',
      image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=700&auto=format&fit=crop&q=80',
      title: '@viral.animation_',
      followers: '170K Followers',
      metric: '+120K in 30 Days',
      tag: 'AI Animation',
    },
    {
      id: 'gp-2',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=700&auto=format&fit=crop&q=80',
      title: '@aigrowth_hub',
      followers: '240K Followers',
      metric: '18M+ Monthly Views',
      tag: 'AI Reels',
    },
    {
      id: 'gp-3',
      image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=700&auto=format&fit=crop&q=80',
      title: '@dailyreels_creator',
      followers: '310K Followers',
      metric: '+185K in 45 Days',
      tag: 'Trending Niche',
    },
    {
      id: 'gp-4',
      image: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=700&auto=format&fit=crop&q=80',
      title: '@future_creators',
      followers: '115K Followers',
      metric: '6.4M Viral Views',
      tag: 'Viral Story',
    },
    {
      id: 'gp-5',
      image: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=700&auto=format&fit=crop&q=80',
      title: '@content_scale_ai',
      followers: '195K Followers',
      metric: '100% Organic Growth',
      tag: 'Creator Niche',
    },
  ],
};

export const DEFAULT_EARNING_PROOFS: EarningProofsConfig = {
  enabled: true,
  badge: '💰 VERIFIED EARNINGS & PAYOUTS',
  headline: 'Real Creator & Reseller Earnings',
  subheadline: 'Genuine payment screenshots, UPI receipts and wallet payouts from our resellers and digital creators.',
  items: [
    {
      id: 'ep-1',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=700&auto=format&fit=crop&q=80',
      amount: '₹28,450',
      tag: 'UPI Received',
      caption: 'Rahul Verma — Weekly profit reselling AI reels to client pages',
      date: 'Yesterday',
    },
    {
      id: 'ep-2',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=700&auto=format&fit=crop&q=80',
      amount: '₹42,200',
      tag: 'Bank Transfer',
      caption: 'Priya Sharma — 10x ROI in first month with Reseller Rights',
      date: '3 days ago',
    },
    {
      id: 'ep-3',
      image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=700&auto=format&fit=crop&q=80',
      amount: '₹14,900',
      tag: 'Reseller Profit',
      caption: 'Aman K. — Earned via Instagram DM bundle sales',
      date: 'This week',
    },
    {
      id: 'ep-4',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=700&auto=format&fit=crop&q=80',
      amount: '₹68,500',
      tag: 'Monthly Payout',
      caption: 'Agency partner — Monetized niche pages using our packs',
      date: 'Oct 2026',
    },
  ],
};

// In-memory runtime caches
let cachedGrowth: GrowthProofsConfig | null = null;
let lastGrowthFetch = 0;

let cachedEarning: EarningProofsConfig | null = null;
let lastEarningFetch = 0;

export function getGrowthProofsSync(): GrowthProofsConfig {
  if (cachedGrowth) return cachedGrowth;
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('vaultzet_growth_proofs');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          const loaded: GrowthProofsConfig = { ...DEFAULT_GROWTH_PROOFS, ...parsed };
          cachedGrowth = loaded;
          return loaded;
        }
      }
    } catch {}
  }
  return DEFAULT_GROWTH_PROOFS;
}

export function getEarningProofsSync(): EarningProofsConfig {
  if (cachedEarning) return cachedEarning;
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('vaultzet_earning_proofs');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          const loaded: EarningProofsConfig = { ...DEFAULT_EARNING_PROOFS, ...parsed };
          cachedEarning = loaded;
          return loaded;
        }
      }
    } catch {}
  }
  return DEFAULT_EARNING_PROOFS;
}

export async function fetchGrowthProofs(force = false): Promise<GrowthProofsConfig> {
  const now = Date.now();
  if (!force && cachedGrowth && now - lastGrowthFetch < 60000) {
    return cachedGrowth;
  }

  // 1. Client-side fetch via internal API
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/settings/growth-proofs', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.config) {
          cachedGrowth = data.config;
          lastGrowthFetch = now;
          try {
            localStorage.setItem('vaultzet_growth_proofs', JSON.stringify(data.config));
          } catch {}
          return data.config;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch /api/settings/growth-proofs:', e);
    }
  }

  // 2. Direct Firestore fallback
  if (db) {
    try {
      const snap = await getDoc(doc(db, 'store_settings', 'growth_proofs')).catch(() => null);
      if (snap && snap.exists()) {
        const data = snap.data() as GrowthProofsConfig;
        cachedGrowth = { ...DEFAULT_GROWTH_PROOFS, ...data };
        lastGrowthFetch = now;
        return cachedGrowth;
      }

      const genSnap = await getDoc(doc(db, 'store_settings', 'general')).catch(() => null);
      if (genSnap && genSnap.exists()) {
        const gData = genSnap.data();
        if (gData.growth_proofs && typeof gData.growth_proofs === 'object') {
          const loaded: GrowthProofsConfig = { ...DEFAULT_GROWTH_PROOFS, ...gData.growth_proofs };
          cachedGrowth = loaded;
          lastGrowthFetch = now;
          return loaded;
        }
      }
    } catch (e) {
      console.warn('Direct Firestore read error for growth_proofs:', e);
    }
  }

  return getGrowthProofsSync();
}

export async function fetchEarningProofs(force = false): Promise<EarningProofsConfig> {
  const now = Date.now();
  if (!force && cachedEarning && now - lastEarningFetch < 60000) {
    return cachedEarning;
  }

  // 1. Client-side fetch via internal API
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/settings/earning-proofs', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.config) {
          cachedEarning = data.config;
          lastEarningFetch = now;
          try {
            localStorage.setItem('vaultzet_earning_proofs', JSON.stringify(data.config));
          } catch {}
          return data.config;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch /api/settings/earning-proofs:', e);
    }
  }

  // 2. Direct Firestore fallback
  if (db) {
    try {
      const snap = await getDoc(doc(db, 'store_settings', 'earning_proofs')).catch(() => null);
      if (snap && snap.exists()) {
        const data = snap.data() as EarningProofsConfig;
        const loaded: EarningProofsConfig = { ...DEFAULT_EARNING_PROOFS, ...data };
        cachedEarning = loaded;
        lastEarningFetch = now;
        return loaded;
      }

      const genSnap = await getDoc(doc(db, 'store_settings', 'general')).catch(() => null);
      if (genSnap && genSnap.exists()) {
        const gData = genSnap.data();
        if (gData.earning_proofs && typeof gData.earning_proofs === 'object') {
          const loaded: EarningProofsConfig = { ...DEFAULT_EARNING_PROOFS, ...gData.earning_proofs };
          cachedEarning = loaded;
          lastEarningFetch = now;
          return loaded;
        }
      }
    } catch (e) {
      console.warn('Direct Firestore read error for earning_proofs:', e);
    }
  }

  return getEarningProofsSync();
}
