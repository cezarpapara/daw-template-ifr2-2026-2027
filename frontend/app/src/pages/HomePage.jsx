

import { useEffect, useState } from 'react'
import { api } from '../api.js'

function HomePage() {
  const [tasks, setTasks] = useState([])
  const [health, setHealth] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.getTasks(), api.getHealth()])
      .then(([tasksData, healthData]) => {
        setTasks(tasksData)
        setHealth(healthData)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const totalTasks = tasks.length

  const completedTasks = tasks.filter(
    (task) => task.status === 'Completed'
  ).length

  const inProgressTasks = tasks.filter(
    (task) => task.status === 'In Progress'
  ).length

  const pendingTasks = tasks.filter(
    (task) => task.status === 'To Do'
  ).length

  const progress = totalTasks === 0
    ? 0
    : Math.round((completedTasks / totalTasks) * 100)

  return (
    <>
      <div className="dashboard-heading">
        <div>
          <h1>Dashboard TaskFlow</h1>
          <p className="subtitle">
            Organizeaza-ti sarcinile si urmareste-ti progresul.
          </p>
        </div>
      </div>

      {error && (
        <div className="status status-error">
          <strong>Nu s-au putut incarca datele.</strong>
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <section className="card">
          <p>Se incarca dashboard-ul...</p>
        </section>
      ) : !error && (
        <>
          <section className="task-stats">
            <article className="stat-card">
              <span>Total sarcini</span>
              <strong>{totalTasks}</strong>
            </article>

            <article className="stat-card">
              <span>In asteptare</span>
              <strong>{pendingTasks}</strong>
            </article>

            <article className="stat-card">
              <span>In desfasurare</span>
              <strong>{inProgressTasks}</strong>
            </article>

            <article className="stat-card">
              <span>Finalizate</span>
              <strong>{completedTasks}</strong>
            </article>
          </section>

          <section className="card">
            <div className="progress-heading">
              <h2>Progresul proiectului</h2>
              <strong>{progress}%</strong>
            </div>

            <div
              className="progress-track"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="Procentul sarcinilor finalizate"
            >
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="muted">
              {completedTasks} din {totalTasks} sarcini finalizate.
            </p>
          </section>

          <section className="card">
            <h2>Sarcini recente</h2>

            {tasks.length === 0 ? (
              <p>Nu exista momentan sarcini. Adauga prima ta sarcina!</p>
            ) : (
              <div className="task-list">
                {tasks.slice(0, 5).map((task) => (
                  <article className="task-item" key={task.id}>
                    <div className="task-main">
                      <h3>{task.title}</h3>
                      <p>{task.description || 'Fara descriere'}</p>
                    </div>

                    <div className="task-info">
                      <span className={`priority priority-${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>

                      <span className={`status-badge ${
                        task.status === 'Completed'
                          ? 'status-completed'
                          : task.status === 'In Progress'
                            ? 'status-progress'
                            : 'status-pending'
                      }`}>
                        {task.status === 'Completed'
                          ? 'Finalizata'
                          : task.status === 'In Progress'
                            ? 'In desfasurare'
                            : 'De facut'}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="card">
            <h2>Conexiune sistem</h2>

            {health && (
              <div className="status status-ok">
                <p><strong>Backend:</strong> Conectat</p>
                <p><strong>Baza de date:</strong> {health.database}</p>
                <p><strong>Ora serverului:</strong> {health.time}</p>
              </div>
            )}
          </section>
        </>
      )}
    </>
  )
}

export default HomePage
