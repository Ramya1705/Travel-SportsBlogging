import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Container, Box, Typography, CircularProgress, Alert, Button } from '@mui/material';

const VerifyEmailPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('Verifying your email...');
    const [debugInfo, setDebugInfo] = useState({});

    // Debug function to log detailed information
    const logDebugInfo = (info) => {
        console.log('🔍 FRONTEND DEBUG:', info);
        setDebugInfo(prev => ({ ...prev, ...info }));
    };

    useEffect(() => {
        console.log('=== VERIFY EMAIL PAGE MOUNTED ===');
        console.log('Current URL:', window.location.href);
        console.log('Token from params:', token);
        console.log('API base URL:', API.defaults.baseURL);
        
        logDebugInfo({
            timestamp: new Date().toISOString(),
            currentURL: window.location.href,
            tokenFromParams: token,
            apiBaseURL: API.defaults.baseURL
        });

        if (!token) {
            console.error('❌ No verification token provided in URL params');
            logDebugInfo({ error: 'No token in URL params' });
            setStatus('error');
            setMessage('No verification token provided.');
            return;
        }

        const verifyToken = async () => {
            try {
                console.log('🚀 Starting email verification process...');
                console.log('Token to verify:', token);
                
                // Log the full URL that will be called
                const fullURL = `${API.defaults.baseURL}/auth/verify-email/${token}`;
                console.log('Full API URL:', fullURL);
                
                logDebugInfo({
                    verificationStarted: true,
                    tokenToVerify: token,
                    fullAPIURL: fullURL
                });

                // Make the API call
                console.log('📡 Making API request...');
                const response = await API.get(`/auth/verify-email/${token}`);
                
                console.log('✅ API Response received:', response);
                console.log('Response status:', response.status);
                console.log('Response headers:', response.headers);
                console.log('Response data:', response.data);
                
                logDebugInfo({
                    apiResponseReceived: true,
                    responseStatus: response.status,
                    responseData: response.data
                });

                const { data } = response;
                
                // Set the user in global context and log them in
                console.log('👤 Setting user in context:', data);
                setUser(data);
                
                setStatus('success');
                const successMessage = data.message || 'Email verified successfully! Redirecting...';
                setMessage(successMessage);
                
                console.log('✅ Verification successful, redirecting in 3 seconds...');
                logDebugInfo({
                    verificationSuccessful: true,
                    userSet: true,
                    redirectingIn: 3000
                });
                
                // Redirect to home after 3 seconds
                setTimeout(() => {
                    console.log('🔄 Redirecting to homepage...');
                    navigate('/');
                }, 3000);

            } catch (err) {
                console.error('❌ Verification failed:', err);
                console.error('Error response:', err.response);
                console.error('Error message:', err.message);
                console.error('Error config:', err.config);
                
                // Detailed error logging
                const errorDetails = {
                    errorMessage: err.message,
                    errorCode: err.code,
                    responseStatus: err.response?.status,
                    responseStatusText: err.response?.statusText,
                    responseData: err.response?.data,
                    responseHeaders: err.response?.headers,
                    requestURL: err.config?.url,
                    requestMethod: err.config?.method,
                    requestBaseURL: err.config?.baseURL
                };
                
                console.log('📊 Detailed error information:', errorDetails);
                logDebugInfo({
                    verificationFailed: true,
                    errorDetails
                });
                
                setStatus('error');
                
                // Better error message handling
                let errorMessage = 'Verification failed. Unknown error occurred.';
                
                if (err.response) {
                    // Server responded with error status
                    console.log('Server error response:', err.response.status);
                    
                    if (err.response.status === 404) {
                        errorMessage = 'Verification endpoint not found. This might be a server configuration issue.';
                    } else if (err.response.status === 400) {
                        errorMessage = err.response.data?.message || 'Invalid or expired verification token.';
                    } else if (err.response.status >= 500) {
                        errorMessage = 'Server error occurred during verification. Please try again later.';
                    } else {
                        errorMessage = err.response.data?.message || 
                                     err.response.data?.error ||
                                     `Server returned ${err.response.status} error.`;
                    }
                } else if (err.request) {
                    // Request made but no response received
                    console.log('No response received:', err.request);
                    errorMessage = 'No response from server. Please check your internet connection.';
                } else {
                    // Error in setting up request
                    console.log('Request setup error:', err.message);
                    errorMessage = `Request failed: ${err.message}`;
                }
                
                setMessage(errorMessage);
                
                // Additional help message after delay
                setTimeout(() => {
                    if (status === 'error') {
                        setMessage(`${errorMessage} You can try requesting a new verification email or contact support.`);
                    }
                }, 5000);
            }
        };

        verifyToken();
    }, [token, setUser, navigate, status]);

    // Debug component to show debugging information (only in development)
    const DebugPanel = () => {
        if (process.env.NODE_ENV !== 'development') return null;
        
        return (
            <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                    Debug Information (Development Only)
                </Typography>
                <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                    {JSON.stringify(debugInfo, null, 2)}
                </pre>
            </Box>
        );
    };

    // Retry verification function
    const retryVerification = () => {
        console.log('🔄 Retrying verification...');
        setStatus('verifying');
        setMessage('Retrying verification...');
        window.location.reload();
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Account Verification
                </Typography>
                
                {status === 'verifying' && (
                    <>
                        <CircularProgress sx={{ my: 3 }} />
                        <Typography variant="body1" color="text.secondary">
                            {message}
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                            Token: {token?.substring(0, 10)}...
                        </Typography>
                    </>
                )}
                
                {status === 'success' && (
                    <>
                        <Alert severity="success" sx={{ my: 3 }}>
                            {message}
                        </Alert>
                        <Typography variant="body2" color="text.secondary">
                            You will be redirected to the homepage shortly...
                        </Typography>
                    </>
                )}
                
                {status === 'error' && (
                    <>
                        <Alert severity="error" sx={{ my: 3 }}>
                            {message}
                        </Alert>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            If you continue having issues, please contact support.
                        </Typography>
                        <Button 
                            variant="contained" 
                            onClick={retryVerification}
                            sx={{ mr: 2 }}
                        >
                            Retry Verification
                        </Button>
                        <Button 
                            variant="outlined" 
                            onClick={() => navigate('/login')}
                        >
                            Back to Login
                        </Button>
                    </>
                )}
                
                <DebugPanel />
            </Box>
        </Container>
    );
};

export default VerifyEmailPage; 
