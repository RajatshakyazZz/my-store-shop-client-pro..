import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, FileText, CheckCircle2, AlertCircle, Scale, CreditCard, Lock, Sparkles } from 'lucide-react';
import PolicyContactInfo from '@/components/PolicyContactInfo';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ztoredigital.com').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Terms & Conditions | Ztore Digital',
  description: 'Official Terms of Service and Merchant Agreement for Ztore Digital. Fully compliant with RBI payment aggregator guidelines and Indian IT Act.',
  alternates: {
    canonical: `${siteUrl}/terms-and-conditions`,
  },
};

export default function TermsPage() {
  return (
    <div className="py-12 sm:py-20 bg-[#faf9ff]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-[11px] font-black uppercase text-red-800 tracking-wider">
            <Scale className="w-3.5 h-3.5 text-red-600" />
            <span>LEGAL &amp; COMPLIANCE AGREEMENT</span>
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#182247] tracking-tight">
            Terms &amp; Conditions (Terms of Service)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Effective Date: October 2026 • Last Updated: October 30, 2026 • Governing Law: Republic of India
          </p>
        </div>

        {/* Quick Highlights Banner for Payment Gateway Approval */}
        <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm sm:text-base">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Merchant Regulatory Compliance &amp; Consumer Protection Summary</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 font-medium">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <strong className="text-slate-900 block font-bold mb-1">⚡ Instant Digital Delivery</strong>
              All purchases are digital video reel bundles delivered immediately via cloud storage (Google Drive). Zero physical shipping.
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <strong className="text-slate-900 block font-bold mb-1">🔒 RBI-Licensed Gateways</strong>
              Payments are processed via authorized payment aggregators (Cashfree, Razorpay, PayU). We never store your card or UPI PINs.
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <strong className="text-slate-900 block font-bold mb-1">⚖️ Fair Refund Protection</strong>
              Full refunds or instant link replacement provided for duplicate charges or inaccessible files as per our transparent policy.
            </div>
          </div>
        </div>

        {/* Main Legal Content Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-8 text-sm text-[#475569] font-normal leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-500/10 text-red-700 font-black text-xs flex items-center justify-center">1</span>
              <span>Agreement to Terms &amp; Scope of Contract</span>
            </h2>
            <p>
              These Terms and Conditions (&quot;Terms&quot;, &quot;Terms of Service&quot;, &quot;Agreement&quot;) constitute a legally binding electronic agreement between you (&quot;User&quot;, &quot;Customer&quot;, &quot;Buyer&quot;, or &quot;You&quot;) and <strong>Ztore Digital</strong> (&quot;Store&quot;, &quot;We&quot;, &quot;Us&quot;, or &quot;Our&quot;), operating via the website located at <strong>ztoredigital.com</strong> (and its official subdomains and mirror endpoints).
            </p>
            <p>
              By visiting our website, browsing our digital bundle catalog, placing an order, or initiating checkout, you acknowledge that you have read, understood, and agreed to be bound by these Terms, as well as our{' '}
              <Link href="/privacy-policy" className="text-red-700 font-semibold underline underline-offset-2">
                Privacy Policy
              </Link>
              ,{' '}
              <Link href="/refund-policy" className="text-red-700 font-semibold underline underline-offset-2">
                Refund &amp; Cancellation Policy
              </Link>
              , and{' '}
              <Link href="/shipping-policy" className="text-red-700 font-semibold underline underline-offset-2">
                Shipping &amp; Delivery Policy
              </Link>
              . If you do not agree with any part of these Terms, you must immediately discontinue use of the platform.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-500/10 text-red-700 font-black text-xs flex items-center justify-center">2</span>
              <span>Nature of Products &amp; Digital Offerings</span>
            </h2>
            <p>
              Ztore Digital is an e-commerce platform dedicated exclusively to <strong>intangible digital goods</strong>. Our products include:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 font-medium">
              <li>Pre-rendered, high-definition (1080p Full HD) vertical video clips optimized for social media reels (9:16 aspect ratio).</li>
              <li>Thematic AI and creative reels bundles, video transitions, background assets, and audio synchronization tracks.</li>
              <li>Ready-to-use digital templates and viral content assets designed for video creators, social media marketers, and digital entrepreneurs.</li>
            </ul>
            <p>
              <strong>No Physical Shipment:</strong> We do not sell or ship physical merchandise. All digital assets are stored in secure cloud repositories (Google Drive) and access permissions are provided instantaneously upon successful payment confirmation.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-500/10 text-red-700 font-black text-xs flex items-center justify-center">3</span>
              <span>User Eligibility &amp; Representations</span>
            </h2>
            <p>
              To purchase or interact with Ztore Digital, you represent and warrant that:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 text-slate-600 font-medium">
              <li>You are at least 18 years of age or possess the legal capacity to enter into a valid, binding contract under the Indian Contract Act, 1872. If you are under 18 years old, you may access and purchase only under the direct supervision of a parent or legal guardian.</li>
              <li>All information provided by you at checkout (including your full name, real Gmail address for Google Drive permissions, and WhatsApp/mobile phone number) is accurate, current, and complete.</li>
              <li>You are accessing our services for lawful purposes and will not use the purchased digital media assets in violation of any applicable local, national, or international laws or regulations.</li>
            </ol>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-500/10 text-red-700 font-black text-xs flex items-center justify-center">4</span>
              <span>Pricing, Currency &amp; Taxes</span>
            </h2>
            <p>
              All prices displayed on Ztore Digital are quoted in <strong>Indian National Rupees (INR / ₹)</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 font-medium">
              <li><strong>Inclusive Pricing:</strong> Prices listed on bundle cards and checkout are final and inclusive of applicable Goods and Services Tax (GST) unless explicitly indicated otherwise.</li>
              <li><strong>No Recurring Subscriptions or Hidden Charges:</strong> All bundle purchases are one-time payments granting lifetime cloud access. We do not enroll users into recurring auto-debit subscriptions without their explicit, separate authorization.</li>
              <li><strong>Price Revisions:</strong> We reserve the right to modify prices, launch promotional flash discounts, or discontinue bundles at any time. Price adjustments do not retroactively apply to previously confirmed purchases.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-500/10 text-red-700 font-black text-xs flex items-center justify-center">5</span>
              <span>Payment Terms &amp; Payment Aggregator Security</span>
            </h2>
            <p>
              To ensure top-tier security and absolute financial privacy, all online payments on Ztore Digital are facilitated through Reserve Bank of India (RBI) authorized, PCI-DSS Level 1 compliant payment aggregators:
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs sm:text-sm">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Accepted Payment Instruments:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                <li><strong>Unified Payments Interface (UPI):</strong> Google Pay, PhonePe, Paytm, BHIM UPI, CRED, and all major bank UPI apps.</li>
                <li><strong>Debit &amp; Credit Cards:</strong> Visa, MasterCard, RuPay, and American Express issued by domestic and international banks.</li>
                <li><strong>Internet Banking:</strong> Over 50+ major Indian banks supported.</li>
                <li><strong>Digital Wallets:</strong> Leading wallet providers.</li>
              </ul>
            </div>
            <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200/80 text-xs text-red-900 font-medium space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Lock className="w-4 h-4 text-red-700" />
                <span>PCI-DSS Financial Data Security Commitment:</span>
              </div>
              <p>
                <strong>Ztore Digital does not collect, record, or store any sensitive financial credentials</strong> such as credit/debit card numbers, CVV codes, net banking passwords, or UPI PINs. All payment transactions are encrypted via 256-bit SSL technology directly through the certified payment gateway servers (Cashfree Payments India Pvt. Ltd. / Razorpay Software Pvt. Ltd. / PayU Payments Pvt. Ltd.).
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-500/10 text-red-700 font-black text-xs flex items-center justify-center">6</span>
              <span>Instant Digital Delivery &amp; Access Rights</span>
            </h2>
            <p>
              Upon successful payment authorization by the payment gateway, your order is fulfilled automatically without manual delays:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 font-medium">
              <li><strong>On-Screen Access:</strong> You are immediately redirected to our secure Order Confirmation Page where your direct Google Drive access buttons and folder links are made available.</li>
              <li><strong>Email Delivery:</strong> An automated digital delivery receipt containing your permanent access link is dispatched to your provided Gmail address within 60 seconds of transaction completion.</li>
              <li><strong>Self-Service Access:</strong> Customers may re-access their Google Drive links at any time by entering their checkout email on our self-service portal at <Link href="/my-order" className="text-red-700 underline font-semibold">ztoredigital.com/my-order</Link>.</li>
              <li><strong>Shipping Charges:</strong> There are zero shipping, courier, or delivery fees (₹0.00).</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-500/10 text-red-700 font-black text-xs flex items-center justify-center">7</span>
              <span>License Terms &amp; Permitted Usage</span>
            </h2>
            <p>
              When purchasing bundles on Ztore Digital, you are granted a non-exclusive license based on the licensing option specified for that product:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                  A. Personal &amp; Commercial Creator License
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Grants you the right to post, edit, modify, add voiceovers/captions, and publish the video reels across your own personal, creator, or commercial social media channels (Instagram, YouTube Shorts, Facebook Reels, TikTok, LinkedIn) to generate engagement, leads, or views. You may not resell the raw, unedited source files as your own standalone bundle pack.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-red-50/50 border border-red-200/80 space-y-1.5">
                <span className="text-xs font-black text-red-900 uppercase tracking-wider block">
                  B. Master Resell Rights (MRR / PLR License)
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Where a bundle explicitly includes Reseller / Master Resell Rights (MRR), you are granted permission to package, resell, or distribute the bundle files to your own buyers and retain 100% of the sales proceeds. Resale must adhere to fair trade practices and must not claim false affiliation with Ztore Digital.
                </p>
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-500/10 text-red-700 font-black text-xs flex items-center justify-center">8</span>
              <span>Prohibited Activities &amp; Anti-Fraud Policy</span>
            </h2>
            <p>
              Users of Ztore Digital agree not to engage in any of the following prohibited behaviors:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
              <li>Using stolen, compromised, or unauthorized credit cards, debit cards, or UPI IDs to initiate fraudulent checkouts.</li>
              <li>Initiating false, bad-faith chargebacks or payment disputes with banks after successfully receiving and downloading the digital Google Drive files.</li>
              <li>Attempting to bypass access controls, breach website security, reverse engineer server APIs, or scrape proprietary platform databases.</li>
              <li>Using our digital video assets to create, publish, or promote defamatory, hateful, abusive, sexually explicit, or illegal content.</li>
            </ul>
            <p className="text-xs text-rose-700 font-semibold">
              Violation of these terms will lead to immediate, permanent revocation of cloud access permissions and may result in legal reporting to appropriate cybercrime and banking authorities.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-500/10 text-red-700 font-black text-xs flex items-center justify-center">9</span>
              <span>Disclaimer of Warranties &amp; Earnings Representation</span>
            </h2>
            <p>
              <strong>Educational &amp; Creative Utility Only:</strong> All video templates, hooks, and bundle assets provided by Ztore Digital are creative tools provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis.
            </p>
            <p>
              <strong>No Guarantee of Virality or Financial Earnings:</strong> While our bundles are curated to match current social media trends and high-retention formats, social media platform algorithms (Instagram, YouTube, Facebook, TikTok) are proprietary and subject to continuous automated updates. We do not make any express or implied guarantees regarding the exact number of views, followers, subscriber growth, or revenue you will attain by using our content. Your actual results depend solely on your creative consistency, niche targeting, audience engagement, and publishing strategy.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-500/10 text-red-700 font-black text-xs flex items-center justify-center">10</span>
              <span>Refund, Replacement &amp; Cancellation</span>
            </h2>
            <p>
              Due to the irrevocable nature of downloadable digital content, all sales are governed by our official{' '}
              <Link href="/refund-policy" className="text-red-700 font-bold underline underline-offset-2">
                Refund &amp; Cancellation Policy
              </Link>
              . We guarantee 100% resolution, link replacement, or a full refund in genuine cases including verified duplicate charges or technical corruption of Google Drive links unresolvable within 24 hours.
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-500/10 text-red-700 font-black text-xs flex items-center justify-center">11</span>
              <span>Limitation of Liability &amp; Indemnification</span>
            </h2>
            <p>
              To the maximum extent permitted by applicable Indian laws, Ztore Digital, its founders, affiliates, employees, and licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your access to or inability to access the digital files, including loss of profits, data corruption, or business interruption.
            </p>
            <p>
              In all cases, our aggregate liability for any claims arising out of or related to these Terms or your purchase shall not exceed the total amount actually paid by you to Ztore Digital for the specific order giving rise to the claim.
            </p>
          </section>

          {/* Section 12 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-500/10 text-red-700 font-black text-xs flex items-center justify-center">12</span>
              <span>Governing Law &amp; Dispute Resolution</span>
            </h2>
            <p>
              These Terms and any dispute or claim arising out of or in connection with them shall be governed by and construed in accordance with the <strong>laws of the Republic of India</strong>, including the Information Technology Act, 2000 and the Consumer Protection (E-Commerce) Rules, 2020.
            </p>
            <p>
              Any legal action, suit, or proceeding arising out of or relating to these Terms shall be instituted exclusively in the competent courts located within the territory of India.
            </p>
          </section>

          {/* Section 13 */}
          <section className="space-y-3 pt-4 border-t border-slate-200">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-500/10 text-red-700 font-black text-xs flex items-center justify-center">13</span>
              <span>Customer Support &amp; Grievance Redressal</span>
            </h2>
            <p>
              In accordance with Rule 5(9) of the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 and the Consumer Protection Act, 2019, the contact details of our official support and Grievance Officer are set forth below:
            </p>
            <PolicyContactInfo />
          </section>

        </div>

        {/* Footer Navigation Back to Store */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pt-2">
          <Link href="/" className="hover:text-red-600 transition-colors">
            ← Return to Store Home
          </Link>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-red-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/refund-policy" className="hover:text-red-600 transition-colors">
              Refund Policy
            </Link>
            <Link href="/shipping-policy" className="hover:text-red-600 transition-colors">
              Shipping &amp; Delivery
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
