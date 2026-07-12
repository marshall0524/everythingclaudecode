import { HealthData } from './types';
import { last, avg } from './utils';
import { evidenceLibraryAsPromptBlock } from './evidence';
import { computeTargets, mealsForDate, sumMeals, todayISO } from './nutrition';

export function buildDailySummaryPrompt(data: HealthData): { system: string; user: string } {
  const { profile, weight, sleep, exercise, stress, vo2max, pathology, coachNotes } = data;
  const lw = last(weight), ls = last(stress), lv = last(vo2max), lsl = last(sleep);
  const avgSleep7 = sleep.length ? avg(sleep.slice(-7).map(s => s.totalHours)) : null;
  const recentEx = exercise.slice(-7);
  const weeklyMin = recentEx.reduce((s, e) => s + e.duration, 0);
  const noData = !sleep.length && !exercise.length && !stress.length;
  const targets = computeTargets(data);
  const todaysTotals = sumMeals(mealsForDate(data.meals, todayISO()));

  const system = `You are a concise, evidence-based personal health coach writing a WhatsApp message. This is NOT a chat app — write plain WhatsApp text:
- Use *single asterisks* for bold (WhatsApp formatting), never markdown ## headers or **double asterisks**.
- Short lines. Use emoji as section markers sparingly (one per section max).
- No jargon — explain anything technical in plain words.
- Cite sources inline only when it adds real value, in the form (Author, Year) — draw only from the evidence list below, never invent one.
- Ask at most one short clarifying question if the data genuinely doesn't support a confident recommendation today.
- Keep the whole message under 900 characters — this is a daily nudge, not a full report.
- Always end with one line: "Not medical advice — check with your doctor."
- The user lives in the UK — prefer UK guideline figures (NICE, UK CMOs, SACN, NHS/ONS) over US/international ones when both exist in the evidence library below.

EVIDENCE LIBRARY:
${evidenceLibraryAsPromptBlock()}`;

  const context = `## PROFILE
${profile.name}, ${profile.age}, ${profile.gender}, ${profile.ethnicity}, ${profile.height}cm, ${profile.location}.
Goals: ${profile.goals.join('; ')}
Known conditions: ${profile.knownConditions.join('; ') || 'none recorded'}

## TODAY'S DATA
${noData ? 'No Apple Health / Strava / RENPHO data synced yet.' : `
- Weight: ${lw ? `${lw.weight}kg (BMI ${lw.bmi})` : 'not synced'} | Target: ${profile.targetWeight}kg
- Sleep last night: ${lsl ? `${lsl.totalHours.toFixed(1)}h (deep ${lsl.deepSleep.toFixed(1)}h, REM ${lsl.remSleep.toFixed(1)}h)` : 'not synced'} | 7-day avg: ${avgSleep7 !== null ? avgSleep7.toFixed(1) + 'h' : 'not synced'}
- HRV today: ${ls?.hrv ?? 'not synced'}ms | Resting HR: ${ls?.restingHeartRate ?? 'not synced'}bpm | Stress: ${ls?.score ?? 'not synced'}/100
- VO2 Max: ${lv ? `${lv.value} mL/kg/min (${lv.category})` : 'not synced'}
- Last 7 days exercise: ${recentEx.length} sessions, ${weeklyMin} min total`}

## NUTRITION TARGETS TODAY
- Protein target: ${targets.proteinG}g | Calorie target: ${targets.calorieTarget} kcal
- Logged so far today: ${todaysTotals.protein}g protein, ${todaysTotals.calories} kcal (meal photos logged via the Nutrition tab)

## BLOODWORK ON FILE
${pathology.length ? pathology.map(p => `- ${p.filename} (${p.uploadDate}): ${p.summary}`).join('\n') : 'None uploaded'}

## RECENT NOTES FROM THE USER
${coachNotes.length ? coachNotes.slice(-10).map(n => `- ${n.note}`).join('\n') : 'None yet'}`;

  const user = `${context}

Write this morning's WhatsApp health summary: (1) one-line status from last night's sleep/recovery if synced, (2) today's single most useful action — nutrition or training, tied to their goals (healthy weight ~${profile.targetWeight}kg, ${profile.targetBodyFatPercent}% body fat, longevity, and their fatty liver priority), (3) if data is missing, ask ONE short question instead of guessing.`;

  return { system, user };
}
