import { useState } from 'react'
import Card from '../components/Card.jsx'
import PageTitle from '../components/PageTitle.jsx'

// Datele cardurilor: o lista de obiecte, fiecare cu un id unic
const sections = [
  {
    id: 1,
    title: 'Backend',
    text: 'Symfony 8 și PHP 8.5 expun un API JSON cu piesele și kiturile de robotică.',
  },
  {
    id: 2,
    title: 'Frontend',
    text: 'React 19 afișează datele primite de la API.',
    // Exercitiul 2: imagine din folderul public/ (calea incepe cu /)
    image: '/robot.svg',
    imageAlt: 'Desen simplu al unui robot',
  },
  {
    id: 3,
    title: 'Baza de date',
    text: 'PostgreSQL 18 păstrează categoriile și produsele.',
  },
  // Exercitiul 1: al patrulea element
  {
    id: 4,
    title: 'Docker',
    text: 'Rulează backend-ul, baza de date și frontend-ul în containere separate, la fel pe orice calculator.',
  },
]

export default function AboutPage() {
  // Exercitiul 1: starea contorului (porneste de la 0)
  const [count, setCount] = useState(0)

  return (
    <section>
      <PageTitle
        title="Despre proiect"
        subtitle="Aplicația de robotică, realizată la laboratorul de PW/DAW, 2026–2027."
      />
      {/* Exercitiul 5 (optional): numarul de sectiuni */}
      <p className="muted">Proiectul are {sections.length} părți principale.</p>

      <div className="info-card-grid">
        {sections.map((section) => (
          <Card
            key={section.id}
            title={section.title}
            text={section.text}
            image={section.image}
            imageAlt={section.imageAlt}
          />
        ))}
      </div>

      {/* Exercitiul 1: butonul-contor si butonul Reseteaza */}
      <div className="counter">
        <button type="button" onClick={() => setCount(count + 1)}>
          Ați apăsat de {count} ori
        </button>
        <button type="button" onClick={() => setCount(0)}>
          Resetează
        </button>
      </div>
    </section>
  )
}
