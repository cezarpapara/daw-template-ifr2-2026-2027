import { getHello } from '../api';

import { useState, useEffect } from 'react';
import Card from '../components/Card';
import PageTitle from '../components/PageTitle';

const sections = [
  {
    id: 1,
    title: 'Backend',
    text: 'Symfony 8 și PHP 8.5 expun un API JSON.',
    image: '/echipa.jpg',
    imageAlt: 'Ilustrație cu o ceașcă și frunze de toamnă',
  },
  {
    id: 2,
    title: 'Frontend',
    text: 'React 19 afișează datele primite de la API.',
  },
  {
    id: 3,
    title: 'Baza de date',
    text: 'PostgreSQL 18 păstrează datele.',
  },
  {
    id: 4,
    title: 'Docker',
    text: 'Docker pornește serviciile aplicației în containere.',
  },
];

export default function AboutPage() {
  const [salut, setSalut] = useState('Se încarcă salutul...');

  useEffect(() => {
    let activ = true;

    getHello('Madalina')
      .then((data) => {
        if (activ) setSalut(data.message);
      })
      .catch(() => {
        if (activ) setSalut('Salutul nu a putut fi încărcat.');
      });

    return () => {
      activ = false;
    };
  }, []);

  const [count, setCount] = useState(0);

  return (
    <section>
      <p role="status">{salut}</p>
      <PageTitle
        title="Despre proiect"
        subtitle="Aplicație realizată la laboratorul DAW, 2026–2027."
      />

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

      <div style={{ marginTop: '24px' }}>
        <button
          type="button"
          onClick={() => setCount((previous) => previous + 1)}
        >
          Ați apăsat de {count} ori
        </button>

        <button
          type="button"
          onClick={() => setCount(0)}
          style={{ marginLeft: '12px' }}
        >
          Resetează
        </button>
      </div>
    </section>
  );
}
