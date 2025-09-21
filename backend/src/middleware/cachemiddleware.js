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

//  Clear analytics cache keys after transaction changes
async function clearAnalyticsCache() {
  try {
    const keys = await redisClient.keys('monthly_*');
    const catKeys = await redisClient.keys('category_*');
    const trendKeys = await redisClient.keys('trends_*');

    const allKeys = [...keys, ...catKeys, ...trendKeys];
    if (allKeys.length > 0) {
      await redisClient.del(allKeys);
      console.log('🗑️ Cleared analytics cache:', allKeys);
    }
  } catch (err) {
    console.error('Redis clear cache error:', err);
  }
}


module.exports = { getCache, setCache, clearAnalyticsCache};