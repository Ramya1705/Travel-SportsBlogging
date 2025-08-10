import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Container, Box, Typography, CircularProgress, Alert, Button, Card, CardContent } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const VerifyEmailPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { setUser, isAuthenticated } = useContext(AuthContext);
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('Verifying your email...');
    const [userDetails, setUserDetails] = useState(null);
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('No verification token provided.');
            return;
        }

        const verifyToken = async () => {
            try {
                console.log('🔍 Starting email verification for token:', token);
                
                // Make API call to verify email
                const { data } = await API.get(`/auth/verify-email/${token}`);
                
                console.log('✅ Verification successful:', data);
                
                // Store user details
                setUserDetails(data);
                
                // Set user in global context (logs them in)
                setUser(data);
                
                setStatus('success');
                setMessage(`Welcome ${data.name}! Your email has been verified successfully.`);
                
                // Show success alert
                alert(`🎉 Email Verified Successfully!\n\nWelcome ${data.name}!\nYou are now logged in and will be redirected to the home page.`);
                
                console.log('🏠 Starting countdown for home page redirect...');
                
                // Start countdown and redirect
                let timeLeft = 5;
                setCountdown(timeLeft);
                
                const redirectTimer = setInterval(() => {
                    timeLeft -= 1;
                    console.log(`⏱️ Redirect countdown: ${timeLeft} seconds`);
                    setCountdown(timeLeft);
                    
                    if (timeLeft <= 0) {
                        clearInterval(redirectTimer);
                        console.log('🚀 Redirecting to home page now!');
                        navigate('/', { replace: true });
                    }
                }, 1000);

                // Cleanup function
                return () => {
                    console.log('🧹 Cleaning up redirect timer');
                    clearInterval(redirectTimer);
                };
                
            } catch (err) {
                console.error('❌ Email verification error:', err);
                setStatus('error');
                const errorMessage = err.response?.data?.message || 'Verification failed. The link may be invalid or expired.';
                setMessage(errorMessage);
                
                // Show error alert
                alert(`❌ Email Verification Failed\n\n${errorMessage}\n\nPlease try requesting a new verification email.`);
            }
        };

        verifyToken();
    }, [token, setUser, navigate]);

    // Force redirect if user becomes authenticated
    useEffect(() => {
        if (isAuthenticated && status === 'success') {
            console.log('👤 User is now authenticated, ensuring redirect to home');
            const forceRedirectTimer = setTimeout(() => {
                console.log('🏠 Force redirecting to home page');
                navigate('/', { replace: true });
            }, 1000);

            return () => clearTimeout(forceRedirectTimer);
        }
    }, [isAuthenticated, status, navigate]);

    const handleGoToHome = () => {
        console.log('🏠 Manual redirect to home page');
        navigate('/', { replace: true });
    };

    const handleGoToLogin = () => {
        console.log('🔐 Redirecting to login page');
        navigate('/login', { replace: true });
    };

    const handleResendVerification = async () => {
        const email = prompt('Please enter your email address to resend verification:');
        if (!email) return;

        try {
            await API.post('/auth/resend-verification', { email });
            alert('✅ New verification email sent! Please check your inbox.');
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to resend verification email';
            alert(`❌ ${errorMsg}`);
        }
    };

    // Debug logging
    useEffect(() => {
        console.log('📊 VerifyEmailPage State:', {
            status,
            countdown,
            isAuthenticated,
            userDetails: userDetails ? { name: userDetails.name, email: userDetails.email } : null
        });
    }, [status, countdown, isAuthenticated, userDetails]);

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8 }}>
                <Card elevation={3}>
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h4" gutterBottom color="primary">
                            Account Verification
                        </Typography>
                        
                        {/* Loading State */}
                        {status === 'verifying' && (
                            <Box sx={{ my: 4 }}>
                                <CircularProgress size={60} sx={{ mb: 2 }} />
                                <Typography variant="body1" color="text.secondary">
                                    {message}
                                </Typography>
                            </Box>
                        )}
                        
                        {/* Success State */}
                        {status === 'success' && (
                            <Box sx={{ my: 4 }}>
                                <CheckCircleIcon 
                                    sx={{ fontSize: 80, color: 'success.main', mb: 2 }} 
                                />
                                <Alert severity="success" sx={{ mb: 3 }}>
                                    {message}
                                </Alert>
                                
                                {userDetails && (
                                    <Box sx={{ mb: 3, p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
                                        <Typography variant="body2" color="success.dark">
                                            <strong>Account Details:</strong><br />
                                            Name: {userDetails.name}<br />
                                            Email: {userDetails.email}<br />
                                            Status: Verified & Logged In ✓
                                        </Typography>
                                    </Box>
                                )}
                                
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    🎉 You are now logged in! 
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Redirecting to home page in <strong>{countdown}</strong> seconds...
                                </Typography>
                                
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={handleGoToHome}
                                    size="large"
                                    sx={{ mb: 2 }}
                                >
                                    Go to Home Page Now
                                </Button>
                                
                                <br />
                                
                                <Typography variant="caption" color="text.secondary">
                                    Authentication Status: {isAuthenticated ? '✅ Logged In' : '⏳ Logging In...'}
                                </Typography>
                            </Box>
                        )}
                        
                        {/* Error State */}
                        {status === 'error' && (
                            <Box sx={{ my: 4 }}>
                                <ErrorIcon 
                                    sx={{ fontSize: 80, color: 'error.main', mb: 2 }} 
                                />
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {message}
                                </Alert>
                                
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    The verification link may be invalid, expired, or already used.
                                </Typography>
                                
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                                    <Button 
                                        variant="contained" 
                                        color="success" 
                                        onClick={handleResendVerification}
                                    >
                                        Resend Verification Email
                                    </Button>
                                    <Button 
                                        variant="outlined" 
                                        color="primary" 
                                        onClick={handleGoToLogin}
                                    >
                                        Go to Login
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </CardContent>
                </Card>
                
                {/* Footer Info */}
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                        Having trouble? Contact our support team for assistance.
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default VerifyEmailPage;
