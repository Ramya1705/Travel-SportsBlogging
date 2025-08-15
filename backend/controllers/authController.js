// const crypto = require('crypto');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const asyncHandler = require('../middleware/asyncHandler');
// const sendEmail = require('../utils/sendEmail');

// // Helper to generate JWT token
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
// };

// // Helper to send token in response cookie
// const sendTokenResponse = (user, statusCode, res) => {
//   const token = generateToken(user._id);
//   const options = {
//     expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
//   };

//   res.status(statusCode).cookie('token', token, options).json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     role: user.role,
//     bio: user.bio,
//     profilePicture: user.profilePicture,
//     isVerified: user.isVerified,
//     isAuthenticated: true,
//     token // Include token in response for frontend storage if needed
//   });
// };

// // @desc Register user & send email verification
// exports.registerUser = asyncHandler(async (req, res, next) => {
//   console.log('=== REGISTER USER DEBUG ===');
//   console.log('Request body:', req.body);

//   const { name, email, password } = req.body;
  
//   // Validate required fields
//   if (!name || !email || !password) {
//     res.status(400);
//     throw new Error('Please provide name, email, and password');
//   }

//   const userExists = await User.findOne({ email });

//   if (userExists) {
//     console.log('User already exists:', email);
//     res.status(400);
//     throw new Error('User with that email already exists');
//   }

//   const user = await User.create({ name, email, password });
//   console.log('User created:', { id: user._id, email: user.email });

//   if (!user) {
//     res.status(400);
//     throw new Error('Invalid user data');
//   }

//   // Email verification logic
//   const verificationToken = user.getVerificationToken();
//   console.log('Generated verification token (plain):', verificationToken);

//   await user.save({ validateBeforeSave: false });
//   console.log('User saved with verification token');

//   // Use backend URL for verification endpoint
//   const backendUrl = process.env.BACKEND_URL || 'https://travel-sportsblogging.onrender.com';
//   const verificationUrl = `${backendUrl}/api/auth/verify-email/${verificationToken}`;

//   console.log('Verification URL generated:', verificationUrl);
//   console.log('BACKEND_URL from env:', process.env.BACKEND_URL);
//   console.log('CLIENT_URL from env:', process.env.CLIENT_URL);

//   const message = `Thank you for registering! Please verify your email by clicking the link below:\n\n${verificationUrl}`;

//   try {
//     await sendEmail({
//       email: user.email,
//       subject: 'NexusBlogs Email Verification',
//       message
//     });
    
//     console.log('Verification email sent successfully to:', user.email);
//     res.status(200).json({
//       success: true,
//       message: 'User registered successfully. Verification email sent. Please check your inbox.',
//       userId: user._id
//     });
//   } catch (err) {
//     console.error('Email sending failed:', err);
//     user.verificationToken = undefined;
//     user.verificationTokenExpire = undefined;
//     await user.save({ validateBeforeSave: false });
//     res.status(500);
//     throw new Error('User registered but verification email could not be sent. Please request a new verification email.');
//   }
// });

// // @desc Login user
// exports.loginUser = asyncHandler(async (req, res, next) => {
//   console.log('=== LOGIN USER DEBUG ===');
//   console.log('Login attempt for:', req.body.email);

//   const { email, password } = req.body;
  
//   if (!email || !password) {
//     console.log('Missing email or password');
//     res.status(400);
//     throw new Error('Please provide an email and password');
//   }

//   const user = await User.findOne({ email }).select('+password');
//   console.log('User found:', user ? `ID: ${user._id}, Verified: ${user.isVerified}` : 'No user found');

//   if (!user || !(await user.matchPassword(password))) {
//     console.log('Invalid credentials for:', email);
//     res.status(401);
//     throw new Error('Invalid credentials');
//   }

//   if (!user.isVerified) {
//     console.log('User not verified:', email);
//     res.status(403);
//     throw new Error('Please verify your email before logging in. Check your inbox for verification link.');
//   }

//   console.log('Login successful for:', email);
//   sendTokenResponse(user, 200, res);
// });

// // @desc Verify email - ENHANCED WITH PROPER REDIRECT AND AUTHENTICATION
// exports.verifyEmail = asyncHandler(async (req, res, next) => {
//   console.log('=== EMAIL VERIFICATION DEBUG ===');
//   console.log('Timestamp:', new Date().toISOString());
//   console.log('Environment:', process.env.NODE_ENV);
//   console.log('Full request URL:', req.url);
//   console.log('Request method:', req.method);
//   console.log('Request headers:', JSON.stringify(req.headers, null, 2));
//   console.log('Request params:', req.params);
//   console.log('Raw token from URL:', req.params.token);

