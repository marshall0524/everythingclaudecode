'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import { WeightEntry } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function WeightChart({ data, targetWeight = 68 }: { data: WeightEntry[]; targetWeight?: number }) {
  const chartData = data.slice(-30).map(w => ({ date: formatDate(w.date), weight: w.weight, bodyFat: w.bodyFat }));
  const minW = Math.min(...chartData.map(d => d.weight)) - 0.5;
  const maxW = Math.max(...chartData.map(d => d.weight)) + 0.5;

  const tooltipStyle = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 11 };

  return (
    <div className="space-y-4">
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0A84FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fill: 'var(--text-faint)', fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis domain={[minW, maxW]} tick={{ fill: 'var(--text-faint)', fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: 'var(--text-muted)' }} itemStyle={{ color: '#0A84FF' }} formatter={(v: number) => [`${v} kg`, 'Weight']} />
            <ReferenceLine y={targetWeight} stroke="#30D158" strokeDasharray="5 3" strokeWidth={1.5} label={{ value: `Goal ${targetWeight}`, fill: '#30D158', fontSize: 9, position: 'right' }} />
            <Area type="monotone" dataKey="weight" stroke="#0A84FF" strokeWidth={2} fill="url(#wGrad)" dot={false} activeDot={{ r: 4, fill: '#0A84FF' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {chartData.some(d => d.bodyFat) && (
        <div className="h-28">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-faint)' }}>Body Fat %</p>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="fGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF9F0A" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF9F0A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: 'var(--text-faint)', fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: 'var(--text-faint)', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: 'var(--text-muted)' }} itemStyle={{ color: '#FF9F0A' }} formatter={(v: number) => [`${v}%`, 'Body Fat']} />
              <Area type="monotone" dataKey="bodyFat" stroke="#FF9F0A" strokeWidth={2} fill="url(#fGrad)" dot={false} activeDot={{ r: 4, fill: '#FF9F0A' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
