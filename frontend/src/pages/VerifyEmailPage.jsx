// // import React, { useEffect, useState, useContext, useRef } from 'react';
// // import { useParams, useNavigate, useLocation } from 'react-router-dom';
// // import API from '../api/axios';
// // import { AuthContext } from '../context/AuthContext';
// // import { Container, Box, Typography, CircularProgress, Alert, Button, Card, CardContent } from '@mui/material';
// // import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// // import ErrorIcon from '@mui/icons-material/Error';
// // import InfoIcon from '@mui/icons-material/Info';

// // const VerifyEmailPage = () => {
// //   const { token } = useParams();
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const { setUser, isAuthenticated, user } = useContext(AuthContext);
// //   const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error', 'already_verified'
// //   const [message, setMessage] = useState('Verifying your email...');
// //   const [userDetails, setUserDetails] = useState(null);
// //   const [countdown, setCountdown] = useState(5);
// //   const [error, setError] = useState(null);
  
// //   // Use refs to prevent multiple operations
// //   const redirectInProgress = useRef(false);
// //   const verificationInProgress = useRef(false);
// //   const countdownTimer = useRef(null);

// //   // Check URL parameters for direct verification results (from backend redirect)
// //   useEffect(() => {
// //     const urlParams = new URLSearchParams(location.search);
// //     const verified = urlParams.get('verified');
// //     const userName = urlParams.get('user');
// //     const alreadyVerified = urlParams.get('already_verified');
// //     const errorParam = urlParams.get('error');

// //     if (verified === 'true' && userName) {
// //       console.log('✅ Verification success detected from URL params');
// //       setStatus(alreadyVerified === 'true' ? 'already_verified' : 'success');
// //       setMessage(alreadyVerified === 'true' 
// //         ? `Welcome back ${decodeURIComponent(userName)}! Your email was already verified.`
// //         : `Welcome ${decodeURIComponent(userName)}! Your email has been verified successfully.`
// //       );
// //       setUserDetails({ name: decodeURIComponent(userName) });
// //       startRedirectCountdown();
// //       return;
// //     }

// //     if (errorParam) {
// //       console.log('❌ Verification error detected from URL params');
// //       setStatus('error');
// //       setError(errorParam);
// //       if (errorParam === 'invalid_token') {
// //         setMessage('The verification link is invalid or has expired.');
// //       } else {
// //         setMessage('An error occurred during email verification.');
// //       }
// //       return;
// //     }

// //     // If no URL params and we have a token, proceed with API verification
// //     if (token) {
// //       performEmailVerification();
// //     } else if (!verified) {
// //       setStatus('error');
// //       setMessage('No verification token provided.');
// //       setError('no_token');
// //     }
// //   }, [token, location.search]);

// //   // Handle email verification via API
// //   const performEmailVerification = async () => {
// //     if (verificationInProgress.current) return;
// //     verificationInProgress.current = true;

// //     try {
// //       console.log('🔍 Starting email verification for token:', token);

// //       // Make API call to verify email
// //       const { data } = await API.get(`/auth/verify-email/${token}`);
// //       console.log('✅ Verification successful:', data);

// //       // Store user details
// //       setUserDetails(data);
      
// //       // Determine if user was already verified
// //       const wasAlreadyVerified = data.message && data.message.includes('already verified');
      
// //       // Update status
// //       setStatus(wasAlreadyVerified ? 'already_verified' : 'success');
// //       setMessage(wasAlreadyVerified 
// //         ? `Welcome back ${data.name}! Your email was already verified.`
// //         : `Welcome ${data.name}! Your email has been verified successfully.`
// //       );

// //       // Set user in global context (logs them in)
// //       setTimeout(() => {
// //         setUser(data);
// //         console.log('✅ User set in context:', data.name);
// //         startRedirectCountdown();
// //       }, 100);

// //     } catch (err) {
// //       console.error('❌ Email verification error:', err);
// //       verificationInProgress.current = false;
// //       setStatus('error');
      
