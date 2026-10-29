import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getResellerListingBySlug } from '@/lib/resellerService';
import { BUNDLE_PRODUCTS } from '@/data/bundles';
import ResellerLandingClient from './ResellerLandingClient';

interface ResellerPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: ResellerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getResellerListingBySlug(slug, true);

  if (!listing || listing.status === 'archived') {
    return {
      title: 'Product Not Found | MYZTORE',
      description: 'The requested product listing is currently unavailable.',
      robots: { index: false, follow: false },
    };
  }

  if (listing.status !== 'active') {
    return {
      title: `${listing.customTitle} (Unavailable) | MYZTORE`,
      description: 'This product listing is temporarily paused by the seller.',
      robots: { index: false, follow: false },
    };
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://vaultworld.shop').replace(/\/+$/, '');
  const canonicalUrl = `${siteUrl}/r/${listing.slug}`;
  const title = `${listing.customHeadline || listing.customTitle} — Instant Download`;
  const description =
    listing.customShortDescription ||
    `Download ${listing.customTitle} in 1080x1920 HD vertical MP4 format with instant Google Drive access.`;
  const imageUrl = listing.coverImage || `${siteUrl}/icon.png`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title,
      description,
      siteName: 'MYZTORE',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: listing.customTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ResellerPublicLandingPage({ params }: ResellerPageProps) {
  const { slug } = await params;
  const listing = await getResellerListingBySlug(slug, true);

  if (!listing || listing.status === 'archived') {
    notFound();
  }

  const originalProduct = BUNDLE_PRODUCTS.find(
    (p) => p.id === listing.originalProductId || p.slug === listing.originalProductSlug
  );

  return (
    <ResellerLandingClient
      listing={listing}
      originalProduct={originalProduct}
    />
  );
}
