/**
 * Vaultzet Admin Authorization Helper
 * Validates whether incoming requests to /api/admin/* endpoints are from
 * authorized administrators or authorized Telegram bot webhooks.
 */

const DEFAULT_ADMIN_TOKEN = process.env.ADMIN_KEY || process.env.ADMIN_SECRET || 'vaultzet_admin_secret_2026';

export function isAuthorizedAdmin(request: Request): boolean {
  // 1. Direct header token verification (x-admin-key or Authorization Bearer)
  const adminKey = request.headers.get('x-admin-key');
  if (adminKey && (adminKey === DEFAULT_ADMIN_TOKEN || adminKey === process.env.TELEGRAM_BOT_TOKEN)) {
    return true;
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.slice(7).trim();
    if (bearerToken && (bearerToken === DEFAULT_ADMIN_TOKEN || bearerToken === process.env.TELEGRAM_BOT_TOKEN)) {
      return true;
    }
  }

  // 2. Same-origin browser request from authorized admin domains
  const origin = request.headers.get('origin') || '';
  const referer = request.headers.get('referer') || '';
  const host = request.headers.get('host') || '';

  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
  const isAuthorizedHost =
    isLocalhost ||
    host.includes('myztore.shop') ||
    host.includes('vaultworld.shop') ||
    host.includes('vaultzet.shop') ||
    host.includes('adminp.vaultzet.shop') ||
    host.includes('vercel.app');

  const isAuthorizedOrigin =
    !origin ||
    origin.includes('localhost') ||
    origin.includes('127.0.0.1') ||
    origin.includes('myztore.shop') ||
    origin.includes('vaultworld.shop') ||
    origin.includes('vaultzet.shop') ||
    origin.includes('adminp.vaultzet.shop') ||
    origin.includes('vercel.app');

  const isAuthorizedReferer =
    !referer ||
    referer.includes('/admin') ||
    referer.includes('/asdf') ||
    referer.includes('localhost') ||
    referer.includes('myztore.shop') ||
    referer.includes('vaultworld.shop') ||
    referer.includes('vaultzet.shop') ||
    referer.includes('adminp.vaultzet.shop') ||
    referer.includes('vercel.app');

  // Verify internal browser call with custom anti-CSRF header or same-origin
  const secFetchSite = request.headers.get('sec-fetch-site');
  const isSameOrigin = secFetchSite === 'same-origin' || secFetchSite === 'same-site' || !secFetchSite;

  if (isAuthorizedHost && isAuthorizedOrigin && isAuthorizedReferer && isSameOrigin) {
    return true;
  }

  return false;
}
