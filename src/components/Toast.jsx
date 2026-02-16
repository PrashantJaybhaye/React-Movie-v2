import React, { useEffect, useState } from 'react';

const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getStyles = () => {
        const base = {
            padding: '14px 20px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
            animation: 'slideDown 0.3s ease-out',
            maxWidth: '400px',
        };

        switch (type) {
            case 'success':
                return { ...base, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)', color: '#86efac' };
            case 'error':
                return { ...base, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' };
            case 'warning':
                return { ...base, background: 'rgba(234,179,8,0.12)', border: '1px solid rgba(234,179,8,0.2)', color: '#fde68a' };
            default:
                return { ...base, background: 'rgba(229,9,20,0.12)', border: '1px solid rgba(229,9,20,0.2)', color: '#FECECE' };
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return (
                    <svg width="20" height="20" fill="none" stroke="#22c55e" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'error':
                return (
                    <svg width="20" height="20" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            case 'warning':
                return (
                    <svg width="20" height="20" fill="none" stroke="#eab308" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                );
            default:
                return (
                    <svg width="20" height="20" fill="none" stroke="#e50914" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    return (
        <div style={getStyles()}>
            <div style={{ flexShrink: 0 }}>{getIcon()}</div>
            <span style={{ fontSize: '14px', fontWeight: '500', flex: 1 }}>{message}</span>
            <button
                onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }}
                style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px',
                    cursor: 'pointer',
                    color: 'inherit',
                    opacity: 0.6,
                    transition: 'opacity 0.2s',
                    display: 'flex',
                    flexShrink: 0,
                }}
            >
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

export const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            zIndex: 200,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
        }}>
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                    duration={toast.duration}
                />
            ))}
        </div>
    );
};

export default Toast;
