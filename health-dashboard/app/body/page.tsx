import Link from 'next/link';
import { getHealthData } from '@/lib/store';
import { last, trend } from '@/lib/utils';
import WeightChart from '@/components/WeightChart';
import BMIGauge from '@/components/BMIGauge';
import { ChevronLeft } from 'lucide-react';

export const revalidate = 60;

export default async function BodyPage() {
  const data = await getHealthData();
  const { weight, profile } = data;

  const lw     = last(weight);
  const wTrend = trend(weight.map(w => w.weight));
  const change30 = weight.length >= 2
    ? (last(weight)!.weight - weight[Math.max(0, weight.length - 8)].weight)
    : 0;

  // Asian BMI category
  const bmi = lw?.bmi ?? 0;
  const bmiColor = bmi >= 27.5 ? '#FF3B30' : bmi >= 23 ? '#FF9F0A' : bmi >= 18.5 ? '#30D158' : '#0A84FF';
  const bmiLabel = bmi >= 27.5 ? 'Obese' : bmi >= 23 ? 'Overweight' : bmi >= 18.5 ? 'Normal' : 'Underweight';

  const toGo = ((lw?.weight ?? 78) - profile.targetWeight).toFixed(1);

  const metrics = [
    { label: 'Body Fat', val: `${lw?.bodyFat ?? '--'}%`, color: '#FF9F0A', target: '<18%', note: 'Healthy range for Asian males 20–35' },
    { label: 'Muscle Mass', val: `${lw?.muscleMass ?? '--'} kg`, color: '#30D158', target: '>60 kg', note: 'Preserve muscle during weight loss' },
    { label: 'Visceral Fat', val: `${lw?.visceralFat ?? '--'}`, color: lw && lw.visceralFat && lw.visceralFat > 9 ? '#FF3B30' : '#30D158', target: '≤9', note: 'Key cardiovascular risk marker' },
    { label: 'Metabolic Age', val: `${lw?.metabolicAge ?? '--'} yrs`, color: '#0A84FF', target: '≤30', note: 'Calculated from body composition' },
    { label: 'Water %', val: `${lw?.waterPercent ?? '--'}%`, color: '#00C7BE', target: '55–65%', note: 'Adequate hydration marker' },
    { label: 'Bone Mass', val: `${lw?.boneMass ?? '--'} kg`, color: '#BF5AF2', target: '2.8–3.2 kg', note: 'Source: RENPHO scale' },
  ];

  return (
    <div className="animate-fade">
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <Link href="/" className="p-2 rounded-xl active:scale-90 transition-transform" style={{ background: 'var(--bg-elevated)' }}>
          <ChevronLeft size={18} style={{ color: 'var(--text)' }} />
        </Link>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-faint)' }}>Apple Health + RENPHO</p>
          <h1 className="text-lg font-black" style={{ color: 'var(--text)' }}>Body Composition</h1>
        </div>
      </div>

      {/* Weight hero */}
      <div className="mx-4 card p-5 mb-4">
        <div className="flex items-end gap-3 mb-2">
          <span className="font-black leading-none" style={{ fontSize: 64, color: '#0A84FF' }}>{lw?.weight ?? '--'}</span>
          <div className="mb-2">
            <span className="text-xl font-bold" style={{ color: 'var(--text-muted)' }}>kg</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-sm font-black" style={{ color: change30 < 0 ? '#30D158' : change30 > 0 ? '#FF9F0A' : 'var(--text-faint)' }}>
                {change30 > 0 ? '+' : ''}{change30.toFixed(1)}kg
              </span>
              <span className="text-xs font-semibold" style={{ color: 'var(--text-faint)' }}>30d</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-1.5 flex-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
            <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, (1 - ((lw?.weight ?? 78) - profile.targetWeight) / 15) * 100))}%`, background: '#30D158' }} />
          </div>
          <span className="text-xs font-bold" style={{ color: '#30D158' }}>{toGo}kg to {profile.targetWeight}kg goal</span>
        </div>
        <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>Source: RENPHO scale → Apple Health sync</p>
      </div>

      {/* BMI Gauge */}
      <div className="mx-4 card p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-faint)' }}>BMI — Asian Scale</p>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `color-mix(in srgb, ${bmiColor} 15%, transparent)`, color: bmiColor }}>{bmiLabel}</span>
        </div>
        <div className="flex items-center justify-around">
          <BMIGauge bmi={bmi} asian />
          <div className="space-y-2 text-xs">
            {[['#0A84FF','Underweight','<18.5'],['#30D158','Normal','18.5–23'],['#FF9F0A','Overweight','23–27.5'],['#FF3B30','Obese','>27.5']].map(([c,l,r]) => (
              <div key={String(l)} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: String(c) }} />
                <span style={{ color: bmiLabel === String(l) ? 'var(--text)' : 'var(--text-muted)' }}>{String(l)}</span>
                <span style={{ color: 'var(--text-faint)' }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 p-2.5 rounded-xl" style={{ background: 'var(--bg-elevated)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Asian BMI thresholds are lower than WHO standard. Cardiovascular risk increases at BMI ≥23. <span style={{ color: 'var(--text-faint)' }}>(WHO Expert Consultation, 2004)</span></p>
        </div>
      </div>

      {/* Body comp metrics grid */}
      <div className="mx-4 mb-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--text-faint)' }}>Body Composition Detail</p>
        <div className="grid grid-cols-2 gap-3">
          {metrics.map(m => (
            <div key={m.label} className="card p-3">
              <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--text-faint)' }}>{m.label}</p>
              <p className="text-xl font-black" style={{ color: m.color }}>{m.val}</p>
              <p className="text-[10px] mt-0.5 font-semibold" style={{ color: 'var(--text-faint)' }}>Target: {m.target}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 30-day trend */}
      <div className="mx-4 card p-4 mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--text-faint)' }}>30-Day Weight Trend</p>
        <WeightChart data={weight} targetWeight={profile.targetWeight} />
      </div>
    </div>
  );
}
