import { NavLink, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage.jsx'
import CategoriesPage from './pages/CategoriesPage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import ProductDetailsPage from './pages/ProductDetailsPage.jsx'
import SortingPage from './pages/SortingPage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import ComplexityPage from './pages/ComplexityPage.jsx'
import './App.css'

// Structura comuna a tuturor paginilor: meniul de sus + pagina curenta
function App() {
  return (
    <>
      <header className="header">
        <span className="logo">DAW</span>
        <nav>
          <NavLink to="/" end>Acasa</NavLink>
          <NavLink to="/categorii">Categorii</NavLink>
          <NavLink to="/produse">Produse</NavLink>
          {/* Proiectarea algoritmilor */}
          <NavLink to="/sortare">Sortare</NavLink>
          <NavLink to="/cautare">Cautare</NavLink>
          <NavLink to="/complexitate">Complexitate</NavLink>
        </nav>
      </header>

      <main className="container">
        {/* Fiecare adresa (URL) afiseaza o alta pagina */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categorii" element={<CategoriesPage />} />
          <Route path="/produse" element={<ProductsPage />} />
          <Route path="/produse/:id" element={<ProductDetailsPage />} />
          <Route path="/sortare" element={<SortingPage />} />
          <Route path="/cautare" element={<SearchPage />} />
          <Route path="/complexitate" element={<ComplexityPage />} />
          <Route path="*" element={<p>Pagina nu exista.</p>} />
        </Routes>
      </main>
    </>
  )
}

export default App
