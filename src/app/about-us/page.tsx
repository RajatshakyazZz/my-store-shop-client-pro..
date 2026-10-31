'use client';

import React from 'react';
import Link from 'next/link';
import { PlaySquare, CheckCircle, ShieldCheck, Zap, Mail, MessageSquare, Clock } from 'lucide-react';
import { useStoreSettings } from '@/context/StoreSettingsContext';

export default function AboutUsPage() {
  const { settings } = useStoreSettings();
  const supportEmail = settings?.supportEmail || 'ztoredigital@gmail.com';
  return (
    <div className="py-12 sm:py-20 bg-slate-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center space-y-4">
          <span className="text-xs font-black uppercase text-red-600 tracking-wider">
            WHO WE ARE
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Empowering Modern Creators &amp; Digital Entrepreneurs
          </h1>
          <p className="text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            {settings?.storeName || 'Ztore Digital'} was built with one goal: To eliminate the hardest bottleneck for content creators — producing dozens of high-retention, high-converting video clips daily.
          </p>
        </div>

        <div className="rounded-3xl p-8 sm:p-12 bg-white border border-slate-200/90 shadow-sm space-y-6">
          <h2 className="text-2xl font-black text-slate-950">Why Choose {settings?.storeName || 'Ztore Digital'}?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-slate-600 font-medium">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200/60 text-red-700 flex items-center justify-center font-black">
                1
              </div>
              <h3 className="font-extrabold text-slate-950 text-base">100% Watermark Free</h3>
              <p>Every video is rendered clean without logos or credits, ready for you to add your brand handle.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200/60 text-red-700 flex items-center justify-center font-black">
                2
              </div>
              <h3 className="font-extrabold text-slate-950 text-base">Algorithm Optimized</h3>
              <p>Fast-paced hooks, high visual contrast, and viral audio synchronization to trigger explore page recommendations.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-black">
                3
              </div>
              <h3 className="font-extrabold text-slate-950 text-base">Instant Cloud Access</h3>
              <p>Direct Google Drive delivery in 1-click right after payment. No waiting, no manual file approvals.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-center font-black">
                4
              </div>
              <h3 className="font-extrabold text-slate-950 text-base">Reseller Rights (MRR)</h3>
              <p>Commercial rights available on all packs. Start your own digital video reselling business effortlessly.</p>
            </div>
          </div>
        </div>

        {/* Official Contact & Support Desk */}
        <div className="rounded-3xl p-8 sm:p-10 bg-white border border-slate-200/90 shadow-sm space-y-6">
          <div className="text-center sm:text-left space-y-1">
            <span className="text-xs font-black uppercase text-red-600 tracking-wider">
              HELP &amp; INQUIRIES
            </span>
            <h2 className="text-2xl font-black text-slate-950">Official Support Desk</h2>
            <p className="text-sm text-slate-500 font-medium">
              Have questions before buying or need assistance with your existing bundle order? We are here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Working & Support Hours Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-950">Working &amp; Support Hours</h3>
                  <p className="text-xs font-semibold text-slate-500">Active Monday – Sunday</p>
                </div>
              </div>
              <p className="font-black text-base text-slate-950 font-mono tracking-tight">
                10:00 AM – 8:00 PM IST
              </p>
              <div className="pt-1">
                <Link
                  href="/contact-us"
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Contact Customer Support</span>
                </Link>
              </div>
            </div>

            {/* Email Support Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-950">Official Support Email</h3>
                  <p className="text-xs font-semibold text-slate-500">2–4 hours average response</p>
                </div>
              </div>
              <p className="font-bold text-xs sm:text-sm text-slate-950 break-all font-mono">
                {supportEmail}
              </p>
              <div className="pt-1">
                <a
                  href={`mailto:${supportEmail}`}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-sm shadow-xl shadow-red-500/25 cursor-pointer"
          >
            <span>Explore All 129+ Bundles Now</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
