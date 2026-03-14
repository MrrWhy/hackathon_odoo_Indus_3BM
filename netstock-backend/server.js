// server.js — NetStock Backend Entry Point
require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const swaggerUi    = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

// ── Middleware ──
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
app.use(express.json());

// ── Swagger Setup ──
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NetStock Warehouse Management API',
      version: '1.0.0',
      description: 'Backend API for NetStock — manage stock, orders, deliveries, users and reports.',
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 3002}/api` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth',          description: 'Login and token management' },
      { name: 'Users',         description: 'User management (Admin only for mutations)' },
      { name: 'Stock',         description: 'Stock levels per SKU' },
      { name: 'Products',      description: 'Product catalog' },
      { name: 'Suppliers',     description: 'Supplier list' },
      { name: 'Orders',        description: 'Customer orders' },
      { name: 'Deliveries',    description: 'Incoming deliveries' },
      { name: 'Manufacture',   description: 'Manufacture orders' },
      { name: 'Reports',       description: 'Warehouse staff reports' },
      { name: 'Notifications', description: 'System alerts and notifications' },
    ],
    paths: {
      // ── AUTH ──
      '/auth/login': {
        post: {
          tags: ['Auth'], summary: 'Login with email',
          description: 'Pass a registered user email. Returns a JWT token valid for 8 hours.',
          security: [],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', required: ['email'],
              properties: { email: { type: 'string', example: 'sanjay@coreinv.in' } } } } }
          },
          responses: {
            200: { description: 'Login successful — returns token and user object' },
            404: { description: 'Email not registered' },
            403: { description: 'Account inactive' },
          }
        }
      },
      '/auth/me': {
        get: {
          tags: ['Auth'], summary: 'Get current user from token',
          responses: { 200: { description: 'Current user info' }, 401: { description: 'No token' } }
        }
      },

      // ── USERS ──
      '/users': {
        get: {
          tags: ['Users'], summary: 'Get all users (Admin + Manager)',
          responses: { 200: { description: 'List of users' } }
        },
        post: {
          tags: ['Users'], summary: 'Add new user (Admin only)',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object',
              properties: {
                name:  { type: 'string', example: 'Ravi Shah' },
                email: { type: 'string', example: 'ravi@coreinv.in' },
                role:  { type: 'string', enum: ['admin','manager','warehouse'], example: 'warehouse' },
                dept:  { type: 'string', example: 'Warehouse C' }
              } } } }
          },
          responses: { 201: { description: 'User created' }, 409: { description: 'Email already exists' } }
        }
      },
      '/users/{id}/role': {
        patch: {
          tags: ['Users'], summary: 'Change user role (Admin only)',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object',
            properties: { role: { type: 'string', enum: ['admin','manager','warehouse'] } } } } } },
          responses: { 200: { description: 'Role updated' } }
        }
      },
      '/users/{id}/status': {
        patch: {
          tags: ['Users'], summary: 'Activate or deactivate user (Admin only)',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object',
            properties: { status: { type: 'string', enum: ['Active','Inactive'] } } } } } },
          responses: { 200: { description: 'Status updated' } }
        }
      },

      // ── STOCK ──
      '/inventory/stock': {
        get: {
          tags: ['Stock'], summary: 'Get all stock levels',
          parameters: [{ in: 'query', name: 'search', schema: { type: 'string' }, description: 'Search by name or SKU' }],
          responses: { 200: { description: 'List of stock items' } }
        },
        post: {
          tags: ['Stock'], summary: 'Add or update stock (Manager/Admin)',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object',
            properties: {
              sku:     { type: 'string', example: 'SKU-101' },
              qty:     { type: 'integer', example: 150 },
              reorder: { type: 'integer', example: 30 },
              loc:     { type: 'string', example: 'Rack A-1' }
            } } } } },
          responses: { 201: { description: 'Stock saved' } }
        }
      },
      '/inventory/stock/{sku}': {
        patch: {
          tags: ['Stock'], summary: 'Edit stock quantity (Manager/Admin)',
          parameters: [{ in: 'path', name: 'sku', required: true, schema: { type: 'string' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object',
            properties: { qty: { type: 'integer' }, reorder: { type: 'integer' }, loc: { type: 'string' } } } } } },
          responses: { 200: { description: 'Stock updated' } }
        }
      },

      // ── PRODUCTS ──
      '/inventory/products': {
        get:  { tags: ['Products'], summary: 'Get all products', responses: { 200: { description: 'Product list' } } },
        post: {
          tags: ['Products'], summary: 'Add new product (Manager/Admin)',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object',
            properties: {
              sku:      { type: 'string', example: 'SKU-111' },
              name:     { type: 'string', example: 'New Product' },
              cat:      { type: 'string', example: 'Electronics' },
              supplier: { type: 'string', example: 'Bharat Distributors' },
              price:    { type: 'number', example: 1500 },
              lead:     { type: 'integer', example: 7 }
            } } } } },
          responses: { 201: { description: 'Product created' } }
        }
      },
      '/inventory/products/{sku}': {
        put: {
          tags: ['Products'], summary: 'Update product (Manager/Admin)',
          parameters: [{ in: 'path', name: 'sku', required: true, schema: { type: 'string' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object',
            properties: { name: { type: 'string' }, cat: { type: 'string' }, price: { type: 'number' } } } } } },
          responses: { 200: { description: 'Product updated' } }
        }
      },

      // ── SUPPLIERS ──
      '/inventory/suppliers': {
        get:  { tags: ['Suppliers'], summary: 'Get all suppliers', responses: { 200: { description: 'Supplier list' } } },
        post: {
          tags: ['Suppliers'], summary: 'Add supplier (Manager/Admin)',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object',
            properties: {
              name:     { type: 'string', example: 'New Supplier Co.' },
              category: { type: 'string', example: 'Tools' },
              leadDays: { type: 'integer', example: 7 },
              rating:   { type: 'integer', example: 4 }
            } } } } },
          responses: { 201: { description: 'Supplier added' } }
        }
      },

      // ── ORDERS ──
      '/operations/orders': {
        get: {
          tags: ['Orders'], summary: 'Get all orders',
          parameters: [
            { in: 'query', name: 'search', schema: { type: 'string' } },
            { in: 'query', name: 'status', schema: { type: 'string', enum: ['Processing','Shipped','Delivered','Cancelled'] } }
          ],
          responses: { 200: { description: 'Order list' } }
        },
        post: {
          tags: ['Orders'], summary: 'Create order (Manager/Admin)',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object',
            properties: {
              product:  { type: 'string', example: 'Safety Gloves' },
              customer: { type: 'string', example: 'Ashoka Mfg' },
              qty:      { type: 'integer', example: 50 },
              status:   { type: 'string', example: 'Processing' }
            } } } } },
          responses: { 201: { description: 'Order created' } }
        }
      },
      '/operations/orders/{id}': {
        patch: {
          tags: ['Orders'], summary: 'Update order status',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object',
            properties: { status: { type: 'string', enum: ['Processing','Shipped','Delivered','Cancelled'] } } } } } },
          responses: { 200: { description: 'Order updated' } }
        }
      },

      // ── DELIVERIES ──
      '/operations/deliveries': {
        get:  { tags: ['Deliveries'], summary: 'Get all deliveries', responses: { 200: { description: 'Delivery list' } } },
        post: {
          tags: ['Deliveries'], summary: 'Add delivery (Manager/Admin)',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object',
            properties: {
              id:            { type: 'string', example: 'DEL-506' },
              product:       { type: 'string', example: 'Steel Rod 12mm' },
              from_supplier: { type: 'string', example: 'Indra Raw Materials' },
              qty:           { type: 'integer', example: 500 },
              eta:           { type: 'string', example: '2026-03-20' },
              status:        { type: 'string', example: 'Pending' }
            } } } } },
          responses: { 201: { description: 'Delivery created' } }
        }
      },
      '/operations/deliveries/{id}/status': {
        patch: {
          tags: ['Deliveries'], summary: 'Update delivery status',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object',
            properties: { status: { type: 'string', enum: ['Pending','In Transit','Delivered','Delayed'] } } } } } },
          responses: { 200: { description: 'Delivery updated' } }
        }
      },

      // ── MANUFACTURE ──
      '/operations/manufacture': {
        get:  { tags: ['Manufacture'], summary: 'Get all manufacture orders', responses: { 200: { description: 'MO list' } } },
        post: {
          tags: ['Manufacture'], summary: 'Create manufacture order (Manager/Admin)',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object',
            properties: {
              mo:      { type: 'string', example: 'MO-091' },
              product: { type: 'string', example: 'Drill Bit Set' },
              qty:     { type: 'integer', example: 200 },
              due:     { type: 'string', example: '2026-03-25' },
              status:  { type: 'string', example: 'Scheduled' }
            } } } } },
          responses: { 201: { description: 'MO created' } }
        }
      },
      '/operations/manufacture/{mo}/status': {
        patch: {
          tags: ['Manufacture'], summary: 'Update MO status',
          parameters: [{ in: 'path', name: 'mo', required: true, schema: { type: 'string' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object',
            properties: { status: { type: 'string', enum: ['Scheduled','In Progress','Completed'] } } } } } },
          responses: { 200: { description: 'MO updated' } }
        }
      },

      // ── REPORTS ──
      '/reports': {
        get: {
          tags: ['Reports'], summary: 'Get reports (Warehouse sees own, Manager/Admin see all)',
          parameters: [{ in: 'query', name: 'type', schema: { type: 'string',
            enum: ['Stock Issue','Damage Report','Low Stock Alert','Safety Concern','General'] } }],
          responses: { 200: { description: 'Report list' } }
        },
        post: {
          tags: ['Reports'], summary: 'Submit a warehouse report',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object',
            properties: {
              type:     { type: 'string', example: 'Stock Issue' },
              title:    { type: 'string', example: 'Missing units in Rack B-3' },
              desc:     { type: 'string', example: 'Counted 40 but system shows 65.' },
              loc:      { type: 'string', example: 'Rack B-3' },
              priority: { type: 'string', enum: ['Low','Medium','High','Critical'], example: 'High' }
            } } } } },
          responses: { 201: { description: 'Report submitted' } }
        }
      },
      '/reports/{ref}/status': {
        patch: {
          tags: ['Reports'], summary: 'Update report status (Manager/Admin)',
          parameters: [{ in: 'path', name: 'ref', required: true, schema: { type: 'string' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object',
            properties: { status: { type: 'string', enum: ['Pending','Reviewed','Flagged'] } } } } } },
          responses: { 200: { description: 'Status updated' } }
        }
      },

      // ── NOTIFICATIONS ──
      '/notifications': {
        get:    { tags: ['Notifications'], summary: 'Get all notifications (Manager/Admin)', responses: { 200: { description: 'Notification list' } } },
        delete: { tags: ['Notifications'], summary: 'Clear all notifications', responses: { 200: { description: 'Cleared' } } }
      },
      '/notifications/read-all': {
        patch: { tags: ['Notifications'], summary: 'Mark all notifications as read', responses: { 200: { description: 'All marked read' } } }
      },
      '/notifications/{id}/read': {
        patch: {
          tags: ['Notifications'], summary: 'Mark one notification as read',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Marked read' } }
        }
      },
    }
  },
  apis: [],
});

// ── Swagger UI at root ──
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'NetStock API Docs',
  customCss: `
    .topbar { background: #1A1208 !important; }
    .topbar-wrapper img { content: url(''); }
    .topbar-wrapper::after { content: '🚁 NetStock API'; color: #F0D5C4; font-size: 18px; font-weight: 700; margin-left: 12px; }
    .swagger-ui .info .title { color: #C4622D; }
    .swagger-ui .scheme-container { background: #FAF6EF; }
  `,
}));

// ── Routes ──
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/users',         require('./routes/users'));
app.use('/api/inventory',     require('./routes/inventory'));
app.use('/api/operations',    require('./routes/operations'));
app.use('/api/reports',       require('./routes/reports'));
app.use('/api/notifications', require('./routes/notifications'));

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
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 NetStock Backend running on http://localhost:' + PORT);
  console.log('📋 Swagger UI at        http://localhost:' + PORT + '/');
  console.log('');
});
