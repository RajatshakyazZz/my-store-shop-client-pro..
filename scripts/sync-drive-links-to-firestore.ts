import { db } from '../src/lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { BUNDLE_PRODUCTS } from '../src/data/bundles';
import fs from 'fs';
import path from 'path';

const productDriveLinks = require('../src/data/productDriveLinks.server.json');

async function syncAll() {
  if (!db) {
    console.error('Firebase DB not initialized');
    process.exit(1);
  }

  console.log('--- Syncing all products with full valid payload to Firestore ---');
  let successCount = 0;
  let errorCount = 0;

  for (const b of BUNDLE_PRODUCTS) {
    const slug = b.slug;
    const id = b.id;
    const cleanId = id.replace(/^rb-/, '');
    const info = productDriveLinks.byId[id] || productDriveLinks.byId[cleanId] || productDriveLinks.bySlug[slug];

    if (!info || !info.primaryLink) {
      console.warn('No info for', id);
      continue;
    }

    const payload = {
      name: b.title,
      price: b.personalPrice || 99,
      regular_price: b.personalOriginalPrice || 999,
      sale_price: b.personalPrice || 99,
      reseller_price: b.resellerPrice || 199,
      reseller_regular_price: b.resellerOriginalPrice || 1999,
      slug: b.slug,
      status: 'publish',
      stock_status: 'instock',
      category: b.category || 'Trending Reels',
      categorySlug: (b.category || 'Trending Reels').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      categories: [b.category || 'Trending Reels'],
      reel_count: b.reelCount || 1000,
      format: 'MP4',
      resolution: '1080P Full HD (9:16)',
      featured_image: b.thumbnail || '',
      image: b.thumbnail || '',
      gallery_images: b.galleryImages || [b.thumbnail || ''],
      preview_video_url: b.previewVideoUrl || '',
      short_description: b.shortDescription || '',
      description: b.description || '',
      tags: b.tags || ['HOT', 'HD', 'Google Drive'],
      is_hot: b.isHot ?? true,
      is_trending: b.isTrending ?? true,
      rating: b.rating || 4.9,
      review_count: b.reviewCount || 350,
      downloadable: true,
      google_drive_link: info.primaryLink,
      googleDriveLink: info.primaryLink,
      driveLink: info.primaryLink,
      files: info.files,
      drive_files: info.files,
    };

    const targetDocIds = new Set<string>([id, `rb-${cleanId}`, cleanId, slug]);
    for (const docId of targetDocIds) {
      try {
        await setDoc(doc(db, 'products', docId), payload, { merge: true });
        successCount++;
      } catch (e: any) {
        errorCount++;
        console.error(`Error on doc ${docId}:`, e.message);
      }
    }
  }

  console.log(`Finished full sync: ${successCount} successful writes, ${errorCount} errors.`);

  // Verify
  const snap = await getDocs(collection(db, 'products'));
  let withReal = 0;
  let withDemo = 0;
  let empty = 0;

  snap.docs.forEach((d) => {
    const data = d.data();
    if (d.id === 'category-registry-v1' || data.is_deleted || data.status === 'trash') return;
    const link = data.google_drive_link || data.googleDriveLink || (data.files && data.files[0]?.file_url);
    if (!link) empty++;
    else if (link.includes('/demo-')) withDemo++;
    else withReal++;
  });

  console.log('Final Firestore Live Verification:', { withReal, withDemo, empty, totalLiveDocs: snap.size });
  process.exit(0);
}

syncAll().catch(console.error);
