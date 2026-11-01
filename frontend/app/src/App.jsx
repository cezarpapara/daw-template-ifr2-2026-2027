import { NavLink, Route, Routes } from 'react-router';
import HomePage from './pages/HomePage.jsx';
import CategoriesPage from './pages/CategoriesPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductDetailsPage from './pages/ProductDetailsPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import './App.css';

// Structura comună a tuturor paginilor: meniul de sus + pagina curentă
function App() {
  return (
    <>
      <header className="header">
        <span className="logo">DAW</span>

        <nav>
          <NavLink to="/" end>Acasă</NavLink>
          <NavLink to="/categorii">Categorii</NavLink>
          <NavLink to="/produse">Produse</NavLink>
          <NavLink to="/despre">Despre</NavLink>
        </nav>
      </header>

      <main className="container">
        {/* Fiecare adresă (URL) afișează o altă pagină */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categorii" element={<CategoriesPage />} />
          <Route path="/produse" element={<ProductsPage />} />
          <Route path="/produse/:id" element={<ProductDetailsPage />} />
          <Route path="/despre" element={<AboutPage />} />
          <Route path="*" element={<p>Pagina nu există.</p>} />
        </Routes>
      </main>
    </>
  );
}

export default App;
