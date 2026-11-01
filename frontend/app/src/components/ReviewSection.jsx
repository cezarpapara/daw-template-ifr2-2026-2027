import { useEffect, useState } from 'react';
import { getReviews, createReview, deleteReview } from '../api';

const EMPTY_FORM = { author: '', rating: '5', comment: '' };

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError('');
    setReviews([]);
    setSuccess('');

    getReviews(productId)
      .then((data) => {
        if (active) setReviews(data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [productId]);

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => setSuccess(''), 3000);
    return () => clearTimeout(timer);
  }, [success]);

  const average = reviews.length
    ? (
        reviews.reduce((sum, review) => sum + Number(review.rating), 0)
        / reviews.length
      ).toFixed(1)
    : null;

  function handleChange(e) {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const created = await createReview({
        author: form.author,
        rating: Number(form.rating),
        comment: form.comment,
        productId: Number(productId),
      });

      setReviews((list) => [created, ...list]);
      setForm(EMPTY_FORM);
      setSuccess('Mulțumim pentru recenzie!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Sigur ștergeți această recenzie?')) return;

    setError('');

    try {
      await deleteReview(id);
      setReviews((list) => list.filter((review) => review.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="reviews">
      <h2>Recenzii ({reviews.length})</h2>

      {loading && <p>Se încarcă recenziile...</p>}
      {error && <p className="error" role="alert">{error}</p>}
      {success && <p role="status">{success}</p>}

      {!loading && average !== null && (
        <p>Nota medie: {average} din 5</p>
      )}

      {!loading && !error && reviews.length === 0 && (
        <p>Nu există încă recenzii.</p>
      )}

      <ul className="review-list">
        {reviews.map((review) => (
          <li key={review.id}>
            <strong>{review.author}</strong>{' '}
            <span
              className="stars"
              role="img"
              aria-label={`${review.rating} din 5 stele`}
            >
              {'★'.repeat(review.rating)}
              {'☆'.repeat(5 - review.rating)}
            </span>
            <small> · {review.createdAt}</small>

            {review.comment && <p>{review.comment}</p>}

            <button
              type="button"
              onClick={() => handleDelete(review.id)}
            >
              Șterge
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <h3>Adăugați o recenzie</h3>

        <label>
          Numele vostru
          <input
            name="author"
            value={form.author}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Nota
          <select
            name="rating"
            value={form.rating}
            onChange={handleChange}
          >
            {[5, 4, 3, 2, 1].map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>
        </label>

        <label>
          Comentariu (opțional)
          <textarea
            name="comment"
            value={form.comment}
            onChange={handleChange}
            rows={3}
          />
        </label>

        <button type="submit" disabled={saving || loading}>
          {saving ? 'Se trimite...' : 'Trimite recenzia'}
        </button>
      </form>
    </section>
  );
}



