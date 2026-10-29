import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ORDER_BUMP } from '@/data/bundles';
import type { BundleProduct, OrderBumpItem, ProductBumpOfferConfig } from '@/types';

export interface GlobalBumpOfferConfig {
  enabled: boolean;
  bumpType?: 'store_product' | 'custom';
  productId: string;
  productSlug: string;
  title: string;
  subtitle: string;
  price: number;
  regularPrice: number;
  discountPercentage: number;
  thumbnail: string;
  reelCount: number;
  googleDriveLink?: string;
  updatedAt?: string;
}

export const DEFAULT_GLOBAL_BUMP: GlobalBumpOfferConfig = {
  enabled: true,
  bumpType: 'store_product',
  productId: ORDER_BUMP.id || 'bump-special-01',
  productSlug: '1500-ultimate-twisted-world-reel-bundle',
  title: ORDER_BUMP.title || '1500+ Ultimate Twisted World & Viral AI Reels Pack',
  subtitle: ORDER_BUMP.subtitle || 'Add this exclusive bonus pack to your order & get 80% instant discount!',
  price: ORDER_BUMP.discountPrice || 99,
  regularPrice: ORDER_BUMP.originalPrice || 499,
  discountPercentage: ORDER_BUMP.discountPercentage || 80,
  thumbnail: ORDER_BUMP.thumbnail || 'https://reelsbundles.in/wp-content/uploads/2026/10/3200-ultimate-twisted-world-reel-bundle-reels-bundle-1-2-768x576.png',
  reelCount: ORDER_BUMP.reelCount || 1500,
  googleDriveLink: 'https://drive.google.com/drive/folders/bonus-pack-twisted-world',
};

let cachedGlobalBump: GlobalBumpOfferConfig | null = null;
let lastBumpFetch = 0;

export function getGlobalBumpOfferSync(): GlobalBumpOfferConfig {
  if (cachedGlobalBump) return cachedGlobalBump;
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('vaultzet_global_bump_offer');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          const loaded: GlobalBumpOfferConfig = { ...DEFAULT_GLOBAL_BUMP, ...parsed };
          cachedGlobalBump = loaded;
          return loaded;
        }
      }
    } catch {}
  }
  return DEFAULT_GLOBAL_BUMP;
}

export async function fetchGlobalBumpOffer(force = false): Promise<GlobalBumpOfferConfig> {
  const now = Date.now();
  if (!force && cachedGlobalBump && now - lastBumpFetch < 60000) {
    return cachedGlobalBump;
  }

  // 1. Check local storage first for instant responsiveness
  let localData: GlobalBumpOfferConfig | null = null;
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('vaultzet_global_bump_offer');
      if (raw) {
        localData = JSON.parse(raw);
      }
    } catch {}
  }

  // 2. Fetch from Firestore (store_settings/bump_offer or store_settings/general)
  if (db) {
    try {
      const snap = await getDoc(doc(db, 'store_settings', 'bump_offer')).catch(() => null);
      if (snap && snap.exists()) {
        const data = snap.data();
        const discountPercentage =
          data.regular_price && data.price
            ? Math.max(1, Math.round(((Number(data.regular_price) - Number(data.price)) / Number(data.regular_price)) * 100))
            : data.discount_percentage || 80;

        cachedGlobalBump = {
          enabled: typeof data.enabled === 'boolean' ? data.enabled : (data.bump_enabled ?? true),
          bumpType: data.bump_type || data.bumpType || (data.product_slug ? 'store_product' : 'custom'),
          productId: data.product_id || data.bump_product_id || DEFAULT_GLOBAL_BUMP.productId,
          productSlug: data.product_slug || data.bump_product_slug || DEFAULT_GLOBAL_BUMP.productSlug,
          title: data.title || data.bump_title || DEFAULT_GLOBAL_BUMP.title,
          subtitle: data.subtitle || data.bump_subtitle || DEFAULT_GLOBAL_BUMP.subtitle,
          price: data.price != null ? Number(data.price) : (data.bump_price != null ? Number(data.bump_price) : DEFAULT_GLOBAL_BUMP.price),
          regularPrice: data.regular_price != null ? Number(data.regular_price) : (data.bump_regular_price != null ? Number(data.bump_regular_price) : DEFAULT_GLOBAL_BUMP.regularPrice),
          discountPercentage,
          thumbnail: data.thumbnail || data.bump_thumbnail || DEFAULT_GLOBAL_BUMP.thumbnail,
          reelCount: data.reel_count != null ? Number(data.reel_count) : (data.bump_reel_count != null ? Number(data.bump_reel_count) : DEFAULT_GLOBAL_BUMP.reelCount),
          googleDriveLink: data.google_drive_link || data.googleDriveLink || DEFAULT_GLOBAL_BUMP.googleDriveLink,
          updatedAt: data.updated_at || data.updatedAt,
        };
        lastBumpFetch = now;

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('vaultzet_global_bump_offer', JSON.stringify(cachedGlobalBump));
          } catch {}
        }
        return cachedGlobalBump;
      }

      // Check general settings document fallback
      const genSnap = await getDoc(doc(db, 'store_settings', 'general')).catch(() => null);
      if (genSnap && genSnap.exists()) {
        const gData = genSnap.data();
        if (gData.bump_offer && typeof gData.bump_offer === 'object') {
          const b = gData.bump_offer;
          const discountPercentage =
            b.regular_price && b.price
              ? Math.max(1, Math.round(((Number(b.regular_price) - Number(b.price)) / Number(b.regular_price)) * 100))
              : b.discount_percentage || 80;

          cachedGlobalBump = {
            enabled: typeof b.enabled === 'boolean' ? b.enabled : true,
            bumpType: b.bump_type || b.bumpType || (b.product_slug ? 'store_product' : 'custom'),
            productId: b.product_id || DEFAULT_GLOBAL_BUMP.productId,
            productSlug: b.product_slug || DEFAULT_GLOBAL_BUMP.productSlug,
            title: b.title || DEFAULT_GLOBAL_BUMP.title,
            subtitle: b.subtitle || DEFAULT_GLOBAL_BUMP.subtitle,
            price: b.price != null ? Number(b.price) : DEFAULT_GLOBAL_BUMP.price,
            regularPrice: b.regular_price != null ? Number(b.regular_price) : DEFAULT_GLOBAL_BUMP.regularPrice,
            discountPercentage,
            thumbnail: b.thumbnail || DEFAULT_GLOBAL_BUMP.thumbnail,
            reelCount: b.reel_count != null ? Number(b.reel_count) : DEFAULT_GLOBAL_BUMP.reelCount,
            googleDriveLink: b.google_drive_link || DEFAULT_GLOBAL_BUMP.googleDriveLink,
          };
          lastBumpFetch = now;

          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('vaultzet_global_bump_offer', JSON.stringify(cachedGlobalBump));
            } catch {}
          }
          return cachedGlobalBump;
        }
      }
    } catch (err) {
      console.warn('Error reading store bump offer from Firestore:', err);
    }
  }

  // 3. Fallback to local storage or defaults
  if (localData) {
    cachedGlobalBump = { ...DEFAULT_GLOBAL_BUMP, ...localData };
    return cachedGlobalBump;
  }

  cachedGlobalBump = DEFAULT_GLOBAL_BUMP;
  return cachedGlobalBump;
}

