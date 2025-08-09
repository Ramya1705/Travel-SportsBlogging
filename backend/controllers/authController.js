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
        // *** CRUCIAL FIX: Added `sameSite` attribute ***
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    };
    res.status(statusCode).cookie('token', token, options).json({
        _id: user._id, name: user.name, email: user.email,
        role: user.role, bio: user.bio, profilePicture: user.profilePicture,
    });
};

// @desc      Register user & send email verification
exports.registerUser = asyncHandler(async (req, res, next) => {
    console.log('=== REGISTER USER DEBUG ===');
    console.log('Request body:', req.body);
    
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        console.log('User already exists:', email);
        res.status(400);
        throw new Error('User with that email already exists');
    }
    
    const user = await User.create({ name, email, password });
    console.log('User created:', { id: user._id, email: user.email });
    
    if (!user) {
        res.status(400);
        throw new Error('Invalid user data');
    }
    
    // Email verification logic
    const verificationToken = user.getVerificationToken();
    console.log('Generated verification token (plain):', verificationToken);
    
    await user.save({ validateBeforeSave: false });
    console.log('User saved with verification token');
    
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    console.log('Verification URL generated:', verificationUrl);
    console.log('CLIENT_URL from env:', process.env.CLIENT_URL);
    
    const message = `Thank you for registering! Please verify your email by clicking the link below:\n\n${verificationUrl}`;
    
    try {
        await sendEmail({ email: user.email, subject: 'NexusBlogs Email Verification', message });
        console.log('Verification email sent successfully to:', user.email);
        res.status(200).json({ success: true, message: 'Verification email sent. Please check your inbox.' });
    } catch (err) {
        console.error('Email sending failed:', err);
        user.verificationToken = undefined;
        user.verificationTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });
        res.status(500);
        throw new Error('Email could not be sent, but user was registered.');
    }
});

// @desc      Login user
exports.loginUser = asyncHandler(async (req, res, next) => {
    console.log('=== LOGIN USER DEBUG ===');
    console.log('Login attempt for:', req.body.email);
    
    const { email, password } = req.body;
    if (!email || !password) {
        console.log('Missing email or password');
        res.status(400);
        throw new Error('Please provide an email and password');
    }
    
    const user = await User.findOne({ email }).select('+password');
    console.log('User found:', user ? `ID: ${user._id}, Verified: ${user.isVerified}` : 'No user found');
    
    if (!user || !(await user.matchPassword(password))) {
        console.log('Invalid credentials for:', email);
        res.status(401);
        throw new Error('Invalid credentials');
    }
    
    if (!user.isVerified) {
        console.log('User not verified:', email);
        res.status(403);
        throw new Error('Please verify your email before logging in');
    }
    
    console.log('Login successful for:', email);
    sendTokenResponse(user, 200, res);
});

