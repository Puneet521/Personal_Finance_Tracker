/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management (Admin only)
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */

/**
 * @swagger
 * /users/{id}/role:
 *   put:
 *     summary: Update user role
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User role updated
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted
 */



// backend/src/routes/userroute.js
const express = require('express');
const { verifyToken, authorizeRoles } = require('../middleware/authmiddleware');
const { getAllUsers, updateUserRole, deleteUser } = require('../controllers/usercontroller');

const router = express.Router();

// Admin only
router.get('/', verifyToken, authorizeRoles('admin'), getAllUsers);
router.put('/:id/role', verifyToken, authorizeRoles('admin'), updateUserRole);
router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteUser);

module.exports = router;
