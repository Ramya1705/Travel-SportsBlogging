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
const asyncHandler = require('./asyncHandler'); // Assuming this is your asyncHandler utility

exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    // 1. Check if the token is sent in the Authorization header (preferred for stateless JWTs)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token from the "Bearer <token>" string
            token = req.headers.authorization.split(' ')[1];
        } catch (error) {
            // This catch block handles issues with token extraction from header
            console.error('Error extracting token from Authorization header:', error);
            res.status(401);
            throw new Error('Not authorized, token extraction failed');
        }
    } 
    // 2. Fallback: If not in header, check if the token is in cookies (for traditional session/cookie-based auth)
    // You might want to remove this 'else if' block entirely if you are fully moving to token-based auth
    else if (req.cookies.token) {
        token = req.cookies.token;
    }

    // If a token was found (either in header or cookies), attempt to verify it
    if (token) {
        try {
            // Verify the token using your JWT_SECRET
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user based on the decoded ID and attach to the request
            req.user = await User.findById(decoded.id).select('-password');
            
            // Proceed to the next middleware or route handler
            next();
        } catch (error) {
            // Handle cases where the token is invalid or expired
            console.error('JWT Verification Failed:', error.message);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        // If no token was found at all
        res.status(401);
        throw new Error('Not authorized, no token provided');
    }
});

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) { // Add req.user check for safety
            res.status(403);
            throw new Error(`User role ${req.user ? req.user.role : 'unknown'} is not authorized to access this route`);
        }
        next();
    };
};
