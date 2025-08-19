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
            // Check localStorage first
            for (const key of tokenKeys) {
                const storedToken = localStorage.getItem(key);
                if (storedToken && storedToken !== 'null' && storedToken !== 'undefined') {
                    console.log(`Found token in localStorage with key: ${key}`);
                    return storedToken;
                }
            }
            // If not found, check sessionStorage
            for (const key of tokenKeys) {
                const storedToken = sessionStorage.getItem(key);
                if (storedToken && storedToken !== 'null' && storedToken !== 'undefined') {
                    console.log(`Found token in sessionStorage with key: ${key}`);
                    return storedToken;
                }
            }
            console.log('No token found in storage.');
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
                localStorage.setItem('token', newToken); // Use a single, consistent key
                API.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                console.log('Token set in localStorage and Axios headers.');
            } else {
                const tokenKeys = ['token', 'authToken', 'accessToken', 'jwt'];
                tokenKeys.forEach(key => {
                    localStorage.removeItem(key);
                    sessionStorage.removeItem(key);
                });
                delete API.defaults.headers.common['Authorization'];
                console.log('Tokens and Axios headers cleared.');
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
        console.log('🔍 Starting authentication check.');

        const storedToken = getTokenFromStorage();

        if (!storedToken) {
            console.log('No valid token found. User is not authenticated.');
            setUser(null);
            setToken(null);
            setIsAuthenticated(false);
            setLoading(false);
            return;
        }
        
        // FIX: Corrected variable name from 'Token' to 'storedToken' and used template literal
        API.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

        try {
            console.log('Attempting to validate token with backend...');
            const { data } = await API.get('/auth/me');
            console.log('✅ User data received:', data);

            // Update state after successful validation
            setUser(data);
            setToken(storedToken); // Set token state from storage
            setIsAuthenticated(true);
        } catch (error) {
            console.error('❌ Auth check error:', error.response?.data || error.message);

            // Handle specific error codes
            if (error.response?.status === 401) {
                console.log('Token expired or invalid, clearing auth state');
            } else {
                console.log('Network or server error during auth check. Clearing auth state.');
            }

            // Clear invalid token and user state
            setTokenToStorage(null);
            setUser(null);
            setToken(null);
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
    /**
     * Handles user login, setting token and user state on success.
     * @param {string} email - The user's email.
     * @param {string} password - The user's password.
     */
    const login = useCallback(async (email, password) => {
        try {
            setLoading(true);
            const { data } = await API.post('/auth/login', {
                email: email.trim().toLowerCase(),
                password
            });

            // Set all authentication states in a single block for consistency
            setUser(data.user);
            setToken(data.token);
            setIsAuthenticated(true);
            setTokenToStorage(data.token);

            console.log('✅ Login successful:', {
                hasToken: !!data.token,
                hasUser: !!data.user,
                userEmail: data.user?.email
            });

            return data;
        } catch (err) {
            console.error('❌ Login error:', err.response?.data || err.message);
            // Clear all states on error
            setUser(null);
            setToken(null);
            setIsAuthenticated(false);
            setTokenToStorage(null); // Clear storage on failed login
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Handles user registration and sets auth state on success.
     * @param {string} name - The user's name.
     * @param {string} email - The user's email.
     * @param {string} password - The user's password.
     */
    const register = useCallback(async (name, email, password) => {
        try {
            setLoading(true);
            const { data } = await API.post('/auth/register', {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password
            });

            if (data.token) {
                // Set all authentication states in a single block
                setToken(data.token);
                setUser(data.user);
                setIsAuthenticated(true);
                setTokenToStorage(data.token);
            }

            console.log('✅ Registration successful');
            return data;
        } catch (err) {
            console.error('❌ Registration error:', err.response?.data || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Logs the user out and clears all authentication state.
     */
    const logout = useCallback(async () => {
        try {
            setLoading(true);
            await API.get('/auth/logout');
            console.log('✅ Logout API call successful');
        } catch (err) {
            console.warn('⚠️ Logout API failed, but clearing local state anyway:', err.message);
        } finally {
            // Always clear local state regardless of API success
            setUser(null);
            setToken(null);
            setIsAuthenticated(false);
            setTokenToStorage(null);
            setLoading(false);
            console.log('✅ Local auth state cleared');
        }
    }, []);

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

        // Utilities
        setTokenToStorage,
        checkAuth,
    }), [user, token, loading, isAuthenticated, login, register, logout, checkAuth]);

    return (
        <AuthContext.Provider value={contextValue}>
            {/* Only render children when the initial authentication check is complete */}
            {!loading && children}
        </AuthContext.Provider>
    );
};
