const express = require('express');
const dotenv = require('dotenv');

// Load env variables FIRST
dotenv.config();

const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Debug log to check if MONGO_URI loaded
console.log("Attempting to connect to MongoDB...");

// Connect to DB
connectDB();

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Passport config
require('./config/passport');

const app = express();

// --- START: CORRECTED CORS CONFIGURATION ---

// Define the list of allowed websites
const allowedOrigins = [
  'https://travel-sports-blogging.onrender.com'
];

// Set up CORS options
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests from the allowed origins, and also allow requests
    // that don't have an origin (like Postman or mobile apps)
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

// Use the new CORS options
app.use(cors(corsOptions));

// --- END: CORRECTED CORS CONFIGURATION ---


// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Error Handler (last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
