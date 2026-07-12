import { NextRequest, NextResponse } from 'next/server';
import { getHealthData, saveHealthData } from '@/lib/store';
import { getStravaCredentials } from '@/lib/strava';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) return NextResponse.redirect(new URL('/sync?error=strava_denied', req.url));

  const data = await getHealthData();
  const { clientId, clientSecret } = getStravaCredentials(data);

  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
    }),
  });

  const tokens = await res.json();
  if (!res.ok || !tokens.refresh_token) return NextResponse.redirect(new URL('/sync?error=strava_token', req.url));

  data.profile.stravaConnected = true;
  data.settings.stravaRefreshToken = tokens.refresh_token;
  data.lastSync.strava = new Date().toISOString();
  await saveHealthData(data);

  return NextResponse.redirect(new URL('/sync?strava=connected', req.url));
}
