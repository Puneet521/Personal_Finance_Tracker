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

// Routes
const authRoutes = require('./routes/authroute.js');
app.use('/api/auth', authRoutes);

// Test route for auth 
const authtestRoutes = require('./routes/authtestroute.js');
app.use('/api/test', authtestRoutes);

// Test route for backend 
app.get('/', (req, res) => res.send('Backend running!'));



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
