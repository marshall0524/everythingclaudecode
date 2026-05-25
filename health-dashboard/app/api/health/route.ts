import { NextRequest, NextResponse } from 'next/server';
import { getHealthData } from '@/lib/store';

export async function GET() {
  const data = await getHealthData();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { getHealthData: getData, saveHealthData } = await import('@/lib/store');
    const data = await getData();

    if (body.weight) {
      const entry = {
        date: body.date || new Date().toISOString().split('T')[0],
        weight: body.weight,
        bmi: body.bmi || parseFloat((body.weight / (1.68 * 1.68)).toFixed(1)),
        bodyFat: body.bodyFat,
        muscleMass: body.muscleMass,
        visceralFat: body.visceralFat,
        waterPercent: body.waterPercent,
        metabolicAge: body.metabolicAge,
        source: body.source || 'apple_health',
      } as (typeof data.weight)[0];
      const idx = data.weight.findIndex((w) => w.date === entry.date);
      if (idx >= 0) data.weight[idx] = entry;
      else data.weight.push(entry);
      data.weight.sort((a, b) => a.date.localeCompare(b.date));
    }

    if (body.sleep) {
      const s = body.sleep;
      const entry = { ...s, source: s.source || 'apple_health' } as (typeof data.sleep)[0];
      const idx = data.sleep.findIndex((x) => x.date === entry.date);
      if (idx >= 0) data.sleep[idx] = entry;
      else data.sleep.push(entry);
      data.sleep.sort((a, b) => a.date.localeCompare(b.date));
    }

    if (body.exercise) {
      const e = body.exercise;
      const entry = { ...e, source: e.source || 'apple_health' } as (typeof data.exercise)[0];
      data.exercise.push(entry);
      data.exercise.sort((a, b) => a.date.localeCompare(b.date));
    }

    data.lastSync.apple_health = new Date().toISOString();
    data.isSampleData = false;
    await saveHealthData(data);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 });
  }
}
