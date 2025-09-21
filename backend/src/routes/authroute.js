/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication & User login
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user & return JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authenticated successfully
 */


const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authcontroller.js');

// Rate limiter already applied in index.js
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
