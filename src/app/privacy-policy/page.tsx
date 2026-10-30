import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, Database, Server, UserCheck, AlertTriangle } from 'lucide-react';
import PolicyContactInfo from '@/components/PolicyContactInfo';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://vaultworld.shop').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Privacy Policy | VaultWorld Store',
  description: 'Official Privacy Policy of VaultWorld Store. Details our adherence to the Digital Personal Data Protection Act (DPDP Act 2023) and RBI payment security rules.',
  alternates: {
    canonical: `${siteUrl}/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 sm:py-20 bg-[#faf9ff]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-black uppercase text-emerald-800 tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>DPDP ACT 2023 &amp; RBI COMPLIANT PRIVACY POLICY</span>
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#182247] tracking-tight">
            Privacy Policy &amp; Data Protection
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Effective Date: October 2026 • Last Revised: October 30, 2026 • Platform: vaultworld.shop
          </p>
        </div>

        {/* Core Financial Privacy Commitment Card (Mandatory for Cashfree / Razorpay / PayU Onboarding) */}
        <div className="rounded-2xl sm:rounded-3xl bg-emerald-950 text-white p-6 sm:p-8 shadow-md border border-emerald-700/50 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-emerald-200">
              100% Zero Financial Data Storage Guarantee (PCI-DSS &amp; RBI Aligned)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
            <strong>VaultWorld Store never collects, captures, views, or stores your sensitive banking or payment card details.</strong> All transactions (UPI, Credit/Debit Cards, Net Banking) are conducted through bank-grade 256-bit encrypted sessions directly on the servers of Reserve Bank of India (RBI) authorized payment aggregators (Cashfree Payments, Razorpay Software, PayU India). Your card CVV, expiry dates, net banking passwords, and UPI PINs are processed exclusively on certified, PCI-DSS Level 1 compliant infrastructure.
          </p>
        </div>

        {/* Main Content Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-8 text-sm text-[#475569] font-normal leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-700 font-black text-xs flex items-center justify-center">1</span>
              <span>Introduction &amp; Regulatory Framework</span>
            </h2>
            <p>
              At <strong>VaultWorld Store</strong> (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), protecting the personal privacy and data of our customers and visitors (&quot;you&quot;, &quot;user&quot;, &quot;buyer&quot;) is a paramount priority. This Privacy Policy sets forth our practices regarding the collection, storage, use, and disclosure of information when you interact with our website (<strong>vaultworld.shop</strong>).
            </p>
            <p>
              This document is prepared in strict accordance with:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium text-xs sm:text-sm">
              <li>Section 43A of the Information Technology Act, 2000;</li>
              <li>Rule 4 of the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011;</li>
              <li>The Digital Personal Data Protection Act, 2023 (DPDP Act); and</li>
              <li>Relevant regulatory circulars on digital transactions issued by the Reserve Bank of India (RBI).</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-700 font-black text-xs flex items-center justify-center">2</span>
              <span>Information We Collect</span>
            </h2>
            <p>
              We adhere strictly to the principle of <strong>data minimization</strong>. We collect only the minimal information strictly required to process your order and fulfill your digital Google Drive access:
            </p>
            
            <div className="space-y-3 pt-1">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="font-extrabold text-slate-900 block text-xs sm:text-sm">
                  A. Personal Contact Information (Provided by you during checkout)
                </span>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                  <li><strong>Full Name:</strong> To identify the customer and address transaction invoices.</li>
                  <li><strong>Gmail / Email Address:</strong> Essential to grant instant permission access to the purchased Google Drive bundle folders and dispatch order confirmation emails.</li>
                  <li><strong>WhatsApp / Phone Number:</strong> Used to dispatch automated order status receipts, link delivery confirmations, and provide instant customer support.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="font-extrabold text-slate-900 block text-xs sm:text-sm">
                  B. Technical &amp; Device Information (Automatically collected)
                </span>
                <p className="text-xs text-slate-600">
                  When you browse our store, our servers automatically log certain non-sensitive technical data, including your Internet Protocol (IP) address, operating system, browser type and version, language preferences, referring URLs, and device identifiers. This data is utilized solely to maintain store security, prevent fraudulent transactions, and analyze system performance.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-1">
                <span className="font-extrabold text-rose-950 block text-xs sm:text-sm flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>C. Information We DO NOT Collect</span>
                </span>
                <p className="text-xs text-rose-900 font-medium">
                  We explicitly do NOT capture, store, or have access to your bank account logins, debit or credit card CVV numbers, OTPs, or UPI security PINs. All financial checkout flows occur on the secure iframe or hosted gateway pages of authorized payment aggregators.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-700 font-black text-xs flex items-center justify-center">3</span>
              <span>How We Use Your Information</span>
            </h2>
            <p>
              The information we collect is processed for the following legitimate business purposes:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
              <li><strong>Digital Order Fulfillment:</strong> Granting lifetime access to the purchased video reels bundle via Google Drive cloud folders.</li>
              <li><strong>Transaction Communications:</strong> Dispatching automated invoice receipts, order numbers, and download verification links via email and WhatsApp.</li>
              <li><strong>Customer Support:</strong> Assisting you with download link recovery, file questions, or technical inquiries raised through our helpline.</li>
              <li><strong>Security &amp; Fraud Prevention:</strong> Detecting and mitigating unauthorized payment attempts, abusive bots, or malicious activity.</li>
              <li><strong>Legal Compliance:</strong> Maintaining accurate financial transaction records required under Indian tax, accounting, and e-commerce laws.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-700 font-black text-xs flex items-center justify-center">4</span>
              <span>Sharing of Information &amp; Third-Party Service Providers</span>
            </h2>
            <p>
              <strong>We do not sell, rent, lease, or monetize your personal data.</strong> Your personal data is never disclosed to commercial data brokers. We share your data solely with vetted, industry-standard service providers strictly as necessary to operate our store:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block font-bold">Payment Aggregators</strong>
                Cashfree Payments, Razorpay Software, and PayU Payments receive transaction tokens and order IDs to process payments securely.
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block font-bold">Cloud Infrastructure</strong>
                Google Cloud Platform &amp; Firebase provide encrypted database storage and Google Drive digital file hosting.
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block font-bold">Messaging Providers</strong>
                Official WhatsApp Business APIs and transactional email gateways to deliver your order download links.
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block font-bold">Statutory Authorities</strong>
                Disclosed only when legally mandated under court order, subpoena, or Indian law enforcement directives.
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="cookies" className="space-y-3 scroll-mt-24">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-700 font-black text-xs flex items-center justify-center">5</span>
              <span>Cookies &amp; Tracking Technologies</span>
            </h2>
            <p>
              VaultWorld Store uses standard browser cookies, local storage, and analytical tags to provide a seamless user experience:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
              <li><strong>Essential Session Cookies:</strong> Maintain your cart selections, applied discount codes, and checkout state.</li>
              <li><strong>Analytical Cookies:</strong> Help us measure store visits, popular bundle categories, and page loading speeds (e.g., Google Analytics).</li>
              <li><strong>Marketing &amp; Attribution Pixels:</strong> Verify advertising effectiveness and prevent duplicate click attribution (e.g., Meta Pixel).</li>
            </ul>
            <p className="text-xs text-slate-500">
              You can choose to disable or block cookies through your individual browser settings; however, disabling essential session cookies may impair the functionality of the cart and checkout pages.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-700 font-black text-xs flex items-center justify-center">6</span>
              <span>Data Retention &amp; Security Measures</span>
            </h2>
            <p>
              We implement comprehensive technical and organizational security measures to protect your personal information:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
              <li><strong>Encryption in Transit:</strong> 256-bit Secure Socket Layer (SSL/TLS) encryption across all endpoints of our website.</li>
              <li><strong>Database Protection:</strong> Customer records in Firestore are shielded by strict role-based access rules preventing public read or write access.</li>
              <li><strong>Retention Period:</strong> Personal customer order records are retained only for the duration required to maintain your lifetime download access and satisfy mandatory accounting audits under Indian tax laws.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-700 font-black text-xs flex items-center justify-center">7</span>
              <span>Your Rights under the DPDP Act, 2023</span>
            </h2>
            <p>
              Under Indian data protection laws, you possess the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
              <li><strong>Right to Access:</strong> You may request a summary of the personal data we hold regarding your purchases.</li>
              <li><strong>Right to Correction &amp; Rectification:</strong> You may request updating inaccurate contact details or updating your delivery Gmail address.</li>
              <li><strong>Right to Erasure:</strong> You may request the deletion of your personal data from our active customer records, subject to retention required for accounting compliance.</li>
              <li><strong>Right to Withdraw Consent:</strong> You may withdraw your consent for promotional updates at any time.</li>
            </ul>
            <p className="text-xs text-slate-500">
              To exercise any of these rights, please contact our Grievance Officer via email with your registered Order ID.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-700 font-black text-xs flex items-center justify-center">8</span>
              <span>Protection of Minors</span>
            </h2>
            <p>
              VaultWorld Store is not directed towards children under the age of 18. We do not knowingly collect personal data from minors. If you are a parent or guardian and become aware that your child has provided us with personal data without your consent, please contact us immediately to have the information expunged.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3 pt-4 border-t border-slate-200">
            <h2 className="text-lg sm:text-xl font-bold text-[#182247] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-700 font-black text-xs flex items-center justify-center">9</span>
              <span>Grievance Officer &amp; Regulatory Redressal</span>
            </h2>
            <p>
              In compliance with the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023, the contact details of our designated Grievance Redressal Officer are provided below:
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
            <Link href="/refund-policy" className="hover:text-amber-600 transition-colors">
              Refund Policy
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
