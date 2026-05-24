import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getHealthData } from '@/lib/store';
import { last, avg } from '@/lib/utils';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { question } = await req.json().catch(() => ({ question: null }));
  const data = await getHealthData();
  const { profile, weight, sleep, exercise, stress, vo2max } = data;

  const latestWeight = last(weight);
  const avgSleep = avg(sleep.slice(-7).map((s) => s.totalHours));
  const avgStress = avg(stress.slice(-7).map((s) => s.score));
  const latestVO2 = last(vo2max);
  const recentExercise = exercise.slice(-7);
  const weeklyActiveCalories = recentExercise.reduce((s, e) => s + e.activeCalories, 0);
  const weightTrend = weight.length >= 2
    ? ((last(weight)!.weight - weight[weight.length - 8 < 0 ? 0 : weight.length - 8].weight)).toFixed(1)
    : '0';

  const systemPrompt = `You are a world-class health coach and nutritionist specialising in Asian health. You have deep knowledge of:
- Asian-specific BMI thresholds (overweight ≥23, obese ≥27.5 for East Asians)
- Traditional Chinese nutrition principles blended with modern sports science
- The health challenges of urban professionals in Shanghai
- Exercise periodisation and VO2 max optimisation
- Gut microbiome and metabolic health for Asian populations

Always be concise, actionable, warm, and evidence-based. Format your response in clear sections with practical next steps.`;

  const healthContext = `User Profile:
- 30-year-old Asian male, Shanghai
- Height: 168 cm | Current weight: ${latestWeight?.weight} kg | BMI: ${latestWeight?.bmi} (Asian threshold: overweight ≥23)
- Target weight: ${profile.targetWeight} kg | Weight change (30d): ${weightTrend} kg
- Body fat: ${latestWeight?.bodyFat}% | Muscle mass: ${latestWeight?.muscleMass} kg | Visceral fat: ${latestWeight?.visceralFat}

Last 7 days averages:
- Sleep: ${avgSleep.toFixed(1)} hrs/night
- Stress score: ${avgStress.toFixed(0)}/100 (lower = better)
- Weekly active calories: ${weeklyActiveCalories} kcal
- VO2 Max: ${latestVO2?.value} mL/kg/min (${latestVO2?.category})

Recent blood work (March 2025):
- Total Cholesterol: 188 mg/dL | LDL: 112 | HDL: 52 | Triglycerides: 145
- Fasting Glucose: 94 mg/dL | HbA1c: 5.4% (pre-diabetic range)
- Vitamin D: 28 ng/mL (insufficient) | Ferritin: 38 ng/mL

Exercise last 7 days: ${recentExercise.map((e) => `${e.type} (${e.duration}min)`).join(', ') || 'None logged'}`;

  const userMessage = question
    ? `${healthContext}\n\nQuestion: ${question}`
    : `${healthContext}\n\nPlease provide:\n1. A brief assessment of my current health status (3-4 sentences)\n2. Top 3 priority action items this week with specific targets\n3. Daily nutrition targets tailored for my profile and goals\n4. Today's recommended workout\n5. One key insight about my data that I might not have noticed`;

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    return NextResponse.json({ response: text, healthContext });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
