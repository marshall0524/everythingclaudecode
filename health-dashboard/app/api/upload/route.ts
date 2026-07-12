import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import { getHealthData, saveHealthData } from '@/lib/store';

const EXTRACTION_SYSTEM_PROMPT = `You extract structured information from a personal medical document (blood test, imaging report, physio/clinical report, or prescription) for a health coaching app. Be accurate — this grounds real health advice, so never invent values that aren't in the document.

Respond with ONLY a JSON object (no markdown fences, no other text) in exactly this shape:
{
  "summary": string,
  "keyValues": { [testOrFieldName: string]: string }
}

Rules:
- summary: 1-2 plain-language sentences — what this document is, its date if visible, and the single most clinically relevant takeaway (e.g. a flagged/abnormal result, a diagnosis, a recommendation). No jargon.
- keyValues: every discrete measurement, test result, or named field visible in the document, formatted as "value unit (reference range)" where a range is shown (e.g. "139 g/L (130-180)"). Use the exact test/field names as printed. Include patient demographics only if clearly part of the results (e.g. don't fabricate age/DOB if not shown).
- If the document is illegible, not a health document, or you can't confidently extract anything, return {"summary": "Could not extract details from this document — add a summary manually.", "keyValues": {}}.`;

async function extractDocumentDetails(buffer: Buffer, mimeType: string): Promise<{ summary: string; keyValues: Record<string, string> } | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;

  const isImage = mimeType.startsWith('image/');
  const isPdf = mimeType === 'application/pdf';
  if (!isImage && !isPdf) return null;

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const content = isPdf
      ? [
          { type: 'document' as const, source: { type: 'base64' as const, media_type: 'application/pdf' as const, data: buffer.toString('base64') } },
          { type: 'text' as const, text: 'Extract the structured details from this document.' },
        ]
      : [
          { type: 'image' as const, source: { type: 'base64' as const, media_type: mimeType as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif', data: buffer.toString('base64') } },
          { type: 'text' as const, text: 'Extract the structured details from this document.' },
        ];

    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 1500,
      system: EXTRACTION_SYSTEM_PROMPT,
      messages: [{ role: 'user', content }],
    });

    const raw = response.content[0]?.type === 'text' ? response.content[0].text.trim() : '';
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]);
    return { summary: parsed.summary || '', keyValues: parsed.keyValues || {} };
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const docType = (formData.get('type') as string) || 'other';
  const manualSummary = (formData.get('summary') as string) || '';

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadsDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  await fs.writeFile(path.join(uploadsDir, filename), buffer);

  const extracted = await extractDocumentDetails(buffer, file.type);

  const data = await getHealthData();
  const doc = {
    id: `doc-${Date.now()}`,
    filename: file.name,
    uploadDate: new Date().toISOString().split('T')[0],
    type: docType as 'blood_test' | 'imaging' | 'report' | 'prescription' | 'other',
    summary: manualSummary || extracted?.summary || '',
    keyValues: extracted?.keyValues || {},
    filePath: `/uploads/${filename}`,
  };

  data.pathology.unshift(doc);
  await saveHealthData(data);

  return NextResponse.json({ success: true, doc, autoExtracted: !!extracted && Object.keys(extracted.keyValues).length > 0 });
}
