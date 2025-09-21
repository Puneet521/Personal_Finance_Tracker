const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authmiddleware');
const { createTransaction, getAllTransactions, getUserTransactions, updateTransaction, deleteTransaction } = 
require('../controllers/transactioncontroller');
const { transactionRules, validateTransaction } = require('../middleware/transcationsvalidation.js');

// Admin & User can create transaction
router.post('/', verifyToken, authorizeRoles('admin', 'user'), transactionRules, validateTransaction, createTransaction);

// Admin can get all transactions
router.get('/', verifyToken, authorizeRoles('admin'), getAllTransactions);

// Admin & User can get their own transactions
router.get('/my', verifyToken, authorizeRoles('admin', 'user'), getUserTransactions);

// Update transaction: Admin any, User own
router.put('/:id', verifyToken, authorizeRoles('admin', 'user'), transactionRules, validateTransaction, updateTransaction);

// Delete transaction: Admin any, User own
router.delete('/:id', verifyToken, authorizeRoles('admin', 'user'), deleteTransaction);

module.exports = router;






// Admin & User: create transaction
router.post(
  '/',
  verifyToken,
  authorizeRoles('admin', 'user'), // authorize first
  transactionRules,                // validation rules
  validateTransaction,             // validate request
  createTransaction
);

// Admin: get all transactions
router.get('/', verifyToken, authorizeRoles('admin'), getAllTransactions);

// Admin & User: get own transactions
router.get('/my', verifyToken, authorizeRoles('admin', 'user'), getUserTransactions);

// Admin/User: update transaction
router.put(
  '/:id',
  verifyToken,
  authorizeRoles('admin', 'user'),
  transactionRules,
  validateTransaction,
  updateTransaction
);

// Admin/User: delete transaction
router.delete('/:id', verifyToken, authorizeRoles('admin', 'user'), deleteTransaction);

module.exports = router;


