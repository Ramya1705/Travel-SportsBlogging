// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import API from '../api/axios';

// Create the authentication context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // State variables to hold authentication information
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // ====================================
    // Token Management Utilities
    // ====================================
    /**
     * Retrieves a valid authentication token from local or session storage.
     * Checks multiple common key names for flexibility.
     */
    const getTokenFromStorage = () => {
        try {
            const tokenKeys = ['token', 'authToken', 'accessToken', 'jwt'];
            for (const key of tokenKeys) {
                const storedToken = localStorage.getItem(key);
                if (storedToken && storedToken !== 'null' && storedToken !== 'undefined') {
                    return storedToken;
                }
            }
            for (const key of tokenKeys) {
                const storedToken = sessionStorage.getItem(key);
                if (storedToken && storedToken !== 'null' && storedToken !== 'undefined') {
                    return storedToken;
                }
            }
            return null;
        } catch (error) {
            console.error('Error reading token from storage:', error);
            return null;
        }
    };

    /**
     * Stores or removes the authentication token from local storage.
     * Also updates the default Authorization header for API calls.
     */
    const setTokenToStorage = (newToken) => {
        try {
            if (newToken) {
                localStorage.setItem('token', newToken);
                API.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            } else {
                const tokenKeys = ['token', 'authToken', 'accessToken', 'jwt'];
                tokenKeys.forEach(key => {
                    localStorage.removeItem(key);
                    sessionStorage.removeItem(key);
                });
                delete API.defaults.headers.common['Authorization'];
            }
        } catch (error) {
            console.error('Error setting token to storage:', error);
        }
    };

    // ====================================
    // Auth Check Function (Memoized)
    // ====================================
    /**
     * Checks if a user is authenticated by validating the stored token with the backend.
     * This function is wrapped in useCallback to prevent unnecessary re-creations.
     */
    const checkAuth = useCallback(async () => {
        setLoading(true);
        console.log('🔍 Enhanced Frontend Debug: Starting authentication check.');

        const storedToken = getTokenFromStorage();
        console.log('Token from storage:', storedToken ? 'Found' : 'Not found');
        console.log('Token preview:', storedToken ? `${storedToken.substring(0, 20)}...` : 'null');

        if (!storedToken) {
            console.log('No valid token found, user is not authenticated.');
            setUser(null);
            setToken(null);
            setIsAuthenticated(false);
            setLoading(false);
            return;
        }

        setToken(storedToken);
        API.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

        try {
            console.log('Attempting to validate token with backend...');
            const { data } = await API.get('/auth/me');
            console.log('✅ User data received:', {
                id: data._id,
                name: data.name,
                email: data.email,
                role: data.role,
                isVerified: data.isVerified
            });
            setUser(data);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('❌ Auth check error:', error.response?.data || error.message);
            
            // Handle specific error codes
            if (error.response?.status === 401) {
                console.log('Token expired or invalid, clearing auth state');
            } else if (error.response?.status === 403) {
                console.log('Access forbidden, user may be deactivated');
            } else {
                console.log('Network or server error during auth check');
            }
            
            // Clear invalid token and user state
            setTokenToStorage(null);
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
            console.log('Authentication check finished.');
        }
    }, []);

    // ====================================
    // Initialize Auth on Mount
    // ====================================
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // ====================================
    // Auth Actions
    // ====================================
    const setAuthToken = (newToken) => {
        setTokenToStorage(newToken);
        setToken(newToken);
    };

    const login = async (email, password) => {
        try {
            console.log('🔐 Attempting login for:', email);
            setLoading(true);
            
            const { data } = await API.post('/auth/login', { 
                email: email.trim().toLowerCase(), 
                password 
            });
            
            console.log('✅ Login successful:', {
                hasToken: !!data.token,
                hasUser: !!data.user,
                userEmail: data.user?.email
            });

            if (!data.token) {
                throw new Error('No token received from server');
            }

            // Store token and user data
            setAuthToken(data.token);
            setUser(data.user);
            setIsAuthenticated(true);
            
            return data;
        } catch (err) {
            console.error('❌ Login error:', err.response?.data || err.message);
            setUser(null);
            setToken(null);
            setIsAuthenticated(false);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, email, password) => {
        try {
            console.log('📝 Attempting registration for:', email);
            setLoading(true);
            
            const { data } = await API.post('/auth/register', { 
                name: name.trim(), 
                email: email.trim().toLowerCase(), 
                password 
            });
            
            console.log('✅ Registration successful');

            if (data.token) {
                setAuthToken(data.token);
                setUser(data.user);
                setIsAuthenticated(true);
            }
            
            return data;
        } catch (err) {
            console.error('❌ Registration error:', err.response?.data || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            console.log('🚪 Logging out...');
            setLoading(true);
            
            // Try to call logout endpoint
            await API.get('/auth/logout');
            console.log('✅ Logout API call successful');
        } catch (err) {
            console.warn('⚠️ Logout API failed, but clearing local state anyway:', err.message);
        } finally {
            // Always clear local state regardless of API success
            setTokenToStorage(null);
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
            console.log('✅ Local auth state cleared');
        }
    };

    // Force re-authentication (useful for debugging)
    const refreshAuth = () => {
        console.log('🔄 Forcing auth refresh...');
        checkAuth();
    };

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        // State
        user,
        token,
        loading,
        isAuthenticated,
        
        // Actions
        login,
        register,
        logout,
        setAuthToken,
        refreshAuth,
        
        // Utilities (for debugging)
        checkAuth
    }), [user, token, loading, isAuthenticated, login, register, logout, setAuthToken, refreshAuth, checkAuth]);

    return (
        <AuthContext.Provider value={contextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
