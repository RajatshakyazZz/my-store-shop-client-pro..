import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export interface HeaderOfferConfig {
  enabled: boolean;
  show_badge: boolean;
  badge_emoji: string;
  badge_text: string;
  prefix_text: string;
  text_regular: string;
  highlight_text: string;
  suffix_text: string;
  show_coupon: boolean;
  coupon_label: string;
  coupon_code: string;
  allow_dismiss: boolean;
  redirect_url?: string;
  bg_gradient?: string; // 'luxury_red' | 'pure_dark' | 'neon_ruby' | 'golden_amber' | 'emerald_deals'
  updated_at?: string;
}

export const DEFAULT_HEADER_OFFER: HeaderOfferConfig = {
  enabled: true,
  show_badge: true,
  badge_emoji: '🔥',
  badge_text: 'EXCLUSIVE OFFER',
  prefix_text: '🔥 Mega Sale: ',
  text_regular: 'Flat ',
  highlight_text: '20% Extra Discount',
  suffix_text: ' on All Reels Bundles! ✨',
  show_coupon: true,
  coupon_label: 'CODE',
  coupon_code: 'OFF20',
  allow_dismiss: true,
  redirect_url: '',
  bg_gradient: 'luxury_red',
};

let cachedOffer: HeaderOfferConfig | null = null;
let lastOfferFetch = 0;

export function getHeaderOfferSync(): HeaderOfferConfig {
  if (cachedOffer) return cachedOffer;
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('vaultzet_header_offer');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          const loaded: HeaderOfferConfig = { ...DEFAULT_HEADER_OFFER, ...parsed };
          cachedOffer = loaded;
          return loaded;
        }
      }
    } catch {}
  }
  return DEFAULT_HEADER_OFFER;
}

export async function fetchHeaderOffer(force = false): Promise<HeaderOfferConfig> {
  const now = Date.now();
  if (!force && cachedOffer && now - lastOfferFetch < 30000) {
    return cachedOffer;
  }

  // 1. Check local storage first
  let localData: HeaderOfferConfig | null = null;
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('vaultzet_header_offer');
      if (raw) {
        localData = JSON.parse(raw);
        if (localData && typeof localData === 'object') {
          cachedOffer = { ...DEFAULT_HEADER_OFFER, ...localData };
        }
      }
    } catch {}
  }

  // 2. Fetch from public server-side settings API
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/settings/header-offer', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.offer) {
          const loaded: HeaderOfferConfig = { ...DEFAULT_HEADER_OFFER, ...json.offer };
          cachedOffer = loaded;
          lastOfferFetch = now;
          localStorage.setItem('vaultzet_header_offer', JSON.stringify(loaded));
          return loaded;
        }
      }
    } catch (e) {
      console.warn('API fetch error for header-offer, falling back to Firestore/local:', e);
    }
  }

  // 3. Direct Firestore lookup as fallback
  if (db) {
    try {
      const snap = await getDoc(doc(db, 'store_settings', 'header_offer')).catch(() => null);
      if (snap && snap.exists()) {
        const data = snap.data();
        const loaded: HeaderOfferConfig = {
          ...DEFAULT_HEADER_OFFER,
          ...data,
          enabled: typeof data.enabled === 'boolean' ? data.enabled : true,
          show_badge: typeof data.show_badge === 'boolean' ? data.show_badge : true,
          show_coupon: typeof data.show_coupon === 'boolean' ? data.show_coupon : true,
          allow_dismiss: typeof data.allow_dismiss === 'boolean' ? data.allow_dismiss : true,
        };
        cachedOffer = loaded;
        lastOfferFetch = now;
        if (typeof window !== 'undefined') {
          localStorage.setItem('vaultzet_header_offer', JSON.stringify(loaded));
        }
        return loaded;
      }
    } catch (err) {
      console.warn('Firestore direct fetch error for header-offer:', err);
    }
  }

  return localData ? { ...DEFAULT_HEADER_OFFER, ...localData } : DEFAULT_HEADER_OFFER;
}
