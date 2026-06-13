import Link from 'next/link';
import { getHealthData } from '@/lib/store';
import { last, avg, trend } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import SleepChart from '@/components/SleepChart';
import ExerciseChart from '@/components/ExerciseChart';
import StressChart from '@/components/StressChart';
import WeightChart from '@/components/WeightChart';
import VO2MaxChart from '@/components/VO2MaxChart';
import {
  TrendingUp, TrendingDown, Minus, ChevronRight,
  Moon, Dumbbell, Heart, Scale, Droplets, Flame,
  AlertTriangle, CheckCircle2, Info, ArrowRight,
} from 'lucide-react';

export const revalidate = 60;

// ── helpers ────────────────────────────────────────────────────────
function trendIcon(t: 'up' | 'down' | 'stable', positive = true) {
  if (t === 'stable') return <Minus size={12} className="text-muted-foreground" />;
  const up = t === 'up';
  const good = positive ? up : !up;
  return good
    ? <TrendingUp  size={12} className="text-health-green" />
    : <TrendingDown size={12} className="text-health-red" />;
}

type Priority = 'optimal' | 'watch' | 'act';

function PriorityBadge({ p }: { p: Priority }) {
  if (p === 'optimal') return <Badge variant="success">Optimal</Badge>;
  if (p === 'watch')   return <Badge variant="warning">Watch</Badge>;
  return                      <Badge variant="destructive">Act Now</Badge>;
}

function PriorityIcon({ p }: { p: Priority }) {
  if (p === 'optimal') return <CheckCircle2 size={14} className="text-health-green" />;
  if (p === 'watch')   return <AlertTriangle size={14} className="text-health-amber" />;
  return                      <AlertTriangle size={14} className="text-health-red" />;
}

// ── health score ───────────────────────────────────────────────────
function calcHealthScore(params: {
  hrv: number; sleepH: number; bmi: number; vo2: number;
  vitD: number; ldl: number;
}) {
  const { hrv, sleepH, bmi, vo2, vitD, ldl } = params;
  const recovery = Math.round(Math.min(hrv / 80, 1) * 60 + Math.min(sleepH / 8, 1) * 40);
  const body     = bmi < 23 ? 100 : bmi < 27.5 ? Math.round(100 - (bmi - 23) / 4.5 * 50) : 30;
  const fitness  = Math.round(Math.min(vo2 / 50, 1) * 100);
  const blood    = Math.round((vitD >= 30 ? 100 : vitD >= 20 ? 60 : 20) * 0.5 + (ldl < 100 ? 100 : ldl < 130 ? 70 : 40) * 0.5);
  return Math.round(recovery * 0.40 + body * 0.20 + fitness * 0.25 + blood * 0.15);
}

function scoreLabel(s: number) {
  if (s >= 80) return { label: 'Excellent', color: 'text-health-green' };
  if (s >= 65) return { label: 'Good',      color: 'text-health-blue' };
  if (s >= 50) return { label: 'Fair',       color: 'text-health-amber' };
  return              { label: 'Needs Work', color: 'text-health-red' };
}

