import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle, ArrowRight, Zap, DownloadCloud, Scale } from 'lucide-react';
import PolicyContactInfo from '@/components/PolicyContactInfo';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ztore.shop').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Terms & Conditions | Ztore Digital - Official User Agreement',
  description:
    'Comprehensive Terms and Conditions of Sale for Ztore Digital. Outlines user rights, licensing, digital cloud delivery SLA, acceptable use, and payment gateway compliance.',
  alternates: {
    canonical: `${siteUrl}/terms-and-conditions`,
  },
};

export default function TermsPage() {
  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Badge & Title */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-[11px] font-black uppercase text-red-700 tracking-wider">
            <Scale className="w-3.5 h-3.5 text-red-600" />
            <span>LEGAL SALES & USER AGREEMENT</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto">
            Please read these terms carefully before making a purchase on <strong className="text-slate-900">Ztore Digital</strong>. By accessing this store or completing checkout, you agree to be bound by this legal agreement.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 pt-1">
            <span>Last Updated: October 30, 2026</span>
            <span>•</span>
            <span>Governing Law: India</span>
          </div>
        </div>

        {/* Highlight Summary Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">100% Digital Delivery</h2>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Zero shipping wait. Instant Google Drive cloud link access on payment completion.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">Instant UPI & Cards</h2>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Secure payment processing via Razorpay & Cashfree with 0% hidden convenience fees.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">Royalty-Free Usage</h2>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Personal & Commercial rights for social media publishing without ongoing licensing fees.</p>
            </div>
          </div>
        </div>

        {/* Main Document Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-8 text-sm text-slate-600 font-medium leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs flex items-center justify-center font-black">1</span>
              <span>General Terms & Definitions</span>
            </h2>
            <p>
              These Terms and Conditions constitute a legally binding electronic agreement between the visitor/customer (&quot;User&quot;, &quot;You&quot;) and <strong className="text-slate-900">Ztore Digital</strong> (&quot;Store&quot;, &quot;We&quot;, &quot;Us&quot;, &quot;Our&quot;).
            </p>
            <p>
              By accessing this website, purchasing downloadable products, or using related support services, you agree to comply with and be bound by all clauses detailed here, together with our <Link href="/privacy-policy" className="text-red-600 underline font-bold">Privacy Policy</Link> and <Link href="/refund-policy" className="text-red-600 underline font-bold">Refund Policy</Link>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs flex items-center justify-center font-black">2</span>
              <span>Eligibility to Contract</span>
            </h2>
            <p>
              You represent and warrant that you are at least 18 years of age and possess the legal authority to enter into a binding agreement under the Indian Contract Act, 1872. If you are accessing this site on behalf of a company, business, or creator agency, you represent that you hold proper authorization to bind that entity.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs flex items-center justify-center font-black">3</span>
              <span>Product Description & Delivery Method</span>
            </h2>
            <p>
              Ztore Digital is a digital content vendor offering pre-rendered video reels, digital bundles, graphic assets, and creator templates.
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <p><strong className="text-slate-900">Delivery SLA:</strong> Digital delivery occurs instantaneously upon successful confirmation of payment by the gateway.</p>
              <p><strong className="text-slate-900">Delivery Channels:</strong></p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
                <li><strong className="text-slate-800">On-Screen:</strong> An instant Google Drive download button appears on your order success screen.</li>
                <li><strong className="text-slate-800">Email:</strong> An automated confirmation containing the direct access link is immediately dispatched to your submitted email address.</li>
                <li><strong className="text-slate-800">Physical Goods Disclaimer:</strong> No physical CD, DVD, pendrive, or courier shipment is dispatched for digital items.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs flex items-center justify-center font-black">4</span>
              <span>License Tiers & Permitted Usage</span>
            </h2>
            <p>
              When purchasing bundles on Ztore Digital, you are granted a non-transferable license based on your selected product tier:
            </p>
            <div className="space-y-3 pt-1">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block font-bold text-sm">A. Standard Creator / Personal License:</strong>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Permits you to download, edit, add voiceovers, re-mix, and publish the video reels across your own personal or business social media channels (Instagram Reels, YouTube Shorts, Facebook Pages, TikTok, LinkedIn). You are strictly prohibited from reselling or distributing the raw source files or Google Drive links as standalone digital goods.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block font-bold text-sm">B. Master Resell Rights (MRR / Reseller License):</strong>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Where explicitly designated as a Reseller product, the buyer is granted commercial resale rights permitting direct distribution to third parties, packaging into individual offerings, or resale on the buyer&apos;s own digital storefront.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs flex items-center justify-center font-black">5</span>
              <span>Pricing, Currency & Payment Aggregators</span>
            </h2>
            <p>
              All prices displayed on Ztore Digital are in <strong className="text-slate-900">Indian Rupees (INR / ₹)</strong> inclusive of applicable digital taxes unless otherwise stated.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>Prices are subject to revision without prior notice, but price changes will not affect orders that have already received confirmed payment status.</li>
              <li>We accept all major Indian payment methods: Unified Payments Interface (UPI - Google Pay, PhonePe, Paytm, BHIM), Net Banking, RuPay, Visa, MasterCard, and domestic wallets.</li>
              <li>Transactions are processed securely through certified RBI-licensed payment aggregators (e.g. Razorpay, Cashfree). Ztore Digital does not collect or store full credit/debit card numbers or UPI MPINs.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs flex items-center justify-center font-black">6</span>
              <span>Refund & Cancellation Summary</span>
            </h2>
            <p>
              Due to the intangible and irreversible nature of digitally downloadable content, all completed transactions are deemed final once download access has been provided. However, full refunds or immediate link replacements are unconditionally issued in events of verified duplicate billing or unresolvable file corruption reported within 7 days.
            </p>
            <p className="text-xs text-slate-500">
              Please review our full <Link href="/refund-policy" className="text-red-600 underline font-bold">Refund & Cancellation Policy</Link> for detailed eligibility criteria and dispute turnaround timelines.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs flex items-center justify-center font-black">7</span>
              <span>Intellectual Property Rights</span>
            </h2>
            <p>
              All logos, site layout, typography, promotional copy, branding graphics, and website source code are the proprietary intellectual property of Ztore Digital. Any unauthorized reproduction, scraping, reverse-engineering, or mirroring of this storefront is strictly prohibited and subject to legal action under the Copyright Act, 1957.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs flex items-center justify-center font-black">8</span>
              <span>Limitation of Liability</span>
            </h2>
            <p>
              In no event shall Ztore Digital, its founders, operators, or affiliates be liable for any indirect, incidental, punitive, or consequential damages arising from the use or inability to use our digital files. To the maximum extent permitted by Indian law, our total aggregate liability for any claim arising from a product purchase shall not exceed the actual purchase price paid by the customer for that specific item.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs flex items-center justify-center font-black">9</span>
              <span>Governing Law & Jurisdiction</span>
            </h2>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of the Republic of India. Any legal dispute, controversy, or claim arising out of or relating to these terms shall be subject to the exclusive jurisdiction of the competent courts in India.
            </p>
          </section>

          {/* Grievance & Contact Section */}
          <section className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs flex items-center justify-center font-black">10</span>
              <span>Customer Support & Grievance Contact</span>
            </h2>
            <p>
              For any clarification regarding these Terms & Conditions or to report a technical issue with your order:
            </p>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-slate-700">
              <p><strong className="text-slate-900">Entity:</strong> Ztore Digital</p>
              <p><strong className="text-slate-900">Customer Support Desk:</strong> Dedicated Technical & Order Helpdesk</p>
              <p><PolicyContactInfo /></p>
              <p><strong className="text-slate-900">Support Hours:</strong> 10:00 AM – 8:00 PM IST, Monday to Sunday</p>
              <p><strong className="text-slate-900">Turnaround SLA:</strong> All queries answered within 1 to 24 hours.</p>
            </div>
          </section>

          {/* Footer Navigation Strip */}
          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-500">
            <div className="flex items-center gap-4">
              <Link href="/privacy-policy" className="hover:text-red-600 transition-colors">
                Privacy Policy &rarr;
              </Link>
              <Link href="/refund-policy" className="hover:text-red-600 transition-colors">
                Refund Policy &rarr;
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
