import React, { useState } from 'react';

const Search = ({ searchTerm, setSearchTerm }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div style={{
            width: '100%',
            maxWidth: '640px',
            margin: '28px auto 0',
            position: 'relative',
        }}>
            <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
                borderRadius: '16px',
                background: isFocused
                    ? 'rgba(229, 9, 20, 0.06)'
                    : 'rgba(255, 255, 255, 0.03)',
                border: isFocused
                    ? '1px solid rgba(229, 9, 20, 0.3)'
                    : '1px solid rgba(255, 255, 255, 0.06)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isFocused
                    ? '0 0 40px rgba(229, 9, 20, 0.08), inset 0 0 30px rgba(229, 9, 20, 0.02)'
                    : 'none',
            }}>
                <div style={{ padding: '10px 12px 10px 16px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke={isFocused ? '#e50914' : '#6b7280'}
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        style={{ transition: 'stroke 0.3s' }}>
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Search for movies..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    style={{
                        flex: 1, background: 'transparent', border: 'none', outline: 'none',
                        color: '#fff', fontSize: '15px', padding: '12px 0',
                        fontFamily: '"Inter", sans-serif',
                    }}
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        style={{
                            padding: '8px 14px', background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px',
                            color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center',
                            fontSize: '12px', gap: '4px', marginRight: '4px', transition: 'all 0.2s', flexShrink: 0,
                        }}
                    >
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear
                    </button>
                )}
            </div>
            {!searchTerm && !isFocused && (
                <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(107,114,128,0.6)', marginTop: '10px' }}>
                    Try "Inception", "Avatar", or "The Dark Knight"
                </p>
            )}
        </div>
    );
};

export default Search;
