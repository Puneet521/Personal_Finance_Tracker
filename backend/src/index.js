require('dotenv').config(); // only once, top of index.js
const express = require('express');
const cors = require('cors');
const app = express();

// Security middleware
const helmet = require('helmet');
app.use(helmet());

// CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Rate limiter
const { createRateLimiter } = require('./middleware/ratelimitmiddleware.js');
const authLimiter = createRateLimiter(15 * 60 * 1000, 5);          // 5 requests / 15 min
const transactionLimiter = createRateLimiter(60 * 60 * 1000, 100); // 100 requests / hour
const searchLimiter = createRateLimiter(60 * 60 * 1000, 100);      // 100 requests / hour
const analyticsLimiter = createRateLimiter(60 * 60 * 1000, 50);    // 50 requests / hour

// Auth Routes
const authRoutes = require('./routes/authroute.js');
app.use('/api/auth', authLimiter, authRoutes);

// Test route for auth 
const authtestRoutes = require('./routes/authtestroute.js');
app.use('/api/test', authtestRoutes);

// Transaction Route
const transactionRoutes = require('./routes/transactionroute.js');
app.use('/api/transactions', transactionLimiter, transactionRoutes);

// Search Route
const searchRoutes = require('./routes/searchroute.js');
app.use('/api/search', searchLimiter, searchRoutes);

// Analytic Route
const analyticsRoutes = require('./routes/analyticsroute.js');
app.use('/api/analytics', analyticsLimiter, analyticsRoutes);

// Category Route
const categoryRoutes = require('./routes/categoryroute.js');
app.use('/api/categories', categoryRoutes);

// Test route for backend 
app.get('/', (req, res) => res.send('Backend running!'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
