
import React, { useState } from 'react';
import API from '../api/axios';
import { Container, TextField, Button, Typography, Box, Alert, Paper } from '@mui/material';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [currentBg, setCurrentBg] = useState(0);

    // Travel and sports themed backgrounds (same as login and register pages)
    const backgrounds = [
        'https://th.bing.com/th/id/OIP.eeNRtdobKIeNskukB9tSoAHaDt?w=287&h=174&c=7&r=0&o=7&dpr=1.7&pid=1.7&rm=3', // Travel destination
        'https://th.bing.com/th/id/R.1c1b8c8219385a0f88a7b6cfcba712ab?rik=u9ceuWoncAl0iQ&riu=http%3a%2f%2fwww.pixelstalk.net%2fwp-content%2fuploads%2f2016%2f08%2fFree-Desktop-Travel-Backgrounds.jpg&ehk=i2gnQlVtAUHLdjoM%2b5hVl%2bStT4ogWTYySuRp0cXXPnc%3d&risl=&pid=ImgRaw&r=0'  // Sports field
    ];

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBg(prev => (prev + 1) % backgrounds.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [backgrounds.length]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            await API.post('/auth/forgotpassword', { email });
            setMessage('An email has been sent with password reset instructions.');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        }
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
            <Container maxWidth="sm">
                <Paper sx={{ 
                    p: 2.5, 
                    borderRadius: 2, 
                    boxShadow: 5,
                    maxWidth: '400px',
                    margin: '0 auto',
                    mt: 3
                }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography component="h1" variant="h5">
                            Forgot Password
                        </Typography>
                        <Typography variant="body2" align="center" sx={{ mt: 1, color: 'text.secondary' }}>
                            Enter your email address and we'll send you a link to reset your password.
                        </Typography>
                        {message && <Alert severity="success" sx={{ width: '100%', mt: 2 }}>{message}</Alert>}
                        {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                            <TextField
                                margin="normal" 
                                required 
                                fullWidth
                                label="Email Address" 
                                type="email"
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                Send Reset Link
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

// Ensure this line is at the end of the file
export default ForgotPasswordPage;
