import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { BUNDLE_PRODUCTS } from '@/data/bundles';
import serverProductLinks from '@/data/productDriveLinks.server.json';

export interface ResolvedProductFiles {
  primaryLink: string;
  files: Array<{ id?: string; name: string; file_url: string }>;
  thumbnail?: string;
  resolution?: string;
  format?: string;
}

export async function resolveDriveFilesForProduct(item: { id?: string; title?: string; slug?: string }): Promise<ResolvedProductFiles> {
  const cleanId = String(item.id || '').trim();
  const cleanSlug = String((item as any).slug || '').trim().toLowerCase();
  const cleanTitle = String(item.title || '').trim().toLowerCase();

  const getDocThumb = (docData: any): string => {
    if (!docData) return '';
    return String(
      docData.featured_image ||
      docData.thumbnail ||
      docData.image ||
      docData.coverImage ||
      (Array.isArray(docData.gallery_images) ? docData.gallery_images[0] : '') ||
      (Array.isArray(docData.images) ? docData.images[0] : '') ||
      ''
    ).trim();
  };

  // 1. Check Firestore products collection directly by ID or Slug
  if (db && (cleanId || cleanSlug)) {
    try {
      const candidates = [cleanId, cleanSlug, `rb-${cleanSlug}`, cleanId.replace(/^rb-/, '')].filter(Boolean);
      for (const targetId of candidates) {
        if (!targetId || targetId === 'bundle') continue;
        const snap = await getDoc(doc(db, 'products', targetId));
        if (snap.exists()) {
          const data = snap.data();
          const thumb = getDocThumb(data);
          const filesList: any[] = Array.isArray(data.files) && data.files.length > 0
            ? data.files
                .filter((f: any) => f && (f.file_url || f.url))
                .map((f: any, idx: number) => ({
                  id: f.id || `file-${idx + 1}`,
                  name: f.name || `Drive File ${idx + 1}`,
                  file_url: f.file_url || f.url,
                }))
            : [];

          const primaryLink =
            filesList[0]?.file_url ||
            data.google_drive_link ||
            data.googleDriveLink ||
            '';

          return {
            primaryLink: primaryLink || filesList[0]?.file_url || 'https://drive.google.com/drive/folders/ztore-digital-master-access',
            files:
              filesList.length > 0
                ? filesList
                : [{ name: `${data.name || item.title || 'Reels Bundle'} Google Drive Access`, file_url: primaryLink || 'https://drive.google.com' }],
            thumbnail: thumb,
            resolution: data.resolution || '1080P FULL HD',
            format: data.format || 'MP4 Video',
          };
        }
      }
    } catch (e) {
      console.warn('Error reading product doc for drive link:', e);
    }
  }

  // 2. Search Firestore products collection by title or slug
  if (db) {
    try {
      const snap = await getDocs(collection(db, 'products'));
      const normCleanTitle = cleanTitle.replace(/[+_\-\/\\:.,()]/g, ' ').replace(/\s+/g, ' ').trim();
      const normCleanSlug = cleanSlug.replace(/[+_\-\/\\:.,()]/g, ' ').replace(/\s+/g, ' ').trim();

      for (const d of snap.docs) {
        const data = d.data();
        const docName = String(data.name || data.title || '').toLowerCase().trim();
        const docSlug = String(data.slug || '').toLowerCase().trim();
        const normDocName = docName.replace(/[+_\-\/\\:.,()]/g, ' ').replace(/\s+/g, ' ').trim();
        const normDocSlug = docSlug.replace(/[+_\-\/\\:.,()]/g, ' ').replace(/\s+/g, ' ').trim();

        const matchesDocId = d.id === cleanId || d.id === cleanSlug || (cleanSlug && d.id.includes(cleanSlug));
        const matchesExactName = docName && (docName === cleanTitle || cleanTitle.includes(docName) || docName.includes(cleanTitle));
        const matchesExactSlug = docSlug && (docSlug === cleanId || docSlug === cleanSlug || cleanSlug.includes(docSlug) || cleanTitle.includes(docSlug));
        const matchesNormName = normDocName && (normDocName === normCleanTitle || normCleanTitle.includes(normDocName) || normDocName.includes(normCleanTitle));
        const matchesNormSlug = normDocSlug && (normDocSlug === normCleanSlug || normCleanSlug.includes(normDocSlug) || normDocName.includes(normCleanSlug));

        if (matchesDocId || matchesExactName || matchesExactSlug || matchesNormName || matchesNormSlug) {
          const thumb = getDocThumb(data);
          const filesList: any[] = Array.isArray(data.files) && data.files.length > 0
            ? data.files
                .filter((f: any) => f && (f.file_url || f.url))
                .map((f: any, idx: number) => ({
                  id: f.id || `file-${idx + 1}`,
                  name: f.name || `Drive File ${idx + 1}`,
                  file_url: f.file_url || f.url,
                }))
            : [];

          const primaryLink =
            filesList[0]?.file_url ||
            data.google_drive_link ||
            data.googleDriveLink ||
            '';

          return {
            primaryLink: primaryLink || filesList[0]?.file_url || 'https://drive.google.com/drive/folders/ztore-digital-master-access',
            files:
              filesList.length > 0
                ? filesList
                : [{ name: `${data.name || item.title || 'Reels Bundle'} Google Drive Access`, file_url: primaryLink || 'https://drive.google.com' }],
            thumbnail: thumb,
            resolution: data.resolution || '1080P FULL HD',
            format: data.format || 'MP4 Video',
          };
        }
      }
    } catch (e) {
      console.warn('Error querying products collection:', e);
    }
  }

  // 3. Fallback: Search Static BUNDLE_PRODUCTS
  const staticFound = BUNDLE_PRODUCTS.find((p) => {
    const pId = String(p.id).trim().toLowerCase();
    const pSlug = String(p.slug).trim().toLowerCase();
    const pTitle = String(p.title).trim().toLowerCase();
    return (
      (cleanId && pId === cleanId) ||
      (cleanSlug && pSlug === cleanSlug) ||
      (cleanTitle && pTitle === cleanTitle) ||
      (cleanTitle && (pTitle.includes(cleanTitle) || cleanTitle.includes(pTitle))) ||
      (cleanSlug && pSlug.includes(cleanSlug))
    );
  });

  if (staticFound) {
    const rawLink =
      (staticFound as any).googleDriveLink ||
      (staticFound as any).google_drive_link ||
      (staticFound as any).driveLink ||
      '';

    const serverLinkMap = (serverProductLinks as unknown as Record<string, any>);
    const serverMappedLink =
      (serverLinkMap[staticFound.slug]?.primaryLink || serverLinkMap[staticFound.slug]) ||
      (serverLinkMap[staticFound.id]?.primaryLink || serverLinkMap[staticFound.id]) ||
      (serverLinkMap[cleanSlug]?.primaryLink || serverLinkMap[cleanSlug]) ||
      (serverLinkMap[cleanId]?.primaryLink || serverLinkMap[cleanId]) ||
      '';

    const finalPrimary = serverMappedLink || rawLink || 'https://drive.google.com/drive/folders/ztore-digital-master-access';

    return {
      primaryLink: finalPrimary,
      files: [{ name: `${staticFound.title} Google Drive Access`, file_url: finalPrimary }],
      thumbnail: staticFound.thumbnail,
      resolution: (staticFound as any).resolution || '1080P FULL HD',
      format: (staticFound as any).format || 'MP4 Video',
    };
  }

  // 4. Server product drive links fallback map
  const serverLinkMap = (serverProductLinks as unknown as Record<string, any>);
  const serverMappedLink =
    (cleanSlug && (serverLinkMap[cleanSlug]?.primaryLink || serverLinkMap[cleanSlug])) ||
    (cleanId && (serverLinkMap[cleanId]?.primaryLink || serverLinkMap[cleanId])) ||
    '';

  const defaultLink = serverMappedLink || 'https://drive.google.com/drive/folders/ztore-digital-master-access';
  return {
    primaryLink: defaultLink,
    files: [{ name: `${item.title || 'Reels Bundle'} Google Drive Access`, file_url: defaultLink }],
    thumbnail: '',
    resolution: '1080P FULL HD',
    format: 'MP4 Video',
  };
}
