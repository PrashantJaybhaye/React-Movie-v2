import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WatchlistContext = createContext();

export const useWatchlist = () => {
    const context = useContext(WatchlistContext);
    if (!context) {
        throw new Error('useWatchlist must be used within a WatchlistProvider');
    }
    return context;
};

export const WatchlistProvider = ({ children }) => {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const { showSuccess, showError } = useToast();

    // Load watchlist from localStorage when user changes
    useEffect(() => {
        if (user) {
            loadWatchlist();
        } else {
            setWatchlist([]);
        }
    }, [user]);

    const loadWatchlist = () => {
        try {
            const savedWatchlist = localStorage.getItem(`watchlist_${user.$id}`);
            if (savedWatchlist) {
                setWatchlist(JSON.parse(savedWatchlist));
            }
        } catch (error) {
            console.error('Failed to load watchlist:', error);
        }
    };

    const saveWatchlist = (newWatchlist) => {
        try {
            localStorage.setItem(`watchlist_${user.$id}`, JSON.stringify(newWatchlist));
            setWatchlist(newWatchlist);
        } catch (error) {
            console.error('Failed to save watchlist:', error);
            showError('Failed to save to watchlist');
        }
    };

    const addToWatchlist = (movie) => {
        if (!user) {
            showError('Please log in to add movies to your watchlist');
            return false;
        }

        const isAlreadyInWatchlist = watchlist.some(item => item.id === movie.id);
        if (isAlreadyInWatchlist) {
            showError('Movie is already in your watchlist');
            return false;
        }

        const movieData = {
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            overview: movie.overview,
            addedAt: new Date().toISOString()
        };

        const newWatchlist = [...watchlist, movieData];
        saveWatchlist(newWatchlist);
        showSuccess(`"${movie.title}" added to your watchlist!`);
        return true;
    };

    const removeFromWatchlist = (movieId) => {
        const movieToRemove = watchlist.find(item => item.id === movieId);
        if (!movieToRemove) {
            showError('Movie not found in watchlist');
            return false;
        }

        const newWatchlist = watchlist.filter(item => item.id !== movieId);
        saveWatchlist(newWatchlist);
        showSuccess(`"${movieToRemove.title}" removed from your watchlist`);
        return true;
    };

    const isInWatchlist = (movieId) => {
        return watchlist.some(item => item.id === movieId);
    };

    const clearWatchlist = () => {
        if (watchlist.length === 0) {
            showError('Watchlist is already empty');
            return;
        }

        if (window.confirm('Are you sure you want to clear your entire watchlist?')) {
            saveWatchlist([]);
            showSuccess('Watchlist cleared successfully');
        }
    };

    const getWatchlistStats = () => {
        const totalMovies = watchlist.length;
        const genres = {};
        const years = {};
        let totalRating = 0;

        watchlist.forEach(movie => {
            // Count ratings
            if (movie.vote_average) {
                totalRating += movie.vote_average;
            }

            // Count years
            if (movie.release_date) {
                const year = new Date(movie.release_date).getFullYear();
                years[year] = (years[year] || 0) + 1;
            }
        });

        const averageRating = totalMovies > 0 ? (totalRating / totalMovies).toFixed(1) : 0;
        const mostCommonYear = Object.keys(years).reduce((a, b) => years[a] > years[b] ? a : b, null);

        return {
            totalMovies,
            averageRating,
            mostCommonYear,
            recentlyAdded: watchlist.slice(-5).reverse() // Last 5 movies added
        };
    };

    const value = {
        watchlist,
        loading,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        clearWatchlist,
        getWatchlistStats
    };

    return (
        <WatchlistContext.Provider value={value}>
            {children}
        </WatchlistContext.Provider>
    );
};
