import React from 'react';
import { useWatchlist } from '../context/WatchlistContext';

const WatchlistButton = ({ movie, size = 'medium', variant = 'default' }) => {
    const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
    const inWatchlist = isInWatchlist(movie.id);

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (inWatchlist) {
            removeFromWatchlist(movie.id);
        } else {
            addToWatchlist(movie);
        }
    };

    const getSizeStyle = () => {
        switch (size) {
            case 'small':
                return { width: '32px', height: '32px', iconSize: 14 };
            case 'large':
                return { width: '44px', height: '44px', iconSize: 20 };
            default:
                return { width: '38px', height: '38px', iconSize: 18 };
        }
    };

    const sizeStyle = getSizeStyle();

    if (variant === 'text') {
        return (
            <button
                onClick={handleClick}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#fff',
                    background: inWatchlist
                        ? 'rgba(239, 68, 68, 0.1)'
                        : 'rgba(229, 9, 20, 0.1)',
                    border: inWatchlist
                        ? '1px solid rgba(239, 68, 68, 0.2)'
                        : '1px solid rgba(229, 9, 20, 0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                }}
                title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            >
                <svg
                    width="18"
                    height="18"
                    fill={inWatchlist ? '#ef4444' : 'none'}
                    stroke={inWatchlist ? '#ef4444' : '#e50914'}
                    viewBox="0 0 24 24"
                    style={{ transition: 'all 0.3s' }}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span style={{ color: inWatchlist ? '#f87171' : '#FECECE' }}>
                    {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </span>
            </button>
        );
    }

    return (
        <button
            onClick={handleClick}
            style={{
                width: sizeStyle.width,
                height: sizeStyle.height,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: inWatchlist
                    ? 'rgba(239, 68, 68, 0.8)'
                    : 'rgba(229, 9, 20, 0.8)',
                backdropFilter: 'blur(10px)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: inWatchlist
                    ? '0 4px 12px rgba(239, 68, 68, 0.3)'
                    : '0 4px 12px rgba(229, 9, 20, 0.3)',
            }}
            title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
        >
            {inWatchlist ? (
                <svg width={sizeStyle.iconSize} height={sizeStyle.iconSize} fill="none" stroke="#fff" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            ) : (
                <svg width={sizeStyle.iconSize} height={sizeStyle.iconSize} fill="none" stroke="#fff" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            )}
        </button>
    );
};

export default WatchlistButton;
