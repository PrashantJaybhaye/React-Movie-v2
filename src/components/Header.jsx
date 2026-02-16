import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import { getDisplayName, getUserInitials } from '../utils/auth';

const Header = () => {
    const { user, login, signup, loginWithGoogle, logout, loading } = useAuth();
    const { watchlist } = useWatchlist();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [authForm, setAuthForm] = useState({ email: '', password: '', name: '' });
    const [authError, setAuthError] = useState('');
    const [authLoading, setAuthLoading] = useState(false);

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setAuthError('');
        setAuthLoading(true);

        let result;
        if (isSignUp) {
            result = await signup(authForm.email, authForm.password, authForm.name);
        } else {
            result = await login(authForm.email, authForm.password);
        }

        setAuthLoading(false);
        if (result.success) {
            setShowAuthModal(false);
            setAuthForm({ email: '', password: '', name: '' });
        } else {
            setAuthError(result.error || 'Authentication failed');
        }
    };

    const handleGoogleLogin = async () => {
        setAuthError('');
        setAuthLoading(true);
        const result = await loginWithGoogle();
        setAuthLoading(false);
        if (result.success) {
            setShowAuthModal(false);
        } else {
            setAuthError(result.error || 'Google sign-in failed');
        }
    };

    const handleLogout = async () => {
        setShowUserMenu(false);
        await logout();
    };

    return (
        <>
            <header className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                🎬 Funverse
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

                            {/* Auth Section */}
                            {user ? (
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
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors duration-200"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => { setShowAuthModal(true); setIsSignUp(false); }}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm"
                                >
                                    Sign In
                                </button>
                            )}
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

            {/* Auth Modal */}
            {showAuthModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-gray-900/95 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 relative animate-fade-in">
                        {/* Close Button */}
                        <button
                            onClick={() => { setShowAuthModal(false); setAuthError(''); }}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h2 className="text-2xl font-bold text-white mb-6 text-center">
                            {isSignUp ? 'Create Account' : 'Welcome Back'}
                        </h2>

                        {/* Google Sign In */}
                        <button
                            onClick={handleGoogleLogin}
                            disabled={authLoading}
                            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-medium py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 mb-4 disabled:opacity-50"
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>

                        <div className="flex items-center gap-4 my-4">
                            <div className="flex-1 h-px bg-white/20"></div>
                            <span className="text-gray-400 text-sm">or</span>
                            <div className="flex-1 h-px bg-white/20"></div>
                        </div>

                        {/* Email/Password Form */}
                        <form onSubmit={handleAuthSubmit} className="space-y-4">
                            {isSignUp && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={authForm.name}
                                        onChange={(e) => setAuthForm(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Your name"
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={authForm.email}
                                    onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                                <input
                                    type="password"
                                    value={authForm.password}
                                    onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>

                            {authError && (
                                <div className="bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-2 text-red-300 text-sm">
                                    {authError}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={authLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
                            >
                                {authLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
                            </button>
                        </form>

                        <p className="text-center text-gray-400 text-sm mt-4">
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                            <button
                                onClick={() => { setIsSignUp(!isSignUp); setAuthError(''); }}
                                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                            >
                                {isSignUp ? 'Sign In' : 'Sign Up'}
                            </button>
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
