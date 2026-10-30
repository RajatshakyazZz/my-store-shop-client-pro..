import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  CheckCircle2,
  FolderOpen,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { COMPETITOR_CATEGORIES } from '@/lib/categories';
import { BUNDLE_PRODUCTS } from '@/data/bundles';
import { optimizeImageUrl } from '@/lib/imageOptimized';
import { fetchCustomProducts, getAllCatalogBundles } from '@/lib/customProducts';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const dynamicParams = true;

export async function generateStaticParams() {
  return COMPETITOR_CATEGORIES.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cleanSlug = slug.toLowerCase().trim();
  const category = COMPETITOR_CATEGORIES.find(
    (c) => c.slug.toLowerCase() === cleanSlug || (c.aliases && c.aliases.includes(cleanSlug))
  );

  if (!category) {
    return {
      title: 'Category Not Found | ZTORE',
      robots: { index: false, follow: true },
    };
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://vaultworld.shop').replace(/\/+$/, '');
  const canonicalUrl = `${siteUrl}/category/${category.slug}`;
  const title = `${category.name} Bundles — Ready to Post Reels | ZTORE`.slice(0, 60);

  let description = `Download ${category.name} reels bundles for Instagram & YouTube Shorts. Get 1000+ viral HD vertical videos with instant Google Drive access and commercial rights.`;
  if (description.length < 140) {
    description = `${description} 100% watermark-free with trending audio for rapid account growth.`;
  }
  if (description.length > 158) {
    description = `${description.slice(0, 155)}...`;
  }

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
      siteName: 'ZTORE',
      locale: 'en_IN',
      images: [
        {
          url: `${siteUrl}/icon.png`,
          width: 1200,
          height: 630,
          alt: `${category.name} Reels Bundles Collection`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/icon.png`],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const cleanSlug = slug.toLowerCase().trim();
  const category = COMPETITOR_CATEGORIES.find(
    (c) => c.slug.toLowerCase() === cleanSlug || (c.aliases && c.aliases.includes(cleanSlug))
  );

  if (!category) {
    notFound();
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://vaultworld.shop').replace(/\/+$/, '');
  const canonicalUrl = `${siteUrl}/category/${category.slug}`;

  const customProducts = await fetchCustomProducts();
  const allBundles = getAllCatalogBundles(customProducts, BUNDLE_PRODUCTS);

  // Find products matching category slug or keywords
  const keywords = (category.keywords || []).map((k) => k.toLowerCase());
  const matchingProducts = allBundles.filter((p) => {
    const catSlug = (p.categorySlug || '').toLowerCase();
    const catName = (p.category || '').toLowerCase();
    const title = p.title.toLowerCase();
    if (catSlug === category.slug || catName === category.name.toLowerCase()) return true;
    return keywords.some((kw) => title.includes(kw) || catName.includes(kw));
  });

  const displayProducts = matchingProducts.length > 0 ? matchingProducts : allBundles.slice(0, 8);

  // Structured Data: ItemList
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${category.name} Reels Bundles`,
    numberOfItems: displayProducts.length,
    itemListElement: displayProducts.map((p, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: p.title,
      url: `${siteUrl}/product/${p.slug}`,
    })),
  };

  // Structured Data: Breadcrumbs
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
        name: 'Categories',
        item: `${siteUrl}/shop`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: canonicalUrl,
      },
    ],
  };

  const categoryFaqs = [
    {
      q: `Kya ${category.name} reels me koi watermark ya logo hota hai?`,
      a: `Nahi, bilkul clean reels milti hain bina kisi watermark, copyright logo ya creator name ke. Aap apna logo, handle ya text add karke directly Instagram Reels, YouTube Shorts aur Facebook par post kar sakte hain.`,
    },
    {
      q: `Payment ke baad ${category.name} bundle kaise access hoga?`,
      a: `Payment confirm hote hi turant on-screen Google Drive link display hota hai aur aapke registered Gmail par bhi instant access email bheja jata hai jisse aap lifetime kabhi bhi download kar sakte hain.`,
    },
    {
      q: `Kya in reels se Instagram monetize ho sakta hai?`,
      a: `Haan, hamare thousands of creators faceless channels aur themed pages run karke sponsorships, affiliate marketing, digital products resell aur bonus programs se monthly handsome income generate kar rahe hain.`,
    },
    {
      q: `Personal use aur Reseller license me kya difference hai?`,
      a: `Personal license me aap ye reels apne khud ke pages par post kar sakte hain. Reseller license (MRR) ke sath aap is pure bundle ko apne buyers ko kisi bhi price par resell kar sakte hain aur 100% profit apne paas rakh sakte hain.`,
    },
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: categoryFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="py-6 sm:py-10 bg-[#faf9ff] min-h-screen text-[#182247]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500">
            <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-red-600 transition-colors">Categories</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">{category.name}</span>
          </nav>

          {/* Hero Hub Header */}
          <header className="rounded-3xl p-6 sm:p-10 bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-red-50 border border-red-200/60 text-red-900">
              <span>{category.icon || '🔥'}</span>
              <span>Trending Niche Collection</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
              {category.name} Reels Bundles
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
              Download premium ready-to-post <strong>{category.name}</strong> reels bundles in 1080P Full HD vertical format.
              Sabhi videos 100% watermark-free hain aur trending background audio ke sath aati hain. Agar aap faceless Instagram page ya YouTube Shorts channel grow karna chahte hain toh ye bundles aapke daily content creation ko 10x fast bana denge. Instant Google Drive lifetime access guaranteed!
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                <FolderOpen className="w-4 h-4 text-red-600" />
                Google Drive Instant Delivery
              </span>
              <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Zero Watermarks · 1080P HD
              </span>
              <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                <TrendingUp className="w-4 h-4 text-red-600" />
                Commercial & Reseller Rights
              </span>
            </div>
          </header>

          {/* Products Grid */}
          <section className="space-y-6">
            <div className="flex items-end justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                  Available {category.name} Packs ({displayProducts.length})
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Click on any bundle to view details, watch sample video preview, or instant buy.
                </p>
              </div>
              <Link
                href="/shop"
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <span>View all 130+ bundles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {displayProducts.map((bundle) => {
                const discount = Math.round(
                  ((bundle.personalOriginalPrice - bundle.personalPrice) / bundle.personalOriginalPrice) * 100
                );
                return (
                  <article
                    key={bundle.id}
                    className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-[0_12px_28px_rgba(225,29,72,0.14)] hover:-translate-y-1 transition-all flex flex-col justify-between"
                  >
                    <Link href={`/product/${bundle.slug}`} className="block relative aspect-[4/3] bg-slate-900 overflow-hidden">
                      <img
                        src={optimizeImageUrl(bundle.thumbnail, 500)}
                        alt={`${bundle.title} preview`}
                        width={500}
                        height={375}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm">
                        {discount}% OFF
                      </span>
                      <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs">
                        {bundle.reelCount}+ Reels
                      </span>
                    </Link>

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-600">
                          {bundle.category}
                        </span>
                        <Link href={`/product/${bundle.slug}`}>
                          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 line-clamp-2 group-hover:text-red-600 transition-colors leading-snug">
                            {bundle.title}
                          </h3>
                        </Link>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <div className="text-base sm:text-lg font-black text-slate-950">
                            ₹{bundle.personalPrice}.00
                          </div>
                          <div className="text-[11px] text-slate-400 line-through">
                            ₹{bundle.personalOriginalPrice}.00
                          </div>
                        </div>

                        <Link
                          href={`/product/${bundle.slug}`}
                          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-black shadow-sm transition-all"
                        >
                          View Bundle →
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Deep-Dive Hinglish Guide: How to Scale in this Niche (400-600 words) */}
          <article className="rounded-3xl p-6 sm:p-10 bg-white border border-slate-200/90 shadow-sm space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-red-600">
                GROWTH BLUEPRINT
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-slate-950 tracking-tight">
                {category.name} Reels Se Instagram Page Kaise Grow Karein?
              </h2>
            </div>

            <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-4 text-slate-600">
              <p>
                Aaj ke time me <strong>{category.name}</strong> reels Instagram aur YouTube Shorts par sabse tezi se viral hone wale niches me se ek hai. Har roz lakho log is category ke content ko consume aur share karte hain. Agar aap apna ek naya Instagram page start kar rahe hain ya existing account par views dead ho chuke hain, toh regular high-quality video publishing hi sabse bada secret hai algorithm me boost paane ka.
              </p>

              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 pt-2">
                1. Consistency aur Daily Posting Schedule
              </h3>
              <p>
                Instagram algorithm un creators ko promote karta hai jo regular rehte hain. Hamare {category.name} bundle me aapko 1000 se lekar 3000+ ready-to-post videos milti hain, jisse aap daily 2-3 reels bina kisi tension ke 6 se 12 mahine tak post kar sakte hain. Aapko camera ke aage aane ki ya complex video editing sikhne ki koi zaroorat nahi hoti.
              </p>

              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 pt-2">
                2. Viral Hook aur Watch Time Formula
              </h3>
              <p>
                In reels ko is tarah se design kiya gaya hai ki first 3 seconds me viewer scroll karna rok deta hai. High-retention visuals, engaging motion graphics aur trending background audio aapki reel ka average percentage viewed (APV) 80% se upar le jati hai, jisse Instagram algorithm use Explore feed aur Reels recommendation me dhakel deta hai.
              </p>

              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 pt-2">
                3. Monetization: Earning Kaise Shuru Karein?
              </h3>
              <p>
                Jaise hi aapke account par 10k se 50k followers ban jaate hain, aap kai tarike se paise kama sakte hain:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 font-medium">
                <li><strong>Brand Collaborations & Paid Promotions:</strong> Niche-specific brands story aur reel shoutouts ke acche paise offer karte hain.</li>
                <li><strong>Affiliate Marketing:</strong> Amazon, ClickBank ya coaching programs ke links bio me share karke commissions earn karein.</li>
                <li><strong>Reselling Rights (MRR):</strong> Aap hamare Reseller license ke sath ye bundles apne followers ko ₹199 ya ₹499 me direct sell kar sakte hain aur 100% margin khud rakh sakte hain.</li>
              </ul>
            </div>
          </article>

          {/* FAQs Section */}
          <section className="rounded-3xl p-6 sm:p-10 bg-slate-50 border border-slate-200/90 space-y-6">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-red-600">
                HELP & QUESTIONS
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mt-0.5">
                {category.name} Bundles — FAQ
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryFaqs.map((faq, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
                  <h3 className="text-sm font-bold text-slate-950 flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed pl-6">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Explore Other Categories */}
          <section className="pt-6 border-t border-slate-200 space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-950">
              Explore Other Trending Reels Categories
            </h2>
            <div className="flex flex-wrap gap-2">
              {COMPETITOR_CATEGORIES.filter((c) => c.slug !== category.slug).slice(0, 15).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-950 hover:text-rose-400 hover:border-red-500/40 transition-all shadow-2xs"
                >
                  {cat.icon} {cat.name}
                </Link>
              ))}
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
