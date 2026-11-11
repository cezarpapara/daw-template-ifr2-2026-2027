import { NavLink, Route, Routes } from 'react-router'
import MoviesPage from './pages/Movies.jsx'
import './App.css'

function App() {
  return (
    <>
      <header className="header">
        <span className="logo">🎬 CineLog</span>
        <nav>
          <NavLink to="/" end>Catalog Filme</NavLink>
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<MoviesPage />} />
          <Route path="*" element={<p style={{ textAlign: 'center', marginTop: '50px' }}>Pagina nu există.</p>} />
        </Routes>
      </main>
    </>
  )
}

export default App