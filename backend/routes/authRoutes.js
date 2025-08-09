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
    verifyEmail
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');


// --- Public Routes (No token required) ---

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


// --- Protected Routes (Token is required) ---

// Get the current logged-in user's profile
router.get('/me', protect, getMe);

// Logout the current user
router.get('/logout', protect, logoutUser);


// --- Google OAuth Routes ---

// The initial route to trigger Google's login screen
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
    })
);

// The callback route that Google redirects to after successful login
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
        // On success, create our own JWT and send it as a cookie
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        // const options = {
        //     expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        // };
          const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
};
        res.cookie('token', token, options);
        // Redirect the user back to the frontend application
        res.redirect(process.env.CLIENT_URL || 'https://travel-sports-blogging.onrender.com');
    }
);

module.exports = router;
