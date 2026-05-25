'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, Cell } from 'recharts';
import { SleepEntry } from '@/lib/types';
import { formatDate } from '@/lib/utils';

const qColor: Record<string, string> = { poor: '#FF3B30', fair: '#FF9F0A', good: '#30D158', excellent: '#0A84FF' };

export default function SleepChart({ data }: { data: SleepEntry[] }) {
  const chartData = data.slice(-14).map(s => ({
    date: formatDate(s.date),
    deep: s.deepSleep, rem: s.remSleep, light: s.lightSleep,
    quality: s.quality, total: s.totalHours,
  }));

  const tooltipStyle = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 11 };

  return (
    <div className="space-y-4">
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barSize={12}>
            <XAxis dataKey="date" tick={{ fill: 'var(--text-faint)', fontSize: 10 }} tickLine={false} axisLine={false} interval={1} />
            <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tick={{ fill: 'var(--text-faint)', fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: 'var(--text-muted)' }} formatter={(v: number, n: string) => [`${v}h`, n.charAt(0).toUpperCase() + n.slice(1)]} />
            <ReferenceLine y={7.5} stroke="#BF5AF2" strokeDasharray="5 3" strokeWidth={1.5} label={{ value: '7.5h', fill: '#BF5AF2', fontSize: 9, position: 'right' }} />
            <Bar dataKey="deep"  stackId="a" fill="#0A84FF" />
            <Bar dataKey="rem"   stackId="a" fill="#BF5AF2" />
            <Bar dataKey="light" stackId="a" radius={[3, 3, 0, 0]}>
              {chartData.map((e, i) => <Cell key={i} fill={qColor[e.quality]} opacity={0.65} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-4 flex-wrap">
        {[['#0A84FF','Deep'],['#BF5AF2','REM'],['#8E8E93','Light']].map(([c,l]) => (
          <div key={l} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
