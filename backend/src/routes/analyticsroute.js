const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authmiddleware');
const { getMonthlyOverview, getCategoryBreakdown, getIncomeExpenseTrends } = require('../controllers/analyticscontroller');

// Admin: can view analytics for all users 
// User & Read-only: can view only their own analytics

router.get('/monthly', verifyToken, authorizeRoles('admin', 'user', 'read-only'), getMonthlyOverview);
router.get('/categories', verifyToken, authorizeRoles('admin', 'user', 'read-only'), getCategoryBreakdown);
router.get('/trends', verifyToken, authorizeRoles('admin', 'user', 'read-only'), getIncomeExpenseTrends);

module.exports = router;
