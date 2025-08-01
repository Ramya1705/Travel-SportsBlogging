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
                const { data } = await API.get(`/auth/verify-email/${token}`);
                setUser(data); // Set the user in global context and log them in
                setStatus('success');
                setMessage('Email verified successfully! Redirecting...');
                setTimeout(() => navigate('/'), 3000); // Redirect to home after 3 seconds
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
            }
        };
        verifyToken();
    }, [token, setUser, navigate]);

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>Account Verification</Typography>
                {status === 'verifying' && <CircularProgress sx={{ my: 3 }} />}
                {status === 'success' && <Alert severity="success">{message}</Alert>}
                {status === 'error' && <Alert severity="error">{message}</Alert>}
            </Box>
        </Container>
    );
};

export default VerifyEmailPage;