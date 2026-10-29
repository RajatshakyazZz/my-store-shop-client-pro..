'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  Zap,
  Lock,
  Clock,
  Trash2,
  CheckCircle2,
  Smartphone,
  CreditCard,
  Building,
  AlertCircle,
  Loader2,
  Tag,
  Sparkles,
  X,
  Percent,
  Gift,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { CartItem, LicenseType, OrderBumpItem } from '@/types';
import { ORDER_BUMP } from '@/data/bundles';
import {
  fetchGlobalBumpOffer,
  resolveEffectiveBumpOffer,
  GlobalBumpOfferConfig,
} from '@/lib/bumpOffer';
import { track } from '@/lib/analytics';
import { resolveBundleSlug } from '@/lib/bundleResolver';
import { fetchCustomProductBySlug } from '@/lib/customProducts';
import FreeBundleOfferBanner from '@/components/FreeBundleOfferBanner';


function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productParam = searchParams.get('product') || searchParams.get('slug') || searchParams.get('id');
  const isBuyNowMode = searchParams.get('mode') === 'buynow' || Boolean(productParam);
  const resellerSlug = searchParams.get('r') || (typeof window !== 'undefined' ? sessionStorage.getItem('vaultzet_reseller_slug') : null);

  const {
    items,
    buyNowItem,
    setBuyNowItem,
    removeFromCart,
    clearBuyNowItem,
    orderBumpAdded,
    setOrderBumpAdded,
    subtotal,
    total,
    freeBundleOffer,
    freeBundles,
    removeFreeBundle,
    setIsFreeBundleModalOpen,
  } = useCart();

  const [isLoadingBundle, setIsLoadingBundle] = useState<boolean>(() => {
    if ((isBuyNowMode || resellerSlug) && !buyNowItem) return true;
    return false;
  });

  // Dynamic client hydration to guarantee checkout is NEVER empty and always loads the correct product
  useEffect(() => {
    const matchesProductParam = productParam
      ? Boolean(buyNowItem?.product?.slug === productParam || buyNowItem?.product?.id === productParam)
      : true;

    if (buyNowItem && matchesProductParam) {
      setIsLoadingBundle(false);
      return;
    }

    if (!isBuyNowMode && !resellerSlug && !productParam && items.length > 0) {
      setIsLoadingBundle(false);
      return;
    }

    let isMounted = true;

    async function hydrateBundle() {
      // 1. If direct product slug/id in query params, resolve authoritatively
      if (productParam) {
        try {
          const live = await fetchCustomProductBySlug(productParam);
          const resolved = live || resolveBundleSlug(productParam);
          if (resolved) {
            const licenseParam = (searchParams.get('license') as 'personal' | 'reseller') || 'personal';
            const resolvedPrice = Number(licenseParam === 'reseller' ? resolved.resellerPrice : resolved.personalPrice);
            const directItem = {
              product: resolved,
              license: licenseParam,
              price: resolvedPrice,
            };
            setBuyNowItem(directItem);
            try {
              sessionStorage.setItem('vaultzet_buynow_item', JSON.stringify(directItem));
              localStorage.setItem('vaultzet_buynow_item', JSON.stringify(directItem));
            } catch {}
            if (isMounted) setIsLoadingBundle(false);
            return;
          } else {
            // URL explicitly specified a product, but it does not exist in the catalog
            setBuyNowItem(null);
            if (isMounted) setIsLoadingBundle(false);
            return;
          }
        } catch (err) {
          console.warn('Error resolving product from URL param:', err);
        }
      }

      // 2. Try reading from session / local storage
      if (typeof window !== 'undefined') {
        try {
          const stored =
            sessionStorage.getItem('vaultzet_buynow_item') ||
            localStorage.getItem('vaultzet_buynow_item');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.product) {
              const live = await fetchCustomProductBySlug(parsed.product.slug || parsed.product.id);
              if (live) {
                const licenseParam = parsed.license || 'personal';
                parsed.product = { ...parsed.product, ...live };
                parsed.price = Number(licenseParam === 'reseller' ? live.resellerPrice : live.personalPrice);
              }
              setBuyNowItem(parsed);
              if (isMounted) setIsLoadingBundle(false);
              return;
            }
          }
        } catch {}
      }

      // 3. If resellerSlug is present in URL or storage, fetch listing directly from API
      if (resellerSlug) {
        try {
          const res = await fetch(`/api/reseller/listings?slug=${encodeURIComponent(resellerSlug)}`);
          const data = await res.json();
          if (data?.success && data?.listing) {
            const l = data.listing;
            const constructedItem = {
              product: {
                id: l.originalProductId || l.id,
                slug: l.originalProductSlug || l.slug,
                title: l.customTitle,
                shortDescription: l.customShortDescription || '',
                category: 'Viral Reels Bundle',
                categorySlug: 'reels',
                reelCount: 1000,
                personalPrice: Number(l.resalePrice),
                personalOriginalPrice: Math.round(Number(l.resalePrice) * 1.6),
                resellerPrice: Number(l.resalePrice),
                resellerOriginalPrice: Math.round(Number(l.resalePrice) * 1.6),
                thumbnail: l.coverImage || '/logo.webp',
                galleryImages: l.galleryImages || [],
                resolution: '1080x1920 (9:16 Vertical)',
                aspectRatio: '9:16',
                format: 'MP4',
                audioIncluded: true,
                tags: ['reels', 'viral', 'instagram'],
                rating: 4.9,
                reviewCount: 340,
                features: l.features || [],
                faqs: [],
              },
              license: 'personal' as const,
              price: Number(l.resalePrice),
            };

            setBuyNowItem(constructedItem);
            try {
              sessionStorage.setItem('vaultzet_buynow_item', JSON.stringify(constructedItem));
              localStorage.setItem('vaultzet_buynow_item', JSON.stringify(constructedItem));
              sessionStorage.setItem('vaultzet_reseller_slug', l.slug);
              localStorage.setItem('vaultzet_reseller_slug', l.slug);
            } catch {}
            if (isMounted) setIsLoadingBundle(false);
            return;
          }
        } catch (e) {
          console.warn('Could not fetch reseller listing for checkout:', e);
        }
      }

      if (isMounted) setIsLoadingBundle(false);
    }

    hydrateBundle();

    return () => {
      isMounted = false;
    };
  }, [buyNowItem, isBuyNowMode, productParam, resellerSlug, items.length]);

  // Strictly separate Buy Now (single product only) vs Cart Checkout (all added cart items)
  const checkoutItems = isBuyNowMode ? (buyNowItem ? [buyNowItem] : []) : items;
  const checkoutSubtotal = isBuyNowMode ? (buyNowItem ? buyNowItem.price : 0) : subtotal;

  const isOfferActive = freeBundleOffer?.enabled !== false;
  const minCart = isOfferActive ? (freeBundleOffer?.minCartValue || 149) : 999999999;
  const freeQty = isOfferActive ? (freeBundleOffer?.freeBundleQuantity || 2) : 0;

  // Free bundles eligible if checkoutSubtotal >= minCart and offer is active
  const freeBonusItems: CartItem[] = (isOfferActive && checkoutSubtotal >= minCart && freeBundles.length > 0)
    ? freeBundles.slice(0, freeQty).map((b) => ({
        product: b,
        license: 'personal' as LicenseType,
        price: 0,
        isFreeBonus: true,
      }))
    : [];

  const allCheckoutItems: CartItem[] = [...checkoutItems, ...freeBonusItems];

  // Load Global Bump Offer settings from Firestore / API
  const [globalBumpOffer, setGlobalBumpOffer] = useState<GlobalBumpOfferConfig | null>(null);

  useEffect(() => {
    fetchGlobalBumpOffer().then((res) => {
      setGlobalBumpOffer(res);
    }).catch(() => {});
  }, []);

  // Determine active primary product for bump offer resolution
  const primaryProduct = isBuyNowMode ? buyNowItem?.product : (checkoutItems.length > 0 ? checkoutItems[0]?.product : null);

  const activeBumpOffer: OrderBumpItem | null = useMemo(() => {
    return resolveEffectiveBumpOffer(primaryProduct, globalBumpOffer);
  }, [primaryProduct, globalBumpOffer]);

  // If bump offer is disabled (activeBumpOffer === null), ensure orderBumpAdded is false
  useEffect(() => {
    if (!activeBumpOffer && orderBumpAdded) {
      setOrderBumpAdded(false);
    }
  }, [activeBumpOffer, orderBumpAdded, setOrderBumpAdded]);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    discountType?: string;
    discountPercent?: number;
    description?: string;
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  const applyCouponCode = async (codeToApply: string) => {
    const cleanCode = codeToApply.trim().toUpperCase();
    if (!cleanCode) return;

    setCouponLoading(true);
    setCouponError(null);
    setCouponSuccess(null);

    try {
      const res = await fetch('/api/coupon/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: cleanCode,
          subtotal: checkoutSubtotal,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setCouponError(data.error || 'Invalid or expired coupon code.');
        setAppliedCoupon(null);
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('vaultzet_applied_coupon');
        }
      } else {
        const couponData = {
          code: data.code,
          discountAmount: Number(data.discountAmount || 0),
          discountType: data.discountType,
          discountPercent: data.discountPercent,
          description: data.description || data.message,
        };
        setAppliedCoupon(couponData);
        setCouponSuccess(`Coupon ${data.code} applied! Saved ₹${data.discountAmount}`);
        setCouponInput('');
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('vaultzet_applied_coupon', data.code);
        }
        track('coupon_applied', {
          coupon_name: data.code,
          discount: data.discountAmount,
        });
      }
    } catch {
      setCouponError('Could not apply coupon. Please try again.');
    } finally {
      setCouponLoading(false);
    }
  };

  // Auto-apply coupon from URL (?coupon=OFF20) or sessionStorage
  useEffect(() => {
    const urlCoupon = searchParams.get('coupon') || searchParams.get('code');
    const storedCoupon = typeof window !== 'undefined' ? sessionStorage.getItem('vaultzet_applied_coupon') : null;
    const initialCode = urlCoupon || storedCoupon;

    if (initialCode && checkoutSubtotal > 0 && !appliedCoupon) {
      applyCouponCode(initialCode);
    }
  }, [searchParams, checkoutSubtotal]);

  const handleApplyCoupon = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!couponInput.trim()) {
      setCouponError('Please enter a coupon code.');
      return;
    }
    applyCouponCode(couponInput);
  };

  const handleQuickApply = (code: string) => {
    setCouponInput(code);
    applyCouponCode(code);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
    setCouponSuccess(null);
    setCouponInput('');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('vaultzet_applied_coupon');
    }
  };

  // Dynamically calculate gross total and discount
  const effectiveBumpPrice = (orderBumpAdded && activeBumpOffer) ? Number(activeBumpOffer.discountPrice) : 0;
  const grossSubtotal = checkoutSubtotal + effectiveBumpPrice;
  const couponDiscount = appliedCoupon
    ? appliedCoupon.discountType === 'percent' && appliedCoupon.discountPercent
      ? Math.round((grossSubtotal * appliedCoupon.discountPercent) / 100)
      : Math.min(grossSubtotal - 1, appliedCoupon.discountAmount)
    : 0;

  const checkoutTotal = Math.max(1, grossSubtotal - couponDiscount);

  // 3 minimal customer fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean; phone?: boolean }>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  // Track GA4 begin_checkout on checkout load
  useEffect(() => {
    if (checkoutItems.length > 0) {
      track('begin_checkout', {
        currency: 'INR',
        value: checkoutTotal,
        items: checkoutItems.map((i) => ({
          item_id: i?.product?.id || 'bundle',
          item_name: i?.product?.title || 'Viral Reels Bundle',
          item_category: i?.product?.category || 'Reels Bundle',
          price: Number(i?.price || 0),
          quantity: 1,
          item_variant: i?.license || 'personal',
        })),
      });
    }
  }, []);

  // Guarantee checkout always starts at the top (Delivery Information) when entering from Buy Now
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, []);

  useEffect(() => {
    if (!isLoadingBundle && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [isLoadingBundle]);

  // Normalize phone input: strip +91 / leading 0 on autofill, allow digits only, max 10 digits
  const normalizePhoneInput = (raw: string): string => {
    let digits = raw.replace(/\D/g, '');
    if (digits.length > 10 && digits.startsWith('91')) {
      digits = digits.slice(2);
    } else if (digits.length > 10 && digits.startsWith('0')) {
      digits = digits.slice(1);
    }
    return digits.slice(0, 10);
  };

  const validateFullName = (val: string): string | null => {
    const clean = val.trim().replace(/\s+/g, ' ');
    if (!clean) return 'Full Name is required.';
    if (clean.length < 3) return 'Please enter your real full name (at least 3 letters).';
    if (!/^[a-zA-Z\s.]+$/.test(clean)) return 'Name can only contain letters and spaces.';
    const lower = clean.toLowerCase();
    const fakeNames = new Set([
      'test', 'testing', 'abc', 'abcd', 'abcde', 'xyz', 'fake', 'demo',
      'user', 'admin', 'asdf', 'asdfg', 'qwerty', 'none', 'null', 'hello',
      'sample', 'example',
    ]);
    if (fakeNames.has(lower)) return 'Fake name detected! Please enter your real name.';
    if (/([a-zA-Z])\1{3,}/.test(clean)) return 'Invalid name! Please enter your real full name.';
    if (!/[aeiouyAEIOUY]/.test(clean)) return 'Please enter a valid real name.';
    return null;
  };

  const validateGmail = (val: string): string | null => {
    const clean = val.trim().toLowerCase();
    if (!clean) return 'Gmail address is required.';
    if (!clean.endsWith('@gmail.com')) {
      return 'Invalid Email! Only a valid @gmail.com address is accepted for Google Drive access.';
    }
    const localPart = clean.slice(0, -10);
    if (!localPart || localPart.includes('@')) {
      return 'Invalid @gmail.com address format.';
    }
    if (!/^[a-z0-9.+_-]{3,40}$/.test(localPart)) {
      return 'Gmail username must be at least 3 characters before @gmail.com.';
    }
    if (/^\d+$/.test(localPart)) {
      return 'Fake Gmail detected! Gmail username cannot be only numbers.';
    }
    if (/^(.)\1{2,}$/.test(localPart)) {
      return 'Fake Gmail detected! Please enter your real @gmail.com address.';
    }
    const fakeEmails = new Set([
      'test', 'testing', 'abc', 'abcd', 'abcde', 'xyz', 'fake', 'demo',
      'admin', 'user', 'guest', 'null', 'none', 'asdf', 'asdfg', 'qwerty',
      'hello', 'sample', 'example', '123', '1234', '12345', '123456',
    ]);
    if (fakeEmails.has(localPart)) {
      return 'Fake Gmail address not allowed! Please enter your real @gmail.com email.';
    }
    return null;
  };

  const validatePhone = (val: string): string | null => {
    const clean = val.trim();
    if (!clean) return '10-digit WhatsApp / Phone number is required.';
    if (!/^\d+$/.test(clean)) return 'Phone number can only contain digits.';
    if (clean.length < 10) {
      return `Phone number must be exactly 10 digits (${clean.length}/10 entered).`;
    }
    if (clean.length > 10) {
      return 'Phone number cannot be more than 10 digits.';
    }
    if (!/^[6-9]\d{9}$/.test(clean)) {
      return 'Invalid Indian mobile number! Must start with 6, 7, 8, or 9.';
    }
    const fakePhones = new Set([
      '9876543210', '9123456789', '8765432109', '7654321098', '6543210987',
      '9000000000', '8000000000', '7000000000', '6000000000',
    ]);
    if (
      fakePhones.has(clean) ||
      /^(\d)\1{9}$/.test(clean) ||
      /(\d)\1{5,}/.test(clean) ||
      /^(..)\1{4}$/.test(clean)
    ) {
      return 'Fake phone number detected! Please enter your real 10-digit WhatsApp number.';
    }
    return null;
  };

  const nameError = validateFullName(fullName);
  const emailError = validateGmail(email);
  const phoneError = validatePhone(phone);

  // 10-Minute Countdown Timer for Order Bump matching reelsbundles.in
  const [secondsRemaining, setSecondsRemaining] = useState(585); // 9 mins 45 secs
  const [isBumpExpired, setIsBumpExpired] = useState(false);

  useEffect(() => {
    if (secondsRemaining <= 0) {
      setIsBumpExpired(true);
      setOrderBumpAdded(false);
      return;
    }
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsRemaining, setOrderBumpAdded]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // High-Intent Lead Capture Alert: notify Telegram ONLY when phone (and email if typed) pass strict anti-fake validation
  useEffect(() => {
    if (phoneError !== null) return;
    if (email.trim() && emailError !== null) return;

    const sessionKey = `vaultzet_lead_notified_${phone}`;
    if (typeof window !== 'undefined' && sessionStorage.getItem(sessionKey)) {
      return;
    }

    const leadTimer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(sessionKey, '1');
        }
        fetch('/api/telegram/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'lead_captured',
            data: {
              orderNumber: 'LIVE-LEAD',
              customer: {
                fullName: fullName.trim() || 'Checkout Visitor',
                email: email.trim().toLowerCase() || 'Entering email...',
                phone,
              },
              items: allCheckoutItems.map((i) => {
                const prod = i?.product as any;
                const thumb = prod?.thumbnail || prod?.featured_image || prod?.image || prod?.coverImage || '';
                return {
                  id: prod?.id || 'bundle',
                  title: prod?.title || prod?.name || 'Viral Reels Bundle',
                  slug: prod?.slug || '',
                  thumbnail: thumb,
                  image: thumb,
                  featured_image: thumb,
                  license: i?.license || 'personal',
                  price: Number(i?.price || 0),
                  isFreeBonus: Boolean(i?.isFreeBonus),
                };
              }),
              orderBump: (orderBumpAdded && activeBumpOffer)
                ? {
                    id: activeBumpOffer.id || activeBumpOffer.productId || 'order-bump',
                    title: activeBumpOffer.title,
                    price: activeBumpOffer.discountPrice,
                  }
                : null,
              totalAmount: checkoutTotal,
            },
          }),
        }).catch(() => {});
      } catch {}
    }, 1500);

    return () => clearTimeout(leadTimer);
  }, [phone, phoneError, fullName, email, emailError, checkoutItems, orderBumpAdded, checkoutTotal]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setTouched({ name: true, email: true, phone: true });

    if (checkoutItems.length === 0 && !orderBumpAdded) {
      alert('Your checkout is empty. Please select a bundle first.');
      return;
    }

    if (nameError) {
      setErrorMessage(nameError);
      document.getElementById('delivery-info')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (emailError) {
      setErrorMessage(emailError);
      document.getElementById('delivery-info')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (phoneError) {
      setErrorMessage(phoneError);
      document.getElementById('delivery-info')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsProcessing(true);

    // Track GA4 add_payment_info
    track('add_payment_info', {
      payment_type: 'PayU India UPI / Netbanking / Cards',
      currency: 'INR',
      value: checkoutTotal,
      items: allCheckoutItems.map((i, idx) => ({
        item_id: i?.product?.id || 'bundle',
        item_name: i?.product?.title || 'Viral Reels Bundle',
        item_category: i?.product?.category || 'Reels Bundle',
        price: Number(i?.price || 0),
        quantity: 1,
        index: idx,
      })),
    });

    const orderNumber = `VZ-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderPayload = {
      orderNumber,
      customer: {
        fullName: fullName.trim().replace(/\s+/g, ' '),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
      },
      items: allCheckoutItems.map((i) => {
        const prod = i?.product as any;
        const thumb = prod?.thumbnail || prod?.featured_image || prod?.image || prod?.coverImage || '';
        return {
          id: prod?.id || 'bundle',
          title: prod?.title || prod?.name || 'Viral Reels Bundle',
          slug: prod?.slug || '',
          thumbnail: thumb,
          image: thumb,
          featured_image: thumb,
          license: i?.license || 'personal',
          price: Number(i?.price || 0),
          format: prod?.format || 'MP4 Video',
          resolution: prod?.resolution || '1080P FULL HD',
          isFreeBonus: Boolean(i?.isFreeBonus),
        };
      }),
      orderBump: (orderBumpAdded && activeBumpOffer)
        ? {
            id: activeBumpOffer.id || activeBumpOffer.productId || 'order-bump',
            title: activeBumpOffer.title,
            price: activeBumpOffer.discountPrice,
            thumbnail: activeBumpOffer.thumbnail,
            googleDriveLink: activeBumpOffer.googleDriveLink || '',
            slug: activeBumpOffer.productSlug || '',
          }
        : null,
      totalAmount: checkoutTotal,
      resellerSlug: resellerSlug || undefined,
      couponCode: appliedCoupon ? appliedCoupon.code : undefined,
    };

    try {
      // 1. Create PayU Order on server
      const res = await fetch('/api/payment/payu/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.action || !data.params) {
        throw new Error(
          data.error ||
            'Could not initialize PayU payment. Please verify PayU API credentials in the Admin Portal.'
        );
      }

      // Store temporary pending order details for confirmation
      localStorage.setItem('vaultzet_latest_order', JSON.stringify({
        ...orderPayload,
        orderId: orderNumber,
        orderToken: data.order_token,
        status: 'pending',
      }));

      // 2. Auto-submit form to PayU India Hosted Checkout (UPI, GPay, PhonePe, Paytm, Cards, NetBanking)
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.action;
      form.style.display = 'none';

      Object.entries(data.params).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err: any) {
      console.error('PayU order error:', err);
      setIsProcessing(false);
      setErrorMessage(
        err.message || 'Payment initiation failed. Please check your connection and try again.'
      );
    }
  };

  // 1. Sleek loading state while bundle hydrates
  if (isLoadingBundle) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4 bg-[#faf9f6]">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 animate-pulse">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
        <h2 className="text-xl font-black text-slate-950">Loading Your Checkout...</h2>
        <p className="text-xs text-slate-500 max-w-sm">
          Preparing bundle details and secure PayU payment gateway.
        </p>
      </div>
    );
  }

  // 2. Empty checkout fallback
  if (checkoutItems.length === 0 && !orderBumpAdded) {
    if (resellerSlug) {
      return (
        <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4 bg-[#faf9f6]">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mx-auto text-2xl">
            📦
          </div>
          <h1 className="text-2xl font-black text-slate-950">Bundle Not Found</h1>
          <p className="text-sm text-slate-500">
            We couldn't retrieve the requested bundle details. Please visit the link again.
          </p>
          <Link
            href={`/r/${resellerSlug}`}
            className="inline-block px-6 py-3 rounded-full btn-gradient-primary text-slate-950 text-xs font-black shadow-md hover:scale-105 transition-transform"
          >
            ← Return to Product Page
          </Link>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4 bg-[#faf9f6]">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mx-auto text-2xl">
          🛍️
        </div>
        <h1 className="text-2xl font-black text-slate-950">Your Checkout is Empty</h1>
        <p className="text-sm text-slate-500">Pick a viral reels bundle before proceeding to checkout.</p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 rounded-full btn-gradient-primary text-slate-950 text-xs font-black shadow-md hover:scale-105 transition-transform"
        >
          Explore All Bundles →
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 pb-56 lg:pb-12 bg-[#faf9f6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Checkout Header (Clean & Minimal for Resellers, Standard for Store) */}
          {resellerSlug ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-200/90 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Link
                    href={`/r/${resellerSlug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline"
                  >
                    ← Back to Product
                  </Link>
                  <span className="text-slate-300">•</span>
                  <span className="text-[11px] font-bold text-slate-500">Authorized Partner Checkout</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                  Secure PayU Checkout
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Fill your details below, pay securely via PayU, and get instant Google Drive access.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/80 self-start sm:self-center shrink-0">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-bit Secure Encryption</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-200/90">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                  {isBuyNowMode ? 'Instant Buy Now Checkout' : 'Express Checkout'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Zero hassle: Fill your details, pay securely via PayU, and get instant Google Drive access.
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/80">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-bit Secure Encryption</span>
              </div>
            </div>
          )}

          {/* Special Free Bundles Offer Banner */}
          <FreeBundleOfferBanner variant="checkout" currentTotal={checkoutTotal} />

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1">
                <div>
                  <span className="font-bold">Checkout Issue: </span>
                  {errorMessage}
                </div>
                {(errorMessage.includes('PayU') || errorMessage.includes('Merchant')) && (
                  <p className="text-[11px] text-rose-700 font-normal mt-1 leading-relaxed">
                    Note: Agar aapne Admin Portal ya Vercel me PayU keys update ki hain, toh Vercel dashboard me <strong>Deployments &gt; Redeploy</strong> karein ya Admin Portal (Settings &gt; Integrations &gt; PayU Gateway) me Merchant Key &amp; Salt save karein.
                  </p>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Customer Info, Order Bump & Payment */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* 1. Customer Details (Minimal 3 Fields with Strict Anti-Fake Validation) */}
              <div id="delivery-info" className="rounded-3xl p-5 sm:p-6 bg-white border border-slate-200/90 shadow-sm hover:border-amber-400/40 transition-colors space-y-4 scroll-mt-24">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-950 text-amber-400 border border-amber-500/40 text-xs font-black flex items-center justify-center shadow-xs">
                      1
                    </span>
                    <h2 className="text-base font-extrabold text-slate-900">
                      Delivery Information
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">
                    Strict Verification Active
                  </span>
                </div>

                <div className="space-y-3.5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={50}
                      autoComplete="name"
                      placeholder="Enter your real full name"
                      value={fullName}
                      onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/[^a-zA-Z\s.]/g, '').slice(0, 50);
                        setFullName(cleaned);
                      }}
                      className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm focus:outline-none focus:ring-2 transition-colors ${
                        (touched.name || fullName.length > 0) && nameError
                          ? 'border-red-400 bg-red-50/30 focus:ring-red-400'
                          : fullName.length > 0 && !nameError
                          ? 'border-emerald-400 bg-emerald-50/20 focus:ring-emerald-400'
                          : 'border-slate-200 focus:ring-amber-500/30 focus:border-amber-500'
                      }`}
                    />
                    {(touched.name || fullName.length > 0) && nameError && (
                      <p className="text-[11px] font-bold text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{nameError}</span>
                      </p>
                    )}
                  </div>

                  {/* Strict @gmail.com Email */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Gmail Address (For Google Drive Access) <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] font-extrabold text-amber-900 bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded">
                        Only @gmail.com
                      </span>
                    </div>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="yourname@gmail.com"
                      value={email}
                      onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                      onChange={(e) => setEmail(e.target.value.replace(/\s/g, ''))}
                      className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm focus:outline-none focus:ring-2 transition-colors ${
                        (touched.email || email.length > 0) && emailError
                          ? 'border-red-400 bg-red-50/30 focus:ring-red-400'
                          : email.length > 0 && !emailError
                          ? 'border-emerald-400 bg-emerald-50/20 focus:ring-emerald-400'
                          : 'border-slate-200 focus:ring-amber-500/30 focus:border-amber-500'
                      }`}
                    />
                    {(touched.email || email.length > 0) && emailError ? (
                      <p className="text-[11px] font-bold text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{emailError}</span>
                      </p>
                    ) : email.length > 0 && !emailError ? (
                      <p className="text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Valid @gmail.com address verified for Google Drive delivery.</span>
                      </p>
                    ) : (
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        Must be a valid <strong>@gmail.com</strong> email to receive Google Drive bundle access.
                      </span>
                    )}
                  </div>

                  {/* Strict 10-Digit Phone Number */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        WhatsApp / Phone Number (10 Digits) <span className="text-red-500">*</span>
                      </label>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                          phone.length === 10 && !phoneError
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {phone.length}/10 Digits
                      </span>
                    </div>
                    <div
                      className={`flex items-center rounded-xl border overflow-hidden transition-colors focus-within:ring-2 ${
                        (touched.phone || phone.length > 0) && phoneError
                          ? 'border-red-400 bg-red-50/30 focus-within:ring-red-400'
                          : phone.length === 10 && !phoneError
                          ? 'border-emerald-400 bg-emerald-50/20 focus-within:ring-emerald-400'
                          : 'border-slate-200 bg-white focus-within:ring-amber-500/30 focus-within:border-amber-500'
                      }`}
                    >
                      <span className="px-3.5 py-3 bg-slate-100 border-r border-slate-200 text-xs sm:text-sm font-extrabold text-slate-700 select-none shrink-0">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        inputMode="numeric"
                        maxLength={10}
                        pattern="[6-9][0-9]{9}"
                        autoComplete="tel-national"
                        placeholder="9876543210 (10 digits only)"
                        value={phone}
                        onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
                        onChange={(e) => setPhone(normalizePhoneInput(e.target.value))}
                        className="w-full px-3.5 py-3 bg-transparent text-base sm:text-sm font-bold text-slate-900 tracking-wide focus:outline-none"
                      />
                    </div>
                    {(touched.phone || phone.length > 0) && phoneError ? (
                      <p className="text-[11px] font-bold text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{phoneError}</span>
                      </p>
                    ) : phone.length === 10 && !phoneError ? (
                      <p className="text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Valid 10-digit WhatsApp number verified (+91 {phone}).</span>
                      </p>
                    ) : null}
                  </div>

                  {/* Immediate Pay Now Button directly below WhatsApp / Mobile Number */}
                  <div className="pt-3 border-t border-slate-100">
                    {errorMessage && (
                      <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-base flex items-center justify-center gap-2 shadow-[0_10px_28px_rgba(245,158,11,0.35)] hover:shadow-[0_14px_34px_rgba(245,158,11,0.5)] border border-amber-400/50 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-70 cursor-pointer"
                    >
                      {isProcessing ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Connecting PayU Gateway...</span>
                        </span>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-slate-950" />
                          <span>Pay ₹{checkoutTotal}.00 via PayU (Instant Access)</span>
                        </>
                      )}
                    </button>
                    <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-semibold text-center mt-2.5">
                      <span className="flex items-center gap-1 text-emerald-700 font-bold">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Instant Google Drive Delivery</span>
                      </span>
                      <span>•</span>
                      <span>256-bit SSL Security</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Exclusive Order Bump with Live 10-Min Timer matching reelsbundles.in */}
              {!isBumpExpired && activeBumpOffer && (
                <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-amber-50/50 via-white to-amber-100/30 border-2 border-amber-400/60 shadow-sm relative overflow-hidden">
                  {/* Header ribbon */}
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-slate-950 text-amber-400 border border-amber-500/30 shadow-xs">
                      ★ SPECIAL 1-TIME OFFER
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-black text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200 animate-pulse">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Offer ends in {timeFormatted}</span>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <img
                      src={activeBumpOffer.thumbnail}
                      alt={activeBumpOffer.title}
                      className="w-20 sm:w-24 aspect-[4/3] rounded-xl object-cover shrink-0 border border-amber-200 shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-extrabold text-sm text-slate-950 leading-snug">
                        {activeBumpOffer.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {activeBumpOffer.subtitle}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-black text-sm text-emerald-700">
                          ₹{activeBumpOffer.discountPrice}.00
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          ₹{activeBumpOffer.originalPrice}.00
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {activeBumpOffer.discountPercentage}% OFF
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Switcher Toggle */}
                  <label className="mt-4 pt-3 border-t border-amber-200/80 flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={orderBumpAdded}
                      onChange={() => setOrderBumpAdded(!orderBumpAdded)}
                      className="w-5 h-5 rounded text-amber-500 focus:ring-amber-500 border-slate-300 cursor-pointer"
                    />
                    <span className="text-xs font-extrabold text-slate-900">
                      Yes! Add this {activeBumpOffer.reelCount || 1000}+ reels mega pack to my order for just ₹{activeBumpOffer.discountPrice}
                    </span>
                  </label>
                </div>
              )}

              {/* 3. PayU Payment Gateway Card */}
              <div className="rounded-3xl p-6 bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-950 text-amber-400 border border-amber-500/40 text-xs font-black flex items-center justify-center shadow-xs">
                      2
                    </span>
                    <h2 className="text-base font-extrabold text-slate-900">
                      Payment Method
                    </h2>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> PayU Verified
                  </span>
                </div>

                {/* Branded PayU Details Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-amber-500/20 text-white space-y-3.5 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-xs text-amber-400 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-amber-400" />
                      <span>PayU Payment Gateway (India)</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">
                      RBI Regulated • Zero Extra Fee
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Pay securely with any payment option of your choice. A fast, encrypted PayU checkout will open to complete payment via UPI, Cards, or NetBanking.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 shadow-xs">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                        <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                        <span>All UPI Apps</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        PhonePe, Google Pay, Paytm, CRED & QR
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 shadow-xs">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                        <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                        <span>Cards</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        RuPay, Visa, MasterCard & Maestro
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 shadow-xs">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                        <Building className="w-3.5 h-3.5 text-amber-400" />
                        <span>NetBanking</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        50+ Indian Banks (SBI, HDFC, ICICI, etc.)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instant Google Drive Bundle delivery upon payment confirmation.</span>
                </div>
              </div>

            </div>

            {/* Right Column: Sticky Order Summary */}
            <div className="lg:col-span-5 sticky top-28 space-y-4">
              <div className="rounded-3xl p-6 bg-white border border-slate-200/90 shadow-md space-y-5">
                <h2 className="text-base font-extrabold text-slate-950 pb-3 border-b border-slate-100">
                  Order Summary ({checkoutItems.length + (orderBumpAdded ? 1 : 0)} {checkoutItems.length + (orderBumpAdded ? 1 : 0) === 1 ? 'item' : 'items'})
                </h2>

                {/* Items List */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {checkoutItems.map((item, idx) => (
                    <div
                      key={`${item?.product?.id || idx}-${item?.license || 'p'}`}
                      className="flex gap-3 items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <img
                        src={item?.product?.thumbnail || '/logo.webp'}
                        alt={item?.product?.title || 'Bundle'}
                        className="w-12 h-14 object-cover rounded-lg shrink-0"
                      />
                      <div className="flex-1 min-w-0 px-1">
                        <h4 className="font-bold text-xs text-slate-950 line-clamp-1">
                          {item?.product?.title || 'Viral Reels Bundle'}
                        </h4>
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-200/70 px-1.5 py-0.5 rounded">
                          {item?.license === 'reseller' ? 'Reseller Rights' : 'Personal Use'}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-extrabold text-xs text-slate-950">
                          ₹{item?.price || 0}.00
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            isBuyNowMode
                              ? clearBuyNowItem()
                              : removeFromCart(item?.product?.id || '', item?.license || 'personal')
                          }
                          className="text-slate-400 hover:text-red-500 text-xs p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {orderBumpAdded && activeBumpOffer && (
                    <div className="flex gap-3 items-center justify-between p-2.5 rounded-xl bg-amber-50/70 border border-amber-200">
                      <img
                        src={activeBumpOffer.thumbnail}
                        alt={activeBumpOffer.title}
                        className="w-12 h-14 object-cover rounded-lg shrink-0"
                      />
                      <div className="flex-1 min-w-0 px-1">
                        <h4 className="font-bold text-xs text-amber-950 line-clamp-1">
                          {activeBumpOffer.title}
                        </h4>
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-200 px-1.5 py-0.5 rounded">
                          Bonus Offer
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-extrabold text-xs text-amber-950">
                          ₹{activeBumpOffer.discountPrice}.00
                        </div>
                        <button
                          type="button"
                          onClick={() => setOrderBumpAdded(false)}
                          className="text-slate-400 hover:text-red-500 text-xs p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Free Bonus Bundles (Promotional Offer) */}
                  {isOfferActive && checkoutSubtotal >= minCart && freeBundles.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-dashed border-[#bce8d5]">
                      <div className="flex items-center justify-between text-[11px] font-black text-[#076647] uppercase tracking-wider">
                        <span>🎁 Claimed Free Gifts ({freeBundles.length}/{freeQty})</span>
                        <button
                          type="button"
                          onClick={() => setIsFreeBundleModalOpen(true)}
                          className="text-[#076647] underline hover:text-[#055038]"
                        >
                          Change
                        </button>
                      </div>
                      {freeBundles.slice(0, freeQty).map((fb) => (
                        <div
                          key={`free-${fb.id}`}
                          className="flex gap-3 items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-[#eefbf4] to-[#f4fcf7] border border-[#bce8d5]"
                        >
                          <img
                            src={fb.thumbnail || '/logo.webp'}
                            alt={fb.title}
                            className="w-12 h-14 object-cover rounded-lg shrink-0"
                          />
                          <div className="flex-1 min-w-0 px-1">
                            <h4 className="font-bold text-xs text-slate-950 line-clamp-1">
                              {fb.title}
                            </h4>
                            <span className="text-[10px] font-black text-[#076647] bg-[#e6f7f0] px-1.5 py-0.5 rounded">
                              FREE BONUS GIFT
                            </span>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-[10px] text-slate-400 line-through">
                              ₹{fb.personalPrice}.00
                            </div>
                            <div className="font-black text-xs text-[#076647]">
                              ₹0.00
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFreeBundle(fb.id)}
                              className="text-slate-400 hover:text-red-500 text-xs p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* If qualified but hasn't claimed all free bundles */}
                  {isOfferActive && checkoutSubtotal >= minCart && freeBundles.length < freeQty && (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-amber-500/15 border border-amber-400/40 flex items-center justify-between gap-2 shadow-xs">
                      <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                        <Gift className="w-4 h-4 shrink-0 text-amber-600" />
                        <span>You unlocked {freeQty} Free Bundles!</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsFreeBundleModalOpen(true)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 text-xs font-black hover:opacity-95 shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                      >
                        Claim Now (₹0)
                      </button>
                    </div>
                  )}
                </div>

                {/* Promo Code / Coupon Input Box (Visible on both desktop and mobile) */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-amber-500" />
                      Promo / Discount Code
                    </span>
                    {appliedCoupon && (
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Applied
                      </span>
                    )}
                  </div>

                  {!appliedCoupon ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={couponInput}
                            onChange={(e) => {
                              setCouponInput(e.target.value.toUpperCase());
                              setCouponError(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleApplyCoupon();
                              }
                            }}
                            placeholder="Enter coupon code"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 uppercase tracking-wider"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleApplyCoupon()}
                          disabled={couponLoading || !couponInput.trim()}
                          className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 active:scale-95 disabled:opacity-50 text-amber-400 text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs border border-slate-800"
                        >
                          {couponLoading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            'Apply'
                          )}
                        </button>
                      </div>

                      {couponError && (
                        <p className="text-[11px] font-bold text-red-600 flex items-center gap-1 animate-in fade-in">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{couponError}</span>
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50/60 border border-emerald-200 flex items-center justify-between gap-2 shadow-2xs animate-in fade-in duration-200">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                              {appliedCoupon.code}
                            </span>
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900">
                              -₹{couponDiscount} OFF
                            </span>
                          </div>
                          <p className="text-[10px] text-emerald-700 font-medium truncate mt-0.5">
                            {appliedCoupon.description || 'Special promo discount applied!'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="w-7 h-7 rounded-lg text-emerald-700 hover:bg-emerald-200/60 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                        title="Remove promo code"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Calculations */}
                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs font-semibold">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="text-slate-800">₹{checkoutSubtotal}.00</span>
                  </div>
                  {orderBumpAdded && activeBumpOffer && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Order Bump ({activeBumpOffer.discountPercentage}% Off)</span>
                      <span>+₹{activeBumpOffer.discountPrice}.00</span>
                    </div>
                  )}
                  {appliedCoupon && couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold animate-in fade-in">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-emerald-500" />
                        Coupon Discount ({appliedCoupon.code})
                      </span>
                      <span>-₹{couponDiscount}.00</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline text-base font-black text-slate-950 pt-2 border-t border-slate-200">
                    <span>Final Total</span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-950">₹{checkoutTotal}.00</span>
                  </div>
                </div>

                {/* Submit CTA (Desktop only inside right column) */}
                <div className="hidden lg:block space-y-3">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_10px_28px_rgba(245,158,11,0.35)] hover:shadow-[0_14px_34px_rgba(245,158,11,0.5)] border border-amber-400/50 hover:scale-[1.01] transition-all disabled:opacity-70 cursor-pointer"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Connecting PayU Gateway...
                      </span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-slate-950" />
                        <span>Pay ₹{checkoutTotal}.00 via PayU (Instant Access)</span>
                      </>
                    )}
                  </button>

                  <div className="space-y-1.5 text-center text-[11px] text-slate-400 pt-2 font-medium">
                    <p className="flex items-center justify-center gap-1 text-slate-600 font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Instant Google Drive Link Delivery
                    </p>
                    <p>Protected by 256-bit SSL encryption & PayU India Security</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Mobile Checkout Footer Bar (Visible on mobile screens < lg) */}
            <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-8px_30px_rgba(2,6,23,0.12)] px-4 py-2.5 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
              <div className="max-w-md mx-auto space-y-2">
                <div className="flex items-center justify-between px-1">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Final Total
                    </span>
                    <span className="text-xl font-black text-slate-950">
                      ₹{checkoutTotal}.00
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>256-bit SSL</span>
                    </span>
                  </div>
                </div>

                {/* Applied Coupon Pill (If any) */}
                {appliedCoupon && (
                  <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center justify-between gap-2 shadow-2xs animate-in fade-in duration-200">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-5 h-5 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                            {appliedCoupon.code}
                          </span>
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900">
                            -₹{couponDiscount} OFF
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[11px] font-bold text-emerald-800 hover:text-red-600 px-2 py-0.5 rounded hover:bg-emerald-100/80 transition-colors shrink-0 cursor-pointer"
                      title="Remove promo code"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_10px_28px_rgba(245,158,11,0.35)] hover:shadow-[0_14px_34px_rgba(245,158,11,0.5)] border border-amber-400/50 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-70 cursor-pointer"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Connecting PayU Gateway...
                    </span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-slate-950" />
                      <span>Pay ₹{checkoutTotal}.00 via PayU (Instant Access)</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 font-medium text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Instant Google Drive Delivery · 256-bit SSL Security</span>
                </div>
              </div>
            </div>

          </form>

        </div>
      </div>
  );
}

export default function CheckoutPage() {
  return (
    <>
      {/* PayU India Secure Hosted Checkout - high priority preconnect */}
      <link rel="preconnect" href="https://secure.payu.in" />
      <link rel="dns-prefetch" href="https://secure.payu.in" />
      <Suspense
        fallback={
          <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4 bg-[#faf9f6]">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 animate-pulse">
              <div className="w-8 h-8 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
            </div>
            <h2 className="text-xl font-black text-slate-950">Loading Checkout...</h2>
            <p className="text-xs text-slate-500 max-w-sm">
              Preparing bundle details and secure PayU payment gateway.
            </p>
          </div>
        }
      >
        <CheckoutContent />
      </Suspense>
    </>
  );
}
