
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { api } from '../api.js';
import ReviewSection from '../components/ReviewSection';

function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    setProduct(null);
    setError(null);

    api.getProduct(id)
      .then((data) => {
        if (active) setProduct(data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      });

    return () => {
      active = false;
    };
  }, [id]);

  return (
    <>
      <p>
        <Link to="/produse">&larr; Înapoi la produse</Link>
      </p>

      {error && <div className="status status-error">{error}</div>}
      {!product && !error && <p>Se încarcă...</p>}

      {product && (
        <section className="card">
          <h1>{product.name}</h1>
          <p><strong>Categorie:</strong> {product.category.name}</p>
          <p><strong>Preț:</strong> {product.price} lei</p>
          <p><strong>Descriere:</strong> {product.description || '-'}</p>
          <p className="muted">
            Date primite de la{' '}
            <code>GET {api.url}/api/products/{product.id}</code>
          </p>

          <ReviewSection productId={id} />
        </section>
      )}
    </>
  );
}

export default ProductDetailsPage;
