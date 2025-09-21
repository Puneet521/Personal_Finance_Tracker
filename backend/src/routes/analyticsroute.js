
/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Financial analytics & reports
 */

/**
 * @swagger
 * /analytics/monthly:
 *   get:
 *     summary: Get monthly income vs expense overview
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Monthly overview
 */

/**
 * @swagger
 * /analytics/categories:
 *   get:
 *     summary: Get category-wise expense breakdown
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Category breakdown
 */

/**
 * @swagger
 * /analytics/trends:
 *   get:
 *     summary: Get income vs expense trends
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Trends data
 */


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

