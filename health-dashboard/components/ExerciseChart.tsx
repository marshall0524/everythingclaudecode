'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { ExerciseEntry } from '@/lib/types';
import { formatDate } from '@/lib/utils';

const typeColor: Record<string, string> = {
  Running: '#FF9F0A', Cycling: '#0A84FF', 'Strength Training': '#BF5AF2',
  Yoga: '#30D158', Walking: '#8E8E93', Swimming: '#00C7BE', HIIT: '#FF3B30',
};

export default function ExerciseChart({ data }: { data: ExerciseEntry[] }) {
  const chartData = data.slice(-14).map(e => ({
    date: formatDate(e.date), duration: e.duration, type: e.type,
    color: typeColor[e.type] || '#8E8E93',
  }));
  const types = [...new Set(data.slice(-14).map(e => e.type))];
  const tooltipStyle = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 11 };

  return (
    <div className="space-y-4">
      <div className="h-40">
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-faint)' }}>Duration (min)</p>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barSize={14}>
            <XAxis dataKey="date" tick={{ fill: 'var(--text-faint)', fontSize: 10 }} tickLine={false} axisLine={false} interval={1} />
            <YAxis tick={{ fill: 'var(--text-faint)', fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: 'var(--text-muted)' }} formatter={(v: number, _n: string, p: { payload?: { type?: string } }) => [`${v} min — ${p.payload?.type || ''}`, 'Duration']} />
            <Bar dataKey="duration" radius={[4, 4, 0, 0]} fill="#FF9F0A" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-2 flex-wrap">
        {types.map(t => (
          <span key={t} className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: `color-mix(in srgb, ${typeColor[t] || '#8E8E93'} 18%, var(--bg-elevated))`, color: typeColor[t] || '#8E8E93' }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
