'use client';

interface Props {
  score: number;       // 0–100
  label: string;       // e.g. "RECOVERY"
  sublabel?: string;   // e.g. "OPTIMAL"
  color: string;
  size?: number;
  strokeWidth?: number;
}

function arcD(cx: number, cy: number, r: number, pct: number) {
  const clamp = Math.min(pct, 0.9999);
  const angle = clamp * 360;
  const toRad = (d: number) => ((d - 90) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toRad(0));
  const y1 = cy + r * Math.sin(toRad(0));
  const x2 = cx + r * Math.cos(toRad(angle));
  const y2 = cy + r * Math.sin(toRad(angle));
  return `M ${x1} ${y1} A ${r} ${r} 0 ${angle > 180 ? 1 : 0} 1 ${x2} ${y2}`;
}

export default function RecoveryRing({ score, label, sublabel, color, size = 260, strokeWidth = 20 }: Props) {
  const cx = size / 2; const cy = size / 2; const r = (size - strokeWidth * 2) / 2;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: 'absolute', top: 0, left: 0 }}>
        {/* Background track */}
        <circle cx={cx} cy={cy} r={r} fill="none" strokeWidth={strokeWidth} stroke="var(--bg-elevated)" />
        {/* Score arc */}
        <path
          d={arcD(cx, cy, r, score / 100)}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${color}66)` }}
        />
      </svg>
      {/* Center text */}
      <div className="flex flex-col items-center gap-0.5 z-10">
        <span className="font-black tracking-tight leading-none" style={{ fontSize: size * 0.22, color }}>{score}%</span>
        <span className="font-black tracking-[0.2em] uppercase" style={{ fontSize: size * 0.055, color: 'var(--text-muted)' }}>{label}</span>
        {sublabel && <span className="font-bold tracking-[0.15em] uppercase" style={{ fontSize: size * 0.045, color }}>{sublabel}</span>}
      </div>
    </div>
  );
}
