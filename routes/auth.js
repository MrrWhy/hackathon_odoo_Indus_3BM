// routes/auth.js — Login endpoint
const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
// Body: { email }
// Returns a JWT token if the email is a registered active user
router.post('/login', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE LOWER(email) = LOWER($1)',
      [email.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Email not registered in NetStock. Contact your Admin.' });
    }

    const user = result.rows[0];

    if (user.status === 'Inactive') {
      return res.status(403).json({ error: 'Account is inactive. Contact your Admin.' });
    }

    // Update last_login timestamp
    await pool.query('UPDATE users SET last_login = CURRENT_DATE WHERE id = $1', [user.id]);

    // Sign JWT
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id:          user.id,
        name:        user.name,
        email:       user.email,
        role:        user.role,
        dept:        user.dept,
        status:      user.status,
        avatarColor: user.avatar_color,
        lastLogin:   user.last_login,
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// GET /api/auth/me — Get current user info from token
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const u = result.rows[0];
    res.json({
      id: u.id, name: u.name, email: u.email, role: u.role,
      dept: u.dept, status: u.status, avatarColor: u.avatar_color
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
