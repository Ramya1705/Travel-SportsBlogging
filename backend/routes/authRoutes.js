// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {
    registerUser,
    loginUser,
    getMe,
    logoutUser,
    forgotPassword,
    resetPassword,
    verifyEmail,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// ====================================
// Public Routes (No token required)
// ====================================
// Register a new user
router.post('/register', registerUser);

// Login with email and password
router.post('/login', loginUser);

// Send password reset link
router.post('/forgotpassword', forgotPassword);

// Reset password using token from email
router.put('/resetpassword/:resettoken', resetPassword);

// Verify email using token from email
router.get('/verify-email/:token', verifyEmail);

// ====================================
// Protected Routes (Token required)
// ====================================
// Get the current logged-in user's profile
router.get('/me', protect, getMe);

// Logout the current user
router.get('/logout', protect, logoutUser);

// ====================================
// Google OAuth Routes
// ====================================
// Step 1: Redirect to Google login screen
router.get(
    '/google',
    (req, res, next) => {
        // Store the redirect URL in the state parameter
        const redirectUrl = req.query.redirect || process.env.CLIENT_URL || 'https://travel-sports-blogging.onrender.com';
        
        // Store redirect URL in session or pass as state
        req.session = req.session || {};
        req.session.redirectUrl = redirectUrl;
        
        console.log('🚀 Google auth initiated, redirect URL:', redirectUrl);
        next();
    },
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
    })
);

// Step 2: Google OAuth callback
router.get(
    '/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: `${process.env.CLIENT_URL || 'https://travel-sports-blogging.onrender.com'}/login?error=Authentication%20failed`,
    }),
    (req, res) => {
        try {
            console.log('🔍 Google callback - User:', req.user?._id);
            
            if (!req.user) {
                console.error('❌ No user found in Google callback');
                return res.redirect(`${process.env.CLIENT_URL || 'https://travel-sports-blogging.onrender.com'}/login?error=Authentication%20failed`);
            }

            // Create JWT for authenticated user
            const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
                expiresIn: '30d',
            });

            console.log('✅ JWT created for user:', req.user._id);

            // Get redirect URL (from session or default)
            const redirectUrl = req.session?.redirectUrl || process.env.CLIENT_URL || 'https://travel-sports-blogging.onrender.com';
            
            // Clean up session
            if (req.session) {
                delete req.session.redirectUrl;
            }

            // Cookie options
            const cookieOptions = {
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                httpOnly: false, // Allow JavaScript access so frontend can read it
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            };

            // Set cookie
            res.cookie('token', token, cookieOptions);
            
            console.log('🍪 Cookie set, redirecting to:', `${redirectUrl}/login?token=${token}`);

            // OPTION 1: Redirect with token in URL (for easy frontend handling)
            res.redirect(`${redirectUrl}/login?token=${token}&source=google`);
            
            // OPTION 2: Alternative - redirect to a success page that handles the token
            // res.redirect(`${redirectUrl}/auth/google/success?token=${token}`);
            
        } catch (error) {
            console.error('❌ Error in Google callback:', error);
            const redirectUrl = req.session?.redirectUrl || process.env.CLIENT_URL || 'https://travel-sports-blogging.onrender.com';
            res.redirect(`${redirectUrl}/login?error=${encodeURIComponent('Authentication failed')}`);
        }
    }
);

// ====================================
// Alternative Success Page Route (Optional)
// ====================================
// If you prefer a dedicated success page instead of URL params
router.get('/google/success', (req, res) => {
    const token = req.query.token;
    if (!token) {
        return res.redirect(`${process.env.CLIENT_URL}/login?error=No%20token%20provided`);
    }
    
    // Return an HTML page that handles the token and closes popup/redirects
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Authentication Success</title>
            <script>
                // Store token and redirect
                localStorage.setItem('token', '${token}');
                
                // If this is in a popup, send message to parent and close
                if (window.opener) {
                    window.opener.postMessage({
                        type: 'GOOGLE_AUTH_SUCCESS',
                        token: '${token}'
                    }, '${process.env.CLIENT_URL}');
                    window.close();
                } else {
                    // If not a popup, redirect to home page
                    window.location.href = '${process.env.CLIENT_URL}';
                }
            </script>
        </head>
        <body>
            <div style="text-align: center; margin-top: 50px;">
                <h2>Authentication Successful!</h2>
                <p>Redirecting...</p>
            </div>
        </body>
        </html>
    `);
});

// ====================================
// Debug Routes (for testing)
// ====================================
router.get('/debug/env', (req, res) => {
    res.json({
        nodeEnv: process.env.NODE_ENV,
        hasJwtSecret: !!process.env.JWT_SECRET,
        jwtSecretLength: process.env.JWT_SECRET?.length || 0,
        clientUrl: process.env.CLIENT_URL,
        cookieSettings: {
            secure: req.secure,
            sameSite: req.get('Origin'),
        },
    });
});

// Debug route to check cookies
router.get('/debug/cookies', (req, res) => {
    res.json({
        cookies: req.cookies,
        headers: req.headers,
        token: req.cookies.token || 'No token cookie found'
    });
});

module.exports = router;
