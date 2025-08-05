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

/**
 * @desc Protects routes by verifying JWT from Authorization header or cookies.
 * Populates req.user with authenticated user data.
 */
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    // 1. Check if the token is sent in the Authorization header (standard for JWTs)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token string from "Bearer <token>"
            token = req.headers.authorization.split(' ')[1];
        } catch (error) {
            console.error('Backend: Error extracting token from Authorization header:', error);
            res.status(401);
            throw new Error('Not authorized, token extraction failed');
        }
    } 
    // 2. Fallback: If not in Authorization header, check if the token is in cookies
    // This is useful if you still have parts of your app relying on cookie-based auth,
    // or for the initial Google OAuth callback if it sets a cookie.
    else if (req.cookies.token) {
        token = req.cookies.token;
    }

    // If a token was successfully found (either in header or cookies)
    if (token) {
        try {
            // Verify the token using your JWT_SECRET from environment variables
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user in the database based on the ID from the decoded token
            req.user = await User.findById(decoded.id).select('-password'); // Exclude password from user object

            // IMPORTANT: Check if the user was actually found in the database
            // If the user ID from the token doesn't correspond to an existing user,
            // this is an invalid token scenario.
            if (!req.user) {
                res.status(401);
                throw new new Error('Not authorized, user not found for this token ID');
            }

            // If everything is successful, proceed to the next middleware or route handler
            next();
        } catch (error) {
            // Handle specific JWT verification errors (e.g., 'jwt expired', 'invalid signature', 'jwt malformed')
            console.error('Backend: JWT Verification Failed:', error.message);
            res.status(401);
            throw new Error(`Not authorized, token failed: ${error.message}`);
        }
    } else {
        // If no token was found at all in either header or cookies
        res.status(401);
        throw new Error('Not authorized, no token provided');
    }
});

/**
 * @desc Authorizes users based on their role. Must be used after 'protect' middleware.
 * @param {...string} roles - Roles allowed to access the route (e.g., 'admin', 'user')
 */
exports.authorize = (...roles) => {
    return (req, res, next) => {
        // Ensure req.user exists before attempting to access its role property.
        // This prevents "Cannot read properties of null (reading 'role')" errors.
        if (req.user && roles.includes(req.user.role)) {
            next(); // User is authorized, proceed
        } else {
            // If req.user is missing OR the user's role is not among the authorized roles
            res.status(403); // Forbidden
            const userRole = req.user ? req.user.role : 'unknown'; // Safely get role for error message
            throw new Error(`User role ${userRole} is not authorized to access this route`);
        }
    };
};



