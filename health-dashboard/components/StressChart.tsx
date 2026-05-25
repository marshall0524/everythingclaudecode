'use client';

import { ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import { StressEntry } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function StressChart({ data }: { data: StressEntry[] }) {
  const chartData = data.slice(-14).map(s => ({ date: formatDate(s.date), stress: s.score, hrv: s.hrv }));
  const tooltipStyle = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 11 };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-faint)' }}>Stress Score (lower = better)</p>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="sGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF3B30" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF3B30" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: 'var(--text-faint)', fontSize: 10 }} tickLine={false} axisLine={false} interval={1} />
              <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-faint)', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: 'var(--text-muted)' }} itemStyle={{ color: '#FF3B30' }} formatter={(v: number) => [`${v}`, 'Stress']} />
              <ReferenceLine y={50} stroke="#FF9F0A" strokeDasharray="5 3" strokeWidth={1} />
              <Area type="monotone" dataKey="stress" stroke="#FF3B30" strokeWidth={2} fill="url(#sGrad)" dot={false} activeDot={{ r: 4, fill: '#FF3B30' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-faint)' }}>HRV (ms) — higher = better recovery</p>
        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fill: 'var(--text-faint)', fontSize: 10 }} tickLine={false} axisLine={false} interval={1} />
              <YAxis tick={{ fill: 'var(--text-faint)', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: 'var(--text-muted)' }} itemStyle={{ color: '#BF5AF2' }} formatter={(v: number) => [`${v} ms`, 'HRV']} />
              <Line type="monotone" dataKey="hrv" stroke="#BF5AF2" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#BF5AF2' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
