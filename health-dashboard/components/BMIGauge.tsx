'use client';

interface Props {
  bmi: number;
  asian?: boolean;
}

export default function BMIGauge({ bmi, asian = true }: Props) {
  const categories = asian
    ? [
        { label: 'Under', max: 18.5, color: '#3b82f6' },
        { label: 'Normal', max: 23, color: '#22c55e' },
        { label: 'Over', max: 27.5, color: '#f59e0b' },
        { label: 'Obese', max: 35, color: '#ef4444' },
      ]
    : [
        { label: 'Under', max: 18.5, color: '#3b82f6' },
        { label: 'Normal', max: 25, color: '#22c55e' },
        { label: 'Over', max: 30, color: '#f59e0b' },
        { label: 'Obese', max: 40, color: '#ef4444' },
      ];

  const minBMI = 14;
  const maxBMI = asian ? 35 : 40;
  const range = maxBMI - minBMI;

  const getCategory = () => {
    for (const c of categories) {
      if (bmi < c.max) return c;
    }
    return categories[categories.length - 1];
  };

  const category = getCategory();
  const pct = Math.min(Math.max((bmi - minBMI) / range, 0), 1);
  const angle = -140 + pct * 280;

  const r = 60;
  const cx = 80;
  const cy = 80;

  const arcPath = (startAngle: number, endAngle: number, color: string, strokeWidth = 12) => {
    const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(startAngle));
    const y1 = cy + r * Math.sin(toRad(startAngle));
    const x2 = cx + r * Math.cos(toRad(endAngle));
    const y2 = cy + r * Math.sin(toRad(endAngle));
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return (
      <path
        key={color}
        d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={0.85}
      />
    );
  };

  const totalRange = maxBMI - minBMI;
  let prevAngle = -140;
  const arcs = categories.map((cat) => {
    const catRange = cat.max - minBMI;
    const endAngle = -140 + (catRange / totalRange) * 280;
    const arc = arcPath(prevAngle, Math.min(endAngle, 140), cat.color);
    prevAngle = endAngle;
    return arc;
  });

  const needleX = cx + (r - 6) * Math.cos(((angle - 90) * Math.PI) / 180);
  const needleY = cy + (r - 6) * Math.sin(((angle - 90) * Math.PI) / 180);

  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="110" viewBox="0 0 160 110">
        {/* Background track */}
        {arcPath(-140, 140, '#1f2937', 12)}
        {/* Colored arcs */}
        {arcs}
        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke="white"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={4} fill="white" />
        {/* BMI value */}
        <text x={cx} y={cy + 22} textAnchor="middle" fill="white" fontSize={18} fontWeight="bold">
          {bmi}
        </text>
        <text x={cx} y={cy + 36} textAnchor="middle" fill={category.color} fontSize={10} fontWeight="600">
          {category.label}
        </text>
      </svg>
      <p className="text-xs text-gray-500 mt-1">{asian ? 'Asian BMI scale' : 'WHO BMI scale'}</p>
    </div>
  );
}
