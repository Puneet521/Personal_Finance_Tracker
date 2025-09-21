const pool = require('../db/postgres');

// Search, filter, sort & paginate transactions
async function searchTransactions(req, res) {
  const user = req.user;
  const { q, page = 1, limit = 10, sort = 'created_at', order = 'desc' } = req.query;

  const offset = (page - 1) * limit;
  let baseQuery = 'SELECT * FROM transactions';
  let countQuery = 'SELECT COUNT(*) FROM transactions';
  let values = [];
  let conditions = [];

  try {
    // Role check → admin can see all, others only their own
    if (user.role !== 'admin') {
      conditions.push(`user_id = $${values.length + 1}`);
      values.push(user.id);
    }

    // Search (type, amount, category_id)
    if (q) {
      conditions.push(`(
        type ILIKE $${values.length + 1} OR 
        CAST(category_id AS TEXT) ILIKE $${values.length + 1} OR
        CAST(amount AS TEXT) ILIKE $${values.length + 1}
      )`);
      values.push(`%${q}%`);
    }

    // Apply WHERE clause if conditions exist
    if (conditions.length) {
      baseQuery += ` WHERE ${conditions.join(' AND ')}`;
      countQuery += ` WHERE ${conditions.join(' AND ')}`;
    }

    // Sorting (allow only safe columns)
    const validSortFields = ['created_at', 'amount', 'type', 'category_id'];
    const safeSort = validSortFields.includes(sort) ? sort : 'created_at';
    const safeOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    baseQuery += ` ORDER BY ${safeSort} ${safeOrder} LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);

    // Run queries
    const result = await pool.query(baseQuery, values);
    const countResult = await pool.query(countQuery, values.slice(0, values.length - 2));
    const total = parseInt(countResult.rows[0].count, 10);

    res.json({
      transactions: result.rows,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      },
      sort: { field: safeSort, order: safeOrder }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { searchTransactions };
