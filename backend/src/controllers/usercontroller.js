// backend/src/controllers/usercontroller.js
const pool = require('../db/postgres');

// Get all users (Admin only)
async function getAllUsers(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, username, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ users: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Update user role (Admin only)
async function updateUserRole(req, res) {
  const { id } = req.params;
  const { role } = req.body;

  if (!['admin', 'user', 'read-only'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const result = await pool.query(
      'UPDATE users SET role=$1 WHERE id=$2 RETURNING id, username, role, created_at',
      [role, id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Delete user (Admin only)
async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM users WHERE id=$1 RETURNING id',
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getAllUsers, updateUserRole, deleteUser };

