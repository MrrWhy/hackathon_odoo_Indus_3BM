// routes/inventory.js — Stock, Products, Suppliers
const express = require('express');
const pool = require('../db/pool');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// ══════════ SUPPLIERS ══════════

// GET /api/inventory/suppliers
router.get('/suppliers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM suppliers ORDER BY name');
    res.json(result.rows.map(s => ({
      id: s.id, name: s.name, category: s.category,
      leadDays: s.lead_days, rating: s.rating
    })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/inventory/suppliers (manager/admin)
router.post('/suppliers', requireRole('admin','manager'), async (req, res) => {
  const { name, category, leadDays, rating } = req.body;
  if (!name) return res.status(400).json({ error: 'Supplier name required' });
  try {
    const result = await pool.query(
      'INSERT INTO suppliers (name, category, lead_days, rating) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, category || 'General', leadDays || 7, rating || 3]
    );
    const s = result.rows[0];
    res.status(201).json({ id: s.id, name: s.name, category: s.category, leadDays: s.lead_days, rating: s.rating });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Supplier already exists' });
    res.status(500).json({ error: err.message });
  }
});

// ══════════ PRODUCTS ══════════

// GET /api/inventory/products
router.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY sku');
    res.json(result.rows.map(p => ({
      sku: p.sku, name: p.name, cat: p.category,
      supplier: p.supplier, price: parseFloat(p.price), lead: p.lead_days
    })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/inventory/products (manager/admin)
router.post('/products', requireRole('admin','manager'), async (req, res) => {
  const { sku, name, cat, supplier, price, lead } = req.body;
  if (!sku || !name) return res.status(400).json({ error: 'SKU and name required' });
  try {
    const result = await pool.query(
      'INSERT INTO products (sku,name,category,supplier,price,lead_days) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [sku, name, cat || 'General', supplier || null, price || 0, lead || 7]
    );
    const p = result.rows[0];
    res.status(201).json({ sku: p.sku, name: p.name, cat: p.category, supplier: p.supplier, price: parseFloat(p.price), lead: p.lead_days });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'SKU already exists' });
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/inventory/products/:sku (manager/admin)
router.put('/products/:sku', requireRole('admin','manager'), async (req, res) => {
  const { name, cat, supplier, price, lead } = req.body;
  try {
    const result = await pool.query(
      `UPDATE products SET name=$1,category=$2,supplier=$3,price=$4,lead_days=$5 WHERE sku=$6 RETURNING *`,
      [name, cat, supplier, price, lead, req.params.sku]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    const p = result.rows[0];
    res.json({ sku: p.sku, name: p.name, cat: p.category, supplier: p.supplier, price: parseFloat(p.price), lead: p.lead_days });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ══════════ STOCK ══════════

// GET /api/inventory/stock
router.get('/stock', async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM stock ORDER BY sku';
    let params = [];
    if (search) {
      query = 'SELECT * FROM stock WHERE LOWER(name) LIKE $1 OR LOWER(sku) LIKE $1 ORDER BY sku';
      params = [`%${search.toLowerCase()}%`];
    }
    const result = await pool.query(query, params);
    res.json(result.rows.map(s => ({
      sku: s.sku, name: s.name, cat: s.category,
      qty: s.qty, reorder: s.reorder_qty, loc: s.location
    })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/inventory/stock (manager/admin)
router.post('/stock', requireRole('admin','manager'), async (req, res) => {
  const { sku, qty, reorder, loc } = req.body;
  if (!sku) return res.status(400).json({ error: 'SKU required' });

  try {
    // Get product info
    const prod = await pool.query('SELECT * FROM products WHERE sku = $1', [sku]);
    if (prod.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    const p = prod.rows[0];

    const result = await pool.query(
      `INSERT INTO stock (sku,name,category,qty,reorder_qty,location)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (sku) DO UPDATE SET qty=$4, reorder_qty=$5, location=$6, updated_at=NOW()
       RETURNING *`,
      [sku, p.name, p.category, qty || 0, reorder || 50, loc || 'Unassigned']
    );
    const s = result.rows[0];
    res.status(201).json({ sku: s.sku, name: s.name, cat: s.category, qty: s.qty, reorder: s.reorder_qty, loc: s.location });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH /api/inventory/stock/:sku (manager/admin)
router.patch('/stock/:sku', requireRole('admin','manager'), async (req, res) => {
  const { qty, reorder, loc } = req.body;
  try {
    const result = await pool.query(
      'UPDATE stock SET qty=$1, reorder_qty=$2, location=$3, updated_at=NOW() WHERE sku=$4 RETURNING *',
      [qty, reorder, loc, req.params.sku]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Stock item not found' });
    const s = result.rows[0];
    res.json({ sku: s.sku, name: s.name, cat: s.category, qty: s.qty, reorder: s.reorder_qty, loc: s.location });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
