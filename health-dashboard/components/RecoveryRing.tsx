'use client';

interface Props {
  recovery: number;   // 0–100
  sleep: number;      // 0–100
  hrv: number;
  rhr: number;
}

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, pct: number) {
  const end = Math.min(pct, 0.9999);
  const angle = end * 360;
  const p1 = polarToXY(cx, cy, r, 0);
  const p2 = polarToXY(cx, cy, r, angle);
  const large = angle > 180 ? 1 : 0;
  return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y}`;
}

function recoveryColor(score: number): string {
  if (score >= 67) return '#30D158';
  if (score >= 34) return '#FF9F0A';
  return '#FF3B30';
}

function recoveryLabel(score: number): string {
  if (score >= 67) return 'Optimal';
  if (score >= 34) return 'Moderate';
  return 'Low';
}

export default function RecoveryRing({ recovery, sleep, hrv, rhr }: Props) {
  const cx = 100; const cy = 100;
  const outerR = 80; const innerR = 64;
  const sw = 14;

  const rColor = recoveryColor(recovery);
  const sColor = '#BF5AF2';

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="200" viewBox="0 0 200 200">
        {/* Outer track */}
        <circle cx={cx} cy={cy} r={outerR} fill="none" className="ring-track" strokeWidth={sw} />
        {/* Outer arc — recovery */}
        <path
          d={arcPath(cx, cy, outerR, recovery / 100)}
          fill="none"
          stroke={rColor}
          strokeWidth={sw}
          strokeLinecap="round"
        />
        {/* Inner track */}
        <circle cx={cx} cy={cy} r={innerR} fill="none" className="ring-track" strokeWidth={sw} />
        {/* Inner arc — sleep */}
        <path
          d={arcPath(cx, cy, innerR, sleep / 100)}
          fill="none"
          stroke={sColor}
          strokeWidth={sw}
          strokeLinecap="round"
        />
        {/* Center text */}
        <text x={cx} y={cy - 12} textAnchor="middle" fontSize={36} fontWeight="800" fill={rColor} fontFamily="system-ui">
          {recovery}
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize={11} fontWeight="700" fill={rColor} fontFamily="system-ui" letterSpacing="2">
          {recoveryLabel(recovery).toUpperCase()}
        </text>
        <text x={cx} y={cy + 24} textAnchor="middle" fontSize={9} fill="#8E8E93" fontFamily="system-ui">
          RECOVERY SCORE
        </text>
      </svg>

      {/* Legend */}
      <div className="flex gap-5 -mt-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: rColor }} />
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Recovery</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: sColor }} />
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Sleep</span>
        </div>
      </div>

      {/* HRV + RHR row */}
      <div className="flex gap-6 mt-4">
        <div className="text-center">
          <p className="text-xl font-bold" style={{ color: 'var(--text)' }}>{hrv}<span className="text-xs font-normal ml-0.5" style={{ color: 'var(--text-muted)' }}>ms</span></p>
          <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>HRV</p>
        </div>
        <div className="w-px" style={{ background: 'var(--border)' }} />
        <div className="text-center">
          <p className="text-xl font-bold" style={{ color: 'var(--text)' }}>{rhr}<span className="text-xs font-normal ml-0.5" style={{ color: 'var(--text-muted)' }}>bpm</span></p>
          <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>Resting HR</p>
        </div>
      </div>
    </div>
  );
}
