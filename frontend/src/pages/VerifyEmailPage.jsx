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
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('Verifying your email...');
    const [userDetails, setUserDetails] = useState(null);
    const [countdown, setCountdown] = useState(5);
    const [debugInfo, setDebugInfo] = useState(null);

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('No verification token provided.');
            return;
        }

        const verifyToken = async () => {
            try {
                console.log('🔍 Starting email verification for token:', token);
                console.log('🌐 API Base URL:', API.defaults.baseURL);
                console.log('📡 Full URL will be:', `${API.defaults.baseURL}/verify-email/${token}`);
                
                // Try multiple possible endpoints to debug
                const possibleEndpoints = [
                    `/verify-email/${token}`,
                    `/auth/verify-email/${token}`,
                    `/api/verify-email/${token}`,
                    `/users/verify-email/${token}`,
                    `/verify/${token}`,
                    `/auth/verify/${token}`
                ];

                let response;
                let successfulEndpoint;

                // Try each endpoint until one works
                for (const endpoint of possibleEndpoints) {
                    try {
                        console.log(`🧪 Testing endpoint: ${endpoint}`);
                        response = await API.get(endpoint);
                        successfulEndpoint = endpoint;
                        console.log(`✅ Success with endpoint: ${endpoint}`, response.data);
                        break;
                    } catch (testError) {
                        console.log(`❌ Failed endpoint: ${endpoint}`, testError.response?.status);
                        if (testError.response?.status === 404) {
                            continue; // Try next endpoint
                        } else {
                            // If it's not a 404, it might be the right endpoint but with other issues
                            throw testError;
                        }
                    }
                }

                if (!response) {
                    throw new Error('All verification endpoints returned 404. Please check your backend routes.');
                }

                const { data } = response;
                
                // Store debug info
                setDebugInfo({
                    successfulEndpoint,
                    testedEndpoints: possibleEndpoints,
                    responseData: data
                });
                
                // Store user details
                setUserDetails(data);
                
                // Set user in global context (logs them in)
                setUser(data);
                
                setStatus('success');
                setMessage(`Welcome ${data.name}! Your email has been verified successfully.`);
                
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
                
                // Enhanced error logging
                console.error('Error details:', {
                    status: err.response?.status,
                    statusText: err.response?.statusText,
                    data: err.response?.data,
                    config: {
                        url: err.config?.url,
                        baseURL: err.config?.baseURL,
                        fullURL: `${err.config?.baseURL}${err.config?.url}`
                    }
                });

                setStatus('error');
                let errorMessage = 'Verification failed. ';
                
                if (err.response?.status === 404) {
                    errorMessage += 'The verification endpoint was not found. Please check your backend server routes.';
                } else if (err.response?.status === 400) {
                    errorMessage += 'Invalid or expired verification token.';
                } else if (err.response?.status === 500) {
                    errorMessage += 'Server error occurred during verification.';
                } else if (err.message.includes('Network Error')) {
                    errorMessage += 'Unable to connect to the server. Please check your internet connection.';
                } else {
                    errorMessage += err.response?.data?.message || err.message || 'An unexpected error occurred.';
                }
                
                setMessage(errorMessage);
                
                // Store debug info for error case
                setDebugInfo({
                    error: true,
                    status: err.response?.status,
                    statusText: err.response?.statusText,
                    errorData: err.response?.data,
                    fullURL: `${err.config?.baseURL}${err.config?.url}`,
                    testedEndpoints: ['/verify-email/' + token] // Only the failed one in error case
                });
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
            // Try multiple possible resend endpoints too
            const resendEndpoints = [
                '/auth/resend-verification',
                '/resend-verification',
                '/auth/resend-email',
                '/users/resend-verification'
            ];

            let success = false;
            for (const endpoint of resendEndpoints) {
                try {
                    await API.post(endpoint, { email });
                    success = true;
                    break;
                } catch (error) {
                    if (error.response?.status !== 404) {
                        throw error;
                    }
                }
            }

            if (success) {
                alert('✅ New verification email sent! Please check your inbox.');
            } else {
                alert('❌ Could not find the resend verification endpoint. Please contact support.');
            }
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
            userDetails: userDetails ? { name: userDetails.name, email: userDetails.email } : null,
            debugInfo
        });
    }, [status, countdown, isAuthenticated, userDetails, debugInfo]);

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
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                                    Testing verification endpoints...
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

                                {/* Debug info for success */}
                                {debugInfo && (
                                    <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Debug: Used endpoint {debugInfo.successfulEndpoint}
                                        </Typography>
                                    </Box>
                                )}
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
                                
                                {/* Debug information in error state */}
                                {debugInfo && (
                                    <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1, textAlign: 'left' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Debug Information:</strong><br />
                                            Status: {debugInfo.status || 'Network Error'}<br />
                                            URL Attempted: {debugInfo.fullURL}<br />
                                            {debugInfo.errorData && (
                                                <>Server Response: {JSON.stringify(debugInfo.errorData)}<br /></>
                                            )}
                                        </Typography>
                                    </Box>
                                )}
                                
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    {debugInfo?.status === 404 
                                        ? 'The verification endpoint was not found on the server. Please check your backend routes.'
                                        : 'The verification link may be invalid, expired, or already used.'
                                    }
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