// //       const errorResponse = err.response?.data;
// //       const errorMessage = errorResponse?.message || 'Verification failed. The link may be invalid or expired.';
      
// //       setMessage(errorMessage);
// //       setError(errorResponse?.code || 'verification_failed');
// //     }
// //   };

// //   // Start countdown and redirect to home
// //   const startRedirectCountdown = () => {
// //     if (redirectInProgress.current) return;
    
// //     redirectInProgress.current = true;
// //     console.log('🏠 Starting countdown for home page redirect...');

// //     let timeLeft = 5;
// //     setCountdown(timeLeft);

// //     countdownTimer.current = setInterval(() => {
// //       timeLeft -= 1;
// //       console.log(`⏱️ Redirect countdown: ${timeLeft} seconds`);
// //       setCountdown(timeLeft);

// //       if (timeLeft <= 0) {
// //         clearInterval(countdownTimer.current);
// //         executeRedirect();
// //       }
// //     }, 1000);
// //   };

// //   // Execute redirect to home page
// //   const executeRedirect = () => {
// //     console.log('🚀 Redirecting to home page now!');
// //     navigate('/', { replace: true });
// //   };

// //   // Cleanup timer on unmount
// //   useEffect(() => {
// //     return () => {
// //       if (countdownTimer.current) {
// //         console.log('🧹 Cleaning up redirect timer');
// //         clearInterval(countdownTimer.current);
// //       }
// //     };
// //   }, []);

// //   // Manual redirect handlers
// //   const handleGoToHome = () => {
// //     console.log('🏠 Manual redirect to home page');
// //     if (countdownTimer.current) {
// //       clearInterval(countdownTimer.current);
// //     }
// //     executeRedirect();
// //   };

// //   const handleGoToLogin = () => {
// //     console.log('🔐 Redirecting to login page');
// //     if (countdownTimer.current) {
// //       clearInterval(countdownTimer.current);
// //     }
// //     navigate('/login', { replace: true });
// //   };

// //   // Resend verification email
// //   const handleResendVerification = async () => {
// //     const email = prompt('Please enter your email address to resend verification:');
// //     if (!email || !email.trim()) {
// //       return;
// //     }

// //     // Basic email validation
// //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //     if (!emailRegex.test(email.trim())) {
// //       alert('❌ Please enter a valid email address.');
// //       return;
// //     }

// //     try {
// //       console.log('📧 Resending verification email to:', email.trim());
// //       await API.post('/auth/resend-verification', { email: email.trim() });
// //       alert('✅ New verification email sent successfully! Please check your inbox and spam folder.');
// //     } catch (error) {
// //       console.error('❌ Resend verification failed:', error);
// //       const errorMsg = error.response?.data?.message || 'Failed to resend verification email. Please try again.';
// //       alert(`❌ ${errorMsg}`);
// //     }
// //   };

// //   // Debug logging
// //   useEffect(() => {
// //     console.log('📊 VerifyEmailPage State:', {
// //       status,
// //       countdown,
// //       isAuthenticated,
// //       userDetails: userDetails ? { name: userDetails.name, email: userDetails.email } : null,
// //       redirectInProgress: redirectInProgress.current,
// //       hasToken: !!token,
// //       currentUser: user ? { name: user.name, email: user.email } : null
// //     });
// //   }, [status, countdown, isAuthenticated, userDetails, token, user]);

// //   return (
// //     <Container maxWidth="sm">
// //       <Box sx={{ mt: 8 }}>
// //         <Card elevation={3}>
// //           <CardContent sx={{ textAlign: 'center', py: 4 }}>
// //             <Typography variant="h4" gutterBottom color="primary">
// //               Account Verification
// //             </Typography>

