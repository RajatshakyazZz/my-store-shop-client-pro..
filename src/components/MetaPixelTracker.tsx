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

      // 1. Try local storage cache
      try {
        const storedMeta = localStorage.getItem('rb_portal_settings_meta_pixel');
        if (storedMeta) {
          const parsed = JSON.parse(storedMeta);
          if (parsed.pixel_id) resolvedId = String(parsed.pixel_id).trim();
        }

        if (!resolvedId) {
          const storedDnp = localStorage.getItem('rb_portal_settings_dnp_meta');
          if (storedDnp) {
            const parsed = JSON.parse(storedDnp);
            if (parsed.meta_pixel_id) resolvedId = String(parsed.meta_pixel_id).trim();
          }
        }
      } catch {}

      // 2. Fetch from active API if missing or to ensure sync
      try {
        const res = await fetch('/api/settings/meta-pixel', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.pixel_id) {
            resolvedId = String(data.pixel_id).trim();
          }
        }
      } catch (err) {
        // Fallback to env or default
      }

      if (!resolvedId) {
        resolvedId = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1715650960276913';
      }

      if (isCancelled) return;

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
      const newId = e.detail?.pixel_id || e.detail?.meta_pixel_id;
      if (newId && typeof window.fbq === 'function') {
        currentPixelId.current = newId;
        window._vaultworld_active_pixel_id = newId;
        try {
          window.fbq('init', newId);
          window.fbq('track', 'PageView');
        } catch {}
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
    if (!initialPageViewSent.current) return;

    try {
      window.fbq('track', 'PageView');
    } catch {}
  }, [pathname, searchParams]);

  return null;
}
