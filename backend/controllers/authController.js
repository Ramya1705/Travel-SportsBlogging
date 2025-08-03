const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const sendEmail = require('../utils/sendEmail');

// Helper to generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Helper to send token in response cookie
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);
    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };
    res.status(statusCode).cookie('token', token, options).json({
        _id: user._id, name: user.name, email: user.email,
        role: user.role, bio: user.bio, profilePicture: user.profilePicture,
    });
};

// @desc    Register user & send email verification
exports.registerUser = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User with that email already exists');
    }
    const user = await User.create({ name, email, password });
    if (!user) {
        res.status(400);
        throw new Error('Invalid user data');
    }
    // Email verification logic
    const verificationToken = user.getVerificationToken();
    await user.save({ validateBeforeSave: false });
    const verificationUrl = `https://travel-sports-blogging.onrender.com/verify-email/${verificationToken}`;
    const message = `Thank you for registering! Please verify your email by clicking the link below:\n\n${verificationUrl}`;
    try {
        await sendEmail({ email: user.email, subject: 'Travel and Sports Blogging  Email Verification', message });
        res.status(200).json({ success: true, message: 'Verification email sent. Please check your inbox.' });
    } catch (err) {
        console.error(err);
        user.verificationToken = undefined;
        user.verificationTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });
        res.status(500);
        throw new Error('Email could not be sent, but user was registered.');
    }
});

// @desc    Login user
exports.loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide an email and password');
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
        res.status(401);
        throw new Error('Invalid credentials');
    }
    if (!user.isVerified) {
        res.status(403);
        throw new Error('Please verify your email before logging in');
    }
    sendTokenResponse(user, 200, res);
});


// @desc    Verify email
exports.verifyEmail = asyncHandler(async (req, res, next) => {
    const verificationToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ verificationToken, verificationTokenExpire: { $gt: Date.now() } });
    if (!user) {
        res.status(400);
        throw new Error('Invalid or expired verification token.');
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();
    sendTokenResponse(user, 200, res);
});

// @desc    Logout user
exports.logoutUser = (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    }).status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get current user (protected route)
exports.getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

// @desc    Forgot password
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        res.status(404);
        throw new Error('No user found with that email');
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl = `https://travel-sports-blogging.onrender.com/reset-password/${resetToken}`;
    const message = `You requested a password reset. Please use the link below:\n\n${resetUrl}`;
    try {
        await sendEmail({ email: user.email, subject: 'Password Reset Token', message, });
        res.status(200).json({ success: true, message: 'Reset email sent' });
    } catch (err) {
        console.error(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        res.status(500);
        throw new Error('Email could not be sent');
    }
});

// @desc    Reset password
exports.resetPassword = asyncHandler(async (req, res, next) => {
    const resetToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
    const user = await User.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
        res.status(400);
        throw new Error('Invalid or expired reset token');
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendTokenResponse(user, 200, res);
});
