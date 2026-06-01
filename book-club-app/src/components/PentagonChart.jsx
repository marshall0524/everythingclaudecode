import { useEffect, useRef, useState } from 'react'

const TRAITS = [
  { key: 'literary',   label: 'Literary'   },
  { key: 'adventure',  label: 'Adventure'  },
  { key: 'mystery',    label: 'Mystery'    },
  { key: 'romance',    label: 'Romance'    },
  { key: 'nonfiction', label: 'Non-fiction'},
]

function getPoints(cx, cy, r, startAngleDeg = -90) {
  return TRAITS.map((_, i) => {
    const angle = ((startAngleDeg + i * 72) * Math.PI) / 180
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)]
  })
}

function pointsToStr(pts) {
  return pts.map(([x, y]) => `${x},${y}`).join(' ')
}

export default function PentagonChart({ data, size = 200 }) {
  const [animated, setAnimated] = useState(false)
  const cx = size / 2
  const cy = size / 2
  const maxR = size * 0.38
  const labelR = size * 0.5

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(t)
  }, [])

  const levels = [0.25, 0.5, 0.75, 1]

  const dataPoints = TRAITS.map((t, i) => {
    const angle = ((-90 + i * 72) * Math.PI) / 180
    const r = ((data[t.key] || 0) / 100) * maxR * (animated ? 1 : 0)
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)]
  })

  const labelPoints = getPoints(cx, cy, labelR)

  const labelOffsets = (i) => {
    const angle = -90 + i * 72
    const x = angle > -10 && angle < 190 ? 0 : angle > 170 ? -5 : 0
    if (angle < -45 || angle > 225) return { textAnchor: 'middle', dy: -8 }
    if (angle > 45 && angle < 135) return { textAnchor: 'middle', dy: 14 }
    if (angle >= 135 && angle <= 225) return { textAnchor: 'end', dy: 4 }
    return { textAnchor: 'start', dy: 4 }
  }

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ overflow: 'visible' }}>
        {levels.map((lvl) => {
          const pts = getPoints(cx, cy, maxR * lvl)
          return (
            <polygon
              key={lvl}
              points={pointsToStr(pts)}
              fill="none"
              stroke="var(--border-2)"
              strokeWidth={1}
            />
          )
        })}

        {getPoints(cx, cy, maxR).map(([x, y], i) => (
          <line
            key={i}
            x1={cx} y1={cy}
            x2={x} y2={y}
            stroke="var(--border-2)"
            strokeWidth={1}
          />
        ))}

        <polygon
          points={pointsToStr(dataPoints)}
          fill="rgba(116,97,239,0.18)"
          stroke="var(--purple)"
          strokeWidth={2}
          style={{ transition: 'all 0.8s ease' }}
        />

        {dataPoints.map(([x, y], i) => (
          <circle
            key={i}
            cx={x} cy={y} r={4}
            fill="var(--purple)"
            stroke="white"
            strokeWidth={2}
            style={{ transition: 'all 0.8s ease' }}
          />
        ))}

        {labelPoints.map(([x, y], i) => {
          const offs = labelOffsets(i)
          return (
            <text
              key={i}
              x={x} y={y}
              textAnchor={offs.textAnchor}
              dy={offs.dy}
              fontSize={11}
              fontWeight={600}
              fill="var(--text-2)"
              fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            >
              {TRAITS[i].label}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
