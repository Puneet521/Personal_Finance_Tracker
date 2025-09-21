const pool = require('../db/postgres');
const { clearAnalyticsCache } = require('../middleware/cachemiddleware'); 

// Create transaction (Admin & User)
async function createTransaction(req, res) {
  const { amount, type, category_id } = req.body;
  const user_id = req.user.id;

  if (!amount || !type || !category_id) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO transactions (user_id, amount, type, category_id) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, amount, type, category_id]
    );

    // ✅ Clear analytics cache so dashboard refreshes
    await clearAnalyticsCache();

    res.status(201).json({ transaction: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get all transactions (Admin)
async function getAllTransactions(req, res) {
  try {
    const result = await pool.query('SELECT * FROM transactions ORDER BY created_at DESC');
    res.json({ transactions: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get own transactions (User & Admin)
async function getUserTransactions(req, res) {
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      'SELECT * FROM transactions WHERE user_id=$1 ORDER BY created_at DESC',
      [user_id]
    );
    res.json({ transactions: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Update transaction (Admin any, User own)
async function updateTransaction(req, res) {
  const transaction_id = req.params.id;
  const { amount, type, category_id } = req.body;
  const user = req.user;

  try {
    // Fetch existing transaction
    const { rows } = await pool.query('SELECT * FROM transactions WHERE id=$1', [transaction_id]);
    if (!rows.length) return res.status(404).json({ message: 'Transaction not found' });

    const transaction = rows[0];

    // Role & ownership check
    if (user.role !== 'admin' && transaction.user_id !== user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const result = await pool.query(
      `UPDATE transactions 
       SET amount=$1, type=$2, category_id=$3 
       WHERE id=$4 RETURNING *`,
      [
        amount || transaction.amount,
        type || transaction.type,
        category_id || transaction.category_id,
        transaction_id,
      ]
    );

    // ✅ Clear analytics cache
    await clearAnalyticsCache();

    res.json({ transaction: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Delete transaction (Admin any, User own)
async function deleteTransaction(req, res) {
  const transaction_id = req.params.id;
  const user = req.user;

  try {
    const { rows } = await pool.query('SELECT * FROM transactions WHERE id=$1', [transaction_id]);
    if (!rows.length) return res.status(404).json({ message: 'Transaction not found' });

    const transaction = rows[0];

    if (user.role !== 'admin' && transaction.user_id !== user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await pool.query('DELETE FROM transactions WHERE id=$1', [transaction_id]);

    // ✅ Clear analytics cache
    await clearAnalyticsCache();

    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { createTransaction, getAllTransactions, getUserTransactions, updateTransaction, deleteTransaction };

