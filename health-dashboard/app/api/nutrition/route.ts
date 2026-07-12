import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import { getHealthData, saveHealthData } from '@/lib/store';
import { evidenceLibraryAsPromptBlock } from '@/lib/evidence';
import { computeTargets, mealsForDate, sumMeals, todayISO } from '@/lib/nutrition';
import { FoodItem, LoggedMeal } from '@/lib/types';

function inferMealType(): LoggedMeal['mealType'] {
  const hour = new Date().getHours();
  if (hour < 11) return 'breakfast';
  if (hour < 16) return 'lunch';
  if (hour < 21) return 'dinner';
  return 'snack';
}

const VISION_SYSTEM_PROMPT = `You are a nutrition analyst estimating the food and macro breakdown of a meal photo, for a health coaching app. Be as accurate as possible, but photos of food only ever give an approximate read on portion size — never claim more precision than that.

Respond with ONLY a JSON object (no markdown fences, no other text) in exactly this shape:
{
  "items": [
    { "name": string, "quantity": string, "calories": number, "protein": number, "carbs": number, "fat": number, "fiber": number, "addedSugar": number }
  ],
  "tips": string,
  "confidence": "low" | "medium" | "high"
}

Rules:
- Break the meal into distinct food items/ingredients as far as you can visually distinguish them (e.g. "grilled chicken breast", "steamed rice", "broccoli" — not just "chicken and rice").
- quantity is a plain-language estimate ("~150g", "1 cup", "2 slices").
- All macro numbers are grams except calories (kcal). Estimate addedSugar (grams) only for sauces/drinks/processed items where it's plausible — 0 for whole foods like plain meat or vegetables.
- confidence: "high" only if the plate/portions are clearly visible and the food is easy to identify; "low" if the photo is unclear, items are hidden/mixed together (e.g. a stew, a smoothie), or you're guessing significantly.
- tips: 1-2 short sentences, concrete and specific to this meal — what to keep doing or what to adjust, considering the user profile below. No jargon. Cite a source in parentheses only if you draw on one of the evidence entries below.

USER CONTEXT
${'{{USER_CONTEXT}}'}

EVIDENCE LIBRARY (cite from here only if relevant)
${'{{EVIDENCE}}'}`;

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured.' }, { status: 503 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const mealTypeInput = formData.get('mealType') as string | null;
  const caption = (formData.get('caption') as string) || undefined;

  if (!file) return NextResponse.json({ error: 'No image provided' }, { status: 400 });
  if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'File must be an image' }, { status: 400 });

  const data = await getHealthData();

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'meals');
  await fs.mkdir(uploadsDir, { recursive: true });
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadsDir, filename), buffer);
  const imagePath = `/uploads/meals/${filename}`;

  const userContext = `${data.profile.name}, ${data.profile.age}, ${data.profile.gender}, goals: ${data.profile.goals.join('; ')}. Known conditions: ${data.profile.knownConditions.join('; ') || 'none'}.${caption ? ` User's own note about this meal: "${caption}"` : ''}`;
  const systemPrompt = VISION_SYSTEM_PROMPT
    .replace('{{USER_CONTEXT}}', userContext)
    .replace('{{EVIDENCE}}', evidenceLibraryAsPromptBlock());

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const mediaType = file.type as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';
    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: buffer.toString('base64') } },
          { type: 'text', text: 'Analyse this meal photo and return the JSON breakdown.' },
        ],
      }],
    });

    const raw = response.content[0]?.type === 'text' ? response.content[0].text.trim() : '';
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Coach did not return a parseable breakdown');

    const parsed = JSON.parse(jsonMatch[0]) as {
      items: FoodItem[];
      tips: string;
      confidence: 'low' | 'medium' | 'high';
    };

    const items = (parsed.items || []).map(i => ({
      name: i.name,
      quantity: i.quantity,
      calories: Number(i.calories) || 0,
      protein: Number(i.protein) || 0,
      carbs: Number(i.carbs) || 0,
      fat: Number(i.fat) || 0,
      fiber: Number(i.fiber) || 0,
      addedSugar: Number(i.addedSugar) || 0,
    }));

    // Sum from items server-side rather than trusting any model-provided totals directly.
    const totals = items.reduce((acc, i) => ({
      calories: acc.calories + i.calories,
      protein: acc.protein + i.protein,
      carbs: acc.carbs + i.carbs,
      fat: acc.fat + i.fat,
      fiber: acc.fiber + (i.fiber ?? 0),
      addedSugar: acc.addedSugar + (i.addedSugar ?? 0),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, addedSugar: 0 });

    const meal: LoggedMeal = {
      id: `meal-${Date.now()}`,
      date: todayISO(),
      timestamp: new Date().toISOString(),
      mealType: (mealTypeInput as LoggedMeal['mealType']) || inferMealType(),
      imagePath,
      caption,
      items,
      totalCalories: Math.round(totals.calories),
      totalProtein: Math.round(totals.protein),
      totalCarbs: Math.round(totals.carbs),
      totalFat: Math.round(totals.fat),
      totalFiber: Math.round(totals.fiber),
      totalAddedSugar: Math.round(totals.addedSugar),
      tips: parsed.tips || '',
      confidence: parsed.confidence || 'medium',
    };

    data.meals.push(meal);
    await saveHealthData(data);

    const targets = computeTargets(data);
    const todaysTotals = sumMeals(mealsForDate(data.meals, todayISO()));

    return NextResponse.json({
      meal,
      targets,
      todaysTotals,
      remaining: {
        protein: Math.max(0, targets.proteinG - todaysTotals.protein),
        calories: Math.max(0, targets.calorieTarget - todaysTotals.calories),
      },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: `Meal analysis failed: ${msg}` }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date') || todayISO();
  const data = await getHealthData();
  const meals = mealsForDate(data.meals, date);
  const targets = computeTargets(data);
  const totals = sumMeals(meals);

  return NextResponse.json({
    date,
    meals,
    targets,
    totals,
    remaining: {
      protein: Math.max(0, targets.proteinG - totals.protein),
      calories: Math.max(0, targets.calorieTarget - totals.calories),
    },
  });
}