// //             {/* Loading/Verifying State */}
// //             {status === 'verifying' && (
// //               <Box sx={{ my: 4 }}>
// //                 <CircularProgress size={60} sx={{ mb: 2 }} />
// //                 <Typography variant="body1" color="text.secondary">
// //                   {message}
// //                 </Typography>
// //                 <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
// //                   This may take a few moments...
// //                 </Typography>
// //               </Box>
// //             )}

// //             {/* Success State */}
// //             {(status === 'success' || status === 'already_verified') && (
// //               <Box sx={{ my: 4 }}>
// //                 <CheckCircleIcon
// //                   sx={{ fontSize: 80, color: 'success.main', mb: 2 }}
// //                 />
// //                 <Alert 
// //                   severity="success" 
// //                   sx={{ mb: 3 }}
// //                   icon={status === 'already_verified' ? <InfoIcon /> : undefined}
// //                 >
// //                   {message}
// //                 </Alert>

// //                 {userDetails && (
// //                   <Box sx={{ mb: 3, p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
// //                     <Typography variant="body2" color="success.dark">
// //                       <strong>Account Status:</strong><br />
// //                       Name: {userDetails.name}<br />
// //                       {userDetails.email && `Email: ${userDetails.email}`}<br />
// //                       Status: ✅ Verified & Logged In
// //                     </Typography>
// //                   </Box>
// //                 )}

// //                 <Typography variant="body1" sx={{ mb: 2 }}>
// //                   🎉 {status === 'already_verified' ? 'Welcome back! You are logged in.' : 'You are now logged in!'}
// //                 </Typography>
                
// //                 <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
// //                   Redirecting to home page in <strong>{countdown}</strong> seconds...
// //                 </Typography>

// //                 <Button
// //                   variant="contained"
// //                   color="primary"
// //                   onClick={handleGoToHome}
// //                   size="large"
// //                   sx={{ mb: 2, minWidth: 200 }}
// //                 >
// //                   Go to Home Page Now
// //                 </Button>

// //                 <br />

// //                 <Typography variant="caption" color="text.secondary">
// //                   Authentication Status: {isAuthenticated ? '✅ Logged In' : '⏳ Logging In...'}
// //                 </Typography>
// //               </Box>
// //             )}

// //             {/* Error State */}
// //             {status === 'error' && (
// //               <Box sx={{ my: 4 }}>
// //                 <ErrorIcon
// //                   sx={{ fontSize: 80, color: 'error.main', mb: 2 }}
// //                 />
// //                 <Alert severity="error" sx={{ mb: 3 }}>
// //                   {message}
// //                 </Alert>

// //                 <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
// //                   {error === 'invalid_token' && 'The verification link may be invalid, expired, or already used.'}
// //                   {error === 'no_token' && 'Please use the verification link sent to your email.'}
// //                   {error === 'verification_failed' && 'Please try requesting a new verification email.'}
// //                   {!['invalid_token', 'no_token', 'verification_failed'].includes(error) && 
// //                    'There was an issue with the verification process.'}
// //                 </Typography>

// //                 <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
// //                   <Button
// //                     variant="contained"
// //                     color="success"
// //                     onClick={handleResendVerification}
// //                     sx={{ minWidth: 180 }}
// //                   >
// //                     📧 Resend Verification Email
// //                   </Button>
// //                   <Button
// //                     variant="outlined"
// //                     color="primary"
// //                     onClick={handleGoToLogin}
// //                     sx={{ minWidth: 120 }}
// //                   >
// //                     🔐 Go to Login
// //                   </Button>
// //                 </Box>

// //                 {/* Additional help for common issues */}
// //                 <Box sx={{ mt: 3, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
// //                   <Typography variant="caption" color="info.dark">
// //                     <strong>Troubleshooting Tips:</strong><br />
// //                     • Check your spam/junk folder for the verification email<br />
// //                     • Make sure you're using the latest verification link<br />
// //                     • Verification links expire after 10 minutes<br />
// //                     • Contact support if the issue persists
// //                   </Typography>
// //                 </Box>
// //               </Box>
// //             )}
// //           </CardContent>
// //         </Card>