//   // Validate token parameter exists
//   if (!req.params.token) {
//     console.error('❌ No token provided in request params');
//     res.status(400);
//     throw new Error('No verification token provided');
//   }

//   // Hash the token for database lookup
//   const verificationToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
//   console.log('Hashed token for DB lookup:', verificationToken);

//   // Search for user with this token
//   console.log('Searching for user with verification token...');
//   const user = await User.findOne({
//     verificationToken,
//     verificationTokenExpire: { $gt: Date.now() }
//   });

//   console.log('Database query result:', user ? `Found user: ${user.email}` : 'No user found');

//   if (user) {
//     console.log('User details:', {
//       id: user._id,
//       email: user.email,
//       isVerified: user.isVerified,
//       tokenExpire: user.verificationTokenExpire,
//       currentTime: Date.now(),
//       tokenValid: user.verificationTokenExpire > Date.now()
//     });
//   } else {
//     // Additional debugging for failed token lookup
//     console.log('🔍 DEBUGGING FAILED TOKEN LOOKUP:');

//     // Check if user exists with any verification token
//     const anyUserWithToken = await User.findOne({ verificationToken });
//     console.log('User with this token (ignoring expiry):', anyUserWithToken ? 'EXISTS' : 'NOT FOUND');

//     // Check if user exists with expired token
//     const expiredUser = await User.findOne({
//       verificationToken,
//       verificationTokenExpire: { $lt: Date.now() }
//     });
//     console.log('User with expired token:', expiredUser ? 'EXISTS (EXPIRED)' : 'NOT FOUND');

//     // Check all users with verification tokens (for debugging)
//     const allUsersWithTokens = await User.find({
//       verificationToken: { $exists: true, $ne: null }
//     }).select('email verificationToken verificationTokenExpire');
//     console.log('All users with verification tokens:', allUsersWithTokens.map(u => ({
//       email: u.email,
//       tokenMatch: u.verificationToken === verificationToken,
//       expired: u.verificationTokenExpire < Date.now()
//     })));
//   }

//   if (!user) {
//     console.error('❌ Verification failed: Invalid or expired token');
    
//     // Check if this is a browser request for better UX
//     const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
//     const isWebBrowser = req.headers['user-agent'] && (
//       req.headers['user-agent'].includes('Mozilla') || 
//       req.headers['user-agent'].includes('Chrome') ||
//       req.headers['user-agent'].includes('Safari')
//     );

//     if (acceptsHtml && isWebBrowser) {
//       const clientUrl = process.env.CLIENT_URL || 'https://travel-sports-blogging.onrender.com';
//       const errorUrl = `${clientUrl}/verify-email-error?error=invalid_token`;
//       return res.redirect(302, errorUrl);
//     }

//     res.status(400);
//     throw new Error('Invalid or expired verification token.');
//   }

//   // Check if user is already verified
//   if (user.isVerified) {
//     console.log('⚠️ User already verified:', user.email);
    
//     // Still authenticate the user and redirect to success
//     const token = generateToken(user._id);
//     const cookieOptions = {
//       expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
//     };

//     res.cookie('token', token, cookieOptions);

//     // Check if browser request for redirect
//     const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
//     const isWebBrowser = req.headers['user-agent'] && (
//       req.headers['user-agent'].includes('Mozilla') || 
//       req.headers['user-agent'].includes('Chrome') ||
//       req.headers['user-agent'].includes('Safari')
//     );

//     if (acceptsHtml && isWebBrowser) {
//       const clientUrl = process.env.CLIENT_URL || 'https://travel-sports-blogging.onrender.com';
//       const successUrl = `${clientUrl}/?verified=true&user=${encodeURIComponent(user.name)}&already_verified=true`;
//       return res.redirect(302, successUrl);
//     }

//     return res.status(200).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       bio: user.bio,
//       profilePicture: user.profilePicture,
//       isVerified: true,
//       isAuthenticated: true,
//       token,
//       message: 'Email was already verified! You are now logged in.'
//     });
//   }

//   // Update user verification status
//   console.log('✅ Updating user verification status...');
//   user.isVerified = true;
//   user.verificationToken = undefined;
//   user.verificationTokenExpire = undefined;

//   try {
//     await user.save();
//     console.log('✅ User verification status updated successfully');
//   } catch (saveError) {
//     console.error('❌ Error saving user:', saveError);
//     res.status(500);
//     throw new Error('Verification successful but failed to update user status. Please try logging in.');
//   }

