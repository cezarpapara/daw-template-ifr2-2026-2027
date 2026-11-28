import { useEffect, useState } from 'react'
import { api } from '../api.js'
import StepPlayer from '../algorithms/StepPlayer.jsx'
import { formatNumber, parseNumbers, randomArray } from '../algorithms/utils.js'

// Pagina Cautare: cautam o valoare intr-un vector si comparam metodele
function SearchPage() {
  const [methods, setMethods] = useState([])
  const [method, setMethod] = useState('')
  const [text, setText] = useState('2, 5, 8, 12, 16, 23, 38, 56, 72, 91')
  const [target, setTarget] = useState('23')
  const [result, setResult] = useState(null)
  const [comparison, setComparison] = useState([])
  const [error, setError] = useState(null)
  const [runId, setRunId] = useState(0) // creste la fiecare rulare: resetam animatia

  useEffect(() => {
    api.getSearchMethods()
      .then((data) => {
        setMethods(data)
        if (data.length > 0) setMethod(data[0].key)
      })
      .catch((err) => setError(err.message))
  }, [])

  // POST /api/algorithms/search cu metoda aleasa
  async function handleSearch(event) {
    event.preventDefault()
    try {
      const data = await api.runSearch(method, parseNumbers(text), Number(target), true)
      setResult(data)
      setRunId((id) => id + 1)
      setComparison([])
      setError(null)
    } catch (err) {
      setError(err.message)
      setResult(null)
    }
  }

  // Aceeasi cautare, cu toate metodele, pe un vector sortat mare: cate comparatii face fiecare?
  async function handleCompare() {
    try {
      const values = Array.from({ length: 100000 }, (_, i) => 2 * i) // 0, 2, 4, ..., 199998 (sortat)
      const searched = Number(target) || 199998
      const rows = []
      for (const m of methods) {
        const data = await api.runSearch(m.key, values, searched, false)
        rows.push({ name: m.name, ...data })
      }
      setComparison(rows)
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  function sortValues() {
    try {
      setText(parseNumbers(text).sort((a, b) => a - b).join(', '))
    } catch (err) {
      setError(err.message)
    }
  }

  const info = methods.find((m) => m.key === method)

  return (
    <>
      <h1>Cautare</h1>
      <p className="subtitle">Cautam o valoare intr-un vector. Cautarea binara cere un vector sortat crescator.</p>

      {error && <div className="status status-error">{error}</div>}

      <section className="card">
        <form onSubmit={handleSearch} className="form">
          <select value={method} onChange={(event) => setMethod(event.target.value)}>
            {methods.map((m) => (
              <option key={m.key} value={m.key}>{m.name}</option>
            ))}
          </select>
          <input className="grow" value={text} onChange={(event) => setText(event.target.value)} />
          <input className="narrow" value={target} onChange={(event) => setTarget(event.target.value)} placeholder="valoarea" />
          <button type="button" className="button-secondary" onClick={() => setText(randomArray(16).join(', '))}>Aleator</button>
          <button type="button" className="button-secondary" onClick={sortValues}>Sorteaza valorile</button>
          <button type="submit" disabled={!method}>Cauta</button>
        </form>
        {info && (
          <p className="muted">
            {info.description} Complexitate: {info.complexity.best} / {info.complexity.average} / {info.complexity.worst}
            {' '}(favorabil / mediu / nefavorabil).
          </p>
        )}
      </section>

      {result && (
        <section className="card">
          <h2>{result.found ? `Gasit pe pozitia ${result.index}` : 'Valoarea nu apare in vector'}</h2>
          <p>{formatNumber(result.counters.comparisons)} comparatii pentru n = {result.n}.</p>
          <StepPlayer key={runId} steps={result.steps} roles={['range', 'compare', 'found']} />
        </section>
      )}

      <section className="card">
        <h2>Comparatie pe 100.000 de elemente</h2>
        <p className="muted">
          Vectorul 0, 2, 4, ..., 199998 (sortat). Se cauta valoarea din campul de mai sus. Incercati si o valoare
          care nu exista (de exemplu 7) sau ultima valoare (199998).
        </p>
        <button onClick={handleCompare} disabled={methods.length === 0}>Compara metodele</button>
        {comparison.length > 0 && (
          <table>
            <thead>
              <tr><th>Metoda</th><th>Rezultat</th><th>Comparatii</th><th>Timp (ms)</th></tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>{row.found ? `pozitia ${formatNumber(row.index)}` : 'negasit'}</td>
                  <td>{formatNumber(row.counters.comparisons)}</td>
                  <td>{row.timeMs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  )
}

export default SearchPage
