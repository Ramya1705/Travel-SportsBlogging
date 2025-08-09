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
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
    })
);
// Step 2: Google OAuth callback
router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login',
        session: false,
    }),
    (req, res) => {
        // Create JWT for authenticated user
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });
        // Cookie options
        const cookieOptions = {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        };
        // Set cookie and redirect
        res.cookie('token', token, cookieOptions);
        res.redirect(
            process.env.CLIENT_URL || 'https://travel-sports-blogging.onrender.com'
        );
    }
);
// ====================================
// Debug Route (Temporary for testing)
// ====================================
router.get('/debug/env', (req, res) => {
    res.json({
        nodeEnv: process.env.NODE_ENV,
        hasJwtSecret: !!process.env.JWT_SECRET,
        jwtSecretLength: process.env.JWT_SECRET?.length || 0,
        cookieSettings: {
            secure: req.secure,
            sameSite: req.get('Origin'),
        },
    });
});
module.exports = router; 
