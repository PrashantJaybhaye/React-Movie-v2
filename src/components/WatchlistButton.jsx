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

    const getSizeClasses = () => {
        switch (size) {
            case 'small':
                return 'w-8 h-8 text-sm';
            case 'large':
                return 'w-12 h-12 text-lg px-4 py-2';
            default:
                return 'w-10 h-10 text-base';
        }
    };

    const getVariantClasses = () => {
        if (variant === 'text') {
            return inWatchlist 
                ? 'text-red-400 hover:text-red-300' 
                : 'text-blue-400 hover:text-blue-300';
        }
        
        return inWatchlist
            ? 'bg-red-500/80 hover:bg-red-500 text-white'
            : 'bg-blue-500/80 hover:bg-blue-500 text-white';
    };

    if (variant === 'text') {
        return (
            <button
                onClick={handleClick}
                className={`flex items-center space-x-2 font-medium transition-colors duration-200 ${getVariantClasses()}`}
                title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            >
                <svg className="w-5 h-5" fill={inWatchlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}</span>
            </button>
        );
    }

    return (
        <button
            onClick={handleClick}
            className={`${getSizeClasses()} ${getVariantClasses()} rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 backdrop-blur-sm`}
            title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
        >
            {inWatchlist ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            )}
        </button>
    );
};

export default WatchlistButton;
