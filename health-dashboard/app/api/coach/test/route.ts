import { NextResponse } from 'next/server';

export async function GET() {
  const hasKey = !!process.env.ANTHROPIC_API_KEY;
  const whatsappConfigured = !!process.env.CALLMEBOT_PHONE && !!process.env.CALLMEBOT_APIKEY;
  return NextResponse.json({
    configured: hasKey,
    keyPrefix: hasKey ? process.env.ANTHROPIC_API_KEY!.slice(0, 14) + '...' : null,
    message: hasKey
      ? 'API key is configured correctly.'
      : 'ANTHROPIC_API_KEY is not set. Go to Vercel → Project → Settings → Environment Variables and add it, then redeploy.',
    whatsappConfigured,
    whatsappMessage: whatsappConfigured
      ? 'Daily WhatsApp summary is configured.'
      : 'CALLMEBOT_PHONE / CALLMEBOT_APIKEY not set — daily WhatsApp summaries are disabled. See README "WhatsApp Setup".',
  });
}
