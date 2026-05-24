import { NextRequest, NextResponse } from 'next/server';

const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID || '';
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET || '';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) return NextResponse.redirect('/sync?error=strava_denied');

  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    }),
  });

  const tokens = await res.json();
  if (!res.ok) return NextResponse.redirect(`/sync?error=strava_token`);

  const { getHealthData, saveHealthData } = await import('@/lib/store');
  const data = await getHealthData();
  data.profile.stravaConnected = true;
  data.lastSync.strava = new Date().toISOString();
  await saveHealthData(data);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return NextResponse.redirect(`${appUrl}/sync?strava=connected&refresh=${tokens.refresh_token}`);
}
