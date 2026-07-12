import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getHealthData, saveHealthData } from '@/lib/store';
import { last, avg } from '@/lib/utils';
import { evidenceLibraryAsPromptBlock } from '@/lib/evidence';
import { computeTargets, mealsForDate, sumMeals, todayISO } from '@/lib/nutrition';

function buildSystemPrompt(data: Awaited<ReturnType<typeof getHealthData>>) {
  const { profile } = data;

  return `You are the personal health coach inside this person's private HealthOS app — combined expertise of a sports medicine physician, strength & conditioning coach, and registered dietitian.

## COMMUNICATION STYLE
- **Concise, no jargon.** Short sentences. Plain language over medical terms — if you must use one, explain it in three words or fewer.
- **Evidence-based ALWAYS.** Every non-obvious claim cites a source: (Author et al., Year, Journal/Guideline). Never invent a citation — draw only from the EVIDENCE LIBRARY below, or well-established consensus guidelines (WHO, ACSM, EASL, AASM) you are highly confident about. If you're not sure a claim is well-supported, say so plainly instead of fabricating a source.
- **Specific, not vague.** Exact numbers — grams, sets, reps, minutes, kcal. Never "some exercise" or "more protein."
- **Ask, don't assume.** When the data doesn't tell you enough to give a confident recommendation (unclear priority, missing training history, ambiguous goal trade-off), ask ONE short clarifying question instead of guessing.
- **Warm but brief.** Acknowledge real progress in one clause, then get to the point.

## USER PROFILE
- ${profile.name}, ${profile.age}, ${profile.gender}, ${profile.ethnicity}
- Height: ${profile.height} cm | Current weight: see CURRENT HEALTH DATA below
- Location: ${profile.location} (timezone: ${profile.timezone})
- BMI scale: Asian thresholds apply — overweight ≥23, obese ≥27.5 kg/m² (WHO Expert Consultation, 2004)
- Goals: ${profile.goals.map((g, i) => `(${i + 1}) ${g}`).join(' ')}
- Known conditions: ${profile.knownConditions.join('; ') || 'None recorded yet'}
- Lives in the UK — prefer UK guideline bodies (NICE, UK CMOs, SACN, NHS/ONS) when a UK-specific figure exists and is more relevant than a US/international one (e.g. UK's 14-units/week alcohol limit rather than US standard drink guidance, UK CMO activity guidelines rather than ACSM where they differ). International meta-analyses still apply where there's no UK-specific equivalent.

## EVIDENCE LIBRARY (cite from this list where relevant — do not contradict it)
${evidenceLibraryAsPromptBlock()}

## PRIORITY GIVEN THIS PROFILE
Fatty liver (NAFLD) is the standing medical priority — it changes what "healthy weight loss" and "nutrition" mean for this person specifically:
- Weight loss of 7-10% of current body weight is the single highest-leverage intervention (Vilar-Gomez et al., 2015).
- Minimize added sugar and alcohol — both directly drive liver fat independent of total calories (Zelber-Sagi et al., 2018).
- Both aerobic and resistance training reduce liver fat even before weight changes appear (Hashida et al., 2017) — so exercise consistency matters even in weeks the scale doesn't move.
- Prioritize fibre-rich, whole-food carbohydrates over refined ones (Ma et al., 2018).
- The user has follow-up bloodwork pending (fasting glucose, lipids, iron, hepatitis serology, thyroid). Don't assume results — ask if they've come back before making claims that depend on them.

## MEMORY — THINGS THIS PERSON HAS TOLD YOU
${data.coachNotes.length
    ? data.coachNotes.slice(-20).map(n => `- (${n.date}) ${n.note}`).join('\n')
    : '- Nothing recorded yet. As they tell you things (injuries, preferences, constraints, how a plan is going), treat it as ground truth and stay consistent with it in future answers.'}

## IMPORTANT
- Always end substantive health advice with: "💬 Not a substitute for medical advice — check with your doctor, especially given the pending liver workup."
- When generating a WEEKLY PROGRAM, structure it Mon through Sun with clear sections per day.
- Never present invented numbers as if they were synced data. If a data field is missing, say it's missing and ask, don't fill it in.`;
}

