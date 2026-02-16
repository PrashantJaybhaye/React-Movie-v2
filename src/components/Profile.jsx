import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import { Link, Navigate } from 'react-router-dom';
import { getDisplayName, getUserInitials, formatDate } from '../utils/auth';

const Profile = () => {
    const { user, logout } = useAuth();
    const { getWatchlistStats } = useWatchlist();
    const stats = getWatchlistStats();

    // Redirect if not authenticated
    if (!user) {
        return <Navigate to="/" replace />;
    }

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
                    <div className="text-center mb-8">
                        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
                            {getUserInitials(user)}
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {getDisplayName(user)}
                        </h1>
                        <p className="text-gray-300">Welcome to your movie profile</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Profile Information */}
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                            <h2 className="text-xl font-semibold text-white mb-4">Profile Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Full Name
                                    </label>
                                    <p className="text-white bg-white/10 px-3 py-2 rounded-lg">
                                        {user.name || 'Not provided'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Email Address
                                    </label>
                                    <p className="text-white bg-white/10 px-3 py-2 rounded-lg">
                                        {user.email}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Account Created
                                    </label>
                                    <p className="text-white bg-white/10 px-3 py-2 rounded-lg">
                                        {formatDate(user.$createdAt)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Movie Stats */}
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                            <h2 className="text-xl font-semibold text-white mb-4">Movie Stats</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                                    <span className="text-gray-300">Watchlist Movies</span>
                                    <span className="text-white font-semibold">{stats.totalMovies}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                                    <span className="text-gray-300">Average Rating</span>
                                    <span className="text-white font-semibold">{stats.averageRating}/10</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                                    <span className="text-gray-300">Most Common Year</span>
                                    <span className="text-white font-semibold">{stats.mostCommonYear || 'N/A'}</span>
                                </div>
                                <Link
                                    to="/watchlist"
                                    className="block w-full text-center p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                                >
                                    View Watchlist
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center gap-4">
                        <Link
                            to="/"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 inline-block"
                        >
                            Back to Movies
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600/80 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
