import Link from 'next/link';
import { getHealthData } from '@/lib/store';
import { last, avg, trend } from '@/lib/utils';
import RecoveryRing from '@/components/RecoveryRing';
import WeightChart from '@/components/WeightChart';
import { ChevronRight, AlertTriangle } from 'lucide-react';

export const revalidate = 60;

function recoveryColor(s: number) { return s >= 67 ? '#30D158' : s >= 34 ? '#FF9F0A' : '#FF3B30'; }
function recoveryLabel(s: number) { return s >= 67 ? 'Optimal' : s >= 34 ? 'Moderate' : 'Low'; }

export default async function DashboardPage() {
  const data = await getHealthData();
  const { weight, sleep, exercise, stress, vo2max, profile, isSampleData } = data;

  const lw  = last(weight);
  const ls  = last(stress);
  const lv  = last(vo2max);
  const lsl = last(sleep);

  const avgSleep7  = avg(sleep.slice(-7).map(s => s.totalHours));
  const avgHRV7    = avg(stress.slice(-7).map(s => s.hrv));
  const avgStress7 = avg(stress.slice(-7).map(s => s.score));

  const sleepScore    = Math.round(Math.min(((lsl?.totalHours ?? 0) / 8) * 100, 100));
  const hrvScore      = Math.round(Math.min(((ls?.hrv ?? 0) / 80) * 100, 100));
  const recoveryScore = Math.round(hrvScore * 0.6 + sleepScore * 0.4);
  const rColor        = recoveryColor(recoveryScore);

  // Strain = weighted exercise load 0–21 scale like Whoop
  const recentEx      = exercise.slice(-7);
  const weeklyMin     = recentEx.reduce((s, e) => s + e.duration, 0);
  const weeklyCalories = recentEx.reduce((s, e) => s + e.activeCalories, 0);
  const strainScore   = Math.min(parseFloat(((weeklyMin / 7) * 0.05 + (recentEx.length * 0.3)).toFixed(1)), 21);

  const wTrend = trend(weight.map(w => w.weight));
  const weightChange30 = weight.length >= 2
    ? (last(weight)!.weight - weight[Math.max(0, weight.length - 8)].weight).toFixed(1)
    : '0';

  const today = new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="animate-fade">

      {/* ── Sample data banner ───────────── */}
      {isSampleData && (
        <div className="mx-4 mt-4 mb-0 flex items-start gap-2.5 rounded-2xl p-3" style={{ background: 'color-mix(in srgb, #FF9F0A 12%, var(--bg-card))', border: '1px solid color-mix(in srgb, #FF9F0A 30%, transparent)' }}>
          <AlertTriangle size={15} style={{ color: '#FF9F0A', flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className="text-xs font-bold" style={{ color: '#FF9F0A' }}>No real data synced yet</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              This is sample data. <Link href="/sync" className="underline" style={{ color: '#FF9F0A' }}>Connect Apple Health & Strava</Link> to see your real metrics.
            </p>
          </div>
        </div>
      )}

      {/* ── Date header ──────────────────── */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-faint)' }}>Today</p>
          <p className="text-base font-bold" style={{ color: 'var(--text)' }}>{today}</p>
        </div>
        {!isSampleData && ls && (
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>Resting HR</p>
            <p className="text-xl font-black" style={{ color: rColor }}>{ls.restingHeartRate}<span className="text-xs font-bold ml-0.5" style={{ color: 'var(--text-muted)' }}>bpm</span></p>
          </div>
        )}
      </div>

      {/* ── Recovery ring hero ───────────── */}
      <Link href="/recovery" className="flex flex-col items-center py-2 active:opacity-80 transition-opacity">
        <RecoveryRing
          score={recoveryScore}
          label="Recovery"
          sublabel={recoveryLabel(recoveryScore)}
          color={rColor}
          size={260}
          strokeWidth={22}
        />
      </Link>

      {/* ── Strain + Sleep row ───────────── */}
      <div className="grid grid-cols-2 gap-3 mx-4 mb-4">
        <Link href="/exercise" className="card p-4 text-center active:scale-95 transition-transform block">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] mb-2" style={{ color: 'var(--text-faint)' }}>Strain</p>
          <p className="font-black leading-none" style={{ fontSize: 42, color: '#0A84FF' }}>{strainScore}</p>
          <p className="text-[10px] font-bold mt-1" style={{ color: 'var(--text-muted)' }}>{weeklyMin} min · {weeklyCalories} kcal</p>
          <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
            <div className="h-full rounded-full" style={{ width: `${Math.min((strainScore / 21) * 100, 100)}%`, background: '#0A84FF', boxShadow: '0 0 6px #0A84FF88' }} />
          </div>
        </Link>

        <Link href="/sleep" className="card p-4 text-center active:scale-95 transition-transform block">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] mb-2" style={{ color: 'var(--text-faint)' }}>Sleep</p>
          <p className="font-black leading-none" style={{ fontSize: 42, color: '#BF5AF2' }}>{lsl?.totalHours.toFixed(1) ?? '--'}<span className="text-lg">h</span></p>
          <p className="text-[10px] font-bold mt-1" style={{ color: 'var(--text-muted)' }}>7d avg {avgSleep7.toFixed(1)}h</p>
          <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
            <div className="h-full rounded-full" style={{ width: `${sleepScore}%`, background: '#BF5AF2', boxShadow: '0 0 6px #BF5AF288' }} />
          </div>
        </Link>
      </div>

      {/* ── Divider ──────────────────────── */}
      <div className="mx-4 mb-4" style={{ height: 1, background: 'var(--border-subtle)' }} />

      {/* ── Body ─────────────────────────── */}
      <div className="px-4 mb-2">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--text-faint)' }}>Body Composition</p>
        <Link href="/body" className="card p-4 flex items-center gap-3 active:opacity-80 transition-opacity block mb-3">
          <div className="flex-1">
            <div className="flex items-end gap-2 mb-1">
              <span className="text-3xl font-black" style={{ color: '#0A84FF' }}>{lw?.weight ?? '--'}</span>
              <span className="text-sm font-bold mb-1" style={{ color: 'var(--text-muted)' }}>kg</span>
              {wTrend !== 'stable' && (
                <span className="text-xs font-bold mb-1" style={{ color: Number(weightChange30) < 0 ? '#30D158' : '#FF9F0A' }}>{Number(weightChange30) > 0 ? '+' : ''}{weightChange30}kg</span>
              )}
            </div>
            <p className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
              BMI {lw?.bmi ?? '--'} · Body fat {lw?.bodyFat ?? '--'}% · Muscle {lw?.muscleMass ?? '--'}kg
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-faint)' }}>
              Goal {profile.targetWeight}kg · {((lw?.weight ?? 78) - profile.targetWeight).toFixed(1)}kg to go · Source: Apple Health + RENPHO
            </p>
          </div>
          <ChevronRight size={16} style={{ color: 'var(--text-faint)', flexShrink: 0 }} />
        </Link>

        {/* Weight trend mini */}
        <div className="card p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] mb-3" style={{ color: 'var(--text-faint)' }}>30-Day Weight Trend</p>
          <WeightChart data={weight} targetWeight={profile.targetWeight} />
        </div>
      </div>

      {/* ── Divider ──────────────────────── */}
      <div className="mx-4 my-4" style={{ height: 1, background: 'var(--border-subtle)' }} />

      {/* ── Fitness ──────────────────────── */}
      <div className="px-4 mb-2">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--text-faint)' }}>Fitness</p>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/exercise" className="card p-4 active:scale-95 transition-transform block">
            <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-faint)' }}>This Week</p>
            <p className="text-2xl font-black" style={{ color: '#30D158' }}>{weeklyMin}<span className="text-sm font-bold ml-0.5" style={{ color: 'var(--text-muted)' }}>min</span></p>
            <p className="text-xs mt-1 font-semibold" style={{ color: 'var(--text-muted)' }}>{recentEx.length} sessions</p>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-faint)' }}>Strava + Apple Health</p>
          </Link>
          <Link href="/exercise" className="card p-4 active:scale-95 transition-transform block">
            <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-faint)' }}>VO2 Max</p>
            <p className="text-2xl font-black" style={{ color: '#0A84FF' }}>{lv?.value ?? '--'}<span className="text-xs font-bold ml-0.5" style={{ color: 'var(--text-muted)' }}>mL/kg</span></p>
            <p className="text-xs mt-1 font-semibold" style={{ color: 'var(--text-muted)' }}>{lv?.category ?? '--'}</p>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-faint)' }}>{lv?.source === 'strava' ? 'Strava' : 'Apple Health'}</p>
          </Link>
        </div>
      </div>

      {/* ── Divider ──────────────────────── */}
      <div className="mx-4 my-4" style={{ height: 1, background: 'var(--border-subtle)' }} />

      {/* ── Recovery quick stats ─────────── */}
      <div className="px-4 mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--text-faint)' }}>Recovery & Stress</p>
        <Link href="/recovery" className="card p-4 flex items-center gap-4 active:opacity-80 transition-opacity block">
          <div className="flex-1 grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'HRV', val: `${ls?.hrv ?? '--'}`, unit: 'ms', color: '#BF5AF2' },
              { label: 'Resting HR', val: `${ls?.restingHeartRate ?? '--'}`, unit: 'bpm', color: rColor },
              { label: 'Stress', val: `${ls?.score ?? '--'}`, unit: '/100', color: avgStress7 < 50 ? '#30D158' : avgStress7 < 65 ? '#FF9F0A' : '#FF3B30' },
            ].map(({ label, val, unit, color }) => (
              <div key={label}>
                <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--text-faint)' }}>{label}</p>
                <p className="text-xl font-black" style={{ color }}>{val}<span className="text-[9px] font-bold ml-0.5" style={{ color: 'var(--text-muted)' }}>{unit}</span></p>
              </div>
            ))}
          </div>
          <ChevronRight size={16} style={{ color: 'var(--text-faint)', flexShrink: 0 }} />
        </Link>
        <p className="text-[10px] mt-2 ml-1" style={{ color: 'var(--text-faint)' }}>7d avg HRV: {avgHRV7.toFixed(0)} ms · Source: Apple Health</p>
      </div>
    </div>
  );
}
