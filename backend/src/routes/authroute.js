const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authcontroller.js');

// Rate limiter already applied in index.js
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
