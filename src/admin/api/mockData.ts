import {
  DailySummary,
  Product,
  CategoryItem,
  Order,
  Customer,
  Coupon,
  ContentItem,
  StoreBranding,
  SiteModeConfig,
  StoreSetupConfig,
  MetaPixelConfig,
  WhatsappButtonConfig,
  WebhookConfig,
  WebhookLogEntry,
  WpPlugin,
  WpTheme,
  ConnectorStatus,
  PgBridgeConfig,
  DnpMetaConfig,
  MmcAnalyticsConfig,
  RankMathConfig,
  LiteSpeedConfig,
  ReelItem,
} from './types';

// Clean initial summary starting with 0 until real orders are placed
export const initialSummary: DailySummary = {
  sales: 0,
  orders: 0,
  customers: 0,
  pending_orders: 0,
  refunded_orders: 0,
  gross_revenue: 0,
  net_revenue: 0,
  average_order_value: 0,
  currency: 'INR',
  currency_symbol: '₹',
  revenue_trend: [
    { date: 'Today', revenue: 0, orders: 0 },
  ],
  top_selling_bundles: [],
  site_mode: 'LIVE',
  connector_status: {
    version: '2.0.0',
    latest_version: '2.0.0',
    update_available: false,
    last_checked: new Date().toISOString(),
  },
};

