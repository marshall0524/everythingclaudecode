'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { ExerciseEntry } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface Props {
  data: ExerciseEntry[];
}

const typeColors: Record<string, string> = {
  Running: '#f59e0b',
  Cycling: '#3b82f6',
  'Strength Training': '#8b5cf6',
  Yoga: '#22c55e',
  Walking: '#6b7280',
  Swimming: '#0ea5e9',
  HIIT: '#ef4444',
};

export default function ExerciseChart({ data }: Props) {
  const recent = data.slice(-14);
  const chartData = recent.map((e) => ({
    date: formatDate(e.date),
    duration: e.duration,
    calories: e.activeCalories,
    type: e.type,
    color: typeColors[e.type] || '#6b7280',
  }));

  const weeklyTypes = recent.reduce<Record<string, number>>((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="h-40">
        <p className="text-xs text-gray-500 mb-1 ml-1">Duration (min)</p>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={16}>
            <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} interval={1} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '12px', fontSize: 12 }}
              labelStyle={{ color: '#9ca3af' }}
              formatter={(v: number, _name: string, props: { payload?: { type?: string } }) => [
                `${v} min — ${props.payload?.type || ''}`,
                'Duration',
              ]}
            />
            <Bar dataKey="duration" radius={[4, 4, 0, 0]} fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-2 flex-wrap">
        {Object.entries(weeklyTypes).map(([type, count]) => (
          <span
            key={type}
            className="text-[11px] font-medium px-2 py-1 rounded-full"
            style={{ background: `${typeColors[type] || '#6b7280'}22`, color: typeColors[type] || '#9ca3af' }}
          >
            {type} ×{count}
          </span>
        ))}
      </div>
    </div>
  );
}
