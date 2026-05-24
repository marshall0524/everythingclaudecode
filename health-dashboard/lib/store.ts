import { promises as fs } from 'fs';
import path from 'path';
import { HealthData } from './types';
import { sampleHealthData } from './sample-data';

const DATA_FILE = path.join(process.cwd(), 'data', 'health-data.json');

export async function getHealthData(): Promise<HealthData> {
  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as HealthData;
  } catch {
    await saveHealthData(sampleHealthData);
    return sampleHealthData;
  }
}

export async function saveHealthData(data: HealthData): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function appendWeightEntry(entry: HealthData['weight'][0]): Promise<void> {
  const data = await getHealthData();
  const existing = data.weight.findIndex((w) => w.date === entry.date);
  if (existing >= 0) {
    data.weight[existing] = entry;
  } else {
    data.weight.push(entry);
    data.weight.sort((a, b) => a.date.localeCompare(b.date));
  }
  await saveHealthData(data);
}

export async function appendSleepEntry(entry: HealthData['sleep'][0]): Promise<void> {
  const data = await getHealthData();
  const existing = data.sleep.findIndex((s) => s.date === entry.date);
  if (existing >= 0) {
    data.sleep[existing] = entry;
  } else {
    data.sleep.push(entry);
    data.sleep.sort((a, b) => a.date.localeCompare(b.date));
  }
  await saveHealthData(data);
}

export async function appendExerciseEntry(entry: HealthData['exercise'][0]): Promise<void> {
  const data = await getHealthData();
  const existing = data.exercise.findIndex((e) => e.date === entry.date && e.type === entry.type);
  if (existing >= 0) {
    data.exercise[existing] = entry;
  } else {
    data.exercise.push(entry);
    data.exercise.sort((a, b) => a.date.localeCompare(b.date));
  }
  await saveHealthData(data);
}
