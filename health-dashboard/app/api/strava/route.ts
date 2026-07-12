import { NextRequest, NextResponse } from 'next/server';
import { getHealthData, saveHealthData } from '@/lib/store';
import { getStravaCredentials } from '@/lib/strava';

export async function GET(req: NextRequest) {
  const data = await getHealthData();
  const { clientId } = getStravaCredentials(data);

  if (!clientId) {
    return NextResponse.redirect(new URL('/settings?error=strava_not_configured', req.url));
  }

  const redirectUri = `${req.nextUrl.origin}/api/strava/callback`;
  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&approval_prompt=force&scope=read,activity:read_all,profile:read_all`;
  return NextResponse.redirect(authUrl);
}

// Manual "Sync Now" — refreshes the access token from the stored refresh
// token and pulls recent activities. No token is ever passed from the client.
export async function POST() {
  const data = await getHealthData();
  const { clientId, clientSecret } = getStravaCredentials(data);
  const refreshToken = data.settings.stravaRefreshToken;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'Strava not configured — add your Client ID/Secret on the Settings page.' }, { status: 400 });
  }
  if (!refreshToken) {
    return NextResponse.json({ error: 'Strava not connected yet — click Connect Strava first.' }, { status: 400 });
  }

  const tokenRes = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  const tokens = await tokenRes.json();
  if (!tokenRes.ok) return NextResponse.json({ error: tokens }, { status: 400 });

  const activitiesRes = await fetch(
    'https://www.strava.com/api/v3/athlete/activities?per_page=30',
    { headers: { Authorization: `Bearer ${tokens.access_token}` } }
  );

  const activities = await activitiesRes.json();
  if (!Array.isArray(activities)) {
    return NextResponse.json({ error: activities?.message || 'Strava did not return activities' }, { status: 502 });
  }

  for (const act of activities) {
    const date = act.start_date_local.split('T')[0];
    const entry: (typeof data.exercise)[0] = {
      date,
      type: act.type,
      duration: Math.round(act.moving_time / 60),
      calories: act.calories || 0,
      heartRateAvg: act.average_heartrate,
      heartRateMax: act.max_heartrate,
      distance: act.distance ? parseFloat((act.distance / 1000).toFixed(2)) : undefined,
      elevationGain: act.total_elevation_gain,
      activeCalories: act.calories || 0,
      source: 'strava',
      stravaId: String(act.id),
    };
    const exists = data.exercise.findIndex((e) => e.stravaId === entry.stravaId);
    if (exists >= 0) data.exercise[exists] = entry;
    else data.exercise.push(entry);
  }

  data.exercise.sort((a, b) => a.date.localeCompare(b.date));
  data.lastSync.strava = new Date().toISOString();
  data.isSampleData = false;
  // Strava may rotate the refresh token on use — always persist the latest one.
  data.settings.stravaRefreshToken = tokens.refresh_token || refreshToken;
  await saveHealthData(data);

  return NextResponse.json({ synced: activities.length });
}
