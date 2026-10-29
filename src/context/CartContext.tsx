'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BundleProduct, CartItem, LicenseType } from '@/types';
import { ORDER_BUMP } from '@/data/bundles';
import { fetchGlobalBumpOffer, GlobalBumpOfferConfig } from '@/lib/bumpOffer';
import { fetchFreeBundleOffer, getFreeBundleOfferSync, FreeBundleOfferConfig } from '@/lib/freeBundleOffer';
import { useRouter } from 'next/navigation';
import { track } from '@/lib/analytics';

interface CartContextType {
  items: CartItem[];
  buyNowItem: CartItem | null;
  setBuyNowItem: (item: CartItem | null) => void;
  addToCart: (product: BundleProduct, license?: LicenseType) => void;
  buyNow: (product: BundleProduct, license?: LicenseType) => void;
  removeFromCart: (productId: string, license: LicenseType) => void;
  clearBuyNowItem: () => void;
  clearCart: () => void;
  orderBumpAdded: boolean;
  setOrderBumpAdded: (added: boolean) => void;
  toggleOrderBump: () => void;
  cartCount: number;
  subtotal: number;
  total: number;
  globalBumpOffer?: GlobalBumpOfferConfig | null;
  freeBundleOffer?: FreeBundleOfferConfig | null;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  // Free Bundles Offer
  freeBundles: BundleProduct[];
  claimFreeBundles: (bundles: BundleProduct[]) => void;
  removeFreeBundle: (productId: string) => void;
  isFreeBundleModalOpen: boolean;
  setIsFreeBundleModalOpen: (open: boolean) => void;
  isQualifiedForFreeOffer: boolean;
  freeOfferProgress: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [freeBundles, setFreeBundles] = useState<BundleProduct[]>([]);
  const [isFreeBundleModalOpen, setIsFreeBundleModalOpen] = useState(false);
  const [buyNowItem, setBuyNowItemState] = useState<CartItem | null>(null);
  const [orderBumpAdded, setOrderBumpAdded] = useState(false);
  const [globalBumpOffer, setGlobalBumpOffer] = useState<GlobalBumpOfferConfig | null>(null);
  const [freeBundleOffer, setFreeBundleOffer] = useState<FreeBundleOfferConfig>(() => getFreeBundleOfferSync());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchGlobalBumpOffer(true).then((res) => {
      setGlobalBumpOffer(res);
    }).catch(() => {});

    fetchFreeBundleOffer(true).then((res) => {
      setFreeBundleOffer(res);
    }).catch(() => {});

