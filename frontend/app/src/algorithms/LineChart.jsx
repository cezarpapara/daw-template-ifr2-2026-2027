import { formatNumber } from './utils.js'

const SERIES_COLORS = ['#2f5fd0', '#e12d39', '#3ebd93', '#f0b429', '#9446ed', '#00a3c4', '#d9822b', '#52606d']

// Grafic simplu cu linii, desenat direct in SVG (fara biblioteci externe).
// series = [{ name, points: [{ x, y }] }]
function LineChart({ series, xLabel, yLabel, height = 320 }) {
  const width = 760
  const pad = { left: 80, right: 20, top: 16, bottom: 48 }

  const all = series.flatMap((s) => s.points)
  if (all.length === 0) {
    return null
  }

  const maxX = Math.max(...all.map((p) => p.x))
  const maxY = Math.max(...all.map((p) => p.y), 1)

  // transforma valorile in coordonate pe ecran (y creste in sus)
  const sx = (x) => pad.left + (x / maxX) * (width - pad.left - pad.right)
  const sy = (y) => height - pad.bottom - (y / maxY) * (height - pad.top - pad.bottom)

  const ticks = [0, 0.25, 0.5, 0.75, 1]

  return (
    <div className="chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${yLabel} in functie de ${xLabel}`}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.left} x2={width - pad.right} y1={sy(t * maxY)} y2={sy(t * maxY)} stroke="#e4e7eb" />
            <text x={pad.left - 8} y={sy(t * maxY) + 4} textAnchor="end" fontSize="12" fill="#52606d">
              {formatNumber(Math.round(t * maxY))}
            </text>
            <text x={sx(t * maxX)} y={height - pad.bottom + 18} textAnchor="middle" fontSize="12" fill="#52606d">
              {formatNumber(Math.round(t * maxX))}
            </text>
          </g>
        ))}
        <line x1={pad.left} x2={width - pad.right} y1={sy(0)} y2={sy(0)} stroke="#52606d" />
        <line x1={pad.left} x2={pad.left} y1={pad.top} y2={sy(0)} stroke="#52606d" />
        <text x={(width + pad.left) / 2} y={height - 8} textAnchor="middle" fontSize="13" fill="#1f2933">{xLabel}</text>

        {series.map((s, i) => (
          <g key={s.name}>
            <polyline
              fill="none"
              stroke={s.color ?? SERIES_COLORS[i % SERIES_COLORS.length]}
              strokeWidth="2.5"
              strokeDasharray={s.dashed ? '6 5' : undefined}
              points={s.points.map((p) => `${sx(p.x)},${sy(p.y)}`).join(' ')}
            />
            {!s.dashed && s.points.map((p) => (
              <circle key={p.x} cx={sx(p.x)} cy={sy(p.y)} r="3.5" fill={s.color ?? SERIES_COLORS[i % SERIES_COLORS.length]}>
                <title>{`${s.name}: n = ${p.x}, ${formatNumber(Math.round(p.y))}`}</title>
              </circle>
            ))}
          </g>
        ))}
      </svg>
      <div className="legend">
        <span className="muted">{yLabel}:</span>
        {series.map((s, i) => (
          <span key={s.name}>
            <i style={{ background: s.color ?? SERIES_COLORS[i % SERIES_COLORS.length] }} /> {s.name}
          </span>
        ))}
      </div>
    </div>
  )
}

export default LineChart
