#!/usr/bin/env node
// Generates today's evidence-based health summary and sends it to WhatsApp via
// CallMeBot. Run standalone (no Next.js server needed):
//
//   node --env-file=.env.local scripts/daily-whatsapp-summary.mjs
//
// Required env vars: ANTHROPIC_API_KEY, CALLMEBOT_PHONE, CALLMEBOT_APIKEY

import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA_FILE = path.join(ROOT, 'data', 'health-data.json');
const EVIDENCE_FILE = path.join(ROOT, 'data', 'evidence-library.json');

function last(arr) { return arr[arr.length - 1]; }
function avg(arr) { return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null; }

async function loadJSON(file) {
  return JSON.parse(await readFile(file, 'utf-8'));
}

function buildEvidenceBlock(evidence) {
  return evidence.map(e => `- ${e.topic}: ${e.finding} (${e.citation})`).join('\n');
}

// Mirrors lib/nutrition.ts — kept in sync manually since this script runs
// standalone without a TS build step.
function computeTargets(data) {
  const { profile, exercise, weight } = data;
  const weightUsedKg = last(weight)?.weight ?? profile.targetWeight;
  const weeklyExerciseMinutes = exercise.slice(-7).reduce((s, e) => s + e.duration, 0);
  const bmr = profile.gender === 'male'
    ? 10 * weightUsedKg + 6.25 * profile.height - 5 * profile.age + 5
    : 10 * weightUsedKg + 6.25 * profile.height - 5 * profile.age - 161;
  const activityFactor = weeklyExerciseMinutes >= 300 ? 1.55 : weeklyExerciseMinutes >= 150 ? 1.45 : weeklyExerciseMinutes >= 60 ? 1.375 : 1.2;
  const maintenanceCalories = Math.round(bmr * activityFactor);
  const calorieTarget = Math.round(maintenanceCalories * 0.8);
  const proteinG = Math.round(weightUsedKg * 1.8);
  return { proteinG, maintenanceCalories, calorieTarget };
}

function todaysMealTotals(data) {
  const today = new Date().toISOString().split('T')[0];
  const meals = (data.meals || []).filter(m => m.date === today);
  return meals.reduce((acc, m) => ({
    calories: acc.calories + m.totalCalories,
    protein: acc.protein + m.totalProtein,
  }), { calories: 0, protein: 0 });
}

function buildContext(data) {
  const { profile, weight, sleep, exercise, stress, vo2max, pathology, coachNotes } = data;
  const lw = last(weight), ls = last(stress), lv = last(vo2max), lsl = last(sleep);
  const avgSleep7 = sleep.length ? avg(sleep.slice(-7).map(s => s.totalHours)) : null;
  const recentEx = exercise.slice(-7);
  const weeklyMin = recentEx.reduce((s, e) => s + e.duration, 0);
  const noData = !sleep.length && !exercise.length && !stress.length;
  const targets = computeTargets(data);
  const todaysTotals = todaysMealTotals(data);

  return `## PROFILE
${profile.name}, ${profile.age}, ${profile.gender}, ${profile.ethnicity}, ${profile.height}cm, ${profile.location}.
Goals: ${profile.goals.join('; ')}
Known conditions: ${profile.knownConditions.join('; ') || 'none recorded'}

## TODAY'S DATA
${noData ? 'No Apple Health / Strava / RENPHO data synced yet (aside from a manually-entered weight).' : `
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
}

async function main() {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const phone = process.env.CALLMEBOT_PHONE;
  const apikey = process.env.CALLMEBOT_APIKEY;

  if (!anthropicKey) throw new Error('ANTHROPIC_API_KEY not set');
  if (!phone || !apikey) throw new Error('CALLMEBOT_PHONE / CALLMEBOT_APIKEY not set');

  const [data, evidence] = await Promise.all([loadJSON(DATA_FILE), loadJSON(EVIDENCE_FILE)]);

  const systemPrompt = `You are a concise, evidence-based personal health coach writing a WhatsApp message. This is NOT a chat app — write plain WhatsApp text:
- Use *single asterisks* for bold (WhatsApp formatting), never markdown ## headers or **double asterisks**.
- Short lines. Use emoji as section markers sparingly (one per section max).
- No jargon — explain anything technical in plain words.
- Cite sources inline only when it adds real value, in the form (Author, Year) — draw only from the evidence list below, never invent one.
- Ask at most one short clarifying question if the data genuinely doesn't support a confident recommendation today.
- Keep the whole message under 900 characters — this is a daily nudge, not a full report.
- Always end with one line: "Not medical advice — check with your doctor."

EVIDENCE LIBRARY:
${buildEvidenceBlock(evidence)}`;

  const userPrompt = `${buildContext(data)}

Write this morning's WhatsApp health summary: (1) one-line status from last night's sleep/recovery if synced, (2) today's protein/calorie targets from the NUTRITION TARGETS section above, (3) today's single most useful action — nutrition or training, tied to their goals (healthy weight ~${data.profile.targetWeight}kg, ${data.profile.targetBodyFatPercent}% body fat, longevity, and their fatty liver priority), (4) if data is missing, ask ONE short question instead of guessing.`;

  const client = new Anthropic({ apiKey: anthropicKey });
  const response = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 500,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const text = response.content[0]?.type === 'text' ? response.content[0].text.trim() : '';
  if (!text) throw new Error('Empty response from coach');

  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apikey)}`;
  const res = await fetch(url);
  const body = await res.text();

  if (!res.ok) throw new Error(`CallMeBot send failed (${res.status}): ${body}`);

  data.coachNotes.push({ date: new Date().toISOString(), note: `[Daily WhatsApp summary sent] ${text}` });
  if (data.coachNotes.length > 200) data.coachNotes = data.coachNotes.slice(-200);
  await writeFile(DATA_FILE, JSON.stringify(data, null, 2) + '\n', 'utf-8');

  console.log('Sent:', text);
  console.log('CallMeBot response:', body);
}

main().catch(err => {
  console.error('daily-whatsapp-summary failed:', err.message);
  process.exit(1);
});
