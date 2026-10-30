export const revalidate = 3600;

export async function GET() {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ztoredigital.com').replace(/\/+$/, '');
  const now = new Date().toISOString();

  const pages = [
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: '/shop', priority: '0.9', changefreq: 'daily' },
    { path: '/reels', priority: '0.85', changefreq: 'daily' },
    { path: '/about-us', priority: '0.5', changefreq: 'monthly' },
    { path: '/contact-us', priority: '0.5', changefreq: 'monthly' },
    { path: '/privacy-policy', priority: '0.3', changefreq: 'monthly' },
    { path: '/terms-and-conditions', priority: '0.3', changefreq: 'monthly' },
    { path: '/refund-policy', priority: '0.3', changefreq: 'monthly' },
    { path: '/shipping-policy', priority: '0.3', changefreq: 'monthly' },
  ];

  const urlEntries = pages
    .map(
      (p) => `  <url>
    <loc>${baseUrl}${p.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
