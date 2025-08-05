// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const asyncHandler = require('./asyncHandler');

// exports.protect = asyncHandler(async (req, res, next) => {
//     let token;
//     if (req.cookies.token) {
//         try {
//             token = req.cookies.token;
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             req.user = await User.findById(decoded.id).select('-password');
//             next();
//         } catch (error) {
//             res.status(401);
//             throw new Error('Not authorized, token failed');
//         }
//     }
//     if (!token) {
//         res.status(401);
//         throw new Error('Not authorized, no token');
//     }
// });

// exports.authorize = (...roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.user.role)) {
//             res.status(403);
//             throw new Error(`User role ${req.user.role} is not authorized`);
//         }
//         next();
//     };
// };
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');

exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    // Log the entire Authorization header received by the backend
    console.log('Backend: Raw Authorization Header:', req.headers.authorization);

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            // Log the token string extracted from the header
            console.log('Backend: Extracted Token from Header:', token);
        } catch (error) {
            console.error('Backend: Error extracting token from Authorization header:', error);
            res.status(401);
            throw new Error('Not authorized, token extraction failed');
        }
    } else if (req.cookies.token) {
        token = req.cookies.token;
        // Log the token string found in cookies
        console.log('Backend: Token found in cookies:', token);
    }

    if (token) {
        try {
            // This is the line where jwt.verify is called.
            // Log the JWT_SECRET used for verification
            console.log('Backend: JWT_SECRET used for verification:', process.env.JWT_SECRET);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Backend: JWT Decoded Payload:', decoded);

            req.user = await User.findById(decoded.id).select('-password');
            
            if (!req.user) {
                res.status(401);
                throw new Error('Not authorized, user not found for this token ID');
            }

            next();
        } catch (error) {
            // This catch block will execute if jwt.verify fails (e.g., 'jwt malformed')
            console.error('Backend: JWT Verification Failed:', error.message);
            res.status(401);
            throw new Error(`Not authorized, token failed: ${error.message}`);
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token provided');
    }
});

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (req.user && roles.includes(req.user.role)) {
            next();
        } else {
            res.status(403);
            const userRole = req.user ? req.user.role : 'unknown';
            throw new Error(`User role ${userRole} is not authorized to access this route`);
        }
    };
};


