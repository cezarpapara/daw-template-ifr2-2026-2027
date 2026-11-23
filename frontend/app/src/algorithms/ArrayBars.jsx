import { ROLE_COLORS, roleOf } from './utils.js'

// Deseneaza un vector ca bare verticale: inaltimea barei = valoarea elementului.
// "highlight" spune ce pozitii se coloreaza, de exemplu { compare: [2, 3], sorted: [7, 8] }
function ArrayBars({ values, highlight = {} }) {
  if (!values || values.length === 0) {
    return null
  }

  const max = Math.max(...values.map((value) => Math.abs(value)), 1)
  const showLabels = values.length <= 40

  return (
    <div className="bars" role="img" aria-label="Vectorul desenat ca bare">
      {values.map((value, index) => {
        const role = roleOf(index, highlight)
        return (
          <div key={index} className="bar-column">
            {showLabels && <span className="bar-value">{value}</span>}
            <div
              className="bar"
              style={{
                height: `${Math.max(4, (Math.abs(value) / max) * 100)}%`,
                background: ROLE_COLORS[role],
              }}
              title={`a[${index}] = ${value}`}
            />
            {showLabels && <span className="bar-index">{index}</span>}
          </div>
        )
      })}
    </div>
  )
}

export function Legend({ roles }) {
  const labels = {
    compare: 'comparate',
    swap: 'interschimbate',
    write: 'scrise',
    pivot: 'pivot',
    range: 'secventa curenta',
    found: 'gasit',
    sorted: 'la locul lor',
  }
  return (
    <div className="legend">
      {roles.map((role) => (
        <span key={role}>
          <i style={{ background: ROLE_COLORS[role] }} /> {labels[role]}
        </span>
      ))}
    </div>
  )
}

export default ArrayBars
