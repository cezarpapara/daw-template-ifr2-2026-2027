import { useEffect, useState } from 'react'
import ArrayBars, { Legend } from './ArrayBars.jsx'

// Reda pasii primiti de la backend: inainte / inapoi / redare automata.
// La o rulare noua, pagina schimba atributul key, iar React creeaza un player nou (de la pasul 1).
function StepPlayer({ steps, roles }) {
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [delay, setDelay] = useState(500) // milisecunde intre doi pasi

  const last = steps.length - 1
  const running = playing && current < last

  // redarea automata: un "ceas" care avanseaza cate un pas
  useEffect(() => {
    if (!running) {
      return undefined
    }
    const timer = setTimeout(() => setCurrent((step) => step + 1), delay)
    return () => clearTimeout(timer) // curatenie: oprim ceasul vechi
  }, [running, current, delay])

  function togglePlay() {
    if (current >= last) {
      setCurrent(0) // de la capat
    }
    setPlaying(!running)
  }

  if (!steps || steps.length === 0) {
    return <p className="muted">Pasii se afiseaza pentru vectori mici (cel mult 40 de elemente).</p>
  }

  const step = steps[current]

  return (
    <div>
      <ArrayBars values={step.values} highlight={step.highlight} />
      <Legend roles={roles} />
      <p className="step-message">
        <strong>Pasul {current + 1} / {steps.length}:</strong> {step.message}
      </p>
      <div className="player">
        <button onClick={() => setCurrent(0)} disabled={current === 0}>|&lt;</button>
        <button onClick={() => setCurrent(current - 1)} disabled={current === 0}>&lt; Inapoi</button>
        <button onClick={togglePlay}>{running ? 'Pauza' : 'Porneste'}</button>
        <button onClick={() => setCurrent(current + 1)} disabled={current === last}>Inainte &gt;</button>
        <button onClick={() => setCurrent(steps.length - 1)} disabled={current === last}>&gt;|</button>
        <label>
          Viteza{' '}
          <select value={delay} onChange={(event) => setDelay(Number(event.target.value))}>
            <option value={1000}>lent</option>
            <option value={500}>normal</option>
            <option value={150}>rapid</option>
          </select>
        </label>
      </div>
    </div>
  )
}

export default StepPlayer
