'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, Area, AreaChart } from 'recharts';
import { WeightEntry } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface Props {
  data: WeightEntry[];
  targetWeight?: number;
}

export default function WeightChart({ data, targetWeight = 68 }: Props) {
  const chartData = data.slice(-30).map((w) => ({
    date: formatDate(w.date),
    weight: w.weight,
    bmi: w.bmi,
    bodyFat: w.bodyFat,
  }));

  const minW = Math.min(...chartData.map((d) => d.weight)) - 1;
  const maxW = Math.max(...chartData.map((d) => d.weight)) + 1;

  return (
    <div className="space-y-4">
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis domain={[minW, maxW]} tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}`} />
            <Tooltip
              contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '12px', fontSize: 12 }}
              labelStyle={{ color: '#9ca3af' }}
              itemStyle={{ color: '#38bdf8' }}
              formatter={(v: number) => [`${v} kg`, 'Weight']}
            />
            <ReferenceLine y={targetWeight} stroke="#22c55e" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: `Goal ${targetWeight}`, fill: '#22c55e', fontSize: 10, position: 'right' }} />
            <Area type="monotone" dataKey="weight" stroke="#38bdf8" strokeWidth={2} fill="url(#weightGrad)" dot={false} activeDot={{ r: 4, fill: '#38bdf8' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {chartData.some((d) => d.bodyFat) && (
        <div className="h-32">
          <p className="text-xs text-gray-500 mb-1 ml-1">Body Fat %</p>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="fatGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '12px', fontSize: 12 }} labelStyle={{ color: '#9ca3af' }} itemStyle={{ color: '#f59e0b' }} formatter={(v: number) => [`${v}%`, 'Body Fat']} />
              <Area type="monotone" dataKey="bodyFat" stroke="#f59e0b" strokeWidth={2} fill="url(#fatGrad)" dot={false} activeDot={{ r: 4, fill: '#f59e0b' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
