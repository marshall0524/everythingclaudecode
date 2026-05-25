import { promises as fs } from 'fs';
import path from 'path';
import { HealthData } from './types';
import { sampleHealthData } from './sample-data';

// Use /tmp on Vercel (read-only filesystem), local data dir otherwise
const DATA_FILE = process.env.VERCEL
  ? '/tmp/health-data.json'
  : path.join(process.cwd(), 'data', 'health-data.json');

export async function getHealthData(): Promise<HealthData> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as HealthData;
  } catch {
    try {
      await saveHealthData(sampleHealthData);
    } catch {
      // Vercel read-only filesystem — return sample data silently
    }
    return sampleHealthData;
  }
}

export async function saveHealthData(data: HealthData): Promise<void> {
  const dir = path.dirname(DATA_FILE);
  try { await fs.mkdir(dir, { recursive: true }); } catch { /* already exists */ }
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}
