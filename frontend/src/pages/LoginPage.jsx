import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Container, TextField, Button, Typography, Box, Alert, Divider, Paper } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [currentBg, setCurrentBg] = useState(0);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // Travel and sports themed backgrounds (reduced to 2 images)
    const backgrounds = [
        'https://blog.hotech.com.tr/wp-content/uploads/2017/02/kiteboarding-turkey-1024x575.jpg', // Travel destination
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
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login');
        }
    };

    const handleGoogleLogin = () => {
        // Redirects to the backend Google authentication route
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
            <Container maxWidth="xs">
                <Paper sx={{ 
                    p: 3, 
                    borderRadius: 2, 
                    boxShadow: 5,
                    maxWidth: '350px',
                    margin: '0 auto',
                    mt: 2
                }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography component="h1" variant="h5">
                            Welcome Back!
                        </Typography>
                        {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
                        
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
                            />
                            <Box sx={{ textAlign: 'right', my: 1 }}>
                                <Link to="/forgot-password" style={{ color: '#1976d2', fontSize: '0.9rem' }}>
                                    Forgot Password?
                                </Link>
                            </Box>
                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2 }}>
                                Sign In
                            </Button>
                            
                            <Divider sx={{ my: 2 }}>OR</Divider>

                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<GoogleIcon />}
                                onClick={handleGoogleLogin}
                                sx={{
                                    color: 'rgba(0, 0, 0, 0.87)',
                                    borderColor: 'rgba(0, 0, 0, 0.23)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                        borderColor: 'rgba(0, 0, 0, 0.23)',
                                    }
                                }}
                            >
                                Sign In with Google
                            </Button>
                            
                            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                                Don't have an account? <Link to="/signup" style={{ color: '#1976d2', fontWeight: '500' }}>Sign Up</Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default LoginPage;