'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Clock, FolderOpen, ArrowRight, ShieldCheck, MessageCircle } from 'lucide-react';
import { useStoreSettings } from '@/context/StoreSettingsContext';

export default function ContactUsPage() {
  const { settings } = useStoreSettings();

  const supportEmail = settings?.supportEmail || 'smoothsalesin@gmail.com';
  const supportPhone = settings?.supportPhone || settings?.supportWhatsapp || '+91 8129797720';
  const rawWa = supportPhone.replace(/[^0-9]/g, '');
  const cleanWa = rawWa.length === 10 ? '91' + rawWa : rawWa;

  return (
    <div className="py-12 sm:py-20 bg-canvas-50 min-h-[85vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint-500/10 border border-mint-500/25 text-[11px] font-black uppercase text-leaf-700 tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-leaf-600" />
            <span>OFFICIAL SUPPORT HELPLINE</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
            Contact Customer Support
          </h1>
          <p className="text-sm text-ink-500 font-medium max-w-md mx-auto leading-relaxed">
            Need help with your Google Drive download link, payment verification, or bundle access? Our support desk is live 7 days a week.
          </p>
        </div>

        {/* 4 Contact Info Cards (Email, WhatsApp, Instant Orders, Working Hours) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Email Us */}
          <a
            href={`mailto:${supportEmail}`}
            className="p-5 rounded-3xl bg-white border border-canvas-200/90 shadow-sm hover:shadow-md hover:border-leaf-400/50 transition-all text-center space-y-2.5 block group"
          >
            <div className="w-11 h-11 rounded-2xl bg-leaf-50 text-leaf-600 border border-leaf-200/60 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-ink">Email Support</h3>
            <p className="text-xs font-semibold text-ink-500 break-all">
              {supportEmail}
            </p>
            <p className="text-[10px] text-leaf-600 font-bold pt-1">Direct Email Assistance</p>
          </a>

          {/* WhatsApp Support */}
          <a
            href={`https://wa.me/${cleanWa}?text=${encodeURIComponent('Hi CreatorMint Support! I need quick assistance regarding my order.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-3xl bg-white border border-canvas-200/90 shadow-sm hover:shadow-md hover:border-mint-500/50 transition-all text-center space-y-2.5 block group"
          >
            <div className="w-11 h-11 rounded-2xl bg-mint-50 text-leaf-600 border border-mint-200/60 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-ink">WhatsApp Help</h3>
            <p className="text-xs font-semibold text-ink-500">
              {supportPhone}
            </p>
            <p className="text-[10px] text-leaf-600 font-bold pt-1">Chat on WhatsApp</p>
          </a>

          {/* Instant Order Access */}
          <Link
            href="/my-order"
            className="p-5 rounded-3xl bg-white border border-canvas-200/90 shadow-sm hover:shadow-md hover:border-leaf-400/50 transition-all text-center space-y-2.5 block group"
          >
            <div className="w-11 h-11 rounded-2xl bg-leaf-50 text-leaf-600 border border-leaf-200/60 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
              <FolderOpen className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-ink">Order Downloads</h3>
            <p className="text-xs font-semibold text-ink-500">
              Google Drive Access
            </p>
            <p className="text-[10px] text-leaf-600 font-bold pt-1">Self-Service Portal</p>
          </Link>

          {/* Working Hours */}
          <div className="p-5 rounded-3xl bg-white border border-canvas-200/90 shadow-sm text-center space-y-2.5">
            <div className="w-11 h-11 rounded-2xl bg-canvas text-ink-600 border border-canvas-200 flex items-center justify-center mx-auto">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-ink">Working Hours</h3>
            <p className="text-xs font-semibold text-ink-500">10:00 AM – 8:00 PM</p>
            <p className="text-[10px] text-ink-300 font-medium pt-1">Monday to Sunday IST</p>
          </div>
        </div>

        {/* Instant Self-Service Order Portal Card */}
        <div className="rounded-3xl p-7 sm:p-8 bg-white border border-canvas-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center sm:items-start gap-4 text-center sm:text-left flex-col sm:flex-row">
            <div className="w-12 h-12 rounded-2xl bg-leaf-50 border border-leaf-200/60 text-leaf-700 flex items-center justify-center shrink-0">
              <FolderOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-ink">
                Looking for Your Purchased Reels Download Link?
              </h2>
              <p className="text-xs sm:text-sm text-ink-500 mt-1 font-medium">
                You can instantly access all your purchased Google Drive folders anytime using your checkout email.
              </p>
            </div>
          </div>

          <Link
            href="/my-order"
            className="px-5 py-3 rounded-xl bg-mint-500 hover:bg-mint-300 text-ink font-black text-xs flex items-center gap-2 shrink-0 shadow-md shadow-ink/10 active:scale-95 transition-all"
          >
            <span>My Orders</span>
            <ArrowRight className="w-4 h-4 text-ink stroke-[2.5]" />
          </Link>
        </div>

      </div>
    </div>
  );
}
