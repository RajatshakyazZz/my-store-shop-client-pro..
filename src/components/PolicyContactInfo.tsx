'use client';

import React from 'react';
import { useStoreSettings } from '@/context/StoreSettingsContext';

export default function PolicyContactInfo() {
  const { settings } = useStoreSettings();
  const supportEmail = settings?.supportEmail || 'support.vaultworld.shop@gmail.com';
  const supportPhone = settings?.supportPhone || settings?.supportWhatsapp || '+91 8051017331';

  return (
    <>
      Email: <strong className="text-slate-800">{supportEmail}</strong>
      <br />
      Phone: <strong className="text-slate-800">{supportPhone}</strong>
    </>
  );
}
