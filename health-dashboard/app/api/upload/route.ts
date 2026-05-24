import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getHealthData, saveHealthData } from '@/lib/store';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const docType = (formData.get('type') as string) || 'other';
  const summary = (formData.get('summary') as string) || '';

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadsDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  await fs.writeFile(path.join(uploadsDir, filename), buffer);

  const data = await getHealthData();
  const doc = {
    id: `doc-${Date.now()}`,
    filename: file.name,
    uploadDate: new Date().toISOString().split('T')[0],
    type: docType as 'blood_test' | 'imaging' | 'report' | 'prescription' | 'other',
    summary,
    keyValues: {},
    filePath: `/uploads/${filename}`,
  };

  data.pathology.unshift(doc);
  await saveHealthData(data);

  return NextResponse.json({ success: true, doc });
}
