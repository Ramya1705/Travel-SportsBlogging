// AuthContext.js - Updated version
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  token: localStorage.getItem('token')
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'AUTH_ERROR':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set up axios interceptor
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Request interceptor
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const currentToken = localStorage.getItem('token');
        if (currentToken) {
          config.headers.Authorization = `Bearer ${currentToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          dispatch({ type: 'AUTH_ERROR' });
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'https://travel-sportsblogging.onrender.com'}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: response.data.user,
            token: token
          }
        });
      } catch (error) {
        console.error('Auth check failed:', error);
        dispatch({ type: 'AUTH_ERROR' });
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL || 'https://travel-sportsblogging.onrender.com'}/api/auth/login`, {
        email,
        password
      });

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.data.user,
          token: response.data.token
        }
      });

      return response.data;
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR' });
      throw error;
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
