import Link from 'next/link';
import { getHealthData } from '@/lib/store';
import { last } from '@/lib/utils';
import ExerciseChart from '@/components/ExerciseChart';
import VO2MaxChart from '@/components/VO2MaxChart';
import { ChevronLeft, Zap } from 'lucide-react';

export const revalidate = 60;

const typeColor: Record<string, string> = {
  Running: '#FF9F0A', Cycling: '#0A84FF', 'Strength Training': '#BF5AF2',
  Yoga: '#30D158', Walking: '#8E8E93', Swimming: '#00C7BE', HIIT: '#FF3B30',
};

export default async function ExercisePage() {
  const data = await getHealthData();
  const { exercise, vo2max } = data;

  const recent7   = exercise.slice(-7);
  const recent30  = exercise.slice(-30);
  const weeklyMin = recent7.reduce((s, e) => s + e.duration, 0);
  const weeklyKcal = recent7.reduce((s, e) => s + e.activeCalories, 0);
  const lv        = last(vo2max);

  // Strain 0–21
  const strainScore = Math.min(parseFloat(((weeklyMin / 7) * 0.05 + (recent7.length * 0.3)).toFixed(1)), 21);
  const strainColor = strainScore >= 14 ? '#FF3B30' : strainScore >= 10 ? '#FF9F0A' : '#0A84FF';

  const byType = recent30.reduce<Record<string, { count: number; min: number; kcal: number }>>((acc, e) => {
    if (!acc[e.type]) acc[e.type] = { count: 0, min: 0, kcal: 0 };
    acc[e.type].count++;
    acc[e.type].min += e.duration;
    acc[e.type].kcal += e.activeCalories;
    return acc;
  }, {});

  return (
    <div className="animate-fade">
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <Link href="/" className="p-2 rounded-xl active:scale-90 transition-transform" style={{ background: 'var(--bg-elevated)' }}>
          <ChevronLeft size={18} style={{ color: 'var(--text)' }} />
        </Link>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-faint)' }}>Strava + Apple Health</p>
          <h1 className="text-lg font-black" style={{ color: 'var(--text)' }}>Exercise & Strain</h1>
        </div>
      </div>

      {/* Strain hero */}
      <div className="mx-4 card p-5 mb-4 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--text-faint)' }}>Weekly Strain</p>
        <p className="font-black leading-none mb-1" style={{ fontSize: 72, color: strainColor }}>{strainScore}</p>
        <div className="flex items-center justify-center gap-1 mb-3">
          <Zap size={12} style={{ color: strainColor }} />
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: strainColor }}>
            {strainScore >= 14 ? 'Overreaching' : strainScore >= 10 ? 'Strenuous' : strainScore >= 7 ? 'Moderate' : 'Light'}
          </p>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
          <div className="h-full rounded-full" style={{ width: `${(strainScore / 21) * 100}%`, background: strainColor, boxShadow: `0 0 8px ${strainColor}88` }} />
        </div>
        <div className="flex justify-around mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          {[['Sessions', recent7.length, '#30D158'], ['Active Min', weeklyMin, '#0A84FF'], ['Kcal', weeklyKcal, '#FF9F0A']].map(([l, v, c]) => (
            <div key={String(l)} className="text-center">
              <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--text-faint)' }}>{String(l)}</p>
              <p className="text-lg font-black" style={{ color: String(c) }}>{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Activity chart */}
      <div className="mx-4 card p-4 mb-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--text-faint)' }}>14-Day Activity</p>
        <ExerciseChart data={exercise} />
      </div>

      {/* VO2 Max */}
      <div className="mx-4 card p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-faint)' }}>VO2 Max</p>
          <div>
            <span className="text-2xl font-black" style={{ color: '#0A84FF' }}>{lv?.value ?? '--'}</span>
            <span className="text-xs font-bold ml-1" style={{ color: 'var(--text-muted)' }}>mL/kg/min</span>
            <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'color-mix(in srgb, #0A84FF 15%, transparent)', color: '#0A84FF' }}>{lv?.category}</span>
          </div>
        </div>
        <VO2MaxChart data={vo2max} />
        <div className="mt-3 p-3 rounded-xl" style={{ background: 'var(--bg-elevated)' }}>
          <p className="text-xs font-bold mb-0.5" style={{ color: '#0A84FF' }}>Evidence-based target for 30M</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Good ≥40, Excellent ≥47 mL/kg/min. Zone 2 training (60-70% HRmax, 150+ min/week) is the most evidence-based way to raise VO2 max. <span style={{ color: 'var(--text-faint)' }}>(Milanović et al., 2015, IJSPP)</span></p>
        </div>
      </div>

      {/* By activity type */}
      <div className="mx-4 card p-4 mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--text-faint)' }}>30-Day Breakdown</p>
        <div className="space-y-2">
          {Object.entries(byType).sort((a, b) => b[1].min - a[1].min).map(([type, stats]) => (
            <div key={type} className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: typeColor[type] || '#8E8E93' }} />
              <p className="text-sm font-bold flex-1" style={{ color: 'var(--text)' }}>{type}</p>
              <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{stats.count}x · {stats.min}min</p>
              <p className="text-xs font-bold" style={{ color: typeColor[type] || '#8E8E93' }}>{stats.kcal} kcal</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
