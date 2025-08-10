const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const sendEmail = require('../utils/sendEmail');

// Generate JWT token
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Send token in response cookie
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);
    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    };

    res.status(statusCode).cookie('token', token, options).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        profilePicture: user.profilePicture,
    });
};

// Register user & send email verification
exports.registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) {
        res.status(400);
        throw new Error('User with that email already exists');
    }

    const user = await User.create({ name, email, password });
    if (!user) {
        res.status(400);
        throw new Error('Invalid user data');
    }

    const verificationToken = user.getVerificationToken();
    await user.save({ validateBeforeSave: false });

    const backendUrl = process.env.BACKEND_URL || 'https://travel-sportsblogging.onrender.com';
    const verificationUrl = `${backendUrl}/verify-email/${verificationToken}`;
    const message = `Please verify your email by clicking the link below:\n\n${verificationUrl}`;

    try {
        await sendEmail({ email: user.email, subject: 'NexusBlogs Email Verification', message });
        res.status(200).json({ success: true, message: 'Verification email sent. Please check your inbox.' });
    } catch {
        user.verificationToken = undefined;
        user.verificationTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });
        res.status(500);
        throw new Error('Email could not be sent, but user was registered.');
    }
});

// Login user
exports.loginUser = asyncHandler(async (req, res) => {
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

// Verify email & auto-login
exports.verifyEmail = asyncHandler(async (req, res) => {
    if (!req.params.token) {
        res.status(400);
        throw new Error('No verification token provided');
    }

    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        verificationToken: hashedToken,
        verificationTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid or expired verification token');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();

    const token = generateToken(user._id);
    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    };

    res.status(200)
        .cookie('token', token, options)
        .json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            bio: user.bio,
            profilePicture: user.profilePicture,
            isVerified: true,
            isAuthenticated: true,
            message: 'Email verified successfully! You are now logged in.'
        });
});

// Resend verification email
exports.resendVerificationEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400);
        throw new Error('Please provide an email address');
    }

    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error('No user found with that email');
    }

    if (user.isVerified) {
        res.status(400);
        throw new Error('User is already verified');
    }

    const verificationToken = user.getVerificationToken();
    await user.save({ validateBeforeSave: false });

    const backendUrl = process.env.BACKEND_URL || 'https://travel-sportsblogging.onrender.com';
    const verificationUrl = `${backendUrl}/verify-email/${verificationToken}`;
    const message = `Your new email verification link:\n\n${verificationUrl}`;

    try {
        await sendEmail({ email: user.email, subject: 'NexusBlogs - New Email Verification', message });
        res.status(200).json({ success: true, message: 'New verification email sent. Please check your inbox.' });
    } catch {
        user.verificationToken = undefined;
        user.verificationTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });
        res.status(500);
        throw new Error('Email could not be sent');
    }
});

// Logout user
exports.logoutUser = (req, res) => {
    const options = {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    };
    res.status(200).cookie('token', 'none', options).json({ success: true, message: 'Logged out successfully' });
};

// Get current user
exports.getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

// Forgot password
exports.forgotPassword = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        res.status(404);
        throw new Error('No user found with that email');
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const clientUrl = process.env.CLIENT_URL || 'https://travel-sports-blogging.onrender.com';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;
    const message = `You requested a password reset. Please use the link below:\n\n${resetUrl}`;

    try {
        await sendEmail({ email: user.email, subject: 'Password Reset Token', message });
        res.status(200).json({ success: true, message: 'Reset email sent' });
    } catch {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        res.status(500);
        throw new Error('Email could not be sent');
    }
});

// Reset password
exports.resetPassword = asyncHandler(async (req, res) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
    const user = await User.findOne({
        resetPasswordToken: hashedToken,
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

// Update user details
exports.updateDetails = asyncHandler(async (req, res) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
        bio: req.body.bio
    };
    Object.keys(fieldsToUpdate).forEach(key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]);

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json(user);
});

// Update password
exports.updatePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.matchPassword(req.body.currentPassword))) {
        res.status(400);
        throw new Error('Current password is incorrect');
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
});
