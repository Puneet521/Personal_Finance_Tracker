const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authmiddleware');
const { searchTransactions } = require('../controllers/searchcontroller');

// Search + Pagination endpoint
router.get( '/transactions', verifyToken, authorizeRoles('admin', 'user', 'read-only'), searchTransactions );

module.exports = router;
