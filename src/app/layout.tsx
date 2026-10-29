import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Suspense } from 'react';
import './globals.css';
import StoreLayoutShell from '@/components/StoreLayoutShell';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import MetaPixelTracker from '@/components/MetaPixelTracker';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://myztore.shop';
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || '';
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || '';
const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION || '';
const BING_VERIFICATION = process.env.NEXT_PUBLIC_BING_VERIFICATION || '';
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#0f172a',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'MYZTORE | Buy Viral Reels Bundles in India – 222,000+ Ready-to-Post Reels',
    template: '%s | MYZTORE',
  },
  description:
    'Download 222,000+ viral ready-to-post vertical reels bundles for Instagram Reels, YouTube Shorts & Facebook across 129+ niches. Zero watermarks, commercial & reseller rights, and instant Google Drive access.',
  keywords: [
    'myztore',
    'myztore store',
    'vaultzet',
    'viral reels bundle',
    'ai reels bundle',
    'instagram reels bundle india',
    'youtube shorts bundle',
    'ready to post reels',
    'faceless instagram reels',
    'motivational reels bundle',
    '3d animation reels bundle',
    'digital products resell india',
    'watermark free reels download',
  ],
  authors: [{ name: 'MYZTORE', url: SITE_URL }],
  creator: 'MYZTORE',
  publisher: 'MYZTORE',
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'MYZTORE',
    title: 'MYZTORE | 222,000+ Viral Reels Bundles – Instant Download',
    description:
      'Over 222,000+ vertical HD reels across 129+ niches with zero watermarks & full commercial rights. Instant Google Drive delivery.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MYZTORE | Viral Reels Bundles – Instant Google Drive Access',
    description:
      'Grow faster on Instagram & YouTube Shorts with 222,000+ ready-to-post HD reels bundles.',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MYZTORE',
  },
  icons: {
    icon: [
      { url: '/favicon.ico?v=2', sizes: 'any' },
      { url: '/logo.webp?v=2', type: 'image/webp' },
    ],
    shortcut: '/favicon.ico?v=2',
    apple: '/logo.png?v=2',
  },
  verification: {
    ...(GSC_VERIFICATION ? { google: GSC_VERIFICATION } : {}),
    ...(BING_VERIFICATION ? { other: { 'msvalidate.01': BING_VERIFICATION } } : {}),
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'MYZTORE',
        description:
          'India’s #1 marketplace for ready-to-post viral Instagram Reels & YouTube Shorts bundles with instant Google Drive delivery.',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/shop?s={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'MYZTORE',
        url: SITE_URL,
        logo: `${SITE_URL}/logo.webp`,
        sameAs: [],
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'ztoredigital@gmail.com',
          telephone: '+91-9072850100',
          contactType: 'customer support',
          areaServed: 'IN',
          availableLanguage: ['English', 'Hindi'],
        },
      },
    ],
  };

  return (
    <html lang="en-IN">
      <head>
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        {GSC_VERIFICATION && (
          <meta name="google-site-verification" content={GSC_VERIFICATION} />
        )}
        {BING_VERIFICATION && (
          <meta name="msvalidate.01" content={BING_VERIFICATION} />
        )}
        <link rel="preconnect" href="https://reelsbundles.in" />
        <link rel="dns-prefetch" href="https://reelsbundles.in" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link
          rel="preload"
          as="image"
          href="/_next/image?url=https%3A%2F%2Freelsbundles.in%2Fwp-content%2Fuploads%2F2026%2F10%2F1500-mad-scientist-reels-bundle-4-2-1024x768.jpg&w=384&q=75"
          fetchPriority="high"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-rb-purple selection:text-white">
        {/* Google Tag Manager (noscript) */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}


        {/* Google Consent Mode v2: default denied, update non-blocking (only if GA4 or GTM is configured) */}
        {(GA4_ID || GTM_ID) && (
          <Script id="consent-mode-v2" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'analytics_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'wait_for_update': 500
              });
              gtag('consent', 'update', {
                'ad_storage': 'granted',
                'analytics_storage': 'granted',
                'ad_user_data': 'granted',
                'ad_personalization': 'granted'
              });
            `}
          </Script>
        )}

        {/* Google tag (gtag.js) */}
        {GA4_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${GA4_ID}');
              `}
            </Script>
          </>
        )}

        {/* Google Tag Manager (GTM) */}
        {GTM_ID && (
          <Script id="gtm-script" strategy="afterInteractive">
            {`
              try {
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;
                if(f && f.parentNode){f.parentNode.insertBefore(j,f);}
                else{(d.head||d.body||d.documentElement).appendChild(j);}
                })(window,document,'script','dataLayer','${GTM_ID}');
              } catch(e) { console.warn('GTM init skipped:', e); }
            `}
          </Script>
        )}

        {/* Dynamic Meta Pixel & CAPI Syncer (Loads fbevents.js dynamically ONLY if a valid client Pixel ID is configured) */}
        <Suspense fallback={null}>
          <MetaPixelTracker />
        </Suspense>

        {/* Client-Side SPA Route Tracking */}
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>

        <StoreLayoutShell>{children}</StoreLayoutShell>
      </body>
    </html>
  );
}
