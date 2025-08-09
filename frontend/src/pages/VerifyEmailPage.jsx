import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Container, Box, Typography, CircularProgress, Alert } from '@mui/material';

const VerifyEmailPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('No verification token provided.');
            return;
        }

        const verifyToken = async () => {
            try {
                console.log('Attempting to verify token:', token); // Debug log
                const { data } = await API.get(`/auth/verify-email/${token}`);
                
                // Set the user in global context and log them in
                setUser(data);
                
                setStatus('success');
                setMessage(data.message || 'Email verified successfully! Redirecting...');
                
                // Redirect to home after 3 seconds
                setTimeout(() => navigate('/'), 3000);
            } catch (err) {
                console.error('Verification error:', err.response); // More detailed error logging
                
                setStatus('error');
                
                // Better error message handling
                const errorMessage = err.response?.data?.message || 
                                   err.response?.data?.error ||
                                   'Verification failed. The link may be invalid or expired.';
                
                setMessage(errorMessage);
                
                // Optional: Add retry button after error
                setTimeout(() => {
                    if (status === 'error') {
                        setMessage(`${errorMessage} You can try requesting a new verification email.`);
                    }
                }, 3000);
            }
        };

        verifyToken();
    }, [token, setUser, navigate, status]);

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
                        <Typography variant="body2" color="text.secondary">
                            If you continue having issues, please contact support.
                        </Typography>
                    </>
                )}
            </Box>
        </Container>
    );
};

export default VerifyEmailPage;
