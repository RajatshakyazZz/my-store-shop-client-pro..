'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface SiteModeData {
  mode: 'LIVE' | 'MAINTENANCE';
  maintenance_message: string;
  bypass_ips: string[];
  last_updated?: string;
}

export interface StoreSettings {
  storeName: string;
  ownerName?: string;
  tagline: string;
  supportEmail: string;
  supportPhone?: string;
  supportWhatsapp?: string;
  currency: string;
  currencySymbol: string;
  logoUrl?: string;
  primaryColor?: string;
  whatsappButtonEnabled?: boolean;
  whatsappDefaultMessage?: string;
  whatsappPopupText?: string;
  siteMode?: SiteModeData;
}

const DEFAULT_SITE_MODE: SiteModeData = {
  mode: 'LIVE',
  maintenance_message: 'Our store is undergoing scheduled performance upgrades. We will be back online shortly!',
  bypass_ips: ['127.0.0.1'],
};

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'Ztore Digital',
  ownerName: 'Ztore Digital Team',
  tagline: 'Everything You Need, All in One Place.',
  supportEmail: 'ztoredigital@gmail.com',
  supportPhone: '+91 9072850100',
  supportWhatsapp: '+91 9072850100',
  currency: 'INR',
  currencySymbol: '₹',
  whatsappButtonEnabled: true,
  whatsappDefaultMessage: 'Hi Ztore Digital Support! I need quick help regarding my Ztore Digital order.',
  whatsappPopupText: 'Need help? Chat on WhatsApp',
  siteMode: DEFAULT_SITE_MODE,
};

function sanitizeStoreName(name?: string, fallback = 'Ztore Digital'): string {
  if (!name || !name.trim()) return fallback;
  if (/reels\s*bundles?/i.test(name) || /digonest/i.test(name) || /vaultzet/i.test(name) || /vaultworld/i.test(name)) {
    return 'Ztore Digital';
  }
  return name.trim();
}

function sanitizeTagline(tagline?: string, fallback = 'Everything You Need, All in One Place.'): string {
  if (!tagline || !tagline.trim()) return fallback;
  if (/vaultzet/i.test(tagline) || /categories store/i.test(tagline)) {
    return 'Everything You Need, All in One Place.';
  }
  return tagline.trim();
}

function sanitizeLogoUrl(url?: string, fallback = '/logo.webp?v=2'): string {
  if (!url || !url.trim()) return fallback;
  if (/vaultzet/i.test(url)) {
    return '/logo.webp?v=2';
  }
  return url.trim();
}

function sanitizeEmail(email?: string, fallback = 'ztoredigital@gmail.com'): string {
  if (!email || !email.trim()) return fallback;
  if (
    /reelsbundles/i.test(email) ||
    /digonest/i.test(email) ||
    /rajattracozegaming/i.test(email) ||
    /vaultworld/i.test(email)
  ) {
    return fallback;
  }
  return email.trim();
}

function sanitizePhone(phone?: string, fallback = '+91 9072850100'): string {
  if (!phone || !phone.trim()) return fallback;
  if (/98765\s*43210/.test(phone) || /8051017331/.test(phone) || /9142408286/.test(phone)) {
    return fallback;
  }
  return phone.trim();
}

const StoreSettingsContext = createContext<{
  settings: StoreSettings;
  isLoading: boolean;
}>({
  settings: DEFAULT_SETTINGS,
  isLoading: false,
});

