'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, MessageSquare, Clock, FolderOpen, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStoreSettings } from '@/context/StoreSettingsContext';

export default function ContactUsPage() {
  const { settings } = useStoreSettings();

  const supportEmail = settings?.supportEmail || 'support.vaultworld.shop@gmail.com';
  const supportPhone = settings?.supportPhone || settings?.supportWhatsapp || '+91 8051017331';
  const rawDigits = supportPhone.replace(/\D/g, '');
  const cleanPhone = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits;

  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-[85vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-[11px] font-black uppercase text-amber-700 tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>OFFICIAL SUPPORT HELPLINE</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Contact Customer Support
          </h1>
          <p className="text-sm text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
            Need help with your Google Drive download link, payment verification, or bundle access? Our support desk responds within 2–4 hours.
          </p>
        </div>

        {/* 3 Contact Info Cards (Email, WhatsApp/Phone, Working Hours) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Email Us */}
          <a
            href={`mailto:${supportEmail}`}
            className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-amber-400/50 transition-all text-center space-y-2.5 block group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Email Us</h3>
            <p className="text-xs font-semibold text-slate-600 break-all">
              {supportEmail}
            </p>
          </a>

          {/* WhatsApp Chat / Phone */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-amber-400/50 transition-all text-center space-y-2.5 block group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Phone &amp; WhatsApp</h3>
            <p className="text-sm font-black text-slate-900 font-mono tracking-tight">{supportPhone}</p>
            <div className="flex items-center justify-center gap-2 pt-1.5">
              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi! I need help regarding ${settings.storeName || 'VaultWorld Store'}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black transition-colors shadow-sm"
              >
                WhatsApp
              </a>
              <a
                href={`tel:${supportPhone}`}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-black transition-colors shadow-sm"
              >
                Call
              </a>
            </div>
          </div>

          {/* Working Hours */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm text-center space-y-2.5">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Working Hours</h3>
            <p className="text-xs font-semibold text-slate-600">10:00 AM – 8:00 PM IST</p>
          </div>
        </div>

        {/* Instant Self-Service Order Portal Card */}
        <div className="rounded-3xl p-7 sm:p-8 bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center sm:items-start gap-4 text-center sm:text-left flex-col sm:flex-row">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 text-amber-700 flex items-center justify-center shrink-0">
              <FolderOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Looking for Your Purchased Reels Download Link?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                You can instantly access all your purchased Google Drive folders anytime using your checkout email.
              </p>
            </div>
          </div>

          <Link
            href="/my-order"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-xs flex items-center gap-2 shrink-0 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
          >
            <span>My Orders</span>
            <ArrowRight className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          </Link>
        </div>

      </div>
    </div>
  );
}
