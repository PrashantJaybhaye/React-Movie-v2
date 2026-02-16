import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Search from './Search';
import Spinner from './Spinner';
import MovieCard from './MovieCard';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from '../firebase';
import { testTMDBConnection } from '../utils/tmdb-test';
import { getMockMovies } from '../utils/mockMovies';

const API_BASE_URL = 'https://api.themoviedb.org/3/';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
};

const Home = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [movieList, setMovieList] = useState([]);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

    const fetchMovies = async (query = '') => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const endpoint = query
                ? `${API_BASE_URL}search/movie?query=${encodeURIComponent(query)}`
                : `${API_BASE_URL}discover/movie?sort_by=popularity.desc`;

            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }

            const data = await response.json();
            setMovieList(data.results || []);

            if (query && data.results?.length > 0) {
                updateSearchCount(query, data.results[0]);
            }
        } catch (e) {
            console.error(`Error fetching movies:`, e);
            if (!query) {
                try {
                    const mockData = await getMockMovies();
                    setMovieList(mockData.results || []);
                    setErrorMessage('⚠️ demo data');
                } catch (mockError) {
                    console.error('Mock data failed:', mockError);
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    const loadTrendingMovies = async () => {
        try {
            const movies = await getTrendingMovies();
            setTrendingMovies(movies || []);
        } catch (e) {
            console.error(`Error fetching trending movies: ${e}`);
        }
    };

    const handleMovieClick = (movieId) => {
        navigate(`/movie/${movieId}`);
    };

    const handleTrendingClick = (movie) => {
        const movieId = movie.movie_id || movie.id;
        if (movieId) {
            navigate(`/movie/${movieId}`);
        }
    };

    useEffect(() => {
        fetchMovies(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    useEffect(() => {
        testTMDBConnection();
        loadTrendingMovies();
    }, []);

    return (
        <div className="wrapper">
            {/* Hero Section */}
            <header style={{ textAlign: 'center', paddingTop: '20px', paddingBottom: '10px' }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(229, 9, 20, 0.08)',
                    border: '1px solid rgba(229, 9, 20, 0.15)',
                    borderRadius: '100px',
                    padding: '6px 16px',
                    marginBottom: '24px',
                    fontSize: '13px',
                    color: '#FECECE',
                    fontWeight: '500',
                }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#e50914', boxShadow: '0 0 8px #e50914' }}></span>
                    Discover · Track · Enjoy
                </div>
                <h1>
                    Find <span className="text-gradient">Movies</span> You'll Love
                </h1>
                <p style={{
                    maxWidth: '560px',
                    margin: '20px auto 0',
                    color: '#6b7280',
                    fontSize: '16px',
                    lineHeight: '1.6',
                }}>
                    Explore thousands of movies, build your watchlist, and discover trending films.
                </p>
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </header>

            {/* Trending Section */}
            {trendingMovies.length > 0 && !searchTerm && (
                <section style={{ marginTop: '48px', marginBottom: '48px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h2 style={{
                            fontSize: '20px',
                            fontWeight: '700',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontFamily: '"Space Grotesk", sans-serif',
                        }}>
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '28px',
                                height: '28px',
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, rgba(229,9,20,0.15), rgba(255,107,107,0.15))',
                                fontSize: '14px',
                            }}>🔥</span>
                            Trending Now
                        </h2>
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: '14px',
                        overflowX: 'auto',
                        paddingBottom: '12px',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}>
                        {trendingMovies.map((movie, index) => (
                            <div
                                key={movie.$id || movie.searchTerm || index}
                                onClick={() => handleTrendingClick(movie)}
                                style={{
                                    minWidth: '160px',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    background: 'rgba(255,255,255,0.03)',
                                    flexShrink: 0,
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)';
                                    e.currentTarget.style.borderColor = 'rgba(229,9,20,0.3)';
                                    e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.4), 0 0 30px rgba(229,9,20,0.1)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'none';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                {movie.poster_url ? (
                                    <img
                                        src={movie.poster_url}
                                        alt={movie.title || movie.searchTerm}
                                        style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '100%', height: '220px',
                                        background: 'linear-gradient(135deg, rgba(229,9,20,0.1), rgba(255,59,63,0.1))',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <span style={{ fontSize: '40px', opacity: 0.3 }}>🎬</span>
                                    </div>
                                )}
                                {/* Rank Badge */}
                                <div style={{
                                    position: 'absolute', top: '8px', left: '8px',
                                    width: '26px', height: '26px', borderRadius: '8px',
                                    background: 'linear-gradient(135deg, #e50914, #ff3b3f)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', fontSize: '12px', fontWeight: '700',
                                    boxShadow: '0 2px 10px rgba(229,9,20,0.4)',
                                }}>
                                    {index + 1}
                                </div>
                                <div style={{ padding: '12px', background: 'linear-gradient(180deg, transparent, rgba(22,0,0,0.95))' }}>
                                    <p style={{ color: '#fff', fontSize: '13px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {movie.title || movie.searchTerm}
                                    </p>
                                    <p style={{ color: '#9ca3af', fontSize: '11px', marginTop: '3px' }}>
                                        {movie.count} {movie.count === 1 ? 'search' : 'searches'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Movies Grid */}
            <section className="all-movies">
                <h2 style={{ color: 'white' }}>
                    {searchTerm ? `Results for "${searchTerm}"` : 'Popular Movies'}
                </h2>

                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                        <Spinner />
                    </div>
                ) : errorMessage && movieList.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎬</div>
                        <p style={{ fontSize: '16px' }}>No movies found. Try a different search term.</p>
                    </div>
                ) : (
                    <ul>
                        {movieList.map((movie, index) => (
                            <MovieCard
                                key={movie.id}
                                movie={movie}
                                index={index}
                                onClick={() => handleMovieClick(movie.id)}
                            />
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
};

export default Home;
