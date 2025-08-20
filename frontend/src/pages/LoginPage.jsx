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
    
    const { login, setAuthToken, isAuthenticated, user } = useContext(AuthContext);
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

    // MAIN REDIRECT LOGIC - Watch for authentication changes
    useEffect(() => {
        console.log('🔍 Auth state check:', { 
            isAuthenticated, 
            hasUser: !!user, 
            userEmail: user?.email 
        });

        if (isAuthenticated && user) {
            console.log('✅ User is fully authenticated, redirecting to home');
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    // Handle Google auth callback and other tokens
    useEffect(() => {
        const urlToken = searchParams.get('token');
        const urlError = searchParams.get('error');

        // Priority 1: Handle URL token (from Google OAuth redirect)
        if (urlToken) {
            console.log('🔐 Processing Google OAuth token from URL');
            setAuthToken(urlToken).then((success) => {
                if (success) {
                    // Clear the URL parameters
                    const newUrl = window.location.pathname;
                    window.history.replaceState({}, document.title, newUrl);
                    console.log('🔄 Google OAuth successful');
                } else {
                    setError('Google authentication failed. Please try again.');
                }
            });
            return;
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
            setAuthToken(cookieToken);
        }

    }, [searchParams, setAuthToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('🔐 Starting regular login process...');
            
            // Use the context login method
            const result = await login(email.trim().toLowerCase(), password);
            
            if (result.success) {
                console.log('✅ Login successful - result:', result);
                // Don't navigate here - let the useEffect handle it
                // The auth state should be updated immediately in the context
            } else {
                console.error('❌ Login failed:', result.error);
                setError(result.error);
            }
            
        } catch (err) {
            console.error('❌ Unexpected login error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        console.log('🚀 Starting Google authentication...');
        setError('');
        
        const redirectUrl = `${window.location.origin}/login`;
        const apiUrl = process.env.REACT_APP_API_URL || 'https://travel-sportsblogging.onrender.com/api';
        const googleAuthUrl = `${apiUrl}/auth/google?redirect=${encodeURIComponent(redirectUrl)}`;

        console.log('Google Auth URL:', googleAuthUrl);
        
        // Navigate to Google OAuth
        window.location.href = googleAuthUrl;
    };

    // Show loading state if we're in the middle of processing authentication
    if (isAuthenticated && user) {
        return (
            <Box
                sx={{
                    minHeight: 'calc(100vh - 64px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="h6">Redirecting...</Typography>
            </Box>
        );
    }

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

                        {/* Debug info for development */}
                        {process.env.NODE_ENV === 'development' && (
                            <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1, width: '100%' }}>
                                <Typography variant="caption" display="block">
                                    Debug Info:
                                </Typography>
                                <Typography variant="caption" display="block">
                                    • Is Authenticated: {isAuthenticated ? '✅ Yes' : '❌ No'}
                                </Typography>
                                <Typography variant="caption" display="block">
                                    • Has User: {user ? '✅ Yes' : '❌ No'}
                                </Typography>
                                <Typography variant="caption" display="block">
                                    • User Email: {user?.email || 'None'}
                                </Typography>
                                <Typography variant="caption" display="block">
                                    • LocalStorage Token: {localStorage.getItem('token') ? '✅ Found' : '❌ Missing'}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default LoginPage;
