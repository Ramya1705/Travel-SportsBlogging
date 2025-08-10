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
    const { setUser } = useContext(AuthContext);
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
                // Make API call to verify email
                const { data } = await API.get(`/auth/verify-email/${token}`);
                
                // Store user details
                setUserDetails(data);
                setUser(data); // Set the user in global context (logs them in)
                setStatus('success');
                setMessage(`Welcome ${data.name}! Your email has been verified successfully.`);
                
                // Show success alert
                alert(`🎉 Email Verified Successfully!\n\nWelcome ${data.name}!\nYou are now logged in and will be redirected to the home page.`);
                
                // Start countdown for redirect
                let timeLeft = 5;
                const countdownInterval = setInterval(() => {
                    timeLeft -= 1;
                    setCountdown(timeLeft);
                    
                    if (timeLeft <= 0) {
                        clearInterval(countdownInterval);
                        navigate('/'); // Redirect to home page
                    }
                }, 1000);

                // Cleanup interval on component unmount
                return () => clearInterval(countdownInterval);
                
            } catch (err) {
                console.error('Email verification error:', err);
                setStatus('error');
                const errorMessage = err.response?.data?.message || 'Verification failed. The link may be invalid or expired.';
                setMessage(errorMessage);
                
                // Show error alert
                alert(`❌ Email Verification Failed\n\n${errorMessage}\n\nPlease try requesting a new verification email.`);
            }
        };

        verifyToken();
    }, [token, setUser, navigate]);

    const handleGoToHome = () => {
        navigate('/');
    };

    const handleGoToLogin = () => {
        navigate('/login');
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
                                            Status: Verified ✓
                                        </Typography>
                                    </Box>
                                )}
                                
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    You are now logged in! Redirecting to home page in {countdown} seconds...
                                </Typography>
                                
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={handleGoToHome}
                                    size="large"
                                >
                                    Go to Home Page Now
                                </Button>
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
