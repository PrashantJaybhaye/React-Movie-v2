import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Search from './Search';
import Spinner from './Spinner';
import MovieCard from './MovieCard';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from '../appwrite';
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

        } catch (e) {
            console.error(`Error fetching movies:`, e);
            // Fallback to mock data
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
            <header>
                <h1>Find <span className="text-gradient">Movies</span> you'll Enjoy</h1>
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </header>

            <section className="all-movies">
                <h2 style={{ color: 'white' }}>All Movies</h2>
                {isLoading ? (
                    <Spinner />
                ) : (
                    <ul>
                        {movieList.map(movie => (
                            <MovieCard
                                key={movie.id}
                                movie={movie}
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
