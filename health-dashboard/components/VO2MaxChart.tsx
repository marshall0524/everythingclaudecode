'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import { VO2MaxEntry } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function VO2MaxChart({ data }: { data: VO2MaxEntry[] }) {
  const chartData = data.map(v => ({ date: formatDate(v.date), value: v.value, category: v.category }));
  const tooltipStyle = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 11 };

  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 4, right: 16, left: -24, bottom: 0 }}>
          <XAxis dataKey="date" tick={{ fill: 'var(--text-faint)', fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis domain={[30, 55]} tick={{ fill: 'var(--text-faint)', fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: 'var(--text-muted)' }} itemStyle={{ color: '#0A84FF' }} formatter={(v: number, _n: string, p: { payload?: { category?: string } }) => [`${v} mL/kg/min (${p.payload?.category || ''})`, 'VO2 Max']} />
          {[{ y: 47, label: 'Excellent', c: '#0A84FF' }, { y: 40, label: 'Good', c: '#30D158' }, { y: 34, label: 'Fair', c: '#FF9F0A' }].map(z => (
            <ReferenceLine key={z.label} y={z.y} stroke={z.c} strokeDasharray="5 3" strokeWidth={1} label={{ value: z.label, fill: z.c, fontSize: 9, position: 'right' }} />
          ))}
          <Line type="monotone" dataKey="value" stroke="#0A84FF" strokeWidth={2.5} dot={{ fill: '#0A84FF', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
