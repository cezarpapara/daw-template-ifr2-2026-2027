
import { NavLink, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage.jsx'
import TasksPage from './pages/TasksPage.jsx'
import './App.css'

function App() {
  return (
    <>
      <header className="header">
        <span className="logo">TaskFlow</span>

        <nav>
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/sarcini">Sarcini</NavLink>
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sarcini" element={<TasksPage />} />
          <Route path="*" element={<p>Pagina nu exista.</p>} />
        </Routes>
      </main>
    </>
  )
}

export default App
