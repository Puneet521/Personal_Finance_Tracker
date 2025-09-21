const redisClient = require('../db/redis.js');

// Get cached data
async function getCache(key) {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Redis GET error:', err);
    return null;
  }
}

// Set cache with expiry (seconds)
async function setCache(key, value, ttl) {
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
  } catch (err) {
    console.error('Redis SET error:', err);
  }
}

module.exports = { getCache, setCache };
