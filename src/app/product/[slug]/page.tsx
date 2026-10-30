import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BUNDLE_PRODUCTS } from '@/data/bundles';
import { resolveBundleSlug } from '@/lib/bundleResolver';
import { fetchCustomProductBySlug } from '@/lib/customProducts';
import ProductDetailClient from './ProductDetailClient';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const dynamicParams = true;

export async function generateStaticParams() {
  return BUNDLE_PRODUCTS.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = (await fetchCustomProductBySlug(slug, true)) || resolveBundleSlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | Ztore Digital',
      description: 'The requested reels bundle could not be found.',
      robots: { index: false, follow: true },
    };
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ztoredigital.com').replace(/\/+$/, '');
  const canonicalUrl = `${siteUrl}/product/${product.slug}`;

  // Unique <title> (max 60 chars): "{Product Name} Bundle — Ready to Post Reels | Ztore Digital"
  const suffix = ' Bundle — Ready to Post Reels | Ztore Digital';
  const availableLength = 60 - suffix.length; // 21 chars
  const rawCleanName = product.title
    .replace(/\s*(bundle|reels bundle|pack)\s*$/i, '')
    .trim();
  const cleanName =
    rawCleanName.length > availableLength
      ? `${rawCleanName.slice(0, availableLength - 1).trim()}…`
      : rawCleanName;
  const title = `${cleanName}${suffix}`.slice(0, 60);

  // Unique meta description (140–158 chars) mentioning niche + price + "instant Google Drive delivery"
  let description = `Buy ${product.title.slice(0, 32)} for ₹${product.personalPrice}. Get ${product.reelCount || 1000}+ viral ${product.category} reels with instant Google Drive delivery & commercial rights.`;
  if (description.length < 140) {
    description = `${description} Download HD vertical watermark-free MP4s today.`;
  }
  if (description.length > 158) {
    description = `${description.slice(0, 155)}...`;
  }

  const imageUrl = product.thumbnail || `${siteUrl}/icon.png`;

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
      siteName: 'Ztore Digital',
      locale: 'en_IN',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${product.title} ${product.category} Reels Bundle Preview`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
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
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = (await fetchCustomProductBySlug(slug, true)) || resolveBundleSlug(slug);

  if (!product) {
    notFound();
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ztoredigital.com').replace(/\/+$/, '');
  const canonicalUrl = `${siteUrl}/product/${product.slug}`;

  // Structured Data: Product + Offer + AggregateRating
  const productJsonLd: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: [product.thumbnail, ...(product.galleryImages || [])].filter(Boolean),
    description: product.shortDescription || `Download ${product.reelCount}+ viral reels bundle in ${product.category} niche.`,
    sku: product.slug,
    brand: {
      '@type': 'Brand',
      name: 'Ztore Digital',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.personalPrice,
      priceValidUntil: '2027-12-31',
      availability: 'https://schema.org/InStock',
      url: canonicalUrl,
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Ztore Digital',
      },
    },
  };

  if (product.rating && product.reviewCount) {
    productJsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  // Structured Data: BreadcrumbList
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop',
        item: `${siteUrl}/shop`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.category || 'Reels Bundles',
        item: `${siteUrl}/category/${product.categorySlug || 'ai-reels'}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.title,
        item: canonicalUrl,
      },
    ],
  };

  // Structured Data: FAQPage (if FAQs exist)
  const faqList = product.faqs && product.faqs.length > 0 ? product.faqs : [];
  const faqJsonLd =
    faqList.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqList.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      {/* Server-Injected JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* Interactive Client Component */}
      <ProductDetailClient product={product} />
    </>
  );
}
