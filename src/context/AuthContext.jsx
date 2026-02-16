import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        $id: 'guest_user',
        name: 'Guest User',
        email: 'guest@example.com',
        $createdAt: new Date().toISOString()
    });
    const [loading, setLoading] = useState(false);

    const login = async () => ({ success: true });
    const signup = async () => ({ success: true });
    const logout = async () => ({ success: true });
    const checkAuthStatus = async () => { };

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
