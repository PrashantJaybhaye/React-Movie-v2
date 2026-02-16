import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import {
    getUserWatchlist,
    addMovieToWatchlist,
    removeMovieFromWatchlist,
    clearUserWatchlist
} from '../firebase';

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

    // Load watchlist from Firestore when user changes
    useEffect(() => {
        if (user) {
            loadWatchlist();
        } else {
            setWatchlist([]);
        }
    }, [user]);

    const loadWatchlist = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const movies = await getUserWatchlist(user.uid);
            setWatchlist(movies);
        } catch (error) {
            console.error('Failed to load watchlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToWatchlist = async (movie) => {
        if (!user) {
            showError('Please log in to add movies to your watchlist');
            return false;
        }

        const isAlreadyInWatchlist = watchlist.some(item => item.id === movie.id);
        if (isAlreadyInWatchlist) {
            showError('Movie is already in your watchlist');
            return false;
        }

        try {
            const movieData = await addMovieToWatchlist(user.uid, movie);
            setWatchlist(prev => [...prev, movieData]);
            showSuccess(`"${movie.title}" added to your watchlist!`);
            return true;
        } catch (error) {
            console.error('Failed to add to watchlist:', error);
            showError('Failed to add movie to watchlist');
            return false;
        }
    };

    const removeFromWatchlist = async (movieId) => {
        const movieToRemove = watchlist.find(item => item.id === movieId);
        if (!movieToRemove) {
            showError('Movie not found in watchlist');
            return false;
        }

        try {
            await removeMovieFromWatchlist(user.uid, movieId);
            setWatchlist(prev => prev.filter(item => item.id !== movieId));
            showSuccess(`"${movieToRemove.title}" removed from your watchlist`);
            return true;
        } catch (error) {
            console.error('Failed to remove from watchlist:', error);
            showError('Failed to remove movie from watchlist');
            return false;
        }
    };

    const isInWatchlist = (movieId) => {
        return watchlist.some(item => item.id === movieId);
    };

    const clearWatchlist = async () => {
        if (watchlist.length === 0) {
            showError('Watchlist is already empty');
            return;
        }

        if (window.confirm('Are you sure you want to clear your entire watchlist?')) {
            try {
                await clearUserWatchlist(user.uid);
                setWatchlist([]);
                showSuccess('Watchlist cleared successfully');
            } catch (error) {
                console.error('Failed to clear watchlist:', error);
                showError('Failed to clear watchlist');
            }
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
