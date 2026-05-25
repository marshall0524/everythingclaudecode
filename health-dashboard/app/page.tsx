import { getHealthData } from '@/lib/store';
import { last, avg, trend, getBMICategory, formatRelativeTime } from '@/lib/utils';
import RecoveryRing from '@/components/RecoveryRing';
import MetricCard from '@/components/MetricCard';
import WeightChart from '@/components/WeightChart';
import SleepChart from '@/components/SleepChart';
import ExerciseChart from '@/components/ExerciseChart';
import StressChart from '@/components/StressChart';
import VO2MaxChart from '@/components/VO2MaxChart';
import BMIGauge from '@/components/BMIGauge';
import { Scale, Bed, Dumbbell, Wind, Zap, FileText, ChevronRight, Flame } from 'lucide-react';

export const revalidate = 60;

export default async function DashboardPage() {
  const data = await getHealthData();
  const { weight, sleep, exercise, stress, vo2max, profile, pathology, lastSync } = data;

  const lw = last(weight);
  const ls = last(stress);
  const lv = last(vo2max);
  const lsl = last(sleep);

  const avgSleep7   = avg(sleep.slice(-7).map(s => s.totalHours));
  const avgStress7  = avg(stress.slice(-7).map(s => s.score));
  const avgHRV7     = avg(stress.slice(-7).map(s => s.hrv));

  // Recovery score: weighted from HRV baseline, sleep, resting HR
  const hrvBase = avgHRV7 || 60;
  const todayHRV = ls?.hrv || hrvBase;
  const todaySleep = lsl?.totalHours || 7;
  const sleepScore = Math.round(Math.min((todaySleep / 8) * 100, 100));
  const hrvScore   = Math.round(Math.min((todayHRV / 80) * 100, 100));
  const recoveryScore = Math.round(hrvScore * 0.6 + sleepScore * 0.4);

  const recentEx       = exercise.slice(-7);
  const weeklyMin      = recentEx.reduce((s, e) => s + e.duration, 0);
  const weeklyCalories = recentEx.reduce((s, e) => s + e.activeCalories, 0);

  const weightTrend    = trend(weight.map(w => w.weight));
  const weightChange30 = weight.length >= 2
    ? (last(weight)!.weight - weight[Math.max(0, weight.length - 8)].weight).toFixed(1)
    : '0';
  const bmiCat = lw ? getBMICategory(lw.bmi) : { label: '', color: '' };

  const lastSyncStr = lastSync.apple_health ? formatRelativeTime(lastSync.apple_health) : 'Never';

  const today = new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="px-4 py-5 space-y-6 animate-fade">

      {/* ── Date + sync ─────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>Today</p>
          <h1 className="text-lg font-bold leading-tight" style={{ color: 'var(--text)' }}>{today}</h1>
        </div>
        <div className="text-right">
          <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>Last sync</p>
          <p className="text-xs font-semibold" style={{ color: 'var(--recovery)' }}>{lastSyncStr}</p>
        </div>
      </div>

      {/* ── Recovery ring hero ───────────────── */}
      <div className="card p-5">
        <RecoveryRing
          recovery={recoveryScore}
          sleep={sleepScore}
          hrv={ls?.hrv ?? 62}
          rhr={ls?.restingHeartRate ?? 60}
        />
      </div>

      {/* ── Today at a glance ────────────────── */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Sleep', val: `${lsl?.totalHours.toFixed(1) ?? '--'}h`, color: 'var(--sleep)', pct: sleepScore },
          { label: 'Strain', val: `${Math.round(weeklyMin / 7)}m`, color: 'var(--strain)', pct: Math.min(Math.round(weeklyMin / 3), 100) },
          { label: 'Stress', val: `${ls?.score ?? '--'}`, color: avgStress7 < 50 ? 'var(--recovery)' : avgStress7 < 65 ? 'var(--warning)' : 'var(--danger)', pct: 100 - (ls?.score ?? 50) },
        ].map(({ label, val, color, pct }) => (
          <div key={label} className="card p-3 flex flex-col items-center gap-1.5">
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>{label}</p>
            <p className="text-lg font-extrabold" style={{ color }}>{val}</p>
            <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--bg-elevated)' }}>
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Weight & Body ───────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>Weight & Body</h2>
          <a href="/sync" className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: 'var(--strain)' }}>Sync <ChevronRight size={12} /></a>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <MetricCard
            title="Weight"
            value={lw?.weight ?? '--'}
            unit="kg"
            subtitle={`Goal ${profile.targetWeight} kg · Source: Apple Health`}
            trend={weightTrend}
            trendGood={false}
            trendValue={`${weightChange30}kg`}
            accentColor="var(--strain)"
            icon={<Scale size={14} />}
            badge={bmiCat.label}
          />
          <MetricCard
            title="Body Fat"
            value={lw?.bodyFat ?? '--'}
            unit="%"
            subtitle={`Muscle ${lw?.muscleMass ?? '--'} kg`}
            accentColor="var(--warning)"
            icon={<Flame size={14} />}
            badge={`Visceral ${lw?.visceralFat ?? '--'}`}
          />
        </div>

        {/* BMI Gauge */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>BMI</span>
            <span className="text-xs font-bold" style={{ color: bmiCat.color.includes('green') ? 'var(--recovery)' : bmiCat.color.includes('amber') ? 'var(--warning)' : bmiCat.color.includes('red') ? 'var(--danger)' : 'var(--strain)' }}>
              {bmiCat.label} — Asian scale
            </span>
          </div>
          <div className="flex items-center justify-around">
            <BMIGauge bmi={lw?.bmi ?? 27.6} asian />
            <div className="space-y-1.5 text-xs">
              {[['#0A84FF','Under',    '<18.5'],['#30D158','Normal','18.5–23'],['#FF9F0A','Over','23–27.5'],['#FF3B30','Obese','>27.5']].map(([c, l, r]) => (
                <div key={l} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c }} />
                  <span style={{ color: 'var(--text-muted)' }}>{l} <span style={{ color: 'var(--text-faint)' }}>{r}</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card p-4 mt-3">
          <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-faint)' }}>30-Day Weight Trend</p>
          <WeightChart data={weight} targetWeight={profile.targetWeight} />
        </div>
      </section>

      {/* ── Sleep ───────────────────────────── */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-faint)' }}>Sleep</h2>
        <MetricCard
          title="Last Night"
          value={lsl?.totalHours.toFixed(1) ?? '--'}
          unit="hrs"
          subtitle={`7-day avg ${avgSleep7.toFixed(1)}h · Source: Apple Health`}
          trend={trend(sleep.slice(-7).map(s => s.totalHours))}
          trendGood={true}
          accentColor="var(--sleep)"
          icon={<Bed size={14} />}
          badge={lsl?.quality}
        >
          <div className="flex gap-4 mt-2">
            {[['Deep', lsl?.deepSleep, '#0A84FF'], ['REM', lsl?.remSleep, '#BF5AF2'], ['Light', lsl?.lightSleep, '#8E8E93']].map(([l, v, c]) => (
              <div key={String(l)}>
                <span className="text-sm font-bold" style={{ color: String(c) }}>{(Number(v) || 0).toFixed(1)}h</span>
                <span className="text-xs ml-1" style={{ color: 'var(--text-faint)' }}>{String(l)}</span>
              </div>
            ))}
          </div>
        </MetricCard>
        <div className="card p-4 mt-3">
          <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-faint)' }}>14-Day Sleep</p>
          <SleepChart data={sleep} />
        </div>
      </section>

      {/* ── Exercise ────────────────────────── */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-faint)' }}>Exercise</h2>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <MetricCard
            title="This Week"
            value={weeklyMin}
            unit="min"
            subtitle={`${weeklyCalories} kcal · Strava + Apple Health`}
            accentColor="var(--recovery)"
            icon={<Dumbbell size={14} />}
            badge={`${recentEx.length} sessions`}
          />
          <MetricCard
            title="VO2 Max"
            value={lv?.value ?? '--'}
            unit="mL/kg"
            subtitle={lv?.category}
            accentColor="var(--strain)"
            icon={<Wind size={14} />}
            badge={`Source: ${lv?.source === 'strava' ? 'Strava' : 'Apple Health'}`}
          />
        </div>
        <div className="card p-4">
          <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-faint)' }}>Activity (14 days)</p>
          <ExerciseChart data={exercise} />
        </div>
        <div className="card p-4 mt-3">
          <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-faint)' }}>VO2 Max Progress</p>
          <VO2MaxChart data={vo2max} />
        </div>
      </section>

      {/* ── Stress & HRV ────────────────────── */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-faint)' }}>Stress & HRV</h2>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <MetricCard
            title="Stress"
            value={ls?.score ?? '--'}
            unit="/100"
            subtitle="Lower is better"
            accentColor={avgStress7 < 50 ? 'var(--recovery)' : avgStress7 < 65 ? 'var(--warning)' : 'var(--danger)'}
            icon={<Zap size={14} />}
          />
          <MetricCard
            title="HRV"
            value={ls?.hrv ?? '--'}
            unit="ms"
            subtitle={`RHR ${ls?.restingHeartRate ?? '--'} bpm`}
            accentColor="var(--sleep)"
            icon={<Zap size={14} />}
            badge={ls?.recoveryScore ? `Recovery ${ls.recoveryScore}%` : undefined}
          />
        </div>
        <div className="card p-4">
          <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-faint)' }}>Stress & HRV (14 days)</p>
          <StressChart data={stress} />
        </div>
      </section>

      {/* ── Pathology quick links ────────────── */}
      {pathology.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>Documents</h2>
            <a href="/pathology" className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: 'var(--strain)' }}>All <ChevronRight size={12} /></a>
          </div>
          {pathology.slice(0, 2).map(doc => (
            <a key={doc.id} href="/pathology" className="surface flex items-center gap-3 p-3 mb-2 hover:opacity-80 transition-opacity">
              <FileText size={18} style={{ color: 'var(--strain)' }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{doc.filename}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{doc.uploadDate} · {doc.type.replace(/_/g, ' ')}</p>
              </div>
              <ChevronRight size={14} style={{ color: 'var(--text-faint)' }} />
            </a>
          ))}
        </section>
      )}

      <div className="h-2" />
    </div>
  );
}
