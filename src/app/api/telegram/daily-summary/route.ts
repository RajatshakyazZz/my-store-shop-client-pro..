import { NextResponse } from 'next/server';
import { sendStoreCommandReport } from '@/lib/telegram';

/**
 * GET / POST /api/telegram/daily-summary
 * Triggered automatically every night at 10:00 PM IST (16:30 UTC) via Vercel Cron
 * Sends the Daily Night Summary Report to Authorized Telegram Admins configured in store settings
 */
export async function GET() {
  try {
    const ok = await sendStoreCommandReport('night_summary');
    return NextResponse.json({
      success: ok,
      message: 'Daily 10:00 PM IST Telegram summary dispatched to authorized admins.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to send daily summary' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