// @desc      Verify email - ENHANCED WITH DEBUG LOGS
exports.verifyEmail = asyncHandler(async (req, res, next) => {
    console.log('=== EMAIL VERIFICATION DEBUG ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Full request URL:', req.url);
    console.log('Request method:', req.method);
    console.log('Request headers:', JSON.stringify(req.headers, null, 2));
    console.log('Request params:', req.params);
    console.log('Raw token from URL:', req.params.token);
    
    // Validate token parameter exists
    if (!req.params.token) {
        console.error('❌ No token provided in request params');
        res.status(400);
        throw new Error('No verification token provided');
    }
    
    // Hash the token for database lookup
    const verificationToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    console.log('Hashed token for DB lookup:', verificationToken);
    
    // Search for user with this token
    console.log('Searching for user with verification token...');
    const user = await User.findOne({ 
        verificationToken, 
        verificationTokenExpire: { $gt: Date.now() } 
    });
    
    console.log('Database query result:', user ? `Found user: ${user.email}` : 'No user found');
    
    if (user) {
        console.log('User details:', {
            id: user._id,
            email: user.email,
            isVerified: user.isVerified,
            tokenExpire: user.verificationTokenExpire,
            currentTime: Date.now(),
            tokenValid: user.verificationTokenExpire > Date.now()
        });
    } else {
        // Additional debugging for failed token lookup
        console.log('🔍 DEBUGGING FAILED TOKEN LOOKUP:');
        
        // Check if user exists with any verification token
        const anyUserWithToken = await User.findOne({ verificationToken });
        console.log('User with this token (ignoring expiry):', anyUserWithToken ? 'EXISTS' : 'NOT FOUND');
        
        // Check if user exists with expired token
        const expiredUser = await User.findOne({ 
            verificationToken, 
            verificationTokenExpire: { $lt: Date.now() } 
        });
        console.log('User with expired token:', expiredUser ? 'EXISTS (EXPIRED)' : 'NOT FOUND');
        
        // Check all users with verification tokens (for debugging)
        const allUsersWithTokens = await User.find({ 
            verificationToken: { $exists: true, $ne: null } 
        }).select('email verificationToken verificationTokenExpire');
        console.log('All users with verification tokens:', allUsersWithTokens.map(u => ({
            email: u.email,
            tokenMatch: u.verificationToken === verificationToken,
            expired: u.verificationTokenExpire < Date.now()
        })));
    }
    
    if (!user) {
        console.error('❌ Verification failed: Invalid or expired token');
        res.status(400);
        throw new Error('Invalid or expired verification token.');
    }
    
    // Update user verification status
    console.log('✅ Updating user verification status...');
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    
    try {
        await user.save();
        console.log('✅ User verification status updated successfully');
    } catch (saveError) {
        console.error('❌ Error saving user:', saveError);
        throw saveError;
    }
    
    // Prepare response data
    const responseData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        profilePicture: user.profilePicture,
        isVerified: user.isVerified,
        message: 'Email verified successfully!'
    };
    
    console.log('✅ Sending successful verification response:', responseData);
    
    // Return user data as JSON
    res.status(200).json(responseData);
});

// @desc      Logout user
exports.logoutUser = (req, res) => {
    console.log('=== LOGOUT USER DEBUG ===');
    console.log('User logging out');
    
    const options = {
        expires: new Date(Date.now() + 10 * 1000), // Expire immediately
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    };
    res.status(200).cookie('token', 'none', options).json({ success: true, message: 'Logged out successfully' });
};

// @desc      Get current user (protected route)
exports.getMe = asyncHandler(async (req, res) => {
    console.log('=== GET ME DEBUG ===');
    console.log('Current user:', req.user ? req.user.email : 'No user');
    res.status(200).json(req.user);
});

// @desc      Forgot password
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    console.log('=== FORGOT PASSWORD DEBUG ===');
    console.log('Password reset requested for:', req.body.email);
    
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        console.log('No user found with email:', req.body.email);
        res.status(404);
        throw new Error('No user found with that email');
    }
    
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    console.log('Password reset URL:', resetUrl);
    
    const message = `You requested a password reset. Please use the link below:\n\n${resetUrl}`;
    
    try {
        await sendEmail({ email: user.email, subject: 'Password Reset Token', message, });
        console.log('Password reset email sent to:', user.email);
        res.status(200).json({ success: true, message: 'Reset email sent' });
    } catch (err) {
        console.error('Password reset email failed:', err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        res.status(500);
        throw new Error('Email could not be sent');
    }
});

// @desc      Reset password
exports.resetPassword = asyncHandler(async (req, res, next) => {
    console.log('=== RESET PASSWORD DEBUG ===');
    console.log('Password reset attempt with token:', req.params.resettoken);
    
    const resetToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
    const user = await User.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    
    if (!user) {
        console.log('Invalid or expired reset token');
        res.status(400);
        throw new Error('Invalid or expired reset token');
    }
    
    console.log('Password reset successful for:', user.email);
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    
    sendTokenResponse(user, 200, res);
});
