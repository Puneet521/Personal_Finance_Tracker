/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Manage categories (Admin only)
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     responses:
 *       201:
 *         description: Category created
 */

const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authmiddleware');
const { getCategories, createCategory } = require('../controllers/categorycontroller');

// Anyone logged in can view categories
router.get('/', verifyToken, getCategories);

// Admin can add categories
router.post('/', verifyToken, authorizeRoles('admin'), createCategory);

module.exports = router;


