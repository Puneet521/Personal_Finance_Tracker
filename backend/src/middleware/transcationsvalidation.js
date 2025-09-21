const { body, validationResult } = require('express-validator');

const transactionRules = [
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be either income or expense'),
  body('category_id').isInt({ gt: 0 }).withMessage('Category ID must be a positive integer'),
  body('description').optional().isLength({ max: 255 }).withMessage('Description must not exceed 255 characters'),
];

function validateTransaction(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}

module.exports = { transactionRules, validateTransaction };

