// db/setup.js — Creates all tables and seeds initial data
// Run with: node db/setup.js

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'netstock',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

async function setup() {
  const client = await pool.connect();
  console.log('✅ Connected to PostgreSQL');

  try {
    await client.query('BEGIN');

    // ─── DROP EXISTING TABLES (clean slate) ───
    await client.query(`
      DROP TABLE IF EXISTS reports CASCADE;
      DROP TABLE IF EXISTS notifications CASCADE;
      DROP TABLE IF EXISTS manufacture_orders CASCADE;
      DROP TABLE IF EXISTS deliveries CASCADE;
      DROP TABLE IF EXISTS orders CASCADE;
      DROP TABLE IF EXISTS stock CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
      DROP TABLE IF EXISTS suppliers CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);
    console.log('🗑  Dropped old tables');

    // ─── USERS ───
    await client.query(`
      CREATE TABLE users (
        id           SERIAL PRIMARY KEY,
        name         VARCHAR(100) NOT NULL,
        email        VARCHAR(150) UNIQUE NOT NULL,
        role         VARCHAR(20)  NOT NULL CHECK (role IN ('admin','manager','warehouse')),
        dept         VARCHAR(100) DEFAULT 'General',
        last_login   DATE,
        status       VARCHAR(20)  DEFAULT 'Active' CHECK (status IN ('Active','Inactive')),
        avatar_color VARCHAR(20)  DEFAULT '#8B7A68',
        created_at   TIMESTAMP DEFAULT NOW()
      );
    `);

    // ─── SUPPLIERS ───
    await client.query(`
      CREATE TABLE suppliers (
        id         SERIAL PRIMARY KEY,
        name       VARCHAR(150) UNIQUE NOT NULL,
        category   VARCHAR(50),
        lead_days  INT DEFAULT 7,
        rating     INT DEFAULT 3 CHECK (rating BETWEEN 1 AND 5),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // ─── PRODUCTS ───
    await client.query(`
      CREATE TABLE products (
        sku        VARCHAR(20)  PRIMARY KEY,
        name       VARCHAR(150) NOT NULL,
        category   VARCHAR(50),
        supplier   VARCHAR(150) REFERENCES suppliers(name) ON UPDATE CASCADE,
        price      NUMERIC(12,2) DEFAULT 0,
        lead_days  INT DEFAULT 7,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // ─── STOCK ───
    await client.query(`
      CREATE TABLE stock (
        id          SERIAL PRIMARY KEY,
        sku         VARCHAR(20) REFERENCES products(sku) ON DELETE CASCADE,
        name        VARCHAR(150),
        category    VARCHAR(50),
        qty         INT DEFAULT 0,
        reorder_qty INT DEFAULT 50,
        location    VARCHAR(50),
        updated_at  TIMESTAMP DEFAULT NOW()
      );
    `);

    // ─── ORDERS ───
    await client.query(`
      CREATE TABLE orders (
        id          VARCHAR(20)  PRIMARY KEY,
        order_date  DATE DEFAULT CURRENT_DATE,
        product     VARCHAR(150),
        customer    VARCHAR(150),
        qty         INT DEFAULT 1,
        total       NUMERIC(12,2) DEFAULT 0,
        status      VARCHAR(30) DEFAULT 'Processing'
                    CHECK (status IN ('Processing','Shipped','Delivered','Cancelled')),
        created_at  TIMESTAMP DEFAULT NOW()
      );
    `);

    // ─── DELIVERIES ───
    await client.query(`
      CREATE TABLE deliveries (
        id          VARCHAR(20) PRIMARY KEY,
        from_supplier VARCHAR(150),
        product     VARCHAR(150),
        qty         INT DEFAULT 0,
        eta         DATE,
        status      VARCHAR(30) DEFAULT 'Pending'
                    CHECK (status IN ('Pending','In Transit','Delivered','Delayed')),
        progress    INT DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
        created_at  TIMESTAMP DEFAULT NOW()
      );
    `);

    // ─── MANUFACTURE ORDERS ───
    await client.query(`
      CREATE TABLE manufacture_orders (
        mo          VARCHAR(20) PRIMARY KEY,
        product     VARCHAR(150),
        qty         INT DEFAULT 0,
        due_date    DATE,
        status      VARCHAR(30) DEFAULT 'Scheduled'
                    CHECK (status IN ('Scheduled','In Progress','Completed')),
        created_at  TIMESTAMP DEFAULT NOW()
      );
    `);

    // ─── REPORTS ───
    await client.query(`
      CREATE TABLE reports (
        id            SERIAL PRIMARY KEY,
        report_ref    VARCHAR(20) UNIQUE,
        type          VARCHAR(50),
        title         VARCHAR(200),
        description   TEXT,
        location      VARCHAR(100),
        priority      VARCHAR(20) DEFAULT 'Medium'
                      CHECK (priority IN ('Low','Medium','High','Critical')),
        submitted_by  VARCHAR(100),
        submitted_role VARCHAR(20),
        status        VARCHAR(20) DEFAULT 'Pending'
                      CHECK (status IN ('Pending','Reviewed','Flagged')),
        created_at    TIMESTAMP DEFAULT NOW()
      );
    `);

    // ─── NOTIFICATIONS ───
    await client.query(`
      CREATE TABLE notifications (
        id         SERIAL PRIMARY KEY,
        type       VARCHAR(20) DEFAULT 'info',
        icon       VARCHAR(10),
        ic         VARCHAR(20),
        title      VARCHAR(200),
        description TEXT,
        time_label  VARCHAR(50),
        is_unread   BOOLEAN DEFAULT TRUE,
        created_at  TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✅ All tables created');

    // ══════════════════════════════════════════
    //  SEED DATA
    // ══════════════════════════════════════════

    // Users
    await client.query(`
      INSERT INTO users (name, email, role, dept, last_login, status, avatar_color) VALUES
      ('Sanjay Admin',  'sanjay@coreinv.in',  'admin',     'IT Admin',    '2026-03-14', 'Active',   '#D4920A'),
      ('Meera Kumar',   'meera@coreinv.in',   'manager',   'Operations',  '2026-03-14', 'Active',   '#C4622D'),
      ('Rohit Desai',   'rohit@coreinv.in',   'manager',   'Procurement', '2026-03-12', 'Active',   '#8B3D18'),
      ('Arjun Patel',   'arjun@coreinv.in',   'warehouse', 'Warehouse A', '2026-03-14', 'Active',   '#6B7F5E'),
      ('Priya Sharma',  'priya@coreinv.in',   'warehouse', 'Warehouse B', '2026-03-13', 'Active',   '#4E7A6B'),
      ('Kavya Nair',    'kavya@coreinv.in',   'warehouse', 'Dispatch',    '2026-03-10', 'Inactive', '#8B7A68');
    `);

    // Suppliers
    await client.query(`
      INSERT INTO suppliers (name, category, lead_days, rating) VALUES
      ('Bharat Distributors', 'Electronics',  5,  5),
      ('Modi Textiles Ltd',   'Apparel',       8,  4),
      ('GreenFarms Co-op',    'Food',          2,  5),
      ('Shree Tools & Parts', 'Tools',         10, 3),
      ('Rani Furniture Works','Furniture',     14, 4),
      ('Indra Raw Materials', 'Raw Materials', 7,  4);
    `);

    // Products
    await client.query(`
      INSERT INTO products (sku, name, category, supplier, price, lead_days) VALUES
      ('SKU-101', 'Industrial Fan 36"',   'Electronics',  'Bharat Distributors', 3400,  5),
      ('SKU-102', 'Cotton Work Uniform',  'Apparel',       'Modi Textiles Ltd',   850,   8),
      ('SKU-103', 'Basmati Rice 50kg',    'Food',          'GreenFarms Co-op',    2800,  2),
      ('SKU-104', 'Torque Wrench Set',    'Tools',         'Shree Tools & Parts', 1250, 10),
      ('SKU-105', 'Office Chair Ergo',    'Furniture',     'Rani Furniture Works',7200, 14),
      ('SKU-106', 'Steel Rod 12mm',       'Raw Materials', 'Indra Raw Materials', 320,   7),
      ('SKU-107', 'LED Floodlight 100W',  'Electronics',  'Bharat Distributors', 1890,  5),
      ('SKU-108', 'Safety Gloves',        'Apparel',       'Modi Textiles Ltd',   180,   8),
      ('SKU-109', 'Wheat Flour 25kg',     'Food',          'GreenFarms Co-op',    1400,  2),
      ('SKU-110', 'Drill Bit Set',        'Tools',         'Shree Tools & Parts', 680,  10);
    `);

    // Stock
    await client.query(`
      INSERT INTO stock (sku, name, category, qty, reorder_qty, location) VALUES
      ('SKU-101', 'Industrial Fan 36"',  'Electronics',  142,  30,  'Rack A-1'),
      ('SKU-102', 'Cotton Work Uniform', 'Apparel',      380,  100, 'Rack B-3'),
      ('SKU-103', 'Basmati Rice 50kg',   'Food',         22,   50,  'Cold-01'),
      ('SKU-104', 'Torque Wrench Set',   'Tools',        58,   20,  'Rack C-2'),
      ('SKU-105', 'Office Chair Ergo',   'Furniture',    0,    10,  'Zone D'),
      ('SKU-106', 'Steel Rod 12mm',      'Raw Materials',1840, 500, 'Yard E'),
      ('SKU-107', 'LED Floodlight 100W', 'Electronics',  14,   25,  'Rack A-4'),
      ('SKU-108', 'Safety Gloves',       'Apparel',      720,  200, 'Rack B-1'),
      ('SKU-109', 'Wheat Flour 25kg',    'Food',         95,   40,  'Cold-02'),
      ('SKU-110', 'Drill Bit Set',       'Tools',        8,    15,  'Rack C-5');
    `);

    // Orders
    await client.query(`
      INSERT INTO orders (id, order_date, product, customer, qty, total, status) VALUES
      ('ORD-2043', '2026-03-14', 'Industrial Fan 36"',  'Narmada Tech',     10,  34000,  'Processing'),
      ('ORD-2042', '2026-03-14', 'Safety Gloves',        'Ashoka Mfg',      200, 36000,  'Shipped'),
      ('ORD-2041', '2026-03-13', 'Basmati Rice 50kg',    'Royal Hotel Chain', 30, 84000, 'Delivered'),
      ('ORD-2040', '2026-03-13', 'Torque Wrench Set',    'Pawan Autos',       15, 18750, 'Delivered'),
      ('ORD-2039', '2026-03-12', 'Office Chair Ergo',    'InfoSoft Pvt Ltd',  20, 144000,'Cancelled'),
      ('ORD-2038', '2026-03-12', 'LED Floodlight 100W',  'Builder Co.',       50, 94500, 'Delivered'),
      ('ORD-2037', '2026-03-11', 'Steel Rod 12mm',       'Raj Steel Works',  400, 128000,'Delivered'),
      ('ORD-2036', '2026-03-11', 'Cotton Work Uniform',  'City Factory',      80, 68000, 'Delivered');
    `);

    // Deliveries
    await client.query(`
      INSERT INTO deliveries (id, from_supplier, product, qty, eta, status, progress) VALUES
      ('DEL-501', 'Bharat Distributors', 'LED Floodlight 100W',  100, '2026-03-14', 'In Transit', 80),
      ('DEL-502', 'GreenFarms Co-op',    'Basmati Rice 50kg',    200, '2026-03-15', 'In Transit', 55),
      ('DEL-503', 'Modi Textiles Ltd',   'Cotton Work Uniform',  500, '2026-03-16', 'Pending',    15),
      ('DEL-504', 'Shree Tools & Parts', 'Torque Wrench Set',     50, '2026-03-14', 'Delayed',    40),
      ('DEL-505', 'Indra Raw Materials', 'Steel Rod 12mm',       2000,'2026-03-17', 'In Transit', 65);
    `);

    // Manufacture Orders
    await client.query(`
      INSERT INTO manufacture_orders (mo, product, qty, due_date, status) VALUES
      ('MO-088', 'Steel Rod 12mm',       500,  '2026-03-18', 'In Progress'),
      ('MO-089', 'Industrial Fan 36"',    50,  '2026-03-20', 'In Progress'),
      ('MO-090', 'Safety Gloves',        1000, '2026-03-22', 'Scheduled'),
      ('MO-087', 'Drill Bit Set',         100, '2026-03-14', 'Completed');
    `);

    // Reports
    await client.query(`
      INSERT INTO reports (report_ref, type, title, description, location, priority, submitted_by, submitted_role, status) VALUES
      ('RPT-001', 'Stock Issue',      'Missing units in Rack B-3',          'Counted 40 units but system shows 65.',    'Rack B-3',    'High',     'Arjun Patel',  'warehouse', 'Pending'),
      ('RPT-002', 'Damage Report',    '3 boxes of Cotton Uniforms damaged', 'Water damage in Zone C due to roof leak.', 'Zone C',      'Medium',   'Priya Sharma', 'warehouse', 'Reviewed'),
      ('RPT-003', 'Low Stock Alert',  'Torque Wrench Set nearly depleted',  'Only 8 units left, reorder level is 30.',  'Rack A-5',    'Critical', 'Arjun Patel',  'warehouse', 'Flagged'),
      ('RPT-004', 'Safety Concern',   'Forklift path blocked in Aisle 4',  'Large pallet in main forklift route.',     'Aisle 4',     'High',     'Kavya Nair',   'warehouse', 'Reviewed'),
      ('RPT-005', 'General',          'Shift handover notes - March 14',   'Evening shift completed all pending.',     'Dispatch Zone','Low',     'Priya Sharma', 'warehouse', 'Pending');
    `);

    // Notifications
    await client.query(`
      INSERT INTO notifications (type, icon, ic, title, description, time_label, is_unread) VALUES
      ('alert', '⚠', 'ni-r',    'Out of Stock: Office Chair Ergo',    'SKU-105 at 0 units.',                        'Just now', true),
      ('alert', '⚠', 'ni-a',    'Low Stock: Basmati Rice 50kg',       'SKU-103 at 22 — reorder level 50.',          '5 min',    true),
      ('alert', '⚠', 'ni-a',    'Low Stock: LED Floodlight 100W',     'SKU-107 at 14 — reorder level 25.',          '12 min',   true),
      ('alert', '🚚','ni-r',    'DEL-504 Delayed',                    'Torque Wrench Set shipment delayed.',        '1 hr',     true),
      ('info',  '✓', 'ni-g',    'ORD-2041 Delivered',                 'Basmati Rice — Royal Hotel Chain.',          '2 hr',     false),
      ('info',  '📦','ni-rust', 'New Order: ORD-2043',                'Industrial Fan × 10 by Narmada Tech.',       '3 hr',     false);
    `);

    await client.query('COMMIT');
    console.log('✅ All seed data inserted');
    console.log('');
    console.log('🎉 Database setup complete! Run: npm start');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Setup failed:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

setup().catch(console.error);
