/**
 * IndexNow helper to notify search engines (Bing, Yandex, etc.) of URL updates.
 */
export async function submitToIndexNow(urlList: string[]): Promise<{ success: boolean; status?: number; error?: string }> {
  const key = process.env.NEXT_PUBLIC_INDEXNOW_KEY || '';
  if (!key) {
    return { success: false, error: 'IndexNow key not configured' };
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/+$/, '');
  if (!siteUrl) {
    return { success: false, error: 'SITE_URL not configured' };
  }
  const host = siteUrl.replace(/^https?:\/\//, '');

  if (!urlList || urlList.length === 0) {
    return { success: false, error: 'Empty urlList' };
  }

  const payload = {
    host,
    key,
    keyLocation: `${siteUrl}/${key}.txt`,
    urlList,
  };

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return {
      success: res.ok || res.status === 200 || res.status === 202,
      status: res.status,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error pinging IndexNow',
    };
  }
}
