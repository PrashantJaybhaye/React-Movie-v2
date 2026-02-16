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
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center">
                        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4">Your Watchlist</h1>
                        <p className="text-xl text-gray-300 mb-8">No movies in your watchlist yet</p>
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-md mx-auto">
                            <p className="text-gray-300 mb-6">Start building your personal movie collection by adding movies you want to watch!</p>
                            <Link 
                                to="/" 
                                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                            >
                                Discover Movies
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Your Watchlist</h1>
                    <p className="text-xl text-gray-300">Your personal movie collection</p>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
                        <div className="text-3xl font-bold text-blue-400 mb-2">{stats.totalMovies}</div>
                        <div className="text-gray-300">Total Movies</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
                        <div className="text-3xl font-bold text-purple-400 mb-2">{stats.averageRating}</div>
                        <div className="text-gray-300">Avg Rating</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
                        <div className="text-3xl font-bold text-pink-400 mb-2">{stats.mostCommonYear || 'N/A'}</div>
                        <div className="text-gray-300">Most Common Year</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
                        <button
                            onClick={clearWatchlist}
                            className="text-red-400 hover:text-red-300 font-medium transition-colors duration-200"
                        >
                            Clear All
                        </button>
                        <div className="text-gray-300 text-sm mt-1">Remove All Movies</div>
                    </div>
                </div>

                {/* Movies Grid */}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {watchlist.map((movie) => (
                        <WatchlistMovieCard 
                            key={movie.id} 
                            movie={movie} 
                            onRemove={removeFromWatchlist}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const WatchlistMovieCard = ({ movie, onRemove }) => {
    const handleRemove = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onRemove(movie.id);
    };

    return (
        <div className="group relative bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105">
            <Link to={`/movie/${movie.id}`}>
                <div className="aspect-[2/3] relative overflow-hidden">
                    {movie.poster_path ? (
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                            <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 3v1h6V3H9zM5 7v11h14V7H5z" />
                            </svg>
                        </div>
                    )}
                    
                    {/* Remove Button */}
                    <button
                        onClick={handleRemove}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
                        title="Remove from watchlist"
                    >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Rating Badge */}
                    {movie.vote_average > 0 && (
                        <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
                            ⭐ {movie.vote_average.toFixed(1)}
                        </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-4">
                    <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors duration-200">
                        {movie.title}
                    </h3>
                    
                    {movie.release_date && (
                        <p className="text-gray-400 text-xs mb-2">
                            {new Date(movie.release_date).getFullYear()}
                        </p>
                    )}

                    <p className="text-gray-400 text-xs">
                        Added {new Date(movie.addedAt).toLocaleDateString()}
                    </p>
                </div>
            </Link>
        </div>
    );
};

export default Watchlist;