// ── page ───────────────────────────────────────────────────────────
export default async function DashboardPage() {
  const data = await getHealthData();
  const { weight, sleep, exercise, stress, vo2max, profile, pathology } = data;

  const lw  = last(weight);
  const ls  = last(stress);
  const lv  = last(vo2max);
  const lsl = last(sleep);

  const avgSleep7  = avg(sleep.slice(-7).map(s => s.totalHours));
  const avgStress7 = avg(stress.slice(-7).map(s => s.score));
  const avgHRV7    = avg(stress.slice(-7).map(s => s.hrv));
  const avgRHR7    = avg(stress.slice(-7).map(s => s.restingHeartRate));

  const wTrend  = trend(weight.map(w => w.weight));
  const slTrend = trend(sleep.slice(-7).map(s => s.totalHours));
  const stTrend = trend(stress.slice(-7).map(s => s.score));

  const recentEx    = exercise.slice(-7);
  const weeklyMin   = recentEx.reduce((s, e) => s + e.duration, 0);
  const weeklyKcal  = recentEx.reduce((s, e) => s + e.activeCalories, 0);
  const change30    = weight.length >= 2
    ? last(weight)!.weight - weight[Math.max(0, weight.length - 8)].weight
    : 0;

  // Blood panel
  const kv       = pathology.find(d => d.type === 'blood_test')?.keyValues ?? {};
  const vitD     = parseFloat(kv['Vitamin D'] ?? '0');
  const ldl      = parseFloat(kv['LDL'] ?? '0');
  const hdl      = parseFloat(kv['HDL'] ?? '0');
  const glucose  = parseFloat(kv['Fasting Glucose'] ?? '0');
  const hba1c    = parseFloat(kv['HbA1c'] ?? '0');
  const trig     = parseFloat(kv['Triglycerides'] ?? '0');

  const score    = calcHealthScore({
    hrv: ls?.hrv ?? 55, sleepH: lsl?.totalHours ?? 7,
    bmi: lw?.bmi ?? 27, vo2: lv?.value ?? 40,
    vitD, ldl,
  });
  const { label: scoreLabel_, color: scoreColor } = scoreLabel(score);

  // ── insights ────────────────────────────────────────────────────
  const sleepPriority: Priority = avgSleep7 >= 7.5 ? 'optimal' : avgSleep7 >= 6.5 ? 'watch' : 'act';
  const recoveryPriority: Priority = (ls?.hrv ?? 0) >= 55 ? 'optimal' : (ls?.hrv ?? 0) >= 40 ? 'watch' : 'act';
  const weightPriority: Priority = (lw?.bmi ?? 30) < 23 ? 'optimal' : (lw?.bmi ?? 30) < 27.5 ? 'watch' : 'act';
  const vitDPriority: Priority = vitD >= 30 ? 'optimal' : vitD >= 20 ? 'watch' : 'act';
  const fitnessPriority: Priority = (lv?.value ?? 0) >= 47 ? 'optimal' : (lv?.value ?? 0) >= 40 ? 'watch' : 'act';
  const bloodPriority: Priority = ldl < 100 && glucose < 100 ? 'optimal' : ldl < 130 && glucose < 110 ? 'watch' : 'act';

  // ── action plan ─────────────────────────────────────────────────
  type Action = { priority: 1|2|3; icon: string; title: string; why: string; how: string; effort: string; impact: string; href?: string };
  const actions: Action[] = [];

  if (vitD < 30) actions.push({
    priority: 1, icon: '☀️',
    title: 'Take Vitamin D3 daily',
    why: `Your Vitamin D is ${vitD} ng/mL — insufficient (target 30–60).`,
    how: '2,000 IU with breakfast. Re-test in 3 months.',
    effort: 'Seconds/day', impact: 'High',
    href: '/gp',
  });
  if (avgSleep7 < 7.5) actions.push({
    priority: 1, icon: '🌙',
    title: `Add ${(7.5 - avgSleep7).toFixed(0) === '0' ? '30 min' : Math.round((7.5 - avgSleep7) * 60) + ' min'} sleep per night`,
    why: `You're averaging ${avgSleep7.toFixed(1)}h vs the 7.5h optimal target.`,
    how: 'Set a 10:30pm screen-off alarm. Keep wake time fixed at 6:30am.',
    effort: 'Medium', impact: 'Very High',
    href: '/sleep',
  });
  if ((lw?.bmi ?? 0) >= 23) actions.push({
    priority: 1, icon: '⚖️',
    title: `Lose ${((lw?.weight ?? 78) - profile.targetWeight).toFixed(1)} kg to reach ${profile.targetWeight} kg goal`,
    why: `BMI ${(lw?.bmi ?? 0).toFixed(1)} is overweight on the Asian scale. Visceral fat ${lw?.visceralFat ?? '–'} is borderline.`,
    how: '500 kcal/day deficit — cut ultra-processed food, add 20 min daily walk.',
    effort: 'Moderate', impact: 'Very High',
    href: '/body',
  });
  if (ldl >= 100) actions.push({
    priority: 2, icon: '🫀',
    title: 'Optimise LDL cholesterol',
    why: `LDL ${ldl} mg/dL is near-optimal but target is <100 for your age.`,
    how: 'Eat oats + nuts daily. Reduce red meat to 2×/week. Consider adding omega-3.',
    effort: 'Low', impact: 'High',
    href: '/gp',
  });
  if (weeklyMin < 150) actions.push({
    priority: 2, icon: '🏃',
    title: 'Hit 150 min/week Zone 2 cardio',
    why: `You logged ${weeklyMin} min this week. WHO recommends 150+ min of moderate cardio.`,
    how: '3× 30min runs at conversational pace. Use HR 130–145 bpm as guide.',
    effort: 'Moderate', impact: 'Very High',
    href: '/exercise',
  });
  if (actions.length < 3) actions.push({
    priority: 3, icon: '💧',
    title: 'Maintain hydration (2.5L/day)',
    why: `Water % ${lw?.waterPercent ?? 57}% is adequate. Aim to maintain during exercise.`,
    how: 'Carry a 750ml bottle. Drink 3 refills + extra on workout days.',
    effort: 'Low', impact: 'Moderate',
  });

  const today = new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="pb-24 animate-fade-in">
      {/* ── Hero score ─────────────────────────────────────────── */}
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground">{today}</p>
            <h1 className="text-2xl font-bold text-foreground mt-0.5">Health Summary</h1>
          </div>
          <div className="text-right">
            <p className={`text-4xl font-black leading-none ${scoreColor}`}>{score}</p>
            <p className={`text-xs font-semibold mt-0.5 ${scoreColor}`}>{scoreLabel_}</p>
            <p className="text-[10px] text-muted-foreground">/ 100</p>
          </div>
        </div>

        {/* Score bar */}
        <Progress
          value={score}
          className="h-2 bg-secondary"
          indicatorClassName={score >= 80 ? 'bg-health-green' : score >= 65 ? 'bg-health-blue' : score >= 50 ? 'bg-health-amber' : 'bg-health-red'}
        />

        {/* Quick status chips */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {[
            { label: 'Recovery',  val: `HRV ${ls?.hrv ?? '--'}ms`,       p: recoveryPriority },
            { label: 'Sleep',     val: `${avgSleep7.toFixed(1)}h avg`,    p: sleepPriority },
            { label: 'Fitness',   val: `VO₂ ${lv?.value ?? '--'}`,       p: fitnessPriority },
            { label: 'Weight',    val: `${lw?.weight ?? '--'} kg`,        p: weightPriority },
          ].map(({ label, val, p }) => (
            <div key={label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border">
              <PriorityIcon p={p} />
              <span className="text-[11px] font-semibold text-foreground">{label}</span>
              <span className="text-[11px] text-muted-foreground">{val}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* ── Key Insights ───────────────────────────────────────── */}
      <div className="px-4 pt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">What Your Data Is Telling You</h2>
        </div>

        <div className="space-y-3">

          {/* Recovery / HRV */}
          <Link href="/recovery">
            <Card className="border-border hover:border-health-green/40 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-health-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Heart size={16} className="text-health-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-bold text-foreground">Recovery & HRV</span>
                      <PriorityBadge p={recoveryPriority} />
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-black text-health-green">{ls?.hrv ?? '--'}<span className="text-sm font-semibold text-muted-foreground">ms</span></span>
                      <div className="text-xs text-muted-foreground">
                        <div>7d avg: {avgHRV7.toFixed(0)} ms</div>
                        <div>RHR: {ls?.restingHeartRate ?? '--'} bpm</div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {(ls?.hrv ?? 0) >= 55
                        ? `HRV of ${ls?.hrv}ms is above the population average (~50ms), signalling strong parasympathetic tone — your body is recovering well. Stress score ${ls?.score ?? '--'}/100 is low.`
                        : `HRV of ${ls?.hrv}ms is below ideal. Higher HRV = better recovery capacity. Focus on sleep quality and reducing alcohol to improve.`}
                    </p>
                  </div>
                  <ChevronRight size={14} className="text-muted-foreground flex-shrink-0 mt-1" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Sleep */}
          <Link href="/sleep">
            <Card className="border-border hover:border-health-purple/40 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-health-purple/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Moon size={16} className="text-health-purple" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-bold text-foreground">Sleep Quality</span>
                      <PriorityBadge p={sleepPriority} />
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-black text-health-purple">{lsl?.totalHours.toFixed(1) ?? '--'}<span className="text-sm font-semibold text-muted-foreground">h</span></span>
                      <div className="text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">7d avg: {avgSleep7.toFixed(1)}h {trendIcon(slTrend, true)}</div>
                        <div>Target: 7.5h · Quality: <span className="capitalize">{lsl?.quality ?? '--'}</span></div>
                      </div>
                    </div>
                    {/* Sleep stage mini bars */}
                    {lsl && (
                      <div className="flex gap-1 h-1.5 rounded-full overflow-hidden mb-2">
                        <div style={{ width: `${(lsl.deepSleep / lsl.totalHours) * 100}%`, background: '#0A84FF', borderRadius: 99 }} />
                        <div style={{ width: `${(lsl.remSleep / lsl.totalHours) * 100}%`, background: '#BF5AF2', borderRadius: 99 }} />
                        <div style={{ width: `${(lsl.lightSleep / lsl.totalHours) * 100}%`, background: '#8E8E93', borderRadius: 99 }} />
                        <div style={{ width: `${(lsl.awake / lsl.totalHours) * 100}%`, background: '#FF3B30', borderRadius: 99 }} />
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {avgSleep7 < 7
                        ? `Averaging ${avgSleep7.toFixed(1)}h is below the 7–9h NSF guideline. Each hour under 7 raises cortisol ~15% and impairs glucose regulation. Deep sleep ${lsl?.deepSleep.toFixed(1)}h (${lsl ? Math.round((lsl.deepSleep / lsl.totalHours) * 100) : '--'}%) — aim for ≥13%.`
                        : `Sleep duration is adequate at ${avgSleep7.toFixed(1)}h average. Deep sleep at ${lsl?.deepSleep.toFixed(1)}h supports muscle repair and HGH release. REM ${lsl?.remSleep.toFixed(1)}h supports memory consolidation.`}
                    </p>
                  </div>
                  <ChevronRight size={14} className="text-muted-foreground flex-shrink-0 mt-1" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Weight / Body */}
          <Link href="/body">
            <Card className="border-border hover:border-health-blue/40 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-health-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Scale size={16} className="text-health-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-bold text-foreground">Body Composition</span>
                      <PriorityBadge p={weightPriority} />
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-black text-health-blue">{lw?.weight ?? '--'}<span className="text-sm font-semibold text-muted-foreground">kg</span></span>
                      <div className="text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">30d: {change30 > 0 ? '+' : ''}{change30.toFixed(1)}kg {trendIcon(wTrend, false)}</div>
                        <div>BMI {lw?.bmi ?? '--'} · Body fat {lw?.bodyFat ?? '--'}%</div>
                      </div>
                    </div>
                    {/* Goal progress */}
                    <div className="mb-2">
                      <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                        <span>Goal: {profile.targetWeight} kg</span>
                        <span>{((lw?.weight ?? 78) - profile.targetWeight).toFixed(1)} kg to go</span>
                      </div>
                      <Progress
                        value={Math.min(100, Math.max(0, (1 - ((lw?.weight ?? 78) - profile.targetWeight) / 15) * 100))}
                        className="h-1.5"
                        indicatorClassName="bg-health-green"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      BMI {(lw?.bmi ?? 0).toFixed(1)} is overweight on the Asian scale (threshold ≥23). Visceral fat {lw?.visceralFat} (target ≤9) raises cardiovascular risk. Body fat {lw?.bodyFat}% — target &lt;18% for Asian males your age.
                    </p>
                  </div>
                  <ChevronRight size={14} className="text-muted-foreground flex-shrink-0 mt-1" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Exercise / VO2 */}
          <Link href="/exercise">
            <Card className="border-border hover:border-health-amber/40 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-health-amber/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Dumbbell size={16} className="text-health-amber" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-bold text-foreground">Exercise & Fitness</span>
                      <PriorityBadge p={fitnessPriority} />
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-black text-health-amber">{lv?.value ?? '--'}<span className="text-xs font-semibold text-muted-foreground ml-1">mL/kg/min</span></span>
                      <div className="text-xs text-muted-foreground">
                        <div>VO₂ Max · {lv?.category}</div>
                        <div>{recentEx.length} sessions · {weeklyMin}min this week</div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      VO₂ max {lv?.value} has improved from 41.2 over 3 months — a positive trend. Good category for a 30yo male (excellent starts at 47). {weeklyMin}min/week meets WHO guidelines. Zone 2 training is the fastest path to improving VO₂ max further.
                    </p>
                  </div>
                  <ChevronRight size={14} className="text-muted-foreground flex-shrink-0 mt-1" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Blood markers */}
          <Link href="/gp">
            <Card className="border-border hover:border-health-red/40 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-health-red/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Droplets size={16} className="text-health-red" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-bold text-foreground">Blood Panel</span>
                      <PriorityBadge p={bloodPriority} />
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {[
                        { label: 'LDL', val: `${ldl}`, unit: 'mg/dL', ok: ldl < 100 },
                        { label: 'Vit D', val: `${vitD}`, unit: 'ng/mL', ok: vitD >= 30 },
                        { label: 'Glucose', val: `${glucose}`, unit: 'mg/dL', ok: glucose < 100 },
                        { label: 'HDL', val: `${hdl}`, unit: 'mg/dL', ok: hdl >= 60 },
                        { label: 'HbA1c', val: `${hba1c}`, unit: '%', ok: hba1c < 5.7 },
                        { label: 'Trig', val: `${trig}`, unit: 'mg/dL', ok: trig < 150 },
                      ].map(({ label, val, unit, ok }) => (
                        <div key={label} className={`rounded-lg px-2 py-1.5 ${ok ? 'bg-health-green/10' : 'bg-health-amber/10'}`}>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
                          <p className={`text-sm font-black ${ok ? 'text-health-green' : 'text-health-amber'}`}>{val}<span className="text-[9px] font-normal ml-0.5">{unit}</span></p>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {vitD < 30
                        ? `Vitamin D ${vitD} ng/mL is insufficient (target 30–60). This affects immune function, bone density, and mood. LDL ${ldl} mg/dL is near-optimal — dietary intervention can bring it below 100.`
                        : `Most blood markers are in range. Continue monitoring LDL and maintain healthy diet.`}
                    </p>
                  </div>
                  <ChevronRight size={14} className="text-muted-foreground flex-shrink-0 mt-1" />
                </div>
              </CardContent>
            </Card>
          </Link>

        </div>
      </div>

      <Separator className="my-5" />

      {/* ── Action Plan ──────────────────────────────────────────── */}
      <div className="px-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Your Action Plan · {actions.length} items
        </h2>
        <div className="space-y-2.5">
          {actions.map((a, i) => (
            <Card key={i} className="border-border">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-black text-foreground flex-shrink-0">
                      {i + 1}
                    </div>
                    {i < actions.length - 1 && <div className="w-px flex-1 bg-border" />}
                  </div>
                  <div className="flex-1 pb-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">{a.icon}</span>
                      <span className="text-sm font-bold text-foreground">{a.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1.5 leading-relaxed">{a.why}</p>
                    <div className="flex items-start gap-1.5 mb-2">
                      <ArrowRight size={11} className="text-health-green mt-0.5 flex-shrink-0" />
                      <p className="text-xs font-medium text-foreground">{a.how}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                        Effort: {a.effort}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-health-green/10 text-health-green">
                        Impact: {a.impact}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="my-5" />

      {/* ── Trend Charts ────────────────────────────────────────── */}
      <div className="px-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">14-Day Trends</h2>

        {/* Sleep chart */}
        <Card className="mb-4 border-border">
          <CardHeader className="pb-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-health-purple">Sleep Duration</CardTitle>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {trendIcon(slTrend, true)}
                <span>{slTrend === 'up' ? 'Improving' : slTrend === 'down' ? 'Declining' : 'Stable'}</span>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Avg {avgSleep7.toFixed(1)}h/night · Target 7.5h ·{' '}
              {avgSleep7 >= 7.5 ? '✓ Meeting target' : `${Math.round((7.5 - avgSleep7) * 60)} min/night under target`}
            </p>
          </CardHeader>
          <CardContent>
            <SleepChart data={sleep} />
          </CardContent>
        </Card>

        {/* Recovery / HRV chart */}
        <Card className="mb-4 border-border">
          <CardHeader className="pb-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-health-green">Stress & HRV</CardTitle>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {trendIcon(stTrend, false)}
                <span>Stress {stTrend === 'down' ? 'improving' : stTrend === 'up' ? 'rising' : 'stable'}</span>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Avg HRV {avgHRV7.toFixed(0)}ms · Avg RHR {avgRHR7.toFixed(0)}bpm · Stress {avgStress7.toFixed(0)}/100
              {avgStress7 < 50 ? ' · ✓ Low stress baseline' : ' · Elevated stress — review sleep + alcohol'}
            </p>
          </CardHeader>
          <CardContent>
            <StressChart data={stress} />
          </CardContent>
        </Card>

        {/* Exercise chart */}
        <Card className="mb-4 border-border">
          <CardHeader className="pb-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-health-amber">Exercise Activity</CardTitle>
              <Badge variant={weeklyMin >= 150 ? 'success' : 'warning'} className="text-[10px]">
                {weeklyMin >= 150 ? '✓ WHO 150min met' : `${150 - weeklyMin}min to goal`}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              This week: {recentEx.length} sessions · {weeklyMin} min · {weeklyKcal} kcal burned
            </p>
          </CardHeader>
          <CardContent>
            <ExerciseChart data={exercise} />
          </CardContent>
        </Card>

        {/* VO2 Max trend */}
        <Card className="mb-4 border-border">
          <CardHeader className="pb-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-health-blue">VO₂ Max Progress</CardTitle>
              <Badge variant="success" className="text-[10px]">↑ +3.4 over 3mo</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Current {lv?.value} mL/kg/min — Good category · Excellent starts at 47 for age 30
            </p>
          </CardHeader>
          <CardContent>
            <VO2MaxChart data={vo2max} />
          </CardContent>
        </Card>

        {/* Weight chart */}
        <Card className="mb-4 border-border">
          <CardHeader className="pb-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-health-blue">Weight Trend</CardTitle>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {trendIcon(wTrend, false)}
                <span>{change30 < 0 ? `${Math.abs(change30).toFixed(1)}kg lost` : `${change30.toFixed(1)}kg gained`} (30d)</span>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Current {lw?.weight}kg · Goal {profile.targetWeight}kg ·{' '}
              {((lw?.weight ?? 78) - profile.targetWeight).toFixed(1)}kg to target
            </p>
          </CardHeader>
          <CardContent>
            <WeightChart data={weight} targetWeight={profile.targetWeight} />
          </CardContent>
        </Card>

      </div>

      {/* ── Evidence note ──────────────────────────────────────── */}
      <div className="mx-4 mb-4 rounded-2xl bg-card border border-border p-3">
        <div className="flex items-start gap-2">
          <Info size={13} className="text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Insights based on ACC/AHA 2019 (lipids), ADA 2024 (glucose), NSF Sleep Guidelines 2023, Endocrine Society (Vitamin D), WHO Exercise 2020, and ACSM VO₂ Max norms. Not a substitute for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
