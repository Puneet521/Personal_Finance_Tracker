require('dotenv').config(); // only once, top of index.js
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// import centralized clients
const pool = require('./db/postgres');
const redisClient = require('./db/redis');
const app = express();

app.use(cors());
app.use(express.json());

// Rate limiter
const authLimiter = rateLimit({ windowMs: 15*60*1000, max: 5 });
app.use('/api/auth', authLimiter);

// Auth Routes
const authRoutes = require('./routes/authroute.js');
app.use('/api/auth', authRoutes);

// Test route for auth 
const authtestRoutes = require('./routes/authtestroute.js');
app.use('/api/test', authtestRoutes);

// Transaction Route
const transactionRoutes = require('./routes/transactionroute.js');
app.use('/api/transactions', transactionRoutes);

// Search Route
const searchRoutes = require('./routes/searchroute.js');
app.use('/api/search', searchRoutes);

// Analytic Route
const analyticsRoutes = require('./routes/analyticsroute.js');
app.use('/api/analytics', analyticsRoutes);


// Test route for backend 
app.get('/', (req, res) => res.send('Backend running!'));



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