/**
 * Resolves the effective Bump Offer for a checkout session:
 * 1. If product has custom bump offer configured and mode !== 'disabled', return product's custom bump offer.
 * 2. If product has bump offer explicitly disabled, return null (no bump offer shown).
 * 3. If product has default mode (or no custom offer configured), fallback to Global Bump Offer.
 * 4. If Global Bump Offer is toggled off (enabled === false), return null.
 */
export function resolveEffectiveBumpOffer(
  product?: BundleProduct | null,
  globalOffer?: GlobalBumpOfferConfig | null
): OrderBumpItem | null {
  const global = globalOffer || getGlobalBumpOfferSync();

  // If a specific product is being checked out
  if (product) {
    const bump = product.bumpOffer;
    if (bump) {
      // Explicitly disabled for this product
      if (bump.mode === 'disabled' || (bump.enabled === false && bump.mode !== 'default')) {
        return null;
      }

      // Specific custom bump offer for this product
      if (bump.mode === 'custom' || (bump.enabled && (bump.productId || bump.productSlug || bump.title))) {
        const price = bump.price != null && bump.price > 0 ? Number(bump.price) : 99;
        const regPrice = bump.regularPrice != null && bump.regularPrice > 0 ? Number(bump.regularPrice) : price * 5;
        const discPercent = Math.max(1, Math.round(((regPrice - price) / regPrice) * 100));

        return {
          id: bump.productId || `bump-${product.slug || product.id}`,
          productId: bump.productId,
          productSlug: bump.productSlug,
          title: bump.title || 'Special Checkout Bonus Upgrade',
          subtitle: bump.subtitle || 'Add this exclusive bonus pack to your order & get instant discount!',
          originalPrice: regPrice,
          discountPrice: price,
          discountPercentage: discPercent,
          thumbnail: bump.thumbnail || product.thumbnail || DEFAULT_GLOBAL_BUMP.thumbnail,
          reelCount: bump.reelCount || 1000,
          googleDriveLink: bump.googleDriveLink,
          enabled: true,
        };
      }
    }
  }

  // Fallback to Global Bump Offer
  if (!global || global.enabled === false) {
    return null;
  }

  const price = global.price != null && global.price > 0 ? Number(global.price) : 99;
  const regPrice = global.regularPrice != null && global.regularPrice > 0 ? Number(global.regularPrice) : price * 5;
  const discPercent = Math.max(1, Math.round(((regPrice - price) / regPrice) * 100));

  return {
    id: global.productId || DEFAULT_GLOBAL_BUMP.productId,
    productId: global.productId,
    productSlug: global.productSlug,
    title: global.title || DEFAULT_GLOBAL_BUMP.title,
    subtitle: global.subtitle || DEFAULT_GLOBAL_BUMP.subtitle,
    originalPrice: regPrice,
    discountPrice: price,
    discountPercentage: discPercent,
    thumbnail: global.thumbnail || DEFAULT_GLOBAL_BUMP.thumbnail,
    reelCount: global.reelCount || DEFAULT_GLOBAL_BUMP.reelCount,
    googleDriveLink: global.googleDriveLink || DEFAULT_GLOBAL_BUMP.googleDriveLink,
    enabled: true,
  };
}
