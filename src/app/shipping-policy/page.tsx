import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Truck, Zap, DownloadCloud, Mail, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import PolicyContactInfo from '@/components/PolicyContactInfo';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ztore.shop').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy | Ztore Digital - Instant Digital Delivery',
  description:
    'Shipping and Digital Delivery Policy for Ztore Digital. Understand how digital reels bundles are fulfilled instantly via secure Google Drive cloud links with zero physical shipping delays.',
  alternates: {
    canonical: `${siteUrl}/shipping-policy`,
  },
};

export default function ShippingPolicyPage() {
  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Badge & Title */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-black uppercase text-emerald-700 tracking-wider">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>INSTANT CLOUD DISPATCH &bull; NO PHYSICAL SHIPPING WAIT</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Shipping & Delivery Policy
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto">
            All products on <strong className="text-slate-900">Ztore Digital</strong> are 100% digital goods delivered electronically across India and worldwide.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 pt-1">
            <span>Last Updated: October 30, 2026</span>
            <span>•</span>
            <span>Delivery Timeline: Instant (0 to 60 seconds)</span>
          </div>
        </div>

        {/* Highlight Summary Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">Instant On-Screen Access</h2>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Direct Google Drive access button renders on your confirmation screen instantly.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">Email Backup</h2>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Automated confirmation email containing your permanent cloud link is sent immediately.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">₹0 Shipping Fee</h2>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Zero courier charges, zero postal waiting time, zero transit damage risk.</p>
            </div>
          </div>
        </div>

        {/* Main Document Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-8 text-sm text-slate-600 font-medium leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs flex items-center justify-center font-black">1</span>
              <span>Electronic Mode of Delivery</span>
            </h2>
            <p>
              Ztore Digital exclusively deals in downloadable digital video assets, ready-to-post reels bundles, templates, and social media creator resources.
            </p>
            <p>
              <strong className="text-slate-900">No physical shipments or parcel couriers are used.</strong> You will NOT receive any physical package, parcel, pendrive, CD/DVD, or printed material at your residential or office mailing address.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs flex items-center justify-center font-black">2</span>
              <span>Delivery Timeline & Fulfillment SLA</span>
            </h2>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <p><strong className="text-slate-900">Standard Fulfillment Time:</strong> Instant (typically within 1 to 60 seconds after payment clearance).</p>
              <p><strong className="text-slate-900">Maximum Fulfillment SLA:</strong> Under 2 hours (in case of rare third-party network or Google Cloud sync latency).</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs flex items-center justify-center font-black">3</span>
              <span>How You Receive Your Order</span>
            </h2>
            <p>Upon successful payment confirmation via Razorpay or Cashfree:</p>
            <ol className="list-decimal pl-5 space-y-2 text-slate-700">
              <li>
                <strong className="text-slate-900">Instant On-Screen Access:</strong> You are automatically redirected to our Order Success portal displaying your Order ID and an active &quot;Access Google Drive Folder&quot; button.
              </li>
              <li>
                <strong className="text-slate-900">Email Confirmation & Backup Link:</strong> An automated confirmation email is simultaneously dispatched to the email address provided during checkout containing your permanent folder link.
              </li>
              <li>
                <strong className="text-slate-900">Self-Service Lookup Portal:</strong> You can re-access your digital links at any time by visiting our <Link href="/my-order" className="text-red-600 underline font-bold">My Orders</Link> page using your order email or phone number.
              </li>
            </ol>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs flex items-center justify-center font-black">4</span>
              <span>Delivery Failure & Missing Links Support</span>
            </h2>
            <p>
              If you have made a payment but did not receive your download link within 5 minutes:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Check your email&apos;s Spam, Promotions, or Updates folders.</li>
              <li>Verify if there was a typo in the email address submitted at checkout.</li>
              <li>Contact our official 24/7 WhatsApp or Email Support with your UTR / Payment transaction ID, and our representative will verify the payment and manually release your access link immediately.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs flex items-center justify-center font-black">5</span>
              <span>Shipping & Delivery Charges</span>
            </h2>
            <p>
              Since all orders are delivered digitally over the Internet, <strong className="text-slate-900">Shipping Fees are ₹0.00 (Completely Free)</strong> across all categories and bundle purchases.
            </p>
          </section>

          {/* Official Contact Box */}
          <section className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs flex items-center justify-center font-black">6</span>
              <span>Fulfillment & Dispatch Helpdesk</span>
            </h2>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-slate-700">
              <p><strong className="text-slate-900">Platform:</strong> Ztore Digital</p>
              <p><strong className="text-slate-900">Fulfillment Team:</strong> Digital Delivery Operations</p>
              <p><PolicyContactInfo /></p>
              <p><strong className="text-slate-900">Support Hours:</strong> 10:00 AM – 8:00 PM IST (Monday to Sunday)</p>
            </div>
          </section>

          {/* Footer Navigation Strip */}
          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-500">
            <div className="flex items-center gap-4">
              <Link href="/privacy-policy" className="hover:text-red-600 transition-colors">
                Privacy Policy &rarr;
              </Link>
              <Link href="/terms-and-conditions" className="hover:text-red-600 transition-colors">
                Terms & Conditions &rarr;
              </Link>
              <Link href="/refund-policy" className="hover:text-red-600 transition-colors">
                Refund Policy &rarr;
              </Link>
            </div>
            <Link href="/" className="text-red-600 hover:underline">
              Back to Storefront
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
