
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { api } from '../api.js'

const emptyForm = {
  name: '',
  description: '',
  price: '',
  categoryId: '',
}

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  const term = search.trim().toLowerCase()
  const visibleProducts = products.filter((product) =>
    product.name.toLowerCase().includes(term)
  )

  function loadProducts() {
    api.getProducts()
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    loadProducts()

    api.getCategories()
      .then((data) => setCategories(data))
      .catch((err) => setError(err.message))
  }, [])

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      await api.createProduct({
        name: form.name,
        description: form.description,
        price: form.price,
        categoryId: Number(form.categoryId),
      })

      setForm(emptyForm)
      setError(null)
      loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteProduct(id)
      loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <h1>Produse</h1>

      {error && <div className="status status-error">{error}</div>}

      <section className="card">
        <h2>Adaugă un produs</h2>

        <form onSubmit={handleSubmit} className="form form-grid">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nume"
            required
          />

          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Preț (ex: 49.99)"
            type="number"
            step="0.01"
            min="0"
            required
          />

          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Alege categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descriere (opțional)"
          />

          <button type="submit">Adaugă</button>
        </form>
      </section>

      <section className="card">
        <h2>Lista produselor</h2>

        <div className="form-field">
          <label htmlFor="product-search">Caută produse</label>
          <input
            id="product-search"
            type="search"
            placeholder="Caută după nume…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {search !== '' && (
          <button type="button" onClick={() => setSearch('')}>
            Șterge căutarea
          </button>
        )}

        <p>
          {visibleProducts.length} din {products.length} produse
        </p>

        <table>
          <thead>
            <tr>
              <th>Nume</th>
              <th>Categorie</th>
              <th>Preț (lei)</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {visibleProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <Link to={`/produse/${product.id}`}>
                    {product.name}
                  </Link>
                </td>
                <td>{product.category.name}</td>
                <td>{product.price}</td>
                <td>
                  <button
                    type="button"
                    className="button-danger"
                    onClick={() => handleDelete(product.id)}
                  >
                    Șterge
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {visibleProducts.length === 0 && (
          <p>Niciun produs nu corespunde căutării.</p>
        )}
      </section>
    </>
  )
}

export default ProductsPage
