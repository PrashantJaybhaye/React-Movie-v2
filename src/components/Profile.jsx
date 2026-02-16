import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import { getDisplayName, getUserInitials } from '../utils/auth';

const Profile = () => {
    const { user, logout } = useAuth();
    const { watchlist } = useWatchlist();

    if (!user) return null;

    return (
        <div style={{
            minHeight: '100vh',
            background: '#160000',
            padding: '40px 20px 80px',
        }}>
            <div style={{
                maxWidth: '600px',
                margin: '0 auto',
                animation: 'fadeInUp 0.5s ease-out',
            }}>
                {/* Profile Card */}
                <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '24px',
                    padding: '40px 32px',
                    textAlign: 'center',
                    marginBottom: '24px',
                }}>
                    {/* Avatar */}
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #e50914, #ff3b3f)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        fontSize: '28px',
                        fontWeight: '700',
                        color: '#fff',
                        boxShadow: '0 8px 30px rgba(229, 9, 20, 0.3)',
                    }}>
                        {getUserInitials(user)}
                    </div>

                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: '#fff',
                        fontFamily: '"Space Grotesk", sans-serif',
                        marginBottom: '6px',
                        textAlign: 'center',
                    }}>
                        {getDisplayName(user)}
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
                        Movie enthusiast
                    </p>

                    {/* Stats */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '16px',
                        flexWrap: 'wrap',
                    }}>
                        <div style={{
                            padding: '10px 20px',
                            borderRadius: '12px',
                            background: 'rgba(229,9,20,0.08)',
                            border: '1px solid rgba(229,9,20,0.12)',
                        }}>
                            <span style={{ fontSize: '20px', fontWeight: '700', color: '#e50914' }}>{watchlist.length}</span>
                            <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '6px' }}>Watchlist</span>
                        </div>
                        <div style={{
                            padding: '10px 20px',
                            borderRadius: '12px',
                            background: 'rgba(234,179,8,0.08)',
                            border: '1px solid rgba(234,179,8,0.12)',
                        }}>
                            <span style={{ fontSize: '20px', fontWeight: '700', color: '#eab308' }}>
                                {watchlist.length > 0
                                    ? (watchlist.reduce((acc, m) => acc + (m.vote_average || 0), 0) / watchlist.length).toFixed(1)
                                    : '0'}
                            </span>
                            <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '6px' }}>Avg Rating</span>
                        </div>
                        <div style={{
                            padding: '10px 20px',
                            borderRadius: '12px',
                            background: 'rgba(34,197,94,0.08)',
                            border: '1px solid rgba(34,197,94,0.12)',
                        }}>
                            <span style={{ fontSize: '20px', fontWeight: '700', color: '#22c55e' }}>
                                {new Set(watchlist.map(m => m.original_language)).size || 0}
                            </span>
                            <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '6px' }}>Languages</span>
                        </div>
                    </div>
                </div>

                {/* Account Details */}
                <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '20px',
                    padding: '24px',
                    marginBottom: '24px',
                }}>
                    <h3 style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#9ca3af',
                        marginBottom: '16px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                    }}>
                        Account Details
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.02)',
                        }}>
                            <span style={{ color: '#6b7280', fontSize: '13px' }}>Email</span>
                            <span style={{ color: '#fff', fontSize: '13px', fontWeight: '500' }}>{user.email}</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.02)',
                        }}>
                            <span style={{ color: '#6b7280', fontSize: '13px' }}>Member since</span>
                            <span style={{ color: '#fff', fontSize: '13px', fontWeight: '500' }}>
                                {user.metadata?.creationTime
                                    ? new Date(user.metadata.creationTime).toLocaleDateString()
                                    : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Link
                        to="/watchlist"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '14px',
                            borderRadius: '14px',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#fff',
                            background: 'linear-gradient(135deg, #e50914, #ff3b3f)',
                            textDecoration: 'none',
                            boxShadow: '0 4px 20px rgba(229, 9, 20, 0.2)',
                            transition: 'all 0.3s',
                        }}
                    >
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        View Watchlist
                    </Link>
                    <Link
                        to="/"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '14px',
                            borderRadius: '14px',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#FECECE',
                            background: 'rgba(229,9,20,0.08)',
                            border: '1px solid rgba(229,9,20,0.15)',
                            textDecoration: 'none',
                            transition: 'all 0.3s',
                        }}
                    >
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Browse Movies
                    </Link>
                    <button
                        onClick={logout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '14px',
                            borderRadius: '14px',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#f87171',
                            background: 'rgba(239,68,68,0.06)',
                            border: '1px solid rgba(239,68,68,0.1)',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                        }}
                    >
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
