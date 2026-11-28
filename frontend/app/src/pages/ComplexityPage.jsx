import { useEffect, useState } from 'react'
import { api } from '../api.js'
import LineChart from '../algorithms/LineChart.jsx'
import { formatNumber, parseNumbers } from '../algorithms/utils.js'

const ORDERS = {
  random: 'aleator',
  sorted: 'deja sortat',
  reversed: 'sortat invers',
  nearly: 'aproape sortat',
  'few-unique': 'multe duplicate',
}

// Pagina Complexitate: masuram metodele pe vectori din ce in ce mai mari si desenam graficul
function ComplexityPage() {
  const [methods, setMethods] = useState([])
  const [selected, setSelected] = useState([])
  const [sizesText, setSizesText] = useState('250, 500, 1000, 2000, 4000')
  const [order, setOrder] = useState('random')
  const [metric, setMetric] = useState('comparisons')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.getSortMethods()
      .then((list) => {
        setMethods(list)
        setSelected(list.map((m) => m.key))
      })
      .catch((err) => setError(err.message))
  }, [])

  function toggle(key) {
    setSelected(selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key])
  }

  // POST /api/algorithms/sort/benchmark
  async function handleRun(event) {
    event.preventDefault()
    setLoading(true)
    try {
      const sizes = parseNumbers(sizesText).map(Math.round)
      const result = await api.runBenchmark({ methods: selected, sizes, order, repeat: 3 })
      setData(result)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const labels = { comparisons: 'Comparatii', assignments: 'Atribuiri', timeMs: 'Timp (ms)' }

  const series = data
    ? data.results.map((r) => ({
        name: r.name,
        points: r.points.filter((p) => !p.skipped).map((p) => ({ x: p.n, y: p[metric] })),
      }))
    : []

  return (
    <>
      <h1>Complexitate</h1>
      <p className="subtitle">
        Teoria spune cum creste numarul de operatii cand n creste. Aici o verificam pe date reale.
      </p>

      {error && <div className="status status-error">{error}</div>}

      <section className="card">
        <form onSubmit={handleRun}>
          <div className="checkboxes">
            {methods.map((m) => (
              <label key={m.key}>
                <input type="checkbox" checked={selected.includes(m.key)} onChange={() => toggle(m.key)} /> {m.name}
              </label>
            ))}
          </div>
          <div className="form">
            <label>
              Dimensiuni n{' '}
              <input value={sizesText} onChange={(event) => setSizesText(event.target.value)} />
            </label>
            <label>
              Datele{' '}
              <select value={order} onChange={(event) => setOrder(event.target.value)}>
                {Object.entries(ORDERS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </label>
            <button type="submit" disabled={loading || selected.length === 0}>
              {loading ? 'Se masoara...' : 'Masoara'}
            </button>
          </div>
        </form>
      </section>

      {data && (
        <section className="card">
          <div className="form">
            {Object.entries(labels).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={metric === key ? '' : 'button-secondary'}
                onClick={() => setMetric(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <LineChart series={series} xLabel="n (numarul de elemente)" yLabel={labels[metric]} />

          <h2>Valorile masurate</h2>
          <p className="muted">
            Coloana „/ n²” imparte numarul de comparatii la n². Daca valoarea ramane aproape constanta cand n creste,
            algoritmul este patratic; daca scade spre 0, creste mai incet decat n² (de exemplu n log n).
          </p>
          <div className="table-scroll">
          <table>
            <thead>
              <tr><th>Metoda</th><th>n</th><th>Comparatii</th><th>/ n²</th><th>/ (n log₂ n)</th><th>Timp (ms)</th></tr>
            </thead>
            <tbody>
              {data.results.flatMap((r) =>
                r.points.map((p) => (
                  <tr key={`${r.method}-${p.n}`}>
                    <td>{r.name}</td>
                    <td>{formatNumber(p.n)}</td>
                    {p.skipped ? (
                      <td colSpan="4" className="muted">sarit: dimensiunea anterioara a durat prea mult</td>
                    ) : (
                      <>
                        <td>{formatNumber(p.comparisons)}</td>
                        <td>{(p.comparisons / (p.n * p.n)).toFixed(3)}</td>
                        <td>{p.n > 1 ? (p.comparisons / (p.n * Math.log2(p.n))).toFixed(3) : '-'}</td>
                        <td>{p.timeMs}</td>
                      </>
                    )}
                  </tr>
                )),
              )}
            </tbody>
          </table>
          </div>
        </section>
      )}
    </>
  )
}

export default ComplexityPage
