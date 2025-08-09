// // src/pages/LoginPage.js
// import React, { useState, useContext, useEffect } from 'react';
// import { useNavigate, Link, useSearchParams } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import {
//     Container,
//     TextField,
//     Button,
//     Typography,
//     Box,
//     Alert,
//     Divider,
//     Paper
// } from '@mui/material';
// import GoogleIcon from '@mui/icons-material/Google';

// const LoginPage = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const [currentBg, setCurrentBg] = useState(0);
//     const [searchParams] = useSearchParams();
//     const { login, setAuthToken } = useContext(AuthContext);
//     const navigate = useNavigate();

//     // Travel and sports themed backgrounds
//     const backgrounds = [
//         'https://blog.hotech.com.tr/wp-content/uploads/2017/02/kiteboarding-turkey-1024x575.jpg',
//         'https://th.bing.com/th/id/OIP.M0MDxxz6iSJzKo3EpuoXgwHaEK?w=299&h=180&c=7&r=0&o=7&dpr=1.7&pid=1.7&rm=3'
//     ];

//     // Background slideshow
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setCurrentBg(prev => (prev + 1) % backgrounds.length);
//         }, 6000);
//         return () => clearInterval(interval);
//     }, [backgrounds.length]);

//     // Handle Google auth callback
//     useEffect(() => {
//         const token = searchParams.get('token');
//         const error = searchParams.get('error');

//         console.log('🔍 Google Auth Callback Debug:');
//         console.log('URL token:', token);
//         console.log('URL error:', error);

//         if (token) {
//             console.log('✅ Google auth successful, storing token');
//             localStorage.setItem('token', token);
            
//             // Update auth context if you have setAuthToken method
//             if (setAuthToken) {
//                 setAuthToken(token);
//             }
            
//             // Clear URL params and redirect
//             window.history.replaceState({}, document.title, window.location.pathname);
//             navigate('/');
//         } else if (error) {
//             console.error('❌ Google auth failed:', error);
//             setError(decodeURIComponent(error));
//         }
//     }, [searchParams, navigate, setAuthToken]);

//     // Debug token info when page loads
//     useEffect(() => {
//         const token =
//             localStorage.getItem('token') ||
//             document.cookie.split('; ')
//                 .find(row => row.startsWith('token='))
//                 ?.split('=')[1];

//         console.log('🔍 Login Page Debug:');
//         console.log('Token from localStorage:', localStorage.getItem('token'));
//         console.log('Cookies:', document.cookie);
//         console.log('Final token detected:', token);
//     }, []);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
//         try {
//             await login(email, password);
//             navigate('/');
//         } catch (err) {
//             console.error('Regular login error:', err);
//             setError(err.response?.data?.message || 'Failed to login');
//         }
//     };

//     const handleGoogleLogin = () => {
//         console.log('🚀 Starting Google authentication...');
//         // Your backend should redirect back to: /login?token=JWT_TOKEN or /login?error=ERROR_MESSAGE
//         const redirectUrl = `${window.location.origin}/login`;
//         const googleAuthUrl = `${process.env.REACT_APP_API_URL}/auth/google?redirect=${encodeURIComponent(redirectUrl)}`;
        
//         console.log('Redirecting to:', googleAuthUrl);
//         window.location.href = googleAuthUrl;
//     };

//     return (
//         <Box
//             sx={{
//                 minHeight: 'calc(100vh - 64px)',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 background: `linear-gradient(to top, rgba(224, 247, 250, 0.8) 0%, rgba(179, 229, 252, 0.8) 100%), url('${backgrounds[currentBg]}')`,
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center',
//                 backgroundRepeat: 'no-repeat',
//                 backdropFilter: 'blur(8px)',
//                 WebkitBackdropFilter: 'blur(8px)',
//                 py: 4,
//                 transition: 'background-image 1s ease-in-out',
//                 '&::before': {
//                     content: '""',
//                     position: 'absolute',
//                     top: 0,
//                     left: 0,
//                     right: 0,
//                     bottom: 0,
//                     backgroundImage: `url('${backgrounds[currentBg]}')`,
//                     backgroundSize: 'cover',
//                     backgroundPosition: 'center',
//                     backgroundRepeat: 'no-repeat',
//                     filter: 'blur(5px)',
//                     zIndex: -1,
//                     transition: 'background-image 1s ease-in-out'
//                 }
//             }}
//         >
//             <Container maxWidth="xs">
//                 <Paper
//                     sx={{
//                         p: 3,
//                         borderRadius: 2,
//                         boxShadow: 5,
//                         maxWidth: '350px',
//                         margin: '0 auto',
//                         mt: 2
//                     }}
//                 >
//                     <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                         <Typography component="h1" variant="h5">
//                             Welcome Back!
//                         </Typography>
//                         {error && (
//                             <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
//                                 {error}
//                             </Alert>
//                         )}

