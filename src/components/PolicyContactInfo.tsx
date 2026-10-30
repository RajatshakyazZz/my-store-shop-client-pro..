'use client';

import React from 'react';
import { Mail, Phone, Clock, MapPin, ShieldCheck, UserCheck } from 'lucide-react';
import { useStoreSettings } from '@/context/StoreSettingsContext';

export default function PolicyContactInfo() {
  const { settings } = useStoreSettings();
  const storeName = settings?.storeName || 'Ztore Digital';
  const supportEmail = settings?.supportEmail || 'support.ztore.shop@gmail.com';
  const supportPhone = settings?.supportPhone || settings?.supportWhatsapp || '+91 8051017331';

  return (
    <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200/90 p-5 sm:p-6 text-slate-700 text-xs sm:text-sm space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-200/80">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <h4 className="font-black text-slate-900 text-sm sm:text-base">
          Official Merchant &amp; Grievance Redressal Desk
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
            <span className="font-black text-xs">🏢</span>
          </div>
          <div>
            <span className="font-bold text-slate-900 block">Trade / Platform Name</span>
            <span className="text-slate-600">{storeName}</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
            <Mail className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block">Customer Support Email</span>
            <a
              href={`mailto:${supportEmail}`}
              className="text-amber-700 hover:text-amber-800 font-semibold underline underline-offset-2 break-all"
            >
              {supportEmail}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
            <Phone className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block">Customer Helpline / WhatsApp</span>
            <span className="text-slate-600 font-semibold">{supportPhone}</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block">Operating Hours</span>
            <span className="text-slate-600">Monday – Sunday, 10:00 AM – 8:00 PM IST</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block">Country of Operation</span>
            <span className="text-slate-600">India (Digital Goods &amp; Services)</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
            <UserCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block">Designated Grievance Officer</span>
            <span className="text-slate-600">Grievance Redressal Cell ({storeName})</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-200/80 text-[11px] text-slate-500 leading-relaxed">
        <strong>Statutory Compliance Note:</strong> In accordance with the Information Technology Act, 2000 and the Consumer Protection (E-Commerce) Rules, 2020, all customer inquiries and grievance requests are acknowledged within 24 to 48 hours and resolved within a maximum of 15 business days.
      </div>
    </div>
  );
}
