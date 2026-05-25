import Link from 'next/link';
import { getHealthData } from '@/lib/store';
import { last, avg } from '@/lib/utils';
import RecoveryRing from '@/components/RecoveryRing';
import SleepChart from '@/components/SleepChart';
import { ChevronLeft } from 'lucide-react';

export const revalidate = 60;

function sleepQualityColor(q: string) {
  return q === 'excellent' ? '#0A84FF' : q === 'good' ? '#30D158' : q === 'fair' ? '#FF9F0A' : '#FF3B30';
}

export default async function SleepPage() {
  const data = await getHealthData();
  const { sleep } = data;

  const latest     = last(sleep);
  const avg7       = avg(sleep.slice(-7).map(s => s.totalHours));
  const avgDeep7   = avg(sleep.slice(-7).map(s => s.deepSleep));
  const avgREM7    = avg(sleep.slice(-7).map(s => s.remSleep));
  const sleepScore = latest ? Math.round(Math.min((latest.totalHours / 8) * 100, 100)) : 0;
  const color      = latest ? sleepQualityColor(latest.quality) : '#BF5AF2';

  const stages = latest
    ? [
        { label: 'AWAKE',  val: latest.awake,      pct: (latest.awake / latest.totalHours) * 100,      color: '#FF3B30' },
        { label: 'REM',    val: latest.remSleep,    pct: (latest.remSleep / latest.totalHours) * 100,   color: '#BF5AF2' },
        { label: 'LIGHT',  val: latest.lightSleep,  pct: (latest.lightSleep / latest.totalHours) * 100, color: '#8E8E93' },
        { label: 'DEEP',   val: latest.deepSleep,   pct: (latest.deepSleep / latest.totalHours) * 100,  color: '#0A84FF' },
      ]
    : [];

  return (
    <div className="animate-fade">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <Link href="/" className="p-2 rounded-xl active:scale-90 transition-transform" style={{ background: 'var(--bg-elevated)' }}>
          <ChevronLeft size={18} style={{ color: 'var(--text)' }} />
        </Link>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-faint)' }}>Apple Health</p>
          <h1 className="text-lg font-black" style={{ color: 'var(--text)' }}>Sleep</h1>
        </div>
      </div>

      {/* Ring hero */}
      <div className="flex flex-col items-center py-4">
        <RecoveryRing score={sleepScore} label="Sleep Performance" sublabel={latest?.quality?.toUpperCase()} color="#BF5AF2" size={240} strokeWidth={20} />
        <div className="flex gap-6 mt-2">
          <div className="text-center">
            <p className="text-2xl font-black" style={{ color: '#BF5AF2' }}>{latest?.totalHours.toFixed(1) ?? '--'}<span className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>h</span></p>
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>Duration</p>
          </div>
          <div className="w-px" style={{ background: 'var(--border)' }} />
          <div className="text-center">
            <p className="text-2xl font-black" style={{ color: 'var(--text)' }}>{avg7.toFixed(1)}<span className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>h</span></p>
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>7d Avg</p>
          </div>
          <div className="w-px" style={{ background: 'var(--border)' }} />
          <div className="text-center">
            <p className="text-2xl font-black" style={{ color: '#FF9F0A' }}>7.5<span className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>h</span></p>
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>Target</p>
          </div>
        </div>
      </div>

      {/* Sleep stages */}
      {latest && (
        <div className="mx-4 card p-4 mb-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--text-faint)' }}>Last Night — Sleep Stages</p>
          {/* Stage bar */}
          <div className="flex h-4 rounded-full overflow-hidden mb-4 gap-0.5">
            {stages.map(s => (
              <div key={s.label} className="h-full" style={{ width: `${s.pct}%`, background: s.color }} />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {stages.map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>{s.label}</p>
                  <p className="text-sm font-black" style={{ color: s.color }}>{s.val.toFixed(1)}h <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{Math.round(s.pct)}%</span></p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--text-faint)' }}>Heart Rate Dip</p>
            <p className="text-lg font-black" style={{ color: '#30D158' }}>{latest.heartRateDip}%<span className="text-xs font-semibold ml-1" style={{ color: 'var(--text-muted)' }}>overnight drop</span></p>
          </div>
        </div>
      )}

      {/* 7-day averages */}
      <div className="mx-4 card p-4 mb-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--text-faint)' }}>7-Day Stage Averages</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[['DEEP', avgDeep7, '#0A84FF'], ['REM', avgREM7, '#BF5AF2'], ['LIGHT', avg(sleep.slice(-7).map(s => s.lightSleep)), '#8E8E93']].map(([l, v, c]) => (
            <div key={String(l)}>
              <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--text-faint)' }}>{String(l)}</p>
              <p className="text-xl font-black" style={{ color: String(c) }}>{(Number(v)).toFixed(1)}<span className="text-xs" style={{ color: 'var(--text-muted)' }}>h</span></p>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence note */}
      <div className="mx-4 mb-4 p-3 rounded-2xl" style={{ background: 'color-mix(in srgb, #BF5AF2 10%, var(--bg-card))', border: '1px solid color-mix(in srgb, #BF5AF2 20%, transparent)' }}>
        <p className="text-xs font-bold mb-0.5" style={{ color: '#BF5AF2' }}>Evidence-based target</p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Adults aged 26–64 need 7–9 hrs/night. Deep sleep should be ≥13% of total sleep, REM ≥20%. <span style={{ color: 'var(--text-faint)' }}>(NSF Sleep Guidelines, 2023)</span></p>
      </div>

      {/* 14-day chart */}
      <div className="mx-4 card p-4 mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--text-faint)' }}>14-Day Sleep History</p>
        <SleepChart data={sleep} />
      </div>
    </div>
  );
}
