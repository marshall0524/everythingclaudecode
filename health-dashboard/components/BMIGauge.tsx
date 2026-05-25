'use client';

export default function BMIGauge({ bmi, asian = true }: { bmi: number; asian?: boolean }) {
  const cats = asian
    ? [['#0A84FF', 18.5], ['#30D158', 23], ['#FF9F0A', 27.5], ['#FF3B30', 40]] as [string, number][]
    : [['#0A84FF', 18.5], ['#30D158', 25], ['#FF9F0A', 30], ['#FF3B30', 45]] as [string, number][];

  const min = 14; const max = cats[cats.length - 1][1] as number;
  const pct = Math.min(Math.max((bmi - min) / (max - min), 0), 1);
  const angle = -140 + pct * 280;

  const cx = 80; const cy = 80; const r = 60;
  const toRad = (d: number) => ((d - 90) * Math.PI) / 180;
  const px = (a: number) => cx + r * Math.cos(toRad(a));
  const py = (a: number) => cy + r * Math.sin(toRad(a));

  let prev = -140;
  const arcs = cats.map(([color, catMax]) => {
    const end = Math.min(-140 + ((catMax as number - min) / (max - min)) * 280, 140);
    const d = `M ${px(prev)} ${py(prev)} A ${r} ${r} 0 ${end - prev > 180 ? 1 : 0} 1 ${px(end)} ${py(end)}`;
    const arc = <path key={String(color)} d={d} fill="none" stroke={String(color)} strokeWidth={11} strokeLinecap="round" opacity={0.8} />;
    prev = end;
    return arc;
  });

  const activeColor = cats.find(([, m]) => bmi < (m as number))?.[0] as string ?? '#FF3B30';

  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="108" viewBox="0 0 160 108">
        {/* Track */}
        <path d={`M ${px(-140)} ${py(-140)} A ${r} ${r} 0 1 1 ${px(140)} ${py(140)}`} fill="none" stroke="var(--bg-elevated)" strokeWidth={11} strokeLinecap="round" />
        {arcs}
        {/* Needle */}
        <line x1={cx} y1={cy} x2={cx + (r - 8) * Math.cos(toRad(angle))} y2={cy + (r - 8) * Math.sin(toRad(angle))} stroke="var(--text)" strokeWidth={2} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={3.5} fill="var(--text)" />
        {/* Labels */}
        <text x={cx} y={cy + 20} textAnchor="middle" fontSize={20} fontWeight="800" fill={activeColor} fontFamily="system-ui">{bmi}</text>
      </svg>
    </div>
  );
}
