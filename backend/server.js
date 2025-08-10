// const express = require('express');
// const dotenv = require('dotenv');

// // Load environment variables FIRST
// dotenv.config();

// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const passport = require('passport');
// const connectDB = require('./config/db');
// const { errorHandler } = require('./middleware/errorMiddleware');

// // Route files
// const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');
// const postRoutes = require('./routes/postRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const uploadRoutes = require('./routes/uploadRoutes');

// // Passport config (for Google OAuth)
// require('./config/passport');

// // Connect to Database
// connectDB();

// const app = express();

// // Middleware
// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true
// }));
// app.use(express.json());
// app.use(cookieParser());
// app.use(passport.initialize());

// // Mount Routers
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/posts', postRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/upload', uploadRoutes);

// // Apply the error handler AFTER the routes
// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require('express');
const dotenv = require('dotenv');

// Load environment variables FIRST
dotenv.config();

const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Debug log to check environment
console.log("🔧 Environment:", process.env.NODE_ENV || 'development');
console.log("🔗 Attempting to connect to MongoDB...");

// Connect to Database
connectDB();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Passport configuration
require('./config/passport');

const app = express();

// CORS Configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? 'https://travel-sports-blogging.onrender.com' 
        : 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Travel Sports Blogging API',
        version: '1.0.0',
        status: 'Active'
    });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Direct verification route for email links (without /api prefix)
// This allows /verify-email/:token to work directly
app.use('/verify-email', authRoutes);

// Debug route to list all registered routes (remove in production)
if (process.env.NODE_ENV !== 'production') {
    app.get('/debug/routes', (req, res) => {
        const routes = [];
        app._router.stack.forEach((middleware) => {
            if (middleware.route) {
                routes.push({
                    path: middleware.route.path,
                    methods: Object.keys(middleware.route.methods)
                });
            } else if (middleware.name === 'router') {
                middleware.handle.stack.forEach((handler) => {
                    if (handler.route) {
                        routes.push({
                            path: middleware.regexp.source.replace('\\/?', '') + handler.route.path,
                            methods: Object.keys(handler.route.methods)
                        });
                    }
                });
            }
        });
        res.json({ routes });
    });
}

// 404 Handler for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
        message: 'The requested resource does not exist'
    });
});

// Error Handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    if (process.env.NODE_ENV !== 'production') {
        console.log(`📋 Debug routes at: http://localhost:${PORT}/debug/routes`);
    }
});
