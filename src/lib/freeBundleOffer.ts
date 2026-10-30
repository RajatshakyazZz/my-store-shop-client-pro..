import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export interface FreeBundleOfferConfig {
  enabled: boolean;
  bannerImage: string;
  bannerFallbackImage?: string;
  minCartValue: number;
  freeBundleQuantity: number;
  headline?: string;
  subheadline?: string;
  buttonText?: string;
  updatedAt?: string;
}

export function sanitizeOfferBannerUrl(url?: string): string {
  if (!url) return '';
  const trimmed = String(url).trim();
  if (
    trimmed === '/banner-free-bundles.png' ||
    trimmed.includes('Vaultzet-Neon-Reels-Bundle-Sale') ||
    trimmed.toLowerCase().includes('vaultzet')
  ) {
    return '';
  }
  return trimmed;
}

/**
 * Checks whether a bundle is a master All-Access / Mega Bundle (Personal or Reseller).
 * Mega bundles must NEVER be claimable as promotional ₹0 free gifts.
 */
export function isMegaAllAccessBundle(item: any): boolean {
  if (!item) return false;
  const id = String(item.id || item.productId || '').toLowerCase();
  const slug = String(item.slug || '').toLowerCase();
  const title = String(item.title || item.name || '').toLowerCase();
  const catSlug = String(item.categorySlug || '').toLowerCase();

  return (
    id.startsWith('plan-') ||
    id.includes('all-bundles') ||
    id.includes('all_bundles') ||
    id.includes('all-access') ||
    id.includes('all_access') ||
    id.includes('mega-bundle') ||
    slug.includes('all-bundles') ||
    slug.includes('all-access') ||
    slug.includes('mega-bundle') ||
    slug === 'all-bundles-personal-use' ||
    slug === 'all-bundles-reseller-rights' ||
    title.includes('all bundles') ||
    title.includes('all-access') ||
    title.includes('all access') ||
    title.includes('mega bundle') ||
    (title.includes('all') && title.includes('personal')) ||
    (title.includes('all') && title.includes('reseller')) ||
    catSlug === 'all-access' ||
    Boolean(item.isAllAccess)
  );
}

export const DEFAULT_FREE_BUNDLE_OFFER: FreeBundleOfferConfig = {
  enabled: true,
  bannerImage: '',
  bannerFallbackImage: '',
  minCartValue: 149,
  freeBundleQuantity: 2,
  headline: 'Get 2 of Any Bundle FREE',
  subheadline: 'PAY ₹149 OR MORE & PICK ANY 2 ADDITIONAL REELS BUNDLES AT NO EXTRA COST!',
  buttonText: '🎁 Claim 2 Free Bundles on Min. ₹149 Order →',
};

let cachedOffer: FreeBundleOfferConfig | null = null;
let lastOfferFetch = 0;

export function getFreeBundleOfferSync(): FreeBundleOfferConfig {
  if (cachedOffer) return cachedOffer;
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('vaultzet_free_bundle_offer');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          const loaded: FreeBundleOfferConfig = {
            ...DEFAULT_FREE_BUNDLE_OFFER,
            ...parsed,
            bannerImage: sanitizeOfferBannerUrl(parsed.bannerImage || parsed.banner_image),
            bannerFallbackImage: sanitizeOfferBannerUrl(parsed.bannerFallbackImage || parsed.banner_fallback_image),
          };
          cachedOffer = loaded;
          return loaded;
        }
      }
    } catch {}
  }
  return DEFAULT_FREE_BUNDLE_OFFER;
}

