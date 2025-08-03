import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        setError('');
        setSuccess('');
        try {
            await API.put(`/auth/resetpassword/${token}`, { password });
            setSuccess('Password reset successfully! You can now log in.');
            setTimeout(() => navigate('/login'), https://travel-sports-blogging.onrender.com);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password.');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Reset Password</Typography>
                {success && <Alert severity="success" sx={{ width: '100%', mt: 2 }}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal" required fullWidth
                        label="New Password" type="password"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        margin="normal" required fullWidth
                        label="Confirm New Password" type="password"
                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Reset Password
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

// Ensure this line is at the end of the file
export default ResetPasswordPage;
