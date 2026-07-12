import { HealthData } from './types';

// Prefer credentials saved in-app (Settings page) over env vars, so the user
// doesn't need Vercel dashboard access to connect Strava.
export function getStravaCredentials(data: HealthData): { clientId: string; clientSecret: string } {
  return {
    clientId: data.settings.stravaClientId || process.env.STRAVA_CLIENT_ID || '',
    clientSecret: data.settings.stravaClientSecret || process.env.STRAVA_CLIENT_SECRET || '',
  };
}

export function stravaConfigured(data: HealthData): boolean {
  const { clientId, clientSecret } = getStravaCredentials(data);
  return !!clientId && !!clientSecret;
}
