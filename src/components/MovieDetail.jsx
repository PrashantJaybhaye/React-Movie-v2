import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Spinner from './Spinner';
import WatchlistButton from './WatchlistButton';

const API_BASE_URL = 'https://api.themoviedb.org/3/';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
};

const MovieDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [cast, setCast] = useState([]);
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchMovieDetails = async () => {
            setIsLoading(true);
            setError('');

            try {
                // Fetch movie details
                const movieResponse = await fetch(`${API_BASE_URL}movie/${id}`, API_OPTIONS);
                if (!movieResponse.ok) throw new Error('Failed to fetch movie details');
                const movieData = await movieResponse.json();

                // Fetch cast details
                const castResponse = await fetch(`${API_BASE_URL}movie/${id}/credits`, API_OPTIONS);
                if (!castResponse.ok) throw new Error('Failed to fetch cast details');
                const castData = await castResponse.json();

                // Fetch videos/trailers
                const videosResponse = await fetch(`${API_BASE_URL}movie/${id}/videos`, API_OPTIONS);
                if (!videosResponse.ok) throw new Error('Failed to fetch videos');
                const videosData = await videosResponse.json();

                setMovie(movieData);
                setCast(castData.cast.slice(0, 8));
                setVideos(videosData.results.filter(video => video.type === 'Trailer').slice(0, 3));
            } catch (err) {
                setError('Failed to load movie details');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchMovieDetails();
        }
    }, [id]);

    if (isLoading) return <Spinner />;
    if (error) return <div className="error-message">{error}</div>;
    if (!movie) return <div className="error-message">Movie not found</div>;

    const backdropUrl = movie.backdrop_path 
        ? `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`
        : null;

    return (
        <div className="movie-detail-page">
            {/* Hero Section with Backdrop */}
            <div className="movie-hero" style={{
                backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'none'
            }}>
                <div className="hero-overlay">
                    <div className="hero-content">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="back-btn"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Back
                        </button>

                        <div className="hero-info">
                            <div className="movie-poster-hero">
                                <img
                                    src={movie.poster_path 
                                        ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` 
                                        : '/no-movie.png'
                                    }
                                    alt={movie.title}
                                />
                            </div>

                            <div className="movie-main-info">
                                <h1 className="hero-title">{movie.title}</h1>
                                {movie.tagline && (
                                    <p className="tagline">"{movie.tagline}"</p>
                                )}
                                
                                <div className="hero-meta">
                                    <div className="rating-hero">
                                        <div className="rating-circle">
                                            <svg className="rating-progress" width="60" height="60">
                                                <circle cx="30" cy="30" r="25" fill="none" stroke="#1a1a1a" strokeWidth="4"/>
                                                <circle 
                                                    cx="30" 
                                                    cy="30" 
                                                    r="25" 
                                                    fill="none" 
                                                    stroke="#ff007a" 
                                                    strokeWidth="4"
                                                    strokeDasharray={`${(movie.vote_average / 10) * 157} 157`}
                                                    transform="rotate(-90 30 30)"
                                                />
                                            </svg>
                                            <span className="rating-text">
                                                {movie.vote_average ? (movie.vote_average * 10).toFixed(0) : 'NR'}
                                                <small>%</small>
                                            </span>
                                        </div>
                                        <span className="rating-label">User Score</span>
                                    </div>

                                    <div className="meta-details">
                                        <span className="release-year">
                                            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                                        </span>
                                        <span className="separator">•</span>
                                        <span className="runtime">{movie.runtime}m</span>
                                        <span className="separator">•</span>
                                        <span className="language">{movie.original_language?.toUpperCase()}</span>
                                    </div>
                                </div>

                                <div className="genres-hero">
                                    {movie.genres?.map(genre => (
                                        <span key={genre.id} className="genre-pill">
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>

                                {/* Watchlist Button */}
                                <div className="mt-6">
                                    <WatchlistButton movie={movie} variant="text" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="movie-content">
                <div className="content-container">
                    {/* Navigation Tabs */}
                    <div className="content-tabs">
                        <button 
                            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            Overview
                        </button>
                        <button 
                            className={`tab ${activeTab === 'cast' ? 'active' : ''}`}
                            onClick={() => setActiveTab('cast')}
                        >
                            Cast & Crew
                        </button>
                        <button 
                            className={`tab ${activeTab === 'details' ? 'active' : ''}`}
                            onClick={() => setActiveTab('details')}
                        >
                            Details
                        </button>
                        {videos.length > 0 && (
                            <button 
                                className={`tab ${activeTab === 'videos' ? 'active' : ''}`}
                                onClick={() => setActiveTab('videos')}
                            >
                                Videos
                            </button>
                        )}
                    </div>

                    {/* Tab Content */}
                    <div className="tab-content">
                        {activeTab === 'overview' && (
                            <div className="overview-content">
                                <div className="overview-section">
                                    <h3>Synopsis</h3>
                                    <p className="overview-text">{movie.overview || 'No overview available.'}</p>
                                </div>

                                {movie.production_companies?.length > 0 && (
                                    <div className="production-section">
                                        <h3>Production Companies</h3>
                                        <div className="production-grid">
                                            {movie.production_companies.slice(0, 4).map(company => (
                                                <div key={company.id} className="production-card">
                                                    {company.logo_path && (
                                                        <img 
                                                            src={`https://image.tmdb.org/t/p/w200/${company.logo_path}`}
                                                            alt={company.name}
                                                        />
                                                    )}
                                                    <span>{company.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'cast' && (
                            <div className="cast-content">
                                <div className="cast-grid-modern">
                                    {cast.map(actor => (
                                        <div key={actor.id} className="cast-card-modern">
                                            <div className="cast-image">
                                                <img
                                                    src={actor.profile_path 
                                                        ? `https://image.tmdb.org/t/p/w300/${actor.profile_path}`
                                                        : '/no-avatar.png'
                                                    }
                                                    alt={actor.name}
                                                />
                                            </div>
                                            <div className="cast-info-modern">
                                                <h4 className="actor-name-modern">{actor.name}</h4>
                                                <p className="character-name-modern">{actor.character}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'details' && (
                            <div className="details-content">
                                <div className="details-grid">
                                    <div className="detail-card">
                                        <h4>Budget</h4>
                                        <p>${movie.budget?.toLocaleString() || 'N/A'}</p>
                                    </div>
                                    <div className="detail-card">
                                        <h4>Revenue</h4>
                                        <p>${movie.revenue?.toLocaleString() || 'N/A'}</p>
                                    </div>
                                    <div className="detail-card">
                                        <h4>Status</h4>
                                        <p>{movie.status}</p>
                                    </div>
                                    <div className="detail-card">
                                        <h4>Original Language</h4>
                                        <p>{movie.original_language?.toUpperCase()}</p>
                                    </div>
                                    <div className="detail-card">
                                        <h4>Release Date</h4>
                                        <p>{movie.release_date ? new Date(movie.release_date).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                    <div className="detail-card">
                                        <h4>Popularity</h4>
                                        <p>{movie.popularity?.toFixed(1)}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'videos' && videos.length > 0 && (
                            <div className="videos-content">
                                <div className="videos-grid">
                                    {videos.map(video => (
                                        <div key={video.id} className="video-card">
                                            <div className="video-thumbnail">
                                                <img 
                                                    src={`https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`}
                                                    alt={video.name}
                                                />
                                                <button 
                                                    className="play-button"
                                                    onClick={() => window.open(`https://www.youtube.com/watch?v=${video.key}`, '_blank')}
                                                >
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M8 5v14l11-7z"/>
                                                    </svg>
                                                </button>
                                            </div>
                                            <h4>{video.name}</h4>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;