// //         {/* Footer Info */}
// //         <Box sx={{ mt: 3, textAlign: 'center' }}>
// //           <Typography variant="caption" color="text.secondary">
// //             Need help? Contact our support team for assistance.
// //           </Typography>
// //         </Box>

// //         {/* Debug Info (only in development) */}
// //         {process.env.NODE_ENV === 'development' && (
// //           <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
// //             <Typography variant="caption" color="text.secondary">
// //               <strong>Debug Info:</strong><br />
// //               Status: {status}<br />
// //               Has Token: {token ? 'Yes' : 'No'}<br />
// //               Is Authenticated: {isAuthenticated ? 'Yes' : 'No'}<br />
// //               Error: {error || 'None'}<br />
// //               Redirect In Progress: {redirectInProgress.current ? 'Yes' : 'No'}
// //             </Typography>
// //           </Box>
// //         )}
// //       </Box>
// //     </Container>
// //   );
// // };

// // export default VerifyEmailPage;
// import React, { useEffect, useState, useContext } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import API from '../api/axios';
// import { AuthContext } from '../context/AuthContext';
// import { Container, Box, Typography, CircularProgress, Alert, Button, Card, CardContent } from '@mui/material';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import ErrorIcon from '@mui/icons-material/Error';

// const VerifyEmailPage = () => {
//   const { token } = useParams();
//   const navigate = useNavigate();
//   const { setUser } = useContext(AuthContext);
//   const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
//   const [message, setMessage] = useState('Verifying your email...');
//   const [userDetails, setUserDetails] = useState(null);

//   useEffect(() => {
//     if (!token) {
//       setStatus('error');
//       setMessage('No verification token provided.');
//       return;
//     }

//     const verifyToken = async () => {
//       try {
//         console.log('🔍 Starting email verification for token:', token);
        
//         const { data } = await API.get(`/auth/verify-email/${token}`);
//         console.log('✅ Verification successful:', data);
        
//         // Store user details for display
//         setUserDetails(data);
        
//         // Set the user in global context (logs them in)
//         setUser(data);
        
//         setStatus('success');
//         setMessage(`Welcome ${data.name}! Your email has been verified successfully. Redirecting...`);
        
//         // Redirect to home page after 3 seconds (same as your original logic)
//         setTimeout(() => {
//           console.log('🏠 Redirecting to home page');
//           navigate('/');
//         }, 3000);
        
//       } catch (err) {
//         console.error('❌ Email verification error:', err);
//         setStatus('error');
//         const errorMessage = err.response?.data?.message || 'Verification failed. The link may be invalid or expired.';
//         setMessage(errorMessage);
//       }
//     };

//     verifyToken();
//   }, [token, setUser, navigate]);

//   const handleGoToHome = () => {
//     console.log('🏠 Manual redirect to home page');
//     navigate('/');
//   };

//   const handleGoToLogin = () => {
//     console.log('🔐 Redirecting to login page');
//     navigate('/login');
//   };

//   const handleResendVerification = async () => {
//     const email = prompt('Please enter your email address to resend verification:');
//     if (!email) return;

//     try {
//       await API.post('/auth/resend-verification', { email });
//       alert('✅ New verification email sent! Please check your inbox.');
//     } catch (error) {
//       const errorMsg = error.response?.data?.message || 'Failed to resend verification email';
//       alert(`❌ ${errorMsg}`);
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Box sx={{ mt: 8 }}>
//         <Card elevation={3}>
//           <CardContent sx={{ textAlign: 'center', py: 4 }}>
//             <Typography variant="h4" gutterBottom color="primary">
//               Account Verification
//             </Typography>

//             {/* Loading State */}
//             {status === 'verifying' && (
//               <Box sx={{ my: 4 }}>
//                 <CircularProgress size={60} sx={{ mb: 2 }} />
//                 <Typography variant="body1" color="text.secondary">
//                   {message}
//                 </Typography>
//               </Box>
//             )}

