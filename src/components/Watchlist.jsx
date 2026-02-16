import React from 'react';
import { Link } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';

const Watchlist = () => {
    const { watchlist, removeFromWatchlist, clearWatchlist, getWatchlistStats } = useWatchlist();
    const { user } = useAuth();
    const stats = getWatchlistStats();

    if (watchlist.length === 0) {
        return (
            <div style={{
                minHeight: '100vh',
                background: '#160000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 20px',
            }}>
                <div style={{
                    textAlign: 'center',
                    maxWidth: '440px',
                    animation: 'fadeInUp 0.6s ease-out',
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, rgba(229,9,20,0.1), rgba(255,59,63,0.1))',
                        border: '1px solid rgba(229,9,20,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 28px',
                        fontSize: '36px',
                    }}>
                        ❤️
                    </div>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        color: '#fff',
                        marginBottom: '12px',
                        fontFamily: '"Space Grotesk", sans-serif',
                        textAlign: 'center',
                    }}>
                        Your Watchlist is Empty
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '15px', lineHeight: '1.6', marginBottom: '32px' }}>
                        Start building your personal movie collection by adding movies you want to watch.
                    </p>
                    <Link
                        to="/"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 28px',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#fff',
                            background: 'linear-gradient(135deg, #e50914, #ff3b3f)',
                            textDecoration: 'none',
                            boxShadow: '0 4px 20px rgba(229, 9, 20, 0.3)',
                            transition: 'all 0.3s',
                        }}
                    >
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Discover Movies
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#160000', padding: '40px 20px 80px' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '48px',
                    animation: 'fadeInUp 0.5s ease-out',
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(229, 9, 20, 0.08)',
                        border: '1px solid rgba(229, 9, 20, 0.15)',
                        borderRadius: '100px',
                        padding: '6px 16px',
                        marginBottom: '16px',
                        fontSize: '13px',
                        color: '#FECECE',
                        fontWeight: '500',
                    }}>
                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Your Collection
                    </div>
                    <h1 style={{
                        fontSize: '36px',
                        fontWeight: '700',
                        color: '#fff',
                        fontFamily: '"Space Grotesk", sans-serif',
                        textAlign: 'center',
                    }}>
                        Watchlist
                    </h1>
                </div>

                {/* Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '14px',
                    marginBottom: '40px',
                    animation: 'fadeInUp 0.5s ease-out 0.1s both',
                }}>
                    <StatCard label="Total Movies" value={stats.totalMovies} icon="🎬" gradient="linear-gradient(135deg, rgba(229,9,20,0.1), rgba(255,59,63,0.1))" />
                    <StatCard label="Avg Rating" value={stats.averageRating} icon="⭐" gradient="linear-gradient(135deg, rgba(234,179,8,0.1), rgba(245,158,11,0.1))" />
                    <StatCard label="Top Year" value={stats.mostCommonYear || 'N/A'} icon="📅" gradient="linear-gradient(135deg, rgba(34,197,94,0.1), rgba(16,185,129,0.1))" />
                    <div style={{
                        padding: '20px',
                        borderRadius: '16px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                    }}>
                        <button
                            onClick={clearWatchlist}
                            style={{
                                padding: '8px 20px',
                                borderRadius: '10px',
                                fontSize: '13px',
                                fontWeight: '500',
                                color: '#f87171',
                                background: 'rgba(239,68,68,0.08)',
                                border: '1px solid rgba(239,68,68,0.15)',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                            }}
                        >
                            Clear All
                        </button>
                        <span style={{ fontSize: '11px', color: '#6b7280' }}>Remove all movies</span>
                    </div>
                </div>

                {/* Movie Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '18px',
                }}>
                    {watchlist.map((movie, index) => (
                        <WatchlistMovieCard
                            key={movie.id}
                            movie={movie}
                            index={index}
                            onRemove={removeFromWatchlist}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, gradient }) => (
    <div style={{
        padding: '20px',
        borderRadius: '16px',
        background: gradient,
        border: '1px solid rgba(255,255,255,0.05)',
        textAlign: 'center',
    }}>
        <div style={{ fontSize: '20px', marginBottom: '8px' }}>{icon}</div>
        <div style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#fff',
            fontFamily: '"Space Grotesk", sans-serif',
            marginBottom: '4px',
        }}>
            {value}
        </div>
        <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
    </div>
);

const WatchlistMovieCard = ({ movie, onRemove, index }) => {
    const handleRemove = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onRemove(movie.id);
    };

    return (
        <div
            className="group"
            style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = 'rgba(229,9,20,0.25)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.4), 0 0 30px rgba(229,9,20,0.08)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ position: 'relative', aspectRatio: '2/3', overflow: 'hidden' }}>
                    {movie.poster_path ? (
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s' }}
                            className="group-hover:scale-110"
                        />
                    ) : (
                        <div style={{
                            width: '100%', height: '100%',
                            background: 'linear-gradient(135deg, rgba(229,9,20,0.08), rgba(255,59,63,0.08))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '40px', opacity: 0.3,
                        }}>
                            🎬
                        </div>
                    )}

                    <button
                        onClick={handleRemove}
                        className="opacity-0 group-hover:opacity-100"
                        style={{
                            position: 'absolute', top: '8px', right: '8px',
                            width: '30px', height: '30px', borderRadius: '8px',
                            background: 'rgba(239,68,68,0.8)', backdropFilter: 'blur(10px)',
                            border: 'none', color: '#fff', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.3s',
                        }}
                        title="Remove from watchlist"
                    >
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {movie.vote_average > 0 && (
                        <div style={{
                            position: 'absolute', top: '8px', left: '8px',
                            padding: '4px 8px', borderRadius: '6px',
                            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
                            color: '#fff', fontSize: '11px', fontWeight: '700',
                            display: 'flex', alignItems: 'center', gap: '3px',
                        }}>
                            ⭐ {movie.vote_average.toFixed(1)}
                        </div>
                    )}

                    <div className="opacity-0 group-hover:opacity-100" style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(180deg, transparent 50%, rgba(22,0,0,0.9) 100%)',
                        transition: 'opacity 0.4s',
                    }} />
                </div>

                <div style={{ padding: '14px' }}>
                    <h3 style={{
                        color: '#fff', fontWeight: '600', fontSize: '14px', marginBottom: '6px',
                        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        fontFamily: '"Space Grotesk", sans-serif', transition: 'color 0.3s',
                    }} className="group-hover:!text-red-300">
                        {movie.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {movie.release_date && (
                            <span style={{ fontSize: '11px', color: '#6b7280', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)' }}>
                                {new Date(movie.release_date).getFullYear()}
                            </span>
                        )}
                        <span style={{ fontSize: '11px', color: '#4b5563' }}>
                            Added {new Date(movie.addedAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default Watchlist;
