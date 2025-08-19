// const express = require('express');
// const router = express.Router();
// const passport = require('passport');
// const jwt = require('jsonwebtoken');
// const {
//     registerUser,
//     loginUser,
//     getMe,
//     logoutUser,
//     forgotPassword,
//     resetPassword,
//     verifyEmail,
// } = require('../controllers/authController');
// const { protect } = require('../middleware/authMiddleware');
// // ====================================
// // Public Routes (No token required)
// // ====================================
// // Register a new user
// router.post('/register', registerUser);
// // Login with email and password
// router.post('/login', loginUser);
// // Send password reset link
// router.post('/forgotpassword', forgotPassword);
// // Reset password using token from email
// router.put('/resetpassword/:resettoken', resetPassword);
// // Verify email using token from email
// router.get('/verify-email/:token', verifyEmail);
// // ====================================
// // Protected Routes (Token required)
// // ====================================
// // Get the current logged-in user's profile
// router.get('/me', protect, getMe);
// // Logout the current user
// router.get('/logout', protect, logoutUser);
// // ====================================
// // Google OAuth Routes
// // ====================================
// // Step 1: Redirect to Google login screen
// router.get(
//     '/google',
//     passport.authenticate('google', {
//         scope: ['profile', 'email'],
//         session: false,
//     })
// );
// // Step 2: Google OAuth callback
// router.get(
//     '/google/callback',
//     passport.authenticate('google', {
//         failureRedirect: '/login',
//         session: false,
//     }),
//     (req, res) => {
//         // Create JWT for authenticated user
//         const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
//             expiresIn: '30d',
//         });
//         // Cookie options
//         const cookieOptions = {
//             expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
//         };
//         // Set cookie and redirect
//         res.cookie('token', token, cookieOptions);
//         res.redirect(
//             process.env.CLIENT_URL || 'https://travel-sports-blogging.onrender.com'
//         );
//     }
// );
// // ====================================
// // Debug Route (Temporary for testing)
// // ====================================
// router.get('/debug/env', (req, res) => {
//     res.json({
//         nodeEnv: process.env.NODE_ENV,
//         hasJwtSecret: !!process.env.JWT_SECRET,
//         jwtSecretLength: process.env.JWT_SECRET?.length || 0,
//         cookieSettings: {
//             secure: req.secure,
//             sameSite: req.get('Origin'),
//         },
//     });
// });
// module.exports = router; 
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

// Test endpoint for debugging
router.get('/test', (req, res) => {
    console.log('🔍 Test endpoint called');
    res.json({ 
        success: true, 
        message: 'Backend connection successful',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// ====================================
// Protected Routes (Token required)
// ====================================
// Get the current logged-in user's profile
router.get('/me', protect, getMe);

// Logout the current user
router.get('/logout', protect, logoutUser);

// ====================================
// Google OAuth Routes (FIXED)
// ====================================
// Step 1: Redirect to Google login screen
router.get(
    '/google',
    (req, res, next) => {
        // Store the redirect URL from query params
        const redirectUrl = req.query.redirect;
        if (redirectUrl) {
            req.session = req.session || {};
            req.session.redirectUrl = redirectUrl;
        }
        next();
    },
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
    })
);

// Step 2: Google OAuth callback (COMPLETELY REWRITTEN)
router.get(
    '/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: '/login?error=Google%20authentication%20failed',
    }),
    (req, res) => {
        try {
            console.log('🔐 Google OAuth callback triggered');
            console.log('User from Google:', req.user);

            if (!req.user) {
                console.error('❌ No user data received from Google');
                return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=No%20user%20data%20received`);
            }

            // Create JWT for authenticated user
            const tokenPayload = {
                id: req.user._id,
                userId: req.user._id, // Some middleware expect userId
                email: req.user.email,
                role: req.user.role || 'user'
            };

            const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
                expiresIn: '30d',
            });

            console.log('✅ JWT token created for Google auth:', {
                userId: req.user._id,
                email: req.user.email,
                tokenLength: token.length
            });

            // Get the stored redirect URL or use default
            const redirectUrl = req.session?.redirectUrl || 
                               req.query.redirect || 
                               `${process.env.CLIENT_URL || 'http://localhost:3000'}/login`;
            
            console.log('Redirecting to:', redirectUrl);

            // IMPORTANT: Send token as URL parameter for frontend to capture
            const separator = redirectUrl.includes('?') ? '&' : '?';
            const finalRedirect = `${redirectUrl}${separator}token=${encodeURIComponent(token)}`;

            // Also set as cookie as backup (but make it accessible to JavaScript)
            const cookieOptions = {
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                httpOnly: false, // CHANGED: Allow JavaScript access
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            };

            res.cookie('token', token, cookieOptions);
            
            console.log('🚀 Redirecting with token:', finalRedirect);
            res.redirect(finalRedirect);

        } catch (error) {
            console.error('❌ Google OAuth callback error:', error);
            const errorUrl = `${process.env.CLIENT_URL || 'https://travel-sports-blogging.onrender.com'}/login?error=OAuth%20processing%20failed`;
            res.redirect(errorUrl);
        }
    }
);

// ====================================
// Debug Routes (Enhanced for troubleshooting)
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

// New debug route to test token verification
router.get('/debug/verify-token', (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.json({ 
            success: false, 
            message: 'No token provided',
            authHeader: authHeader ? 'Present but invalid format' : 'Missing'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ 
            success: true, 
            message: 'Token is valid',
            decoded: decoded,
            tokenLength: token.length
        });
    } catch (error) {
        res.json({ 
            success: false, 
            message: 'Invalid token',
            error: error.message 
        });
    }
});

module.exports = router;