//   // Generate authentication token
//   const token = generateToken(user._id);
//   const cookieOptions = {
//     expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
//   };

//   // Set authentication cookie
//   res.cookie('token', token, cookieOptions);

//   // Check if this is a web browser request (wants HTML redirect) or API request (wants JSON)
//   const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
//   const isWebBrowser = req.headers['user-agent'] && (
//     req.headers['user-agent'].includes('Mozilla') || 
//     req.headers['user-agent'].includes('Chrome') ||
//     req.headers['user-agent'].includes('Safari')
//   );

//   // If it's a browser request, redirect to frontend with success params
//   if (acceptsHtml && isWebBrowser) {
//     console.log('🌐 Browser request detected, redirecting to frontend...');
//     const clientUrl = process.env.CLIENT_URL || 'https://travel-sports-blogging.onrender.com';
//     const successUrl = `${clientUrl}/?verified=true&user=${encodeURIComponent(user.name)}`;
//     return res.redirect(302, successUrl);
//   }

//   // Prepare response data for API requests
//   const responseData = {
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     role: user.role,
//     bio: user.bio,
//     profilePicture: user.profilePicture,
//     isVerified: true,
//     isAuthenticated: true,
//     token,
//     message: 'Email verified successfully! You are now logged in.'
//   };

//   console.log('✅ Sending successful verification response:', responseData);

//   // Return user data as JSON with authentication cookie
//   res.status(200).json(responseData);
// });

// // @desc Resend verification email
// exports.resendVerificationEmail = asyncHandler(async (req, res, next) => {
//   console.log('=== RESEND VERIFICATION EMAIL DEBUG ===');
//   console.log('Resend request for email:', req.body.email);

//   const { email } = req.body;

//   if (!email) {
//     res.status(400);
//     throw new Error('Please provide an email address');
//   }

//   const user = await User.findOne({ email });

//   if (!user) {
//     res.status(404);
//     throw new Error('No user found with that email address');
//   }

//   if (user.isVerified) {
//     res.status(400);
//     throw new Error('User is already verified. You can log in directly.');
//   }

//   // Generate new verification token
//   const verificationToken = user.getVerificationToken();
//   await user.save({ validateBeforeSave: false });

//   // Use backend URL for verification
//   const backendUrl = process.env.BACKEND_URL || 'https://travel-sportsblogging.onrender.com';
//   const verificationUrl = `${backendUrl}/api/auth/verify-email/${verificationToken}`;

//   console.log('New verification URL:', verificationUrl);

//   const message = `Your new email verification link for NexusBlogs:\n\n${verificationUrl}\n\nThis link will expire in 10 minutes.`;

//   try {
//     await sendEmail({
//       email: user.email,
//       subject: 'NexusBlogs - New Email Verification',
//       message
//     });
    
//     console.log('New verification email sent to:', user.email);
//     res.status(200).json({
//       success: true,
//       message: 'New verification email sent successfully. Please check your inbox and spam folder.'
//     });
//   } catch (err) {
//     console.error('Resend verification email failed:', err);
//     user.verificationToken = undefined;
//     user.verificationTokenExpire = undefined;
//     await user.save({ validateBeforeSave: false });
//     res.status(500);
//     throw new Error('Verification email could not be sent. Please try again later.');
//   }
// });

// // @desc Logout user
// exports.logoutUser = (req, res) => {
//   console.log('=== LOGOUT USER DEBUG ===');
//   console.log('User logging out');

//   const options = {
//     expires: new Date(Date.now() + 10 * 1000), // Expire immediately
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
//   };
  
//   res.status(200).cookie('token', 'none', options).json({
//     success: true,
//     message: 'Logged out successfully'
//   });
// };

// // @desc Get current user (protected route)
// exports.getMe = asyncHandler(async (req, res) => {
//   console.log('=== GET ME DEBUG ===');
//   console.log('Current user:', req.user ? req.user.email : 'No user');
  
//   if (!req.user) {
//     res.status(401);
//     throw new Error('Not authorized to access this route');
//   }

//   res.status(200).json({
//     _id: req.user._id,
//     name: req.user.name,
//     email: req.user.email,
//     role: req.user.role,
//     bio: req.user.bio,
//     profilePicture: req.user.profilePicture,
//     isVerified: req.user.isVerified,
//     isAuthenticated: true
//   });
// });

// // @desc Forgot password
// exports.forgotPassword = asyncHandler(async (req, res, next) => {
//   console.log('=== FORGOT PASSWORD DEBUG ===');
//   console.log('Password reset requested for:', req.body.email);

//   const { email } = req.body;

