// server.js — NetStock Backend Entry Point
require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const app = express();

// ── Middleware ──
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
app.use(express.json());

// ── Routes ──
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/users',         require('./routes/users'));
app.use('/api/inventory',     require('./routes/inventory'));
app.use('/api/operations',    require('./routes/operations'));
app.use('/api/reports',       require('./routes/reports'));
app.use('/api/notifications', require('./routes/notifications'));

// ── Health Check ──
app.get('/', (req, res) => {
  res.json({
    app:     'NetStock Backend API',
    version: '1.0.0',
    status:  'running',
    time:    new Date().toISOString(),
    endpoints: [
      'POST   /api/auth/login',
      'GET    /api/auth/me',
      'GET    /api/users',
      'POST   /api/users',
      'PATCH  /api/users/:id/role',
      'PATCH  /api/users/:id/status',
      'GET    /api/inventory/stock',
      'POST   /api/inventory/stock',
      'PATCH  /api/inventory/stock/:sku',
      'GET    /api/inventory/products',
      'POST   /api/inventory/products',
      'PUT    /api/inventory/products/:sku',
      'GET    /api/inventory/suppliers',
      'POST   /api/inventory/suppliers',
      'GET    /api/operations/orders',
      'POST   /api/operations/orders',
      'PATCH  /api/operations/orders/:id',
      'GET    /api/operations/deliveries',
      'POST   /api/operations/deliveries',
      'PATCH  /api/operations/deliveries/:id/status',
      'GET    /api/operations/manufacture',
      'POST   /api/operations/manufacture',
      'PATCH  /api/operations/manufacture/:mo/status',
      'GET    /api/reports',
      'POST   /api/reports',
      'PATCH  /api/reports/:ref/status',
      'GET    /api/notifications',
      'PATCH  /api/notifications/:id/read',
      'PATCH  /api/notifications/read-all',
      'DELETE /api/notifications',
    ]
  });
});

// ── 404 fallback ──
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ── Error handler ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start ──
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 NetStock Backend running on http://localhost:' + PORT);
  console.log('📋 API docs at          http://localhost:' + PORT + '/');
  console.log('');
});
