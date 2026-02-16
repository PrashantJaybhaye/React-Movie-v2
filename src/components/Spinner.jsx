import React from 'react';

const Spinner = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            padding: '40px',
        }}>
            <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: '3px solid rgba(229, 9, 20, 0.1)',
                borderTopColor: '#e50914',
                animation: 'spin-slow 0.8s linear infinite',
                boxShadow: '0 0 20px rgba(229, 9, 20, 0.15)',
            }} />
            <span style={{
                fontSize: '13px',
                color: '#6b7280',
                fontWeight: '500',
                letterSpacing: '0.5px',
            }}>
                Loading...
            </span>
        </div>
    );
};

export default Spinner;
