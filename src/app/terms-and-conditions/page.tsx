import React from 'react';
import PolicyContactInfo from '@/components/PolicyContactInfo';

export default function TermsPage() {
  return (
    <div className="py-12 sm:py-20 bg-[#faf9ff]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h1 className="text-3xl sm:text-4xl font-black text-[#182247]">Terms & Conditions</h1>
        
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6 text-sm text-[#6e7696] font-medium leading-relaxed">
          <p>
            Last Updated: October 2026
          </p>

          <h2 className="text-lg font-bold text-[#182247]">1. License & Usage Rights</h2>
          <p>
            When purchasing a bundle on ZTORE, you are granted one of two licenses depending on your selection at checkout:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-slate-800">Personal Use License:</strong> You are granted a non-exclusive license to post, edit, add music/voiceovers, and publish the video reels across your own personal or commercial social media profiles (Instagram, YouTube, Facebook, TikTok). You may not resell the raw source files.
            </li>
            <li>
              <strong className="text-slate-800">Reseller Rights License (MRR / PLR):</strong> You are granted full master resell rights to distribute, package, and resell the digital bundle files directly to third parties and retain 100% of the proceeds.
            </li>
          </ul>

          <h2 className="text-lg font-bold text-[#182247]">2. Digital Delivery</h2>
          <p>
            All products are delivered digitally via cloud download links immediately upon successful UPI or card payment. You will also receive an automated confirmation email.
          </p>

          <h2 className="text-lg font-bold text-[#182247]">3. Contact</h2>
          <p>
            For any queries, please reach out to our official support desk:
            <br />
            <PolicyContactInfo />
          </p>
        </div>
      </div>
    </div>
  );
}
