import { NextRequest, NextResponse } from 'next/server';

const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID || '';
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/strava/callback`
  : 'http://localhost:3000/api/strava/callback';

export async function GET() {
  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&approval_prompt=force&scope=read,activity:read_all,profile:read_all`;
  return NextResponse.redirect(authUrl);
}

export async function POST(req: NextRequest) {
  const { refreshToken } = await req.json();
  if (!refreshToken) return NextResponse.json({ error: 'No refresh token' }, { status: 400 });

  const tokenRes = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
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
  const { getHealthData, saveHealthData } = await import('@/lib/store');
  const data = await getHealthData();

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
  await saveHealthData(data);

  return NextResponse.json({ synced: activities.length, tokens });
}
