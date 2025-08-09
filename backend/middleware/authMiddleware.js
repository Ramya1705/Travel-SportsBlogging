const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');

exports.protect = asyncHandler(async (req, res, next) => {
    let token;
    
    // Debug logs for environment
    console.log('🔍 DEBUG: Environment check');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length || 0);
    
    // Debug logs for request headers
    console.log('🔍 DEBUG: Request headers');
    console.log('Authorization header:', req.headers.authorization);
    console.log('Cookie header:', req.headers.cookie);
    console.log('All cookies:', req.cookies);
    console.log('Token cookie specifically:', req.cookies.token);
    
    // Check for token in cookies first
    if (req.cookies && req.cookies.token) {
        console.log('✅ Token found in cookies');
        token = req.cookies.token;
    }
    // Fallback: Check Authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        console.log('✅ Token found in Authorization header');
        token = req.headers.authorization.split(' ')[1];
    }
    // Fallback: Check for token in header without Bearer
    else if (req.headers.authorization) {
        console.log('✅ Token found in Authorization header (no Bearer prefix)');
        token = req.headers.authorization;
    }
    
    console.log('🔍 DEBUG: Token extraction result');
    console.log('Token exists:', !!token);
    console.log('Token length:', token?.length || 0);
    console.log('Token preview:', token ? `${token.substring(0, 20)}...` : 'No token');
    
    if (token) {
        try {
            console.log('🔍 DEBUG: Attempting to verify token');
            
            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('✅ Token verification successful');
            console.log('Decoded payload:', {
                id: decoded.id,
                iat: decoded.iat,
                exp: decoded.exp,
                expiresAt: new Date(decoded.exp * 1000),
                currentTime: new Date(),
                isExpired: decoded.exp * 1000 < Date.now()
            });
            
            // Find user
            console.log('🔍 DEBUG: Looking up user with ID:', decoded.id);
            const user = await User.findById(decoded.id).select('-password');
            
            if (!user) {
                console.log('❌ User not found in database');
                res.status(401);
                throw new Error('Not authorized, user not found');
            }
            
            console.log('✅ User found:', {
                id: user._id,
                email: user.email,
                role: user.role
            });
            
            req.user = user;
            next();
            
        } catch (error) {
            console.log('❌ Token verification failed');
            console.log('Error name:', error.name);
            console.log('Error message:', error.message);
            
            // Specific JWT error handling
            if (error.name === 'JsonWebTokenError') {
                console.log('❌ Invalid token format or signature');
            } else if (error.name === 'TokenExpiredError') {
                console.log('❌ Token has expired');
                console.log('Expired at:', error.expiredAt);
            } else if (error.name === 'NotBeforeError') {
                console.log('❌ Token not active yet');
            }
            
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        console.log('❌ No token found in request');
        console.log('Checked locations: cookies.token, Authorization header');
        
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

exports.authorize = (...roles) => {
    return (req, res, next) => {
        console.log('🔍 DEBUG: Authorization check');
        console.log('Required roles:', roles);
        console.log('User role:', req.user?.role);
        console.log('User exists:', !!req.user);
        
        if (!req.user) {
            console.log('❌ No user found in request');
            res.status(401);
            throw new Error('Not authorized, no user');
        }
        
        if (!roles.includes(req.user.role)) {
            console.log('❌ User role not authorized');
            res.status(403);
            throw new Error(`User role ${req.user.role} is not authorized`);
        }
        
        console.log('✅ User authorized');
        next();
    };
};
