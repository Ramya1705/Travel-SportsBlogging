import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Correctly import AuthContext
import API from '../api/axios';
import { Container, TextField, Button, Typography, Box, Alert, Divider, Paper } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentBg, setCurrentBg] = useState(0);
    // We don't need the register function from context if we call API directly
    const { setUser } = useContext(AuthContext); 
    const navigate = useNavigate();

    // Travel and sports themed backgrounds (same as login page)
    const backgrounds = [
        'https://www.wtravelmagazine.com/wp-content/uploads/2018/02/Background-Image-Signup-Page.jpg', // Travel destination
        'https://th.bing.com/th/id/OIP.M0MDxxz6iSJzKo3EpuoXgwHaEK?w=299&h=180&c=7&r=0&o=7&dpr=1.7&pid=1.7&rm=3'  // Sports field
    ];

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBg(prev => (prev + 1) % backgrounds.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [backgrounds.length]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        setError('');
        setSuccess('');
        try {
            // This now sends the verification email and shows a success message
            const response = await API.post('/auth/register', { name, email, password });
            setSuccess(response.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register');
        }
    };

    const handleGoogleSignUp = () => {
        // This correctly constructs the URL for Google sign-up
        window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
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
                            Create Your Account
                        </Typography>
                        {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
                        {success && <Alert severity="success" sx={{ width: '100%', mt: 2 }}>{success}</Alert>}
                        
                        {!success && ( // Hide form on success
                            <>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<GoogleIcon />}
                                    onClick={handleGoogleSignUp}
                                    sx={{ 
                                        mt: 3,
                                        color: 'rgba(0, 0, 0, 0.87)',
                                        borderColor: 'rgba(0, 0, 0, 0.23)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                            borderColor: 'rgba(0, 0, 0, 0.23)',
                                        }
                                    }}
                                >
                                    Sign Up with Google
                                </Button>
                                <Divider sx={{ my: 2, width: '100%' }}>OR</Divider>
                                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                                    <TextField margin="normal" required fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                                    <TextField margin="normal" required fullWidth label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    <TextField margin="normal" required fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    <TextField margin="normal" required fullWidth label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign Up</Button>
                                </Box>
                            </>
                        )}

                        <Typography variant="body2" sx={{ mt: 2 }}>
                            Already have an account? <Link to="/login" style={{ color: '#1976d2', fontWeight: '500' }}>Sign In</Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default RegisterPage;