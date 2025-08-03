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

// // --- START: CORRECTED CORS CONFIGURATION ---

// // Define the list of allowed websites
// const allowedOrigins = [
//   'https://travel-sports-blogging.onrender.com'
// ];

// // Set up CORS options
// const corsOptions = {
//   origin: (origin, callback) => {
//     // Allow requests from the allowed origins, and also allow requests
//     // that don't have an origin (like Postman or mobile apps)
//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true
// };

// // Use the new CORS options
// app.use(cors(corsOptions));

// // --- END: CORRECTED CORS CONFIGURATION ---


// // Middleware
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
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');

// Load environment variables from .env file
dotenv.config();

const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Passport config
require('./config/passport');

const app = express();

// Connect to MongoDB
connectDB();

// --- CORS CONFIGURATION ---
const allowedOrigins = [
  'https://travel-sportsblogging.onrender.com'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
// --- END CORS CONFIGURATION ---

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

// Error Handler middleware
app.use(errorHandler);

// Get the port from environment variables, or default to 5000 for local development
const PORT = process.env.PORT || 5000;

// Start the server by listening on the specified port
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
