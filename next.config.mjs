import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  experimental: {
    inlineCss: true,
  },
  typescript: {
    // Ignore type errors from standalone subprojects (like admin-portal) during storefront build
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    deviceSizes: [384, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config, { webpack }) => {
    const emptyPolyfill = path.resolve(__dirname, 'src/lib/empty-polyfill.js');
    config.resolve.alias = {
      ...config.resolve.alias,
      'next/dist/build/polyfills/polyfill-module': emptyPolyfill,
      [path.resolve(__dirname, 'node_modules/next/dist/build/polyfills/polyfill-module.js')]:
        emptyPolyfill,
    };
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /next[\\/]dist[\\/]build[\\/]polyfills[\\/]polyfill-module/,
        emptyPolyfill
      )
    );
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/shipping',
        destination: '/shipping-policy',
      },
      {
        source: '/delivery',
        destination: '/shipping-policy',
      },
      {
        source: '/delivery-policy',
        destination: '/shipping-policy',
      },
      {
        source: '/shipping-and-delivery',
        destination: '/shipping-policy',
      },
      {
        source: '/shipping-and-delivery-policy',
        destination: '/shipping-policy',
      },
      {
        source: '/cancellations-and-refunds',
        destination: '/refund-policy',
      },
      {
        source: '/cancellation-and-refund',
        destination: '/refund-policy',
      },
      {
        source: '/cancellation-and-refund-policy',
        destination: '/refund-policy',
      },
      {
        source: '/cancellation-policy',
        destination: '/refund-policy',
      },
      {
        source: '/refund',
        destination: '/refund-policy',
      },
      {
        source: '/refunds',
        destination: '/refund-policy',
      },
      {
        source: '/cancellation',
        destination: '/refund-policy',
      },
      {
        source: '/cancellations',
        destination: '/refund-policy',
      },
      {
        source: '/returns-and-refunds',
        destination: '/refund-policy',
      },
      {
        source: '/return-policy',
        destination: '/refund-policy',
      },
      {
        source: '/terms',
        destination: '/terms-and-conditions',
      },
      {
        source: '/terms-of-service',
        destination: '/terms-and-conditions',
      },
      {
        source: '/tos',
        destination: '/terms-and-conditions',
      },
      {
        source: '/privacy',
        destination: '/privacy-policy',
      },
      {
        source: '/contact',
        destination: '/contact-us',
      },
      {
        source: '/help',
        destination: '/contact-us',
      },
      {
        source: '/support',
        destination: '/contact-us',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/(icon.png|apple-icon.png|favicon.ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
