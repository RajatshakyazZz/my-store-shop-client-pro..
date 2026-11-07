import { NextResponse } from 'next/server';
import { getCashfreeCredentials } from '@/lib/cashfree';

export async function GET() {
  try {
    const creds = await getCashfreeCredentials();

    const mask = (str: string) => {
      if (!str) return 'NOT_CONFIGURED';
      if (str.length <= 8) return '****';
      return `${str.slice(0, 4)}...${str.slice(-4)}`;
    };

    const hasAppId = !!creds.appId;
    const hasSecretKey = !!creds.secretKey;

    const source =
      process.env.CASHFREE_APP_ID || process.env.NEXT_PUBLIC_CASHFREE_APP_ID || process.env.CASHFREE_CLIENT_ID
        ? 'VERCEL_ENVIRONMENT_VARIABLES'
        : creds.appId
        ? 'FIRESTORE_SETTINGS'
        : 'NONE';

    return NextResponse.json({
      configured: hasAppId && hasSecretKey,
      appId: mask(creds.appId),
      secretKey: mask(creds.secretKey),
      environment: creds.environment,
      apiVersion: creds.apiVersion,
      returnUrl: creds.returnUrl,
      source,
      instructions: !hasAppId || !hasSecretKey
        ? 'To fix: Go to Admin Portal (/asdf/settings) > Cashfree Gateway tab, enter your Cashfree App ID and Secret Key and click Save, OR add CASHFREE_APP_ID and CASHFREE_SECRET_KEY in Vercel Environment Variables.'
        : 'Cashfree credentials detected successfully on CreatorMint Store.',
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        configured: false,
        error: err.message || 'Error checking Cashfree configuration',
      },
      { status: 500 }
    );
  }
}