export function StoreSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const cached = localStorage.getItem('vaultzet_store_settings');
      const portalGen = localStorage.getItem('rb_portal_settings_general');
      const portalWa = localStorage.getItem('rb_portal_settings_whatsapp');
      const portalSiteMode = localStorage.getItem('vaultworld_site_mode') || localStorage.getItem('vaultzet_setting_site_mode');

      let genData: any = null;
      let waData: any = null;
      let siteModeData: SiteModeData | null = null;
      if (portalGen) {
        try { genData = JSON.parse(portalGen); } catch {}
      }
      if (portalWa) {
        try { waData = JSON.parse(portalWa); } catch {}
      }
      if (portalSiteMode) {
        try {
          const parsedSm = JSON.parse(portalSiteMode);
          if (parsedSm && (parsedSm.mode === 'MAINTENANCE' || parsedSm.mode === 'LIVE')) {
            siteModeData = {
              mode: parsedSm.mode,
              maintenance_message: parsedSm.maintenance_message || DEFAULT_SITE_MODE.maintenance_message,
              bypass_ips: Array.isArray(parsedSm.bypass_ips) ? parsedSm.bypass_ips : DEFAULT_SITE_MODE.bypass_ips,
            };
          }
        } catch {}
      }

      if (cached) {
        const parsed = JSON.parse(cached);
        const resolvedPhone = sanitizePhone(
          genData?.support_whatsapp ||
          genData?.support_phone ||
          waData?.phone_number ||
          parsed.supportPhone ||
          parsed.supportWhatsapp ||
          '+91 9072850100'
        );
        const resolvedEmail = sanitizeEmail(genData?.contact_email || parsed.supportEmail);

        const cleaned = {
          ...DEFAULT_SETTINGS,
          ...parsed,
          storeName: sanitizeStoreName(genData?.store_name || parsed.storeName),
          tagline: sanitizeTagline(parsed.tagline),
          logoUrl: sanitizeLogoUrl(parsed.logoUrl),
          supportEmail: resolvedEmail,
          supportPhone: resolvedPhone,
          supportWhatsapp: resolvedPhone,
          ownerName: '',
          whatsappButtonEnabled: waData?.enabled !== undefined ? waData.enabled : (parsed.whatsappButtonEnabled !== undefined ? parsed.whatsappButtonEnabled : true),
          whatsappDefaultMessage: waData?.default_message || parsed.whatsappDefaultMessage || DEFAULT_SETTINGS.whatsappDefaultMessage,
          whatsappPopupText: waData?.popup_text || parsed.whatsappPopupText || DEFAULT_SETTINGS.whatsappPopupText,
          siteMode: siteModeData || parsed.siteMode || DEFAULT_SITE_MODE,
        };
        setSettings(cleaned);
      } else if (genData || waData || siteModeData) {
        const resolvedPhone = sanitizePhone(
          genData?.support_whatsapp || genData?.support_phone || waData?.phone_number || '+91 9072850100'
        );
        const resolvedEmail = sanitizeEmail(genData?.contact_email);
        setSettings((prev) => ({
          ...prev,
          storeName: sanitizeStoreName(genData?.store_name, prev.storeName),
          supportEmail: resolvedEmail || prev.supportEmail,
          supportPhone: resolvedPhone,
          supportWhatsapp: resolvedPhone,
          whatsappButtonEnabled: waData?.enabled !== undefined ? waData.enabled : true,
          whatsappDefaultMessage: waData?.default_message || prev.whatsappDefaultMessage,
          whatsappPopupText: waData?.popup_text || prev.whatsappPopupText,
          siteMode: siteModeData || prev.siteMode || DEFAULT_SITE_MODE,
        }));
      }
    } catch {}

    const handleCustomWaUpdate = (e: any) => {
      if (e.detail?.phone_number) {
        const phone = sanitizePhone(e.detail.phone_number);
        setSettings((prev) => ({
          ...prev,
          supportWhatsapp: phone,
          supportPhone: phone,
          whatsappButtonEnabled: e.detail.enabled !== undefined ? e.detail.enabled : prev.whatsappButtonEnabled,
          whatsappDefaultMessage: e.detail.default_message || prev.whatsappDefaultMessage,
          whatsappPopupText: e.detail.popup_text || prev.whatsappPopupText,
        }));
      }
    };

    const handleBrandingUpdate = (e: any) => {
      if (e.detail) {
        setSettings((prev) => ({
          ...prev,
          storeName: sanitizeStoreName(e.detail.store_name, prev.storeName),
          tagline: sanitizeTagline(e.detail.tagline, prev.tagline),
          logoUrl: sanitizeLogoUrl(e.detail.logo_url, prev.logoUrl),
          primaryColor: e.detail.primary_color || prev.primaryColor,
          supportEmail: e.detail.contact_email ? sanitizeEmail(e.detail.contact_email) : prev.supportEmail,
          supportPhone: e.detail.support_phone || e.detail.support_whatsapp ? sanitizePhone(e.detail.support_phone || e.detail.support_whatsapp) : prev.supportPhone,
          supportWhatsapp: e.detail.support_whatsapp || e.detail.support_phone ? sanitizePhone(e.detail.support_whatsapp || e.detail.support_phone) : prev.supportWhatsapp,
        }));
      }
    };

    const handleStoreSetupUpdate = (e: any) => {
      if (e.detail) {
        const email = e.detail.contact_email ? sanitizeEmail(e.detail.contact_email) : undefined;
        const phone = e.detail.support_phone || e.detail.support_whatsapp ? sanitizePhone(e.detail.support_phone || e.detail.support_whatsapp) : undefined;
        const name = e.detail.store_name ? sanitizeStoreName(e.detail.store_name) : undefined;
        setSettings((prev) => {
          const updated = {
            ...prev,
            storeName: name || prev.storeName,
            supportEmail: email || prev.supportEmail,
            supportPhone: phone || prev.supportPhone,
            supportWhatsapp: phone || prev.supportWhatsapp,
            currency: e.detail.currency || prev.currency,
            currencySymbol: e.detail.currency_symbol || prev.currencySymbol,
          };
          try {
            localStorage.setItem('vaultzet_store_settings', JSON.stringify(updated));
          } catch {}
          return updated;
        });
      }
    };

    const handleSiteModeUpdate = (e: any) => {
      if (e.detail) {
        const sm = e.detail;
        setSettings((prev) => ({
          ...prev,
          siteMode: {
            mode: sm.mode === 'MAINTENANCE' ? 'MAINTENANCE' : 'LIVE',
            maintenance_message: sm.maintenance_message || DEFAULT_SITE_MODE.maintenance_message,
            bypass_ips: Array.isArray(sm.bypass_ips) ? sm.bypass_ips : DEFAULT_SITE_MODE.bypass_ips,
          },
        }));
      }
    };

    window.addEventListener('vaultworld:whatsapp_updated', handleCustomWaUpdate);
    window.addEventListener('vaultworld:branding_updated', handleBrandingUpdate);
    window.addEventListener('vaultworld:store_setup_updated', handleStoreSetupUpdate);
    window.addEventListener('vaultworld:site_mode_updated', handleSiteModeUpdate);
    return () => {
      window.removeEventListener('vaultworld:whatsapp_updated', handleCustomWaUpdate);
      window.removeEventListener('vaultworld:branding_updated', handleBrandingUpdate);
      window.removeEventListener('vaultworld:store_setup_updated', handleStoreSetupUpdate);
      window.removeEventListener('vaultworld:site_mode_updated', handleSiteModeUpdate);
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;
    let hasTriggered = false;
    let unsubSiteMode: (() => void) | null = null;

    const startFirestoreSync = async () => {
      if (hasTriggered || isCancelled) return;
      hasTriggered = true;
      cleanupListeners();

      try {
        const [{ db }, { doc, getDoc, onSnapshot }] = await Promise.all([
          import('@/lib/firebase'),
          import('firebase/firestore'),
        ]);
        if (isCancelled || !db) {
          setIsLoading(false);
          return;
        }

        const [generalSnap, brandingSnap, whatsappSnap, siteModeSnap] = await Promise.all([
          getDoc(doc(db, 'store_settings', 'general')).catch(() => null),
          getDoc(doc(db, 'store_settings', 'branding')).catch(() => null),
          getDoc(doc(db, 'store_settings', 'whatsapp')).catch(() => null),
          getDoc(doc(db, 'store_settings', 'site_mode')).catch(() => null),
        ]);

        if (!isCancelled && siteModeSnap && siteModeSnap.exists()) {
          const smData = siteModeSnap.data() as SiteModeData;
          setSettings((prev) => ({
            ...prev,
            siteMode: {
              mode: smData.mode === 'MAINTENANCE' ? 'MAINTENANCE' : 'LIVE',
              maintenance_message: smData.maintenance_message || DEFAULT_SITE_MODE.maintenance_message,
              bypass_ips: Array.isArray(smData.bypass_ips) ? smData.bypass_ips : DEFAULT_SITE_MODE.bypass_ips,
            },
          }));
          try {
            localStorage.setItem('vaultworld_site_mode', JSON.stringify(smData));
            localStorage.setItem('vaultzet_setting_site_mode', JSON.stringify(smData));
          } catch {}
        }

        // Real-time listener for site mode changes
        try {
          unsubSiteMode = onSnapshot(doc(db, 'store_settings', 'site_mode'), (snap) => {
            if (!isCancelled && snap.exists()) {
              const liveSm = snap.data() as SiteModeData;
              setSettings((prev) => ({
                ...prev,
                siteMode: {
                  mode: liveSm.mode === 'MAINTENANCE' ? 'MAINTENANCE' : 'LIVE',
                  maintenance_message: liveSm.maintenance_message || DEFAULT_SITE_MODE.maintenance_message,
                  bypass_ips: Array.isArray(liveSm.bypass_ips) ? liveSm.bypass_ips : DEFAULT_SITE_MODE.bypass_ips,
                },
              }));
              try {
                localStorage.setItem('vaultworld_site_mode', JSON.stringify(liveSm));
                localStorage.setItem('vaultzet_setting_site_mode', JSON.stringify(liveSm));
              } catch {}
            }
          });
        } catch {}

        if (!isCancelled && generalSnap && generalSnap.exists()) {
          const data = generalSnap.data();
          const email = data.contact_email ? sanitizeEmail(data.contact_email) : undefined;
          const phone = data.support_phone || data.support_whatsapp ? sanitizePhone(data.support_phone || data.support_whatsapp) : undefined;

          setSettings((prev) => {
            const updated = {
              ...prev,
              storeName: sanitizeStoreName(data.store_name, prev.storeName),
              supportEmail: email || prev.supportEmail,
              supportPhone: phone || prev.supportPhone,
              supportWhatsapp: phone || prev.supportWhatsapp,
              currency: data.currency || prev.currency,
              currencySymbol: data.currency_symbol || prev.currencySymbol,
            };
            try {
              localStorage.setItem('vaultzet_store_settings', JSON.stringify(updated));
            } catch {}
            return updated;
          });
        }

        if (!isCancelled && brandingSnap && brandingSnap.exists()) {
          const data = brandingSnap.data();
          setSettings((prev) => {
            const updated = {
              ...prev,
              storeName: sanitizeStoreName(data.store_name, prev.storeName),
              tagline: sanitizeTagline(data.tagline, prev.tagline),
              logoUrl: sanitizeLogoUrl(data.logo_url, prev.logoUrl),
              primaryColor: data.primary_color || prev.primaryColor,
              supportEmail: data.contact_email ? sanitizeEmail(data.contact_email) : prev.supportEmail,
            };
            try {
              localStorage.setItem('vaultzet_store_settings', JSON.stringify(updated));
            } catch {}
            return updated;
          });
        }

        if (!isCancelled && whatsappSnap && whatsappSnap.exists()) {
          const data = whatsappSnap.data();
          setSettings((prev) => {
            const updated = {
              ...prev,
              supportWhatsapp: data.phone_number ? sanitizePhone(data.phone_number, prev.supportWhatsapp) : prev.supportWhatsapp,
              whatsappButtonEnabled: data.enabled !== undefined ? data.enabled : prev.whatsappButtonEnabled,
              whatsappDefaultMessage: data.default_message || prev.whatsappDefaultMessage,
              whatsappPopupText: data.popup_text || prev.whatsappPopupText,
            };
            try {
              localStorage.setItem('vaultzet_store_settings', JSON.stringify(updated));
              localStorage.setItem('rb_portal_settings_whatsapp', JSON.stringify(data));
            } catch {}
            return updated;
          });
        }
      } catch {
        // Fallback gracefully without throwing console errors
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    // Run sync immediately on mount so visitors see live settings without needing interaction
    startFirestoreSync();

    const events = ['scroll', 'pointerdown', 'touchstart', 'keydown'] as const;
    const cleanupListeners = () => {
      events.forEach((evt) => window.removeEventListener(evt, startFirestoreSync));
    };

    events.forEach((evt) =>
      window.addEventListener(evt, startFirestoreSync, { once: true, passive: true })
    );

    return () => {
      isCancelled = true;
      if (unsubSiteMode) {
        try {
          unsubSiteMode();
        } catch {}
      }
      cleanupListeners();
    };
  }, []);

  return (
    <StoreSettingsContext.Provider value={{ settings, isLoading }}>
      {children}
    </StoreSettingsContext.Provider>
  );
}

export function useStoreSettings() {
  return useContext(StoreSettingsContext);
}
