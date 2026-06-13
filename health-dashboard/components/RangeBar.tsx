'use client';

export interface RangeSegment {
  min: number;
  max: number;
  color: string;
}

interface Props {
  value: number;
  displayMin: number;
  displayMax: number;
  segments: RangeSegment[];
}

function getActiveColor(value: number, segments: RangeSegment[]): string {
  for (let i = segments.length - 1; i >= 0; i--) {
    if (value >= segments[i].min) return segments[i].color;
  }
  return segments[0].color;
}

export default function RangeBar({ value, displayMin, displayMax, segments }: Props) {
  const total = displayMax - displayMin;
  const clamped = Math.min(Math.max(value, displayMin), displayMax);
  const pct = ((clamped - displayMin) / total) * 100;
  const activeColor = getActiveColor(value, segments);

  return (
    <div style={{ position: 'relative', paddingTop: 6, paddingBottom: 6 }}>
      <div style={{ display: 'flex', height: 8, borderRadius: 999, overflow: 'hidden', gap: 2 }}>
        {segments.map((seg, i) => {
          const sMin = Math.max(seg.min, displayMin);
          const sMax = Math.min(seg.max, displayMax);
          if (sMax <= sMin) return null;
          return (
            <div
              key={i}
              style={{
                flexShrink: 0,
                width: `${((sMax - sMin) / total) * 100}%`,
                background: seg.color,
                opacity: 0.38,
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          left: `${pct}%`,
          top: '50%',
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: activeColor,
          border: '2.5px solid #fff',
          boxShadow: '0 1px 6px rgba(0,0,0,0.22)',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
        }}
      />
    </div>
  );
}
