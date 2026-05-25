import Link from 'next/link';
import { getHealthData } from '@/lib/store';
import { last, avg } from '@/lib/utils';
import RecoveryRing from '@/components/RecoveryRing';
import StressChart from '@/components/StressChart';
import { ChevronLeft } from 'lucide-react';

export const revalidate = 60;

function recoveryColor(s: number) { return s >= 67 ? '#30D158' : s >= 34 ? '#FF9F0A' : '#FF3B30'; }
function recoveryLabel(s: number) { return s >= 67 ? 'Optimal' : s >= 34 ? 'Moderate' : 'Low'; }
function stressLabel(s: number) { return s < 25 ? 'Very Low' : s < 50 ? 'Low' : s < 65 ? 'Moderate' : s < 80 ? 'High' : 'Very High'; }
function stressColor(s: number) { return s < 50 ? '#30D158' : s < 65 ? '#FF9F0A' : '#FF3B30'; }

export default async function RecoveryPage() {
  const data = await getHealthData();
  const { stress, sleep } = data;

  const ls        = last(stress);
  const lsl       = last(sleep);
  const avgHRV7   = avg(stress.slice(-7).map(s => s.hrv));
  const avgStress7 = avg(stress.slice(-7).map(s => s.score));
  const avgRHR7   = avg(stress.slice(-7).map(s => s.restingHeartRate));
  const sleepScore = Math.round(Math.min(((lsl?.totalHours ?? 0) / 8) * 100, 100));
  const hrvScore   = Math.round(Math.min(((ls?.hrv ?? 0) / 80) * 100, 100));
  const recoveryScore = Math.round(hrvScore * 0.6 + sleepScore * 0.4);
  const rColor = recoveryColor(recoveryScore);

  const insights = [
    {
      label: 'HRV vs Baseline',
      value: `${ls?.hrv ?? '--'} ms`,
      baseline: `7d avg: ${avgHRV7.toFixed(0)} ms`,
      delta: ls && avgHRV7 ? ls.hrv - avgHRV7 : 0,
      color: '#BF5AF2',
      note: 'HRV >50ms is associated with good aerobic fitness. Each 10ms increase above baseline signals improved recovery. (Plews et al., 2012, IJSPP)',
    },
    {
      label: 'Resting Heart Rate',
      value: `${ls?.restingHeartRate ?? '--'} bpm`,
      baseline: `7d avg: ${avgRHR7.toFixed(0)} bpm`,
      delta: ls && avgRHR7 ? avgRHR7 - ls.restingHeartRate : 0,
      color: rColor,
      note: 'Each 1 bpm above your 7-day RHR baseline indicates less-than-optimal recovery. Target <60 bpm for aerobic athletes. (ACSM Guidelines, 2022)',
    },
    {
      label: 'Stress Score',
      value: `${ls?.score ?? '--'}/100`,
      baseline: `7d avg: ${avgStress7.toFixed(0)}/100`,
      delta: avgStress7 - (ls?.score ?? avgStress7),
      color: stressColor(ls?.score ?? avgStress7),
      note: 'Calculated from HRV, respiratory rate, and motion. Scores <50 indicate good parasympathetic tone. (Shaffer & Ginsberg, 2017, Front. Public Health)',
    },
  ];

  return (
    <div className="animate-fade">
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <Link href="/" className="p-2 rounded-xl active:scale-90 transition-transform" style={{ background: 'var(--bg-elevated)' }}>
          <ChevronLeft size={18} style={{ color: 'var(--text)' }} />
        </Link>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-faint)' }}>Apple Health</p>
          <h1 className="text-lg font-black" style={{ color: 'var(--text)' }}>Recovery & Stress</h1>
        </div>
      </div>

      {/* Recovery ring */}
      <div className="flex flex-col items-center py-4">
        <RecoveryRing score={recoveryScore} label="Recovery" sublabel={recoveryLabel(recoveryScore)} color={rColor} size={240} strokeWidth={20} />
        <p className="text-xs mt-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Based on HRV ({ls?.hrv ?? '--'}ms) + Sleep ({lsl?.totalHours.toFixed(1) ?? '--'}h)</p>
      </div>

      {/* Today's stats */}
      <div className="mx-4 card p-4 mb-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--text-faint)' }}>Today vs Baseline</p>
        {insights.map(item => (
          <div key={item.label} className="mb-4 last:mb-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>{item.label}</p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold" style={{ color: 'var(--text-faint)' }}>{item.baseline}</span>
                {item.delta !== 0 && (
                  <span className="text-[10px] font-bold" style={{ color: item.delta > 0 ? '#30D158' : '#FF3B30' }}>
                    {item.delta > 0 ? '+' : ''}{item.delta.toFixed(0)}
                  </span>
                )}
              </div>
            </div>
            <p className="text-2xl font-black mb-1.5" style={{ color: item.color }}>{item.value}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.note}</p>
            <div className="mt-1.5" style={{ height: 1, background: 'var(--border-subtle)' }} />
          </div>
        ))}
      </div>

      {/* Recovery score */}
      {ls?.recoveryScore && (
        <div className="mx-4 card p-4 mb-4 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--text-faint)' }}>Recovery Score</p>
          <p className="font-black" style={{ fontSize: 56, color: rColor }}>{ls.recoveryScore}%</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Based on last night&apos;s HRV, skin temp, and respiratory rate</p>
        </div>
      )}

      {/* Stress + HRV charts */}
      <div className="mx-4 card p-4 mb-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--text-faint)' }}>14-Day Stress & HRV</p>
        <StressChart data={stress} />
      </div>

      {/* Evidence */}
      <div className="mx-4 mb-6 p-3 rounded-2xl" style={{ background: 'color-mix(in srgb, #30D158 10%, var(--bg-card))', border: '1px solid color-mix(in srgb, #30D158 20%, transparent)' }}>
        <p className="text-xs font-bold mb-0.5" style={{ color: '#30D158' }}>How to improve recovery</p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>HRV increases with consistent Zone 2 training, 7–9h sleep, and reduced alcohol. Cold exposure post-exercise (15 min at 10–15°C) improves next-day HRV by ~8%. <span style={{ color: 'var(--text-faint)' }}>(Stanley et al., 2012, EJAP)</span></p>
      </div>
    </div>
  );
}
