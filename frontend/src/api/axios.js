// import axios from 'axios';

// // Create the Axios instance with the base URL and credentials setting.
// // Do NOT import AuthContext or any other component/context here.
// const API = axios.create({
//     baseURL: process.env.REACT_APP_API_URL,
//     withCredentials: true, // This is important for sending cookies
// });

// // We are not setting an interceptor here because the `withCredentials: true`
// // option automatically handles sending the httpOnly cookie with every request.
// // An interceptor would only be needed if you were storing the JWT in localStorage.

// export default API;
import axios from 'axios';

// Create a new instance of Axios with your base URL
const api = axios.create({
  baseURL: 'https://travel-sportsblogging.onrender.com/api',
});

// Use an interceptor to add the authorization header to every request
api.interceptors.request.use(
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

export default api;
