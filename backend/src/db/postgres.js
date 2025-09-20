// src/db/postgres.js
const { Pool } = require('pg');
require('dotenv').config();

// Create pool using DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Optional: test connection once at startup
pool.connect()
  .then(client => {
    console.log('✅ Postgres connected');
    client.release();
  })
  .catch(err => console.error('❌ Postgres connection error:', err.stack));

module.exports = pool;
