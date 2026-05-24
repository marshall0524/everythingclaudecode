'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import { VO2MaxEntry } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface Props {
  data: VO2MaxEntry[];
}

export default function VO2MaxChart({ data }: Props) {
  const chartData = data.map((v) => ({
    date: formatDate(v.date),
    value: v.value,
    category: v.category,
  }));

  const zones = [
    { y: 47, label: 'Excellent', color: '#3b82f6' },
    { y: 40, label: 'Good', color: '#22c55e' },
    { y: 34, label: 'Fair', color: '#f59e0b' },
  ];

  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis domain={[30, 55]} tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '12px', fontSize: 12 }}
            labelStyle={{ color: '#9ca3af' }}
            itemStyle={{ color: '#0ea5e9' }}
            formatter={(v: number, _name: string, props: { payload?: { category?: string } }) => [`${v} mL/kg/min (${props.payload?.category || ''})`, 'VO2 Max']}
          />
          {zones.map((z) => (
            <ReferenceLine key={z.label} y={z.y} stroke={z.color} strokeDasharray="4 4" strokeWidth={1} label={{ value: z.label, fill: z.color, fontSize: 9, position: 'right' }} />
          ))}
          <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2.5} dot={{ fill: '#0ea5e9', r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
