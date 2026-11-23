import { useEffect, useState } from 'react'
import { api } from '../api.js'
import StepPlayer from '../algorithms/StepPlayer.jsx'
import { formatNumber, parseNumbers, randomArray } from '../algorithms/utils.js'

// Pagina Sortare: alegem metoda, dam un vector, vedem rezultatul si pasii
function SortingPage() {
  const [methods, setMethods] = useState([])
  const [method, setMethod] = useState('')
  const [text, setText] = useState('38, 27, 43, 3, 9, 82, 10, 3')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [runId, setRunId] = useState(0) // creste la fiecare rulare: resetam animatia
  const [loading, setLoading] = useState(false)

  // la deschiderea paginii cerem lista metodelor: GET /api/algorithms/sort/methods
  useEffect(() => {
    api.getSortMethods()
      .then((data) => {
        setMethods(data)
        if (data.length > 0) setMethod(data[0].key)
      })
      .catch((err) => setError(err.message))
  }, [])

  const info = methods.find((m) => m.key === method)

  // POST /api/algorithms/sort
  async function handleSort(event) {
    event.preventDefault()
    setLoading(true)
    try {
      const values = parseNumbers(text)
      const data = await api.runSort(method, values, true)
      setResult(data)
      setRunId((id) => id + 1)
      setError(null)
    } catch (err) {
      setError(err.message)
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1>Sortare</h1>
      <p className="subtitle">Alegeti o metoda, introduceti un vector si urmariti algoritmul pas cu pas.</p>

      {error && <div className="status status-error">{error}</div>}

      <section className="card">
        <form onSubmit={handleSort} className="form">
          <select value={method} onChange={(event) => setMethod(event.target.value)}>
            {methods.map((m) => (
              <option key={m.key} value={m.key}>{m.name}</option>
            ))}
          </select>
          <input
            className="grow"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="de exemplu: 5, 1, 4, 2, 8"
          />
          <button type="button" className="button-secondary" onClick={() => setText(randomArray(12).join(', '))}>
            Vector aleator
          </button>
          <button type="submit" disabled={loading || !method}>{loading ? 'Se sorteaza...' : 'Sorteaza'}</button>
        </form>

        {info && (
          <div className="table-scroll">
          <table className="info-table">
            <tbody>
              <tr><th>Favorabil</th><th>Mediu</th><th>Nefavorabil</th><th>Memorie</th><th>Stabila</th><th>Pe loc</th></tr>
              <tr>
                <td>{info.complexity.best}</td>
                <td>{info.complexity.average}</td>
                <td>{info.complexity.worst}</td>
                <td>{info.complexity.memory}</td>
                <td>{info.stable ? 'da' : 'nu'}</td>
                <td>{info.inPlace ? 'da' : 'nu'}</td>
              </tr>
            </tbody>
          </table>
          </div>
        )}
        {info && <p className="muted">{info.description}</p>}
      </section>

      {result && (
        <>
          <section className="card">
            <h2>Rezultat</h2>
            <div className={`status ${result.correct ? 'status-ok' : 'status-error'}`}>
              {result.correct ? 'Corect: rezultatul coincide cu sort() din PHP.' : 'Gresit: rezultatul NU este sortat corect.'}
            </div>
            <p><strong>Vectorul sortat:</strong> {result.output.join(', ')}</p>
            <div className="stats">
              <div><span>{result.n}</span>elemente</div>
              <div><span>{formatNumber(result.counters.comparisons)}</span>comparatii</div>
              <div><span>{formatNumber(result.counters.assignments)}</span>atribuiri</div>
              <div><span>{formatNumber(result.counters.swaps)}</span>interschimbari</div>
              <div><span>{result.timeMs}</span>ms</div>
            </div>
          </section>

          <section className="card">
            <h2>Pas cu pas</h2>
            <StepPlayer key={runId} steps={result.steps} roles={['compare', 'swap', 'pivot', 'range', 'sorted']} />
            {result.stepsTruncated && <p className="muted">Sunt afisati doar primii pasi.</p>}
          </section>
        </>
      )}
    </>
  )
}

export default SortingPage
