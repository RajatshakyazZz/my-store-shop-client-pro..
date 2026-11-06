'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Zap,
  Lock,
  Cloud,
  ArrowRight,
  ShoppingBag,
  Check,
  X,
  Gift,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { optimizeImageUrl } from '@/lib/imageOptimized';
import FreeBundleOfferBanner from '@/components/FreeBundleOfferBanner';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    removeFromCart,
    subtotal,
    total,
    freeBundles,
    removeFreeBundle,
    isQualifiedForFreeOffer,
    setIsFreeBundleModalOpen,
  } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (!clean) return;
    setIsApplying(true);
    setCouponStatus(null);

    try {
      const res = await fetch('/api/coupon/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: clean, subtotal }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setCouponStatus({ type: 'error', message: data.error || 'Coupon code is invalid or expired.' });
      } else {
        sessionStorage.setItem('vaultzet_applied_coupon', data.code);
        setCouponStatus({
          type: 'success',
          message: `Coupon "${data.code}" applied! You save ₹${data.discountAmount}. Proceeding to checkout...`,
        });
        setTimeout(() => {
          router.push('/checkout');
        }, 1200);
      }
    } catch {
      setCouponStatus({ type: 'error', message: 'Could not apply coupon. Please try again.' });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7fc] text-[#182044] py-6 sm:py-8 md:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* =========================================================================
            1. HERO REVIEW BANNER & STEPPER (Matching Competitor Screenshot)
            ========================================================================= */}
        <div className="rounded-[24px] bg-gradient-to-r from-[#FAFBF7] via-[#F5F8EF] to-[#ffffff] border border-[#E6EBDD] p-6 sm:p-7 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1.5">
            <span className="inline-block px-3 py-1 rounded-full text-[10.5px] font-black uppercase tracking-wider text-leaf-700 bg-leaf-50 border border-leaf-200">
              YOUR CART
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1019] tracking-tight">
              Review your bundles
            </h1>
            <p className="text-xs sm:text-sm text-[#5B6472] font-medium max-w-xl">
              Check your selected reels bundles and license before continuing to secure checkout.
            </p>
          </div>

          {/* Stepper Progress (1 Cart -> 2 Checkout -> 3 Access) */}
          <div className="flex items-center gap-2 sm:gap-3 self-start md:self-center shrink-0">
            {/* Step 1: Active Cart */}
            <div className="flex flex-col items-center">
              <span className="w-7 h-7 rounded-full bg-mint-500 text-ink font-black text-xs flex items-center justify-center shadow-sm">
                1
              </span>
              <span className="text-[11px] font-bold text-leaf-600 mt-1">Cart</span>
            </div>

            {/* Line */}
            <div className="w-8 sm:w-12 h-[2px] bg-canvas-200 -mt-4" />

            {/* Step 2: Checkout */}
            <div className="flex flex-col items-center">
              <span className="w-7 h-7 rounded-full border border-canvas-300 text-ink-300 font-semibold text-xs flex items-center justify-center">
                2
              </span>
              <span className="text-[11px] font-medium text-ink-300 mt-1">Checkout</span>
            </div>

            {/* Line */}
            <div className="w-8 sm:w-12 h-[2px] bg-canvas-200 -mt-4" />

            {/* Step 3: Access */}
            <div className="flex flex-col items-center">
              <span className="w-7 h-7 rounded-full border border-canvas-300 text-ink-300 font-semibold text-xs flex items-center justify-center">
                3
              </span>
              <span className="text-[11px] font-medium text-ink-300 mt-1">Access</span>
            </div>
          </div>
        </div>

        {/* Special Offer Banner on Cart */}
        <FreeBundleOfferBanner variant="checkout" currentTotal={subtotal} />

        {/* =========================================================================
            2. EMPTY CART STATE
            ========================================================================= */}
        {items.length === 0 ? (
          <div className="rounded-[24px] bg-white border border-[#E6EBDD] p-10 sm:p-14 text-center shadow-sm space-y-4 max-w-lg mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-leaf-50 text-leaf-600 flex items-center justify-center mx-auto text-2xl font-bold shadow-sm">
              ▶
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-leaf-700 bg-leaf-50 border border-leaf-200">
              Nothing here yet
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#0B1019]">
              Your cart is waiting for some reels
            </h2>
            <p className="text-sm text-[#5B6472] max-w-xs mx-auto">
              Explore ready-to-post bundles and add the content you want to use next.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-mint-500 hover:bg-mint-300 text-ink font-bold text-sm shadow-md transition-colors"
              >
                <span>Explore Bundles</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* =========================================================================
                3. CART ITEMS HEADER
                ========================================================================= */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0B1019]">Cart Items</h2>
                <p className="text-xs text-[#5B6472] font-medium mt-0.5">
                  {items.length} {items.length === 1 ? 'item' : 'items'} selected
                </p>
              </div>

              <Link
                href="/shop"
                className="text-xs sm:text-sm font-bold text-leaf-600 hover:text-leaf-700 transition-colors inline-flex items-center gap-1"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* =========================================================================
                4. MAIN CART CONTENT (Left: Items list / Right: Totals)
                ========================================================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

              {/* LEFT: CART ITEMS TABLE CARD */}
              <div className="lg:col-span-2 rounded-[20px] bg-white border border-[#E6EBDD] shadow-sm overflow-hidden">
                
                {/* Desktop Table Header */}
                <div className="hidden md:grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-6 py-3.5 bg-[#FAFBF7] border-b border-[#EEF2E6] text-[11px] font-bold text-[#7A8391] uppercase tracking-wider items-center">
                  <div className="w-6" /> {/* remove button spacing */}
                  <div className="pl-16">PRODUCT</div>
                  <div className="text-right w-20">PRICE</div>
                  <div className="text-center w-20">QUANTITY</div>
                  <div className="text-right w-24">SUBTOTAL</div>
                </div>

                {/* Items Rows */}
                <div className="divide-y divide-[#f4f0fa]">
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.license}`}
                      className="p-4 sm:p-5 hover:bg-[#FAFBF7]/50 transition-colors"
                    >
                      {/* DESKTOP ROW */}
                      <div className="hidden md:grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center">
                        {/* Remove X Button */}
                        <button
                          onClick={() => removeFromCart(item.product.id, item.license)}
                          className="w-7 h-7 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 font-bold flex items-center justify-center text-xs transition-colors shrink-0"
                          title="Remove item"
                        >
                          ✕
                        </button>

                        {/* Product Thumbnail & Details */}
                        <div className="flex items-center gap-3.5 min-w-0">
                          <img
                            src={optimizeImageUrl(item.product.thumbnail, 128, 70)}
                            alt={item.product.title}
                            className="w-16 h-16 rounded-xl object-cover border border-canvas-200 shadow-sm shrink-0"
                          />
                          <div className="min-w-0 pr-2">
                            <Link
                              href={`/product/${item.product.slug}`}
                              className="font-bold text-sm text-[#0B1019] hover:text-leaf-600 transition-colors line-clamp-2 leading-snug"
                            >
                              {item.product.title}
                            </Link>
                            <span className="block text-xs text-[#5B6472] font-medium mt-1">
                              License:{' '}
                              <span className="capitalize">
                                {item.license === 'reseller'
                                  ? 'Reseller Rights'
                                  : 'Personal Use'}
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right w-20 font-bold text-sm text-[#0B1019]">
                          ₹{item.price}.00
                        </div>

                        {/* Quantity */}
                        <div className="text-center w-20 text-xs font-semibold text-ink-400">
                          1
                        </div>

                        {/* Subtotal */}
                        <div className="text-right w-24 font-bold text-sm text-[#0B1019]">
                          ₹{item.price}.00
                        </div>
                      </div>

                      {/* MOBILE CARD (Matches competitor mobile screenshot exactly) */}
                      <div className="md:hidden space-y-2.5">
                        <div className="flex items-start gap-3">
                          <img
                            src={optimizeImageUrl(item.product.thumbnail, 128, 70)}
                            alt={item.product.title}
                            className="w-16 h-16 rounded-xl object-cover border border-canvas-200 shadow-sm shrink-0"
                          />
                          <div className="flex-1 min-w-0 pr-2">
                            <Link
                              href={`/product/${item.product.slug}`}
                              className="font-bold text-xs sm:text-sm text-[#0B1019] line-clamp-2 leading-snug"
                            >
                              {item.product.title}
                            </Link>
                            <div className="text-[11px] text-[#5B6472] font-medium mt-0.5">
                              License:{' '}
                              <span className="capitalize">
                                {item.license === 'reseller'
                                  ? 'Reseller Rights'
                                  : 'Personal Use'}
                              </span>
                            </div>
                            <div className="text-xs font-bold text-[#0B1019] mt-1">
                              Price: ₹{item.price}.00
                            </div>
                          </div>

                          {/* Mobile Remove Button */}
                          <button
                            onClick={() => removeFromCart(item.product.id, item.license)}
                            className="w-6 h-6 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 font-bold flex items-center justify-center text-xs shrink-0"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Mobile Subtotal right aligned */}
                        <div className="text-right text-xs sm:text-sm font-black text-[#0B1019] pt-1 border-t border-slate-50">
                          Subtotal: ₹{item.price}.00
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Claimed Free Gift Bundles */}
                {freeBundles.length > 0 && (
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-[#F7FEE7] to-[#F7FEE7] border-t border-[#D8F999] space-y-3">
                    <div className="flex items-center justify-between text-[#3A6300]">
                      <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                        <Gift className="w-4 h-4" />
                        Claimed Free Bonus Bundles ({freeBundles.length}/2)
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsFreeBundleModalOpen(true)}
                        className="text-xs font-bold underline hover:text-[#2E4F00]"
                      >
                        Change Free Bundles
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {freeBundles.map((fb) => (
                        <div key={fb.id} className="p-3 rounded-2xl bg-white border border-[#ECFCCA] flex items-center gap-3">
                          <img
                            src={optimizeImageUrl(fb.thumbnail, 64, 70)}
                            alt={fb.title}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-[#0B1019] truncate">{fb.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-black text-[#3A6300] bg-[#ECFCCA] px-2 py-0.5 rounded">
                                FREE BONUS ₹0
                              </span>
                              <span className="text-[10px] text-ink-300 line-through">₹{fb.personalPrice}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFreeBundle(fb.id)}
                            className="p-1.5 rounded-lg text-ink-300 hover:text-leaf-500 hover:bg-canvas-50 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Coupon Code & Update Cart Bar (Matches competitor screenshot) */}
                <div className="p-4 sm:p-5 bg-[#FAFBF7] border-t border-[#EEF2E6]">
                  <form
                    onSubmit={handleApplyCoupon}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2 flex-1 max-w-sm">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Coupon code"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-mint-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl border border-leaf-200 text-leaf-600 font-bold text-xs bg-leaf-50/70 hover:bg-leaf-100 transition-colors shrink-0"
                      >
                        Apply coupon
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => router.refresh()}
                      className="px-4 py-2.5 rounded-xl border border-canvas-200 text-[#5B6472] font-semibold text-xs bg-white hover:bg-canvas-50 transition-colors self-end sm:self-auto"
                    >
                      Update cart
                    </button>
                  </form>

                  {couponStatus && (
                    <p
                      className={`text-xs font-semibold mt-2 ${
                        couponStatus.type === 'success' ? 'text-leaf-600' : 'text-leaf-600'
                      }`}
                    >
                      {couponStatus.message}
                    </p>
                  )}
                </div>

              </div>

              {/* RIGHT: CART TOTALS CARD */}
              <div className="rounded-[20px] bg-white border border-[#E6EBDD] shadow-sm p-5 sm:p-6 space-y-4">
                <h3 className="text-lg font-extrabold text-[#0B1019]">Cart totals</h3>

                <div className="space-y-3 pt-1">
                  {/* Subtotal */}
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#7A8391] uppercase tracking-wider">
                      SUBTOTAL
                    </span>
                    <span className="text-[#0B1019] text-sm">₹{subtotal}.00</span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-[#EEF2E6]" />

                  {/* Total */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-black text-[#0B1019] uppercase tracking-wider">
                      TOTAL
                    </span>
                    <span className="text-2xl font-black text-leaf-600">
                      ₹{total}.00
                    </span>
                  </div>
                </div>

                {/* Proceed to checkout button */}
                <div className="pt-2">
                  <Link
                    href="/checkout"
                    className="w-full py-3.5 rounded-xl bg-mint-500 hover:bg-mint-300 text-ink font-extrabold text-sm tracking-wide shadow-md shadow-ink/10 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                  >
                    <span>Proceed to checkout</span>
                  </Link>
                </div>
              </div>

            </div>

            {/* =========================================================================
                5. TRUST BADGES ROW (Matches Competitor Screenshot: Instant Access, Secure, Digital Delivery)
                ========================================================================= */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              {/* Badge 1: Instant Access */}
              <div className="rounded-2xl bg-white border border-[#E6EBDD] p-4 flex items-center gap-3.5 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-leaf-50 text-leaf-600 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 fill-leaf-500" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#0B1019]">Instant Access</h4>
                  <p className="text-[11px] text-[#5B6472] font-medium mt-0.5">
                    Get access after successful payment.
                  </p>
                </div>
              </div>

              {/* Badge 2: Secure Checkout */}
              <div className="rounded-2xl bg-white border border-[#E6EBDD] p-4 flex items-center gap-3.5 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-leaf-50 text-leaf-600 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#0B1019]">Secure Checkout</h4>
                  <p className="text-[11px] text-[#5B6472] font-medium mt-0.5">
                    Payments are processed through secure gateways.
                  </p>
                </div>
              </div>

              {/* Badge 3: Digital Delivery */}
              <div className="rounded-2xl bg-white border border-[#E6EBDD] p-4 flex items-center gap-3.5 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center shrink-0">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#0B1019]">Digital Delivery</h4>
                  <p className="text-[11px] text-[#5B6472] font-medium mt-0.5">
                    No shipping or delivery wait.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
