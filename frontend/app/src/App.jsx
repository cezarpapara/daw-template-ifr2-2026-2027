import { NavLink, Route, Routes } from 'react-router';
import MoviesPage from './pages/Movies.jsx';
import WhereToWatch from './pages/WhereToWatch.jsx';
import './App.css';

function App() {
  return (
    <>
      <header className="header">
        <span className="logo">🎬 CineLog</span>
        <nav>
          <NavLink to="/">Catalog Filme</NavLink>
          <NavLink to="/streaming">Unde poți viziona</NavLink>
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<MoviesPage />} />
          <Route path="/streaming" element={<WhereToWatch />} />
          <Route path="*" element={<p style={{ textAlign: 'center', marginTop: '50px' }}>Pagina nu există.</p>} />
        </Routes>
      </main>
    </>
  );
}

export default App;