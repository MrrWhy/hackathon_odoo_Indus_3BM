// routes/users.js — User management (Admin only for mutations)
const express = require('express');
const pool = require('../db/pool');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/users — All users (admin + manager can view)
router.get('/', requireRole('admin', 'manager'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, dept, last_login, status, avatar_color FROM users ORDER BY id'
    );
    res.json(result.rows.map(u => ({
      id: u.id, name: u.name, email: u.email, role: u.role,
      dept: u.dept, lastLogin: u.last_login, status: u.status, avatarColor: u.avatar_color
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users — Add user (admin only)
router.post('/', requireRole('admin'), async (req, res) => {
  const { name, email, role, dept } = req.body;
  if (!name || !email || !role) return res.status(400).json({ error: 'Name, email, role required' });

  const colors = ['#C4622D','#6B7F5E','#D4920A','#8B3D18','#4E7A6B','#8B7A68'];
  const avatarColor = colors[Math.floor(Math.random() * colors.length)];

  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, role, dept, status, avatar_color)
       VALUES ($1, $2, $3, $4, 'Active', $5) RETURNING *`,
      [name, email, role, dept || 'General', avatarColor]
    );
    const u = result.rows[0];
    res.status(201).json({
      id: u.id, name: u.name, email: u.email, role: u.role,
      dept: u.dept, status: u.status, avatarColor: u.avatar_color
    });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Email already exists' });
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/users/:id/role — Change role (admin only)
router.patch('/:id/role', requireRole('admin'), async (req, res) => {
  const { role } = req.body;
  if (!['admin','manager','warehouse'].includes(role))
    return res.status(400).json({ error: 'Invalid role' });
  try {
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING *',
      [role, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ id: result.rows[0].id, role: result.rows[0].role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/users/:id/status — Activate/Deactivate (admin only)
router.patch('/:id/status', requireRole('admin'), async (req, res) => {
  const { status } = req.body;
  if (!['Active','Inactive'].includes(status))
    return res.status(400).json({ error: 'Status must be Active or Inactive' });
  try {
    const result = await pool.query(
      'UPDATE users SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ id: result.rows[0].id, status: result.rows[0].status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
