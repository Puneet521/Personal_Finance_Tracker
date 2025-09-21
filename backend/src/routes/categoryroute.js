const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authmiddleware');
const { getCategories, createCategory } = require('../controllers/categorycontroller');

// Anyone logged in can view categories
router.get('/', verifyToken, getCategories);

// Admin can add categories
router.post('/', verifyToken, authorizeRoles('admin'), createCategory);

module.exports = router;
