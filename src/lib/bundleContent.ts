import { BundleProduct } from '@/types';

export interface BundleDetailsData {
  overview: string;
  contents: { label: string; value: string }[];
  whoItSuits: string;
  nicheDeepDive: string;
  contentIdeas: { title: string; desc: string }[];
  beforeYouOrder: string;
  audienceCards: {
    title: string;
    description: string;
    tone: string;
    icon: 'creator' | 'affiliate' | 'manager' | 'theme' | 'family' | 'agency';
  }[];
  specItems: {
    label: string;
    value: string;
    icon: string;
    color: string;
  }[];
  faqs: { question: string; answer: string }[];
}

export function getBundleContentDetails(product: BundleProduct): BundleDetailsData {
  const count = product.reelCount || 1000;
  const niche = product.category || 'Reels';
  const title = product.title;

  return {
    overview: `Explore the ${title}, a high-retention curated collection of ${count}+ ready-to-post vertical videos designed specifically for creators, theme page operators, and digital entrepreneurs. Each clip is engineered for high algorithmic reach across Instagram Reels, YouTube Shorts, and Facebook Reels.`,
    
    contents: [
      { label: 'Collection', value: `${count}+ ready-to-post short videos` },
      { label: 'File Format', value: 'MP4 (Universal mobile & desktop video)' },
      { label: 'Package Type', value: 'Digital video / reels bundle' },
      { label: 'Resolution', value: `${product.resolution || '1080P'} Full HD` },
      { label: 'Aspect Ratio', value: '9:16 (Optimized for Reels & Shorts)' },
      { label: 'Audio', value: product.audioIncluded ? 'Viral BGM & Sound Effects Included' : 'Clean Audio Track Included' },
      { label: 'Watermarks', value: 'Zero Watermarks (100% Clean)' },
      { label: 'Delivery', value: 'Instant Google Drive Access Link' },
    ],

    whoItSuits: `This collection is ideal for content creators building pages around ${niche}, social media managers looking to save 20+ hours of editing every week, affiliate marketers driving traffic to digital offers, and entrepreneurs managing faceless Instagram and YouTube channels.`,

    nicheDeepDive: `The ${title} is curated with algorithmic pacing in mind. Every clip leverages proven visual hooks in the first 2-3 seconds to maximize average percentage viewed (APV) and trigger algorithm distribution. With zero watermarks and crisp audio, you can post these clips directly or overlay your own text hooks, captions, and brand handles.`,

    contentIdeas: [
      {
        title: 'Daily Consistent Series',
        desc: 'Post 1 to 2 reels every day consistently at peak engagement hours (6 PM - 9 PM) to trigger the Instagram and YouTube recommendation algorithm.',
      },
      {
        title: 'Curiosity Hooks in Captions',
        desc: 'Pair each reel with an intriguing question or compelling hook in the first sentence of the caption, directing viewers to check your bio link or comment a keyword.',
      },
      {
        title: 'Trending Audio Overlay',
        desc: 'While audio is already included, you can also add currently trending Instagram background tracks at 5-10% volume to ride trending audio waves.',
      },
      {
        title: 'Repurpose Across Multiple Platforms',
        desc: 'Upload each reel simultaneously across Instagram Reels, YouTube Shorts, and Facebook Reels to triple your organic reach from the same video file.',
      },
    ],

    beforeYouOrder: `Review the listed file details and selected license before ordering. All files are hosted on high-speed Google Drive cloud storage. Instant access is provided immediately on the order confirmation screen and sent to your email. Zero watermarks, lifetime storage access, and commercial rights depend on your chosen license plan.`,

    audienceCards: [
      {
        title: 'Content Creators',
        description: `For Instagram creators and YouTube Shorts channels looking to publish daily without spending hours filming.`,
        tone: 'purple',
        icon: 'creator',
      },
      {
        title: 'Affiliate Marketers',
        description: `Drive massive organic search & algorithm traffic to affiliate offers, bio links, and digital products.`,
        tone: 'pink',
        icon: 'affiliate',
      },
      {
        title: 'Social Media Managers',
        description: `Save 20+ hours of editing every week while delivering high-engagement reels to client portfolios.`,
        tone: 'blue',
        icon: 'manager',
      },
      {
        title: 'Theme & Faceless Pages',
        description: `Build profitable faceless media pages from scratch and scale follower engagement and monetization fast.`,
        tone: 'emerald',
        icon: 'theme',
      },
      {
        title: 'Family & Niche Pages',
        description: `High-retention, relatable and entertaining clips that appeal across all demographic groups.`,
        tone: 'orange',
        icon: 'family',
      },
      {
        title: 'Digital Marketers & Agencies',
        description: `Ready-to-deploy vertical assets for brand campaigns, reach expansion, organic SEO, and ads.`,
        tone: 'rose',
        icon: 'agency',
      },
    ],

    specItems: [
      { label: 'Total Reels', value: `${count}+`, icon: 'video', color: 'purple' },
      { label: 'Video Format', value: product.format || 'MP4', icon: 'file', color: 'blue' },
      { label: 'Package Type', value: 'Digital video bundle', icon: 'folder', color: 'cyan' },
      { label: 'Delivery / Storage', value: 'Instant Google Drive', icon: 'cloud', color: 'orange' },
      { label: 'Aspect Ratio', value: '9:16 (Fullscreen)', icon: 'smartphone', color: 'pink' },
      { label: 'Resolution', value: product.resolution || '1080P HD', icon: 'monitor', color: 'violet' },
      { label: 'Audio', value: 'Included', icon: 'volume', color: 'emerald' },
      { label: 'Watermark', value: 'Zero (100% Clean)', icon: 'sparkles', color: 'rose' },
      { label: 'License Access', value: 'Lifetime Access', icon: 'shield', color: 'indigo' },
    ],

    faqs: [
      {
        question: `What is the ${title}?`,
        answer: `It is a premium digital collection of ${count}+ high-definition vertical reels focused on ${niche}. Each video is watermark-free, formatted in 9:16 MP4, and ready to post immediately to Instagram Reels, YouTube Shorts, and Facebook.`,
      },
      {
        question: 'How do I receive the files after payment?',
        answer: 'Delivery is 100% instant and automated. Immediately after completing your payment via UPI, cards, or net banking, you are redirected to the Order Success page with your direct Google Drive download link. You will also receive an email with the link for lifetime access.',
      },
      {
        question: 'Are there any watermarks or logos on the videos?',
        answer: 'No. All videos in this bundle are 100% clean with zero watermarks, brand logos, or intrusive text. You have full freedom to add your own brand logo, handle, or captions.',
      },
      {
        question: 'Can I monetize pages built with these reels?',
        answer: 'Yes! Vertical videos can be used to grow audiences for affiliate marketing, brand sponsorships, digital product sales, and platform creator rewards according to the platform guidelines.',
      },
      {
        question: 'What is the difference between Personal Use and Reseller Rights?',
        answer: 'Personal Use allows you to post the reels on your own social media pages and client accounts. Reseller Rights grants you the complete right to resell the entire bundle to your own customers and keep 100% of the profits.',
      },
      {
        question: 'Can I edit the reels on my mobile phone?',
        answer: 'Yes! The videos are in standard MP4 format and can be imported directly into any mobile video editing app, including CapCut, VN Video Editor, InShot, Canva, or Instagram\'s built-in editor.',
      },
      {
        question: 'Is there an expiration date on the Google Drive link?',
        answer: 'No. You receive lifetime access to the Google Drive folder. You can download the files all at once, or access them clip-by-clip whenever you need them.',
      },
    ],
  };
}
