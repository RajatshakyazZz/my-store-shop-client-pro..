import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, RefreshCw, Server, HelpCircle, Mail, Phone, FileText } from 'lucide-react';
import PolicyContactInfo from '@/components/PolicyContactInfo';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ztore.shop').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Privacy Policy | Ztore Digital - Secure Payment & Data Protection',
  description:
    'Official Privacy Policy for Ztore Digital. Understand how your personal information and payments are securely collected, processed, and protected under IT Act 2000.',
  alternates: {
    canonical: `${siteUrl}/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Badge & Title */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-black uppercase text-emerald-700 tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>TRANSPARENT & SECURE DATA PRACTICES</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto">
            At <strong className="text-slate-900">Ztore Digital</strong>, we respect your confidentiality. This policy outlines our data collection, handling, and security protocols in compliance with the Information Technology Act, 2000 and applicable digital commerce guidelines.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 pt-1">
            <span>Last Updated: October 30, 2026</span>
            <span>•</span>
            <span>Effective Date: Immediate</span>
          </div>
        </div>

        {/* Highlight Summary Grid for Compliance Reviewers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">256-Bit SSL Secured</h2>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Payment data processed exclusively through PCI-DSS Level 1 compliant gateways.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">No Data Selling</h2>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">We never sell, rent, or monetize your contact or billing information to third parties.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">Instant Delivery</h2>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Email and phone are collected solely for cloud delivery and customer support.</p>
            </div>
          </div>
        </div>

        {/* Main Document Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-8 text-sm text-slate-600 font-medium leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs flex items-center justify-center font-black">1</span>
              <span>Overview & Business Identity</span>
            </h2>
            <p>
              This Privacy Policy applies to the website <strong className="text-slate-900">Ztore Digital</strong> (<a href={siteUrl} className="text-red-600 underline hover:text-red-700">{siteUrl}</a>). Ztore Digital is an Indian e-commerce platform specializing in premium downloadable digital content, video bundles, and creator templates. By browsing this store, placing an order, or using our support desk, you signify acceptance of the data practices described herein.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs flex items-center justify-center font-black">2</span>
              <span>Information We Collect</span>
            </h2>
            <p>
              To fulfill your digital purchases and provide immediate access to cloud files, we collect only the minimum required information:
            </p>
            <div className="space-y-2.5 pt-1">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <strong className="text-slate-900 block font-bold">A. Personal Identification Data:</strong>
                <p className="text-xs text-slate-600 mt-0.5">
                  Full name, email address (preferably Google Account email for Google Drive file permissions), and contact phone number.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <strong className="text-slate-900 block font-bold">B. Transaction & Order Details:</strong>
                <p className="text-xs text-slate-600 mt-0.5">
                  Order ID, products purchased, order timestamp, gross amount paid, and payment reference numbers generated by the payment processor (e.g. Razorpay Payment ID or Cashfree Order ID).
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <strong className="text-slate-900 block font-bold">C. Technical & Diagnostic Data:</strong>
                <p className="text-xs text-slate-600 mt-0.5">
                  IP address, browser type, device information, and interaction logs captured solely for cybersecurity, fraud prevention, and session maintenance.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs flex items-center justify-center font-black">3</span>
              <span>How We Use Your Information</span>
            </h2>
            <p>Your data is used strictly for legitimate business operations:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>Generating and transmitting instant Google Drive cloud download links.</li>
              <li>Sending automated order receipts, tax invoices, and verification SMS/WhatsApp updates.</li>
              <li>Responding to customer care inquiries and resolving download issues.</li>
              <li>Preventing unauthorized transactions, fraud, or duplicate payment attempts.</li>
              <li>Complying with statutory accounting and tax regulations in India.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs flex items-center justify-center font-black">4</span>
              <span>Payment Security & Gateway Compliance</span>
            </h2>
            <p>
              <strong className="text-slate-900">We do NOT store or process sensitive banking credentials.</strong>
            </p>
            <p>
              All online monetary transactions (UPI, Credit/Debit Cards, Net Banking, and Wallets) are executed through RBI-authorized payment aggregators—principally <strong className="text-slate-900">Razorpay Software Private Limited</strong> and <strong className="text-slate-900">Cashfree Payments India Private Limited</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>All card and UPI numbers are encrypted via 256-bit TLS (Transport Layer Security).</li>
              <li>Processors maintain rigorous PCI-DSS Level 1 compliance standards.</li>
              <li>Our servers only receive transaction tokens confirming success or failure.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs flex items-center justify-center font-black">5</span>
              <span>Cookies & Web Analytics</span>
            </h2>
            <p>
              We use necessary first-party cookies to manage shopping cart sessions, remember applied promotional coupons, and prevent CSRF attacks. Anonymous analytics may be utilized to measure overall page load performance and optimize customer checkout speed. You can disable non-essential cookies via your web browser settings.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs flex items-center justify-center font-black">6</span>
              <span>Data Retention & Security Safeguards</span>
            </h2>
            <p>
              We enforce administrative, technical, and physical security measures to protect customer records stored in our encrypted cloud databases (Google Cloud Firebase). Order records are preserved for the minimum period legally required for auditing, tax assessment, and dispute resolution.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs flex items-center justify-center font-black">7</span>
              <span>User Rights & Opt-Out</span>
            </h2>
            <p>
              As a user, you have the right to request a copy of the personal details stored about your purchases or ask for deletion of your non-transactional profile data by writing to our Grievance Desk.
            </p>
          </section>

          {/* Grievance & Contact Section Required by Razorpay & Cashfree */}
          <section className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs flex items-center justify-center font-black">8</span>
              <span>Grievance Officer & Official Contact Details</span>
            </h2>
            <p>
              In accordance with the Information Technology Act, 2000 and rules made thereunder, any queries, clarifications, or grievances regarding this Privacy Policy should be addressed to our appointed Grievance Officer:
            </p>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-slate-700">
              <p><strong className="text-slate-900">Platform:</strong> Ztore Digital</p>
              <p><strong className="text-slate-900">Grievance Desk:</strong> Customer Support & Compliance Team</p>
              <p><PolicyContactInfo /></p>
              <p><strong className="text-slate-900">Operating Hours:</strong> 10:00 AM – 8:00 PM IST (Monday to Sunday)</p>
              <p><strong className="text-slate-900">Response SLA:</strong> Inquiries acknowledged within 24 business hours.</p>
            </div>
          </section>

          {/* Footer Navigation Strip */}
          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-500">
            <div className="flex items-center gap-4">
              <Link href="/terms-and-conditions" className="hover:text-red-600 transition-colors">
                Terms & Conditions &rarr;
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
