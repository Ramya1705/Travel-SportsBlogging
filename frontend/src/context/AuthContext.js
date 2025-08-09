// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import API from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ====================================
    // Debugging + Auth Check on Mount
    // ====================================
    useEffect(() => {
        const checkAuth = async () => {
            // Try to get token from localStorage or cookies
            const token =
                localStorage.getItem('token') ||
                document.cookie
                    .split('; ')
                    .find(row => row.startsWith('token='))
                    ?.split('=')[1];

            console.log('🔍 Frontend Debug:');
            console.log('Token from localStorage:', localStorage.getItem('token'));
            console.log('Cookies:', document.cookie);
            console.log('Final token used:', token);

            if (token) {
                try {
                    const response = await fetch('/api/auth/me', {
                        method: 'GET',
                        credentials: 'include', // Important for cookies
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    console.log('Response status:', response.status);
                    console.log(
                        'Response headers:',
                        Object.fromEntries(response.headers)
                    );

                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData);
                    } else {
                        console.warn('Auth failed, clearing token');
                        localStorage.removeItem('token');
                        setUser(null);
                    }
                } catch (error) {
                    console.error('Auth check error:', error);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    // ====================================
    // Auth Actions
    // ====================================
    const login = async (email, password) => {
        const { data } = await API.post('/auth/login', { email, password });
        setUser(data);
    };

    const register = async (name, email, password) => {
        const { data } = await API.post('/auth/register', {
            name,
            email,
            password,
        });
        setUser(data);
    };

    const logout = async () => {
        await API.get('/auth/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, setUser, login, register, logout, loading }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};
