const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authmiddleware.js');

// Admin-only test route
router.get('/admin', verifyToken, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Access granted' });
});

// User + Admin test route
router.get('/user', verifyToken, authorizeRoles('user', 'admin'), (req, res) => {
  res.json({ message: 'User access granted' });
});

module.exports = router;
