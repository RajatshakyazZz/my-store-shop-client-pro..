import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { RefreshCcw, CheckCircle2, AlertOctagon, HelpCircle, Clock, ShieldCheck, Mail, ArrowRight, FileCheck } from 'lucide-react';
import PolicyContactInfo from '@/components/PolicyContactInfo';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ztore.shop').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | Ztore Digital',
  description:
    'Official Refund, Return, and Cancellation Policy for Ztore Digital. Clear refund guidelines, turnaround times, and replacement SLAs for digital reel bundles under Indian consumer protection regulations.',
  alternates: {
    canonical: `${siteUrl}/refund-policy`,
  },
};

export default function RefundPolicyPage() {
  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Badge & Title */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-[11px] font-black uppercase text-blue-700 tracking-wider">
            <RefreshCcw className="w-3.5 h-3.5 text-blue-600" />
            <span>TRANSPARENT REFUND & DISPUTE RESOLUTION</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Refund & Cancellation Policy
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto">
            At <strong className="text-slate-900">Ztore Digital</strong>, customer trust is our top priority. Below is our transparent policy governing cancellations, refunds, and access replacements for digital assets.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 pt-1">
            <span>Last Updated: October 30, 2026</span>
            <span>•</span>
            <span>Refund SLA: 5 to 7 Working Days</span>
          </div>
        </div>

        {/* Highlight Summary Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">Duplicate Payment</h2>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">100% automated refund processed immediately if charged twice for the same order.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">Instant Replacement</h2>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Broken or inaccessible Google Drive links restored within 24 hours or money refunded.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">Original Source Refund</h2>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Refunds credited directly back to your source Bank Account, UPI ID, or Card.</p>
            </div>
          </div>
        </div>

        {/* Main Document Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-8 text-sm text-slate-600 font-medium leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs flex items-center justify-center font-black">1</span>
              <span>Nature of Digital Intangible Products</span>
            </h2>
            <p>
              All products listed and sold on <strong className="text-slate-900">Ztore Digital</strong> (<a href={siteUrl} className="text-red-600 underline">{siteUrl}</a>) are intangible, downloadable digital files (e.g., HD video reels bundles, creator graphics, audio tracks, and templates). Access to these files is granted instantaneously through encrypted cloud storage links (principally Google Drive) immediately upon successful payment confirmation.
            </p>
            <p>
              Because digital assets cannot be physically returned, re-packaged, or revoked once downloaded, <strong className="text-slate-900">all sales are generally considered non-refundable once the download link has been accessed or used</strong>, except under the explicit qualifying circumstances outlined below.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs flex items-center justify-center font-black">2</span>
              <span>Eligibility for a 100% Full Refund</span>
            </h2>
            <p>You are entitled to a full refund or direct financial compensation in the following scenarios:</p>
            
            <div className="space-y-2.5 pt-1">
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                <strong className="text-emerald-950 font-bold block text-sm">A. Duplicate / Accidental Multiple Charges:</strong>
                <p className="text-xs text-emerald-900 mt-1">
                  If your account was debited more than once for a single order due to a payment gateway latency or network error, please submit both transaction IDs. The duplicate amount will be refunded immediately without question.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80">
                <strong className="text-blue-950 font-bold block text-sm">B. Defective or Inaccessible Cloud Files:</strong>
                <p className="text-xs text-blue-900 mt-1">
                  If the delivered Google Drive folder is completely corrupt, files are missing, or access permissions cannot be granted by our support desk within 24 hours of receiving your grievance, a 100% refund will be provided.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200/80">
                <strong className="text-purple-950 font-bold block text-sm">C. Payment Successful but Order Generation Failed:</strong>
                <p className="text-xs text-purple-900 mt-1">
                  If your bank debited the amount but our website failed to generate an Order ID due to a technical glitch, and the link was not delivered to your email within 4 hours, you may request either manual order fulfillment or an immediate refund.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs flex items-center justify-center font-black">3</span>
              <span>Non-Refundable Circumstances</span>
            </h2>
            <p>Refund requests will NOT be honored under the following conditions:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li><strong className="text-slate-900">Change of Mind:</strong> Deciding you no longer want or need the bundle after payment and file download.</li>
              <li><strong className="text-slate-900">Lack of Editing Skills:</strong> Inability to use standard video editing software (e.g. CapCut, VN Editor, Premiere Pro) when all files are provided in standard industry MP4 format.</li>
              <li><strong className="text-slate-900">Incorrect Email Entry:</strong> Entering an invalid or misspelled email address at checkout without contacting our support team to correct it. (We will gladly re-assign your purchase to your correct email upon proof of payment).</li>
              <li><strong className="text-slate-900">Claims Exceeding 7 Days:</strong> Refund requests raised after 7 days from the transaction date.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs flex items-center justify-center font-black">4</span>
              <span>Cancellation Policy</span>
            </h2>
            <p>
              Because order fulfillment and Google Drive authorization occur in real-time within seconds of payment completion, <strong className="text-slate-900">an order cannot be cancelled once payment has been cleared</strong>. If you feel an error occurred during checkout, please reach out to our team immediately before attempting a chargeback.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs flex items-center justify-center font-black">5</span>
              <span>Refund Processing Timelines & Mode of Payout</span>
            </h2>
            <p>
              Once your refund request is verified and approved by our support staff:
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <p><strong className="text-slate-900">Mode:</strong> Refunds are credited strictly back to the original source payment method used during checkout (Original UPI ID, Debit Card, Credit Card, or Net Banking account).</p>
              <p><strong className="text-slate-900">Processing Time (Our End):</strong> Initiated within 24 to 48 hours of approval.</p>
              <p><strong className="text-slate-900">Credit to Bank Account (Banking SLA):</strong> Usually reflects within <strong className="text-slate-900">5 to 7 working days</strong>, depending on your acquiring bank&apos;s settlement cycle and RBI clearing guidelines.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs flex items-center justify-center font-black">6</span>
              <span>How to Submit a Refund or Replacement Request</span>
            </h2>
            <p>
              To initiate a claim, please contact our official support desk with:
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-slate-700 text-xs">
              <li>Your Order ID (e.g. #ZT-...) or registered Email Address.</li>
              <li>Payment Gateway Reference / UTR Number.</li>
              <li>A short description or screenshot of the technical issue faced.</li>
            </ol>
          </section>

          {/* Grievance & Official Contact Box */}
          <section className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs flex items-center justify-center font-black">7</span>
              <span>Dedicated Support Desk</span>
            </h2>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-slate-700">
              <p><strong className="text-slate-900">Platform:</strong> Ztore Digital</p>
              <p><strong className="text-slate-900">Desk:</strong> Order Disputes & Refund Desk</p>
              <p><PolicyContactInfo /></p>
              <p><strong className="text-slate-900">Operating Hours:</strong> 10:00 AM – 8:00 PM IST (Monday to Sunday)</p>
              <p><strong className="text-slate-900">First Response SLA:</strong> Under 4 hours on WhatsApp / 24 hours on Email.</p>
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
              <Link href="/contact-us" className="hover:text-red-600 transition-colors">
                Contact Us &rarr;
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
