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

// Import auth controller directly for verification route
const { verifyEmail } = require('./controllers/authController');

// Passport configuration
require('./config/passport');

const app = express();

// CORS Configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://travel-sports-blogging.onrender.com', 'https://travel-sportsblogging.onrender.com']
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

// 🎯 CRITICAL FIX: Direct verification route BEFORE other routes
app.get('/verify-email/:token', verifyEmail);

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Debug route to list all registered routes (remove in production)
app.get('/debug/routes', (req, res) => {
    const routes = [];
    
    function extractRoutes(stack, basePath = '') {
        stack.forEach((layer) => {
            if (layer.route) {
                // Direct route
                routes.push({
                    path: basePath + layer.route.path,
                    methods: Object.keys(layer.route.methods)
                });
            } else if (layer.name === 'router' && layer.handle.stack) {
                // Router with sub-routes
                const routerPath = layer.regexp.source
                    .replace('\\/?(?=\\/|$)', '')
                    .replace(/\\\//g, '/')
                    .replace(/\^|\$|\?\=/g, '');
                extractRoutes(layer.handle.stack, basePath + routerPath);
            }
        });
    }
    
    extractRoutes(app._router.stack);
    res.json({ 
        routes: routes.sort((a, b) => a.path.localeCompare(b.path)),
        totalRoutes: routes.length
    });
});

// Test route to verify server is working
app.get('/test', (req, res) => {
    res.json({
        message: 'Test route working!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// 404 Handler for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
        message: 'The requested resource does not exist',
        availableRoutes: [
            '/health',
            '/test',
            '/debug/routes',
            '/verify-email/:token',
            '/api/auth/*',
            '/api/users/*',
            '/api/posts/*',
            '/api/admin/*',
            '/api/upload/*'
        ]
    });
});

// Error Handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📍 Server URL: https://travel-sportsblogging.onrender.com`);
    console.log(`🔍 Debug routes: https://travel-sportsblogging.onrender.com/debug/routes`);
    console.log(`✅ Verification route: https://travel-sportsblogging.onrender.com/verify-email/:token`);
});
