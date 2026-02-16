import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    signUpUser,
    signInUser,
    signInWithGoogle,
    signOutUser,
    onAuthChange
} from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

/**
 * Normalize Firebase User object to the shape the app expects.
 * Appwrite used $id, $createdAt — we map Firebase equivalents so
 * components like Profile.jsx keep working without extra changes.
 */
const normalizeUser = (firebaseUser) => {
    if (!firebaseUser) return null;
    return {
        uid: firebaseUser.uid,
        $id: firebaseUser.uid,                          // backward-compat
        name: firebaseUser.displayName || '',
        email: firebaseUser.email || '',
        $createdAt: firebaseUser.metadata?.creationTime || new Date().toISOString(),
        photoURL: firebaseUser.photoURL || null,
    };
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);   // start true to wait for auth check

    // Listen for auth state changes on mount
    useEffect(() => {
        const unsubscribe = onAuthChange((firebaseUser) => {
            setUser(normalizeUser(firebaseUser));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        try {
            setLoading(true);
            await signInUser(email, password);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const signup = async (email, password, name) => {
        try {
            setLoading(true);
            await signUpUser(email, password, name);
            return { success: true };
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = async () => {
        try {
            setLoading(true);
            await signInWithGoogle();
            return { success: true };
        } catch (error) {
            console.error('Google login error:', error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await signOutUser();
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }
    };

    const checkAuthStatus = async () => {
        // Auth state is automatically tracked via onAuthStateChanged
        // This is kept for backward compatibility
    };

    const value = {
        user,
        loading,
        login,
        signup,
        loginWithGoogle,
        logout,
        checkAuthStatus,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