//             {/* Success State */}
//             {status === 'success' && (
//               <Box sx={{ my: 4 }}>
//                 <CheckCircleIcon
//                   sx={{ fontSize: 80, color: 'success.main', mb: 2 }}
//                 />
//                 <Alert severity="success" sx={{ mb: 3 }}>
//                   {message}
//                 </Alert>

//                 {userDetails && (
//                   <Box sx={{ mb: 3, p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
//                     <Typography variant="body2" color="success.dark">
//                       <strong>Account Details:</strong><br />
//                       Name: {userDetails.name}<br />
//                       Email: {userDetails.email}<br />
//                       Status: Verified & Logged In ✓
//                     </Typography>
//                   </Box>
//                 )}

//                 <Typography variant="body1" sx={{ mb: 2 }}>
//                   🎉 You are now logged in!
//                 </Typography>

//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={handleGoToHome}
//                   size="large"
//                   sx={{ mb: 2 }}
//                 >
//                   Go to Home Page Now
//                 </Button>
//               </Box>
//             )}

//             {/* Error State */}
//             {status === 'error' && (
//               <Box sx={{ my: 4 }}>
//                 <ErrorIcon
//                   sx={{ fontSize: 80, color: 'error.main', mb: 2 }}
//                 />
//                 <Alert severity="error" sx={{ mb: 3 }}>
//                   {message}
//                 </Alert>

//                 <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//                   The verification link may be invalid, expired, or already used.
//                 </Typography>

//                 <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
//                   <Button
//                     variant="contained"
//                     color="success"
//                     onClick={handleResendVerification}
//                   >
//                     Resend Verification Email
//                   </Button>
//                   <Button
//                     variant="outlined"
//                     color="primary"
//                     onClick={handleGoToLogin}
//                   >
//                     Go to Login
//                   </Button>
//                 </Box>
//               </Box>
//             )}
//           </CardContent>
//         </Card>

//         {/* Footer Info */}
//         <Box sx={{ mt: 3, textAlign: 'center' }}>
//           <Typography variant="caption" color="text.secondary">
//             Having trouble? Contact our support team for assistance.
//           </Typography>
//         </Box>
//       </Box>
//     </Container>
//   );
// };

// export default VerifyEmailPage;
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

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    const verifyToken = async () => {
      try {
        console.log('🔍 Starting email verification for token:', token);
        
        const { data } = await API.get(`/auth/verify-email/${token}`);
        console.log('✅ Verification successful:', data);
        
        // Store user details for display
        setUserDetails(data);
        
        // Set the user in global context (logs them in)
        setUser(data);
        
        setStatus('success');
        setMessage(`Welcome ${data.name}! Your email has been verified successfully. Redirecting...`);
        
        // Redirect to main authenticated area after 3 seconds
        setTimeout(() => {
          console.log('🏠 Redirecting to main page (user is now logged in)');
          navigate('/'); // This goes to your main HomePage, not login page
        }, 3000);
        
      } catch (err) {
        console.error('❌ Email verification error:', err);
        setStatus('error');
        const errorMessage = err.response?.data?.message || 'Verification failed. The link may be invalid or expired.';
        setMessage(errorMessage);
      }
    };

    verifyToken();
  }, [token, setUser, navigate]);

  const handleGoToHome = () => {
    console.log('🏠 Manual redirect to main page (user is logged in)');
    navigate('/'); // Goes to main app, not login
  };

  const handleGoToLogin = () => {
    console.log('🔐 Redirecting to login page');
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
                      Status: Verified & Logged In ✓
                    </Typography>
                  </Box>
                )}

                <Typography variant="body1" sx={{ mb: 2 }}>
                  🎉 You are now logged in!
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGoToHome}
                  size="large"
                  sx={{ mb: 2 }}
                >
                  Continue to App
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
