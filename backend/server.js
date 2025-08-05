// // const express = require('express');
// // const dotenv = require('dotenv');

// // // Load environment variables FIRST
// // dotenv.config();

// // const cors = require('cors');
// // const cookieParser = require('cookie-parser');
// // const passport = require('passport');
// // const connectDB = require('./config/db');
// // const { errorHandler } = require('./middleware/errorMiddleware');

// // // Route files
// // const authRoutes = require('./routes/authRoutes');
// // const userRoutes = require('./routes/userRoutes');
// // const postRoutes = require('./routes/postRoutes');
// // const adminRoutes = require('./routes/adminRoutes');
// // const uploadRoutes = require('./routes/uploadRoutes');

// // // Passport config (for Google OAuth)
// // require('./config/passport');

// // // Connect to Database
// // connectDB();

// // const app = express();

// // // Middleware
// // app.use(cors({
// //     origin: 'http://localhost:3000',
// //     credentials: true
// // }));
// // app.use(express.json());
// // app.use(cookieParser());
// // app.use(passport.initialize());

// // // Mount Routers
// // app.use('/api/auth', authRoutes);
// // app.use('/api/users', userRoutes);
// // app.use('/api/posts', postRoutes);
// // app.use('/api/admin', adminRoutes);
// // app.use('/api/upload', uploadRoutes);

// // // Apply the error handler AFTER the routes
// // app.use(errorHandler);

// // const PORT = process.env.PORT || 5000;

// // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// const express = require('express');
// const dotenv = require('dotenv');

// // Load env variables FIRST
// dotenv.config();

// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const passport = require('passport');
// const connectDB = require('./config/db');
// const { errorHandler } = require('./middleware/errorMiddleware');

// // Debug log to check if MONGO_URI loaded
// console.log("Attempting to connect to MongoDB...");

// // Connect to DB
// connectDB();

// // Routes
// const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');
// const postRoutes = require('./routes/postRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const uploadRoutes = require('./routes/uploadRoutes');

// // Passport config
// require('./config/passport');

// const app = express();

// // Middleware
// app.use(cors({
//     origin: 'https://travel-sports-blogging.onrender.com',
//     credentials: true
// }));
// app.use(express.json());
// app.use(cookieParser());
// app.use(passport.initialize());

// // Mount Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/posts', postRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/upload', uploadRoutes);

// // Error Handler (last middleware)
// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// server.js or app.js - Updated version
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Trust proxy (important for Render)
app.set('trust proxy', 1);

// CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL,
      'https://travel-sports-blogging.onrender.com', // Replace with your actual frontend URL
    ].filter(Boolean);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add request logging for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`, {
    origin: req.headers.origin,
    authorization: req.headers.authorization ? 'Present' : 'Missing',
    userAgent: req.headers['user-agent']
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Your routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation'
    });
  }
  
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Server configuration
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

// Handle HTTP/2 protocol issues
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;
