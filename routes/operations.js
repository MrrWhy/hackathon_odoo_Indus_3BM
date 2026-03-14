// routes/operations.js — Orders, Deliveries, Manufacture Orders
const express = require('express');
const pool = require('../db/pool');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// ══════════ ORDERS ══════════

// GET /api/operations/orders
router.get('/orders', async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = 'SELECT * FROM orders';
    let params = [];
    let conditions = [];

    if (search) {
      conditions.push(`(LOWER(product) LIKE $${params.length+1} OR LOWER(customer) LIKE $${params.length+1} OR LOWER(id) LIKE $${params.length+1})`);
      params.push(`%${search.toLowerCase()}%`);
    }
    if (status) {
      conditions.push(`status = $${params.length+1}`);
      params.push(status);
    }
    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY order_date DESC, id DESC';

    const result = await pool.query(query, params);
    res.json(result.rows.map(o => ({
      id: o.id, date: o.order_date, product: o.product,
      customer: o.customer, qty: o.qty, total: parseFloat(o.total), status: o.status
    })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/operations/orders (manager/admin)
router.post('/orders', requireRole('admin','manager'), async (req, res) => {
  const { product, customer, qty, status } = req.body;
  if (!customer || !qty) return res.status(400).json({ error: 'Customer and quantity required' });

  try {
    // Get product price
    const prod = await pool.query('SELECT price FROM products WHERE name = $1', [product]);
    const price = prod.rows.length > 0 ? parseFloat(prod.rows[0].price) : 0;
    const total = price * qty;

    // Generate order ID
    const count = await pool.query('SELECT COUNT(*) FROM orders');
    const id = 'ORD-' + (2044 + parseInt(count.rows[0].count));

    const result = await pool.query(
      'INSERT INTO orders (id, product, customer, qty, total, status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [id, product, customer, qty, total, status || 'Processing']
    );
    const o = result.rows[0];
    res.status(201).json({
      id: o.id, date: o.order_date, product: o.product,
      customer: o.customer, qty: o.qty, total: parseFloat(o.total), status: o.status
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH /api/operations/orders/:id (manager/admin)
router.patch('/orders/:id', requireRole('admin','manager'), async (req, res) => {
  const { status } = req.body;
  try {
    const result = await pool.query('UPDATE orders SET status=$1 WHERE id=$2 RETURNING *', [status, req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json({ id: result.rows[0].id, status: result.rows[0].status });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ══════════ DELIVERIES ══════════

// GET /api/operations/deliveries
router.get('/deliveries', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM deliveries ORDER BY created_at DESC');
    res.json(result.rows.map(d => ({
      id: d.id, from: d.from_supplier, product: d.product,
      qty: d.qty, eta: d.eta, status: d.status, progress: d.progress
    })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/operations/deliveries (manager/admin)
router.post('/deliveries', requireRole('admin','manager'), async (req, res) => {
  const { id, product, qty, eta, status, from_supplier } = req.body;
  if (!id || !product) return res.status(400).json({ error: 'ID and product required' });
  const progressMap = { Delivered: 100, 'In Transit': 60, Delayed: 30, Pending: 10 };
  try {
    const result = await pool.query(
      'INSERT INTO deliveries (id,from_supplier,product,qty,eta,status,progress) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [id, from_supplier || 'Unknown', product, qty || 0, eta || null, status || 'Pending', progressMap[status] || 10]
    );
    const d = result.rows[0];
    res.status(201).json({ id: d.id, from: d.from_supplier, product: d.product, qty: d.qty, eta: d.eta, status: d.status, progress: d.progress });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Delivery ID already exists' });
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/operations/deliveries/:id/status (manager/admin)
router.patch('/deliveries/:id/status', requireRole('admin','manager'), async (req, res) => {
  const { status } = req.body;
  const progressMap = { Delivered: 100, 'In Transit': 60, Delayed: 30, Pending: 10 };
  try {
    const result = await pool.query(
      'UPDATE deliveries SET status=$1, progress=$2 WHERE id=$3 RETURNING *',
      [status, progressMap[status] || 10, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Delivery not found' });
    res.json({ id: result.rows[0].id, status: result.rows[0].status, progress: result.rows[0].progress });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ══════════ MANUFACTURE ORDERS ══════════

// GET /api/operations/manufacture
router.get('/manufacture', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM manufacture_orders ORDER BY due_date');
    res.json(result.rows.map(m => ({
      mo: m.mo, product: m.product, qty: m.qty,
      due: m.due_date, status: m.status
    })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/operations/manufacture (manager/admin)
router.post('/manufacture', requireRole('admin','manager'), async (req, res) => {
  const { mo, product, qty, due, status } = req.body;
  if (!mo || !product) return res.status(400).json({ error: 'MO number and product required' });
  try {
    const result = await pool.query(
      'INSERT INTO manufacture_orders (mo,product,qty,due_date,status) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [mo, product, qty || 0, due || null, status || 'Scheduled']
    );
    const m = result.rows[0];
    res.status(201).json({ mo: m.mo, product: m.product, qty: m.qty, due: m.due_date, status: m.status });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'MO number already exists' });
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/operations/manufacture/:mo/status
router.patch('/manufacture/:mo/status', requireRole('admin','manager'), async (req, res) => {
  const { status } = req.body;
  try {
    const result = await pool.query('UPDATE manufacture_orders SET status=$1 WHERE mo=$2 RETURNING *', [status, req.params.mo]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'MO not found' });
    res.json({ mo: result.rows[0].mo, status: result.rows[0].status });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
