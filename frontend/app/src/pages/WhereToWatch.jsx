import { useState, useEffect } from 'react';

export default function WhereToWatch() {
  const [movies, setMovies] = useState([]);
  const [streamingInfo, setStreamingInfo] = useState({});
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMoviesAndProviders();
  }, []);

  const fetchMoviesAndProviders = async () => {
    try {
      setLoadingMovies(true);
      const res = await fetch('http://localhost:8080/api/movies');
      if (!res.ok) throw new Error('Eroare la încărcarea filmelor.');
      const data = await res.json();
      setMovies(data);
      setLoadingMovies(false);

      data.forEach((movie) => {
        fetchProvidersForMovie(movie.id);
      });
    } catch (err) {
      setError(err.message);
      setLoadingMovies(false);
    }
  };

  const fetchProvidersForMovie = async (movieId) => {
    setStreamingInfo((prev) => ({
      ...prev,
      [movieId]: { loading: true, providers: [], link: null, message: null },
    }));

    try {
      const res = await fetch(`http://localhost:8080/api/movies/${movieId}/streaming`);
      const data = await res.json();

      if (!res.ok) {
        setStreamingInfo((prev) => ({
          ...prev,
          [movieId]: { loading: false, providers: [], link: null, message: data.error || 'Eroare TMDB' },
        }));
        return;
      }

      setStreamingInfo((prev) => ({
        ...prev,
        [movieId]: {
          loading: false,
          providers: data.providers || [],
          link: data.link || null,
          message: data.message || null,
        },
      }));
    } catch {
      setStreamingInfo((prev) => ({
        ...prev,
        [movieId]: { loading: false, providers: [], link: null, message: 'Eroare de conexiune la API.' },
      }));
    }
  };

  // Genereaza link direct de cautare pe platforma respectiva
  const getProviderUrl = (providerName, movieTitle) => {
    const q = encodeURIComponent(movieTitle);
    const name = providerName.toLowerCase();

    if (name.includes('netflix')) {
      return `https://www.netflix.com/search?q=${q}`;
    }
    if (name.includes('max') || name.includes('hbo')) {
      return `https://play.max.com/search?q=${q}`;
    }
    if (name.includes('disney')) {
      return `https://www.disneyplus.com/search?q=${q}`;
    }
    if (name.includes('amazon') || name.includes('prime')) {
      return `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${q}`;
    }
    if (name.includes('rakuten')) {
      return `https://www.rakuten.tv/ro/search?q=${q}`;
    }
    if (name.includes('skyshowtime')) {
      return `https://www.skyshowtime.com/ro/search?q=${q}`;
    }
    if (name.includes('apple')) {
      return `https://tv.apple.com/ro/search?term=${q}`;
    }
    if (name.includes('mubi')) {
      return `https://mubi.com/en/search/films?query=${q}`;
    }

    // Fallback pentru alte platforme: cautare directa Google pe platforma respectiva
    return `https://www.google.com/search?q=${encodeURIComponent(`${movieTitle} ${providerName} streaming`)}`;
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '20px 24px',
        borderRadius: '10px',
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>
        <h2 style={{ margin: '0 0 6px 0', color: '#0f172a' }}>Unde poți viziona (România)</h2>
        <p style={{ margin: 0, color: '#475569', fontSize: '14px' }}>
          Click pe oricare dintre platformele detectate pentru a deschide direct filmul pe serviciul respectiv.
        </p>
      </div>

      {error && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {loadingMovies ? (
        <p style={{ color: '#fff', textAlign: 'center', fontSize: '18px' }}>Se încarcă lista de filme...</p>
      ) : movies.length === 0 ? (
        <div style={{ background: 'rgba(255,255,255,0.9)', padding: '30px', borderRadius: '10px', textAlign: 'center', color: '#334155' }}>
          Nu ai niciun film adăugat în catalog. Mergi la <strong>Catalog Filme</strong> pentru a adăuga primul film!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {movies.map((movie) => {
            const info = streamingInfo[movie.id] || { loading: true, providers: [] };

            return (
              <div
                key={movie.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.96)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', padding: '16px', gap: '14px', borderBottom: '1px solid #e2e8f0' }}>
                  {movie.posterUrl ? (
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      style={{ width: '70px', height: '105px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
                    />
                  ) : (
                    <div style={{
                      width: '70px', height: '105px', background: '#1e293b', color: '#94a3b8',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px',
                      borderRadius: '6px', textAlign: 'center', padding: '4px', flexShrink: 0
                    }}>
                      Fără afiș
                    </div>
                  )}

                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 6px 0', color: '#0f172a', fontSize: '18px' }}>{movie.title}</h3>
                    <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '13px' }}>
                      {movie.genre} • {movie.releaseYear}
                    </p>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 8px',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: movie.isWatched ? '#dcfce7' : '#fef9c3',
                      color: movie.isWatched ? '#166534' : '#854d0e'
                    }}>
                      {movie.isWatched ? 'Vizionat' : 'De văzut'}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  {info.loading ? (
                    <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Se verifică platformele în timp real...</p>
                  ) : info.providers.length > 0 ? (
                    <div>
                      <p style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                        Disponibil pe (click pentru a deschide):
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                        {info.providers.map((p) => (
                          <a
                            key={p.id}
                            href={getProviderUrl(p.name, movie.title)}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`Caută "${movie.title}" pe ${p.name}`}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              background: '#f1f5f9',
                              padding: '6px 10px',
                              borderRadius: '8px',
                              border: '1px solid #cbd5e1',
                              textDecoration: 'none',
                              cursor: 'pointer',
                              transition: 'transform 0.15s, box-shadow 0.15s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#e2e8f0';
                              e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#f1f5f9';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            <img
                              src={p.logo}
                              alt={p.name}
                              style={{ width: '28px', height: '28px', borderRadius: '6px' }}
                            />
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>
                                {p.name} ↗
                              </div>
                              <div style={{ fontSize: '11px', color: '#64748b' }}>{p.type}</div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 12px 0' }}>
                      {info.message || 'Indisponibil momentan pe platformele din România.'}
                    </p>
                  )}

                  {info.link && (
                    <a
                      href={info.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        textAlign: 'center',
                        padding: '8px 12px',
                        background: '#2563eb',
                        color: '#fff',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '600',
                        marginTop: 'auto'
                      }}
                    >
                      Deschide în JustWatch / TMDB ↗
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}