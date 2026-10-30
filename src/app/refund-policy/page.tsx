import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { RotateCcw, ShieldCheck, Clock, CheckCircle2, HelpCircle, AlertCircle, RefreshCw } from 'lucide-react';
import PolicyContactInfo from '@/components/PolicyContactInfo';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ztore.shop').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | Ztore Digital',
  description: 'Official Refund & Cancellation Policy of Ztore Digital. Details our transparent refund guidelines and 5-7 day payment gateway reversal timelines.',
  alternates: {
    canonical: `${siteUrl}/refund-policy`,
  },
};

export default function RefundPolicyPage() {
  return (
    <div className="py-12 sm:py-20 bg-[#faf9ff]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-[11px] font-black uppercase text-amber-800 tracking-wider">
            <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
            <span>TRANSPARENT CONSUMER PROTECTION</span>
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#182247] tracking-tight">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Effective Date: October 2026 • Last Revised: October 30, 2026 • Applicable to all purchases on ztore.shop
          </p>
        </div>

        {/* Quick Summary Pill Box */}
        <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm sm:text-base">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Key Refund Guidelines &amp; Gateway Reversal Timelines</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 font-medium">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <strong className="text-slate-900 block font-bold mb-1">⏱️ 24–48 Hour Review</strong>
              All refund requests are reviewed and initiated by our support team within 24–48 business hours.
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <strong className="text-slate-900 block font-bold mb-1">🏦 5–7 Days Bank Credit</strong>
              Approved refunds are credited back to your original payment source (UPI, Card, NetBanking) within 5–7 working days.
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <strong className="text-slate-900 block font-bold mb-1">🔄 100% Duplicate Protection</strong>
              Accidental duplicate payments or double deductions due to network timeouts are refunded 100% immediately.
            </div>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-8 text-sm text-[#475569] font-normal leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-700 font-black text-xs flex items-center justify-center">1</span>
              <span>Nature of Digital Intangible Goods</span>
            </h2>
            <p>
              All products listed and purchased on <strong>Ztore Digital</strong> (ztore.shop) are <strong>intangible digital goods</strong> (including curated vertical video reel bundles, editing templates, AI creative clips, and media assets) delivered instantaneously via cloud storage links (Google Drive).
            </p>
            <p>
              Unlike physical merchandise, digital assets cannot be physically returned or retrieved once access to the Google Drive folder has been made available to the buyer. Therefore, in accordance with Indian e-commerce standards and digital copyright norms, purchases of digital downloads are generally final once the files have been accessed or downloaded. However, to protect our valued customers, we offer clear, fair exceptions outlined below.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-700 font-black text-xs flex items-center justify-center">2</span>
              <span>Eligibility &amp; Conditions for a Full Refund</span>
            </h2>
            <p>
              You are entitled to a 100% full refund or immediate replacement under any of the following verified conditions:
            </p>
            
            <div className="space-y-3 pt-1">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="text-slate-900 block text-xs sm:text-sm font-bold">
                    A. Duplicate or Accidental Double Payment
                  </strong>
                  <p className="text-xs text-slate-600">
                    If your bank account, card, or UPI app was charged more than once for the same transaction due to a network glitch, gateway timeout, or accidental double submission, we will initiate an immediate 100% refund of the duplicate charge upon verification of your transaction receipt.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="text-slate-900 block text-xs sm:text-sm font-bold">
                    B. Defective or Inaccessible Cloud Link Unresolved Within 24 Hours
                  </strong>
                  <p className="text-xs text-slate-600">
                    If the provided Google Drive link is corrupted, broken, or inoperative, and our technical support team is unable to provide you with working alternative access or restore your link within 24 hours of receiving your support ticket, you are entitled to a full refund.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="text-slate-900 block text-xs sm:text-sm font-bold">
                    C. Unauthorized or Fraudulent Transaction
                  </strong>
                  <p className="text-xs text-slate-600">
                    If an unauthorized transaction was conducted using your payment method without your consent, and this is confirmed by your bank and payment gateway records, a full refund will be processed upon receipt of formal notification.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-700 font-black text-xs flex items-center justify-center">3</span>
              <span>Non-Refundable Circumstances</span>
            </h2>
            <p>
              Refund requests cannot be approved under the following conditions:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium text-xs sm:text-sm">
              <li><strong>Change of Mind:</strong> Change of mind or buyer&apos;s remorse after the Google Drive folder has already been accessed, previewed, or downloaded.</li>
              <li><strong>Social Media Performance:</strong> Dissatisfaction based solely on views, followers, or reach on third-party social media platforms (Instagram, YouTube, TikTok), as social media algorithms are independent and unpredictable.</li>
              <li><strong>Third-Party Software Compatibility:</strong> Inability to edit videos due to personal lack of video editing software on your device (all files are standard universal MP4 video format compatible with free mobile apps such as CapCut, VN, InShot, Premiere Pro, and Canva).</li>
              <li><strong>Failure to Download Within Active Window:</strong> While we offer lifetime access, customers are encouraged to back up their files locally to their own devices.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-700 font-black text-xs flex items-center justify-center">4</span>
              <span>Cancellation Policy</span>
            </h2>
            <p>
              <strong>Immediate Digital Fulfillment:</strong> Because our order processing system automatically unlocks Google Drive cloud access within seconds of payment completion, standard physical goods cancellation is not possible once the download links have been delivered to your screen and email.
            </p>
            <p>
              If you mistakenly placed an order and have <strong>not yet clicked or accessed the Google Drive link</strong>, you must notify our customer support team within <strong>2 hours</strong> of checkout. Once verified by our cloud access logs, your order will be cancelled and a full refund will be processed.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-700 font-black text-xs flex items-center justify-center">5</span>
              <span>Refund Processing &amp; Bank Reversal Timelines</span>
            </h2>
            <p>
              All refund transactions are processed strictly in accordance with RBI guidelines and banking protocols:
            </p>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs sm:text-sm text-emerald-950 font-medium">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <RefreshCw className="w-4 h-4 text-emerald-700" />
                <span>Payment Gateway Reversal Flow:</span>
              </div>
              <ol className="list-decimal pl-5 space-y-1 text-xs text-slate-700">
                <li>Once approved, our team triggers the refund via the originating payment gateway (Cashfree / Razorpay / PayU) within <strong>24 to 48 business hours</strong>.</li>
                <li>The payment gateway transmits the reversal instruction to your bank or card network.</li>
                <li>Depending on your banking institution or UPI provider, the funds will reflect in your original payment source within <strong>5 to 7 business days</strong>.</li>
                <li>Refunds are always credited back to the exact payment method used during checkout (Original Payment Source); cash or alternative third-party account refunds are strictly prohibited under anti-money laundering regulations.</li>
              </ol>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-700 font-black text-xs flex items-center justify-center">6</span>
              <span>How to Request a Refund or Link Assistance</span>
            </h2>
            <p>
              To submit a claim, please reach out to our official support team with the following details:
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700 font-medium">
              <p><strong>Please provide:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Your Order ID (e.g., <code>VZ-123456</code>).</li>
                <li>The email address entered at checkout.</li>
                <li>Proof of transaction / bank deduction statement (for duplicate charges).</li>
                <li>A brief description of the technical issue encountered.</li>
              </ul>
            </div>
            <p className="text-xs text-slate-600">
              Our support team will acknowledge your inquiry within 2 to 4 business hours and guide you through immediate resolution.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 pt-4 border-t border-slate-200">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-700 font-black text-xs flex items-center justify-center">7</span>
              <span>Official Support &amp; Grievance Redressal</span>
            </h2>
            <p>
              For all refund claims and technical queries, please reach out to our designated customer service team:
            </p>
            <PolicyContactInfo />
          </section>

        </div>

        {/* Footer Navigation Back to Store */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pt-2">
          <Link href="/" className="hover:text-amber-600 transition-colors">
            ← Return to Ztore Digital Home
          </Link>
          <div className="flex gap-4">
            <Link href="/terms-and-conditions" className="hover:text-amber-600 transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link href="/privacy-policy" className="hover:text-amber-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/shipping-policy" className="hover:text-amber-600 transition-colors">
              Shipping &amp; Delivery
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
