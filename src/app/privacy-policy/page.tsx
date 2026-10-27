import React from 'react';
import { Metadata } from 'next';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://vaultworld.shop').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Privacy Policy | VaultWorld Store',
  description: 'Privacy Policy for VaultWorld Store. Learn how we handle your information securely.',
  alternates: {
    canonical: `${siteUrl}/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 sm:py-20 bg-[#faf9ff]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h1 className="text-3xl sm:text-4xl font-black text-[#182247]">Privacy Policy</h1>
        
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6 text-sm text-[#6e7696] font-medium leading-relaxed">
          <p>
            Last Updated: October 2026
          </p>

          <h2 className="text-lg font-bold text-[#182247]">1. Information We Collect</h2>
          <p>
            When you purchase a digital reels bundle from VaultWorld Store, we collect only the necessary details required to deliver your order:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-slate-800">Full Name:</strong> To address and identify your order.</li>
            <li><strong className="text-slate-800">Email Address (@gmail.com):</strong> To provide instant access to the Google Drive digital files.</li>
            <li><strong className="text-slate-800">Phone Number:</strong> For WhatsApp-based order confirmation and customer support.</li>
          </ul>

          <h2 className="text-lg font-bold text-[#182247]">2. Payment Processing</h2>
          <p>
            We do not store your credit card, debit card, or UPI PIN details. All payments are securely processed by RBI-licensed payment gateways (PayU Payments India) using 256-bit SSL encryption.
          </p>

          <h2 className="text-lg font-bold text-[#182247]">3. Data Security & Third-Party Sharing</h2>
          <p>
            We respect your privacy and will never sell, rent, or trade your personal information to third parties. We use industry-standard security protocols to safeguard your personal data.
          </p>

          <h2 className="text-lg font-bold text-[#182247]">4. Contact Us</h2>
          <p>
            If you have questions regarding this Privacy Policy, please contact us at:
            <br />
            Email: <strong className="text-slate-800">support.vaultworld.shop@gmail.com</strong>
            <br />
            Phone: <strong className="text-slate-800">+91 8051017331</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
