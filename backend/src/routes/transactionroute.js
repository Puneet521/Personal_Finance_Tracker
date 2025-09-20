const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authmiddleware');
const { createTransaction, getAllTransactions, getUserTransactions, updateTransaction, deleteTransaction } = 
require('../controllers/transactioncontroller');

// Admin & User can create transaction
router.post('/', verifyToken, authorizeRoles('admin', 'user'), createTransaction);

// Admin can get all transactions
router.get('/', verifyToken, authorizeRoles('admin'), getAllTransactions);

// Admin & User can get their own transactions
router.get('/my', verifyToken, authorizeRoles('admin', 'user'), getUserTransactions);

// Update transaction: Admin any, User own
router.put('/:id', verifyToken, authorizeRoles('admin', 'user'), updateTransaction);

// Delete transaction: Admin any, User own
router.delete('/:id', verifyToken, authorizeRoles('admin', 'user'), deleteTransaction);

module.exports = router;


