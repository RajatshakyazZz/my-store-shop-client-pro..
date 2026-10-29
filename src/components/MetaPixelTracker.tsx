'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _vaultworld_active_pixel_id?: string;
  }
}

export default function MetaPixelTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPixelId = useRef<string>('');
  const initialPageViewSent = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isCancelled = false;

    const setupPixel = async () => {
      let resolvedId = '';

      // 1. Try local storage cache (ignoring developer personal pixel 1715650960276913)
      try {
        const storedMeta = localStorage.getItem('rb_portal_settings_meta_pixel');
        if (storedMeta) {
          const parsed = JSON.parse(storedMeta);
          if (parsed.pixel_id && parsed.pixel_id !== '1715650960276913') {
            resolvedId = String(parsed.pixel_id).trim();
          }
          if (parsed.enabled === false) {
            resolvedId = '';
          }
        }

        if (!resolvedId) {
          const storedDnp = localStorage.getItem('rb_portal_settings_dnp_meta');
          if (storedDnp) {
            const parsed = JSON.parse(storedDnp);
            const dnpId = String(parsed.meta_pixel_id || parsed.pixel_id || '').trim();
            if (dnpId && dnpId !== '1715650960276913') {
              resolvedId = dnpId;
            }
            if (parsed.enabled === false) {
              resolvedId = '';
            }
          }
        }
      } catch {}

      // 2. Fetch from active API if missing or to ensure sync with Firestore
      try {
        const res = await fetch('/api/settings/meta-pixel', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.pixel_id && data.pixel_id !== '1715650960276913') {
            resolvedId = String(data.pixel_id).trim();
          }
          if (data.enabled === false) {
            resolvedId = '';
          }
        }
      } catch (err) {
        // Fallback
      }

      if (!resolvedId) {
        const envId = (process.env.NEXT_PUBLIC_META_PIXEL_ID || '').trim();
        if (envId && envId !== '1715650960276913') {
          resolvedId = envId;
        }
      }

      if (isCancelled) return;

      // If no valid client pixel configured in Admin Panel, DO NOT INITIALIZE ANY PIXEL!
      if (!resolvedId) {
        currentPixelId.current = '';
        window._vaultworld_active_pixel_id = undefined;
        return;
      }

      // 3. Initialize or update fbq
      if (typeof window.fbq === 'function') {
        if (currentPixelId.current !== resolvedId) {
          currentPixelId.current = resolvedId;
          window._vaultworld_active_pixel_id = resolvedId;

          try {
            window.fbq('init', resolvedId);
            window.fbq('track', 'PageView');
            initialPageViewSent.current = true;
          } catch (fbErr) {
            console.warn('[MetaPixelTracker] fbq init warning:', fbErr);
          }
        }
      } else {
        // Retry shortly if fbevents.js script tag is still hydrating
        const interval = setInterval(() => {
          if (typeof window.fbq === 'function') {
            clearInterval(interval);
            if (currentPixelId.current !== resolvedId) {
              currentPixelId.current = resolvedId;
              window._vaultworld_active_pixel_id = resolvedId;
              try {
                window.fbq('init', resolvedId);
                window.fbq('track', 'PageView');
                initialPageViewSent.current = true;
              } catch (e) {}
            }
          }
        }, 150);

        setTimeout(() => clearInterval(interval), 3000);
      }
    };

    setupPixel();

    const handlePixelUpdated = (e: any) => {
      const newId = String(e.detail?.pixel_id || e.detail?.meta_pixel_id || '').trim();
      const isEnabled = e.detail?.enabled !== false;

      if (newId && newId !== '1715650960276913' && isEnabled && typeof window.fbq === 'function') {
        currentPixelId.current = newId;
        window._vaultworld_active_pixel_id = newId;
        try {
          window.fbq('init', newId);
          window.fbq('track', 'PageView');
          initialPageViewSent.current = true;
        } catch {}
      } else {
        currentPixelId.current = '';
        window._vaultworld_active_pixel_id = undefined;
      }
    };

    window.addEventListener('vaultworld:meta_pixel_updated', handlePixelUpdated);

    return () => {
      isCancelled = true;
      window.removeEventListener('vaultworld:meta_pixel_updated', handlePixelUpdated);
    };
  }, []);

  // Track PageView on route change (SPA navigation)
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
    if (!currentPixelId.current || !initialPageViewSent.current) return;

    try {
      window.fbq('track', 'PageView');
    } catch {}
  }, [pathname, searchParams]);

  return null;
}
