'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ReferenceLine } from 'recharts';
import { SleepEntry } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface Props {
  data: SleepEntry[];
}

const qualityColors: Record<string, string> = {
  poor: '#ef4444',
  fair: '#f59e0b',
  good: '#22c55e',
  excellent: '#3b82f6',
};

export default function SleepChart({ data }: Props) {
  const chartData = data.slice(-14).map((s) => ({
    date: formatDate(s.date),
    total: parseFloat(s.totalHours.toFixed(1)),
    deep: s.deepSleep,
    rem: s.remSleep,
    light: s.lightSleep,
    quality: s.quality,
  }));

  return (
    <div className="space-y-4">
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={14}>
            <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} interval={1} />
            <YAxis domain={[0, 10]} tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} ticks={[0, 2, 4, 6, 8, 10]} />
            <Tooltip
              contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '12px', fontSize: 12 }}
              labelStyle={{ color: '#9ca3af' }}
              formatter={(v: number, name: string) => [`${v}h`, name.charAt(0).toUpperCase() + name.slice(1)]}
            />
            <ReferenceLine y={7} stroke="#8b5cf6" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: '7h target', fill: '#8b5cf6', fontSize: 10, position: 'right' }} />
            <Bar dataKey="deep" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
            <Bar dataKey="rem" stackId="a" fill="#8b5cf6" />
            <Bar dataKey="light" stackId="a" fill="#6b7280" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={qualityColors[entry.quality]} opacity={0.7} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-3 flex-wrap">
        {[{ label: 'Deep', color: '#3b82f6' }, { label: 'REM', color: '#8b5cf6' }, { label: 'Light', color: '#6b7280' }].map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
            <span className="text-xs text-gray-400">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
