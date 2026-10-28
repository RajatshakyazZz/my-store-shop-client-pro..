import React from 'react';
import PolicyContactInfo from '@/components/PolicyContactInfo';

export default function RefundPolicyPage() {
  return (
    <div className="py-12 sm:py-20 bg-[#faf9ff]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h1 className="text-3xl sm:text-4xl font-black text-[#182247]">Refund & Cancellation Policy</h1>
        
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6 text-sm text-[#6e7696] font-medium leading-relaxed">
          <p>
            Last Updated: October 2026
          </p>

          <h2 className="text-lg font-bold text-[#182247]">1. Nature of Digital Products</h2>
          <p>
            All products sold on VaultWorld Store are downloadable digital goods (video reels files, bundles, and media packs) delivered instantaneously via cloud storage links (Google Drive).
          </p>

          <h2 className="text-lg font-bold text-[#182247]">2. Refund Policy</h2>
          <p>
            Because digital files cannot be physically returned once access has been granted, all purchases are generally final. However, we strive for 100% customer satisfaction. You are entitled to a replacement link or full refund under the following conditions:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>The Google Drive link is completely inaccessible or corrupt, and our support team cannot restore access within 24 hours.</li>
            <li>You were charged twice for the same transaction due to a payment gateway glitch.</li>
          </ul>

          <h2 className="text-lg font-bold text-[#182247]">3. How to Request Assistance</h2>
          <p>
            If you encounter any issues accessing your bundle, please contact our support desk with your Order ID:
            <br />
            <PolicyContactInfo />
          </p>
        </div>
      </div>
    </div>
  );
}
