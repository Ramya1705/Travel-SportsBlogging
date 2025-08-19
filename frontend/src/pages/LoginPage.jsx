// Update your handleSubmit function in LoginPage.jsx

const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        console.log('🔐 Starting regular login process...');
        console.log('Email:', email);
        
        // Use the context login method
        const loginResult = await login(email.trim().toLowerCase(), password);
        
        console.log('✅ Regular login successful');
        console.log('Login result:', loginResult);
        
        // Check if token was properly stored
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            console.log('✅ Token confirmed in localStorage');
            
            // ✅ IMMEDIATE REDIRECT - Don't wait for isAuthenticated state
            console.log('🔄 Redirecting to home page...');
            navigate('/', { replace: true });
        } else {
            console.error('❌ Login succeeded but no token stored');
            setError('Login succeeded but authentication failed. Please try again.');
        }
        
    } catch (err) {
        console.error('❌ Regular login failed:', err);
        const errorMessage = err.response?.data?.message || 
                            err.message || 
                            'Login failed. Please check your credentials.';
        setError(errorMessage);
    } finally {
        setLoading(false);
    }
};

// Also update the Google OAuth token handling useEffect
useEffect(() => {
    const urlToken = searchParams.get('token');
    const urlError = searchParams.get('error');

    console.log('🔍 LoginPage Token Detection:');
    console.log('URL token:', urlToken ? 'FOUND' : 'NOT FOUND');
    console.log('URL error:', urlError);

    // Priority 1: Handle URL token (from Google OAuth redirect)
    if (urlToken) {
        console.log('🔐 Processing Google OAuth token from URL');
        if (detectAndSetToken(urlToken, 'URL parameter')) {
            // Clear the URL parameters to clean up
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
            
            // ✅ IMMEDIATE REDIRECT - Use replace: true to prevent back button issues
            console.log('🔄 Redirecting after Google OAuth...');
            navigate('/', { replace: true });
            return;
        }
    }

    // Priority 2: Handle URL error
    if (urlError) {
        console.error('❌ OAuth error from URL:', urlError);
        setError(decodeURIComponent(urlError));
        return;
    }

    // Priority 3: Check for cookie token (backup method)
    const cookieToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('[1];

    if (cookieToken && cookieToken !== localStorage.getItem('token')) {
        console.log('🔐 Processing token from cookie');
        if (detectAndSetToken(cookieToken, 'cookie')) {
            console.log('🔄 Redirecting after cookie token detection...');
            navigate('/', { replace: true });
        }
    }

    // Priority 4: Check localStorage for existing token
    const storageToken = localStorage.getItem('token');
    if (storageToken) {
        console.log('🔐 Token found in localStorage, verifying...');
        // Let AuthContext handle the verification
    } else {
        console.log('ℹ️ No token found in any storage method');
    }

}, [searchParams, navigate, setAuthToken]);

// Keep the existing authentication check useEffect as backup
useEffect(() => {
    if (isAuthenticated) {
        console.log('✅ User is already authenticated via useEffect, redirecting to home');
        navigate('/', { replace: true });
    }
}, [isAuthenticated, navigate]);
