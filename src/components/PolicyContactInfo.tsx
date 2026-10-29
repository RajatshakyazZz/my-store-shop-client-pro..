'use client';

import React from 'react';
import { useStoreSettings } from '@/context/StoreSettingsContext';

export default function PolicyContactInfo() {
  const { settings } = useStoreSettings();
  const supportEmail = settings?.supportEmail || 'ztoredigital@gmail.com';
  const supportPhone = settings?.supportPhone || settings?.supportWhatsapp || '+91 9072850100';

  return (
    <>
      Email: <strong className="text-slate-800">{supportEmail}</strong>
      <br />
      Phone: <strong className="text-slate-800">{supportPhone}</strong>
    </>
  );
}
