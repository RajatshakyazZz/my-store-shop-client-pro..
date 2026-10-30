import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Zap, ShieldCheck, FolderOpen, Mail, Clock, HelpCircle, CheckCircle2 } from 'lucide-react';
import PolicyContactInfo from '@/components/PolicyContactInfo';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://vaultworld.shop').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy | VaultWorld Store',
  description: 'Instant Digital Delivery and Shipping Policy for VaultWorld Store. Explains our 60-second cloud delivery via Google Drive with zero shipping charges.',
  alternates: {
    canonical: `${siteUrl}/shipping-policy`,
  },
};

export default function ShippingPolicyPage() {
  return (
    <div className="py-12 sm:py-20 bg-[#faf9ff]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-[11px] font-black uppercase text-amber-800 tracking-wider">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>INSTANT ELECTRONIC DELIVERY POLICY</span>
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#182247] tracking-tight">
            Shipping &amp; Digital Delivery Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Effective Date: October 2026 • Last Revised: October 30, 2026 • Applicable to all purchases on vaultworld.shop
          </p>
        </div>

        {/* Quick Highlights Card */}
        <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm sm:text-base">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Digital Delivery Highlights</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 font-medium">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <strong className="text-slate-900 block font-bold mb-1">⚡ 100% Instant Delivery</strong>
              Delivered electronically within 60 seconds of payment verification. No waiting period.
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <strong className="text-slate-900 block font-bold mb-1">💰 ₹0 Shipping Fee</strong>
              Zero shipping, handling, or courier charges. Free lifetime digital access included.
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <strong className="text-slate-900 block font-bold mb-1">📂 24/7 Self-Service Access</strong>
              Instant access on the order success screen and sent to your email with lifetime cloud backup.
            </div>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-8 text-sm text-[#475569] font-normal leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-700 font-black text-xs flex items-center justify-center">1</span>
              <span>100% Digital Intangible Products (No Physical Shipping)</span>
            </h2>
            <p>
              VaultWorld Store operates exclusively as a retailer of <strong>downloadable digital content</strong> (including pre-rendered 1080p vertical video reels bundles, social media creative packs, AI reel clips, and editing assets).
            </p>
            <p>
              <strong>We do not sell, package, or ship any physical goods or parcels.</strong> Consequently, physical postal shipping, courier transit times, delivery addresses, and courier tracking numbers are not applicable to any orders on our platform.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-700 font-black text-xs flex items-center justify-center">2</span>
              <span>Shipping &amp; Delivery Charges</span>
            </h2>
            <p>
              All digital products sold on VaultWorld Store carry <strong>Zero Shipping Charges (₹0.00 / Free Delivery)</strong>. The price displayed on the product page and checkout is the total final price you pay. There are no shipping, handling, fuel surcharge, or packaging fees added to your order.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-700 font-black text-xs flex items-center justify-center">3</span>
              <span>Delivery Method &amp; Fulfillment Process</span>
            </h2>
            <p>
              Our automated delivery infrastructure ensures seamless, immediate fulfillment through a 3-tier delivery system:
            </p>
            
            <div className="space-y-3 pt-1">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 font-black text-xs">
                  1
                </div>
                <div className="space-y-1">
                  <strong className="text-slate-900 block text-xs sm:text-sm font-bold">
                    Tier 1: Instant On-Screen Access
                  </strong>
                  <p className="text-xs text-slate-600">
                    Immediately following successful payment completion via UPI, Debit/Credit Card, or Net Banking, our system instantly displays your verified Order Success page with direct, 1-click &quot;Open Google Drive Folder&quot; download buttons.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0 font-black text-xs">
                  2
                </div>
                <div className="space-y-1">
                  <strong className="text-slate-900 block text-xs sm:text-sm font-bold">
                    Tier 2: Automated Email Delivery Confirmation
                  </strong>
                  <p className="text-xs text-slate-600">
                    An automated transactional confirmation email containing your permanent Google Drive access link, order number, and tax receipt is dispatched to your provided Gmail address within <strong>60 seconds</strong> of payment verification.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-700 flex items-center justify-center shrink-0 font-black text-xs">
                  3
                </div>
                <div className="space-y-1">
                  <strong className="text-slate-900 block text-xs sm:text-sm font-bold">
                    Tier 3: 24/7 Self-Service Order Recovery Portal
                  </strong>
                  <p className="text-xs text-slate-600">
                    You can retrieve your purchased Google Drive access links anytime by simply entering your checkout email on our self-service portal at <Link href="/my-order" className="text-amber-700 underline font-semibold">vaultworld.shop/my-order</Link>.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-700 font-black text-xs flex items-center justify-center">4</span>
              <span>Delivery Timelines &amp; SLA Commitment</span>
            </h2>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm text-slate-700 font-medium">
              <p>
                • <strong>Standard Electronic Delivery Time:</strong> Within 1 to 2 minutes of payment confirmation.
              </p>
              <p>
                • <strong>Maximum Service Level Agreement (SLA):</strong> 15 minutes (in rare cases of upstream cloud API traffic or temporary banking webhooks delay).
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-700 font-black text-xs flex items-center justify-center">5</span>
              <span>Undelivered Email or Access Link Assistance</span>
            </h2>
            <p>
              If your payment was successfully deducted but you have not received your download link or confirmation email within 5 minutes, please perform the following checks:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium text-xs sm:text-sm">
              <li>Check your email&apos;s <strong>Spam, Promotions, or Updates</strong> folder.</li>
              <li>Verify that you entered your correct Gmail address during checkout without typos.</li>
              <li>Visit our self-service recovery page at <Link href="/my-order" className="text-amber-700 underline font-semibold">vaultworld.shop/my-order</Link>.</li>
            </ul>
            <p className="text-xs text-slate-600">
              If you still cannot locate your access, contact our 24/7 customer support desk with your Order ID or payment screenshot, and we will manually re-dispatch your link within 2 to 4 hours.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 pt-4 border-t border-slate-200">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-700 font-black text-xs flex items-center justify-center">6</span>
              <span>Contact for Delivery Assistance</span>
            </h2>
            <p>
              For any questions regarding order delivery, Google Drive access permissions, or file unzipping support, please contact our team:
            </p>
            <PolicyContactInfo />
          </section>

        </div>

        {/* Footer Navigation Back to Store */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pt-2">
          <Link href="/" className="hover:text-amber-600 transition-colors">
            ← Return to VaultWorld Store Home
          </Link>
          <div className="flex gap-4">
            <Link href="/terms-and-conditions" className="hover:text-amber-600 transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link href="/privacy-policy" className="hover:text-amber-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/refund-policy" className="hover:text-amber-600 transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
