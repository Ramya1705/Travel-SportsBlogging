// src/pages/LoginPage.js
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    Divider,
    Paper
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentBg, setCurrentBg] = useState(0);
    const [searchParams] = useSearchParams();
    
    const { login, setAuthToken, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    // Travel and sports themed backgrounds
    const backgrounds = [
        'https://blog.hotech.com.tr/wp-content/uploads/2017/02/kiteboarding-turkey-1024x575.jpg',
        'https://th.bing.com/th/id/OIP.M0MDxxz6iSJzKo3EpuoXgwHaEK?w=299&h=180&c=7&r=0&o=7&dpr=1.7&pid=1.7&rm=3'
    ];

    // Background slideshow
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBg(prev => (prev + 1) % backgrounds.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [backgrounds.length]);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            console.log('✅ User is already authenticated, redirecting to home');
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    // Enhanced token detection function
    const detectAndSetToken = (token, source) => {
        if (!token || token === 'null' || token === 'undefined') {
            console.log(`❌ Invalid token from ${source}:`, token);
            return false;
        }

        console.log(`✅ Valid token detected from ${source}:`, token.substring(0, 20) + '...');
        
        try {
            // Store in localStorage
            localStorage.setItem('token', token);
            
            // Set in context (this will trigger AuthContext to re-authenticate)
            setAuthToken(token);
            
            console.log('✅ Token stored and context updated');
            return true;
        } catch (error) {
            console.error('❌ Error storing token:', error);
            return false;
        }
    };

    // Handle Google auth callback and other tokens
    useEffect(() => {
        const urlToken = searchParams.get('token');
        const urlError = searchParams.get('error');

        console.log('🔍 LoginPage Token Detection:');
        console.log('URL token:', urlToken ? 'FOUND' : 'NOT FOUND');
        console.log('URL error:', urlError);

        // Priority 1: Handle URL token (from Google OAuth redirect)
        if (urlToken) {
            console.log('🔐 Processing Google OAuth token from URL');
            if (detectAndSetToken(urlToken, 'URL parameter')) {
                // Clear the URL parameters to clean up
                const newUrl = window.location.pathname;
                window.history.replaceState({}, document.title, newUrl);
                
                // Navigate to home (delay slightly to ensure context update)
                setTimeout(() => {
                    navigate('/');
                }, 100);
                return;
            }
        }

        // Priority 2: Handle URL error
        if (urlError) {
            console.error('❌ OAuth error from URL:', urlError);
            setError(decodeURIComponent(urlError));
            return;
        }

        // Priority 3: Check for cookie token (backup method)
        const cookieToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];

        if (cookieToken && cookieToken !== localStorage.getItem('token')) {
            console.log('🔐 Processing token from cookie');
            detectAndSetToken(cookieToken, 'cookie');
        }

        // Priority 4: Check localStorage for existing token
        const storageToken = localStorage.getItem('token');
        if (storageToken) {
            console.log('🔐 Token found in localStorage, verifying...');
            // Let AuthContext handle the verification
        } else {
            console.log('ℹ️ No token found in any storage method');
        }

    }, [searchParams, navigate, setAuthToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('🔐 Starting regular login process...');
            console.log('Email:', email);
            
            // Use the context login method
            await login(email.trim().toLowerCase(), password);
            
            console.log('✅ Regular login successful');
            
            // Check if token was properly stored
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                console.log('✅ Token confirmed in localStorage');
                navigate('/');
            } else {
                console.error('❌ Login succeeded but no token stored');
                setError('Login succeeded but authentication failed. Please try again.');
            }
            
        } catch (err) {
            console.error('❌ Regular login failed:', err);
            const errorMessage = err.response?.data?.message || 
                                err.message || 
                                'Login failed. Please check your credentials.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        console.log('🚀 Starting Google authentication...');
        setError(''); // Clear any previous errors
        
        const currentUrl = window.location.href;
        const redirectUrl = `${window.location.origin}/login`;
        const apiUrl = process.env.REACT_APP_API_URL || 'https://travel-sportsblogging.onrender.com/api';
        const googleAuthUrl = `${apiUrl}/auth/google?redirect=${encodeURIComponent(redirectUrl)}`;

        console.log('Current URL:', currentUrl);
        console.log('Redirect URL:', redirectUrl);
        console.log('Google Auth URL:', googleAuthUrl);
        
        // Navigate to Google OAuth
        window.location.href = googleAuthUrl;
    };

    // Debug info component (only show in development)
    const DebugInfo = () => {
        if (process.env.NODE_ENV !== 'development') return null;

        const storageToken = localStorage.getItem('token');
        const cookieToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];

        return (
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="caption" display="block">
                    Debug Info:
                </Typography>
                <Typography variant="caption" display="block">
                    • LocalStorage Token: {storageToken ? '✅ Found' : '❌ Missing'}
                </Typography>
                <Typography variant="caption" display="block">
                    • Cookie Token: {cookieToken ? '✅ Found' : '❌ Missing'}
                </Typography>
                <Typography variant="caption" display="block">
                    • Is Authenticated: {isAuthenticated ? '✅ Yes' : '❌ No'}
                </Typography>
            </Box>
        );
    };

    return (
        <Box
            sx={{
                minHeight: 'calc(100vh - 64px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(to top, rgba(224, 247, 250, 0.8) 0%, rgba(179, 229, 252, 0.8) 100%), url('${backgrounds[currentBg]}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                py: 4,
                transition: 'background-image 1s ease-in-out',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url('${backgrounds[currentBg]}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    filter: 'blur(5px)',
                    zIndex: -1,
                    transition: 'background-image 1s ease-in-out'
                }
            }}
        >
            <Container maxWidth="xs">
                <Paper
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        boxShadow: 5,
                        maxWidth: '350px',
                        margin: '0 auto',
                        mt: 2
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography component="h1" variant="h5">
                            Welcome Back!
                        </Typography>
                        
                        {error && (
                            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                            <Box sx={{ textAlign: 'right', my: 1 }}>
                                <Link to="/forgot-password" style={{ color: '#1976d2', fontSize: '0.9rem' }}>
                                    Forgot Password?
                                </Link>
                            </Box>
                            <Button 
                                type="submit" 
                                fullWidth 
                                variant="contained" 
                                sx={{ mt: 2, mb: 2 }}
                                disabled={loading}
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </Button>

                            <Divider sx={{ my: 2 }}>OR</Divider>

                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<GoogleIcon />}
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                sx={{
                                    color: 'rgba(0, 0, 0, 0.87)',
                                    borderColor: 'rgba(0, 0, 0, 0.23)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                        borderColor: 'rgba(0, 0, 0, 0.23)'
                                    }
                                }}
                            >
                                Sign In with Google
                            </Button>

                            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                                Don't have an account?{' '}
                                <Link to="/signup" style={{ color: '#1976d2', fontWeight: '500' }}>
                                    Sign Up
                                </Link>
                            </Typography>
                        </Box>

                        <DebugInfo />
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default LoginPage;