    const handleOfferUpdated = (e: any) => {
      if (e?.detail) {
        setFreeBundleOffer((prev) => ({ ...prev, ...e.detail }));
      } else {
        fetchFreeBundleOffer(true).then((res) => setFreeBundleOffer(res)).catch(() => {});
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('vaultzet:offer_updated', handleOfferUpdated);
      const handleStorage = (e: StorageEvent) => {
        if (e.key === 'vaultzet_free_bundle_offer') {
          fetchFreeBundleOffer(true).then((res) => setFreeBundleOffer(res)).catch(() => {});
        }
      };
      window.addEventListener('storage', handleStorage);
      return () => {
        window.removeEventListener('vaultzet:offer_updated', handleOfferUpdated);
        window.removeEventListener('storage', handleStorage);
      };
    }
  }, []);

  const setBuyNowItem = (item: CartItem | null) => {
    setBuyNowItemState(item);
    try {
      if (item) {
        sessionStorage.setItem('vaultzet_buynow_item', JSON.stringify(item));
        localStorage.setItem('vaultzet_buynow_item', JSON.stringify(item));
      } else {
        sessionStorage.removeItem('vaultzet_buynow_item');
        localStorage.removeItem('vaultzet_buynow_item');
      }
    } catch {}
  };

  const isHydrated = React.useRef(false);
  const prevSubtotalRef = React.useRef<number>(0);

  // Load from storage
  useEffect(() => {
    try {
      localStorage.removeItem('vaultzet_cart');

      const saved = localStorage.getItem('vaultzet_cart_v2');
      if (saved && saved !== '[]') {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        }
      }

      const savedFree = localStorage.getItem('vaultzet_free_bundles_v2');
      if (savedFree && savedFree !== '[]') {
        const parsedFree = JSON.parse(savedFree);
        if (Array.isArray(parsedFree) && parsedFree.length > 0) {
          setFreeBundles(parsedFree.slice(0, 2));
        }
      }

      const savedBuyNow = sessionStorage.getItem('vaultzet_buynow_item') || localStorage.getItem('vaultzet_buynow_item');
      if (savedBuyNow && savedBuyNow !== 'null') {
        setBuyNowItemState(JSON.parse(savedBuyNow));
      }
      const savedBump = localStorage.getItem('vaultzet_bump');
      if (savedBump === 'true') {
        setOrderBumpAdded(true);
      }
    } catch {
      // ignore
    }
    isHydrated.current = true;
  }, []);

  // Save cart to local storage after initial hydration
  useEffect(() => {
    if (!isHydrated.current) return;
    try {
      localStorage.setItem('vaultzet_cart_v2', JSON.stringify(items));
      localStorage.setItem('vaultzet_free_bundles_v2', JSON.stringify(freeBundles));
      localStorage.setItem('vaultzet_bump', JSON.stringify(orderBumpAdded));
    } catch {
      // ignore
    }
  }, [items, freeBundles, orderBumpAdded]);

  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const bumpPrice = globalBumpOffer?.price != null && globalBumpOffer.price > 0 ? Number(globalBumpOffer.price) : ORDER_BUMP.discountPrice;
  const isBumpActive = globalBumpOffer ? globalBumpOffer.enabled !== false : true;
  const total = subtotal + (orderBumpAdded && isBumpActive ? bumpPrice : 0);

  const isOfferActive = freeBundleOffer?.enabled !== false;
  const offerMinCart = isOfferActive ? (freeBundleOffer?.minCartValue || 149) : 999999999;
  const offerMaxQuantity = isOfferActive ? (freeBundleOffer?.freeBundleQuantity || 2) : 0;

  const isQualifiedForFreeOffer = isOfferActive && subtotal >= offerMinCart;
  const freeOfferProgress = isOfferActive ? Math.min(100, Math.round((subtotal / offerMinCart) * 100)) : 0;
  const cartCount = items.length + freeBundles.length + (orderBumpAdded && isBumpActive ? 1 : 0);

  // Automatically trigger Free Bundles Unlocked popup when cart total crosses or reaches >= minCartValue
  useEffect(() => {
    if (!isHydrated.current || !isOfferActive) return;
    const prevSub = prevSubtotalRef.current;
    if (prevSub < offerMinCart && subtotal >= offerMinCart && freeBundles.length < offerMaxQuantity) {
      setIsFreeBundleModalOpen(true);
    }
    prevSubtotalRef.current = subtotal;
  }, [subtotal, freeBundles.length, isOfferActive, offerMinCart, offerMaxQuantity]);

  const claimFreeBundles = (bundles: BundleProduct[]) => {
    const capped = bundles.slice(0, offerMaxQuantity || 2);
    setFreeBundles(capped);
    try {
      localStorage.setItem('vaultzet_free_bundles_v2', JSON.stringify(capped));
    } catch {}
    setIsFreeBundleModalOpen(false);
    setIsCartOpen(true);
  };

  const removeFreeBundle = (productId: string) => {
    setFreeBundles((prev) => {
      const updated = prev.filter((b) => b.id !== productId && b.slug !== productId);
      try {
        localStorage.setItem('vaultzet_free_bundles_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addToCart = (product: BundleProduct, license: LicenseType = 'personal') => {
    const price = Number(license === 'reseller' ? product.resellerPrice : product.personalPrice);
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id && i.license === license);
      if (existing) {
        return prev;
      }
      return [...prev, { product, license, price }];
    });
    track('add_to_cart', {
      currency: 'INR',
      value: price,
      items: [
        {
          item_id: product.id,
          item_name: product.title,
          item_category: product.category,
          price,
          quantity: 1,
          item_variant: license,
        },
      ],
    });
    setIsCartOpen(true);
  };

  const buyNow = (product: BundleProduct, license: LicenseType = 'personal') => {
    const price = Number(license === 'reseller' ? product.resellerPrice : product.personalPrice);
    const singleItem: CartItem = { product, license, price };
    setBuyNowItem(singleItem);
    try {
      sessionStorage.setItem('vaultzet_buynow_item', JSON.stringify(singleItem));
      localStorage.setItem('vaultzet_buynow_item', JSON.stringify(singleItem));
    } catch {
      // ignore
    }
    track('begin_checkout', {
      currency: 'INR',
      value: price,
      items: [
        {
          item_id: product.id,
          item_name: product.title,
          item_category: product.category,
          price,
          quantity: 1,
          item_variant: license,
        },
      ],
    });
    setIsCartOpen(false);
    const slugOrId = product.slug || product.id;
    router.push(`/checkout?product=${encodeURIComponent(slugOrId)}&mode=buynow`);
  };

  const clearBuyNowItem = () => {
    setBuyNowItem(null);
    try {
      sessionStorage.removeItem('vaultzet_buynow_item');
      localStorage.removeItem('vaultzet_buynow_item');
    } catch {
      // ignore
    }
  };

  const removeFromCart = (productId: string, license: LicenseType) => {
    setItems((prev) => {
      const item = prev.find((i) => i.product.id === productId && i.license === license);
      if (item) {
        track('remove_from_cart', {
          currency: 'INR',
          value: item.price,
          items: [
            {
              item_id: item.product.id,
              item_name: item.product.title,
              item_category: item.product.category,
              price: item.price,
              quantity: 1,
              item_variant: item.license,
            },
          ],
        });
      }
      return prev.filter((i) => !(i.product.id === productId && i.license === license));
    });
  };

  const clearCart = () => {
    setItems([]);
    setFreeBundles([]);
    setOrderBumpAdded(false);
  };

  const toggleOrderBump = () => {
    setOrderBumpAdded((prev) => !prev);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        buyNowItem,
        setBuyNowItem,
        addToCart,
        buyNow,
        removeFromCart,
        clearBuyNowItem,
        clearCart,
        orderBumpAdded,
        setOrderBumpAdded,
        toggleOrderBump,
        cartCount,
        subtotal,
        total,
        globalBumpOffer,
        freeBundleOffer,
        isCartOpen,
        setIsCartOpen,
        freeBundles,
        claimFreeBundles,
        removeFreeBundle,
        isFreeBundleModalOpen,
        setIsFreeBundleModalOpen,
        isQualifiedForFreeOffer,
        freeOfferProgress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