// All 131 full published products matching store catalog
export const initialProducts: Product[] = [
  {
    "id": "rb-1000-ulti-pulti-duniya-ulti-duniya-reverse-world-ai-reels-bundle",
    "name": "1000+ Ulti Pulti Duniya / Ulti Duniya / Reverse World AI Reels Bundle",
    "slug": "1000-ulti-pulti-duniya-ulti-duniya-reverse-world-ai-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 499,
    "sale_price": 99,
    "reseller_price": 199,
    "reseller_regular_price": 998,
    "stock_status": "instock",
    "categories": [
      "AI Reels"
    ],
    "reel_count": 1000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/1000-ulti-pulti-duniya-ulti-duniya-reverse-world-ai-reels-bundle-2.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/1000-ulti-pulti-duniya-ulti-duniya-reverse-world-ai-reels-bundle-2.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1lXK8icsrN-ggglg53pkZapSixTeBywD4",
    "short_description": "Ulti Duniya Reels Bundle: Explore Hindi reverse-world storytelling with this Ulti Duniya Reels Bundle, also known as the Ulti Pulti Duniya AI Reels Bundle. Review bundle specifications, previews and the selected licen...",
    "description": "Ulti Duniya Reels Bundle: Explore Hindi reverse-world storytelling with this Ulti Duniya Reels Bundle, also known as the Ulti Pulti Duniya AI Reels Bundle. Review bundle specifications, previews and the selected licen...",
    "tags": [
      "HOT",
      "HD",
      "Google Drive"
    ],
    "is_hot": true,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 200,
    "features": [
      "1000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-1000-ulti-pulti-duniya-ulti-duniya-reverse-world-ai-reels-bundle",
        "name": "1000+ Ulti Pulti Duniya / Ulti Duniya / Rever.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1lXK8icsrN-ggglg53pkZapSixTeBywD4"
      }
    ],
    "created_at": "2026-10-13T15:14:00.562Z"
  },
  {
    "id": "rb-upcoming-mad-scientist",
    "name": "1500+ Mad Scientist Reels Bundle – AI Story & Pookie Voice Videos",
    "slug": "1500-mad-scientist-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 399,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "Story Reels"
    ],
    "reel_count": 1500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/1500-mad-scientist-reels-bundle-4-2-1024x768.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/1500-mad-scientist-reels-bundle-4-2.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1CVdhGLvj8P3eyylSjtVmYEXn0txZ5twd",
    "short_description": "Mad Scientist Reels Bundle: The Mad Scientist Reels Bundle focuses on quirky AI scientist characters and story-driven scenes. Review bundle specifications, previews and the selected licence before ordering.",
    "description": "Mad Scientist Reels Bundle: The Mad Scientist Reels Bundle focuses on quirky AI scientist characters and story-driven scenes. Review bundle specifications, previews and the selected licence before ordering.",
    "tags": [
      "HOT",
      "HD",
      "Google Drive"
    ],
    "is_hot": true,
    "is_trending": true,
    "rating": 5,
    "review_count": 237,
    "features": [
      "1500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-1500-mad-scientist-reels-bundle",
        "name": "1500+ Mad Scientist Reels Bundle – AI Story &.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1CVdhGLvj8P3eyylSjtVmYEXn0txZ5twd"
      }
    ],
    "created_at": "2026-10-13T15:14:00.562Z"
  },
  {
    "id": "rb-funny-kids-1500",
    "name": "1500+ AI Funny Kids Reels Bundle – Funny Kids & Baby Videos for Reels",
    "slug": "1500-ai-funny-kids-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 249,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 498,
    "stock_status": "instock",
    "categories": [
      "Kids & Baby Reels"
    ],
    "reel_count": 1500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/1500-ai-funny-kids-reels-bundle-4-2-768x576.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/1500-ai-funny-kids-reels-bundle-4-2.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1of_cQj0SqyJcdozmHAvEr05NlllYxVEc",
    "short_description": "AI-styled funny kids and baby moments with playful family-friendly humour Files: MP4 · 9:16 vertical · HD / Full HD (varies by clip). For creators planning niche-focused Reels, Shorts and social posts. Check the liste...",
    "description": "AI-styled funny kids and baby moments with playful family-friendly humour Files: MP4 · 9:16 vertical · HD / Full HD (varies by clip). For creators planning niche-focused Reels, Shorts and social posts. Check the liste...",
    "tags": [
      "HOT",
      "HD",
      "Google Drive"
    ],
    "is_hot": true,
    "is_trending": true,
    "rating": 5,
    "review_count": 274,
    "features": [
      "1500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-1500-ai-funny-kids-reels-bundle",
        "name": "1500+ AI Funny Kids Reels Bundle – Funny Kids.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1of_cQj0SqyJcdozmHAvEr05NlllYxVEc"
      }
    ],
    "created_at": "2026-10-13T15:14:00.562Z"
  },
  {
    "id": "rb-dr-skeleton-500",
    "name": "500+ Dr Skeleton Health Reels Bundle – Health Awareness & Medical Story Videos",
    "slug": "500-dr-skeleton-health-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 399,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "Health Reels"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/500-dr-skeleton-health-reels-bundle-1-2-768x576.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/500-dr-skeleton-health-reels-bundle-1-2.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1vSJ-ViWk_jKwFsh3uTdl2thXpuCexAN-",
    "short_description": "Dr Skeleton Reels Bundle: This Dr Skeleton Reels Bundle features a doctor-skeleton character in health-awareness and medical-style stories. Review bundle specifications, previews and the selected licence before ordering.",
    "description": "Dr Skeleton Reels Bundle: This Dr Skeleton Reels Bundle features a doctor-skeleton character in health-awareness and medical-style stories. Review bundle specifications, previews and the selected licence before ordering.",
    "tags": [
      "HOT",
      "HD",
      "Google Drive"
    ],
    "is_hot": true,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 311,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-500-dr-skeleton-health-reels-bundle",
        "name": "500+ Dr Skeleton Health Reels Bundle – Health.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1vSJ-ViWk_jKwFsh3uTdl2thXpuCexAN-"
      }
    ],
    "created_at": "2026-10-13T15:14:00.562Z"
  },
  {
    "id": "rb-baby-dance-500",
    "name": "500+ AI Baby Dancing Reels Bundle – Cute Viral Baby Dance Videos",
    "slug": "500-ai-baby-dancing-reels-bundle",
    "status": "publish",
    "price": 59,
    "regular_price": 289,
    "sale_price": 59,
    "reseller_price": 129,
    "reseller_regular_price": 578,
    "stock_status": "instock",
    "categories": [
      "Kids & Baby Reels"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/500-ai-baby-dancing-reels-bundle-4-2-768x576.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/500-ai-baby-dancing-reels-bundle-4-2.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1D-FsxjxkDAZ2-De3X7ovnNlrB5MPZV0f",
    "short_description": "AI Baby Dance Reels Bundle: The AI Baby Dance Reels Bundle brings together cute AI baby dancing and playful movement in a family-friendly entertainment format. Review bundle specifications, previews and the selected l...",
    "description": "AI Baby Dance Reels Bundle: The AI Baby Dance Reels Bundle brings together cute AI baby dancing and playful movement in a family-friendly entertainment format. Review bundle specifications, previews and the selected l...",
    "tags": [
      "HOT",
      "HD",
      "Google Drive"
    ],
    "is_hot": true,
    "is_trending": true,
    "rating": 5,
    "review_count": 348,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-500-ai-baby-dancing-reels-bundle",
        "name": "500+ AI Baby Dancing Reels Bundle – Cute Vira.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1D-FsxjxkDAZ2-De3X7ovnNlrB5MPZV0f"
      }
    ],
    "created_at": "2026-10-13T15:14:00.562Z"
  },
  {
    "id": "rb-health-awareness-450",
    "name": "450+ AI Health Awareness Reels Bundle – Health, Wellness & Nutrition Videos",
    "slug": "450-ai-health-awareness-reels-bundle",
    "status": "publish",
    "price": 89,
    "regular_price": 499,
    "sale_price": 89,
    "reseller_price": 149,
    "reseller_regular_price": 998,
    "stock_status": "instock",
    "categories": [
      "Health Reels"
    ],
    "reel_count": 450,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/450-ai-health-awareness-reels-bundle-4-2-768x576.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/450-ai-health-awareness-reels-bundle-4-2.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1Mu-5JCOzb_mRlmS8I5CHvNV1RBm6iZ4c",
    "short_description": "AI Health Awareness Reels Bundle: The AI Health Awareness Reels Bundle focuses on health, wellness and nutrition-themed visual content. Review bundle specifications, previews and the selected licence before ordering.",
    "description": "AI Health Awareness Reels Bundle: The AI Health Awareness Reels Bundle focuses on health, wellness and nutrition-themed visual content. Review bundle specifications, previews and the selected licence before ordering.",
    "tags": [
      "HOT",
      "HD",
      "Google Drive"
    ],
    "is_hot": true,
    "is_trending": true,
    "rating": 5,
    "review_count": 385,
    "features": [
      "450+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-450-ai-health-awareness-reels-bundle",
        "name": "450+ AI Health Awareness Reels Bundle – Healt.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1Mu-5JCOzb_mRlmS8I5CHvNV1RBm6iZ4c"
      }
    ],
    "created_at": "2026-10-13T15:14:00.562Z"
  },
  {
    "id": "rb-influencer-girls-500",
    "name": "500+ AI Influencer Girls Reels Bundle – Virtual Influencer & AI Girl Videos",
    "slug": "500-ai-influencer-girls-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 399,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "Influencer Reels"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/500-ai-influencer-girls-reels-bundle-4-2-768x576.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/500-ai-influencer-girls-reels-bundle-4-2.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1lXK8icsrN-ggglg53pkZapSixTeBywD4",
    "short_description": "AI Girl Influencer Reels Bundle: This AI Girl Influencer Reels Bundle is the collection listed as AI Influencer Girls Reels Bundle. Review bundle specifications, previews and the selected licence before ordering.",
    "description": "AI Girl Influencer Reels Bundle: This AI Girl Influencer Reels Bundle is the collection listed as AI Influencer Girls Reels Bundle. Review bundle specifications, previews and the selected licence before ordering.",
    "tags": [
      "HOT",
      "HD",
      "Google Drive"
    ],
    "is_hot": true,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 422,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-500-ai-influencer-girls-reels-bundle",
        "name": "500+ AI Influencer Girls Reels Bundle – Virtu.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1lXK8icsrN-ggglg53pkZapSixTeBywD4"
      }
    ],
    "created_at": "2026-10-13T15:14:00.562Z"
  },
  {
    "id": "rb-snake-ulti-500",
    "name": "500+ Snake Ulti Duniya AI Reels Bundle – Saamp Ki Ulti Duniya / Reverse World Videos",
    "slug": "500-snake-ulti-duniya-ai-reels-bundle",
    "status": "publish",
    "price": 49,
    "regular_price": 299,
    "sale_price": 49,
    "reseller_price": 129,
    "reseller_regular_price": 598,
    "stock_status": "instock",
    "categories": [
      "AI Reels"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/500-snake-ulti-duniya-reverse-world-ai-reels-bundle-2-768x576.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/500-snake-ulti-duniya-reverse-world-ai-reels-bundle-2.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1CksKkU1ERAuhD9hgBZNP7xP9g068mG-c?usp=sharing",
    "short_description": "Snake Ulti Duniya AI Files: MP4 · 9:16 vertical · 1080p HD. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "description": "Snake Ulti Duniya AI Files: MP4 · 9:16 vertical · 1080p HD. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "tags": [
      "HOT",
      "HD",
      "Google Drive"
    ],
    "is_hot": true,
    "is_trending": true,
    "rating": 5,
    "review_count": 459,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-500-snake-ulti-duniya-ai-reels-bundle",
        "name": "500+ Snake Ulti Duniya AI Reels Bundle – Saam.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1CksKkU1ERAuhD9hgBZNP7xP9g068mG-c?usp=sharing"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-premanand-ji-maharaj-reel-bundle",
    "name": "1000+ Premanand Ji Maharaj Reels Bundle – Spiritual & Devotional Short Videos",
    "slug": "premanand-ji-maharaj-reel-bundle",
    "status": "publish",
    "price": 49,
    "regular_price": 399,
    "sale_price": 49,
    "reseller_price": 129,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "Devotional & Spiritual"
    ],
    "reel_count": 1000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/premanand-ji-maharaj-reels-bundle-4-2.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/premanand-ji-maharaj-reels-bundle-4-2.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1K6aLaTQteuVbkETjMNSu-qTBcKNauvty",
    "short_description": "Premanand Ji Maharaj Reels Bundle: The Premanand Ji Maharaj Reels Bundle brings together spiritual discourse, devotional wisdom and inspirational clips as described in the supplied listing. Review bundle specification...",
    "description": "Premanand Ji Maharaj Reels Bundle: The Premanand Ji Maharaj Reels Bundle brings together spiritual discourse, devotional wisdom and inspirational clips as described in the supplied listing. Review bundle specification...",
    "tags": [
      "HOT",
      "HD",
      "Google Drive"
    ],
    "is_hot": true,
    "is_trending": true,
    "rating": 5,
    "review_count": 496,
    "features": [
      "1000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-premanand-ji-maharaj-reel-bundle",
        "name": "1000+ Premanand Ji Maharaj Reels Bundle – Spi.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1K6aLaTQteuVbkETjMNSu-qTBcKNauvty"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-1000-rust-restoration-reels-bundle",
    "name": "1000+ Rust Restoration Reels Bundle – Satisfying Before & After Videos",
    "slug": "1000-rust-restoration-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 199,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 398,
    "stock_status": "instock",
    "categories": [
      "DIY Reels"
    ],
    "reel_count": 1000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/1000-rust-restoration-reels-bundle-2-1.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/1000-rust-restoration-reels-bundle-2-1.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1OwXW9RMhUzgkef_ONsB_BuBPL0X8EQ9f",
    "short_description": "Rust Restoration Reels Bundle: The Rust Restoration Reels Bundle focuses on rust removal, cleaning, repair, polishing and transformations of old tools or metal objects. Review bundle specifications, previews and the s...",
    "description": "Rust Restoration Reels Bundle: The Rust Restoration Reels Bundle focuses on rust removal, cleaning, repair, polishing and transformations of old tools or metal objects. Review bundle specifications, previews and the s...",
    "tags": [
      "HOT",
      "HD",
      "Google Drive"
    ],
    "is_hot": true,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 213,
    "features": [
      "1000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-1000-rust-restoration-reels-bundle",
        "name": "1000+ Rust Restoration Reels Bundle – Satisfy.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1OwXW9RMhUzgkef_ONsB_BuBPL0X8EQ9f"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-stickman-2500",
    "name": "2500+ Stickman Animation Reels Bundle – Funny Viral Stick Figure Videos",
    "slug": "2500-stickman-animation-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 199,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 398,
    "stock_status": "instock",
    "categories": [
      "Art & Animation Reels"
    ],
    "reel_count": 2500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/2500-stickman-animation-reels-bundle-2-1024x768.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/2500-stickman-animation-reels-bundle-2.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1yuOoZ2f7P3tdj8ubF_J-hLEkts0jXmW3",
    "short_description": "Stickman Animation Reels Bundle: The Stickman Animation Reels Bundle focuses on funny stick-figure scenes, relatable daily-life situations, action and storytelling. Review bundle specifications, previews and the selec...",
    "description": "Stickman Animation Reels Bundle: The Stickman Animation Reels Bundle focuses on funny stick-figure scenes, relatable daily-life situations, action and storytelling. Review bundle specifications, previews and the selec...",
    "tags": [
      "HOT",
      "HD",
      "Google Drive"
    ],
    "is_hot": true,
    "is_trending": true,
    "rating": 5,
    "review_count": 250,
    "features": [
      "2500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-2500-stickman-animation-reels-bundle",
        "name": "2500+ Stickman Animation Reels Bundle – Funny.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1yuOoZ2f7P3tdj8ubF_J-hLEkts0jXmW3"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-ai-monkey-vlogging-reels-bundle",
    "name": "500+ AI Monkey Vlogging Reels Bundle – Funny AI Monkey Vlog Videos",
    "slug": "ai-monkey-vlogging-reels-bundle",
    "status": "publish",
    "price": 89,
    "regular_price": 399,
    "sale_price": 89,
    "reseller_price": 149,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "Animals & Nature Reels"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/ai_monkey_vlogging_reels_bundle-reels-bundle-5-2.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/ai_monkey_vlogging_reels_bundle-reels-bundle-5-2.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1XJJb-JvApUfR5mVlssZrzC36B1p8ltaU",
    "short_description": "AI Monkey Reels Bundle: The AI Monkey Reels Bundle is listed here as AI Monkey Vlogging Reels Bundle. Review bundle specifications, previews and the selected licence before ordering.",
    "description": "AI Monkey Reels Bundle: The AI Monkey Reels Bundle is listed here as AI Monkey Vlogging Reels Bundle. Review bundle specifications, previews and the selected licence before ordering.",
    "tags": [
      "HOT",
      "HD",
      "Google Drive"
    ],
    "is_hot": true,
    "is_trending": true,
    "rating": 5,
    "review_count": 287,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-ai-monkey-vlogging-reels-bundle",
        "name": "500+ AI Monkey Vlogging Reels Bundle – Funny.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1XJJb-JvApUfR5mVlssZrzC36B1p8ltaU"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-1200-glass-cutting-asmr-reels-bundle",
    "name": "1200+ AI Glass Cutting ASMR Reels Bundle – Satisfying ASMR Videos for Reels & Shorts",
    "slug": "1200-glass-cutting-asmr-reels-bundle",
    "status": "publish",
    "price": 79,
    "regular_price": 399,
    "sale_price": 79,
    "reseller_price": 149,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "AI Reels"
    ],
    "reel_count": 1200,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/1200-glass-cutting-asmr-reels-bundle-4-2.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/1200-glass-cutting-asmr-reels-bundle-4-2.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1zgV15R7qa6qPcY7upFQ6qngLXKzYlyQZ",
    "short_description": "AI Glass Cutting ASMR Reels Bundle: The AI Glass Cutting ASMR Reels Bundle focuses on AI glass-cutting scenes and oddly satisfying short-form visuals. Review bundle specifications, previews and the selected licence be...",
    "description": "AI Glass Cutting ASMR Reels Bundle: The AI Glass Cutting ASMR Reels Bundle focuses on AI glass-cutting scenes and oddly satisfying short-form visuals. Review bundle specifications, previews and the selected licence be...",
    "tags": [
      "HOT",
      "HD",
      "Google Drive"
    ],
    "is_hot": true,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 324,
    "features": [
      "1200+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-1200-glass-cutting-asmr-reels-bundle",
        "name": "1200+ AI Glass Cutting ASMR Reels Bundle – Sa.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1zgV15R7qa6qPcY7upFQ6qngLXKzYlyQZ"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-500-ai-miniature-reels-bundle",
    "name": "500+ AI Miniature Reels Bundle – Tiny Workers & Miniature World Videos",
    "slug": "500-ai-miniature-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 399,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "Entertainment Reels"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/ai_miniature_reels_pack_poster-reels-bundle-7-2.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/ai_miniature_reels_pack_poster-reels-bundle-7-2.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1lXK8icsrN-ggglg53pkZapSixTeBywD4",
    "short_description": "Mini AI Workers Reels Bundle: The Mini AI Workers Reels Bundle is listed as AI Miniature Reels Bundle – Tiny Workers & Miniature World Videos. Review bundle specifications, previews and the selected licence before ord...",
    "description": "Mini AI Workers Reels Bundle: The Mini AI Workers Reels Bundle is listed as AI Miniature Reels Bundle – Tiny Workers & Miniature World Videos. Review bundle specifications, previews and the selected licence before ord...",
    "tags": [
      "HOT",
      "HD",
      "Google Drive"
    ],
    "is_hot": true,
    "is_trending": true,
    "rating": 5,
    "review_count": 361,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-500-ai-miniature-reels-bundle",
        "name": "500+ AI Miniature Reels Bundle – Tiny Workers.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1lXK8icsrN-ggglg53pkZapSixTeBywD4"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-5000-trending-ai-anime-reels-bundle",
    "name": "5000+ Trending AI Anime Reels Bundle – Viral Anime & Animated Short Videos",
    "slug": "5000-trending-ai-anime-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 399,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "Anime Reels"
    ],
    "reel_count": 5000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/5000-trending-ai-anime-reels-bundle-4-2.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/5000-trending-ai-anime-reels-bundle-4-2.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1GotSOpN8Wg82R0gkxn_ZXc6KbDuk7ANa?usp=drive_link",
    "short_description": "AI Anime Reels Bundle: The AI Anime Reels Bundle is this store’s Trending AI Anime collection, built around AI anime characters and animated scenes. Review bundle specifications, previews and the selected licence befo...",
    "description": "AI Anime Reels Bundle: The AI Anime Reels Bundle is this store’s Trending AI Anime collection, built around AI anime characters and animated scenes. Review bundle specifications, previews and the selected licence befo...",
    "tags": [
      "HOT",
      "HD",
      "Google Drive"
    ],
    "is_hot": true,
    "is_trending": true,
    "rating": 5,
    "review_count": 398,
    "features": [
      "5000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-5000-trending-ai-anime-reels-bundle",
        "name": "5000+ Trending AI Anime Reels Bundle – Viral.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1GotSOpN8Wg82R0gkxn_ZXc6KbDuk7ANa?usp=drive_link"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-mega-car-reels-bundle",
    "name": "3,000+ Mega Car Reels Bundle – Premium 720p Videos",
    "slug": "mega-car-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 495,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 990,
    "stock_status": "instock",
    "categories": [
      "Cars & Vehicles"
    ],
    "reel_count": 0,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/mega-car-reels-bundle-3.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/mega-car-reels-bundle-3.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1xyepyNXc_j_ThL0A_vzfqTek5g4BRKJm",
    "short_description": "Car Reels Bundle: The Car Reels Bundle is listed here as Mega Car Reels Bundle. Review bundle specifications, previews and the selected licence before ordering.",
    "description": "Car Reels Bundle: The Car Reels Bundle is listed here as Mega Car Reels Bundle. Review bundle specifications, previews and the selected licence before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 435,
    "features": [
      "0+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-mega-car-reels-bundle",
        "name": "3,000+ Mega Car Reels Bundle – Premium 720p V.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1xyepyNXc_j_ThL0A_vzfqTek5g4BRKJm"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-9000-art-craft-reels-bundle",
    "name": "9000+ Art & Craft Reels Bundle – DIY Art, Craft & Creative Videos",
    "slug": "9000-art-craft-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 399,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "DIY Reels"
    ],
    "reel_count": 9000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/9000_art_craft_reels_bundle-reels-bundle-5-2.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/9000_art_craft_reels_bundle-reels-bundle-5-2.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1uvX4I50ffSWSI4I0391SHuMA87ap8MEL?usp=share_link",
    "short_description": "Art & Craft Reels Bundle: The Art & Craft Reels Bundle is the 9000+ collection focused on art, craft, DIY and creative-process videos. Review bundle specifications, previews and the selected licence before ordering.",
    "description": "Art & Craft Reels Bundle: The Art & Craft Reels Bundle is the 9000+ collection focused on art, craft, DIY and creative-process videos. Review bundle specifications, previews and the selected licence before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 472,
    "features": [
      "9000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-9000-art-craft-reels-bundle",
        "name": "9000+ Art & Craft Reels Bundle – DIY Art, Cra.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1uvX4I50ffSWSI4I0391SHuMA87ap8MEL?usp=share_link"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-twisted-3200",
    "name": "3200+ Ultimate Twisted World Reel Bundle – Fantasy Creature & Twisted World Stories",
    "slug": "3200-ultimate-twisted-world-reel-bundle",
    "status": "publish",
    "price": 199,
    "regular_price": 399,
    "sale_price": 199,
    "reseller_price": 199,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "Fantasy Reels"
    ],
    "reel_count": 3200,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/3200-ultimate-twisted-world-reel-bundle-reels-bundle-1-2-768x576.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/3200-ultimate-twisted-world-reel-bundle-reels-bundle-1-2.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1zUBkXWAQozA4f28W8AhhFKpg94qLVw3F?usp=sharing",
    "short_description": "Fantasy creatures, twisted worlds and imaginative animated story scenes Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check the listed ...",
    "description": "Fantasy creatures, twisted worlds and imaginative animated story scenes Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check the listed ...",
    "tags": [
      "HOT",
      "HD",
      "Google Drive"
    ],
    "is_hot": true,
    "is_trending": true,
    "rating": 5,
    "review_count": 509,
    "features": [
      "3200+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-3200-ultimate-twisted-world-reel-bundle",
        "name": "3200+ Ultimate Twisted World Reel Bundle – Fa.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1zUBkXWAQozA4f28W8AhhFKpg94qLVw3F?usp=sharing"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-600-ai-baby-podcast-bundle",
    "name": "600+ AI Baby Podcast Bundle – Cute Viral Baby Podcast Videos",
    "slug": "600-ai-baby-podcast-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 399,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "Kids & Baby Reels"
    ],
    "reel_count": 600,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/600-ai-baby-podcast-bundle-reels-bundle-5-2.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/600-ai-baby-podcast-bundle-reels-bundle-5-2.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/13sRBc7fYdv5POO4Gh4SOJJBLacrFXazA",
    "short_description": "Cute AI baby hosts, podcast-style conversations and funny talking-baby scenes Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check the l...",
    "description": "Cute AI baby hosts, podcast-style conversations and funny talking-baby scenes Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check the l...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 226,
    "features": [
      "600+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-600-ai-baby-podcast-bundle",
        "name": "600+ AI Baby Podcast Bundle – Cute Viral Baby.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/13sRBc7fYdv5POO4Gh4SOJJBLacrFXazA"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-500-ai-hulk-story-reels-bundle",
    "name": "500+ AI Hulk Story Reels Bundle – AI Action & Superhero Story Videos",
    "slug": "500-ai-hulk-story-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 249,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 498,
    "stock_status": "instock",
    "categories": [
      "Story Reels"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/ai-hulk-reels-bundle-4-2.webp",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/ai-hulk-reels-bundle-4-2.webp"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1Z2CwE7IuC15fIieUqtAv0h6-1zrCtLUD",
    "short_description": "AI action and superhero-style story content a powerful green hero character Files: MP4 · 9:16 vertical · HD / Full HD (varies by reel). For creators planning niche-focused Reels, Shorts and social posts. Check the lis...",
    "description": "AI action and superhero-style story content a powerful green hero character Files: MP4 · 9:16 vertical · HD / Full HD (varies by reel). For creators planning niche-focused Reels, Shorts and social posts. Check the lis...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 263,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-500-ai-hulk-story-reels-bundle",
        "name": "500+ AI Hulk Story Reels Bundle – AI Action &.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1Z2CwE7IuC15fIieUqtAv0h6-1zrCtLUD"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-upcoming-gym-animated",
    "name": "1000+ Animated Gym Workout Reels Bundle – Animated Fitness & Workout Videos",
    "slug": "1000-animated-gym-workout-reels-bundle",
    "status": "publish",
    "price": 129,
    "regular_price": 399,
    "sale_price": 129,
    "reseller_price": 199,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "Fitness & Sports"
    ],
    "reel_count": 1000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/animated_gym_reels_bundle-reels-bundle-7-2-1024x768.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/animated_gym_reels_bundle-reels-bundle-7-2.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1vBx4tzfMJGCUNlg-78YMbbq6qCqr6CQF",
    "short_description": "Animated exercise demonstrations, gym movements and fitness-focused short videos Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check th...",
    "description": "Animated exercise demonstrations, gym movements and fitness-focused short videos Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check th...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 300,
    "features": [
      "1000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-1000-animated-gym-workout-reels-bundle",
        "name": "1000+ Animated Gym Workout Reels Bundle – Ani.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1vBx4tzfMJGCUNlg-78YMbbq6qCqr6CQF"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-ai-hindi-story-reels-bundle",
    "name": "AI Hindi Story Reels Bundle – 1-Minute Hindi Kahani & Story Videos",
    "slug": "ai-hindi-story-reels-bundle",
    "status": "publish",
    "price": 59,
    "regular_price": 399,
    "sale_price": 59,
    "reseller_price": 129,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "Story Reels"
    ],
    "reel_count": 1000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/ai_hindi_story_reels_bundle-reels-bundle-5-2.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/ai_hindi_story_reels_bundle-reels-bundle-5-2.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1lbPsLSl_18aMRjS0l3aJXka5in9jhDLe?usp=sharing",
    "short_description": "Hindi kahani and short story videos designed around concise one-minute narratives Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check t...",
    "description": "Hindi kahani and short story videos designed around concise one-minute narratives Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check t...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 337,
    "features": [
      "1000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-ai-hindi-story-reels-bundle",
        "name": "AI Hindi Story Reels Bundle – 1-Minute Hindi.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1lbPsLSl_18aMRjS0l3aJXka5in9jhDLe?usp=sharing"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-1000-ai-story-reels-bundle",
    "name": "1000+ AI Story Reels Bundle – Viral AI Story Videos for Social Media",
    "slug": "1000-ai-story-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 399,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "Story Reels"
    ],
    "reel_count": 1000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/1000_ai_story_reels_bundle-reels-bundle-7-2.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/1000_ai_story_reels_bundle-reels-bundle-7-2.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1G377wwyyilxxaBuDamJZsnR2j8emleN5",
    "short_description": "AI-generated short stories, character moments and narrative visuals Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check the listed deta...",
    "description": "AI-generated short stories, character moments and narrative visuals Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check the listed deta...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 374,
    "features": [
      "1000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-1000-ai-story-reels-bundle",
        "name": "1000+ AI Story Reels Bundle – Viral AI Story.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1G377wwyyilxxaBuDamJZsnR2j8emleN5"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-ai-cats-reels-bundle",
    "name": "700+ AI Cats Reels Bundle – Cute Viral Cat Videos for Reels & Shorts",
    "slug": "ai-cats-reels-bundle",
    "status": "publish",
    "price": 69,
    "regular_price": 299,
    "sale_price": 69,
    "reseller_price": 149,
    "reseller_regular_price": 598,
    "stock_status": "instock",
    "categories": [
      "Animals & Nature Reels"
    ],
    "reel_count": 700,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/ai-cats-reels-bundle-5-2.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/ai-cats-reels-bundle-5-2.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1bnJYTUN-rVq1syfZ0gN_5OrYyshbe_Fw",
    "short_description": "Cute and entertaining AI-styled cat videos with expressive pet moments Files: MP4 · 9:16 vertical · 720 × 1280 (HD). For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and lic...",
    "description": "Cute and entertaining AI-styled cat videos with expressive pet moments Files: MP4 · 9:16 vertical · 720 × 1280 (HD). For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and lic...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 411,
    "features": [
      "700+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-ai-cats-reels-bundle",
        "name": "700+ AI Cats Reels Bundle – Cute Viral Cat Vi.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1bnJYTUN-rVq1syfZ0gN_5OrYyshbe_Fw"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-ai-dogs-reels-bundle",
    "name": "1000+ AI Dogs Reels Bundle – Viral Dog & Pet Videos for Reels & Shorts",
    "slug": "ai-dogs-reels-bundle",
    "status": "publish",
    "price": 79,
    "regular_price": 349,
    "sale_price": 79,
    "reseller_price": 149,
    "reseller_regular_price": 698,
    "stock_status": "instock",
    "categories": [
      "Animals & Nature Reels"
    ],
    "reel_count": 1000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/ai-dogs-reels-bundle-5-2.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/ai-dogs-reels-bundle-5-2.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1VIrNbAvfy-iVRttNRKKdagAW8B1Q2fV_",
    "short_description": "AI-styled dog and pet content cute, funny and shareable moments Files: MP4 · 9:16 vertical · 720 × 1280 (HD). For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license be...",
    "description": "AI-styled dog and pet content cute, funny and shareable moments Files: MP4 · 9:16 vertical · 720 × 1280 (HD). For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license be...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 448,
    "features": [
      "1000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-ai-dogs-reels-bundle",
        "name": "1000+ AI Dogs Reels Bundle – Viral Dog & Pet.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1VIrNbAvfy-iVRttNRKKdagAW8B1Q2fV_"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-ai-funny-5000",
    "name": "5000+ AI Funny Reels Bundle – Viral AI Comedy & Funny Videos",
    "slug": "ai-funny-reels-bundle",
    "status": "publish",
    "price": 139,
    "regular_price": 699,
    "sale_price": 139,
    "reseller_price": 199,
    "reseller_regular_price": 1398,
    "stock_status": "instock",
    "categories": [
      "Comedy Reels"
    ],
    "reel_count": 5000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/ai-funny-reels-bundle-4-2-768x576.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/ai-funny-reels-bundle-4-2.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1RW0s9SkE-yctXnzP88p8NKxGBF9u2hC4",
    "short_description": "AI-generated comedy, funny situations and meme-friendly short videos Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "description": "AI-generated comedy, funny situations and meme-friendly short videos Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 485,
    "features": [
      "5000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-ai-funny-reels-bundle",
        "name": "5000+ AI Funny Reels Bundle – Viral AI Comedy.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1RW0s9SkE-yctXnzP88p8NKxGBF9u2hC4"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-5000-ai-funny-story-reels-bundle",
    "name": "5000+ AI Funny Story Reels Bundle – Viral AI Comedy Story Videos",
    "slug": "5000-ai-funny-story-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 399,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "Comedy Reels"
    ],
    "reel_count": 5000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/5000-ai-funny-story-reels-bundle-1-2.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/5000-ai-funny-story-reels-bundle-1-2.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1ruIFMzQ7vNv2cm3nPV0AJv_xCcB16nL4",
    "short_description": "AI comedy stories, animated funny characters and entertaining short narratives Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check the ...",
    "description": "AI comedy stories, animated funny characters and entertaining short narratives Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check the ...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 202,
    "features": [
      "5000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-5000-ai-funny-story-reels-bundle",
        "name": "5000+ AI Funny Story Reels Bundle – Viral AI.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1ruIFMzQ7vNv2cm3nPV0AJv_xCcB16nL4"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-ai-3d-cartoon-reels-bundle",
    "name": "AI 3D Cartoon Reels Bundle – Viral 3D Cartoon Story Videos",
    "slug": "ai-3d-cartoon-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 499,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 998,
    "stock_status": "instock",
    "categories": [
      "Art & Animation Reels"
    ],
    "reel_count": 1000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/ai-3d-cartoon-reels-bundle-1-2.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/ai-3d-cartoon-reels-bundle-1-2.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1W4-qvHY3eVqBzT6EDm6CJmP5ENDdSVBh?usp=drive_link",
    "short_description": "3D cartoon characters, animated story scenes and expressive AI-style visual content Files: MP4 · 9:16 vertical · HD / Full HD (verify source files). For creators planning niche-focused Reels, Shorts and social posts. ...",
    "description": "3D cartoon characters, animated story scenes and expressive AI-style visual content Files: MP4 · 9:16 vertical · HD / Full HD (verify source files). For creators planning niche-focused Reels, Shorts and social posts. ...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 239,
    "features": [
      "1000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-ai-3d-cartoon-reels-bundle",
        "name": "AI 3D Cartoon Reels Bundle – Viral 3D Cartoon.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1W4-qvHY3eVqBzT6EDm6CJmP5ENDdSVBh?usp=drive_link"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-600-ghibli-style-reels-bundle",
    "name": "600+ Ghibli Style Reels Bundle – Anime-Inspired Story & Aesthetic Videos",
    "slug": "600-ghibli-style-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 399,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "Anime Reels"
    ],
    "reel_count": 600,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/600-ghibli-style-reels-bundle-5-2.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/600-ghibli-style-reels-bundle-5-2.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1saR2zoFd47npssYG0PnUeY8HMD5Zky5o",
    "short_description": "Warm anime-inspired scenes, whimsical characters and cinematic animated storytelling Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Chec...",
    "description": "Warm anime-inspired scenes, whimsical characters and cinematic animated storytelling Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Chec...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 276,
    "features": [
      "600+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-600-ghibli-style-reels-bundle",
        "name": "600+ Ghibli Style Reels Bundle – Anime-Inspir.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1saR2zoFd47npssYG0PnUeY8HMD5Zky5o"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-faceless-ai-tech-reels-bundle",
    "name": "2000+ Faceless AI Tech Reels Bundle – AI, Technology & Future-Tech Videos",
    "slug": "faceless-ai-tech-reels-bundle",
    "status": "publish",
    "price": 119,
    "regular_price": 599,
    "sale_price": 119,
    "reseller_price": 199,
    "reseller_regular_price": 1198,
    "stock_status": "instock",
    "categories": [
      "AI Reels"
    ],
    "reel_count": 2000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/faceless-ai-tech-reels-bundle-4-2.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/faceless-ai-tech-reels-bundle-4-2.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1QihzRWsY3AupO4suLSDp1VOQIKfb3hXm",
    "short_description": "AI, technology, futuristic concepts and faceless tech-oriented visuals Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "description": "AI, technology, futuristic concepts and faceless tech-oriented visuals Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 313,
    "features": [
      "2000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-faceless-ai-tech-reels-bundle",
        "name": "2000+ Faceless AI Tech Reels Bundle – AI, Tec.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1QihzRWsY3AupO4suLSDp1VOQIKfb3hXm"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-pubg-bgmi-reels-bundle",
    "name": "2000+ PUBG BGMI Reels Bundle – Battle Clips & Gaming Edits",
    "slug": "pubg-bgmi-reels-bundle",
    "status": "publish",
    "price": 129,
    "regular_price": 649,
    "sale_price": 129,
    "reseller_price": 199,
    "reseller_regular_price": 1298,
    "stock_status": "instock",
    "categories": [
      "Gaming Reels"
    ],
    "reel_count": 2000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/pubg-bgmi-reels-bundle-2-5-2.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/pubg-bgmi-reels-bundle-2-5-2.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/10GYoFNhVUcJH0-uCTjV6gbQ9GUFqn1kT",
    "short_description": "PUBG and BGMI battle clips, edits and gaming highlights Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "description": "PUBG and BGMI battle clips, edits and gaming highlights Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 350,
    "features": [
      "2000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-pubg-bgmi-reels-bundle",
        "name": "2000+ PUBG BGMI Reels Bundle – Battle Clips &.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/10GYoFNhVUcJH0-uCTjV6gbQ9GUFqn1kT"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-free-fire-reels-bundle",
    "name": "3500+ Free Fire Reels Bundle – Gaming Clips & Edits for Reels & Shorts",
    "slug": "free-fire-reels-bundle",
    "status": "publish",
    "price": 149,
    "regular_price": 749,
    "sale_price": 149,
    "reseller_price": 199,
    "reseller_regular_price": 1498,
    "stock_status": "instock",
    "categories": [
      "Gaming Reels"
    ],
    "reel_count": 3500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/free-fire-reels-bundle-2-5-2.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/free-fire-reels-bundle-2-5-2.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1o4MMXlLZ3XxKtovFDMGgT9v7sHiP6c1b",
    "short_description": "Free Fire gaming clips, edits and action-oriented short videos Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "description": "Free Fire gaming clips, edits and action-oriented short videos Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 387,
    "features": [
      "3500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-free-fire-reels-bundle",
        "name": "3500+ Free Fire Reels Bundle – Gaming Clips &.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1o4MMXlLZ3XxKtovFDMGgT9v7sHiP6c1b"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-gym-fitness-reels-bundle",
    "name": "2,200+ Gym & Fitness Reels Bundle – Premium 720p Videos",
    "slug": "gym-fitness-reels-bundle",
    "status": "publish",
    "price": 79,
    "regular_price": 395,
    "sale_price": 79,
    "reseller_price": 149,
    "reseller_regular_price": 790,
    "stock_status": "instock",
    "categories": [
      "Fitness & Sports"
    ],
    "reel_count": 200,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/gym-fitness-reels-bundle-3.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/gym-fitness-reels-bundle-3.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1n9s_PYqWku13IDw1SwlsnVmH5rfXR_A8",
    "short_description": "✨ Gym & Fitness Reels Bundle includes 2,200+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated fil...",
    "description": "✨ Gym & Fitness Reels Bundle includes 2,200+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated fil...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 424,
    "features": [
      "200+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-gym-fitness-reels-bundle",
        "name": "2,200+ Gym & Fitness Reels Bundle – Premium 7.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1n9s_PYqWku13IDw1SwlsnVmH5rfXR_A8"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-hindi-mot-1400",
    "name": "1,400+ Hindi Motivational Reels Bundle – Premium 720p Videos",
    "slug": "hindi-motivational-reels-bundle",
    "status": "publish",
    "price": 79,
    "regular_price": 395,
    "sale_price": 79,
    "reseller_price": 149,
    "reseller_regular_price": 790,
    "stock_status": "instock",
    "categories": [
      "Motivation & Mindset"
    ],
    "reel_count": 400,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/hindi-motivational-reels-bundle-7-768x576.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/hindi-motivational-reels-bundle-7.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1XZ00wKCxPruEpTyDmRxtLzP3GxPG3N1W",
    "short_description": "✨ Hindi Motivational Reels Bundle includes 1,400+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi content with an estimated file siz...",
    "description": "✨ Hindi Motivational Reels Bundle includes 1,400+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi content with an estimated file siz...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 461,
    "features": [
      "400+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-hindi-motivational-reels-bundle",
        "name": "1,400+ Hindi Motivational Reels Bundle – Prem.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1XZ00wKCxPruEpTyDmRxtLzP3GxPG3N1W"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-ai-motivational-reels-bundle",
    "name": "600+ AI Motivational Reels Bundle – Viral Motivation & Success Videos",
    "slug": "ai-motivational-reels-bundle",
    "status": "publish",
    "price": 69,
    "regular_price": 299,
    "sale_price": 69,
    "reseller_price": 149,
    "reseller_regular_price": 598,
    "stock_status": "instock",
    "categories": [
      "Motivation & Mindset"
    ],
    "reel_count": 600,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/ai-motivational-reels-bundle-5-2.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/ai-motivational-reels-bundle-5-2.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1kj3D8LqbD-hMOVOD8i0yroA6o3HTdtpp?usp=sharing",
    "short_description": "AI-styled motivation, mindset and success-oriented videos Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "description": "AI-styled motivation, mindset and success-oriented videos Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 498,
    "features": [
      "600+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-ai-motivational-reels-bundle",
        "name": "600+ AI Motivational Reels Bundle – Viral Mot.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1kj3D8LqbD-hMOVOD8i0yroA6o3HTdtpp?usp=sharing"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-satisfying-reels-bundle",
    "name": "500+ Satisfying Reels Bundle – Premium 720p Videos",
    "slug": "satisfying-reels-bundle",
    "status": "publish",
    "price": 59,
    "regular_price": 295,
    "sale_price": 59,
    "reseller_price": 129,
    "reseller_regular_price": 590,
    "stock_status": "instock",
    "categories": [
      "ASMR Reels"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/satisfying-reels-bundle.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/satisfying-reels-bundle.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1jzhyjsiKPRWJSZZSsasz4qq8Kq9qapV5",
    "short_description": "✨ Satisfying Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file siz...",
    "description": "✨ Satisfying Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file siz...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 215,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-satisfying-reels-bundle",
        "name": "500+ Satisfying Reels Bundle – Premium 720p V.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1jzhyjsiKPRWJSZZSsasz4qq8Kq9qapV5"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-nature-reels-bundle",
    "name": "1,000+ Nature Reels Bundle – Premium 720p Videos",
    "slug": "nature-reels-bundle",
    "status": "publish",
    "price": 69,
    "regular_price": 345,
    "sale_price": 69,
    "reseller_price": 149,
    "reseller_regular_price": 690,
    "stock_status": "instock",
    "categories": [
      "Aesthetic Reels"
    ],
    "reel_count": 0,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/nature-reels-bundle.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/nature-reels-bundle.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1C01i82juFKh7IvP42VhRwDz4PVcMsbRl",
    "short_description": "✨ Nature Reels Bundle includes 1,000+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file size ...",
    "description": "✨ Nature Reels Bundle includes 1,000+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file size ...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 252,
    "features": [
      "0+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-nature-reels-bundle",
        "name": "1,000+ Nature Reels Bundle – Premium 720p Vid.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1C01i82juFKh7IvP42VhRwDz4PVcMsbRl"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-woodwork-reels-bundle",
    "name": "1,000+ Woodwork Reels Bundle – Premium 720p Videos",
    "slug": "woodwork-reels-bundle",
    "status": "publish",
    "price": 69,
    "regular_price": 345,
    "sale_price": 69,
    "reseller_price": 149,
    "reseller_regular_price": 690,
    "stock_status": "instock",
    "categories": [
      "Art & Animation Reels"
    ],
    "reel_count": 0,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/woodwork-reels-bundle.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/woodwork-reels-bundle.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1J7byJvBRrULtgysJ9eeXF7pWWtISxsIU",
    "short_description": "✨ Woodwork Reels Bundle includes 1,000+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file siz...",
    "description": "✨ Woodwork Reels Bundle includes 1,000+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file siz...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 289,
    "features": [
      "0+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-woodwork-reels-bundle",
        "name": "1,000+ Woodwork Reels Bundle – Premium 720p V.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1J7byJvBRrULtgysJ9eeXF7pWWtISxsIU"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-travel-tourism-reels-bundle",
    "name": "3,500+ Travel & Tourism Reels Bundle",
    "slug": "travel-tourism-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 495,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 990,
    "stock_status": "instock",
    "categories": [
      "Lifestyle & Luxury"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/travel-tourism-reels-bundle-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/travel-tourism-reels-bundle-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1JRQJT6nav8ck4Io20evLRZye3X5bwwbr",
    "short_description": "3,500+ Travel & Tourism Reels Bundle: a themed collection featuring travel destinations, scenic journeys and tourism-focused videos. Digital access is provided on the Thank You page and by email after successful payment.",
    "description": "3,500+ Travel & Tourism Reels Bundle: a themed collection featuring travel destinations, scenic journeys and tourism-focused videos. Digital access is provided on the Thank You page and by email after successful payment.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 326,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-travel-tourism-reels-bundle",
        "name": "3,500+ Travel & Tourism Reels Bundle.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1JRQJT6nav8ck4Io20evLRZye3X5bwwbr"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-funny-fails-reels-bundle",
    "name": "5500+ Funny Fails Reels Bundle – Funny Fails & Viral Comedy Clips",
    "slug": "funny-fails-reels-bundle",
    "status": "publish",
    "price": 159,
    "regular_price": 799,
    "sale_price": 159,
    "reseller_price": 199,
    "reseller_regular_price": 1598,
    "stock_status": "instock",
    "categories": [
      "Comedy Reels"
    ],
    "reel_count": 5500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/funny-fails-reels-bundle-4-2.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/funny-fails-reels-bundle-4-2.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1eFbpXREAMtzb4YyLKdZ9s4tx4MrH9w7l",
    "short_description": "Funny fails, unexpected moments and shareable comedy clips Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "description": "Funny fails, unexpected moments and shareable comedy clips Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 363,
    "features": [
      "5500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-funny-fails-reels-bundle",
        "name": "5500+ Funny Fails Reels Bundle – Funny Fails.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1eFbpXREAMtzb4YyLKdZ9s4tx4MrH9w7l"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-podcast-reels-bundle",
    "name": "3,100+ Podcast Reels Bundle",
    "slug": "podcast-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 495,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 990,
    "stock_status": "instock",
    "categories": [
      "Podcast Reels"
    ],
    "reel_count": 100,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/podcast-reels-bundle-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/podcast-reels-bundle-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1SS373xT-XsdvYf21Gd8taTWBLPksq3lt",
    "short_description": "3,100+ Podcast Reels Bundle: a themed collection featuring podcast moments, conversation clips and discussion-led short content. Digital access is provided on the Thank You page and by email after successful payment.",
    "description": "3,100+ Podcast Reels Bundle: a themed collection featuring podcast moments, conversation clips and discussion-led short content. Digital access is provided on the Thank You page and by email after successful payment.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 400,
    "features": [
      "100+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-podcast-reels-bundle",
        "name": "3,100+ Podcast Reels Bundle.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1SS373xT-XsdvYf21Gd8taTWBLPksq3lt"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-slowed-reels-bundle",
    "name": "1,000+ Slowed Reels Bundle",
    "slug": "slowed-reels-bundle",
    "status": "publish",
    "price": 69,
    "regular_price": 345,
    "sale_price": 69,
    "reseller_price": 149,
    "reseller_regular_price": 690,
    "stock_status": "instock",
    "categories": [
      "Aesthetic Reels"
    ],
    "reel_count": 0,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/slowed-reels-bundle-1-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/slowed-reels-bundle-1-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/16T-xOwRrYpNXKsmFnoO16o_K5AE5YZcW",
    "short_description": "1,000+ Slowed Reels Bundle: a themed collection featuring slow-paced mood visuals, atmospheric scenes and aesthetic edits. Digital access is provided on the Thank You page and by email after successful payment.",
    "description": "1,000+ Slowed Reels Bundle: a themed collection featuring slow-paced mood visuals, atmospheric scenes and aesthetic edits. Digital access is provided on the Thank You page and by email after successful payment.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 437,
    "features": [
      "0+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-slowed-reels-bundle",
        "name": "1,000+ Slowed Reels Bundle.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/16T-xOwRrYpNXKsmFnoO16o_K5AE5YZcW"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-call-of-duty-reels-bundle",
    "name": "1,700+ Call of Duty Reels Bundle",
    "slug": "call-of-duty-reels-bundle",
    "status": "publish",
    "price": 79,
    "regular_price": 395,
    "sale_price": 79,
    "reseller_price": 149,
    "reseller_regular_price": 790,
    "stock_status": "instock",
    "categories": [
      "Gaming Reels"
    ],
    "reel_count": 700,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/call-of-duty-reels-bundle-1-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/call-of-duty-reels-bundle-1-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1JNU1nIqzTN3e2gw5d8x4Av9ZuCfb06tw",
    "short_description": "1,700+ Call of Duty Reels Bundle: a themed collection featuring action gaming moments, tactical gameplay and cinematic game edits. Digital access is provided on the Thank You page and by email after successful payment.",
    "description": "1,700+ Call of Duty Reels Bundle: a themed collection featuring action gaming moments, tactical gameplay and cinematic game edits. Digital access is provided on the Thank You page and by email after successful payment.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 474,
    "features": [
      "700+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-call-of-duty-reels-bundle",
        "name": "1,700+ Call of Duty Reels Bundle.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1JNU1nIqzTN3e2gw5d8x4Av9ZuCfb06tw"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-trick-shots-reels-bundle",
    "name": "2,500+ Trick Shots Reels Bundle",
    "slug": "trick-shots-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 495,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 990,
    "stock_status": "instock",
    "categories": [
      "Fitness & Sports"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/trick-shots-reels-bundle-1-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/trick-shots-reels-bundle-1-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1fGo03pctv_Eg198z3_eptes0LXHK_Sr3",
    "short_description": "2,500+ Trick Shots Reels Bundle: a themed collection featuring precision sports moments, creative shots and entertaining skill clips. Digital access is provided on the Thank You page and by email after successful paym...",
    "description": "2,500+ Trick Shots Reels Bundle: a themed collection featuring precision sports moments, creative shots and entertaining skill clips. Digital access is provided on the Thank You page and by email after successful paym...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 511,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-trick-shots-reels-bundle",
        "name": "2,500+ Trick Shots Reels Bundle.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1fGo03pctv_Eg198z3_eptes0LXHK_Sr3"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-fortnite-reels-bundle",
    "name": "2,000+ Fortnite Reels Bundle",
    "slug": "fortnite-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 495,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 990,
    "stock_status": "instock",
    "categories": [
      "Gaming Reels"
    ],
    "reel_count": 0,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/fortnite-reels-bundle-1-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/fortnite-reels-bundle-1-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1nblaVctP_v1v0qcqlmggPPFY_iKfg9B4",
    "short_description": "2,000+ Fortnite Reels Bundle: a themed collection featuring battle royale gameplay, colourful gaming moments and short gaming edits. Digital access is provided on the Thank You page and by email after successful payment.",
    "description": "2,000+ Fortnite Reels Bundle: a themed collection featuring battle royale gameplay, colourful gaming moments and short gaming edits. Digital access is provided on the Thank You page and by email after successful payment.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 228,
    "features": [
      "0+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-fortnite-reels-bundle",
        "name": "2,000+ Fortnite Reels Bundle.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1nblaVctP_v1v0qcqlmggPPFY_iKfg9B4"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-high-testosterone-reels-bundle",
    "name": "2,200+ High Testosterone Reels Bundle",
    "slug": "high-testosterone-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 495,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 990,
    "stock_status": "instock",
    "categories": [
      "Fitness & Sports"
    ],
    "reel_count": 200,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/high-testosterone-reels-bundle-1-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/high-testosterone-reels-bundle-1-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1dVJW_jXWA-deq09xPOve3hThm6GeH9-J",
    "short_description": "2,200+ High Testosterone Reels Bundle: a themed collection featuring strength-focused motivation, athletic imagery and masculine fitness edits. Digital access is provided on the Thank You page and by email after succe...",
    "description": "2,200+ High Testosterone Reels Bundle: a themed collection featuring strength-focused motivation, athletic imagery and masculine fitness edits. Digital access is provided on the Thank You page and by email after succe...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 265,
    "features": [
      "200+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-high-testosterone-reels-bundle",
        "name": "2,200+ High Testosterone Reels Bundle.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1dVJW_jXWA-deq09xPOve3hThm6GeH9-J"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-aesthetic-girls-reels-bundle",
    "name": "1,500+ Aesthetic Girls Reels Bundle",
    "slug": "aesthetic-girls-reels-bundle",
    "status": "publish",
    "price": 79,
    "regular_price": 395,
    "sale_price": 79,
    "reseller_price": 149,
    "reseller_regular_price": 790,
    "stock_status": "instock",
    "categories": [
      "Aesthetic Reels"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/aesthetic-girls-reels-bundle-1-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/aesthetic-girls-reels-bundle-1-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/13VgKgjRmMZbfXoHDEp7oR3s4M4GnTyp6",
    "short_description": "1,500+ Aesthetic Girls Reels Bundle: a themed collection featuring lifestyle aesthetics, portrait-led visuals and stylish mood edits. Digital access is provided on the Thank You page and by email after successful paym...",
    "description": "1,500+ Aesthetic Girls Reels Bundle: a themed collection featuring lifestyle aesthetics, portrait-led visuals and stylish mood edits. Digital access is provided on the Thank You page and by email after successful paym...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 302,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-aesthetic-girls-reels-bundle",
        "name": "1,500+ Aesthetic Girls Reels Bundle.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/13VgKgjRmMZbfXoHDEp7oR3s4M4GnTyp6"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-valorant-reels-bundle",
    "name": "3,000+ Valorant Reels Bundle",
    "slug": "valorant-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 495,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 990,
    "stock_status": "instock",
    "categories": [
      "Gaming Reels"
    ],
    "reel_count": 0,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/valorant-reels-bundle-1-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/valorant-reels-bundle-1-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/129_QHHY58bk0QSyXSyZYL02gMSoAbb4R",
    "short_description": "3,000+ Valorant Reels Bundle: a themed collection featuring tactical gaming moments, gameplay edits and competitive gaming content. Digital access is provided on the Thank You page and by email after successful payment.",
    "description": "3,000+ Valorant Reels Bundle: a themed collection featuring tactical gaming moments, gameplay edits and competitive gaming content. Digital access is provided on the Thank You page and by email after successful payment.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 339,
    "features": [
      "0+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-valorant-reels-bundle",
        "name": "3,000+ Valorant Reels Bundle.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/129_QHHY58bk0QSyXSyZYL02gMSoAbb4R"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-calisthenics-reels-bundle",
    "name": "3,000+ Calisthenics Reels Bundle",
    "slug": "calisthenics-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 495,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 990,
    "stock_status": "instock",
    "categories": [
      "Fitness & Sports"
    ],
    "reel_count": 0,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/calisthenics-reels-bundle-1-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/calisthenics-reels-bundle-1-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1uM9O1q1pMTR7NnxKaoSDzh-fMDy1dpiW",
    "short_description": "3,000+ Calisthenics Reels Bundle: a themed collection featuring bodyweight training, pull-up movements and athletic skill visuals. Digital access is provided on the Thank You page and by email after successful payment.",
    "description": "3,000+ Calisthenics Reels Bundle: a themed collection featuring bodyweight training, pull-up movements and athletic skill visuals. Digital access is provided on the Thank You page and by email after successful payment.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 376,
    "features": [
      "0+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-calisthenics-reels-bundle",
        "name": "3,000+ Calisthenics Reels Bundle.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1uM9O1q1pMTR7NnxKaoSDzh-fMDy1dpiW"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-ai-models-reels-bundle",
    "name": "1,500+ AI Models Reels Bundle",
    "slug": "ai-models-reels-bundle",
    "status": "publish",
    "price": 79,
    "regular_price": 395,
    "sale_price": 79,
    "reseller_price": 149,
    "reseller_regular_price": 790,
    "stock_status": "instock",
    "categories": [
      "AI Reels"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/ai-models-reels-bundle-1-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/ai-models-reels-bundle-1-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1DAqZZxw2PO8MHCsysTayNNaUurV0vz0s",
    "short_description": "1,500+ AI Models Reels Bundle: a themed collection featuring AI model visuals, fashion-inspired scenes and digital character edits. Digital access is provided on the Thank You page and by email after successful payment.",
    "description": "1,500+ AI Models Reels Bundle: a themed collection featuring AI model visuals, fashion-inspired scenes and digital character edits. Digital access is provided on the Thank You page and by email after successful payment.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 413,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-ai-models-reels-bundle",
        "name": "1,500+ AI Models Reels Bundle.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1DAqZZxw2PO8MHCsysTayNNaUurV0vz0s"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-gym-tips-reels-bundle",
    "name": "2,500+ Gym Tips Reels Bundle",
    "slug": "gym-tips-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 495,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 990,
    "stock_status": "instock",
    "categories": [
      "Fitness & Sports"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/gym-tips-reels-bundle-1-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/gym-tips-reels-bundle-1-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1-WHmvzyZMcZih1FuwQzPG9hSWoC9AYF5",
    "short_description": "2,500+ Gym Tips Reels Bundle: a themed collection featuring exercise demonstrations, gym technique and workout planning ideas. Digital access is provided on the Thank You page and by email after successful payment.",
    "description": "2,500+ Gym Tips Reels Bundle: a themed collection featuring exercise demonstrations, gym technique and workout planning ideas. Digital access is provided on the Thank You page and by email after successful payment.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 450,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-gym-tips-reels-bundle",
        "name": "2,500+ Gym Tips Reels Bundle.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1-WHmvzyZMcZih1FuwQzPG9hSWoC9AYF5"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-women-fitness-reels-bundle",
    "name": "1,500+ Women Fitness Reels Bundle",
    "slug": "women-fitness-reels-bundle",
    "status": "publish",
    "price": 79,
    "regular_price": 395,
    "sale_price": 79,
    "reseller_price": 149,
    "reseller_regular_price": 790,
    "stock_status": "instock",
    "categories": [
      "Fitness & Sports"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/women-fitness-reels-bundle-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/women-fitness-reels-bundle-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1-WHmvzyZMcZih1FuwQzPG9hSWoC9AYF5",
    "short_description": "1,500+ Women Fitness Reels Bundle: a themed collection featuring women strength training, athletic gym visuals and fitness motivation. Digital access is provided on the Thank You page and by email after successful pay...",
    "description": "1,500+ Women Fitness Reels Bundle: a themed collection featuring women strength training, athletic gym visuals and fitness motivation. Digital access is provided on the Thank You page and by email after successful pay...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 487,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-women-fitness-reels-bundle",
        "name": "1,500+ Women Fitness Reels Bundle.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1-WHmvzyZMcZih1FuwQzPG9hSWoC9AYF5"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-basketball-reels-bundle",
    "name": "3,000+ Basketball Reels Bundle",
    "slug": "basketball-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 495,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 990,
    "stock_status": "instock",
    "categories": [
      "Fitness & Sports"
    ],
    "reel_count": 0,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/basketball-reels-bundle-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/basketball-reels-bundle-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/112l3L-WD0ji90I1BRc7yedn4Y4dpWWU4",
    "short_description": "3,000+ Basketball Reels Bundle: a themed collection featuring basketball action, court moments and energetic sports clips. Digital access is provided on the Thank You page and by email after successful payment.",
    "description": "3,000+ Basketball Reels Bundle: a themed collection featuring basketball action, court moments and energetic sports clips. Digital access is provided on the Thank You page and by email after successful payment.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 204,
    "features": [
      "0+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-basketball-reels-bundle",
        "name": "3,000+ Basketball Reels Bundle.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/112l3L-WD0ji90I1BRc7yedn4Y4dpWWU4"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-girl-dancing-reels-bundle",
    "name": "1,500+ Girl Dancing Reels Bundle",
    "slug": "girl-dancing-reels-bundle",
    "status": "publish",
    "price": 79,
    "regular_price": 395,
    "sale_price": 79,
    "reseller_price": 149,
    "reseller_regular_price": 790,
    "stock_status": "instock",
    "categories": [
      "Dance Reels"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/girl-dancing-reels-bundle-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/girl-dancing-reels-bundle-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/15Pp0qQiJGYZqfZr4J2J-DFs0BPQ-Lzbh",
    "short_description": "1,500+ Girl Dancing Reels Bundle: a themed collection featuring dance performances, rhythmic movement and creative dance edits. Digital access is provided on the Thank You page and by email after successful payment.",
    "description": "1,500+ Girl Dancing Reels Bundle: a themed collection featuring dance performances, rhythmic movement and creative dance edits. Digital access is provided on the Thank You page and by email after successful payment.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 241,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-girl-dancing-reels-bundle",
        "name": "1,500+ Girl Dancing Reels Bundle.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/15Pp0qQiJGYZqfZr4J2J-DFs0BPQ-Lzbh"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-humanity-kindness-reels-bundle",
    "name": "600+ Humanity & Kindness Reels Bundle",
    "slug": "humanity-kindness-reels-bundle",
    "status": "publish",
    "price": 59,
    "regular_price": 295,
    "sale_price": 59,
    "reseller_price": 129,
    "reseller_regular_price": 590,
    "stock_status": "instock",
    "categories": [
      "Motivation & Mindset"
    ],
    "reel_count": 600,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/humanity-kindness-reels-bundle-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/humanity-kindness-reels-bundle-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1CBvANc9GOwSbCri3DL-y_GVWFBp3q0C9",
    "short_description": "600+ Humanity & Kindness Reels Bundle: a themed collection featuring kindness, helping others and heartwarming human stories. Digital access is provided on the Thank You page and by email after successful payment.",
    "description": "600+ Humanity & Kindness Reels Bundle: a themed collection featuring kindness, helping others and heartwarming human stories. Digital access is provided on the Thank You page and by email after successful payment.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 278,
    "features": [
      "600+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-humanity-kindness-reels-bundle",
        "name": "600+ Humanity & Kindness Reels Bundle.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1CBvANc9GOwSbCri3DL-y_GVWFBp3q0C9"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-arpit-bala-reels-bundle",
    "name": "600+ Arpit Bala Reels Bundle",
    "slug": "arpit-bala-reels-bundle",
    "status": "publish",
    "price": 59,
    "regular_price": 295,
    "sale_price": 59,
    "reseller_price": 129,
    "reseller_regular_price": 590,
    "stock_status": "instock",
    "categories": [
      "Comedy Reels"
    ],
    "reel_count": 600,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/arpit-bala-reels-bundle-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/arpit-bala-reels-bundle-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1r8ovSI42eWdAcvNwMqOOq7x6rMnvh6p5",
    "short_description": "600+ Arpit Bala Reels Bundle: a themed collection featuring creator-focused entertainment, comedy moments and conversational clips. Digital access is provided on the Thank You page and by email after successful payment.",
    "description": "600+ Arpit Bala Reels Bundle: a themed collection featuring creator-focused entertainment, comedy moments and conversational clips. Digital access is provided on the Thank You page and by email after successful payment.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 315,
    "features": [
      "600+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-arpit-bala-reels-bundle",
        "name": "600+ Arpit Bala Reels Bundle.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1r8ovSI42eWdAcvNwMqOOq7x6rMnvh6p5"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-magic-tricks-reels-bundle",
    "name": "3,500+ Magic Tricks Reels Bundle",
    "slug": "magic-tricks-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 495,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 990,
    "stock_status": "instock",
    "categories": [
      "Entertainment Reels"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/magic-tricks-reels-bundle-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/magic-tricks-reels-bundle-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1p8xVvq6PR9VgDgrzfmEd9z32R4bye7ym",
    "short_description": "3,500+ Magic Tricks Reels Bundle: a themed collection featuring magic demonstrations, visual illusions and entertaining tricks. Digital access is provided on the Thank You page and by email after successful payment.",
    "description": "3,500+ Magic Tricks Reels Bundle: a themed collection featuring magic demonstrations, visual illusions and entertaining tricks. Digital access is provided on the Thank You page and by email after successful payment.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 352,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-magic-tricks-reels-bundle",
        "name": "3,500+ Magic Tricks Reels Bundle.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1p8xVvq6PR9VgDgrzfmEd9z32R4bye7ym"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-f1-cars-reels-bundle",
    "name": "1,500+ F1 Cars Reels Bundle",
    "slug": "f1-cars-reels-bundle",
    "status": "publish",
    "price": 79,
    "regular_price": 395,
    "sale_price": 79,
    "reseller_price": 149,
    "reseller_regular_price": 790,
    "stock_status": "instock",
    "categories": [
      "Fitness & Sports"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/f1-cars-reels-bundle-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/f1-cars-reels-bundle-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/18H9J4dQM9RYqypGHNo3SJcXwmhaIQRtx",
    "short_description": "1,500+ F1 Cars Reels Bundle: a themed collection featuring open-wheel racing visuals, track action and motorsport edits. Digital access is provided on the Thank You page and by email after successful payment.",
    "description": "1,500+ F1 Cars Reels Bundle: a themed collection featuring open-wheel racing visuals, track action and motorsport edits. Digital access is provided on the Thank You page and by email after successful payment.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 389,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-f1-cars-reels-bundle",
        "name": "1,500+ F1 Cars Reels Bundle.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/18H9J4dQM9RYqypGHNo3SJcXwmhaIQRtx"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-ai-story-chats-reels-bundle",
    "name": "1,100+ AI Story Chats Reels Bundle",
    "slug": "ai-story-chats-reels-bundle",
    "status": "publish",
    "price": 69,
    "regular_price": 345,
    "sale_price": 69,
    "reseller_price": 149,
    "reseller_regular_price": 690,
    "stock_status": "instock",
    "categories": [
      "Story Reels"
    ],
    "reel_count": 100,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/ai-story-chats-reels-bundle-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/ai-story-chats-reels-bundle-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1hJVNPA3gfW7eBQV8d8jIlBnd58vPeEdi",
    "short_description": "1,100+ AI Story Chats Reels Bundle: a themed collection featuring chat-based AI stories, conversation-led scenes and short storytelling ideas. Digital access is provided on the Thank You page and by email after succes...",
    "description": "1,100+ AI Story Chats Reels Bundle: a themed collection featuring chat-based AI stories, conversation-led scenes and short storytelling ideas. Digital access is provided on the Thank You page and by email after succes...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 426,
    "features": [
      "100+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-ai-story-chats-reels-bundle",
        "name": "1,100+ AI Story Chats Reels Bundle.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1hJVNPA3gfW7eBQV8d8jIlBnd58vPeEdi"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-mega-anime-reels-bundle",
    "name": "3,100+ Mega Anime Reels Bundle – Premium 720p Videos",
    "slug": "mega-anime-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 495,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 990,
    "stock_status": "instock",
    "categories": [
      "Art & Animation Reels"
    ],
    "reel_count": 100,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/mega-anime-reels-bundle-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/mega-anime-reels-bundle-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1vAkSCfTcXPen5pDkwMgUmbAOqGQZxfwF",
    "short_description": "✨ Mega Anime Reels Bundle includes 3,100+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file s...",
    "description": "✨ Mega Anime Reels Bundle includes 3,100+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file s...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 463,
    "features": [
      "100+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-mega-anime-reels-bundle",
        "name": "3,100+ Mega Anime Reels Bundle – Premium 720p.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1vAkSCfTcXPen5pDkwMgUmbAOqGQZxfwF"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-football-reels-bundle",
    "name": "100+ Football Reels Bundle – Premium 720p Videos",
    "slug": "football-reels-bundle",
    "status": "publish",
    "price": 49,
    "regular_price": 245,
    "sale_price": 49,
    "reseller_price": 129,
    "reseller_regular_price": 490,
    "stock_status": "instock",
    "categories": [
      "Fitness & Sports"
    ],
    "reel_count": 100,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/football-reels-bundle-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/football-reels-bundle-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/file/d/1aK2d_F0awcE8kMAnOLozLxzXwPvxpqFL/view",
    "short_description": "✨ Football Reels Bundle includes 100+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file size ...",
    "description": "✨ Football Reels Bundle includes 100+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file size ...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 500,
    "features": [
      "100+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-football-reels-bundle",
        "name": "100+ Football Reels Bundle – Premium 720p Vid.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/file/d/1aK2d_F0awcE8kMAnOLozLxzXwPvxpqFL/view"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-craft-reels-bundle",
    "name": "500+ Craft Reels Bundle – Premium 720p Videos",
    "slug": "craft-reels-bundle",
    "status": "publish",
    "price": 59,
    "regular_price": 295,
    "sale_price": 59,
    "reseller_price": 129,
    "reseller_regular_price": 590,
    "stock_status": "instock",
    "categories": [
      "Art & Animation Reels"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/craft-reels-bundle-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/craft-reels-bundle-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1_Q5PqpgLgqMHBarzNVsv_JHA_iC_P0qb",
    "short_description": "✨ Craft Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file size of ...",
    "description": "✨ Craft Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file size of ...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 217,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-craft-reels-bundle",
        "name": "500+ Craft Reels Bundle – Premium 720p Videos.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1_Q5PqpgLgqMHBarzNVsv_JHA_iC_P0qb"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-business-tips-reels-bundle",
    "name": "500+ Business Tips Reels Bundle – Premium 720p Videos",
    "slug": "business-tips-reels-bundle",
    "status": "publish",
    "price": 59,
    "regular_price": 295,
    "sale_price": 59,
    "reseller_price": 129,
    "reseller_regular_price": 590,
    "stock_status": "instock",
    "categories": [
      "Business & Finance"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/business-tips-reels-bundle-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/business-tips-reels-bundle-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/19OihxyPDGIludrkNUL-G35tqdY_607tM",
    "short_description": "✨ Business Tips Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file ...",
    "description": "✨ Business Tips Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file ...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 254,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-business-tips-reels-bundle",
        "name": "500+ Business Tips Reels Bundle – Premium 720.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/19OihxyPDGIludrkNUL-G35tqdY_607tM"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-attitude-reels-bundle",
    "name": "100+ Attitude Reels Bundle – Premium 720p Videos",
    "slug": "attitude-reels-bundle",
    "status": "publish",
    "price": 49,
    "regular_price": 245,
    "sale_price": 49,
    "reseller_price": 129,
    "reseller_regular_price": 490,
    "stock_status": "instock",
    "categories": [
      "Motivation & Mindset"
    ],
    "reel_count": 100,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/attitude-reels-bundle-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/attitude-reels-bundle-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1dsXbUDAfyBsCRd7dRP4G530OZBnA14pU",
    "short_description": "✨ Attitude Reels Bundle includes 100+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file size ...",
    "description": "✨ Attitude Reels Bundle includes 100+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file size ...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 291,
    "features": [
      "100+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-attitude-reels-bundle",
        "name": "100+ Attitude Reels Bundle – Premium 720p Vid.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1dsXbUDAfyBsCRd7dRP4G530OZBnA14pU"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-stock-market-reels-bundle",
    "name": "500+ Stock Market Reels Bundle – Premium 720p Videos",
    "slug": "stock-market-reels-bundle",
    "status": "publish",
    "price": 69,
    "regular_price": 345,
    "sale_price": 69,
    "reseller_price": 149,
    "reseller_regular_price": 690,
    "stock_status": "instock",
    "categories": [
      "Business & Finance"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/stock-market-reels-bundle-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/stock-market-reels-bundle-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/193sV7W9KGkZPVkVbs4rjFmHEu5Is8qZV",
    "short_description": "✨ Stock Market Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file s...",
    "description": "✨ Stock Market Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file s...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 328,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-stock-market-reels-bundle",
        "name": "500+ Stock Market Reels Bundle – Premium 720p.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/193sV7W9KGkZPVkVbs4rjFmHEu5Is8qZV"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-athletic-reels-bundle",
    "name": "500+ Athletic Reels Bundle – Premium 720p Videos",
    "slug": "athletic-reels-bundle",
    "status": "publish",
    "price": 59,
    "regular_price": 295,
    "sale_price": 59,
    "reseller_price": 129,
    "reseller_regular_price": 590,
    "stock_status": "instock",
    "categories": [
      "Fitness & Sports"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/athletic-reels-bundle-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/athletic-reels-bundle-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1abXzzLDuRm_WGrwGz-Zh5O798-JKvJAd",
    "short_description": "✨ Athletic Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file size ...",
    "description": "✨ Athletic Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file size ...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 365,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-athletic-reels-bundle",
        "name": "500+ Athletic Reels Bundle – Premium 720p Vid.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1abXzzLDuRm_WGrwGz-Zh5O798-JKvJAd"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-trending-reels-bundle",
    "name": "500+ Trending Reels Bundle – Premium 720p Videos",
    "slug": "trending-reels-bundle",
    "status": "publish",
    "price": 59,
    "regular_price": 295,
    "sale_price": 59,
    "reseller_price": 129,
    "reseller_regular_price": 590,
    "stock_status": "instock",
    "categories": [
      "Trending Reels"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/trending-reels-bundle-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/trending-reels-bundle-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1U-hv1MG7Uh_ZXMcqsC48EXLSMkkcU2qU",
    "short_description": "✨ Trending Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file size ...",
    "description": "✨ Trending Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file size ...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 402,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-trending-reels-bundle",
        "name": "500+ Trending Reels Bundle – Premium 720p Vid.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1U-hv1MG7Uh_ZXMcqsC48EXLSMkkcU2qU"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-anime-reels-bundle",
    "name": "500+ Anime Reels Bundle – Premium 720p Videos",
    "slug": "anime-reels-bundle",
    "status": "publish",
    "price": 59,
    "regular_price": 295,
    "sale_price": 59,
    "reseller_price": 129,
    "reseller_regular_price": 590,
    "stock_status": "instock",
    "categories": [
      "Art & Animation Reels"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/anime-reels-bundle-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/anime-reels-bundle-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1xJE-N3Oi3VCCMmke82obnC1HQwp3615k",
    "short_description": "✨ Anime Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file size of ...",
    "description": "✨ Anime Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file size of ...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 439,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-anime-reels-bundle",
        "name": "500+ Anime Reels Bundle – Premium 720p Videos.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1xJE-N3Oi3VCCMmke82obnC1HQwp3615k"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-paper-art-reels-bundle",
    "name": "500+ Paper Art Reels Bundle – Premium 720p Videos",
    "slug": "paper-art-reels-bundle",
    "status": "publish",
    "price": 59,
    "regular_price": 295,
    "sale_price": 59,
    "reseller_price": 129,
    "reseller_regular_price": 590,
    "stock_status": "instock",
    "categories": [
      "Art & Animation Reels"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/paper-art-reels-bundle-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/paper-art-reels-bundle-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1HI2Q3zmom9MkblsgdgT-9sjjtFp5jDY3",
    "short_description": "✨ Paper Art Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file size...",
    "description": "✨ Paper Art Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file size...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 476,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-paper-art-reels-bundle",
        "name": "500+ Paper Art Reels Bundle – Premium 720p Vi.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1HI2Q3zmom9MkblsgdgT-9sjjtFp5jDY3"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-tools-tips-reels-bundle",
    "name": "500+ Tools Tips Reels Bundle – Premium 720p Videos",
    "slug": "tools-tips-reels-bundle",
    "status": "publish",
    "price": 59,
    "regular_price": 295,
    "sale_price": 59,
    "reseller_price": 129,
    "reseller_regular_price": 590,
    "stock_status": "instock",
    "categories": [
      "DIY Reels"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/tools-tips-reels-bundle-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/tools-tips-reels-bundle-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1V43pBAdaa4Xhtzvc5blXkeYMDr7RSa7l",
    "short_description": "✨ Tools Tips Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file siz...",
    "description": "✨ Tools Tips Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file siz...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 513,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-tools-tips-reels-bundle",
        "name": "500+ Tools Tips Reels Bundle – Premium 720p V.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1V43pBAdaa4Xhtzvc5blXkeYMDr7RSa7l"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-tools-reels-bundle",
    "name": "2,500+ Tools Reels Bundle – Premium 720p Videos",
    "slug": "tools-reels-bundle",
    "status": "publish",
    "price": 79,
    "regular_price": 395,
    "sale_price": 79,
    "reseller_price": 149,
    "reseller_regular_price": 790,
    "stock_status": "instock",
    "categories": [
      "DIY Reels"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/tools-reels-bundle-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/tools-reels-bundle-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1_JDuQqRyk5hDe6JiTVHwRx3c51BtHWQu",
    "short_description": "✨ Tools Reels Bundle includes 2,500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file size o...",
    "description": "✨ Tools Reels Bundle includes 2,500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file size o...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 230,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-tools-reels-bundle",
        "name": "2,500+ Tools Reels Bundle – Premium 720p Vide.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1_JDuQqRyk5hDe6JiTVHwRx3c51BtHWQu"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-zig-sharko-cartoon-reels-bundle",
    "name": "500+ Zig & Sharko Cartoon Reels Bundle – Premium 720p Videos",
    "slug": "zig-sharko-cartoon-reels-bundle",
    "status": "publish",
    "price": 59,
    "regular_price": 295,
    "sale_price": 59,
    "reseller_price": 129,
    "reseller_regular_price": 590,
    "stock_status": "instock",
    "categories": [
      "Art & Animation Reels"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/zig-sharko-cartoon-reels-bundle-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/zig-sharko-cartoon-reels-bundle-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1sDrsT8RnCKR6uLR3oczZmAlT3jwAAoYW",
    "short_description": "✨ Zig & Sharko Cartoon Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimate...",
    "description": "✨ Zig & Sharko Cartoon Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimate...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 267,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-zig-sharko-cartoon-reels-bundle",
        "name": "500+ Zig & Sharko Cartoon Reels Bundle – Prem.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1sDrsT8RnCKR6uLR3oczZmAlT3jwAAoYW"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-car-luxury-lifestyle-reels-bundle",
    "name": "500+ Car & Luxury Reels Bundle – Premium 720p Videos",
    "slug": "car-luxury-lifestyle-reels-bundle",
    "status": "publish",
    "price": 69,
    "regular_price": 345,
    "sale_price": 69,
    "reseller_price": 149,
    "reseller_regular_price": 690,
    "stock_status": "instock",
    "categories": [
      "Cars & Vehicles"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/car-luxury-lifestyle-reels-bundle-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/car-luxury-lifestyle-reels-bundle-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1hpwetf4zqIs1Yt0R0g8dBREDJ_oN61oW",
    "short_description": "✨ Car & Luxury Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file s...",
    "description": "✨ Car & Luxury Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file s...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 304,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-car-luxury-lifestyle-reels-bundle",
        "name": "500+ Car & Luxury Reels Bundle – Premium 720p.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1hpwetf4zqIs1Yt0R0g8dBREDJ_oN61oW"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-ai-islamic-reels-bundle",
    "name": "500+ AI Islamic Reels Bundle – Premium 720p Videos",
    "slug": "ai-islamic-reels-bundle",
    "status": "publish",
    "price": 59,
    "regular_price": 295,
    "sale_price": 59,
    "reseller_price": 129,
    "reseller_regular_price": 590,
    "stock_status": "instock",
    "categories": [
      "AI Reels"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/ai-islamic-reels-bundle-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/ai-islamic-reels-bundle-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1XfuZBqpSPGmMVwM4TUPn3dzUdW-T3PuC",
    "short_description": "✨ AI Islamic Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file siz...",
    "description": "✨ AI Islamic Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file siz...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 341,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-ai-islamic-reels-bundle",
        "name": "500+ AI Islamic Reels Bundle – Premium 720p V.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1XfuZBqpSPGmMVwM4TUPn3dzUdW-T3PuC"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-sanatan-dharm-reels-bundle",
    "name": "500+ Sanatan Dharm Reels Bundle – Premium 720p Videos",
    "slug": "sanatan-dharm-reels-bundle",
    "status": "publish",
    "price": 59,
    "regular_price": 295,
    "sale_price": 59,
    "reseller_price": 129,
    "reseller_regular_price": 590,
    "stock_status": "instock",
    "categories": [
      "Devotional & Spiritual"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/sanatan-dharm-reels-bundle-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/sanatan-dharm-reels-bundle-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1awCPTpgpRAYdh7pDs6P5CvLeIG-HCyrl",
    "short_description": "✨ Sanatan Dharm Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi content with an estimated file size of 50...",
    "description": "✨ Sanatan Dharm Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi content with an estimated file size of 50...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 378,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-sanatan-dharm-reels-bundle",
        "name": "500+ Sanatan Dharm Reels Bundle – Premium 720.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1awCPTpgpRAYdh7pDs6P5CvLeIG-HCyrl"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-universe-reels-bundle",
    "name": "1,000+ Universe Reels Bundle – Premium 720p Videos",
    "slug": "universe-reels-bundle",
    "status": "publish",
    "price": 69,
    "regular_price": 345,
    "sale_price": 69,
    "reseller_price": 149,
    "reseller_regular_price": 690,
    "stock_status": "instock",
    "categories": [
      "Aesthetic Reels"
    ],
    "reel_count": 0,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/universe-reels-bundle-3-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/universe-reels-bundle-3-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1ILhXC3Ey7EPlGBW-ZfCdPXRc7Su5Wl0x",
    "short_description": "✨ Universe Reels Bundle includes 1,000+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file siz...",
    "description": "✨ Universe Reels Bundle includes 1,000+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file siz...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 415,
    "features": [
      "0+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-universe-reels-bundle",
        "name": "1,000+ Universe Reels Bundle – Premium 720p V.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1ILhXC3Ey7EPlGBW-ZfCdPXRc7Su5Wl0x"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-business-growth-motivational-reels-bundle",
    "name": "1,000+ Business Growth Motivational Reels Bundle – Premium 720p Videos",
    "slug": "business-growth-motivational-reels-bundle",
    "status": "publish",
    "price": 79,
    "regular_price": 395,
    "sale_price": 79,
    "reseller_price": 149,
    "reseller_regular_price": 790,
    "stock_status": "instock",
    "categories": [
      "Business & Finance"
    ],
    "reel_count": 0,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/business-growth-motivational-reels-bundle-3-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/business-growth-motivational-reels-bundle-3-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1mrPzK5Zz9ZbEk6rUDQSRYb52UHG4dsaf",
    "short_description": "✨ Business Growth Motivational Reels Bundle includes 1,000+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with a...",
    "description": "✨ Business Growth Motivational Reels Bundle includes 1,000+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with a...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 452,
    "features": [
      "0+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-business-growth-motivational-reels-bundle",
        "name": "1,000+ Business Growth Motivational Reels Bun.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1mrPzK5Zz9ZbEk6rUDQSRYb52UHG4dsaf"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-art-craft-reels-bundle",
    "name": "1,000+ Art & Craft Reels Bundle – Premium 720p Videos",
    "slug": "art-craft-reels-bundle",
    "status": "publish",
    "price": 79,
    "regular_price": 395,
    "sale_price": 79,
    "reseller_price": 149,
    "reseller_regular_price": 790,
    "stock_status": "instock",
    "categories": [
      "Art & Animation Reels"
    ],
    "reel_count": 0,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/art-craft-reels-bundle-3-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/art-craft-reels-bundle-3-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1_ZOSrPjtftLH7zA3vQkPR8eCOuApUSzk",
    "short_description": "✨ Art & Craft Reels Bundle includes 1,000+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi content with an estimated file size of 1 ...",
    "description": "✨ Art & Craft Reels Bundle includes 1,000+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi content with an estimated file size of 1 ...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 489,
    "features": [
      "0+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-art-craft-reels-bundle",
        "name": "1,000+ Art & Craft Reels Bundle – Premium 720.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1_ZOSrPjtftLH7zA3vQkPR8eCOuApUSzk"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-ai-health-reels-bundle",
    "name": "500+ AI Health Reels Bundle – Premium 720p Videos",
    "slug": "ai-health-reels-bundle",
    "status": "publish",
    "price": 69,
    "regular_price": 345,
    "sale_price": 69,
    "reseller_price": 149,
    "reseller_regular_price": 690,
    "stock_status": "instock",
    "categories": [
      "Health Reels"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/ai-health-reels-bundle-3-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/ai-health-reels-bundle-3-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1lXK8icsrN-ggglg53pkZapSixTeBywD4",
    "short_description": "✨ AI Health Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file size...",
    "description": "✨ AI Health Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file size...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 206,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-ai-health-reels-bundle",
        "name": "500+ AI Health Reels Bundle – Premium 720p Vi.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1lXK8icsrN-ggglg53pkZapSixTeBywD4"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-ai-tech-reels-bundle",
    "name": "500+ AI Tech Reels Bundle – Premium 720p Videos",
    "slug": "ai-tech-reels-bundle",
    "status": "publish",
    "price": 69,
    "regular_price": 345,
    "sale_price": 69,
    "reseller_price": 149,
    "reseller_regular_price": 690,
    "stock_status": "instock",
    "categories": [
      "AI Reels"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/ai-tech-reels-bundle-3-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/ai-tech-reels-bundle-3-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1YKqZJe120qfeXoGIflkgjRC8z4-pdVks",
    "short_description": "✨ AI Tech Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file size o...",
    "description": "✨ AI Tech Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file size o...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 243,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-ai-tech-reels-bundle",
        "name": "500+ AI Tech Reels Bundle – Premium 720p Vide.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1YKqZJe120qfeXoGIflkgjRC8z4-pdVks"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-ai-fitness-reels-bundle",
    "name": "500+ AI Fitness Reels Bundle – Premium 720p Videos",
    "slug": "ai-fitness-reels-bundle",
    "status": "publish",
    "price": 69,
    "regular_price": 345,
    "sale_price": 69,
    "reseller_price": 149,
    "reseller_regular_price": 690,
    "stock_status": "instock",
    "categories": [
      "Fitness & Sports"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/ai-fitness-reels-bundle-3-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/ai-fitness-reels-bundle-3-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1lXK8icsrN-ggglg53pkZapSixTeBywD4",
    "short_description": "✨ AI Fitness Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file siz...",
    "description": "✨ AI Fitness Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file siz...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 280,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-ai-fitness-reels-bundle",
        "name": "500+ AI Fitness Reels Bundle – Premium 720p V.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1lXK8icsrN-ggglg53pkZapSixTeBywD4"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-indian-cricket-reels-bundle",
    "name": "500+ Indian Cricket Reels Bundle – Premium 720p Videos",
    "slug": "indian-cricket-reels-bundle",
    "status": "publish",
    "price": 59,
    "regular_price": 295,
    "sale_price": 59,
    "reseller_price": 129,
    "reseller_regular_price": 590,
    "stock_status": "instock",
    "categories": [
      "Fitness & Sports"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/indian-cricket-reels-bundle-3-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/indian-cricket-reels-bundle-3-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/19ZOdWVrqXqH3G_RGIVDKIQ_THtAv3zao",
    "short_description": "✨ Indian Cricket Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi content with an estimated file size of 7...",
    "description": "✨ Indian Cricket Reels Bundle includes 500+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi content with an estimated file size of 7...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 317,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-indian-cricket-reels-bundle",
        "name": "500+ Indian Cricket Reels Bundle – Premium 72.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/19ZOdWVrqXqH3G_RGIVDKIQ_THtAv3zao"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-mini-car-unboxing-reels-bundle",
    "name": "500+ Mini Car Unboxing Reels Bundle",
    "slug": "mini-car-unboxing-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 129,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 258,
    "stock_status": "instock",
    "categories": [
      "Cars & Vehicles"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/mini-car-unboxing-reels-bundle-2-1.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/mini-car-unboxing-reels-bundle-2-1.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1lXK8icsrN-ggglg53pkZapSixTeBywD4",
    "short_description": "Mini Car Unboxing Files: MP4 · 1080p HD. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "description": "Mini Car Unboxing Files: MP4 · 1080p HD. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 354,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-mini-car-unboxing-reels-bundle",
        "name": "500+ Mini Car Unboxing Reels Bundle.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1lXK8icsrN-ggglg53pkZapSixTeBywD4"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-superhero-reels-bundle",
    "name": "500+ Superhero Reels Bundle – Action & Superhero Videos for Reels",
    "slug": "superhero-reels-bundle",
    "status": "publish",
    "price": 69,
    "regular_price": 349,
    "sale_price": 69,
    "reseller_price": 149,
    "reseller_regular_price": 698,
    "stock_status": "instock",
    "categories": [
      "Fantasy Reels"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/superhero-reels-bundle-5-2-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/superhero-reels-bundle-5-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/13FHnU5c-OBbf1PbJoX_ecLKi9RXVKi34",
    "short_description": "Superhero-style action, cinematic characters and dramatic visual moments Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before orde...",
    "description": "Superhero-style action, cinematic characters and dramatic visual moments Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before orde...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 391,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-superhero-reels-bundle",
        "name": "500+ Superhero Reels Bundle – Action & Superh.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/13FHnU5c-OBbf1PbJoX_ecLKi9RXVKi34"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-long-movie-clips-reels-bundle",
    "name": "200+ Long Movie Clips Reels Bundle – Cinematic Movie Scenes & Story Clips",
    "slug": "long-movie-clips-reels-bundle",
    "status": "publish",
    "price": 79,
    "regular_price": 399,
    "sale_price": 79,
    "reseller_price": 149,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "Entertainment Reels"
    ],
    "reel_count": 200,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/long-movie-clips-reels-bundle-5-2-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/long-movie-clips-reels-bundle-5-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1pqAW8ayU14D57AQuVlwlsQR6MEo86ndV",
    "short_description": "Cinematic movie scenes and story-driven entertainment clips Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "description": "Cinematic movie scenes and story-driven entertainment clips Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 428,
    "features": [
      "200+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-long-movie-clips-reels-bundle",
        "name": "200+ Long Movie Clips Reels Bundle – Cinemati.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1pqAW8ayU14D57AQuVlwlsQR6MEo86ndV"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-talks-3500",
    "name": "3500+ Adult Talks Reels Bundle – Conversation, Life & Relationship Videos",
    "slug": "adult-talks-reels-bundle",
    "status": "publish",
    "price": 149,
    "regular_price": 749,
    "sale_price": 149,
    "reseller_price": 199,
    "reseller_regular_price": 1498,
    "stock_status": "instock",
    "categories": [
      "Relationship Reels"
    ],
    "reel_count": 3500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/adult-talks-reels-bundle-5-2-1-768x576.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/adult-talks-reels-bundle-5-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1Q8ey_u913UoxNAjcAQ_bqcqUYkT-NdrK",
    "short_description": "Conversation, relationship, life-experience and discussion-oriented short videos Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license bef...",
    "description": "Conversation, relationship, life-experience and discussion-oriented short videos Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license bef...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 465,
    "features": [
      "3500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-adult-talks-reels-bundle",
        "name": "3500+ Adult Talks Reels Bundle – Conversation.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1Q8ey_u913UoxNAjcAQ_bqcqUYkT-NdrK"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-relatable-reels-bundle",
    "name": "3000+ Relatable Reels Bundle – Everyday Relatable & Viral Videos",
    "slug": "relatable-reels-bundle",
    "status": "publish",
    "price": 129,
    "regular_price": 649,
    "sale_price": 129,
    "reseller_price": 199,
    "reseller_regular_price": 1298,
    "stock_status": "instock",
    "categories": [
      "Entertainment Reels"
    ],
    "reel_count": 3000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/relatable-reels-bundle-5-2-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/relatable-reels-bundle-5-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1Or4h2L72G85tsYC8SCJgLxTXgN3pOy2L",
    "short_description": "Everyday situations, reactions and highly relatable social content Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "description": "Everyday situations, reactions and highly relatable social content Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 502,
    "features": [
      "3000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-relatable-reels-bundle",
        "name": "3000+ Relatable Reels Bundle – Everyday Relat.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1Or4h2L72G85tsYC8SCJgLxTXgN3pOy2L"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-stoic-mindset-reels-bundle",
    "name": "2500+ Stoic Mindset Reels Bundle – Stoicism, Wisdom & Mindset Videos",
    "slug": "stoic-mindset-reels-bundle",
    "status": "publish",
    "price": 119,
    "regular_price": 599,
    "sale_price": 119,
    "reseller_price": 199,
    "reseller_regular_price": 1198,
    "stock_status": "instock",
    "categories": [
      "Motivation & Mindset"
    ],
    "reel_count": 2500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/stoic-mindset-reels-bundle-5-2-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/stoic-mindset-reels-bundle-5-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/109C355WAq_1FFadGL66ipVYZOg8IoQUS",
    "short_description": "Stoic philosophy, discipline, wisdom and mindset content Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "description": "Stoic philosophy, discipline, wisdom and mindset content Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 219,
    "features": [
      "2500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-stoic-mindset-reels-bundle",
        "name": "2500+ Stoic Mindset Reels Bundle – Stoicism,.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/109C355WAq_1FFadGL66ipVYZOg8IoQUS"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-aesthetic-ocean-sunset-cloud-reels-bundle",
    "name": "2000+ Ocean Sunset Cloud Reels Bundle – Ocean, Sunset & Cloud Aesthetic Videos",
    "slug": "aesthetic-ocean-sunset-cloud-reels-bundle",
    "status": "publish",
    "price": 109,
    "regular_price": 549,
    "sale_price": 109,
    "reseller_price": 199,
    "reseller_regular_price": 1098,
    "stock_status": "instock",
    "categories": [
      "Animals & Nature Reels"
    ],
    "reel_count": 2000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/aesthetic-ocean-sunset-cloud-reels-bundle-2-5-2-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/aesthetic-ocean-sunset-cloud-reels-bundle-2-5-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/16EcQQ0-T8VlqN3Oz4yLUzYzHWFxHZYhD",
    "short_description": "Ocean, sunset, cloud and dreamy nature visuals Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "description": "Ocean, sunset, cloud and dreamy nature visuals Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 256,
    "features": [
      "2000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-aesthetic-ocean-sunset-cloud-reels-bundle",
        "name": "2000+ Ocean Sunset Cloud Reels Bundle – Ocean.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/16EcQQ0-T8VlqN3Oz4yLUzYzHWFxHZYhD"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-aesthetic-rain-reels-bundle",
    "name": "1500+ Aesthetic Rain Reels Bundle – Rain, Mood & Relaxing Aesthetic Videos",
    "slug": "aesthetic-rain-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 499,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 998,
    "stock_status": "instock",
    "categories": [
      "Aesthetic Reels"
    ],
    "reel_count": 1500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/aesthetic-rain-reels-bundle-2-5-2-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/aesthetic-rain-reels-bundle-2-5-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/14i0HoZUv1oe38NNiPmt8lBRem037dCbO",
    "short_description": "Rainy scenes, moody visuals and relaxing aesthetic moments Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "description": "Rainy scenes, moody visuals and relaxing aesthetic moments Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 293,
    "features": [
      "1500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-aesthetic-rain-reels-bundle",
        "name": "1500+ Aesthetic Rain Reels Bundle – Rain, Moo.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/14i0HoZUv1oe38NNiPmt8lBRem037dCbO"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-aesthetic-trees-reels-bundle",
    "name": "1200+ Aesthetic Trees Reels Bundle – Nature, Trees & Green Aesthetic Videos",
    "slug": "aesthetic-trees-reels-bundle",
    "status": "publish",
    "price": 79,
    "regular_price": 399,
    "sale_price": 79,
    "reseller_price": 149,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "Animals & Nature Reels"
    ],
    "reel_count": 1200,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/aesthetic-trees-reels-bundle-2-5-2-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/aesthetic-trees-reels-bundle-2-5-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1TXgXXFJm-9ptbeICP6cfwZu6p0HdaGV-",
    "short_description": "Trees, forests, greenery and calming nature aesthetics Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "description": "Trees, forests, greenery and calming nature aesthetics Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 330,
    "features": [
      "1200+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-aesthetic-trees-reels-bundle",
        "name": "1200+ Aesthetic Trees Reels Bundle – Nature,.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1TXgXXFJm-9ptbeICP6cfwZu6p0HdaGV-"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-aesthetic-snow-reels-bundle",
    "name": "2000+ Aesthetic Snow Reels Bundle – Winter Aesthetic & Snow Videos",
    "slug": "aesthetic-snow-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 499,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 998,
    "stock_status": "instock",
    "categories": [
      "Aesthetic Reels"
    ],
    "reel_count": 2000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/aesthetic-snow-reels-bundle-2-5-2-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/aesthetic-snow-reels-bundle-2-5-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1wipbO6v0Pfi6EPt1JnNztsHECXi-GX7E",
    "short_description": "Snowy landscapes, winter mood and calm aesthetic visuals Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "description": "Snowy landscapes, winter mood and calm aesthetic visuals Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 367,
    "features": [
      "2000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-aesthetic-snow-reels-bundle",
        "name": "2000+ Aesthetic Snow Reels Bundle – Winter Ae.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1wipbO6v0Pfi6EPt1JnNztsHECXi-GX7E"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-cycling-reels-bundle",
    "name": "3000+ Cycling Reels Bundle – Cycling & Outdoor Sports Videos",
    "slug": "cycling-reels-bundle",
    "status": "publish",
    "price": 139,
    "regular_price": 699,
    "sale_price": 139,
    "reseller_price": 199,
    "reseller_regular_price": 1398,
    "stock_status": "instock",
    "categories": [
      "Fitness & Sports"
    ],
    "reel_count": 3000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/cycling-reels-bundle-2-5-2-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/cycling-reels-bundle-2-5-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1MAYeihHGT85ZWXWqEdng6vPP5RCpvPfy",
    "short_description": "Cycling, outdoor riding and sports-oriented short videos Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "description": "Cycling, outdoor riding and sports-oriented short videos Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 404,
    "features": [
      "3000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-cycling-reels-bundle",
        "name": "3000+ Cycling Reels Bundle – Cycling & Outdoo.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1MAYeihHGT85ZWXWqEdng6vPP5RCpvPfy"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-couple-2500",
    "name": "2500+ Aesthetic Couple Reels Bundle – Romantic Love & Couple Videos",
    "slug": "aesthetic-couple-reels-bundle",
    "status": "publish",
    "price": 119,
    "regular_price": 649,
    "sale_price": 119,
    "reseller_price": 199,
    "reseller_regular_price": 1298,
    "stock_status": "instock",
    "categories": [
      "Relationship Reels"
    ],
    "reel_count": 2500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/aesthetic-couple-reels-bundle-2-5-2-1-768x576.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/aesthetic-couple-reels-bundle-2-5-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/19Keg7QTg-fPPnFr00_2xJy7Nb-dLqNNi",
    "short_description": "Romantic couple aesthetics, love edits and relationship-themed visuals Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "description": "Romantic couple aesthetics, love edits and relationship-themed visuals Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 441,
    "features": [
      "2500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-aesthetic-couple-reels-bundle",
        "name": "2500+ Aesthetic Couple Reels Bundle – Romanti.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/19Keg7QTg-fPPnFr00_2xJy7Nb-dLqNNi"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-cute-cats-reels-bundle",
    "name": "3000+ Cute Cats Reels Bundle – Cute & Adorable Cat Videos",
    "slug": "cute-cats-reels-bundle",
    "status": "publish",
    "price": 139,
    "regular_price": 699,
    "sale_price": 139,
    "reseller_price": 199,
    "reseller_regular_price": 1398,
    "stock_status": "instock",
    "categories": [
      "Animals & Nature Reels"
    ],
    "reel_count": 3000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/cute-cats-reels-bundle-2-5-2-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/cute-cats-reels-bundle-2-5-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1FzX1JR3R7ue-5f32BBj4bnoGK9m8XjB_",
    "short_description": "Cute, adorable and entertaining cat videos Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "description": "Cute, adorable and entertaining cat videos Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 478,
    "features": [
      "3000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-cute-cats-reels-bundle",
        "name": "3000+ Cute Cats Reels Bundle – Cute & Adorabl.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1FzX1JR3R7ue-5f32BBj4bnoGK9m8XjB_"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-clash-royale-clash-of-clans-reels-bundle",
    "name": "2000+ Clash Royale & Clash of Clans Reels Bundle – Mobile Gaming Clips & Edits",
    "slug": "clash-royale-clash-of-clans-reels-bundle",
    "status": "publish",
    "price": 119,
    "regular_price": 599,
    "sale_price": 119,
    "reseller_price": 199,
    "reseller_regular_price": 1198,
    "stock_status": "instock",
    "categories": [
      "Gaming Reels"
    ],
    "reel_count": 2000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/clash-royale-clash-of-clans-reels-bundle-2-5-2-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/clash-royale-clash-of-clans-reels-bundle-2-5-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1-bD8mfZ18M-78IWKsz-QpoY-1f52L_Yi",
    "short_description": "Clash Royale and Clash of Clans gameplay clips, edits and memorable moments Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before o...",
    "description": "Clash Royale and Clash of Clans gameplay clips, edits and memorable moments Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before o...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 515,
    "features": [
      "2000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-clash-royale-clash-of-clans-reels-bundle",
        "name": "2000+ Clash Royale & Clash of Clans Reels Bun.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1-bD8mfZ18M-78IWKsz-QpoY-1f52L_Yi"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-emotional-reels-bundle",
    "name": "1,200+ Emotional Reels Bundle – Premium 720p Videos",
    "slug": "emotional-reels-bundle",
    "status": "publish",
    "price": 69,
    "regular_price": 345,
    "sale_price": 69,
    "reseller_price": 149,
    "reseller_regular_price": 690,
    "stock_status": "instock",
    "categories": [
      "Aesthetic Reels"
    ],
    "reel_count": 200,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/emotional-reels-bundle-6-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/emotional-reels-bundle-6-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1ymqRm0p1P7v67HFeP6Y9ww4tqm7-WyVt",
    "short_description": "✨ Emotional Reels Bundle includes 1,200+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file si...",
    "description": "✨ Emotional Reels Bundle includes 1,200+ niche-focused vertical videos for faster content planning. 🎬 720p HD MP4 reels for Instagram, Facebook and YouTube Shorts. 📱 Hindi & English content with an estimated file si...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 232,
    "features": [
      "200+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-emotional-reels-bundle",
        "name": "1,200+ Emotional Reels Bundle – Premium 720p.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1ymqRm0p1P7v67HFeP6Y9ww4tqm7-WyVt"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-domo-ai-reels-bundle",
    "name": "500+ Domo AI Reels Bundle – Viral AI Visuals for Reels & Shorts",
    "slug": "domo-ai-reels-bundle",
    "status": "publish",
    "price": 89,
    "regular_price": 399,
    "sale_price": 89,
    "reseller_price": 149,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "AI Reels"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/domo-ai-reels-bundle-5-2-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/domo-ai-reels-bundle-5-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1tXuZA2NwHm5WvwAvddkzhsTUMn4nN4-C",
    "short_description": "Stylised AI-generated visual content with a modern experimental look Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "description": "Stylised AI-generated visual content with a modern experimental look Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 269,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-domo-ai-reels-bundle",
        "name": "500+ Domo AI Reels Bundle – Viral AI Visuals.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1tXuZA2NwHm5WvwAvddkzhsTUMn4nN4-C"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-sigma-male-reels-bundle",
    "name": "3000+ Sigma Male Reels Bundle – Attitude, Discipline & Mindset Videos",
    "slug": "sigma-male-reels-bundle",
    "status": "publish",
    "price": 79,
    "regular_price": 349,
    "sale_price": 79,
    "reseller_price": 149,
    "reseller_regular_price": 698,
    "stock_status": "instock",
    "categories": [
      "Motivation & Mindset"
    ],
    "reel_count": 3000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/sigma-male-reels-bundle-5-2-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/sigma-male-reels-bundle-5-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1yuIaelcfvKommBi5uD7WhRA8HBnt5KbH",
    "short_description": "Attitude, discipline, confidence and mindset-oriented short videos Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "description": "Attitude, discipline, confidence and mindset-oriented short videos Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 306,
    "features": [
      "3000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-sigma-male-reels-bundle",
        "name": "3000+ Sigma Male Reels Bundle – Attitude, Dis.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1yuIaelcfvKommBi5uD7WhRA8HBnt5KbH"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-god-1000",
    "name": "1000+ God Reels Bundle – Devotional & Spiritual Videos",
    "slug": "god-reels-bundle",
    "status": "publish",
    "price": 59,
    "regular_price": 249,
    "sale_price": 59,
    "reseller_price": 129,
    "reseller_regular_price": 498,
    "stock_status": "instock",
    "categories": [
      "Devotional & Spiritual"
    ],
    "reel_count": 1000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/god-reels-bundle-5-2-1-768x576.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/god-reels-bundle-5-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1zReKMy4EctgGD2MWsL6SS25qXhQwjlPq",
    "short_description": "Devotional, divine and spiritual short-form videos Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "description": "Devotional, divine and spiritual short-form videos Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 343,
    "features": [
      "1000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-god-reels-bundle",
        "name": "1000+ God Reels Bundle – Devotional & Spiritu.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1zReKMy4EctgGD2MWsL6SS25qXhQwjlPq"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-korean-girl-reels-bundle",
    "name": "500+ Korean Girl Reels Bundle – Aesthetic Fashion & Lifestyle Videos",
    "slug": "korean-girl-reels-bundle",
    "status": "publish",
    "price": 89,
    "regular_price": 399,
    "sale_price": 89,
    "reseller_price": 149,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "Aesthetic Reels"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/korean-girl-reels-bundle-5-2-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/korean-girl-reels-bundle-5-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1Gsv266UM7MuF-fjWgpC2smKPvYmh1en_",
    "short_description": "Korean-inspired fashion, beauty and aesthetic lifestyle visuals Files: MP4 · 9:16 vertical · 720 × 1280 (HD). For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license be...",
    "description": "Korean-inspired fashion, beauty and aesthetic lifestyle visuals Files: MP4 · 9:16 vertical · 720 × 1280 (HD). For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license be...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 380,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-korean-girl-reels-bundle",
        "name": "500+ Korean Girl Reels Bundle – Aesthetic Fas.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1Gsv266UM7MuF-fjWgpC2smKPvYmh1en_"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-space-aesthetic-reels-bundle",
    "name": "1000+ Space Aesthetic Reels Bundle – Cinematic Space Videos for Reels & Shorts",
    "slug": "space-aesthetic-reels-bundle",
    "status": "publish",
    "price": 59,
    "regular_price": 249,
    "sale_price": 59,
    "reseller_price": 129,
    "reseller_regular_price": 498,
    "stock_status": "instock",
    "categories": [
      "Aesthetic Reels"
    ],
    "reel_count": 1000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/space-aesthetic-reels-bundle-5-2-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/space-aesthetic-reels-bundle-5-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1Ykmi_mcwvChCkcL1hMtEdW6AJAW3reVU",
    "short_description": "Cinematic space, galaxy, universe and atmospheric visual content Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "description": "Cinematic space, galaxy, universe and atmospheric visual content Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 417,
    "features": [
      "1000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-space-aesthetic-reels-bundle",
        "name": "1000+ Space Aesthetic Reels Bundle – Cinemati.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1Ykmi_mcwvChCkcL1hMtEdW6AJAW3reVU"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-800-ai-horror-reels-bundle",
    "name": "800+ AI Horror Reels Bundle – Scary Cinematic Horror Videos",
    "slug": "800-ai-horror-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 399,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "Horror Reels"
    ],
    "reel_count": 800,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/800-ai-horror-reels-bundle-2-2-1.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/800-ai-horror-reels-bundle-2-2-1.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1UqLiv-4GDWsef3_VuAkf3misrI9vd4tT",
    "short_description": "Scary AI visuals, creepy characters and cinematic horror-story moments Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check the listed d...",
    "description": "Scary AI visuals, creepy characters and cinematic horror-story moments Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check the listed d...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 454,
    "features": [
      "800+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-800-ai-horror-reels-bundle",
        "name": "800+ AI Horror Reels Bundle – Scary Cinematic.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1UqLiv-4GDWsef3_VuAkf3misrI9vd4tT"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-500-ai-anime-girl-aesthetic-lifestyle-reels",
    "name": "500+ AI Anime Girl Aesthetic Lifestyle Reels – Cozy Anime Girl Lifestyle Videos",
    "slug": "500-ai-anime-girl-aesthetic-lifestyle-reels",
    "status": "publish",
    "price": 99,
    "regular_price": 399,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "Anime Reels"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/500-ai-anime-girl-aesthetic-lifestyle-reels-reels-bundle-5-2-1.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/500-ai-anime-girl-aesthetic-lifestyle-reels-reels-bundle-5-2-1.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1GotSOpN8Wg82R0gkxn_ZXc6KbDuk7ANa?usp=drive_link",
    "short_description": "Soft anime girl lifestyle, cozy scenes and aesthetic everyday moments Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check the listed de...",
    "description": "Soft anime girl lifestyle, cozy scenes and aesthetic everyday moments Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check the listed de...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 491,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-500-ai-anime-girl-aesthetic-lifestyle-reels",
        "name": "500+ AI Anime Girl Aesthetic Lifestyle Reels.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1GotSOpN8Wg82R0gkxn_ZXc6KbDuk7ANa?usp=drive_link"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-200-ai-patal-lok-narkh-yamraj-reels",
    "name": "200+ AI Patal Lok Narkh Yamraj Reels – Mythic Yamraj & Patal Lok Story Videos",
    "slug": "200-ai-patal-lok-narkh-yamraj-reels",
    "status": "publish",
    "price": 99,
    "regular_price": 399,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "Story Reels"
    ],
    "reel_count": 200,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/200-ai-patal-lok-narkh-yamraj-reels-reels-bundle-5-2-1.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/200-ai-patal-lok-narkh-yamraj-reels-reels-bundle-5-2-1.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1sR-kTocZYa70fDAlt1nri1sLSVVbCoEw",
    "short_description": "Yamraj-inspired underworld mythology, dark fantasy and Hindi story visuals Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check the list...",
    "description": "Yamraj-inspired underworld mythology, dark fantasy and Hindi story visuals Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check the list...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 208,
    "features": [
      "200+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-200-ai-patal-lok-narkh-yamraj-reels",
        "name": "200+ AI Patal Lok Narkh Yamraj Reels – Mythic.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1sR-kTocZYa70fDAlt1nri1sLSVVbCoEw"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-500-viral-ai-celebrity-reels-bundle",
    "name": "500+ Viral AI Celebrity Reels Bundle – Trending Celebrity-Style Videos",
    "slug": "500-viral-ai-celebrity-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 399,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "Entertainment Reels"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/500-viral-ai-celebrity-reels-bundle-5-2-1.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/500-viral-ai-celebrity-reels-bundle-5-2-1.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1szhIza2r97vuxXg8T_fEASUte-BDKrc0",
    "short_description": "AI celebrity-style, entertainment, fashion and glamour-oriented content Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check the listed ...",
    "description": "AI celebrity-style, entertainment, fashion and glamour-oriented content Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check the listed ...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 245,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-500-viral-ai-celebrity-reels-bundle",
        "name": "500+ Viral AI Celebrity Reels Bundle – Trendi.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1szhIza2r97vuxXg8T_fEASUte-BDKrc0"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-600-ai-tiny-dancers-reels-bundle",
    "name": "600+ AI Tiny Dancers Reels Bundle – Magical Tiny Dancing Videos",
    "slug": "600-ai-tiny-dancers-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 399,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "Entertainment Reels"
    ],
    "reel_count": 600,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/600_ai_tiny_dancers_reels_bundle-reels-bundle-5-2-1.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/600_ai_tiny_dancers_reels_bundle-reels-bundle-5-2-1.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1o_O5sBBhML79QKJOagwUmlp-6qWk5dFp?usp=sharing",
    "short_description": "Tiny AI dancer characters, magical movement and visually playful dance scenes Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check the l...",
    "description": "Tiny AI dancer characters, magical movement and visually playful dance scenes Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check the l...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 282,
    "features": [
      "600+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-600-ai-tiny-dancers-reels-bundle",
        "name": "600+ AI Tiny Dancers Reels Bundle – Magical T.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1o_O5sBBhML79QKJOagwUmlp-6qWk5dFp?usp=sharing"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-600-ai-animal-reels-bundle",
    "name": "600+ AI Animal Reels Bundle – Cute Viral Animal Videos",
    "slug": "600-ai-animal-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 399,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "Animals & Nature Reels"
    ],
    "reel_count": 600,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/600_ai_animal_reels_bundle-reels-bundle-7-2-1.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/600_ai_animal_reels_bundle-reels-bundle-7-2-1.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1lXK8icsrN-ggglg53pkZapSixTeBywD4",
    "short_description": "AI-generated animals, cute pet-style scenes and entertaining animal visuals Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check the lis...",
    "description": "AI-generated animals, cute pet-style scenes and entertaining animal visuals Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check the lis...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 319,
    "features": [
      "600+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-600-ai-animal-reels-bundle",
        "name": "600+ AI Animal Reels Bundle – Cute Viral Anim.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1lXK8icsrN-ggglg53pkZapSixTeBywD4"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-1500-ai-glowing-motion-graphics-reels-bundle",
    "name": "1500+ AI Glowing Motion Graphics Reels Bundle – Neon Motion Graphics & Visual Loops",
    "slug": "1500-ai-glowing-motion-graphics-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 399,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "Art & Animation Reels"
    ],
    "reel_count": 1500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/glowing_motion_graphics_reel_bundle-reels-bundle-4-2-1.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/glowing_motion_graphics_reel_bundle-reels-bundle-4-2-1.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1BhSfthOy9i0K5z-BLDW53v1xAR_nnrKP?usp=drive_link",
    "short_description": "Glowing animation, neon visual loops and motion-graphics content Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check the listed details...",
    "description": "Glowing animation, neon visual loops and motion-graphics content Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check the listed details...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 356,
    "features": [
      "1500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-1500-ai-glowing-motion-graphics-reels-bundle",
        "name": "1500+ AI Glowing Motion Graphics Reels Bundle.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1BhSfthOy9i0K5z-BLDW53v1xAR_nnrKP?usp=drive_link"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-1000-hot-webseries-reels-bundle",
    "name": "1000+ Hot Webseries Reels Bundle – Web Series Clips for Reels & Shorts",
    "slug": "1000-hot-webseries-reels-bundle",
    "status": "publish",
    "price": 149,
    "regular_price": 499,
    "sale_price": 149,
    "reseller_price": 199,
    "reseller_regular_price": 998,
    "stock_status": "instock",
    "categories": [
      "Entertainment Reels"
    ],
    "reel_count": 1000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/1000-hot-webseries-clips-bundle-reels-bundle-4-2-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/1000-hot-webseries-clips-bundle-reels-bundle-4-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/17ua0IomCH1ot8D1nlO3kNSGw-NzvUTC1?usp=sharing",
    "short_description": "Short entertainment clips and memorable web-series scenes Files: MP4 · 9:16 vertical · HD / Full HD (varies by clip). For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and li...",
    "description": "Short entertainment clips and memorable web-series scenes Files: MP4 · 9:16 vertical · HD / Full HD (varies by clip). For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and li...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 393,
    "features": [
      "1000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-1000-hot-webseries-reels-bundle",
        "name": "1000+ Hot Webseries Reels Bundle – Web Series.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/17ua0IomCH1ot8D1nlO3kNSGw-NzvUTC1?usp=sharing"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-hot-girls-reels-bundle",
    "name": "10000+ Hot Girls Reels Bundle – Glamour, Fashion & Aesthetic Videos",
    "slug": "hot-girls-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 299,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 598,
    "stock_status": "instock",
    "categories": [
      "Aesthetic Reels"
    ],
    "reel_count": 10000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/10000-hot-girls-reels-bundle-4-2-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/10000-hot-girls-reels-bundle-4-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1DaIU_BeG5NCj6TfbxABFT_ORhJRcjAid",
    "short_description": "Glamour, fashion, lifestyle and aesthetic model-style short videos Files: MP4 · 9:16 vertical · HD / Full HD (varies by clip). For creators planning niche-focused Reels, Shorts and social posts. Check the listed detai...",
    "description": "Glamour, fashion, lifestyle and aesthetic model-style short videos Files: MP4 · 9:16 vertical · HD / Full HD (varies by clip). For creators planning niche-focused Reels, Shorts and social posts. Check the listed detai...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 430,
    "features": [
      "10000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-hot-girls-reels-bundle",
        "name": "10000+ Hot Girls Reels Bundle – Glamour, Fash.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1DaIU_BeG5NCj6TfbxABFT_ORhJRcjAid"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-baby-food-250",
    "name": "250+ Baby Food Eating Reels Bundle – Cute Baby Food & Eating Videos",
    "slug": "250-baby-food-eating-reels-bundle",
    "status": "publish",
    "price": 69,
    "regular_price": 399,
    "sale_price": 69,
    "reseller_price": 149,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "Kids & Baby Reels"
    ],
    "reel_count": 250,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "/baby-strawberry-reel.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/250-baby-food-eating-reels-bundle-4-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1lXK8icsrN-ggglg53pkZapSixTeBywD4",
    "short_description": "Cute baby eating, food-reaction and family-friendly short videos Files: MP4 · 9:16 vertical · HD / Full HD (varies by clip). For creators planning niche-focused Reels, Shorts and social posts. Check the listed details...",
    "description": "Cute baby eating, food-reaction and family-friendly short videos Files: MP4 · 9:16 vertical · HD / Full HD (varies by clip). For creators planning niche-focused Reels, Shorts and social posts. Check the listed details...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 467,
    "features": [
      "250+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-250-baby-food-eating-reels-bundle",
        "name": "250+ Baby Food Eating Reels Bundle – Cute Bab.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1lXK8icsrN-ggglg53pkZapSixTeBywD4"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-dark-aesthetic-reels-bundle",
    "name": "3000+ Dark Aesthetic Reels Bundle – Dark, Moody & Cinematic Aesthetic Videos",
    "slug": "dark-aesthetic-reels-bundle",
    "status": "publish",
    "price": 139,
    "regular_price": 699,
    "sale_price": 139,
    "reseller_price": 199,
    "reseller_regular_price": 1398,
    "stock_status": "instock",
    "categories": [
      "Aesthetic Reels"
    ],
    "reel_count": 3000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/dark-aesthetic-reels-bundle-4-2-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/dark-aesthetic-reels-bundle-4-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1QOkJHMXKxOG833xPTHbk0Vxr-ng8OK2Y",
    "short_description": "Dark, moody and cinematic aesthetic visuals Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "description": "Dark, moody and cinematic aesthetic visuals Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 504,
    "features": [
      "3000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-dark-aesthetic-reels-bundle",
        "name": "3000+ Dark Aesthetic Reels Bundle – Dark, Moo.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1QOkJHMXKxOG833xPTHbk0Vxr-ng8OK2Y"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-dosti-friendship-reels-bundle",
    "name": "2600+ Dosti Friendship Reels Bundle – Friendship, Dosti & Bond Videos",
    "slug": "dosti-friendship-reels-bundle",
    "status": "publish",
    "price": 119,
    "regular_price": 599,
    "sale_price": 119,
    "reseller_price": 199,
    "reseller_regular_price": 1198,
    "stock_status": "instock",
    "categories": [
      "Relationship Reels"
    ],
    "reel_count": 2600,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/dosti-friendship-reels-bundle-4-2-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/dosti-friendship-reels-bundle-4-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/17RWTBSDlYDOPAgc74bYYcsrVXB0l_7oO",
    "short_description": "Friendship, dosti, emotional bonds and relatable best-friend moments Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "description": "Friendship, dosti, emotional bonds and relatable best-friend moments Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 221,
    "features": [
      "2600+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-dosti-friendship-reels-bundle",
        "name": "2600+ Dosti Friendship Reels Bundle – Friends.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/17RWTBSDlYDOPAgc74bYYcsrVXB0l_7oO"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-camera-tips-photography-reels-bundle",
    "name": "3000+ Camera Tips Reels Bundle – Photography & Camera Tips Videos",
    "slug": "camera-tips-photography-reels-bundle",
    "status": "publish",
    "price": 139,
    "regular_price": 699,
    "sale_price": 139,
    "reseller_price": 199,
    "reseller_regular_price": 1398,
    "stock_status": "instock",
    "categories": [
      "Education Reels"
    ],
    "reel_count": 3000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/camera-tips-photography-reels-bundle-4-2-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/camera-tips-photography-reels-bundle-4-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1URrxhfqB5Uj7oAtx38iFEKFmmqSmg32q",
    "short_description": "Camera techniques, photography tips and creator-focused educational content Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before o...",
    "description": "Camera techniques, photography tips and creator-focused educational content Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before o...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 258,
    "features": [
      "3000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-camera-tips-photography-reels-bundle",
        "name": "3000+ Camera Tips Reels Bundle – Photography.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1URrxhfqB5Uj7oAtx38iFEKFmmqSmg32q"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-funny-comments-reels-bundle",
    "name": "3500+ Funny Comments Reels Bundle – Funny Comment & Reaction Videos",
    "slug": "funny-comments-reels-bundle",
    "status": "publish",
    "price": 139,
    "regular_price": 699,
    "sale_price": 139,
    "reseller_price": 199,
    "reseller_regular_price": 1398,
    "stock_status": "instock",
    "categories": [
      "Comedy Reels"
    ],
    "reel_count": 3500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/funny-comments-reels-bundle-4-2-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/funny-comments-reels-bundle-4-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1n5Kmptz2Xsy58yJmtYCDxZUMcvAMmCGj",
    "short_description": "Funny comment reactions, humour edits and shareable comedy content Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "description": "Funny comment reactions, humour edits and shareable comedy content Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 295,
    "features": [
      "3500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-funny-comments-reels-bundle",
        "name": "3500+ Funny Comments Reels Bundle – Funny Com.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1n5Kmptz2Xsy58yJmtYCDxZUMcvAMmCGj"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-cringe-reels-bundle",
    "name": "3000+ Cringe Reels Bundle – Funny Reaction & Cringe Videos",
    "slug": "cringe-reels-bundle",
    "status": "publish",
    "price": 129,
    "regular_price": 649,
    "sale_price": 129,
    "reseller_price": 199,
    "reseller_regular_price": 1298,
    "stock_status": "instock",
    "categories": [
      "Comedy Reels"
    ],
    "reel_count": 3000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/cringe-reels-bundle-4-2-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/cringe-reels-bundle-4-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1_9pvf_-cGy-o73_uUpf_9bszLuHMZGDY",
    "short_description": "Awkward, funny and reaction-friendly viral entertainment clips Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "description": "Awkward, funny and reaction-friendly viral entertainment clips Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 332,
    "features": [
      "3000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-cringe-reels-bundle",
        "name": "3000+ Cringe Reels Bundle – Funny Reaction &.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1_9pvf_-cGy-o73_uUpf_9bszLuHMZGDY"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-runway-models-reels-bundle",
    "name": "2500+ Runway Models Reels Bundle – Fashion, Runway & Model Videos",
    "slug": "runway-models-reels-bundle",
    "status": "publish",
    "price": 129,
    "regular_price": 649,
    "sale_price": 129,
    "reseller_price": 199,
    "reseller_regular_price": 1298,
    "stock_status": "instock",
    "categories": [
      "Aesthetic Reels"
    ],
    "reel_count": 2500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/runway-models-reels-bundle-4-2-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/runway-models-reels-bundle-4-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/10PTEaF19fN1FeCtD88KKsvOH7G06kEz3",
    "short_description": "Runway fashion, model walks, style visuals and premium fashion content Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "description": "Runway fashion, model walks, style visuals and premium fashion content Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 369,
    "features": [
      "2500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-runway-models-reels-bundle",
        "name": "2500+ Runway Models Reels Bundle – Fashion, R.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/10PTEaF19fN1FeCtD88KKsvOH7G06kEz3"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-ai-story-reels-bundle",
    "name": "800+ AI Story Reels Bundle – Cinematic AI Fantasy Story Videos",
    "slug": "ai-story-reels-bundle",
    "status": "publish",
    "price": 69,
    "regular_price": 349,
    "sale_price": 69,
    "reseller_price": 149,
    "reseller_regular_price": 698,
    "stock_status": "instock",
    "categories": [
      "Story Reels"
    ],
    "reel_count": 800,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/ai-story-reels-bundle-4-2-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/ai-story-reels-bundle-4-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1_9Bc62KBfWmEwAqqCSy3m93zDXaSMRAz",
    "short_description": "Cinematic AI-generated stories with fantasy and narrative visuals Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "description": "Cinematic AI-generated stories with fantasy and narrative visuals Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 406,
    "features": [
      "800+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-ai-story-reels-bundle",
        "name": "800+ AI Story Reels Bundle – Cinematic AI Fan.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1_9Bc62KBfWmEwAqqCSy3m93zDXaSMRAz"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-stop-scrolling-reels-bundle",
    "name": "2000+ Stop Scrolling Reels Bundle – Scroll-Stopping Viral Videos & Hooks",
    "slug": "stop-scrolling-reels-bundle",
    "status": "publish",
    "price": 89,
    "regular_price": 499,
    "sale_price": 89,
    "reseller_price": 149,
    "reseller_regular_price": 998,
    "stock_status": "instock",
    "categories": [
      "Entertainment Reels"
    ],
    "reel_count": 2000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/stop-scrolling-reels-bundle-4-2-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/stop-scrolling-reels-bundle-4-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1As8EsNnBFVbU3VPU4F6A5UHI4U77Dm0Y",
    "short_description": "Attention-grabbing short videos designed around strong visual hooks and unusual moments Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and lice...",
    "description": "Attention-grabbing short videos designed around strong visual hooks and unusual moments Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and lice...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 443,
    "features": [
      "2000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-stop-scrolling-reels-bundle",
        "name": "2000+ Stop Scrolling Reels Bundle – Scroll-St.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1As8EsNnBFVbU3VPU4F6A5UHI4U77Dm0Y"
      }
    ],
    "created_at": "2026-10-13T15:14:00.563Z"
  },
  {
    "id": "rb-mafia-cars-reels-bundle",
    "name": "4500+ Mafia Cars Reels Bundle – Luxury Car & Mafia-Style Edits",
    "slug": "mafia-cars-reels-bundle",
    "status": "publish",
    "price": 149,
    "regular_price": 799,
    "sale_price": 149,
    "reseller_price": 199,
    "reseller_regular_price": 1598,
    "stock_status": "instock",
    "categories": [
      "Cars & Vehicles"
    ],
    "reel_count": 4500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/mafia-cars-reels-bundle-4-2-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/mafia-cars-reels-bundle-4-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1SJ8-JFS-kCC58nPL8-CqL1xsi3ATrwGa",
    "short_description": "Dark mafia-style car edits, premium vehicles and luxury automotive visuals Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before or...",
    "description": "Dark mafia-style car edits, premium vehicles and luxury automotive visuals Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before or...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 480,
    "features": [
      "4500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-mafia-cars-reels-bundle",
        "name": "4500+ Mafia Cars Reels Bundle – Luxury Car &.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1SJ8-JFS-kCC58nPL8-CqL1xsi3ATrwGa"
      }
    ],
    "created_at": "2026-10-13T15:14:00.564Z"
  },
  {
    "id": "rb-mythical-reels-bundle",
    "name": "1100+ Mythical Reels Bundle – Fantasy, Mythical & Magical Story Videos",
    "slug": "mythical-reels-bundle",
    "status": "publish",
    "price": 89,
    "regular_price": 449,
    "sale_price": 89,
    "reseller_price": 149,
    "reseller_regular_price": 898,
    "stock_status": "instock",
    "categories": [
      "Fantasy Reels"
    ],
    "reel_count": 1100,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/mythical-reels-bundle-4-2-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/mythical-reels-bundle-4-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1zTU283ItPP2_rsXZW-qhu-d-vg5ACJal",
    "short_description": "Mythical characters, magical worlds and fantasy story visuals Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "description": "Mythical characters, magical worlds and fantasy story visuals Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 517,
    "features": [
      "1100+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-mythical-reels-bundle",
        "name": "1100+ Mythical Reels Bundle – Fantasy, Mythic.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1zTU283ItPP2_rsXZW-qhu-d-vg5ACJal"
      }
    ],
    "created_at": "2026-10-13T15:14:00.564Z"
  },
  {
    "id": "rb-retro-bollywood-reels-bundle",
    "name": "3000+ Retro Bollywood Reels Bundle – Classic Bollywood Music & Movie Edits",
    "slug": "retro-bollywood-reels-bundle",
    "status": "publish",
    "price": 129,
    "regular_price": 699,
    "sale_price": 129,
    "reseller_price": 199,
    "reseller_regular_price": 1398,
    "stock_status": "instock",
    "categories": [
      "Entertainment Reels"
    ],
    "reel_count": 3000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/retro-bollywood-reels-bundle-4-2-1.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/retro-bollywood-reels-bundle-4-2-1.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1pNpYCJI2VkgwlYcS1Hru5vBb5E1Ho9zM",
    "short_description": "Retro Bollywood cinema, music and nostalgic entertainment edits Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "description": "Retro Bollywood cinema, music and nostalgic entertainment edits Files: MP4 · 9:16 vertical. For creators planning niche-focused Reels, Shorts and social posts. Check the listed details and license before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 234,
    "features": [
      "3000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-retro-bollywood-reels-bundle",
        "name": "3000+ Retro Bollywood Reels Bundle – Classic.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1pNpYCJI2VkgwlYcS1Hru5vBb5E1Ho9zM"
      }
    ],
    "created_at": "2026-10-13T15:14:00.564Z"
  },
  {
    "id": "rb-500-hot-anushka-sen-ai-reels-bundle",
    "name": "500+ Hot Anushka Sen AI Reels Bundle – Celebrity-Style Fashion & Lifestyle Videos",
    "slug": "500-hot-anushka-sen-ai-reels-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 399,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "Entertainment Reels"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/500-hot-anushka-sen-ai-reels-bundle-1-2-1.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/500-hot-anushka-sen-ai-reels-bundle-1-2-1.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/u/0/folders/1Y2aHFLb7TlYMwH1EwKPjYZOSa5cqs0Ao",
    "short_description": "AI celebrity-style fashion, beauty, travel and lifestyle themed content inspired by the named public figure Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts...",
    "description": "AI celebrity-style fashion, beauty, travel and lifestyle themed content inspired by the named public figure Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 271,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-500-hot-anushka-sen-ai-reels-bundle",
        "name": "500+ Hot Anushka Sen AI Reels Bundle – Celebr.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/u/0/folders/1Y2aHFLb7TlYMwH1EwKPjYZOSa5cqs0Ao"
      }
    ],
    "created_at": "2026-10-13T15:14:00.564Z"
  },
  {
    "id": "rb-500-ai-indian-glamour-model-reels-bundle",
    "name": "500+ AI Indian Glamour Model Reels Bundle – Stylish AI Indian Glamour Videos",
    "slug": "500-ai-indian-glamour-model-reels-bundle",
    "status": "publish",
    "price": 199,
    "regular_price": 399,
    "sale_price": 199,
    "reseller_price": 199,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "Aesthetic Reels"
    ],
    "reel_count": 500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/500-ai-indian-glamour-model-reels-bundle-1-2-1.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/500-ai-indian-glamour-model-reels-bundle-1-2-1.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1TSbXdYIXyC_ifUhqWNUKvvaY-T0UU2yI?usp=drive_link",
    "short_description": "AI Indian glamour, fashion, model-style and creator-oriented visual content Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check the lis...",
    "description": "AI Indian glamour, fashion, model-style and creator-oriented visual content Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check the lis...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 308,
    "features": [
      "500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-500-ai-indian-glamour-model-reels-bundle",
        "name": "500+ AI Indian Glamour Model Reels Bundle – S.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1TSbXdYIXyC_ifUhqWNUKvvaY-T0UU2yI?usp=drive_link"
      }
    ],
    "created_at": "2026-10-13T15:14:00.564Z"
  },
  {
    "id": "rb-9000-foreign-models-reels-bundle-pack",
    "name": "9000+ Foreign Models Reels Bundle Pack – Fashion, Glamour & Model Videos",
    "slug": "9000-foreign-models-reels-bundle-pack",
    "status": "publish",
    "price": 139,
    "regular_price": 399,
    "sale_price": 139,
    "reseller_price": 199,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "Aesthetic Reels"
    ],
    "reel_count": 9000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/9000-foreign-models-reels-bundle-pack-1-2-1.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/9000-foreign-models-reels-bundle-pack-1-2-1.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1TIPCKgYu8iPnXgurqdzwBGfQlUGM2z8a",
    "short_description": "International model, fashion, glamour and lifestyle-oriented reel content Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check the liste...",
    "description": "International model, fashion, glamour and lifestyle-oriented reel content Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check the liste...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 345,
    "features": [
      "9000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-9000-foreign-models-reels-bundle-pack",
        "name": "9000+ Foreign Models Reels Bundle Pack – Fash.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1TIPCKgYu8iPnXgurqdzwBGfQlUGM2z8a"
      }
    ],
    "created_at": "2026-10-13T15:14:00.564Z"
  },
  {
    "id": "rb-2000-viral-ai-influencer-reel-bundle",
    "name": "2000+ Viral AI Influencer Reel Bundle – Trending AI Influencer-Style Content",
    "slug": "2000-viral-ai-influencer-reel-bundle",
    "status": "publish",
    "price": 99,
    "regular_price": 399,
    "sale_price": 99,
    "reseller_price": 149,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "Influencer Reels"
    ],
    "reel_count": 2000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/2000-viral-ai-influencer-reel-bundle-reels-bundle-1-2-1.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/2000-viral-ai-influencer-reel-bundle-reels-bundle-1-2-1.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1lXK8icsrN-ggglg53pkZapSixTeBywD4",
    "short_description": "AI influencer-style fashion, lifestyle, travel and creator-focused visuals Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check the list...",
    "description": "AI influencer-style fashion, lifestyle, travel and creator-focused visuals Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check the list...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 382,
    "features": [
      "2000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-2000-viral-ai-influencer-reel-bundle",
        "name": "2000+ Viral AI Influencer Reel Bundle – Trend.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1lXK8icsrN-ggglg53pkZapSixTeBywD4"
      }
    ],
    "created_at": "2026-10-13T15:14:00.564Z"
  },
  {
    "id": "rb-1000-ai-dog-reels-bundle",
    "name": "1000+ AI Dog Reels Bundle – Cute Viral Dog Videos for Reels & Shorts",
    "slug": "1000-ai-dog-reels-bundle",
    "status": "publish",
    "price": 109,
    "regular_price": 399,
    "sale_price": 109,
    "reseller_price": 199,
    "reseller_regular_price": 798,
    "stock_status": "instock",
    "categories": [
      "Animals & Nature Reels"
    ],
    "reel_count": 1000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/1000-ai-dog-reels-bundle-1-2-1.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/1000-ai-dog-reels-bundle-1-2-1.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1pzrBTYK_rbJwxSK2RTVjC9u6OKjHTH3Z",
    "short_description": "Cute AI dog moments, funny pet scenes and shareable canine content Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check the listed detai...",
    "description": "Cute AI dog moments, funny pet scenes and shareable canine content Files: MP4 · 9:16 vertical · HD / Full HD (varies by file). For creators planning niche-focused Reels, Shorts and social posts. Check the listed detai...",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 419,
    "features": [
      "1000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-1000-ai-dog-reels-bundle",
        "name": "1000+ AI Dog Reels Bundle – Cute Viral Dog Vi.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1pzrBTYK_rbJwxSK2RTVjC9u6OKjHTH3Z"
      }
    ],
    "created_at": "2026-10-13T15:14:00.564Z"
  },
  {
    "id": "rb-all-bundles-reseller-rights",
    "name": "All Bundles + Reseller Rights",
    "slug": "all-bundles-reseller-rights",
    "status": "publish",
    "price": 699,
    "regular_price": 4499,
    "sale_price": 699,
    "reseller_price": 199,
    "reseller_regular_price": 8998,
    "stock_status": "instock",
    "categories": [
      "AI Reels"
    ],
    "reel_count": 1000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/thumbnail.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/thumbnail.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1lXK8icsrN-ggglg53pkZapSixTeBywD4",
    "short_description": "One-time access to the current ReelsBundles library with reseller rights.",
    "description": "One-time access to the current ReelsBundles library with reseller rights.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 456,
    "features": [
      "1000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-all-bundles-reseller-rights",
        "name": "All Bundles + Reseller Rights.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1lXK8icsrN-ggglg53pkZapSixTeBywD4"
      }
    ],
    "created_at": "2026-10-13T15:14:00.564Z"
  },
  {
    "id": "rb-all-bundles-personal-use",
    "name": "All Bundles – Personal Use",
    "slug": "all-bundles-personal-use",
    "status": "publish",
    "price": 549,
    "regular_price": 2599,
    "sale_price": 549,
    "reseller_price": 199,
    "reseller_regular_price": 5198,
    "stock_status": "instock",
    "categories": [
      "AI Reels"
    ],
    "reel_count": 1000,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/09/thumbnail.png",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/09/thumbnail.png"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1lXK8icsrN-ggglg53pkZapSixTeBywD4",
    "short_description": "One-time access to the current ReelsBundles library for personal use.",
    "description": "One-time access to the current ReelsBundles library for personal use.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 4.9,
    "review_count": 493,
    "features": [
      "1000+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-all-bundles-personal-use",
        "name": "All Bundles – Personal Use.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1lXK8icsrN-ggglg53pkZapSixTeBywD4"
      }
    ],
    "created_at": "2026-10-13T15:14:00.564Z"
  },
  {
    "id": "rb-billionaire-lifestyle-reels-bundle",
    "name": "4500+ Billionaire Lifestyle Reels Bundle – Luxury, Wealth & Success Lifestyle Videos",
    "slug": "billionaire-lifestyle-reels-bundle",
    "status": "publish",
    "price": 149,
    "regular_price": 799,
    "sale_price": 149,
    "reseller_price": 199,
    "reseller_regular_price": 1598,
    "stock_status": "instock",
    "categories": [
      "Lifestyle & Luxury"
    ],
    "reel_count": 4500,
    "format": "MP4",
    "resolution": "1080P",
    "featured_image": "https://reelsbundles.in/wp-content/uploads/2026/10/billionaire-lifestyle-reels-bundle-5-2.jpg",
    "gallery_images": [
      "https://reelsbundles.in/wp-content/uploads/2026/10/billionaire-lifestyle-reels-bundle-5-2.jpg"
    ],
    "preview_video_url": "",
    "preview_video_urls": [],
    "google_drive_link": "https://drive.google.com/drive/folders/1a05WsTVABvi8r5gcCcgfA9Fx-88DseMc",
    "short_description": "Luxury Lifestyle Reels Bundle: The Luxury Lifestyle Reels Bundle is listed on this store as the Billionaire Lifestyle Reels Bundle. Review bundle specifications, previews and the selected licence before ordering.",
    "description": "Luxury Lifestyle Reels Bundle: The Luxury Lifestyle Reels Bundle is listed on this store as the Billionaire Lifestyle Reels Bundle. Review bundle specifications, previews and the selected licence before ordering.",
    "tags": [
      "TRENDING",
      "HD",
      "Google Drive"
    ],
    "is_hot": false,
    "is_trending": true,
    "rating": 5,
    "review_count": 210,
    "features": [
      "4500+ High Quality Viral Reels",
      "Ready to Post with Trending Audio",
      "Clean Without Watermarks",
      "Instant Lifetime Google Drive Access"
    ],
    "faqs": [
      {
        "question": "How do I access the reels after payment?",
        "answer": "You will receive an instant Google Drive download link immediately on the success page and via email."
      },
      {
        "question": "Can I edit these reels or add my logo?",
        "answer": "Yes! All reels are 100% watermark-free MP4 files that you can edit in CapCut, VN, Premiere Pro, or post directly."
      }
    ],
    "downloadable": true,
    "downloads_count": 0,
    "files": [
      {
        "id": "file-billionaire-lifestyle-reels-bundle",
        "name": "4500+ Billionaire Lifestyle Reels Bundle – Lu.zip (Google Drive Access)",
        "file_url": "https://drive.google.com/drive/folders/1a05WsTVABvi8r5gcCcgfA9Fx-88DseMc"
      }
    ],
    "created_at": "2026-10-13T15:14:00.564Z"
  }
];

// All 62 categories matching competitor catalog
export const initialCategories: CategoryItem[] = [
  {
    "id": "cat-110",
    "name": "Aesthetic Reels",
    "slug": "aesthetic-reels",
    "count": 12,
    "icon": "✨",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.549Z"
  },
  {
    "id": "cat-15",
    "name": "Ai",
    "slug": "ai",
    "count": 2,
    "icon": "🤖",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.556Z"
  },
  {
    "id": "cat-59",
    "name": "AI Reels",
    "slug": "ai-reels",
    "count": 41,
    "icon": "🤖",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.556Z"
  },
  {
    "id": "cat-178",
    "name": "AI Story Reels",
    "slug": "ai-story-reels",
    "count": 1,
    "icon": "🤖",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.556Z"
  },
  {
    "id": "cat-111",
    "name": "Animals Reels",
    "slug": "animals-reels",
    "count": 8,
    "icon": "🦁",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.556Z"
  },
  {
    "id": "cat-125",
    "name": "Animation Reels",
    "slug": "animation-reels",
    "count": 7,
    "icon": "🎨",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.556Z"
  },
  {
    "id": "cat-74",
    "name": "Anime Reels",
    "slug": "anime-reels",
    "count": 3,
    "icon": "✦",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.556Z"
  },
  {
    "id": "cat-146",
    "name": "Art &amp",
    "slug": "art-amp",
    "count": 3,
    "icon": "✦",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.556Z"
  },
  {
    "id": "cat-129",
    "name": "ASMR Reels",
    "slug": "asmr-reels",
    "count": 2,
    "icon": "✦",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.556Z"
  },
  {
    "id": "cat-196",
    "name": "Attitude Reels",
    "slug": "attitude-reels",
    "count": 1,
    "icon": "✦",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.556Z"
  },
  {
    "id": "cat-61",
    "name": "Baby Reels",
    "slug": "baby-reels",
    "count": 3,
    "icon": "👶",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.556Z"
  },
  {
    "id": "cat-193",
    "name": "Business &amp",
    "slug": "business-amp",
    "count": 2,
    "icon": "💼",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.556Z"
  },
  {
    "id": "cat-131",
    "name": "Business Reels",
    "slug": "business-reels",
    "count": 1,
    "icon": "💼",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.556Z"
  },
  {
    "id": "cat-137",
    "name": "Car Reels",
    "slug": "car-reels",
    "count": 1,
    "icon": "🏎️",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.556Z"
  },
  {
    "id": "cat-148",
    "name": "Cars &amp",
    "slug": "cars-amp",
    "count": 2,
    "icon": "🏎️",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.556Z"
  },
  {
    "id": "cat-122",
    "name": "Cars Reels",
    "slug": "cars-reels",
    "count": 1,
    "icon": "🏎️",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-188",
    "name": "Cartoon &amp",
    "slug": "cartoon-amp",
    "count": 3,
    "icon": "🎨",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-85",
    "name": "Celebrity Reels",
    "slug": "celebrity-reels",
    "count": 2,
    "icon": "✦",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-139",
    "name": "Collectibles Reels",
    "slug": "collectibles-reels",
    "count": 1,
    "icon": "✦",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-121",
    "name": "Comedy Reels",
    "slug": "comedy-reels",
    "count": 9,
    "icon": "🎭",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-147",
    "name": "Craft Reels",
    "slug": "craft-reels",
    "count": 4,
    "icon": "✦",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-181",
    "name": "Dance Reels",
    "slug": "dance-reels",
    "count": 1,
    "icon": "✦",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-114",
    "name": "Devotional Reels",
    "slug": "devotional-reels",
    "count": 2,
    "icon": "🕉️",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-191",
    "name": "DIY &amp",
    "slug": "diy-amp",
    "count": 1,
    "icon": "✦",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-84",
    "name": "DIY Reels",
    "slug": "diy-reels",
    "count": 4,
    "icon": "✦",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-123",
    "name": "Education Reels",
    "slug": "education-reels",
    "count": 1,
    "icon": "✦",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-182",
    "name": "Emotional &amp",
    "slug": "emotional-amp",
    "count": 1,
    "icon": "✦",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-65",
    "name": "Entertainment Reels",
    "slug": "entertainment-reels",
    "count": 7,
    "icon": "🤖",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-90",
    "name": "Fantasy Reels",
    "slug": "fantasy-reels",
    "count": 6,
    "icon": "✦",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-112",
    "name": "Fashion Reels",
    "slug": "fashion-reels",
    "count": 3,
    "icon": "✨",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-194",
    "name": "Finance Reels",
    "slug": "finance-reels",
    "count": 2,
    "icon": "💼",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-76",
    "name": "Fitness Reels",
    "slug": "fitness-reels",
    "count": 8,
    "icon": "💪",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-116",
    "name": "Gaming Reels",
    "slug": "gaming-reels",
    "count": 6,
    "icon": "🎮",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-93",
    "name": "Health Reels",
    "slug": "health-reels",
    "count": 3,
    "icon": "✦",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-88",
    "name": "Horror Reels",
    "slug": "horror-reels",
    "count": 1,
    "icon": "✦",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-91",
    "name": "Influencer Reels",
    "slug": "influencer-reels",
    "count": 2,
    "icon": "✦",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-180",
    "name": "Inspirational Reels",
    "slug": "inspirational-reels",
    "count": 1,
    "icon": "✦",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-124",
    "name": "Kids Reels",
    "slug": "kids-reels",
    "count": 1,
    "icon": "👶",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-195",
    "name": "Lifestyle &amp",
    "slug": "lifestyle-amp",
    "count": 1,
    "icon": "✦",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-87",
    "name": "Lifestyle Reels",
    "slug": "lifestyle-reels",
    "count": 5,
    "icon": "✦",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-120",
    "name": "Luxury Reels",
    "slug": "luxury-reels",
    "count": 2,
    "icon": "✦",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-145",
    "name": "Mindset Reels",
    "slug": "mindset-reels",
    "count": 2,
    "icon": "🔥",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-92",
    "name": "Model Reels",
    "slug": "model-reels",
    "count": 4,
    "icon": "✦",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-144",
    "name": "Motivation &amp",
    "slug": "motivation-amp",
    "count": 2,
    "icon": "🔥",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-113",
    "name": "Motivation Reels",
    "slug": "motivation-reels",
    "count": 3,
    "icon": "🔥",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-119",
    "name": "Movie Reels",
    "slug": "movie-reels",
    "count": 2,
    "icon": "🎬",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-185",
    "name": "Nature &amp",
    "slug": "nature-amp",
    "count": 1,
    "icon": "🦁",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-118",
    "name": "Nature Reels",
    "slug": "nature-reels",
    "count": 4,
    "icon": "🦁",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-179",
    "name": "Podcast Reels",
    "slug": "podcast-reels",
    "count": 1,
    "icon": "✦",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-115",
    "name": "Relationship Reels",
    "slug": "relationship-reels",
    "count": 3,
    "icon": "✦",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-187",
    "name": "Religious Reels",
    "slug": "religious-reels",
    "count": 2,
    "icon": "✦",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-190",
    "name": "Satisfying &amp",
    "slug": "satisfying-amp",
    "count": 1,
    "icon": "✦",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-149",
    "name": "Space &amp",
    "slug": "space-amp",
    "count": 1,
    "icon": "✦",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-186",
    "name": "Spiritual &amp",
    "slug": "spiritual-amp",
    "count": 2,
    "icon": "🕉️",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-192",
    "name": "Sports &amp",
    "slug": "sports-amp",
    "count": 1,
    "icon": "💪",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-117",
    "name": "Sports Reels",
    "slug": "sports-reels",
    "count": 6,
    "icon": "💪",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-72",
    "name": "Story Reels",
    "slug": "story-reels",
    "count": 13,
    "icon": "📖",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-133",
    "name": "Tech Reels",
    "slug": "tech-reels",
    "count": 1,
    "icon": "✦",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.557Z"
  },
  {
    "id": "cat-189",
    "name": "Tools &amp",
    "slug": "tools-amp",
    "count": 2,
    "icon": "✦",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.562Z"
  },
  {
    "id": "cat-152",
    "name": "Travel Reels",
    "slug": "travel-reels",
    "count": 1,
    "icon": "✦",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.562Z"
  },
  {
    "id": "cat-173",
    "name": "Trending Reels",
    "slug": "trending-reels",
    "count": 1,
    "icon": "✦",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.562Z"
  },
  {
    "id": "cat-138",
    "name": "Unboxing Reels",
    "slug": "unboxing-reels",
    "count": 1,
    "icon": "✦",
    "bg": "#f3ebff",
    "border": "#e9d8fd",
    "iconColor": "#6d36e8",
    "description": "",
    "created_at": "2026-10-13T15:14:00.562Z"
  }
];

// All 67 live store reels
export const initialReels: ReelItem[] = [
  {
    "id": "reel-baby-food",
    "title": "250+ Baby Food Eating Reels Bundle – Cute Baby Food & Eating Videos",
    "videoUrl": "https://reelsbundlepro.com/wp-content/uploads/2026/04/250-Baby-Food-Eating-Food-Ai-Reels-1.mp4",
    "videoType": "direct",
    "poster": "/baby-strawberry-reel.jpg",
    "category": "Baby Reels",
    "bundleId": "rb-baby-food-250",
    "bundleSlug": "250-baby-food-eating-reels-bundle",
    "bundleTitle": "250+ Baby Food Eating Reels Bundle – Cute Baby Food & Eating Videos",
    "bundlePrice": 69,
    "bundleOriginalPrice": 399,
    "reelCount": 250,
    "likes": 0,
    "views": 4,
    "isActive": true,
    "order": 0
  },
  {
    "id": "reel-1",
    "title": "1000+ Ulti Pulti Duniya / Ulti Duniya / Reverse World AI Reels Bundle",
    "videoUrl": "https://reelsbundles.in/wp-content/uploads/2026/09/nanha_sitara__1786042855_3957936752362456535_16711909525.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/1000-ulti-pulti-duniya-ulti-duniya-reverse-world-ai-reels-bundle-2-768x576.png",
    "category": "AI Reels",
    "bundleId": "rb-bundle-1",
    "bundleSlug": "1000-ulti-pulti-duniya-reverse-world-ai-reels-bundle",
    "bundleTitle": "1000+ Ulti Pulti Duniya / Ulti Duniya / Reverse World AI Reels Bundle",
    "bundlePrice": 59,
    "bundleOriginalPrice": 499,
    "reelCount": 1000,
    "likes": 49,
    "views": 138,
    "isActive": true,
    "order": 1
  },
  {
    "id": "reel-2",
    "title": "2000+ Viral AI Influencer Reel Bundle – Trending AI Influencer-Style Content",
    "videoUrl": "https://videobundlehub.com/wp-content/uploads/2026/07/6bafe9724fea4f12942f2b372e0a7b5b.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/500-ai-influencer-girls-reels-bundle-4-2-768x576.jpg",
    "category": "AI Reels",
    "bundleId": "rb-bundle-2",
    "bundleSlug": "500-ai-influencer-girls-reels-bundle",
    "bundleTitle": "2000+ Viral AI Influencer Reel Bundle – Trending AI Influencer-Style Content",
    "bundlePrice": 99,
    "bundleOriginalPrice": 399,
    "reelCount": 2000,
    "likes": 86,
    "views": 231,
    "isActive": true,
    "order": 2
  },
  {
    "id": "reel-3",
    "title": "500+ AI Influencer Girls Reels Bundle – Virtual Influencer & AI Girl Videos",
    "videoUrl": "https://bundles.digitalceoempire.com/wp-content/uploads/2026/03/instagram_1772870533472720p.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/500-ai-influencer-girls-reels-bundle-4-2-768x576.jpg",
    "category": "AI Reels",
    "bundleId": "rb-bundle-3",
    "bundleSlug": "500-ai-influencer-girls-reels-bundle",
    "bundleTitle": "500+ AI Influencer Girls Reels Bundle – Virtual Influencer & AI Girl Videos",
    "bundlePrice": 99,
    "bundleOriginalPrice": 399,
    "reelCount": 500,
    "likes": 123,
    "views": 324,
    "isActive": true,
    "order": 3
  },
  {
    "id": "reel-4",
    "title": "450+ AI Health Awareness Reels Bundle – Health, Wellness & Nutrition Videos",
    "videoUrl": "https://shop.worklinc.com/wp-content/uploads/2026/02/450-Health-Awareness-Ai-Reels-Bundle3.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/450-ai-health-awareness-reels-bundle-4-2-768x576.jpg",
    "category": "AI Reels",
    "bundleId": "rb-bundle-4",
    "bundleSlug": "450-ai-health-awareness-reels-bundle",
    "bundleTitle": "450+ AI Health Awareness Reels Bundle – Health, Wellness & Nutrition Videos",
    "bundlePrice": 89,
    "bundleOriginalPrice": 499,
    "reelCount": 450,
    "likes": 160,
    "views": 417,
    "isActive": true,
    "order": 4
  },
  {
    "id": "reel-5",
    "title": "250+ Baby Food Eating Reels Bundle – Cute Baby Food & Eating Videos",
    "videoUrl": "https://reelsbundlepro.com/wp-content/uploads/2026/04/250-Baby-Food-Eating-Food-Ai-Reels-3.mp4",
    "videoType": "direct",
    "poster": "/baby-strawberry-reel.jpg",
    "category": "Baby Reels",
    "bundleId": "rb-bundle-5",
    "bundleSlug": "250-baby-food-eating-reels-bundle",
    "bundleTitle": "250+ Baby Food Eating Reels Bundle – Cute Baby Food & Eating Videos",
    "bundlePrice": 69,
    "bundleOriginalPrice": 399,
    "reelCount": 250,
    "likes": 197,
    "views": 510,
    "isActive": true,
    "order": 5
  },
  {
    "id": "reel-6",
    "title": "450+ AI Health Awareness Reels Bundle – Health, Wellness & Nutrition Videos",
    "videoUrl": "https://shop.worklinc.com/wp-content/uploads/2026/02/450-Health-Awareness-Ai-Reels-Bundle1.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/450-ai-health-awareness-reels-bundle-4-2-768x576.jpg",
    "category": "AI Reels",
    "bundleId": "rb-bundle-6",
    "bundleSlug": "450-ai-health-awareness-reels-bundle",
    "bundleTitle": "450+ AI Health Awareness Reels Bundle – Health, Wellness & Nutrition Videos",
    "bundlePrice": 89,
    "bundleOriginalPrice": 499,
    "reelCount": 450,
    "likes": 234,
    "views": 603,
    "isActive": true,
    "order": 6
  },
  {
    "id": "reel-7",
    "title": "500+ AI Influencer Girls Reels Bundle – Virtual Influencer & AI Girl Videos",
    "videoUrl": "https://digityl.shop/wp-content/uploads/2026/03/Video-682.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/500-ai-influencer-girls-reels-bundle-4-2-768x576.jpg",
    "category": "AI Reels",
    "bundleId": "rb-bundle-7",
    "bundleSlug": "500-ai-influencer-girls-reels-bundle",
    "bundleTitle": "500+ AI Influencer Girls Reels Bundle – Virtual Influencer & AI Girl Videos",
    "bundlePrice": 99,
    "bundleOriginalPrice": 399,
    "reelCount": 500,
    "likes": 271,
    "views": 696,
    "isActive": true,
    "order": 7
  },
  {
    "id": "reel-8",
    "title": "AI 3D Cartoon Reels Bundle – Viral 3D Cartoon Story Videos",
    "videoUrl": "https://digitstore.xyz/wp-content/uploads/2025/07/3d-Cartoon-78.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/2500-stickman-animation-reels-bundle-2-1024x768.png",
    "category": "AI Reels",
    "bundleId": "rb-bundle-8",
    "bundleSlug": "2500-stickman-animation-reels-bundle",
    "bundleTitle": "AI 3D Cartoon Reels Bundle – Viral 3D Cartoon Story Videos",
    "bundlePrice": 99,
    "bundleOriginalPrice": 499,
    "reelCount": 500,
    "likes": 308,
    "views": 789,
    "isActive": true,
    "order": 8
  },
  {
    "id": "reel-9",
    "title": "500+ AI Hulk Story Reels Bundle – AI Action & Superhero Story Videos",
    "videoUrl": "https://www.buyreels.in/assets/videos/reels/6.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/3200-ultimate-twisted-world-reel-bundle-reels-bundle-1-2-768x576.png",
    "category": "AI Reels",
    "bundleId": "rb-bundle-9",
    "bundleSlug": "3200-ultimate-twisted-world-reel-bundle",
    "bundleTitle": "500+ AI Hulk Story Reels Bundle – AI Action & Superhero Story Videos",
    "bundlePrice": 99,
    "bundleOriginalPrice": 249,
    "reelCount": 500,
    "likes": 345,
    "views": 882,
    "isActive": true,
    "order": 9
  },
  {
    "id": "reel-10",
    "title": "250+ Baby Food Eating Reels Bundle – Cute Baby Food & Eating Videos",
    "videoUrl": "https://betterbundle.in/wp-content/uploads/2026/01/BetterBundle.in-Food-with-Faces-Eating-Each-Other-Weirdly-Satisfying-ASMR-Snack-Show_1080p.mp4",
    "videoType": "direct",
    "poster": "/baby-strawberry-reel.jpg",
    "category": "Baby Reels",
    "bundleId": "rb-bundle-10",
    "bundleSlug": "250-baby-food-eating-reels-bundle",
    "bundleTitle": "250+ Baby Food Eating Reels Bundle – Cute Baby Food & Eating Videos",
    "bundlePrice": 69,
    "bundleOriginalPrice": 399,
    "reelCount": 250,
    "likes": 32,
    "views": 75,
    "isActive": true,
    "order": 10
  },
  {
    "id": "reel-11",
    "title": "AI 3D Cartoon Reels Bundle – Viral 3D Cartoon Story Videos",
    "videoUrl": "https://digitstore.xyz/wp-content/uploads/2025/07/3d-Cartoon-4.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/2500-stickman-animation-reels-bundle-2-1024x768.png",
    "category": "AI Reels",
    "bundleId": "rb-bundle-11",
    "bundleSlug": "2500-stickman-animation-reels-bundle",
    "bundleTitle": "AI 3D Cartoon Reels Bundle – Viral 3D Cartoon Story Videos",
    "bundlePrice": 99,
    "bundleOriginalPrice": 499,
    "reelCount": 500,
    "likes": 69,
    "views": 168,
    "isActive": true,
    "order": 11
  },
  {
    "id": "reel-12",
    "title": "3200+ Ultimate Twisted World Reel Bundle – Fantasy Creature & Twisted World Stories",
    "videoUrl": "https://thesocialgame.in/cdn/shop/videos/c/vp/cb40175ef61549908b6012f4d1d40f23/cb40175ef61549908b6012f4d1d40f23.HD-1080p-2.5Mbps-93083440.mp4?v=0",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/3200-ultimate-twisted-world-reel-bundle-reels-bundle-1-2-768x576.png",
    "category": "AI Reels",
    "bundleId": "rb-bundle-12",
    "bundleSlug": "3200-ultimate-twisted-world-reel-bundle",
    "bundleTitle": "3200+ Ultimate Twisted World Reel Bundle – Fantasy Creature & Twisted World Stories",
    "bundlePrice": 199,
    "bundleOriginalPrice": 399,
    "reelCount": 3200,
    "likes": 106,
    "views": 261,
    "isActive": true,
    "order": 12
  },
  {
    "id": "reel-13",
    "title": "250+ Baby Food Eating Reels Bundle – Cute Baby Food & Eating Videos",
    "videoUrl": "https://betterbundle.in/wp-content/uploads/2026/01/BetterBundle.in-Four-fruits-four-faces-one-weirdly-satisfying-moment_480p.mp4",
    "videoType": "direct",
    "poster": "/baby-strawberry-reel.jpg",
    "category": "Baby Reels",
    "bundleId": "rb-bundle-13",
    "bundleSlug": "250-baby-food-eating-reels-bundle",
    "bundleTitle": "250+ Baby Food Eating Reels Bundle – Cute Baby Food & Eating Videos",
    "bundlePrice": 69,
    "bundleOriginalPrice": 399,
    "reelCount": 250,
    "likes": 143,
    "views": 354,
    "isActive": true,
    "order": 13
  },
  {
    "id": "reel-14",
    "title": "500+ AI Influencer Girls Reels Bundle – Virtual Influencer & AI Girl Videos",
    "videoUrl": "https://bundles.digitalceoempire.com/wp-content/uploads/2026/03/instagram_1772842939930720p.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/500-ai-influencer-girls-reels-bundle-4-2-768x576.jpg",
    "category": "AI Reels",
    "bundleId": "rb-bundle-14",
    "bundleSlug": "500-ai-influencer-girls-reels-bundle",
    "bundleTitle": "500+ AI Influencer Girls Reels Bundle – Virtual Influencer & AI Girl Videos",
    "bundlePrice": 99,
    "bundleOriginalPrice": 399,
    "reelCount": 500,
    "likes": 180,
    "views": 447,
    "isActive": true,
    "order": 14
  },
  {
    "id": "reel-15",
    "title": "AI Hindi Story Reels Bundle – 1-Minute Hindi Kahani & Story Videos",
    "videoUrl": "https://digitstore.xyz/wp-content/uploads/2025/06/Story-1-Min-1.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/hindi-motivational-reels-bundle-7-768x576.jpg",
    "category": "AI Reels",
    "bundleId": "rb-bundle-15",
    "bundleSlug": "hindi-motivational-reels-bundle",
    "bundleTitle": "AI Hindi Story Reels Bundle – 1-Minute Hindi Kahani & Story Videos",
    "bundlePrice": 59,
    "bundleOriginalPrice": 399,
    "reelCount": 500,
    "likes": 217,
    "views": 540,
    "isActive": true,
    "order": 15
  },
  {
    "id": "reel-16",
    "title": "500+ Dr Skeleton Health Reels Bundle – Health Awareness & Medical Story Videos",
    "videoUrl": "https://bundles.digitalceoempire.com/wp-content/uploads/2026/03/DR-SKELETON.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/500-dr-skeleton-health-reels-bundle-1-2-768x576.png",
    "category": "AI Reels",
    "bundleId": "rb-bundle-16",
    "bundleSlug": "500-dr-skeleton-health-reels-bundle",
    "bundleTitle": "500+ Dr Skeleton Health Reels Bundle – Health Awareness & Medical Story Videos",
    "bundlePrice": 99,
    "bundleOriginalPrice": 399,
    "reelCount": 500,
    "likes": 254,
    "views": 633,
    "isActive": true,
    "order": 16
  },
  {
    "id": "reel-17",
    "title": "250+ Baby Food Eating Reels Bundle – Cute Baby Food & Eating Videos",
    "videoUrl": "https://betterbundle.in/wp-content/uploads/2026/01/BetterBundle.in-Cupcake-eats-cake%E2%80%A6-and-enjoys-it-a-little-too-much-%F0%9F%A7%81%F0%9F%98%85-ASMR-AI-Animation_1080p.mp4",
    "videoType": "direct",
    "poster": "/baby-strawberry-reel.jpg",
    "category": "Baby Reels",
    "bundleId": "rb-bundle-17",
    "bundleSlug": "250-baby-food-eating-reels-bundle",
    "bundleTitle": "250+ Baby Food Eating Reels Bundle – Cute Baby Food & Eating Videos",
    "bundlePrice": 69,
    "bundleOriginalPrice": 399,
    "reelCount": 250,
    "likes": 291,
    "views": 726,
    "isActive": true,
    "order": 17
  },
  {
    "id": "reel-18",
    "title": "1000+ Ulti Pulti Duniya / Ulti Duniya / Reverse World AI Reels Bundle",
    "videoUrl": "https://reelsbundles.in/wp-content/uploads/2026/09/ai_animal_jokes_1789030266_3982995980797999061_24509764410.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/1000-ulti-pulti-duniya-ulti-duniya-reverse-world-ai-reels-bundle-2-768x576.png",
    "category": "AI Reels",
    "bundleId": "rb-bundle-18",
    "bundleSlug": "1000-ulti-pulti-duniya-reverse-world-ai-reels-bundle",
    "bundleTitle": "1000+ Ulti Pulti Duniya / Ulti Duniya / Reverse World AI Reels Bundle",
    "bundlePrice": 59,
    "bundleOriginalPrice": 499,
    "reelCount": 1000,
    "likes": 328,
    "views": 819,
    "isActive": true,
    "order": 18
  },
  {
    "id": "reel-19",
    "title": "500+ Mini Car Unboxing Reels Bundle",
    "videoUrl": "https://drive.google.com/drive/folders/1tULTw9Q3zng9W0RqWsun3CPmRwfLf4bV",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/2500-stickman-animation-reels-bundle-2-1024x768.png",
    "category": "ASMR Reels",
    "bundleId": "rb-bundle-19",
    "bundleSlug": "2500-stickman-animation-reels-bundle",
    "bundleTitle": "500+ Mini Car Unboxing Reels Bundle",
    "bundlePrice": 99,
    "bundleOriginalPrice": 129,
    "reelCount": 500,
    "likes": 15,
    "views": 912,
    "isActive": true,
    "order": 19
  },
  {
    "id": "reel-20",
    "title": "Chini",
    "videoUrl": "https://reelsbundles.in/wp-content/uploads/2026/09/gigglee_toons_1787416995_3969463571233179389_28226841059.mp4",
    "videoType": "direct",
    "poster": "/baby-strawberry-reel.jpg",
    "category": "AI Reels",
    "bundleId": "rb-bundle-20",
    "bundleSlug": "250-baby-food-eating-reels-bundle",
    "bundleTitle": "Chini",
    "bundlePrice": 59,
    "bundleOriginalPrice": 499,
    "reelCount": 1000,
    "likes": 52,
    "views": 105,
    "isActive": true,
    "order": 20
  },
  {
    "id": "reel-21",
    "title": "3200+ Ultimate Twisted World Reel Bundle – Fantasy Creature & Twisted World Stories",
    "videoUrl": "https://thesocialgame.in/cdn/shop/videos/c/vp/0d0437e637b34381b686a9fd761d738c/0d0437e637b34381b686a9fd761d738c.HD-1080p-2.5Mbps-93083435.mp4?v=0",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/3200-ultimate-twisted-world-reel-bundle-reels-bundle-1-2-768x576.png",
    "category": "AI Reels",
    "bundleId": "rb-bundle-21",
    "bundleSlug": "3200-ultimate-twisted-world-reel-bundle",
    "bundleTitle": "3200+ Ultimate Twisted World Reel Bundle – Fantasy Creature & Twisted World Stories",
    "bundlePrice": 199,
    "bundleOriginalPrice": 399,
    "reelCount": 3200,
    "likes": 89,
    "views": 198,
    "isActive": true,
    "order": 21
  },
  {
    "id": "reel-22",
    "title": "1200+ AI Glass Cutting ASMR Reels Bundle – Satisfying ASMR Videos for Reels & Shorts",
    "videoUrl": "https://shop.worklinc.com/wp-content/uploads/2025/07/WorkLinc.in-1751124780666.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/1200-glass-cutting-asmr-reels-bundle-4-2-1024x768.jpg",
    "category": "AI Reels",
    "bundleId": "rb-bundle-22",
    "bundleSlug": "1200-ai-glass-cutting-asmr-reels-bundle",
    "bundleTitle": "1200+ AI Glass Cutting ASMR Reels Bundle – Satisfying ASMR Videos for Reels & Shorts",
    "bundlePrice": 79,
    "bundleOriginalPrice": 399,
    "reelCount": 1200,
    "likes": 126,
    "views": 291,
    "isActive": true,
    "order": 22
  },
  {
    "id": "reel-23",
    "title": "500+ Mini Car Unboxing Reels Bundle",
    "videoUrl": "https://credibleearning.com/product/35329",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/2500-stickman-animation-reels-bundle-2-1024x768.png",
    "category": "ASMR Reels",
    "bundleId": "rb-bundle-23",
    "bundleSlug": "2500-stickman-animation-reels-bundle",
    "bundleTitle": "500+ Mini Car Unboxing Reels Bundle",
    "bundlePrice": 99,
    "bundleOriginalPrice": 129,
    "reelCount": 500,
    "likes": 163,
    "views": 384,
    "isActive": true,
    "order": 23
  },
  {
    "id": "reel-24",
    "title": "Dudh Dahi Freezer",
    "videoUrl": "https://brandigodigital.com/wp-content/uploads/2026/02/1-192.mp4",
    "videoType": "direct",
    "poster": "/baby-strawberry-reel.jpg",
    "category": "AI Reels",
    "bundleId": "rb-bundle-24",
    "bundleSlug": "250-baby-food-eating-reels-bundle",
    "bundleTitle": "Dudh Dahi Freezer",
    "bundlePrice": 89,
    "bundleOriginalPrice": 499,
    "reelCount": 450,
    "likes": 200,
    "views": 477,
    "isActive": true,
    "order": 24
  },
  {
    "id": "reel-25",
    "title": "500+ Mini Car Unboxing Reels Bundle",
    "videoUrl": "https://www.assetskart.shop/products",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/2500-stickman-animation-reels-bundle-2-1024x768.png",
    "category": "ASMR Reels",
    "bundleId": "rb-bundle-25",
    "bundleSlug": "2500-stickman-animation-reels-bundle",
    "bundleTitle": "500+ Mini Car Unboxing Reels Bundle",
    "bundlePrice": 99,
    "bundleOriginalPrice": 129,
    "reelCount": 500,
    "likes": 237,
    "views": 570,
    "isActive": true,
    "order": 25
  },
  {
    "id": "reel-26",
    "title": "1000+ Ulti Pulti Duniya / Ulti Duniya / Reverse World AI Reels Bundle",
    "videoUrl": "https://reelsbundles.in/wp-content/uploads/2026/09/badmash_bandar_2026-08-23_09-27-32_3969802714324662443_80276745034.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/1000-ulti-pulti-duniya-ulti-duniya-reverse-world-ai-reels-bundle-2-768x576.png",
    "category": "AI Reels",
    "bundleId": "rb-bundle-26",
    "bundleSlug": "1000-ulti-pulti-duniya-reverse-world-ai-reels-bundle",
    "bundleTitle": "1000+ Ulti Pulti Duniya / Ulti Duniya / Reverse World AI Reels Bundle",
    "bundlePrice": 59,
    "bundleOriginalPrice": 499,
    "reelCount": 1000,
    "likes": 274,
    "views": 663,
    "isActive": true,
    "order": 26
  },
  {
    "id": "reel-27",
    "title": "Mad Scientist",
    "videoUrl": "https://ziplystore.com/wp-content/uploads/2025/05/MSRB-LearnBUX-34.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/1500-mad-scientist-reels-bundle-4-2-1024x768.jpg",
    "category": "AI Reels",
    "bundleId": "rb-bundle-27",
    "bundleSlug": "1500-mad-scientist-reels-bundle",
    "bundleTitle": "Mad Scientist",
    "bundlePrice": 99,
    "bundleOriginalPrice": 399,
    "reelCount": 1500,
    "likes": 311,
    "views": 756,
    "isActive": true,
    "order": 27
  },
  {
    "id": "reel-28",
    "title": "450+ AI Health Awareness Reels Bundle – Health, Wellness & Nutrition Videos",
    "videoUrl": "https://shop.worklinc.com/wp-content/uploads/2026/02/450-Health-Awareness-Ai-Reels-Bundle4.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/450-ai-health-awareness-reels-bundle-4-2-768x576.jpg",
    "category": "AI Reels",
    "bundleId": "rb-bundle-28",
    "bundleSlug": "450-ai-health-awareness-reels-bundle",
    "bundleTitle": "450+ AI Health Awareness Reels Bundle – Health, Wellness & Nutrition Videos",
    "bundlePrice": 89,
    "bundleOriginalPrice": 499,
    "reelCount": 450,
    "likes": 348,
    "views": 849,
    "isActive": true,
    "order": 28
  },
  {
    "id": "reel-29",
    "title": "Mad Scientist",
    "videoUrl": "https://ziplystore.com/wp-content/uploads/2025/05/MSRB-LearnBUX-23.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/1500-mad-scientist-reels-bundle-4-2-1024x768.jpg",
    "category": "AI Reels",
    "bundleId": "rb-bundle-29",
    "bundleSlug": "1500-mad-scientist-reels-bundle",
    "bundleTitle": "Mad Scientist",
    "bundlePrice": 99,
    "bundleOriginalPrice": 399,
    "reelCount": 1500,
    "likes": 35,
    "views": 942,
    "isActive": true,
    "order": 29
  },
  {
    "id": "reel-30",
    "title": "1500+ AI Funny Kids Reels Bundle – Funny Kids & Baby Videos for Reels",
    "videoUrl": "https://thesocialgame.in/cdn/shop/videos/c/vp/1c1b0ab01ed741ddb1d8471a27cd21d0/1c1b0ab01ed741ddb1d8471a27cd21d0.HD-1080p-2.5Mbps-91483057.mp4?v=0",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/1500-ai-funny-kids-reels-bundle-4-2-768x576.jpg",
    "category": "AI Reels",
    "bundleId": "rb-bundle-30",
    "bundleSlug": "1500-ai-funny-kids-reels-bundle",
    "bundleTitle": "1500+ AI Funny Kids Reels Bundle – Funny Kids & Baby Videos for Reels",
    "bundlePrice": 99,
    "bundleOriginalPrice": 249,
    "reelCount": 1500,
    "likes": 72,
    "views": 135,
    "isActive": true,
    "order": 30
  },
  {
    "id": "reel-31",
    "title": "Mad Scientist",
    "videoUrl": "https://ziplystore.com/wp-content/uploads/2025/05/MSRB-LearnBUX-11.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/1500-mad-scientist-reels-bundle-4-2-1024x768.jpg",
    "category": "AI Reels",
    "bundleId": "rb-bundle-31",
    "bundleSlug": "1500-mad-scientist-reels-bundle",
    "bundleTitle": "Mad Scientist",
    "bundlePrice": 99,
    "bundleOriginalPrice": 399,
    "reelCount": 1500,
    "likes": 109,
    "views": 228,
    "isActive": true,
    "order": 31
  },
  {
    "id": "reel-32",
    "title": "3200+ Ultimate Twisted World Reel Bundle – Fantasy Creature & Twisted World Stories",
    "videoUrl": "https://thesocialgame.in/cdn/shop/videos/c/vp/04830f916c364d48a41ed521e0a806eb/04830f916c364d48a41ed521e0a806eb.HD-1080p-2.5Mbps-93083438.mp4?v=0",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/3200-ultimate-twisted-world-reel-bundle-reels-bundle-1-2-768x576.png",
    "category": "AI Reels",
    "bundleId": "rb-bundle-32",
    "bundleSlug": "3200-ultimate-twisted-world-reel-bundle",
    "bundleTitle": "3200+ Ultimate Twisted World Reel Bundle – Fantasy Creature & Twisted World Stories",
    "bundlePrice": 199,
    "bundleOriginalPrice": 399,
    "reelCount": 3200,
    "likes": 146,
    "views": 321,
    "isActive": true,
    "order": 32
  },
  {
    "id": "reel-33",
    "title": "250+ Baby Food Eating Reels Bundle – Cute Baby Food & Eating Videos",
    "videoUrl": "https://reelsbundlepro.com/wp-content/uploads/2026/04/250-Baby-Food-Eating-Food-Ai-Reels-2.mp4",
    "videoType": "direct",
    "poster": "/baby-strawberry-reel.jpg",
    "category": "Baby Reels",
    "bundleId": "rb-bundle-33",
    "bundleSlug": "250-baby-food-eating-reels-bundle",
    "bundleTitle": "250+ Baby Food Eating Reels Bundle – Cute Baby Food & Eating Videos",
    "bundlePrice": 69,
    "bundleOriginalPrice": 399,
    "reelCount": 250,
    "likes": 183,
    "views": 414,
    "isActive": true,
    "order": 33
  },
  {
    "id": "reel-34",
    "title": "3200+ Ultimate Twisted World Reel Bundle – Fantasy Creature & Twisted World Stories",
    "videoUrl": "https://thesocialgame.in/cdn/shop/videos/c/vp/3db91d46167a4d9a9a13f774702351ee/3db91d46167a4d9a9a13f774702351ee.HD-1080p-2.5Mbps-93083443.mp4?v=0",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/3200-ultimate-twisted-world-reel-bundle-reels-bundle-1-2-768x576.png",
    "category": "AI Reels",
    "bundleId": "rb-bundle-34",
    "bundleSlug": "3200-ultimate-twisted-world-reel-bundle",
    "bundleTitle": "3200+ Ultimate Twisted World Reel Bundle – Fantasy Creature & Twisted World Stories",
    "bundlePrice": 199,
    "bundleOriginalPrice": 399,
    "reelCount": 3200,
    "likes": 220,
    "views": 507,
    "isActive": true,
    "order": 34
  },
  {
    "id": "reel-35",
    "title": "Pani Puri",
    "videoUrl": "https://reelsbundles.in/wp-content/uploads/2026/09/gigglee_toons_1785564689_3953925385771531496_28226841059.mp4",
    "videoType": "direct",
    "poster": "/baby-strawberry-reel.jpg",
    "category": "AI Reels",
    "bundleId": "rb-bundle-35",
    "bundleSlug": "250-baby-food-eating-reels-bundle",
    "bundleTitle": "Pani Puri",
    "bundlePrice": 59,
    "bundleOriginalPrice": 499,
    "reelCount": 1000,
    "likes": 257,
    "views": 600,
    "isActive": true,
    "order": 35
  },
  {
    "id": "reel-36",
    "title": "500+ Dr Skeleton Health Reels Bundle – Health Awareness & Medical Story Videos",
    "videoUrl": "https://bundles.digitalceoempire.com/wp-content/uploads/2026/03/DR2.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/500-dr-skeleton-health-reels-bundle-1-2-768x576.png",
    "category": "AI Reels",
    "bundleId": "rb-bundle-36",
    "bundleSlug": "500-dr-skeleton-health-reels-bundle",
    "bundleTitle": "500+ Dr Skeleton Health Reels Bundle – Health Awareness & Medical Story Videos",
    "bundlePrice": 99,
    "bundleOriginalPrice": 399,
    "reelCount": 500,
    "likes": 294,
    "views": 693,
    "isActive": true,
    "order": 36
  },
  {
    "id": "reel-37",
    "title": "Mad Scientist",
    "videoUrl": "https://ziplystore.com/wp-content/uploads/2025/05/MSRB-LearnBUX-14.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/1500-mad-scientist-reels-bundle-4-2-1024x768.jpg",
    "category": "AI Reels",
    "bundleId": "rb-bundle-37",
    "bundleSlug": "1500-mad-scientist-reels-bundle",
    "bundleTitle": "Mad Scientist",
    "bundlePrice": 99,
    "bundleOriginalPrice": 399,
    "reelCount": 1500,
    "likes": 331,
    "views": 786,
    "isActive": true,
    "order": 37
  },
  {
    "id": "reel-38",
    "title": "250+ Baby Food Eating Reels Bundle – Cute Baby Food & Eating Videos",
    "videoUrl": "https://betterbundle.in/wp-content/uploads/2026/02/250-Baby-Food-Eating-AI-Reels-Bundle-3-betterbundle.in_.mp4",
    "videoType": "direct",
    "poster": "/baby-strawberry-reel.jpg",
    "category": "Baby Reels",
    "bundleId": "rb-bundle-38",
    "bundleSlug": "250-baby-food-eating-reels-bundle",
    "bundleTitle": "250+ Baby Food Eating Reels Bundle – Cute Baby Food & Eating Videos",
    "bundlePrice": 69,
    "bundleOriginalPrice": 399,
    "reelCount": 250,
    "likes": 18,
    "views": 879,
    "isActive": true,
    "order": 38
  },
  {
    "id": "reel-39",
    "title": "Mile to Dil - Baby Dancing",
    "videoUrl": "https://www.freebiesmockup.com/wp-content/uploads/2026/01/pin_335236766098802502.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/500-ai-baby-dancing-reels-bundle-4-2-768x576.png",
    "category": "AI Reels",
    "bundleId": "rb-bundle-39",
    "bundleSlug": "500-ai-baby-dancing-reels-bundle",
    "bundleTitle": "Mile to Dil - Baby Dancing",
    "bundlePrice": 59,
    "bundleOriginalPrice": 289,
    "reelCount": 500,
    "likes": 55,
    "views": 72,
    "isActive": true,
    "order": 39
  },
  {
    "id": "reel-40",
    "title": "Maa Ki ladli Pani Puri",
    "videoUrl": "https://thesocialgame.in/cdn/shop/videos/c/vp/b8d198cc79bd4e488f6e866768527ad5/b8d198cc79bd4e488f6e866768527ad5.HD-1080p-2.5Mbps-91483054.mp4?v=0",
    "videoType": "direct",
    "poster": "/baby-strawberry-reel.jpg",
    "category": "AI Reels",
    "bundleId": "rb-bundle-40",
    "bundleSlug": "250-baby-food-eating-reels-bundle",
    "bundleTitle": "Maa Ki ladli Pani Puri",
    "bundlePrice": 99,
    "bundleOriginalPrice": 249,
    "reelCount": 1500,
    "likes": 92,
    "views": 165,
    "isActive": true,
    "order": 40
  },
  {
    "id": "reel-41",
    "title": "AI 3D Cartoon Reels Bundle – Viral 3D Cartoon Story Videos",
    "videoUrl": "https://digitstore.xyz/wp-content/uploads/2025/07/3d-Cartoon-54.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/2500-stickman-animation-reels-bundle-2-1024x768.png",
    "category": "AI Reels",
    "bundleId": "rb-bundle-41",
    "bundleSlug": "2500-stickman-animation-reels-bundle",
    "bundleTitle": "AI 3D Cartoon Reels Bundle – Viral 3D Cartoon Story Videos",
    "bundlePrice": 99,
    "bundleOriginalPrice": 499,
    "reelCount": 500,
    "likes": 129,
    "views": 258,
    "isActive": true,
    "order": 41
  },
  {
    "id": "reel-42",
    "title": "500+ Mini Car Unboxing Reels Bundle",
    "videoUrl": "https://rtmcreator.com/blog/",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/2500-stickman-animation-reels-bundle-2-1024x768.png",
    "category": "ASMR Reels",
    "bundleId": "rb-bundle-42",
    "bundleSlug": "2500-stickman-animation-reels-bundle",
    "bundleTitle": "500+ Mini Car Unboxing Reels Bundle",
    "bundlePrice": 99,
    "bundleOriginalPrice": 129,
    "reelCount": 500,
    "likes": 166,
    "views": 351,
    "isActive": true,
    "order": 42
  },
  {
    "id": "reel-43",
    "title": "500+ AI Hulk Story Reels Bundle – AI Action & Superhero Story Videos",
    "videoUrl": "https://betterbundle.in/wp-content/uploads/2026/01/Hulk-Ne-Li-Apne-Baadla-hulk-desihulk-aihulk-hulkai-hulkvsredhulk-kawasaki-ai-trendingaihulk_1080p.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/3200-ultimate-twisted-world-reel-bundle-reels-bundle-1-2-768x576.png",
    "category": "AI Reels",
    "bundleId": "rb-bundle-43",
    "bundleSlug": "3200-ultimate-twisted-world-reel-bundle",
    "bundleTitle": "500+ AI Hulk Story Reels Bundle – AI Action & Superhero Story Videos",
    "bundlePrice": 99,
    "bundleOriginalPrice": 249,
    "reelCount": 500,
    "likes": 203,
    "views": 444,
    "isActive": true,
    "order": 43
  },
  {
    "id": "reel-44",
    "title": "Viral Influencer",
    "videoUrl": "https://thesocialgame.in/cdn/shop/videos/c/vp/f7006eec2a644229ba678e63eca5e0e6/f7006eec2a644229ba678e63eca5e0e6.HD-1080p-2.5Mbps-89320744.mp4?v=0",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/500-ai-influencer-girls-reels-bundle-4-2-768x576.jpg",
    "category": "AI Reels",
    "bundleId": "rb-bundle-44",
    "bundleSlug": "500-ai-influencer-girls-reels-bundle",
    "bundleTitle": "Viral Influencer",
    "bundlePrice": 99,
    "bundleOriginalPrice": 399,
    "reelCount": 2000,
    "likes": 240,
    "views": 537,
    "isActive": true,
    "order": 44
  },
  {
    "id": "reel-45",
    "title": "1200+ AI Glass Cutting ASMR Reels Bundle – Satisfying ASMR Videos for Reels & Shorts",
    "videoUrl": "https://shop.worklinc.com/wp-content/uploads/2025/07/WorkLinc.in-1751124794250.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/1200-glass-cutting-asmr-reels-bundle-4-2-1024x768.jpg",
    "category": "AI Reels",
    "bundleId": "rb-bundle-45",
    "bundleSlug": "1200-ai-glass-cutting-asmr-reels-bundle",
    "bundleTitle": "1200+ AI Glass Cutting ASMR Reels Bundle – Satisfying ASMR Videos for Reels & Shorts",
    "bundlePrice": 79,
    "bundleOriginalPrice": 399,
    "reelCount": 1200,
    "likes": 277,
    "views": 630,
    "isActive": true,
    "order": 45
  },
  {
    "id": "reel-46",
    "title": "250+ Baby Food Eating Reels Bundle – Cute Baby Food & Eating Videos",
    "videoUrl": "https://betterbundle.in/wp-content/uploads/2026/02/250-Baby-Food-Eating-AI-Reels-Bundle-2-betterbundle.in_.mp4",
    "videoType": "direct",
    "poster": "/baby-strawberry-reel.jpg",
    "category": "Baby Reels",
    "bundleId": "rb-bundle-46",
    "bundleSlug": "250-baby-food-eating-reels-bundle",
    "bundleTitle": "250+ Baby Food Eating Reels Bundle – Cute Baby Food & Eating Videos",
    "bundlePrice": 69,
    "bundleOriginalPrice": 399,
    "reelCount": 250,
    "likes": 314,
    "views": 723,
    "isActive": true,
    "order": 46
  },
  {
    "id": "reel-47",
    "title": "AI 3D Cartoon Reels Bundle – Viral 3D Cartoon Story Videos",
    "videoUrl": "https://digitstore.xyz/wp-content/uploads/2025/07/3d-Cartoon-2.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/2500-stickman-animation-reels-bundle-2-1024x768.png",
    "category": "AI Reels",
    "bundleId": "rb-bundle-47",
    "bundleSlug": "2500-stickman-animation-reels-bundle",
    "bundleTitle": "AI 3D Cartoon Reels Bundle – Viral 3D Cartoon Story Videos",
    "bundlePrice": 99,
    "bundleOriginalPrice": 499,
    "reelCount": 500,
    "likes": 351,
    "views": 816,
    "isActive": true,
    "order": 47
  },
  {
    "id": "reel-48",
    "title": "250+ Baby Food Eating Reels Bundle – Cute Baby Food & Eating Videos",
    "videoUrl": "https://betterbundle.in/wp-content/uploads/2026/02/250-Baby-Food-Eating-AI-Reels-Bundle-1-betterbundle.in_.mp4",
    "videoType": "direct",
    "poster": "/baby-strawberry-reel.jpg",
    "category": "Baby Reels",
    "bundleId": "rb-bundle-48",
    "bundleSlug": "250-baby-food-eating-reels-bundle",
    "bundleTitle": "250+ Baby Food Eating Reels Bundle – Cute Baby Food & Eating Videos",
    "bundlePrice": 69,
    "bundleOriginalPrice": 399,
    "reelCount": 250,
    "likes": 38,
    "views": 909,
    "isActive": true,
    "order": 48
  },
  {
    "id": "reel-49",
    "title": "500+ AI Influencer Girls Reels Bundle – Virtual Influencer & AI Girl Videos",
    "videoUrl": "https://thedigifyshop.com/wp-content/uploads/2026/05/1381731314.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/500-ai-influencer-girls-reels-bundle-4-2-768x576.jpg",
    "category": "AI Reels",
    "bundleId": "rb-bundle-49",
    "bundleSlug": "500-ai-influencer-girls-reels-bundle",
    "bundleTitle": "500+ AI Influencer Girls Reels Bundle – Virtual Influencer & AI Girl Videos",
    "bundlePrice": 99,
    "bundleOriginalPrice": 399,
    "reelCount": 500,
    "likes": 75,
    "views": 102,
    "isActive": true,
    "order": 49
  },
  {
    "id": "reel-50",
    "title": "250+ Baby Food Eating Reels Bundle – Cute Baby Food & Eating Videos",
    "videoUrl": "https://betterbundle.in/wp-content/uploads/2026/02/250-Baby-Food-Eating-AI-Reels-Bundle-4-betterbundle.in_.mp4",
    "videoType": "direct",
    "poster": "/baby-strawberry-reel.jpg",
    "category": "Baby Reels",
    "bundleId": "rb-bundle-50",
    "bundleSlug": "250-baby-food-eating-reels-bundle",
    "bundleTitle": "250+ Baby Food Eating Reels Bundle – Cute Baby Food & Eating Videos",
    "bundlePrice": 69,
    "bundleOriginalPrice": 399,
    "reelCount": 250,
    "likes": 112,
    "views": 195,
    "isActive": true,
    "order": 50
  },
  {
    "id": "reel-51",
    "title": "1000+ Ulti Pulti Duniya / Ulti Duniya / Reverse World AI Reels Bundle",
    "videoUrl": "https://reelsbundles.in/wp-content/uploads/2026/09/nanha_sitara__1788366077_3975953946883611117_16711909525.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/1000-ulti-pulti-duniya-ulti-duniya-reverse-world-ai-reels-bundle-2-768x576.png",
    "category": "AI Reels",
    "bundleId": "rb-bundle-51",
    "bundleSlug": "1000-ulti-pulti-duniya-reverse-world-ai-reels-bundle",
    "bundleTitle": "1000+ Ulti Pulti Duniya / Ulti Duniya / Reverse World AI Reels Bundle",
    "bundlePrice": 59,
    "bundleOriginalPrice": 499,
    "reelCount": 1000,
    "likes": 149,
    "views": 288,
    "isActive": true,
    "order": 51
  },
  {
    "id": "reel-52",
    "title": "Viral Influencer",
    "videoUrl": "https://thesocialgame.in/cdn/shop/videos/c/vp/aa0dbac015134b8d81194bd94ca5b187/aa0dbac015134b8d81194bd94ca5b187.HD-1080p-7.2Mbps-89320742.mp4?v=0",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/500-ai-influencer-girls-reels-bundle-4-2-768x576.jpg",
    "category": "AI Reels",
    "bundleId": "rb-bundle-52",
    "bundleSlug": "500-ai-influencer-girls-reels-bundle",
    "bundleTitle": "Viral Influencer",
    "bundlePrice": 99,
    "bundleOriginalPrice": 399,
    "reelCount": 2000,
    "likes": 186,
    "views": 381,
    "isActive": true,
    "order": 52
  },
  {
    "id": "reel-53",
    "title": "500+ AI Hulk Story Reels Bundle – AI Action & Superhero Story Videos",
    "videoUrl": "https://betterbundle.in/wp-content/uploads/2026/01/Hulk-Liya-Panga-Tun-Tun-Sahur-Se-hulk-aihulk-desihulk-hulkvstuntunsahur-ai-tungtungtungsahur_1080p.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/3200-ultimate-twisted-world-reel-bundle-reels-bundle-1-2-768x576.png",
    "category": "AI Reels",
    "bundleId": "rb-bundle-53",
    "bundleSlug": "3200-ultimate-twisted-world-reel-bundle",
    "bundleTitle": "500+ AI Hulk Story Reels Bundle – AI Action & Superhero Story Videos",
    "bundlePrice": 99,
    "bundleOriginalPrice": 249,
    "reelCount": 500,
    "likes": 223,
    "views": 474,
    "isActive": true,
    "order": 53
  },
  {
    "id": "reel-54",
    "title": "250+ Baby Food Eating Reels Bundle – Cute Baby Food & Eating Videos",
    "videoUrl": "https://reelsbundlepro.com/wp-content/uploads/2026/04/250-Baby-Food-Eating-Food-Ai-Reels-4.mp4",
    "videoType": "direct",
    "poster": "/baby-strawberry-reel.jpg",
    "category": "Baby Reels",
    "bundleId": "rb-bundle-54",
    "bundleSlug": "250-baby-food-eating-reels-bundle",
    "bundleTitle": "250+ Baby Food Eating Reels Bundle – Cute Baby Food & Eating Videos",
    "bundlePrice": 69,
    "bundleOriginalPrice": 399,
    "reelCount": 250,
    "likes": 260,
    "views": 567,
    "isActive": true,
    "order": 54
  },
  {
    "id": "reel-55",
    "title": "1200+ AI Glass Cutting ASMR Reels Bundle – Satisfying ASMR Videos for Reels & Shorts",
    "videoUrl": "https://shop.worklinc.com/wp-content/uploads/2025/07/WorkLinc.in-1751125764421.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/1200-glass-cutting-asmr-reels-bundle-4-2-1024x768.jpg",
    "category": "AI Reels",
    "bundleId": "rb-bundle-55",
    "bundleSlug": "1200-ai-glass-cutting-asmr-reels-bundle",
    "bundleTitle": "1200+ AI Glass Cutting ASMR Reels Bundle – Satisfying ASMR Videos for Reels & Shorts",
    "bundlePrice": 79,
    "bundleOriginalPrice": 399,
    "reelCount": 1200,
    "likes": 297,
    "views": 660,
    "isActive": true,
    "order": 55
  },
  {
    "id": "reel-56",
    "title": "1500+ AI Funny Kids Reels Bundle – Funny Kids & Baby Videos for Reels",
    "videoUrl": "https://thesocialgame.in/cdn/shop/videos/c/vp/c2815031646943bda4f522571f7e6e1e/c2815031646943bda4f522571f7e6e1e.HD-1080p-2.5Mbps-91483055.mp4?v=0",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/1500-ai-funny-kids-reels-bundle-4-2-768x576.jpg",
    "category": "AI Reels",
    "bundleId": "rb-bundle-56",
    "bundleSlug": "1500-ai-funny-kids-reels-bundle",
    "bundleTitle": "1500+ AI Funny Kids Reels Bundle – Funny Kids & Baby Videos for Reels",
    "bundlePrice": 99,
    "bundleOriginalPrice": 249,
    "reelCount": 1500,
    "likes": 334,
    "views": 753,
    "isActive": true,
    "order": 56
  },
  {
    "id": "reel-57",
    "title": "Viral Influencer",
    "videoUrl": "https://thesocialgame.in/cdn/shop/videos/c/vp/8a16b1fadb3b4d47b0a2fda21cc4a820/8a16b1fadb3b4d47b0a2fda21cc4a820.HD-1080p-2.5Mbps-89317244.mp4?v=0",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/500-ai-influencer-girls-reels-bundle-4-2-768x576.jpg",
    "category": "AI Reels",
    "bundleId": "rb-bundle-57",
    "bundleSlug": "500-ai-influencer-girls-reels-bundle",
    "bundleTitle": "Viral Influencer",
    "bundlePrice": 99,
    "bundleOriginalPrice": 399,
    "reelCount": 2000,
    "likes": 21,
    "views": 846,
    "isActive": true,
    "order": 57
  },
  {
    "id": "reel-58",
    "title": "1500+ AI Funny Kids Reels Bundle – Funny Kids & Baby Videos for Reels",
    "videoUrl": "https://thesocialgame.in/cdn/shop/videos/c/vp/715152ed3797491c92fa46d93b9f730a/715152ed3797491c92fa46d93b9f730a.HD-1080p-2.5Mbps-91483053.mp4?v=0",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/1500-ai-funny-kids-reels-bundle-4-2-768x576.jpg",
    "category": "AI Reels",
    "bundleId": "rb-bundle-58",
    "bundleSlug": "1500-ai-funny-kids-reels-bundle",
    "bundleTitle": "1500+ AI Funny Kids Reels Bundle – Funny Kids & Baby Videos for Reels",
    "bundlePrice": 99,
    "bundleOriginalPrice": 249,
    "reelCount": 1500,
    "likes": 58,
    "views": 939,
    "isActive": true,
    "order": 58
  },
  {
    "id": "reel-59",
    "title": "1000+ Ulti Pulti Duniya / Ulti Duniya / Reverse World AI Reels Bundle",
    "videoUrl": "https://reelsbundles.in/wp-content/uploads/2026/09/nanha_sitara__1788183006_3975890080589331884_16711909525.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/1000-ulti-pulti-duniya-ulti-duniya-reverse-world-ai-reels-bundle-2-768x576.png",
    "category": "AI Reels",
    "bundleId": "rb-bundle-59",
    "bundleSlug": "1000-ulti-pulti-duniya-reverse-world-ai-reels-bundle",
    "bundleTitle": "1000+ Ulti Pulti Duniya / Ulti Duniya / Reverse World AI Reels Bundle",
    "bundlePrice": 59,
    "bundleOriginalPrice": 499,
    "reelCount": 1000,
    "likes": 95,
    "views": 132,
    "isActive": true,
    "order": 59
  },
  {
    "id": "reel-60",
    "title": "500+ AI Hulk Story Reels Bundle – AI Action & Superhero Story Videos",
    "videoUrl": "https://betterbundle.in/wp-content/uploads/2026/01/Hulk-Ki-Badla-Hulk-vs-Yellow-Hulk-hulk-desihulk-aihulk-hulkai-hulkvsyellowhulk-lamborghini_1080p.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/3200-ultimate-twisted-world-reel-bundle-reels-bundle-1-2-768x576.png",
    "category": "AI Reels",
    "bundleId": "rb-bundle-60",
    "bundleSlug": "3200-ultimate-twisted-world-reel-bundle",
    "bundleTitle": "500+ AI Hulk Story Reels Bundle – AI Action & Superhero Story Videos",
    "bundlePrice": 99,
    "bundleOriginalPrice": 249,
    "reelCount": 500,
    "likes": 132,
    "views": 225,
    "isActive": true,
    "order": 60
  },
  {
    "id": "reel-61",
    "title": "1000+ Ulti Pulti Duniya / Ulti Duniya / Reverse World AI Reels Bundle",
    "videoUrl": "https://reelsbundles.in/wp-content/uploads/2026/09/alexzone310_1785394558_3952496305152321964_46626949812.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/1000-ulti-pulti-duniya-ulti-duniya-reverse-world-ai-reels-bundle-2-768x576.png",
    "category": "AI Reels",
    "bundleId": "rb-bundle-61",
    "bundleSlug": "1000-ulti-pulti-duniya-reverse-world-ai-reels-bundle",
    "bundleTitle": "1000+ Ulti Pulti Duniya / Ulti Duniya / Reverse World AI Reels Bundle",
    "bundlePrice": 59,
    "bundleOriginalPrice": 499,
    "reelCount": 1000,
    "likes": 169,
    "views": 318,
    "isActive": true,
    "order": 61
  },
  {
    "id": "reel-62",
    "title": "3200+ Ultimate Twisted World Reel Bundle – Fantasy Creature & Twisted World Stories",
    "videoUrl": "https://thesocialgame.in/cdn/shop/videos/c/vp/ea6497bb29ef48cb8bdb5c9fc2607502/ea6497bb29ef48cb8bdb5c9fc2607502.HD-1080p-2.5Mbps-93083437.mp4?v=0",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/3200-ultimate-twisted-world-reel-bundle-reels-bundle-1-2-768x576.png",
    "category": "AI Reels",
    "bundleId": "rb-bundle-62",
    "bundleSlug": "3200-ultimate-twisted-world-reel-bundle",
    "bundleTitle": "3200+ Ultimate Twisted World Reel Bundle – Fantasy Creature & Twisted World Stories",
    "bundlePrice": 199,
    "bundleOriginalPrice": 399,
    "reelCount": 3200,
    "likes": 206,
    "views": 411,
    "isActive": true,
    "order": 62
  },
  {
    "id": "reel-63",
    "title": "450+ AI Health Awareness Reels Bundle – Health, Wellness & Nutrition Videos",
    "videoUrl": "https://shop.worklinc.com/wp-content/uploads/2026/02/450-Health-Awareness-Ai-Reels-Bundle2.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/450-ai-health-awareness-reels-bundle-4-2-768x576.jpg",
    "category": "AI Reels",
    "bundleId": "rb-bundle-63",
    "bundleSlug": "450-ai-health-awareness-reels-bundle",
    "bundleTitle": "450+ AI Health Awareness Reels Bundle – Health, Wellness & Nutrition Videos",
    "bundlePrice": 89,
    "bundleOriginalPrice": 499,
    "reelCount": 450,
    "likes": 243,
    "views": 504,
    "isActive": true,
    "order": 63
  },
  {
    "id": "reel-64",
    "title": "1200+ AI Glass Cutting ASMR Reels Bundle – Satisfying ASMR Videos for Reels & Shorts",
    "videoUrl": "https://trendybundles.shop/cdn/shop/videos/c/vp/25ca9fa5bb0545c5920556b1bcdaa031/25ca9fa5bb0545c5920556b1bcdaa031.SD-480p-0.9Mbps-66786175.mp4?v=0",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/1200-glass-cutting-asmr-reels-bundle-4-2-1024x768.jpg",
    "category": "AI Reels",
    "bundleId": "rb-bundle-64",
    "bundleSlug": "1200-ai-glass-cutting-asmr-reels-bundle",
    "bundleTitle": "1200+ AI Glass Cutting ASMR Reels Bundle – Satisfying ASMR Videos for Reels & Shorts",
    "bundlePrice": 79,
    "bundleOriginalPrice": 399,
    "reelCount": 1200,
    "likes": 280,
    "views": 597,
    "isActive": true,
    "order": 64
  },
  {
    "id": "reel-65",
    "title": "AI Hindi Story Reels Bundle – 1-Minute Hindi Kahani & Story Videos",
    "videoUrl": "https://digitstore.xyz/wp-content/uploads/2025/06/Story-1-Min-5.mp4",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/hindi-motivational-reels-bundle-7-768x576.jpg",
    "category": "AI Reels",
    "bundleId": "rb-bundle-65",
    "bundleSlug": "hindi-motivational-reels-bundle",
    "bundleTitle": "AI Hindi Story Reels Bundle – 1-Minute Hindi Kahani & Story Videos",
    "bundlePrice": 59,
    "bundleOriginalPrice": 399,
    "reelCount": 500,
    "likes": 317,
    "views": 690,
    "isActive": true,
    "order": 65
  },
  {
    "id": "reel-66",
    "title": "Viral Influencer",
    "videoUrl": "https://thesocialgame.in/cdn/shop/videos/c/vp/e88b17865f844fa5ae9f2499c90e0d5b/e88b17865f844fa5ae9f2499c90e0d5b.HD-1080p-2.5Mbps-89317324.mp4?v=0",
    "videoType": "direct",
    "poster": "https://reelsbundles.in/wp-content/uploads/2026/10/500-ai-influencer-girls-reels-bundle-4-2-768x576.jpg",
    "category": "AI Reels",
    "bundleId": "rb-bundle-66",
    "bundleSlug": "500-ai-influencer-girls-reels-bundle",
    "bundleTitle": "Viral Influencer",
    "bundlePrice": 99,
    "bundleOriginalPrice": 399,
    "reelCount": 2000,
    "likes": 354,
    "views": 783,
    "isActive": true,
    "order": 66
  }
];

export const initialOrders: Order[] = [];
export const initialCustomers: Customer[] = [];

export const initialCoupons: Coupon[] = [
  {
    id: 'cp-welcome20',
    code: 'WELCOME20',
    discount_type: 'percent',
    amount: 20,
    is_active: true,
    usage_limit: 500,
    usage_count: 0,
    expiry_date: '2026-12-31',
    description: '20% off for first-time visitors',
  },
  {
    id: 'cp-flat50',
    code: 'FLAT50',
    discount_type: 'fixed_cart',
    amount: 50,
    is_active: true,
    usage_limit: 200,
    usage_count: 0,
    expiry_date: '2026-12-31',
    description: 'Flat ₹50 instant discount on orders above ₹199',
  },
];

export const initialContent: ContentItem[] = [
  {
    id: 'p-1',
    title: 'How to Grow to 100k Followers on Instagram using AI Reels',
    slug: 'how-to-grow-100k-followers',
    type: 'post',
    status: 'publish',
    author: 'Admin',
    date_modified: new Date().toISOString(),
    category: 'Growth Tips',
  },
];

export const initialBranding: StoreBranding = {
  store_name: 'MYZTORE',
  tagline: 'Premium Reels for Your Growth',
  logo_url: '/logo.png',
  favicon_url: '/favicon.ico',
  primary_color: '#9b28ff',
  secondary_color: '#6d3dff',
  accent_color: '#fe5f9b',
  font_family: 'Plus Jakarta Sans',
};

export const initialSiteMode: SiteModeConfig = {
  mode: 'LIVE',
  maintenance_message: 'Our store is undergoing scheduled performance upgrades. We will be back online shortly!',
  bypass_ips: ['127.0.0.1'],
  last_updated: new Date().toISOString(),
};

export const initialStoreSetup: StoreSetupConfig = {
  store_name: 'MYZTORE',
  contact_email: 'ztoredigital@gmail.com',
  support_whatsapp: '+91 9072850100',
  currency: 'INR',
  currency_symbol: '₹',
  price_format: '₹%s',
  auto_complete_digital_orders: true,
  enable_guest_checkout: true,
  order_success_drive_redirect: true,
};

export const initialMetaPixel: MetaPixelConfig = {
  enabled: true,
  pixel_id: '',
  capi_token: '',
  test_event_code: '',
  track_pageviews: true,
  track_view_content: true,
  track_add_to_cart: true,
  track_initiate_checkout: true,
  track_purchase: true,
  last_event_status: '200 OK',
  last_event_time: new Date().toISOString(),
};

export const initialWhatsappButton: WhatsappButtonConfig = {
  enabled: true,
  phone_number: '919072850100',
  default_message: 'Hi MYZTORE Support! I need quick help regarding my MYZTORE order.',
  position: 'bottom-right',
  show_popup_badge: true,
  popup_text: 'Need help? Chat on WhatsApp',
  button_color: '#25D366',
};

export const initialWebhooks: WebhookConfig = {
  secret_key: 'whsec_vaultzet_live_2026',
  endpoints: {
    order_created: true,
    order_completed: true,
    order_refunded: false,
    product_updated: true,
  },
};

export const initialWebhookLogs: WebhookLogEntry[] = [];

export const initialPlugins: WpPlugin[] = [
  {
    name: 'Firebase Live Cloud Connector',
    plugin_file: 'firebase-connector/firebase-connector.php',
    version: '2.0.0',
    active: true,
    has_update: false,
    description: 'High-speed real-time Firestore database sync for MYZTORE',
  },
];

export const initialThemes: WpTheme[] = [
  {
    name: 'MYZTORE Modern Dark Store',
    slug: 'vaultworld-dark',
    version: '1.0.0',
    active: true,
    screenshot: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    has_update: false,
  },
];

export const initialConnectorStatus: ConnectorStatus = {
  plugin_name: 'MYZTORE Cloud Engine',
  current_version: '2.0.0',
  latest_version: '2.0.0',
  update_available: false,
  php_version: 'Node.js 18+ / Firebase',
  wp_version: 'Standalone Cloud Engine',
  wc_version: 'Firebase Cloud Database',
  last_sync: new Date().toISOString(),
  changelog: 'Switched from legacy WordPress REST polling to real-time Firebase Cloud Firestore architecture. Zero WordPress hosting cost required.',
};

export const initialRazorpayConfig: PgBridgeConfig = {
  enabled: true,
  key_id: '',
  key_secret: '',
  razorpay_key_id: '',
  razorpay_key_secret: '',
  merchant_key: '',
  merchant_salt: '',
  environment: 'PRODUCTION',
};

export const initialPayUConfig = initialRazorpayConfig;
export const initialCashfreeConfig = initialRazorpayConfig;
export const initialPgBridge = initialRazorpayConfig;

export const initialDnpMeta: DnpMetaConfig = {
  enabled: true,
  meta_pixel_id: '',
  capi_token: '',
  last_cart_event: new Date().toISOString(),
  last_purchase_event: new Date().toISOString(),
  event_health_score: 100,
};

export const initialMmc: MmcAnalyticsConfig = {
  enabled: true,
  tracking_id: 'MMC-VAULTZET-01',
  active_visitors_now: 1,
  bounce_rate: '28.4%',
  avg_session_duration: '3m 42s',
};

export const initialRankMath: RankMathConfig = {
  modules: {
    sitemap: true,
    schema: true,
    redirections: true,
    seo_analysis: true,
  },
  global_title_separator: '|',
  homepage_meta_title: 'MYZTORE | 220,000+ Viral Reels Bundles & Reseller Rights',
  homepage_meta_description: 'Download 220,000+ viral AI Reels, Spiritual, Aesthetic & Motivation bundles. Instant Google Drive access & Reseller Rights.',
};

export const initialLiteSpeed: LiteSpeedConfig = {
  cache_enabled: true,
  css_minify: true,
  js_minify: true,
  image_optimization: true,
  cdn_status: 'ACTIVE',
  last_purge_time: new Date().toISOString(),
};
