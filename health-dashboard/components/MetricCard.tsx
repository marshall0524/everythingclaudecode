'use client';

import { ReactNode } from 'react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'stable';
  trendGood?: boolean;
  trendValue?: string;
  accentColor?: string;
  icon?: ReactNode;
  badge?: string;
  children?: ReactNode;
  onClick?: () => void;
}

export default function MetricCard({ title, value, unit, subtitle, trend, trendGood, trendValue, accentColor = 'var(--strain)', icon, badge, children, onClick }: Props) {
  const isGood = trend === 'stable' ? null : trend === 'up' ? (trendGood ?? false) : !(trendGood ?? false);

  return (
    <div
      className="card p-4 transition-all active:scale-95 select-none"
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : {}}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-1.5">
          {icon && <span style={{ color: accentColor }}>{icon}</span>}
          <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>{title}</span>
        </div>
        {badge && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `color-mix(in srgb, ${accentColor} 18%, transparent)`, color: accentColor }}>
            {badge}
          </span>
        )}
      </div>

      <div className="flex items-end gap-1.5">
        <span className="text-3xl font-extrabold tracking-tight leading-none" style={{ color: accentColor }}>
          {value}
        </span>
        {unit && <span className="text-sm mb-0.5" style={{ color: 'var(--text-muted)' }}>{unit}</span>}
        {trend && trend !== 'stable' && (
          <div className="mb-0.5 flex items-center gap-0.5 text-xs font-semibold" style={{ color: isGood ? 'var(--recovery)' : 'var(--danger)' }}>
            {trend === 'up' ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {trendValue}
          </div>
        )}
        {trend === 'stable' && <Minus size={13} className="mb-0.5" style={{ color: 'var(--text-faint)' }} />}
      </div>

      {subtitle && <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
      {children}
    </div>
  );
}
