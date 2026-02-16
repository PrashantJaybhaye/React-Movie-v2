import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'white', className = '' }) => {
    const getSizeClasses = () => {
        switch (size) {
            case 'small':
                return 'h-4 w-4';
            case 'large':
                return 'h-12 w-12';
            case 'xlarge':
                return 'h-16 w-16';
            default:
                return 'h-8 w-8';
        }
    };

    const getColorClasses = () => {
        switch (color) {
            case 'blue':
                return 'border-blue-500';
            case 'purple':
                return 'border-purple-500';
            case 'gray':
                return 'border-gray-500';
            default:
                return 'border-white';
        }
    };

    return (
        <div className={`animate-spin rounded-full border-2 border-t-transparent ${getSizeClasses()} ${getColorClasses()} ${className}`} />
    );
};

// Full screen loading component
export const FullScreenLoader = ({ message = 'Loading...' }) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                <LoadingSpinner size="large" className="mx-auto mb-4" />
                <p className="text-white text-lg font-medium">{message}</p>
            </div>
        </div>
    );
};

// Inline loading component
export const InlineLoader = ({ message = 'Loading...', className = '' }) => {
    return (
        <div className={`flex items-center justify-center space-x-3 ${className}`}>
            <LoadingSpinner size="small" />
            <span className="text-gray-300 text-sm">{message}</span>
        </div>
    );
};

export default LoadingSpinner;
