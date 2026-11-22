import { useEffect, useState } from 'react'
import { api } from '../api.js'

const EMPTY_FORM = { author: '', rating: '5', comment: '' }

// Sectiunea de recenzii a unui produs. Primeste id-ul produsului prin props.
export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  // Exercitiul 2: mesajul de multumire, care dispare dupa 3 secunde
  const [thanks, setThanks] = useState(false)

  // Se executa la afisare si ori de cate ori se schimba productId
  useEffect(() => {
    setLoading(true)
    setError('')
    api.getReviews(productId)
      .then(setReviews)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [productId])

  // Exercitiul 2: dupa 3 secunde ascundem mesajul; curatam timer-ul la schimbare
  useEffect(() => {
    if (!thanks) return
    const timer = setTimeout(() => setThanks(false), 3000)
    return () => clearTimeout(timer)
  }, [thanks])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const created = await api.createReview({
        author: form.author,
        rating: Number(form.rating),
        comment: form.comment,
        productId: Number(productId),
      })
      setReviews((list) => [created, ...list]) // recenzia noua apare prima
      setForm(EMPTY_FORM)
      setThanks(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Sigur stergeti aceasta recenzie?')) return
    try {
      await api.deleteReview(id)
      setReviews((list) => list.filter((r) => r.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  // Exercitiul 1: nota medie, cu o zecimala. Fara recenzii nu afisam nimic.
  const average = reviews.length
    ? (reviews.reduce((suma, r) => suma + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <section className="reviews">
      <h2>Recenzii ({reviews.length})</h2>
      {average && <p className="average">Nota medie: {average} din 5</p>}

      {loading && <p>Se incarca recenziile...</p>}
      {error && <p className="error">{error}</p>}
      {thanks && <p className="thanks">Multumim pentru recenzie!</p>}
      {!loading && reviews.length === 0 && <p>Nu exista inca recenzii.</p>}

      <ul className="review-list">
        {reviews.map((r) => (
          <li key={r.id}>
            <strong>{r.author}</strong>{' '}
            <span className="stars" role="img" aria-label={`${r.rating} din 5 stele`}>
              {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
            </span>
            <small> · {r.createdAt}</small>
            {r.comment && <p>{r.comment}</p>}
            <button type="button" onClick={() => handleDelete(r.id)}>Sterge</button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <h3>Adaugati o recenzie</h3>
        <label>
          Numele vostru
          <input name="author" value={form.author} onChange={handleChange} required />
        </label>
        <label>
          Nota
          <select name="rating" value={form.rating} onChange={handleChange}>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label>
          Comentariu (optional)
          <textarea name="comment" value={form.comment} onChange={handleChange} rows={3} />
        </label>
        <button type="submit" disabled={saving}>
          {saving ? 'Se trimite...' : 'Trimite recenzia'}
        </button>
      </form>
    </section>
  )
}
