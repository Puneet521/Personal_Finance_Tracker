const pool = require('../db/postgres');

// Get all categories
async function getCategories(req, res) {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    res.json({ categories: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
}

// Admin-only: create category
async function createCategory(req, res) {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Category name required' });

  try {
    const result = await pool.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json({ category: result.rows[0] });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') { // unique violation
      return res.status(400).json({ message: 'Category already exists' });
    }
    res.status(500).json({ message: 'Failed to create category' });
  }
}

module.exports = { getCategories, createCategory };
