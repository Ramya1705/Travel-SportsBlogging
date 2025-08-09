import React, { useEffect, useState, useContext, useRef } from 'react';
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
const redirectedRef = useRef(false);

const logDebugInfo = (info) => {
if (import.meta.env.MODE === 'development') {
console.log('FRONTEND DEBUG:', info);
}
setDebugInfo((prev) => ({ ...prev, ...info }));
};

useEffect(() => {
logDebugInfo({
timestamp: new Date().toISOString(),
currentURL: window.location.href,
tokenFromParams: token,
apiBaseURL: API.defaults.baseURL,
});


if (!token) {
  setStatus('error');
  setMessage('No verification token provided.');
  return;
}

let canceled = false;

const verifyToken = async () => {
  try {
    setStatus('verifying');
    setMessage('Verifying your email...');

    const response = await API.get(`/auth/verify-email/${token}`, {
      withCredentials: true,
    });
    if (canceled) return;

    const { data } = response;
    if (data && typeof data === 'object') {
      setUser(data);
    }

    setStatus('success');
    setMessage(data?.message || 'Email verified successfully! Redirecting...');
    logDebugInfo({ responseStatus: response.status });

    if (!redirectedRef.current) {
      redirectedRef.current = true;
      setTimeout(() => navigate('/'), 2000);
    }
  } catch (err) {
    if (canceled) return;

    let errorMessage = 'Verification failed. Unknown error occurred.';
    if (err.response) {
      if (err.response.status === 404) {
        errorMessage = 'Verification endpoint not found. Check API base URL and route path.';
      } else if (err.response.status === 400) {
        errorMessage = err.response.data?.message || 'Invalid or expired verification token.';
      } else if (err.response.status >= 500) {
        errorMessage = 'Server error during verification. Please try again later.';
      } else {
        errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          `Server returned ${err.response.status}.`;
      }
    } else if (err.request) {
      errorMessage = 'No response from server. Please check your connection.';
    } else {
      errorMessage = `Request failed: ${err.message}`;
    }

    setStatus('error');
    setMessage(errorMessage);
  }
};

verifyToken();

return () => {
  canceled = true;
};
}, [token, setUser, navigate]);

const DebugPanel = () => {
if (import.meta.env.MODE !== 'development') return null;
return (
<Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
<Typography variant="h6" gutterBottom>
Debug Information (Development Only)
</Typography>
<pre style={{ fontSize: '12px', overflow: 'auto' }}>{JSON.stringify(debugInfo, null, 2)}</pre>
</Box>
);
};

const retryVerification = () => {
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
        <Button variant="contained" onClick={retryVerification} sx={{ mr: 2 }}>
          Retry Verification
        </Button>
        <Button variant="outlined" onClick={() => navigate('/login')}>
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
