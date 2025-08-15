// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import API from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    // ====================================
    // Auth Check on Mount and Token Change
    // ====================================
    useEffect(() => {
        const checkAuth = async () => {
            console.log('🔍 Frontend Debug:');
            console.log('Token from localStorage:', localStorage.getItem('token'));
            console.log('Token state in context:', token);
            
            if (token) {
                // Set the authorization header for all future requests
                API.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                try {
                    // Use the imported API instance to check user status
                    const { data } = await API.get('/auth/me');
                    console.log('User data received:', data);
                    setUser(data);
                } catch (error) {
                    console.error('Auth check error:', error.response?.data || error.message);
                    // If auth fails, clear the token and user state
                    localStorage.removeItem('token');
                    setToken(null);
                    delete API.defaults.headers.common['Authorization'];
                    setUser(null);
                }
            } else {
                console.log('No token found, user is not authenticated.');
                setUser(null);
            }
            setLoading(false);
        };

        checkAuth();
    }, [token]); // Rerun this effect whenever the token state changes

    // ====================================
    // Auth Actions
    // ====================================
    const setAuthToken = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const login = async (email, password) => {
        try {
            const { data } = await API.post('/auth/login', { email, password });
            setAuthToken(data.token); // Store the new token
            setUser(data.user);
        } catch (err) {
            console.error('Login error:', err);
            throw err;
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await API.post('/auth/register', { name, email, password });
            setAuthToken(data.token); // Store the new token
            setUser(data.user);
        } catch (err) {
            console.error('Registration error:', err);
            throw err;
        }
    };

    const logout = async () => {
        try {
            await API.get('/auth/logout');
        } catch (err) {
            console.warn('Logout API failed, but clearing local state anyway:', err);
        } finally {
            localStorage.removeItem('token');
            setToken(null);
            delete API.defaults.headers.common['Authorization'];
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, token, setAuthToken, login, register, logout, loading }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};
