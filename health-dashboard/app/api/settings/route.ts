import { NextRequest, NextResponse } from 'next/server';
import { getHealthData, saveHealthData } from '@/lib/store';
import { stravaConfigured } from '@/lib/strava';

export async function GET() {
  const data = await getHealthData();
  return NextResponse.json({
    stravaClientId: data.settings.stravaClientId || '',
    stravaClientSecretSet: !!data.settings.stravaClientSecret,
    stravaConfigured: stravaConfigured(data),
    stravaConnected: data.profile.stravaConnected,
    usingEnvFallback: !data.settings.stravaClientId && !!process.env.STRAVA_CLIENT_ID,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const data = await getHealthData();

  if (typeof body.stravaClientId === 'string' && body.stravaClientId.trim()) {
    data.settings.stravaClientId = body.stravaClientId.trim();
  }
  if (typeof body.stravaClientSecret === 'string' && body.stravaClientSecret.trim()) {
    data.settings.stravaClientSecret = body.stravaClientSecret.trim();
  }
  if (body.clearStrava === true) {
    data.settings.stravaClientId = undefined;
    data.settings.stravaClientSecret = undefined;
    data.settings.stravaRefreshToken = undefined;
    data.profile.stravaConnected = false;
  }

  await saveHealthData(data);
  return NextResponse.json({ success: true, stravaConfigured: stravaConfigured(data) });
}
