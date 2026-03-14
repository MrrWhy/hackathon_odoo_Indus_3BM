// routes/reports.js — Warehouse Reports
const express = require('express');
const pool = require('../db/pool');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/reports — Warehouse sees own, Manager/Admin see all
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    let query, params = [];

    if (req.user.role === 'warehouse') {
      // Warehouse staff only see their own reports
      query = 'SELECT * FROM reports WHERE submitted_by = $1';
      params = [req.user.name];
      if (type) { query += ' AND type = $2'; params.push(type); }
    } else {
      // Manager/Admin see all
      query = 'SELECT * FROM reports';
      if (type) { query += ' WHERE type = $1'; params.push(type); }
    }
    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows.map(r => ({
      id:          r.report_ref,
      type:        r.type,
      title:       r.title,
      desc:        r.description,
      loc:         r.location,
      priority:    r.priority,
      submittedBy: r.submitted_by,
      role:        r.submitted_role,
      date:        r.created_at ? r.created_at.toISOString().split('T')[0] : '',
      status:      r.status,
    })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/reports — Warehouse submits, Manager/Admin can also submit
router.post('/', async (req, res) => {
  const { type, title, desc, loc, priority } = req.body;
  if (!title || !desc) return res.status(400).json({ error: 'Title and description required' });

  try {
    const count = await pool.query('SELECT COUNT(*) FROM reports');
    const ref = 'RPT-' + String(parseInt(count.rows[0].count) + 1).padStart(3, '0');

    const result = await pool.query(
      `INSERT INTO reports (report_ref, type, title, description, location, priority, submitted_by, submitted_role, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'Pending') RETURNING *`,
      [ref, type || 'General', title, desc, loc || 'Unspecified', priority || 'Medium', req.user.name, req.user.role]
    );
    const r = result.rows[0];
    res.status(201).json({
      id: r.report_ref, type: r.type, title: r.title,
      desc: r.description, loc: r.location, priority: r.priority,
      submittedBy: r.submitted_by, role: r.submitted_role,
      date: r.created_at.toISOString().split('T')[0], status: r.status
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH /api/reports/:ref/status — Manager/Admin update status
router.patch('/:ref/status', requireRole('admin','manager'), async (req, res) => {
  const { status } = req.body;
  if (!['Pending','Reviewed','Flagged'].includes(status))
    return res.status(400).json({ error: 'Invalid status' });
  try {
    const result = await pool.query(
      'UPDATE reports SET status=$1 WHERE report_ref=$2 RETURNING *',
      [status, req.params.ref]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Report not found' });
    res.json({ id: result.rows[0].report_ref, status: result.rows[0].status });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
