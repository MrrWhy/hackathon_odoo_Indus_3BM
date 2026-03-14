// routes/notifications.js — Notifications
const express = require('express');
const pool = require('../db/pool');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/notifications (manager/admin only)
router.get('/', requireRole('admin','manager'), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50');
    res.json(result.rows.map(n => ({
      id: n.id, type: n.type, icon: n.icon, ic: n.ic,
      title: n.title, desc: n.description, time: n.time_label, unread: n.is_unread
    })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', requireRole('admin','manager'), async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET is_unread=false WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH /api/notifications/read-all
router.patch('/read-all', requireRole('admin','manager'), async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET is_unread=false');
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/notifications — Clear all
router.delete('/', requireRole('admin','manager'), async (req, res) => {
  try {
    await pool.query('DELETE FROM notifications');
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
