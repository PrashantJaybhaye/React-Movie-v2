import React from 'react';
import WatchlistButton from './WatchlistButton';

const MovieCard = ({
    movie,
    onClick,
    index = 0
}) => {
    const { id, title, vote_average, poster_path, release_date, original_language, overview } = movie;

    const getRatingColor = (rating) => {
        if (rating >= 7) return '#22c55e';
        if (rating >= 5) return '#eab308';
        return '#ef4444';
    };

    return (
        <div
            className="group"
            onClick={onClick}
            style={{
                position: 'relative',
                borderRadius: '18px',
                overflow: 'hidden',
                cursor: 'pointer',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: `fadeInUp 0.5s ease-out ${index * 0.06}s both`,
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = 'rgba(229, 9, 20, 0.25)';
                e.currentTarget.style.boxShadow = '0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(229,9,20,0.08)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            {/* Poster */}
            <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '2/3' }}>
                <img
                    src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no-movie.png'}
                    alt={title}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    className="group-hover:scale-110"
                />

                {/* Watchlist Button */}
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                }} className="group-hover:!opacity-100">
                    <WatchlistButton movie={movie} size="small" />
                </div>

                {/* Rating Badge */}
                {vote_average > 0 && (
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#fff',
                        background: 'rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${getRatingColor(vote_average)}30`,
                    }}>
                        <svg width="12" height="12" viewBox="0 0 20 20" fill={getRatingColor(vote_average)}>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>{vote_average.toFixed(1)}</span>
                    </div>
                )}

                {/* Bottom Gradient Overlay */}
                <div className="opacity-0 group-hover:opacity-100" style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, transparent 40%, rgba(22,0,0,0.95) 100%)',
                    transition: 'opacity 0.4s ease',
                }} />

                {/* View Details */}
                <div className="opacity-0 group-hover:opacity-100" style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    right: '16px',
                    transition: 'opacity 0.4s ease, transform 0.4s ease',
                }}>
                    <button style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#fff',
                        background: 'linear-gradient(135deg, rgba(229,9,20,0.8), rgba(255,59,63,0.8))',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(229,9,20,0.3)',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                    }}>
                        View Details
                    </button>
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: '16px' }}>
                <h3 style={{
                    color: '#fff',
                    fontWeight: '600',
                    fontSize: '15px',
                    lineHeight: '1.4',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    fontFamily: '"Space Grotesk", sans-serif',
                    marginBottom: '8px',
                    transition: 'color 0.3s',
                }} className="group-hover:!text-red-300">
                    {title}
                </h3>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    color: '#6b7280',
                    marginBottom: '8px',
                }}>
                    <span style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.06)',
                    }}>
                        {release_date ? release_date.split('-')[0] : 'N/A'}
                    </span>
                    <span style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                    }}>
                        {original_language}
                    </span>
                </div>

                {overview && (
                    <p style={{
                        color: '#6b7280',
                        fontSize: '12px',
                        lineHeight: '1.5',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                    }}>
                        {overview}
                    </p>
                )}
            </div>
        </div>
    );
};

export default MovieCard;