//   if (!email) {
//     res.status(400);
//     throw new Error('Please provide an email address');
//   }

//   const user = await User.findOne({ email });
  
//   if (!user) {
//     console.log('No user found with email:', email);
//     res.status(404);
//     throw new Error('No user found with that email address');
//   }

//   const resetToken = user.getResetPasswordToken();
//   await user.save({ validateBeforeSave: false });

//   // Use frontend URL for password reset (this should go to frontend)
//   const clientUrl = process.env.CLIENT_URL || 'https://travel-sports-blogging.onrender.com';
//   const resetUrl = `${clientUrl}/reset-password/${resetToken}`;
//   console.log('Password reset URL:', resetUrl);

//   const message = `You requested a password reset for your NexusBlogs account. Please click the link below to reset your password:\n\n${resetUrl}\n\nThis link will expire in 10 minutes. If you did not request this reset, please ignore this email.`;

//   try {
//     await sendEmail({
//       email: user.email,
//       subject: 'NexusBlogs Password Reset',
//       message
//     });
    
//     console.log('Password reset email sent to:', user.email);
//     res.status(200).json({
//       success: true,
//       message: 'Password reset email sent successfully. Please check your inbox.'
//     });
//   } catch (err) {
//     console.error('Password reset email failed:', err);
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;
//     await user.save({ validateBeforeSave: false });
//     res.status(500);
//     throw new Error('Password reset email could not be sent. Please try again later.');
//   }
// });

// // @desc Reset password
// exports.resetPassword = asyncHandler(async (req, res, next) => {
//   console.log('=== RESET PASSWORD DEBUG ===');
//   console.log('Password reset attempt with token:', req.params.resettoken);

//   const { password } = req.body;

//   if (!password) {
//     res.status(400);
//     throw new Error('Please provide a new password');
//   }

//   if (password.length < 6) {
//     res.status(400);
//     throw new Error('Password must be at least 6 characters long');
//   }

//   const resetToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
//   const user = await User.findOne({
//     resetPasswordToken: resetToken,
//     resetPasswordExpire: { $gt: Date.now() },
//   });

//   if (!user) {
//     console.log('Invalid or expired reset token');
//     res.status(400);
//     throw new Error('Invalid or expired password reset token');
//   }

//   console.log('Password reset successful for:', user.email);
//   user.password = password;
//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpire = undefined;
//   await user.save();

//   sendTokenResponse(user, 200, res);
// });

// // @desc Update user details
// exports.updateDetails = asyncHandler(async (req, res, next) => {
//   console.log('=== UPDATE USER DETAILS DEBUG ===');
//   console.log('Update request for user:', req.user.email);

//   const fieldsToUpdate = {
//     name: req.body.name,
//     email: req.body.email,
//     bio: req.body.bio
//   };

//   // Remove undefined fields
//   Object.keys(fieldsToUpdate).forEach(key =>
//     fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
//   );

//   console.log('Fields to update:', fieldsToUpdate);

//   // If email is being updated, require re-verification
//   if (fieldsToUpdate.email && fieldsToUpdate.email !== req.user.email) {
//     const existingUser = await User.findOne({ email: fieldsToUpdate.email });
//     if (existingUser) {
//       res.status(400);
//       throw new Error('Email is already taken by another user');
//     }
//     fieldsToUpdate.isVerified = false; // Require re-verification for new email
//   }

//   const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
//     new: true,
//     runValidators: true
//   });

//   console.log('User updated successfully:', user.email);
//   res.status(200).json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     role: user.role,
//     bio: user.bio,
//     profilePicture: user.profilePicture,
//     isVerified: user.isVerified,
//     isAuthenticated: true
//   });
// });

// // @desc Update password
// exports.updatePassword = asyncHandler(async (req, res, next) => {
//   console.log('=== UPDATE PASSWORD DEBUG ===');
//   console.log('Password update request for user:', req.user.email);

//   const { currentPassword, newPassword } = req.body;

//   if (!currentPassword || !newPassword) {
//     res.status(400);
//     throw new Error('Please provide both current and new password');
//   }

//   if (newPassword.length < 6) {
//     res.status(400);
//     throw new Error('New password must be at least 6 characters long');
//   }

//   const user = await User.findById(req.user.id).select('+password');

//   // Check current password
//   if (!(await user.matchPassword(currentPassword))) {
//     console.log('Current password incorrect for user:', user.email);
//     res.status(400);
//     throw new Error('Current password is incorrect');
//   }

//   user.password = newPassword;
//   await user.save();

//   console.log('Password updated successfully for user:', user.email);
//   sendTokenResponse(user, 200, res);
// });
// controllers/authController.js
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const sendEmail = require('../utils/sendEmail');

