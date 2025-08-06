// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import API from '../api/axios'; // Assuming this is your centralized Axios instance

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Effect to check and load user on component mount
    useEffect(() => {
        const checkUser = async () => {
            try {
                // Attempt to get user data from localStorage first
                const storedUser = localStorage.getItem('user');
                const storedToken = localStorage.getItem('authToken');

                if (storedUser && storedToken) {
                    setUser(JSON.parse(storedUser));
                    // The API interceptor (in ../api/axios.js) should handle setting the Authorization header
                    // before this API call if the token is present in localStorage.
                    // You might still want to verify the token with the backend.
                    const { data } = await API.get('/auth/me'); // Verify token validity with backend
                    setUser(data);
                } else {
                    setUser(null); // No stored user or token
                }
            } catch (error) {
                // If /auth/me fails (e.g., token expired/invalid), clear local storage
                localStorage.removeItem('user');
                localStorage.removeItem('authToken');
                setUser(null);
                console.error("Failed to authenticate user on load:", error);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);

    // Login function: Stores token and user data
    const login = async (email, password) => {
        try {
            const { data } = await API.post('/auth/login', { email, password });
            localStorage.setItem('authToken', data.token); // Store the token
            localStorage.setItem('user', JSON.stringify(data.user)); // Store user data
            setUser(data.user);
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message || error.message);
            throw error; // Re-throw to allow component to handle specific errors
        }
    };

    // Register function: Stores token and user data
    const register = async (name, email, password) => {
        try {
            const { data } = await API.post('/auth/register', { name, email, password });
            localStorage.setItem('authToken', data.token); // Store the token
            localStorage.setItem('user', JSON.stringify(data.user)); // Store user data
            setUser(data.user);
        } catch (error) {
            console.error("Registration failed:", error.response?.data?.message || error.message);
            throw error;
        }
    };

    // Logout function: Clears local storage and user state
    const logout = async () => {
        try {
            await API.get('/auth/logout'); // Assuming your backend has a logout endpoint
        } catch (error) {
            console.error("Logout API call failed, but proceeding with client-side logout:", error);
        } finally {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
