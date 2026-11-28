import { useState } from 'react'
import Card from '../components/Card.jsx'
import PageTitle from '../components/PageTitle.jsx'

// Datele cardurilor stau într-o listă; cardurile se generează cu .map()
const sections = [
  { id: 1, title: 'Backend', text: 'Symfony 8 și PHP 8.5 expun un API JSON.' },
  { id: 2, title: 'Frontend', text: 'React 19 afișează datele primite de la API.' },
  {
    id: 3,
    title: 'Baza de date',
    text: 'PostgreSQL 18 păstrează datele.',
    image: '/echipa.svg',
    imageAlt: 'Trei cercuri colorate care reprezintă o echipă',
  },
  { id: 4, title: 'Docker', text: 'Fiecare componentă rulează într-un container izolat, la fel pe orice calculator.' },
  { id: 5, title: 'Git', text: 'Istoricul modificarilor si lucrul pe branch-uri.' },
]

export default function AboutPage() {
  const [count, setCount] = useState(0)

  return (
    <section>
      <PageTitle
        title="Despre proiect"
        subtitle="Aplicație realizată la laboratorul de PW/DAW, 2026–2027."
      />
      <p>Numărul de secțiuni: {sections.length}</p>
      <p>
        Contor: <strong>{count}</strong>{' '}
        <button type="button" onClick={() => setCount(count + 1)}>+1</button>{' '}
        <button type="button" className="button-secondary" onClick={() => setCount(0)}>Reseteaza</button>
      </p>
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
    </section>
  )
}
