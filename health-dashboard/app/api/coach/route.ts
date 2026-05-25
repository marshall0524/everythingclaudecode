import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getHealthData } from '@/lib/store';
import { last, avg } from '@/lib/utils';

const SYSTEM_PROMPT = `You are Dr. Marcus Chen — an elite sports medicine physician (MBBS, FACSM), certified strength & conditioning specialist (CSCS), and registered sports dietitian with 15 years experience working with Asian athletes in East Asia.

## YOUR COMMUNICATION STYLE
- **Warm and motivating**: Celebrate wins, however small. Be specific ("Your HRV is up 8ms this week — that's real progress!").
- **Evidence-based ALWAYS**: Every claim must cite a specific study or guideline. Format: (Source, Year) e.g. "(ACSM Guidelines 2022)" or "(Stokes et al., 2018, JSCR)".
- **Specific, not vague**: Give exact numbers — sets, reps, weights, grams, percentages. Never say "some exercise" or "more protein".
- **Culturally informed**: Understand Shanghai lifestyle pressures, Asian dietary patterns, and Asian-specific health thresholds (BMI overweight ≥23, not ≥25).
- **Structured formatting**: Use headers, emojis, and bullet points for mobile readability.

## USER PROFILE (NEVER repeat this verbatim — use it to personalise)
- 30-year-old Asian male, Shanghai, China
- Height: 168 cm | Current weight: varies | BMI scale: Asian (overweight ≥23, obese ≥27.5)
- Goals: (1) Weight loss to 68kg, (2) Improve VO2 max, (3) Better sleep quality
- Activity: Runs, cycles, strength trains
- Blood work concerns: Vitamin D insufficient (28 ng/mL), HbA1c 5.4% (pre-diabetic range), Triglycerides 145

## IMPORTANT
- This is personal coaching guidance. Always include: "💬 Always consult your doctor before making major health changes."
- Be encouraging. This person is making real progress.
- When generating a WEEKLY PROGRAM, structure it as Mon through Sun with clear sections for each day.`;

function buildHealthContext(data: Awaited<ReturnType<typeof getHealthData>>) {
  const { weight, sleep, exercise, stress, vo2max } = data;
  const lw  = last(weight);
  const ls  = last(stress);
  const lv  = last(vo2max);
  const lsl = last(sleep);
  const avgSleep7  = avg(sleep.slice(-7).map(s => s.totalHours));
  const avgStress7 = avg(stress.slice(-7).map(s => s.score));
  const avgHRV7    = avg(stress.slice(-7).map(s => s.hrv));
  const recentEx   = exercise.slice(-7);
  const weeklyMin  = recentEx.reduce((s, e) => s + e.duration, 0);

  const wChange = weight.length >= 2
    ? (last(weight)!.weight - weight[Math.max(0, weight.length - 8)].weight).toFixed(1)
    : '0';

  return `## CURRENT HEALTH DATA (use this to personalise all advice)

**Body Composition**
- Weight: ${lw?.weight ?? 78} kg (30-day change: ${wChange} kg) | Target: 68 kg (${((lw?.weight ?? 78) - 68).toFixed(1)} kg to go)
- BMI: ${lw?.bmi ?? 27.6} (Asian classification: ${(lw?.bmi ?? 27.6) >= 27.5 ? 'Obese' : (lw?.bmi ?? 27.6) >= 23 ? 'Overweight' : 'Normal'})
- Body fat: ${lw?.bodyFat ?? 20.5}% | Muscle mass: ${lw?.muscleMass ?? 58} kg | Visceral fat: ${lw?.visceralFat ?? 9}

**Cardiovascular & Recovery**
- VO2 Max: ${lv?.value ?? 44.6} mL/kg/min (${lv?.category ?? 'Good'} for age 30)
- HRV (7-day avg): ${avgHRV7.toFixed(0)} ms | Today: ${ls?.hrv ?? 62} ms
- Resting HR: ${ls?.restingHeartRate ?? 60} bpm
- Stress score: ${avgStress7.toFixed(0)}/100 (today: ${ls?.score ?? 38})

**Sleep (7-day avg)**
- Duration: ${avgSleep7.toFixed(1)} hrs/night (target: 7.5–8 hrs)
- Last night: ${lsl?.totalHours.toFixed(1) ?? 7.1} hrs | Deep: ${lsl?.deepSleep.toFixed(1) ?? 1.5} hrs | REM: ${lsl?.remSleep.toFixed(1) ?? 1.8} hrs

**Exercise (last 7 days)**
- Sessions: ${recentEx.length} | Total active time: ${weeklyMin} min
- Types: ${[...new Set(recentEx.map(e => e.type))].join(', ') || 'Mixed'}

**Blood Work (March 2025)**
- LDL: 112 mg/dL | HDL: 52 | Triglycerides: 145 mg/dL
- HbA1c: 5.4% (pre-diabetic: ≥5.7% is at-risk, you're close — needs attention)
- Vitamin D: 28 ng/mL (insufficient — optimal 40–60 ng/mL)
- Ferritin: 38 ng/mL`;
}

const WEEKLY_PROGRAM_PROMPT = `Generate my complete weekly training and nutrition program.

Format EXACTLY as follows (this will be rendered in a mobile app):

## 💪 WEEK OVERVIEW
[2–3 sentence summary of the week's focus and expected outcomes]

## 📅 MONDAY — [WORKOUT TYPE]
**Workout:** [name] | Duration: [X] min | Intensity: [Low/Moderate/High]
[Exercise list with sets × reps or time]

**Nutrition focus:** [specific guidance for this day]

## 📅 TUESDAY — [WORKOUT TYPE]
[same format]

[Continue Mon–Sun]

## 🥗 DAILY NUTRITION TARGETS
**Calories:** [X] kcal ([X] below TDEE — cite source for TDEE calculation)
**Protein:** [X]g ([X]g/kg bodyweight — cite protein guideline study)
**Carbohydrates:** [X]g (timing: [when to eat most carbs])
**Fat:** [X]g

**Shanghai-friendly meal ideas:**
- Breakfast: [specific meal with macros]
- Lunch: [specific meal with macros]
- Dinner: [specific meal with macros]

## 💊 SUPPLEMENT STACK (Evidence-based)
For each supplement: dosage, timing, and cite ONE specific study or guideline.

## 📊 THIS WEEK'S KEY INSIGHT
[One specific, data-driven observation from the health data that this person should act on immediately]

💬 Always consult your doctor before making major health changes.`;

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({
      error: 'ANTHROPIC_API_KEY is not configured. Please add it to your Vercel environment variables: Project Settings → Environment Variables → Add ANTHROPIC_API_KEY.'
    }, { status: 503 });
  }

  const { question, mode } = await req.json().catch(() => ({}));
  const data = await getHealthData();
  const healthContext = buildHealthContext(data);

  const userMessage = mode === 'weekly'
    ? `${healthContext}\n\n${WEEKLY_PROGRAM_PROMPT}`
    : question
      ? `${healthContext}\n\nQuestion from athlete: ${question}`
      : `${healthContext}\n\nGive me today's personalised coaching brief: (1) 2-sentence status on my key metrics, (2) today's recommended workout with specific exercises, (3) today's nutrition targets with specific foods, (4) one data insight I need to act on. Be motivating and specific.`;

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: mode === 'weekly' ? 3000 : 1200,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    return NextResponse.json({ response: text });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: `Coach error: ${msg}` }, { status: 500 });
  }
}
