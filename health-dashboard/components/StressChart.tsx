'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Area, AreaChart, ReferenceLine } from 'recharts';
import { StressEntry } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface Props {
  data: StressEntry[];
}

export default function StressChart({ data }: Props) {
  const chartData = data.slice(-14).map((s) => ({
    date: formatDate(s.date),
    stress: s.score,
    hrv: s.hrv,
    rhr: s.restingHeartRate,
  }));

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-gray-500 mb-1 ml-1">Stress Score (lower = better)</p>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} interval={1} />
              <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '12px', fontSize: 12 }} labelStyle={{ color: '#9ca3af' }} itemStyle={{ color: '#ef4444' }} formatter={(v: number) => [`${v}`, 'Stress']} />
              <ReferenceLine y={50} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={1} />
              <Area type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={2} fill="url(#stressGrad)" dot={false} activeDot={{ r: 4, fill: '#ef4444' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-1 ml-1">HRV (ms) — higher = better recovery</p>
        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} interval={1} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '12px', fontSize: 12 }} labelStyle={{ color: '#9ca3af' }} itemStyle={{ color: '#8b5cf6' }} formatter={(v: number) => [`${v} ms`, 'HRV']} />
              <Line type="monotone" dataKey="hrv" stroke="#8b5cf6" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#8b5cf6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
