import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

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
            <header style={{
                background: 'rgba(22, 0, 0, 0.7)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                position: 'sticky',
                top: 0,
                zIndex: 50,
                margin: 0,
                padding: 0,
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
                        {/* Logo */}
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #e50914, #ff3b3f)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '18px',
                                boxShadow: '0 4px 15px rgba(229, 9, 20, 0.3)',
                            }}>
                                🎬
                            </div>
                            <span style={{
                                fontSize: '22px',
                                fontWeight: '700',
                                fontFamily: '"Space Grotesk", sans-serif',
                                background: 'linear-gradient(135deg, #fff 0%, #FECECE 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                letterSpacing: '-0.5px',
                            }}>
                                Funverse
                            </span>
                        </Link>

                        {/* Navigation */}
                        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Link
                                to="/"
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '10px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: isActive('/') ? '#fff' : 'rgba(255,255,255,0.5)',
                                    background: isActive('/') ? 'rgba(229, 9, 20, 0.12)' : 'transparent',
                                    border: isActive('/') ? '1px solid rgba(229, 9, 20, 0.2)' : '1px solid transparent',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                Home
                            </Link>

                            <Link
                                to="/watchlist"
                                style={{
                                    position: 'relative',
                                    padding: '8px 16px',
                                    borderRadius: '10px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: isActive('/watchlist') ? '#fff' : 'rgba(255,255,255,0.5)',
                                    background: isActive('/watchlist') ? 'rgba(229, 9, 20, 0.12)' : 'transparent',
                                    border: isActive('/watchlist') ? '1px solid rgba(229, 9, 20, 0.2)' : '1px solid transparent',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                Watchlist
                                {watchlist.length > 0 && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '-4px',
                                        right: '-4px',
                                        background: 'linear-gradient(135deg, #e50914, #ff3b3f)',
                                        color: '#fff',
                                        fontSize: '10px',
                                        fontWeight: '700',
                                        borderRadius: '50%',
                                        width: '18px',
                                        height: '18px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 2px 8px rgba(229, 9, 20, 0.4)',
                                    }}>
                                        {watchlist.length}
                                    </span>
                                )}
                            </Link>

                            {/* Auth */}
                            {user ? (
                                <div style={{ position: 'relative', marginLeft: '8px' }}>
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            background: 'rgba(255,255,255,0.04)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            borderRadius: '12px',
                                            padding: '6px 14px 6px 6px',
                                            cursor: 'pointer',
                                            color: 'rgba(255,255,255,0.7)',
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '8px',
                                            background: 'linear-gradient(135deg, #e50914, #ff3b3f)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#fff',
                                            fontWeight: '600',
                                            fontSize: '13px',
                                        }}>
                                            {getUserInitials(user)}
                                        </div>
                                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#fff' }}>
                                            {getDisplayName(user)}
                                        </span>
                                        <svg
                                            width="14" height="14"
                                            style={{ transition: 'transform 0.3s', transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0)' }}
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {showUserMenu && (
                                        <div style={{
                                            position: 'absolute',
                                            right: 0,
                                            marginTop: '8px',
                                            width: '220px',
                                            background: 'rgba(22, 0, 0, 0.95)',
                                            backdropFilter: 'blur(30px)',
                                            borderRadius: '14px',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                                            overflow: 'hidden',
                                            animation: 'slideDown 0.2s ease-out',
                                            zIndex: 60,
                                        }}>
                                            <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                                <p style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Signed in as</p>
                                                <p style={{ fontSize: '13px', fontWeight: '600', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
                                            </div>
                                            <div style={{ padding: '6px' }}>
                                                <Link
                                                    to="/profile"
                                                    onClick={() => setShowUserMenu(false)}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '10px',
                                                        padding: '10px 12px',
                                                        borderRadius: '8px',
                                                        fontSize: '13px',
                                                        color: '#FECECE',
                                                        textDecoration: 'none',
                                                        transition: 'background 0.2s',
                                                    }}
                                                    onMouseEnter={e => e.target.style.background = 'rgba(229,9,20,0.1)'}
                                                    onMouseLeave={e => e.target.style.background = 'transparent'}
                                                >
                                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    Profile
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '10px',
                                                        padding: '10px 12px',
                                                        borderRadius: '8px',
                                                        fontSize: '13px',
                                                        color: '#f87171',
                                                        background: 'transparent',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        width: '100%',
                                                        textAlign: 'left',
                                                        transition: 'background 0.2s',
                                                    }}
                                                    onMouseEnter={e => e.target.style.background = 'rgba(248,113,113,0.1)'}
                                                    onMouseLeave={e => e.target.style.background = 'transparent'}
                                                >
                                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => { setShowAuthModal(true); setIsSignUp(false); }}
                                    style={{
                                        marginLeft: '8px',
                                        padding: '8px 20px',
                                        borderRadius: '10px',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        color: '#fff',
                                        background: 'linear-gradient(135deg, #e50914, #ff3b3f)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 15px rgba(229, 9, 20, 0.3)',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    Sign In
                                </button>
                            )}
                        </nav>
                    </div>
                </div>

                {showUserMenu && (
                    <div
                        style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                        onClick={() => setShowUserMenu(false)}
                    />
                )}
            </header>

            {/* Auth Modal */}
            {showAuthModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(8px)',
                }}>
                    <div style={{
                        background: 'linear-gradient(180deg, rgba(40, 10, 10, 0.98), rgba(22, 0, 0, 0.98))',
                        border: '1px solid rgba(229, 9, 20, 0.15)',
                        borderRadius: '24px',
                        boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 60px rgba(229, 9, 20, 0.08)',
                        width: '100%',
                        maxWidth: '420px',
                        margin: '0 16px',
                        padding: '40px',
                        position: 'relative',
                        animation: 'fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}>
                        {/* Close */}
                        <button
                            onClick={() => { setShowAuthModal(false); setAuthError(''); }}
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '10px',
                                padding: '8px',
                                cursor: 'pointer',
                                color: '#9ca3af',
                                display: 'flex',
                                transition: 'all 0.3s',
                            }}
                        >
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Icon */}
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, rgba(229,9,20,0.15), rgba(255,59,63,0.15))',
                            border: '1px solid rgba(229,9,20,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                            fontSize: '24px',
                        }}>
                            {isSignUp ? '✨' : '👋'}
                        </div>

                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: '#fff',
                            textAlign: 'center',
                            marginBottom: '6px',
                            fontFamily: '"Space Grotesk", sans-serif',
                        }}>
                            {isSignUp ? 'Create Account' : 'Welcome Back'}
                        </h2>
                        <p style={{ textAlign: 'center', fontSize: '14px', color: '#9ca3af', marginBottom: '28px' }}>
                            {isSignUp ? 'Join Funverse to track your movies' : 'Sign in to continue to Funverse'}
                        </p>

                        {/* Google */}
                        <button
                            onClick={handleGoogleLogin}
                            disabled={authLoading}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                padding: '12px',
                                borderRadius: '12px',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#fff',
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                opacity: authLoading ? 0.5 : 1,
                                marginBottom: '20px',
                            }}
                        >
                            <svg viewBox="0 0 24 24" width="18" height="18">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }}></div>
                            <span style={{ color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>or</span>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }}></div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {isSignUp && (
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#9ca3af', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Name</label>
                                    <input
                                        type="text"
                                        value={authForm.name}
                                        onChange={(e) => setAuthForm(prev => ({ ...prev, name: e.target.value }))}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            borderRadius: '12px',
                                            fontSize: '14px',
                                            color: '#fff',
                                            background: 'rgba(255,255,255,0.04)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            outline: 'none',
                                            transition: 'border-color 0.3s',
                                        }}
                                        placeholder="Your name"
                                    />
                                </div>
                            )}
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#9ca3af', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</label>
                                <input
                                    type="email"
                                    value={authForm.email}
                                    onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        fontSize: '14px',
                                        color: '#fff',
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        outline: 'none',
                                        transition: 'border-color 0.3s',
                                    }}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#9ca3af', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
                                <input
                                    type="password"
                                    value={authForm.password}
                                    onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        fontSize: '14px',
                                        color: '#fff',
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        outline: 'none',
                                        transition: 'border-color 0.3s',
                                    }}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>

                            {authError && (
                                <div style={{
                                    padding: '10px 14px',
                                    borderRadius: '10px',
                                    fontSize: '13px',
                                    color: '#fca5a5',
                                    background: 'rgba(239,68,68,0.1)',
                                    border: '1px solid rgba(239,68,68,0.15)',
                                }}>
                                    {authError}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={authLoading}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#fff',
                                    background: 'linear-gradient(135deg, #e50914, #ff3b3f)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 20px rgba(229, 9, 20, 0.3)',
                                    transition: 'all 0.3s',
                                    opacity: authLoading ? 0.5 : 1,
                                    marginTop: '4px',
                                }}
                            >
                                {authLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
                            </button>
                        </form>

                        <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b7280', marginTop: '20px' }}>
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                            <button
                                onClick={() => { setIsSignUp(!isSignUp); setAuthError(''); }}
                                style={{
                                    color: '#e50914',
                                    fontWeight: '600',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    transition: 'color 0.3s',
                                }}
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