export async function fetchFreeBundleOffer(force = false): Promise<FreeBundleOfferConfig> {
  const now = Date.now();
  if (!force && cachedOffer && now - lastOfferFetch < 60000) {
    return cachedOffer;
  }

  // 1. Check local storage first
  let localData: FreeBundleOfferConfig | null = null;
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('vaultzet_free_bundle_offer');
      if (raw) {
        localData = JSON.parse(raw);
      }
    } catch {}
  }

  // 2. Fetch from Firestore (store_settings/general or store_settings/free_bundle_offer)
  if (db) {
    try {
      // Check general document first
      const genSnap = await getDoc(doc(db, 'store_settings', 'general')).catch(() => null);
      if (genSnap && genSnap.exists()) {
        const gData = genSnap.data();
        if (gData.free_bundle_offer && typeof gData.free_bundle_offer === 'object') {
          const f = gData.free_bundle_offer;
          const minVal = f.min_cart_value != null ? Number(f.min_cart_value) : DEFAULT_FREE_BUNDLE_OFFER.minCartValue;
          const freeQty = f.free_bundle_quantity != null ? Number(f.free_bundle_quantity) : DEFAULT_FREE_BUNDLE_OFFER.freeBundleQuantity;

          cachedOffer = {
            enabled: typeof f.enabled === 'boolean' ? f.enabled : true,
            bannerImage: sanitizeOfferBannerUrl(f.banner_image),
            bannerFallbackImage: sanitizeOfferBannerUrl(f.banner_fallback_image),
            minCartValue: minVal,
            freeBundleQuantity: freeQty,
            headline: f.headline || `Get ${freeQty} of Any Bundle FREE`,
            subheadline: f.subheadline || `PAY ₹${minVal} OR MORE & PICK ANY ${freeQty} ADDITIONAL REELS BUNDLES AT NO EXTRA COST!`,
            buttonText: f.button_text || `🎁 Claim ${freeQty} Free Bundles on Min. ₹${minVal} Order →`,
            updatedAt: f.updated_at,
          };
          lastOfferFetch = now;

          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('vaultzet_free_bundle_offer', JSON.stringify(cachedOffer));
            } catch {}
          }
          return cachedOffer;
        }
      }

      const snap = await getDoc(doc(db, 'store_settings', 'free_bundle_offer')).catch(() => null);
      if (snap && snap.exists()) {
        const data = snap.data();
        const minVal = data.min_cart_value != null ? Number(data.min_cart_value) : DEFAULT_FREE_BUNDLE_OFFER.minCartValue;
        const freeQty = data.free_bundle_quantity != null ? Number(data.free_bundle_quantity) : DEFAULT_FREE_BUNDLE_OFFER.freeBundleQuantity;

        cachedOffer = {
          enabled: typeof data.enabled === 'boolean' ? data.enabled : true,
          bannerImage: sanitizeOfferBannerUrl(data.banner_image),
          bannerFallbackImage: sanitizeOfferBannerUrl(data.banner_fallback_image),
          minCartValue: minVal,
          freeBundleQuantity: freeQty,
          headline: data.headline || `Get ${freeQty} of Any Bundle FREE`,
          subheadline: data.subheadline || `PAY ₹${minVal} OR MORE & PICK ANY ${freeQty} ADDITIONAL REELS BUNDLES AT NO EXTRA COST!`,
          buttonText: data.button_text || `🎁 Claim ${freeQty} Free Bundles on Min. ₹${minVal} Order →`,
          updatedAt: data.updated_at || data.updatedAt,
        };
        lastOfferFetch = now;

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('vaultzet_free_bundle_offer', JSON.stringify(cachedOffer));
          } catch {}
        }
        return cachedOffer;
      }
    } catch (err) {
      console.warn('Error reading free_bundle_offer from Firestore:', err);
    }
  }

  // 3. Fallback to API route if direct Firestore returned null
  try {
    const res = await fetch('/api/settings/free-bundle-offer', { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json && json.success && json.offer) {
        cachedOffer = json.offer;
        lastOfferFetch = now;
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('vaultzet_free_bundle_offer', JSON.stringify(cachedOffer));
          } catch {}
        }
        return cachedOffer!;
      }
    }
  } catch {}

  if (localData) {
    cachedOffer = { ...DEFAULT_FREE_BUNDLE_OFFER, ...localData };
    return cachedOffer;
  }

  cachedOffer = DEFAULT_FREE_BUNDLE_OFFER;
  return cachedOffer;
}
