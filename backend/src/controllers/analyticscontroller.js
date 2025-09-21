const pool = require('../db/postgres');
const { getCache, setCache } = require('../middleware/cachemiddleware.js');

// Cache TTL
const MONTHLY_TTL = 900; // 15 minutes
const CATEGORY_TTL = 3600; // 1 hour
const TRENDS_TTL = 900; // 15 minutes

// Monthly overview
async function getMonthlyOverview(req, res) {
  const user = req.user;
  const cacheKey = `monthly_${user.role}_${user.id || 'all'}`;

  try {
    const cached = await getCache(cacheKey);
    if (cached) return res.json({ monthlyOverview: cached });

    const result = await pool.query(
      `
      SELECT DATE_TRUNC('month', created_at) AS month,
             SUM(CASE WHEN type='income' THEN amount ELSE 0 END) AS total_income,
             SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) AS total_expense
      FROM transactions
      ${user.role === 'admin' ? '' : 'WHERE user_id=$1'}
      GROUP BY month
      ORDER BY month DESC
      `,
      user.role === 'admin' ? [] : [user.id]
    );

    await setCache(cacheKey, result.rows, MONTHLY_TTL);
    res.json({ monthlyOverview: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Category-wise breakdown
async function getCategoryBreakdown(req, res) {
  const user = req.user;
  const cacheKey = `category_${user.role}_${user.id || 'all'}`;

  try {
    const cached = await getCache(cacheKey);
    if (cached) return res.json({ categoryBreakdown: cached });

    const result = await pool.query(
      `
      SELECT c.name AS category, SUM(t.amount) AS total
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      ${user.role === 'admin' ? '' : 'WHERE t.user_id=$1'}
      GROUP BY c.name
      ORDER BY total DESC
      `,
      user.role === 'admin' ? [] : [user.id]
    );

    await setCache(cacheKey, result.rows, CATEGORY_TTL);
    res.json({ categoryBreakdown: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Income vs Expense trends
async function getIncomeExpenseTrends(req, res) {
  const user = req.user;
  const cacheKey = `trends_${user.role}_${user.id || 'all'}`;

  try {
    const cached = await getCache(cacheKey);
    if (cached) return res.json({ trends: cached });

    const result = await pool.query(
      `
      SELECT DATE_TRUNC('month', created_at) AS month,
             SUM(CASE WHEN type='income' THEN amount ELSE 0 END) AS income,
             SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) AS expense
      FROM transactions
      ${user.role === 'admin' ? '' : 'WHERE user_id=$1'}
      GROUP BY month
      ORDER BY month ASC
      `,
      user.role === 'admin' ? [] : [user.id]
    );

    await setCache(cacheKey, result.rows, TRENDS_TTL);
    res.json({ trends: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getMonthlyOverview, getCategoryBreakdown, getIncomeExpenseTrends };