function buildNutritionContext(data: Awaited<ReturnType<typeof getHealthData>>) {
  const targets = computeTargets(data);
  const todaysMeals = mealsForDate(data.meals, todayISO());
  const totals = sumMeals(todaysMeals);
  const remainingProtein = Math.max(0, targets.proteinG - totals.protein);
  const remainingCalories = Math.max(0, targets.calorieTarget - totals.calories);

  return `## TODAY'S NUTRITION (logged via meal photos — use these exact numbers, don't re-derive)
- Protein target: ${targets.proteinG}g (1.8g/kg × ${targets.weightUsedKg}kg bodyweight, Morton et al. 2018) | Logged so far: ${totals.protein}g | Remaining: ${remainingProtein}g
- Calorie target: ${targets.calorieTarget} kcal (~20% deficit below ${targets.maintenanceCalories} kcal estimated maintenance — Mifflin-St Jeor 1990, Helms et al. 2014) | Logged so far: ${totals.calories} kcal | Remaining: ${remainingCalories} kcal
- Carbs so far: ${totals.carbs}g | Fat so far: ${totals.fat}g | Fibre so far: ${totals.fiber}g | Added sugar so far: ${totals.addedSugar}g
- Meals logged today: ${todaysMeals.length ? todaysMeals.map(m => `${m.mealType} (${m.totalCalories}kcal, ${m.totalProtein}g protein)`).join(', ') : 'none yet'}
${!data.meals.length ? '- No meals have ever been logged. If asked about protein/calories remaining, mention they can log a meal photo on the Nutrition tab for tracking, but you can still give a target.' : ''}`;
}

function buildHealthContext(data: Awaited<ReturnType<typeof getHealthData>>) {
  const { weight, sleep, exercise, stress, vo2max, pathology, profile } = data;
  const lw  = last(weight);
  const ls  = last(stress);
  const lv  = last(vo2max);
  const lsl = last(sleep);
  const avgSleep7  = sleep.length ? avg(sleep.slice(-7).map(s => s.totalHours)) : null;
  const avgStress7 = stress.length ? avg(stress.slice(-7).map(s => s.score)) : null;
  const avgHRV7    = stress.length ? avg(stress.slice(-7).map(s => s.hrv)) : null;
  const recentEx   = exercise.slice(-7);
  const weeklyMin  = recentEx.reduce((s, e) => s + e.duration, 0);

  const wChange = weight.length >= 2
    ? (last(weight)!.weight - weight[Math.max(0, weight.length - 8)].weight).toFixed(1)
    : null;

  const noData = !sleep.length && !exercise.length && !stress.length;

  if (noData) {
    return `## CURRENT HEALTH DATA
Only a manually-entered weight is on file (${lw ? `${lw.weight}kg` : 'none'}) — sleep/exercise/stress/VO2max haven't synced yet from Apple Health / Strava / RENPHO. Do not invent numbers for those.
Base advice on the profile, goals, known conditions, and pathology below, and ask what to prioritize first. Encourage connecting data via the Sync page for personalised tracking.

${buildNutritionContext(data)}

## PATHOLOGY / BLOODWORK ON FILE
${pathology.length ? pathology.map(p => `- **${p.filename}** (${p.uploadDate}, ${p.type}): ${p.summary}${p.keyValues && Object.keys(p.keyValues).length ? '\n  ' + Object.entries(p.keyValues).map(([k, v]) => `${k}: ${v}`).join(' | ') : ''}`).join('\n') : '- None uploaded yet'}`;
  }

  return `## CURRENT HEALTH DATA (real synced data — use it to personalise all advice)

**Body Composition**
- Weight: ${lw ? `${lw.weight} kg` : 'not synced'}${wChange ? ` (30-day change: ${wChange} kg)` : ''} | Target: ${profile.targetWeight} kg${lw ? ` (${(lw.weight - profile.targetWeight).toFixed(1)} kg to go)` : ''}
- BMI: ${lw?.bmi ?? 'not synced'}${lw ? ` (Asian classification: ${lw.bmi >= 27.5 ? 'Obese' : lw.bmi >= 23 ? 'Overweight' : 'Normal'})` : ''}
- Body fat: ${lw?.bodyFat ?? 'not synced'}${typeof lw?.bodyFat === 'number' ? '%' : ''} (target: ${profile.targetBodyFatPercent}%) | Muscle mass: ${lw?.muscleMass ?? 'not synced'} | Visceral fat: ${lw?.visceralFat ?? 'not synced'}

**Cardiovascular & Recovery**
- VO2 Max: ${lv ? `${lv.value} mL/kg/min (${lv.category})` : 'not synced'}
- HRV (7-day avg): ${avgHRV7 !== null ? `${avgHRV7.toFixed(0)} ms` : 'not synced'} | Today: ${ls?.hrv ?? 'not synced'}
- Resting HR: ${ls?.restingHeartRate ?? 'not synced'}
- Stress score: ${avgStress7 !== null ? `${avgStress7.toFixed(0)}/100` : 'not synced'} (today: ${ls?.score ?? 'not synced'})

**Sleep (7-day avg)**
- Duration: ${avgSleep7 !== null ? `${avgSleep7.toFixed(1)} hrs/night` : 'not synced'} (target: 7-8 hrs — Watson et al., 2015)
- Last night: ${lsl ? `${lsl.totalHours.toFixed(1)} hrs | Deep: ${lsl.deepSleep.toFixed(1)} hrs | REM: ${lsl.remSleep.toFixed(1)} hrs` : 'not synced'}

**Exercise (last 7 days)**
- Sessions: ${recentEx.length} | Total active time: ${weeklyMin} min
- Types: ${[...new Set(recentEx.map(e => e.type))].join(', ') || 'none synced'}

${buildNutritionContext(data)}

## PATHOLOGY / BLOODWORK ON FILE
${pathology.length ? pathology.map(p => `- **${p.filename}** (${p.uploadDate}, ${p.type}): ${p.summary}${p.keyValues && Object.keys(p.keyValues).length ? '\n  ' + Object.entries(p.keyValues).map(([k, v]) => `${k}: ${v}`).join(' | ') : ''}`).join('\n') : '- None uploaded yet'}`;
}