/* ---------------------- HELPER FUNCTIONS ---------------------- */

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Send token via cookie + JSON
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const options = {
    expires: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio,
      profilePicture: user.profilePicture,
      isVerified: user.isVerified,
      isAuthenticated: true
    });
};

/* ---------------------- AUTH CONTROLLERS ---------------------- */

// @desc    Register user & send verification email
// @route   POST /api/auth/register
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with that email already exists');
  }

  const user = await User.create({ name, email, password });

  const verificationToken = user.getVerificationToken();
  await user.save({ validateBeforeSave: false });

  const backendUrl =
    process.env.BACKEND_URL || 'https://travel-sportsblogging.onrender.com';
  const verificationUrl = `${backendUrl}/api/auth/verify-email/${verificationToken}`;

  const message = `Please verify your email by clicking the link below:\n\n${verificationUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'NexusBlogs Email Verification',
      message
    });

    res.status(200).json({
      success: true,
      message:
        'User registered successfully. Verification email sent. Please check your inbox.',
      userId: user._id
    });
  } catch (err) {
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500);
    throw new Error(
      'User registered but verification email could not be sent.'
    );
  }
});

// @desc    Login user
// @route   POST /api/auth/login
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide an email and password');
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
    '+password'
  );

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  if (!user.isVerified) {
    res.status(403);
    throw new Error(
      'Please verify your email before logging in. Check your inbox.'
    );
  }

  sendTokenResponse(user, 200, res);

  // Optional: Update last login
  user.lastLogin = new Date();
  await user.save();
});

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
exports.verifyEmail = asyncHandler(async (req, res) => {
  if (!req.params.token) {
    res.status(400);
    throw new Error('No verification token provided');
  }

  const verificationToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    verificationToken,
    verificationTokenExpire: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired verification token.');
  }

  if (user.isVerified) {
    return sendTokenResponse(user, 200, res);
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
exports.resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Please provide an email address');
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('No user found with that email address');
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error('User is already verified. You can log in directly.');
  }

  const verificationToken = user.getVerificationToken();
  await user.save({ validateBeforeSave: false });

  const backendUrl =
    process.env.BACKEND_URL || 'https://travel-sportsblogging.onrender.com';
  const verificationUrl = `${backendUrl}/api/auth/verify-email/${verificationToken}`;

  const message = `Your new email verification link for NexusBlogs:\n\n${verificationUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'NexusBlogs - New Email Verification',
      message
    });

    res.status(200).json({
      success: true,
      message:
        'New verification email sent successfully. Please check your inbox.'
    });
  } catch (err) {
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500);
    throw new Error('Verification email could not be sent.');
  }
});

// @desc    Logout user
// @route   GET /api/auth/logout
exports.logoutUser = (req, res) => {
  const options = {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
  };

  res.status(200).cookie('token', 'none', options).json({
    success: true,
    message: 'Logged out successfully'
  });
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.status(200).json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    bio: req.user.bio,
    profilePicture: req.user.profilePicture,
    isVerified: req.user.isVerified,
    isAuthenticated: true
  });
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Please provide an email address');
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('No user found with that email address');
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const clientUrl =
    process.env.CLIENT_URL || 'https://travel-sports-blogging.onrender.com';
  const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

  const message = `You requested a password reset:\n\n${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'NexusBlogs Password Reset',
      message
    });

    res.status(200).json({
      success: true,
      message:
        'Password reset email sent successfully. Please check your inbox.'
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500);
    throw new Error('Password reset email could not be sent.');
  }
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resettoken
exports.resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password || password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters long');
  }

  const resetToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired password reset token');
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Update user details
// @route   PUT /api/auth/update-details
exports.updateDetails = asyncHandler(async (req, res) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    bio: req.body.bio
  };

  Object.keys(fieldsToUpdate).forEach(
    (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  if (fieldsToUpdate.email && fieldsToUpdate.email !== req.user.email) {
    const existingUser = await User.findOne({ email: fieldsToUpdate.email });
    if (existingUser) {
      res.status(400);
      throw new Error('Email is already taken');
    }
    fieldsToUpdate.isVerified = false;
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    bio: user.bio,
    profilePicture: user.profilePicture,
    isVerified: user.isVerified,
    isAuthenticated: true
  });
});

// @desc    Update password
// @route   PUT /api/auth/update-password
exports.updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword || newPassword.length < 6) {
    res.status(400);
    throw new Error('Please provide valid current and new password');
  }

  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.matchPassword(currentPassword))) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});
