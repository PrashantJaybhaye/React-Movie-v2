import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import { getDisplayName, getUserInitials } from '../utils/auth';

const Header = () => {
    const { user } = useAuth();
    const { watchlist } = useWatchlist();
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <header className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            🎬 MovieApp
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center space-x-6">
                        <Link
                            to="/"
                            className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                        >
                            Home
                        </Link>

                        <Link
                            to="/watchlist"
                            className="relative text-gray-300 hover:text-white transition-colors duration-200 font-medium flex items-center space-x-1"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>Watchlist</span>
                            {watchlist.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {watchlist.length}
                                </span>
                            )}
                        </Link>

                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
                            >
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                    {getUserInitials(user)}
                                </div>
                                <span className="hidden sm:block font-medium">{getDisplayName(user)}</span>
                                <svg
                                    className={`w-4 h-4 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-lg rounded-lg shadow-lg border border-white/10 py-2">
                                    <div className="px-4 py-2 border-b border-white/10">
                                        <p className="text-sm text-gray-300">Logged in as</p>
                                        <p className="text-sm font-medium text-white truncate">{user.email}</p>
                                    </div>
                                    <Link
                                        to="/profile"
                                        onClick={() => setShowUserMenu(false)}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
                                    >
                                        Profile
                                    </Link>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            </div>

            {/* Close user menu when clicking outside */}
            {showUserMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                />
            )}
        </header>
    );
};

export default Header;
