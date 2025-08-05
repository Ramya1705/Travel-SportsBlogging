import axios from 'axios';

const API = axios.create({
  baseURL: 'https://travel-sportsblogging.onrender.com/api', // IMPORTANT: Ensure this is your deployed backend URL
  withCredentials: true // Keep this if your backend still relies on cookies for some routes (e.g., for Google OAuth initial handshake)
});

// Request Interceptor: This runs before every request
API.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken'); // Get the token from localStorage
  if (token) {
    // If a token exists, add it to the Authorization header as a Bearer token
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config; // Return the modified config
}, error => {
  // Handle request errors
  return Promise.reject(error);
});

// Response Interceptor (Optional but Recommended): Handles responses globally
API.interceptors.response.use(response => {
  return response;
}, error => {
  // If the server responds with a 401 Unauthorized status
  if (error.response && error.response.status === 401) {
    console.warn('Unauthorized request detected. Clearing token.');
    localStorage.removeItem('authToken'); // Clear the invalid token
    // Optionally, redirect the user to the login page
    // window.location.href = '/login'; 
  }
  return Promise.reject(error); // Propagate the error
});

export default API;
