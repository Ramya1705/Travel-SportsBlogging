// src/api/axios.js
import axios from 'axios';

// Create a new instance of Axios with your base URL
const API = axios.create({
  baseURL: 'https://travel-sportsblogging.onrender.com\api', // Ensure this matches your backend API URL
});

// Use an interceptor to add the authorization header to every request
API.interceptors.request.use(
  (config) => {
    // Get the token from local storage
    const token = localStorage.getItem('authToken');
    
    // If a token exists, add it to the Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API; // Export as API to match your AuthContext import
