import React, { createContext, useState, useEffect } from 'react';
import API from '../api/axios'; // Your Axios instance

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            // 1. Attempt to retrieve the authentication token from localStorage
            const token = localStorage.getItem('authToken');
            
            // If no token exists, the user is not authenticated
            if (!token) {
                setUser(null);
                setLoading(false);
                return; // Exit early if no token
            }

            try {
                // 2. If a token is found, make a request to /auth/me
                // The Axios interceptor (in axios.js) will automatically
                // attach this token to the request's Authorization header.
                const { data } = await API.get('/auth/me');
                setUser(data); // Set the user data if the request succeeds
            } catch (error) {
                // If the /auth/me request fails (e.g., 401 Unauthorized due to invalid/expired token)
                console.error('Failed to fetch user with stored token:', error);
                localStorage.removeItem('authToken'); // Remove the invalid token
                setUser(null); // Clear the user state
            } finally {
                setLoading(false); // Always set loading to false after the check
            }
        };
        checkUser();
    }, []); // Empty dependency array ensures this runs only once on component mount

    const login = async (email, password) => {
        // Assume your backend's /auth/login endpoint returns { token: '...', user: { ... } }
        const { data } = await API.post('/auth/login', { email, password });
        localStorage.setItem('authToken', data.token); // Store the received token
        setUser(data.user); // Set the user in the context
    };
    
    const register = async (name, email, password) => {
        // Assume your backend's /auth/register endpoint returns { token: '...', user: { ... } }
        const { data } = await API.post('/auth/register', { name, email, password });
        localStorage.setItem('authToken', data.token); // Store the received token
        setUser(data.user); // Set the user in the context
    };

    const logout = async () => {
        // Optionally, hit a logout endpoint on your backend to invalidate the token server-side
        try {
            await API.get('/auth/logout'); 
        } catch (error) {
            console.error('Error during server-side logout:', error);
            // Continue with client-side logout even if server-side fails
        }
        localStorage.removeItem('authToken'); // Remove the token from localStorage
        setUser(null); // Clear the user state
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
            {/* Only render children when the loading check is complete */}
            {!loading && children} 
        </AuthContext.Provider>
    );
};
