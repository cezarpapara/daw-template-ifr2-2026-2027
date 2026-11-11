import { useState, useEffect, useMemo } from 'react';

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [isWatched, setIsWatched] = useState(false);
  const [rating, setRating] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterGenre, setFilterGenre] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8080/api/movies');
      if (!res.ok) throw new Error('Eroare la preluarea filmelor!');
      const data = await res.json();
      setMovies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const resetForm = () => {
    setTitle('');
    setGenre('');
    setReleaseYear('');
    setIsWatched(false);
    setRating('');
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const payload = {
      title,
      genre,
      releaseYear: parseInt(releaseYear, 10),
      isWatched,
      rating: rating !== '' ? parseInt(rating, 10) : null,
    };

    const url = editingId 
      ? `http://localhost:8080/api/movies/${editingId}` 
      : 'http://localhost:8080/api/movies';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'A aparut o eroare!');

      setMessage(data.message || (editingId ? 'Film actualizat cu succes!' : 'Film adaugat cu succes!'));
      resetForm();
      fetchMovies();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (movie) => {
    setEditingId(movie.id);
    setTitle(movie.title);
    setGenre(movie.genre);
    setReleaseYear(movie.releaseYear);
    setIsWatched(movie.isWatched);
    setRating(movie.rating !== null ? movie.rating : '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Sigur doriti sa stergeti acest film?')) return;
    setMessage(null);
    setError(null);

    try {
      const res = await fetch(`http://localhost:8080/api/movies/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Eroare la stergere!');

      setMessage(data.message || 'Film sters cu succes!');
      fetchMovies();
    } catch (err) {
      setError(err.message);
    }
  };

  const stats = useMemo(() => {
    const total = movies.length;
    const watched = movies.filter((m) => m.isWatched).length;
    const rated = movies.filter((m) => m.rating !== null && m.rating !== undefined);
    const avgRating = rated.length > 0 
      ? (rated.reduce((acc, curr) => acc + curr.rating, 0) / rated.length).toFixed(1) 
      : '-';
    return { total, watched, toWatch: total - watched, avgRating };
  }, [movies]);

  const genresList = useMemo(() => {
    return Array.from(new Set(movies.map((m) => m.genre))).filter(Boolean);
  }, [movies]);

  const filteredMovies = useMemo(() => {
    return movies
      .filter((movie) => {
        const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre = filterGenre === 'ALL' || movie.genre.toLowerCase() === filterGenre.toLowerCase();
        const matchesStatus = 
          filterStatus === 'ALL' 
            ? true 
            : filterStatus === 'WATCHED' 
              ? movie.isWatched 
              : !movie.isWatched;
        return matchesSearch && matchesGenre && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return b.releaseYear - a.releaseYear;
        if (sortBy === 'oldest') return a.releaseYear - b.releaseYear;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [movies, searchQuery, filterGenre, filterStatus, sortBy]);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'Segoe UI, sans-serif' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
        <div style={{ background: '#ffffff', padding: '15px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>{stats.total}</div>
          <div style={{ fontSize: '13px', color: '#64748b' }}>Total Filme</div>
        </div>
        <div style={{ background: '#ffffff', padding: '15px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>{stats.watched}</div>
          <div style={{ fontSize: '13px', color: '#64748b' }}>Vizionate</div>
        </div>
        <div style={{ background: '#ffffff', padding: '15px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d97706' }}>{stats.toWatch}</div>
          <div style={{ fontSize: '13px', color: '#64748b' }}>De Vazut</div>
        </div>
        <div style={{ background: '#ffffff', padding: '15px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7c3aed' }}>{stats.avgRating} / 10</div>
          <div style={{ fontSize: '13px', color: '#64748b' }}>Nota Medie</div>
        </div>
      </div>

      {message && (
        <div style={{ background: '#d1fae5', color: '#065f46', padding: '12px', borderRadius: '6px', marginBottom: '20px', border: '1px solid #a7f3d0' }}>
          {message}
        </div>
      )}
      {error && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '20px', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      <div style={{ background: '#ffffff', color: '#1e293b', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', marginBottom: '35px' }}>
        <h3 style={{ marginTop: 0, borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', color: '#0f172a' }}>
          {editingId ? 'Editare Film' : 'Adaugare Film Nou'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>Titlu:</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="ex: Dune: Part Two"
              required 
              style={{ width: '100%', padding: '9px', borderRadius: '5px', border: '1px solid #cbd5e1', boxSizing: 'border-box', color: '#0f172a', background: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>Gen:</label>
            <input 
              type="text" 
              value={genre} 
              onChange={(e) => setGenre(e.target.value)} 
              placeholder="ex: SF, Actiune, Drama" 
              required 
              style={{ width: '100%', padding: '9px', borderRadius: '5px', border: '1px solid #cbd5e1', boxSizing: 'border-box', color: '#0f172a', background: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>An Lansare:</label>
            <input 
              type="number" 
              value={releaseYear} 
              onChange={(e) => setReleaseYear(e.target.value)} 
              placeholder="ex: 2024"
              required 
              style={{ width: '100%', padding: '9px', borderRadius: '5px', border: '1px solid #cbd5e1', boxSizing: 'border-box', color: '#0f172a', background: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>Nota (1 - 10):</label>
            <input 
              type="number" 
              min="1" 
              max="10" 
              value={rating} 
              onChange={(e) => setRating(e.target.value)} 
              placeholder="Optional" 
              style={{ width: '100%', padding: '9px', borderRadius: '5px', border: '1px solid #cbd5e1', boxSizing: 'border-box', color: '#0f172a', background: '#fff' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
            <label style={{ cursor: 'pointer', fontSize: '15px', color: '#334155', fontWeight: '500' }}>
              <input 
                type="checkbox" 
                checked={isWatched} 
                onChange={(e) => setIsWatched(e.target.checked)} 
                style={{ marginRight: '8px' }}
              />
              Vizionat
            </label>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
            <button 
              type="submit" 
              style={{ padding: '9px 18px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {editingId ? 'Salveaza' : 'Adauga'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={resetForm} 
                style={{ padding: '9px 18px', background: '#64748b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                Anuleaza
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{ background: '#ffffff', padding: '15px', borderRadius: '8px', marginBottom: '25px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
        <input 
          type="text" 
          placeholder="Cauta film..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '5px', border: '1px solid #cbd5e1', flex: '1 1 200px', color: '#0f172a' }}
        />

        <select 
          value={filterGenre} 
          onChange={(e) => setFilterGenre(e.target.value)}
          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #cbd5e1', color: '#0f172a' }}
        >
          <option value="ALL">Toate genurile</option>
          {genresList.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #cbd5e1', color: '#0f172a' }}
        >
          <option value="ALL">Toate statusurile</option>
          <option value="WATCHED">Doar Vizionate</option>
          <option value="UNWATCHED">De Vazut</option>
        </select>

        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #cbd5e1', color: '#0f172a' }}
        >
          <option value="newest">Cele mai noi</option>
          <option value="oldest">Cele mai vechi</option>
          <option value="rating">Cea mai mare nota</option>
          <option value="title">Alfabetic (A-Z)</option>
        </select>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#ffffff' }}>Se incarca filmele...</p>
      ) : filteredMovies.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#ffffff', marginTop: '30px' }}>Nu a fost gasit niciun film conform filtrelor.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filteredMovies.map((movie) => (
            <div 
              key={movie.id} 
              style={{
                background: '#ffffff',
                color: '#0f172a',
                borderRadius: '8px',
                padding: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0, fontSize: '18px', color: '#0f172a', fontWeight: '700' }}>{movie.title}</h4>
                  <span style={{
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    background: movie.isWatched ? '#dcfce7' : '#fef9c3',
                    color: movie.isWatched ? '#15803d' : '#854d0e',
                    whiteSpace: 'nowrap'
                  }}>
                    {movie.isWatched ? 'Vizionat' : 'De vazut'}
                  </span>
                </div>

                <div style={{ width: '100%', height: '320px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {movie.posterUrl ? (
                    <img 
                      src={movie.posterUrl} 
                      alt={movie.title}
                      referrerPolicy="no-referrer"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <div style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '10px' }}>
                      Afis indisponibil
                    </div>
                  )}
                </div>

                <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '6px' }}>
                  <span>{movie.genre}</span> • <span>{movie.releaseYear}</span>
                </div>

                <div style={{ fontSize: '15px', marginBottom: '14px' }}>
                  <strong style={{ color: '#334155' }}>Nota: </strong> 
                  {movie.rating ? (
                    <span style={{ color: '#d97706', fontWeight: 'bold' }}>★ {movie.rating} / 10</span>
                  ) : (
                    <span style={{ color: '#94a3b8' }}>Fara nota</span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                <button 
                  onClick={() => handleEdit(movie)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '700'
                  }}
                >
                  Editeaza
                </button>
                <button 
                  onClick={() => handleDelete(movie.id)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: '#ef4444',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '700'
                  }}
                >
                  Sterge
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
