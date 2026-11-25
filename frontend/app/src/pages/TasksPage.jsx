
import { useEffect, useState } from 'react'
import { api } from '../api.js'

const emptyForm = {
  title: '',
  description: '',
  priority: 'Medium',
  status: 'To Do',
  dueDate: '',
}

function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(true)

  async function loadTasks() {
    try {
      const data = await api.getTasks()
      setTasks(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setMessage(null)

    const taskData = {
      ...form,
      dueDate: form.dueDate || null,
    }

    try {
      if (editingId !== null) {
        await api.updateTask(editingId, taskData)
        setMessage('Sarcina a fost modificata cu succes!')
      } else {
        await api.createTask(taskData)
        setMessage('Sarcina a fost adaugata cu succes!')
      }

      setForm(emptyForm)
      setEditingId(null)
      await loadTasks()
    } catch (err) {
      setError(err.message)
    }
  }

  function handleEdit(task) {
    setEditingId(task.id)
    setForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate || '',
    })
    setMessage(null)
    setError(null)
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Esti sigur ca vrei sa stergi aceasta sarcina?')
    if (!confirmed) return

    try {
      await api.deleteTask(id)
      setMessage('Sarcina a fost stearsa cu succes!')
      setError(null)
      if (editingId === id) {
        setEditingId(null)
        setForm(emptyForm)
      }
      await loadTasks()
    } catch (err) {
      setError(err.message)
    }
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
    setMessage(null)
  }

  return (
    <>
      <div className="dashboard-heading">
        <div>
          <h1>Gestionare sarcini</h1>
          <p className="subtitle">
            Adauga, organizeaza si urmareste toate sarcinile tale.
          </p>
        </div>
      </div>

      {error && <div className="status status-error">{error}</div>}
      {message && <div className="status status-ok">{message}</div>}

      <section className="card">
        <h2>{editingId !== null ? 'Modifica sarcina' : 'Adauga o sarcina noua'}</h2>

        <form onSubmit={handleSubmit} className="form form-grid">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Titlul sarcinii"
            maxLength="150"
            required
          />

          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descriere (optional)"
          />

          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="Low">Prioritate scazuta</option>
            <option value="Medium">Prioritate medie</option>
            <option value="High">Prioritate ridicata</option>
          </select>

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="To Do">De facut</option>
            <option value="In Progress">In desfasurare</option>
            <option value="Completed">Finalizata</option>
          </select>

          <label className="date-field">
            Data limita
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
            />
          </label>

          <div className="form-actions">
            <button type="submit">
              {editingId !== null ? 'Salveaza modificarile' : 'Adauga sarcina'}
            </button>

            {editingId !== null && (
              <button type="button" className="button-secondary" onClick={cancelEdit}>
                Anuleaza
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <h2>Lista sarcinilor ({tasks.length})</h2>

        {loading ? (
          <p>Se incarca sarcinile...</p>
        ) : tasks.length === 0 ? (
          <p>Nu exista sarcini momentan. Adauga prima ta sarcina!</p>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <article className="task-item" key={task.id}>
                <div className="task-main">
                  <h3>{task.title}</h3>
                  <p>{task.description || 'Fara descriere'}</p>
                  <small>
                    Data limita: {task.dueDate || 'Nespecificata'}
                  </small>
                </div>

                <div className="task-info">
                  <span className={`priority priority-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                  <span>{task.status}</span>

                  <div className="task-actions">
                    <button type="button" onClick={() => handleEdit(task)}>
                      Editeaza
                    </button>
                    <button
                      type="button"
                      className="button-danger"
                      onClick={() => handleDelete(task.id)}
                    >
                      Sterge
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  )
}

export default TasksPage
