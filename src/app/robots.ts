import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ztoredigital.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/asdf/',
          '/admin/',
          '/api/',
          '/analy',
          '/customers',
          '/costumers',
          '/order-status',
          '/order-success',
          '/checkout',
          '/cart',
          '/_next/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
