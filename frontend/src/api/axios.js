import axios from 'axios';

// Create the Axios instance with the base URL and credentials setting.
// Do NOT import AuthContext or any other component/context here.
const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true, // This is important for sending cookies
});

// We are not setting an interceptor here because the `withCredentials: true`
// option automatically handles sending the httpOnly cookie with every request.
// An interceptor would only be needed if you were storing the JWT in localStorage.

export default API;
