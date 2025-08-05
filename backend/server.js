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

// Middleware
app.use(cors({
    origin: 'https://travel-sports-blogging.onrender.com',
    credentials: true
}));
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
server.js or app.js - Updated version

