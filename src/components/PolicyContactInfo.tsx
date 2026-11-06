'use client';

import React from 'react';
import { Mail, Phone, Clock, MapPin, ShieldCheck, UserCheck } from 'lucide-react';
import { useStoreSettings } from '@/context/StoreSettingsContext';

export default function PolicyContactInfo() {
  const { settings } = useStoreSettings();
  const storeName = settings?.storeName || 'CreatorMint';
  const supportEmail = settings?.supportEmail || 'smoothsalesin@gmail.com';
  const supportPhone = settings?.supportPhone || settings?.supportWhatsapp || '+91 8129797720';

  return (
    <div className="mt-6 rounded-2xl bg-canvas-50 border border-canvas-200/90 p-5 sm:p-6 text-ink-600 text-xs sm:text-sm space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-canvas-200/80">
        <ShieldCheck className="w-4 h-4 text-leaf-600 shrink-0" />
        <h4 className="font-black text-ink text-sm sm:text-base">
          Official Merchant &amp; Grievance Redressal Desk
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-mint-500/10 text-leaf-700 flex items-center justify-center shrink-0 mt-0.5">
            <span className="font-black text-xs">🏢</span>
          </div>
          <div>
            <span className="font-bold text-ink block">Trade / Platform Name</span>
            <span className="text-ink-500">{storeName}</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-mint-500/10 text-leaf-700 flex items-center justify-center shrink-0 mt-0.5">
            <Mail className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-ink block">Customer Support Email</span>
            <a
              href={`mailto:${supportEmail}`}
              className="text-leaf-700 hover:text-leaf-800 font-semibold underline underline-offset-2 break-all"
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
            <span className="font-bold text-ink block">Customer Helpline / WhatsApp</span>
            <span className="text-ink-500 font-semibold">{supportPhone}</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-mint-500/10 text-leaf-700 flex items-center justify-center shrink-0 mt-0.5">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-ink block">Operating Hours</span>
            <span className="text-ink-500">Monday – Sunday, 10:00 AM – 8:00 PM IST</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-mint-500/10 text-leaf-700 flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-ink block">Operational / Grievance Address</span>
            <span className="text-ink-500">
              {(settings as any)?.operatingAddress || (settings as any)?.registeredAddress || 'CreatorMint Support Desk, India'}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-mint-500/10 text-leaf-700 flex items-center justify-center shrink-0 mt-0.5">
            <UserCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-ink block">Designated Grievance Officer</span>
            <span className="text-ink-500">Grievance Redressal Cell ({storeName})</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-canvas-200/80 text-[11px] text-ink-400 leading-relaxed">
        <strong>Statutory Compliance Note:</strong> In accordance with the Information Technology Act, 2000 and the Consumer Protection (E-Commerce) Rules, 2020, all customer inquiries and grievance requests are acknowledged within 24 to 48 hours and resolved within a maximum of 15 business days.
      </div>
    </div>
  );
}
