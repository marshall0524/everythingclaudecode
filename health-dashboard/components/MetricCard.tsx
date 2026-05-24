'use client';

import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'stable';
  trendPositive?: boolean; // whether "up" is good
  trendValue?: string;
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'pink';
  icon?: ReactNode;
  badge?: string;
  badgeColor?: string;
  children?: ReactNode;
  onClick?: () => void;
}

const colorMap = {
  blue: { bg: 'from-blue-950/60 to-blue-900/30', border: 'border-blue-800/40', icon: 'text-blue-400', value: 'text-blue-300' },
  green: { bg: 'from-green-950/60 to-green-900/30', border: 'border-green-800/40', icon: 'text-green-400', value: 'text-green-300' },
  amber: { bg: 'from-amber-950/60 to-amber-900/30', border: 'border-amber-800/40', icon: 'text-amber-400', value: 'text-amber-300' },
  red: { bg: 'from-red-950/60 to-red-900/30', border: 'border-red-800/40', icon: 'text-red-400', value: 'text-red-300' },
  purple: { bg: 'from-purple-950/60 to-purple-900/30', border: 'border-purple-800/40', icon: 'text-purple-400', value: 'text-purple-300' },
  pink: { bg: 'from-pink-950/60 to-pink-900/30', border: 'border-pink-800/40', icon: 'text-pink-400', value: 'text-pink-300' },
};

export default function MetricCard({
  title, value, unit, subtitle, trend, trendPositive = false, trendValue,
  color = 'blue', icon, badge, badgeColor, children, onClick,
}: MetricCardProps) {
  const c = colorMap[color];
  const isGoodTrend = trend === 'stable' ? null : (trend === 'up') === trendPositive;

  return (
    <div
      className={cn(
        'relative rounded-2xl border bg-gradient-to-br p-4 transition-all',
        c.bg, c.border,
        onClick && 'cursor-pointer active:scale-95'
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon && <div className={cn('flex-shrink-0', c.icon)}>{icon}</div>}
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{title}</span>
        </div>
        {badge && (
          <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', badgeColor || 'bg-gray-700 text-gray-300')}>
            {badge}
          </span>
        )}
      </div>

      <div className="flex items-end gap-1.5 mb-1">
        <span className={cn('text-2xl font-bold tracking-tight', c.value)}>{value}</span>
        {unit && <span className="text-sm text-gray-400 mb-0.5">{unit}</span>}
        {trend && trend !== 'stable' && (
          <div className={cn('flex items-center gap-0.5 mb-0.5 text-xs font-medium', isGoodTrend === true ? 'text-green-400' : isGoodTrend === false ? 'text-red-400' : 'text-gray-400')}>
            {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {trendValue && <span>{trendValue}</span>}
          </div>
        )}
        {trend === 'stable' && (
          <div className="flex items-center gap-0.5 mb-0.5 text-xs text-gray-400">
            <Minus size={14} />
          </div>
        )}
      </div>

      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      {children}
    </div>
  );
}