const WEEKLY_PROGRAM_PROMPT = `Generate my complete weekly training and nutrition program.

Format EXACTLY as follows (this will be rendered in a mobile app):

## 💪 WEEK OVERVIEW
[2-3 sentence summary of the week's focus and expected outcomes]

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

**London-friendly meal ideas:**
- Breakfast: [specific meal with macros]
- Lunch: [specific meal with macros]
- Dinner: [specific meal with macros]

## 💊 SUPPLEMENT STACK (Evidence-based, only if genuinely supported)
For each supplement: dosage, timing, and cite ONE specific study or guideline. If none are clearly warranted from the data on file, say so instead of padding the list.

## 📊 THIS WEEK'S KEY INSIGHT
[One specific, data-driven observation from the health data that this person should act on immediately — or, if data is missing, the single most useful clarifying question to ask them]

💬 Not a substitute for medical advice — check with your doctor, especially given the pending liver workup.`;

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({
      error: 'ANTHROPIC_API_KEY is not configured. Please add it to your Vercel environment variables: Project Settings → Environment Variables → Add ANTHROPIC_API_KEY.'
    }, { status: 503 });
  }

  const { question, mode } = await req.json().catch(() => ({}));
  const data = await getHealthData();
  const healthContext = buildHealthContext(data);
  const systemPrompt = buildSystemPrompt(data);

  const userMessage = mode === 'weekly'
    ? `${healthContext}\n\n${WEEKLY_PROGRAM_PROMPT}`
    : question
      ? `${healthContext}\n\nQuestion from athlete: ${question}`
      : `${healthContext}\n\nGive me today's coaching brief: (1) 2-sentence status on my key metrics, (2) today's recommended workout with specific exercises, (3) today's nutrition targets with specific foods, (4) one data insight I need to act on, or one clarifying question if the data can't support a confident insight yet. Be brief and specific.`;

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: mode === 'weekly' ? 3000 : 1200,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';

    // Remember what the user told the coach so future answers stay consistent.
    if (question) {
      data.coachNotes.push({ date: new Date().toISOString(), note: question });
      if (data.coachNotes.length > 200) data.coachNotes = data.coachNotes.slice(-200);
      await saveHealthData(data);
    }

    return NextResponse.json({ response: text });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: `Coach error: ${msg}` }, { status: 500 });
  }
}
