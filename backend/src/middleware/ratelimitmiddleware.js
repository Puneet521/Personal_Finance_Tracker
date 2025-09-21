const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs, maxRequests) => {
  return rateLimit({
    windowMs, // time window in milliseconds
    max: maxRequests, // max requests allowed
    message: { message: 'Too many requests, please try again later.' },
  });
};

module.exports = { createRateLimiter };