//                         <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
//                             <TextField
//                                 margin="normal"
//                                 required
//                                 fullWidth
//                                 label="Email Address"
//                                 name="email"
//                                 autoComplete="email"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                             />
//                             <TextField
//                                 margin="normal"
//                                 required
//                                 fullWidth
//                                 name="password"
//                                 label="Password"
//                                 type="password"
//                                 autoComplete="current-password"
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                             />
//                             <Box sx={{ textAlign: 'right', my: 1 }}>
//                                 <Link to="/forgot-password" style={{ color: '#1976d2', fontSize: '0.9rem' }}>
//                                     Forgot Password?
//                                 </Link>
//                             </Box>
//                             <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2 }}>
//                                 Sign In
//                             </Button>

//                             <Divider sx={{ my: 2 }}>OR</Divider>

//                             <Button
//                                 fullWidth
//                                 variant="outlined"
//                                 startIcon={<GoogleIcon />}
//                                 onClick={handleGoogleLogin}
//                                 sx={{
//                                     color: 'rgba(0, 0, 0, 0.87)',
//                                     borderColor: 'rgba(0, 0, 0, 0.23)',
//                                     '&:hover': {
//                                         backgroundColor: 'rgba(0, 0, 0, 0.04)',
//                                         borderColor: 'rgba(0, 0, 0, 0.23)'
//                                     }
//                                 }}
//                             >
//                                 Sign In with Google
//                             </Button>

//                             <Typography variant="body2" align="center" sx={{ mt: 3 }}>
//                                 Don't have an account?{' '}
//                                 <Link to="/signup" style={{ color: '#1976d2', fontWeight: '500' }}>
//                                     Sign Up
//                                 </Link>
//                             </Typography>
//                         </Box>
//                     </Box>
//                 </Paper>
//             </Container>
//         </Box>
//     );
// };

