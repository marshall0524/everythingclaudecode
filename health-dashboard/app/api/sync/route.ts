import { NextResponse } from 'next/server';
import { getHealthData, saveHealthData } from '@/lib/store';

export async function POST() {
  const data = await getHealthData();
  data.lastSync.apple_health = new Date().toISOString();
  await saveHealthData(data);
  return NextResponse.json({ success: true, synced: new Date().toISOString() });
}
