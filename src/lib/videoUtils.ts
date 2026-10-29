export interface ParsedVideoInfo {
  type: 'youtube' | 'drive' | 'vimeo' | 'direct' | 'empty' | 'unknown';
  embedUrl?: string;
  directUrl?: string;
  label: string;
}

/**
 * Parses any hosted video URL (Direct MP4, Google Drive, YouTube, Vimeo)
 * and returns safe embed/direct streaming information.
 */
export function parseHostedVideoUrl(rawUrl?: string): ParsedVideoInfo {
  const url = (rawUrl || '').trim();
  if (!url) {
    return { type: 'empty', label: 'No video link' };
  }

  // 1. YouTube Shorts or standard YouTube video
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    const ytId = ytMatch[1];
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=0&controls=1&rel=0&playsinline=1`,
      label: 'YouTube Video / Shorts',
    };
  }

  // 2. Google Drive preview link (converts /view or open?id= to /preview)
  const driveMatch = url.match(
    /(?:drive\.google\.com\/(?:file\/d\/|open\?id=))([a-zA-Z0-9_-]+)/
  );
  if (driveMatch && driveMatch[1]) {
    const fileId = driveMatch[1];
    return {
      type: 'drive',
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      label: 'Google Drive Video Preview',
    };
  }

  // 3. Vimeo
  const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      label: 'Vimeo Video',
    };
  }

  // 4. Direct video file (MP4, WebM, OGG, MOV, Cloud CDN)
  if (
    url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) ||
    url.includes('/video/') ||
    url.includes('/videos/') ||
    url.includes('cdn') ||
    url.includes('uploads')
  ) {
    return {
      type: 'direct',
      directUrl: url,
      label: 'Direct MP4 / CDN Video',
    };
  }

  // 5. General http/https fallback
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return {
      type: 'direct',
      directUrl: url,
      label: 'Hosted Video URL',
    };
  }

  return { type: 'unknown', label: 'Unrecognized URL' };
}