// export default LoginPage;
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
    Paper,
    CircularProgress
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [currentBg, setCurrentBg] = useState(0);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const { login, setToken } = useContext(AuthContext);
    const navigate = useNavigate();

    // Travel and sports themed backgrounds
    const backgrounds = [
        'https://blog.hotech.com.tr/wp-content/uploads/2017/02/kiteboarding-turkey-1024x575.jpg',
        'https://th.bing.com/th/id/OIP.M0MDxxz6iSJzKo3EpuoXgwHaEK?w=299&h=180&c=7&r=0&o=7&dpr=1.7&pid=1.7&rm=3'
    ];

    // Helper function to get cookie value
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    // Background slideshow
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBg(prev => (prev + 1) % backgrounds.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [backgrounds.length]);

    // Handle Google auth callback and token detection
    useEffect(() => {
        const urlToken = searchParams.get('token');
        const urlError = searchParams.get('error');
        const authSource = searchParams.get('source');

        console.log('🔍 Auth Callback Debug:');
        console.log('URL token:', urlToken);
        console.log('URL error:', urlError);
        console.log('Auth source:', authSource);

        // Check for token in URL (from Google auth redirect)
        if (urlToken) {
            console.log('✅ Token found in URL, processing Google auth success');
            
            // Store token in localStorage
            localStorage.setItem('token', urlToken);
            
            // Update auth context if available
            if (setToken) {
                setToken(urlToken);
            }
            
            // Clear URL params and redirect to home
            window.history.replaceState({}, document.title, window.location.pathname);
            setIsGoogleLoading(false);
            
            // Show success message briefly before redirecting
            setTimeout(() => {
                navigate('/', { replace: true });
            }, 1000);
            
            return;
        }

        // Check for error in URL
        if (urlError) {
            console.error('❌ Auth error from URL:', urlError);
            setError(decodeURIComponent(urlError));
            setIsGoogleLoading(false);
            
            // Clear URL params
            window.history.replaceState({}, document.title, window.location.pathname);
            return;
        }

        // Check for existing tokens (localStorage or cookies)
        const localToken = localStorage.getItem('token');
        const cookieToken = getCookie('token');
        
        console.log('🔍 Existing Token Check:');
        console.log('localStorage token:', localToken);
        console.log('Cookie token:', cookieToken);
        
        // If we have a cookie token but no localStorage token, sync them
        if (cookieToken && !localToken) {
            console.log('🔄 Syncing cookie token to localStorage');
            localStorage.setItem('token', cookieToken);
            
            if (setToken) {
                setToken(cookieToken);
            }
        }

        // If we have a token and we're not in the middle of Google auth, redirect to home
        if ((localToken || cookieToken) && !authSource) {
            console.log('ℹ️ User already authenticated, redirecting to home');
            navigate('/', { replace: true });
        }

    }, [searchParams, navigate, setToken]);

    // Listen for popup messages (if using popup method)
    useEffect(() => {
        const handlePopupMessage = (event) => {
            // Verify origin for security
            if (event.origin !== window.location.origin) {
                return;
            }

            console.log('📨 Received popup message:', event.data);

            if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
                const { token } = event.data;
                console.log('✅ Google auth successful via popup');
                
                localStorage.setItem('token', token);
                
                if (setToken) {
                    setToken(token);
                }
                
                setIsGoogleLoading(false);
                navigate('/', { replace: true });
                
            } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
                console.error('❌ Google auth failed via popup:', event.data.error);
                setError(event.data.error || 'Google authentication failed');
                setIsGoogleLoading(false);
            }
        };

        window.addEventListener('message', handlePopupMessage);
        return () => window.removeEventListener('message', handlePopupMessage);
    }, [navigate, setToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            console.log('🔐 Attempting regular login');
            await login(email, password);
            navigate('/', { replace: true });
        } catch (err) {
            console.error('❌ Regular login error:', err);
            setError(err.response?.data?.message || 'Failed to login');
        }
    };

    const handleGoogleLogin = () => {
        console.log('🚀 Starting Google authentication...');
        setError('');
        setIsGoogleLoading(true);
        
        // Get current location for redirect
        const currentUrl = window.location.origin;
        const redirectUrl = `${currentUrl}/login`;
        
        // Build Google auth URL with redirect parameter
        const googleAuthUrl = `${process.env.REACT_APP_API_URL}/auth/google?redirect=${encodeURIComponent(redirectUrl)}`;
        
        console.log('🔗 Google auth URL:', googleAuthUrl);
        
        // Option 1: Full page redirect (current method)
        window.location.href = googleAuthUrl;
        
        // Option 2: Popup method (uncomment to use instead)
        /*
        const popup = window.open(
            googleAuthUrl,
            'google-auth',
            'width=500,height=600,scrollbars=yes,resizable=yes'
        );

        // Handle popup being closed manually
        const checkClosed = setInterval(() => {
            if (popup.closed) {
                console.log('🚪 Popup closed by user');
                setIsGoogleLoading(false);
                clearInterval(checkClosed);
            }
        }, 1000);
        */
    };

    // Show loading state during Google auth
    if (isGoogleLoading) {
        return (
            <Box
                sx={{
                    minHeight: 'calc(100vh - 64px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                }}
            >
                <CircularProgress size={50} />
                <Typography sx={{ mt: 2 }}>
                    Authenticating with Google...
                </Typography>
            </Box>
        );
    }

    // Show success message if token is being processed
    if (searchParams.get('token') && searchParams.get('source') === 'google') {
        return (
            <Box
                sx={{
                    minHeight: 'calc(100vh - 64px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                }}
            >
                <Alert severity="success" sx={{ mb: 2 }}>
                    Google authentication successful! Redirecting...
                </Alert>
                <CircularProgress size={30} />
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
                                disabled={isGoogleLoading}
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
                                disabled={isGoogleLoading}
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
                                disabled={isGoogleLoading}
                            >
                                Sign In
                            </Button>

                            <Divider sx={{ my: 2 }}>OR</Divider>

                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={isGoogleLoading ? <CircularProgress size={20} /> : <GoogleIcon />}
                                onClick={handleGoogleLogin}
                                disabled={isGoogleLoading}
                                sx={{
                                    color: 'rgba(0, 0, 0, 0.87)',
                                    borderColor: 'rgba(0, 0, 0, 0.23)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                        borderColor: 'rgba(0, 0, 0, 0.23)'
                                    }
                                }}
                            >
                                {isGoogleLoading ? 'Signing in...' : 'Sign In with Google'}
                            </Button>

                            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                                Don't have an account?{' '}
                                <Link to="/signup" style={{ color: '#1976d2', fontWeight: '500' }}>
                                    Sign Up
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default LoginPage;
