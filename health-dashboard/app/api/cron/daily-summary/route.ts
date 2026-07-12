import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getHealthData, saveHealthData } from '@/lib/store';
import { buildDailySummaryPrompt } from '@/lib/daily-summary';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

// Vercel Cron hits this route on a schedule (see vercel.json). Protect it with
// CRON_SECRET so it can't be triggered by anyone who finds the URL — Vercel
// automatically sends this as a Bearer token on scheduled invocations.
// https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 503 });
  }
  if (!process.env.CALLMEBOT_PHONE || !process.env.CALLMEBOT_APIKEY) {
    return NextResponse.json({ error: 'CALLMEBOT_PHONE / CALLMEBOT_APIKEY not configured' }, { status: 503 });
  }

  try {
    const data = await getHealthData();
    const { system, user } = buildDailySummaryPrompt(data);

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 500,
      system,
      messages: [{ role: 'user', content: user }],
    });

    const text = response.content[0]?.type === 'text' ? response.content[0].text.trim() : '';
    if (!text) throw new Error('Empty response from coach');

    const result = await sendWhatsAppMessage(text);
    if (!result.ok) throw new Error(`CallMeBot send failed (${result.status}): ${result.body}`);

    data.coachNotes.push({ date: new Date().toISOString(), note: `[Daily WhatsApp summary sent] ${text}` });
    if (data.coachNotes.length > 200) data.coachNotes = data.coachNotes.slice(-200);
    await saveHealthData(data);

    return NextResponse.json({ success: true, sent: text });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
