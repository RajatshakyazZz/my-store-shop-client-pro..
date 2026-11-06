import Hero from '@/components/Hero';
import FreeBundleOfferBanner from '@/components/FreeBundleOfferBanner';
import TrendingMarquee from '@/components/TrendingMarquee';
import ReelsVideoPreview from '@/components/ReelsVideoPreview';
import FreshReelsGrid from '@/components/FreshReelsGrid';
import MembershipPlans from '@/components/MembershipPlans';
import UpcomingBundles from '@/components/UpcomingBundles';

export default function HomePage() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://creatormint-store.vercel.app').replace(/\/+$/, '');

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CreatorMint',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: "India's leading marketplace for viral ready-to-post vertical reels bundles with commercial rights.",
    sameAs: [
      'https://www.instagram.com/creatormint',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CreatorMint',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/shop?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div className="space-y-4">
      {/* JSON-LD Structured Data: Organization & WebSite SearchAction */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      {/* Hero with Typewriter & 3D Cards */}
      <Hero />

      {/* Special Free Bundles Offer Banner */}
      <FreeBundleOfferBanner variant="home" />

      {/* Trending Bundles Auto-Marquee */}
      <TrendingMarquee />

      {/* Interactive Smartphone Video Preview Section */}
      <ReelsVideoPreview />

      {/* Fresh Reels Grid */}
      <FreshReelsGrid />

      {/* All Access Personal vs Reseller Plans */}
      <MembershipPlans />

      {/* Upcoming Bundles & Notify Me */}
      <UpcomingBundles />
    </div>
  );
}
