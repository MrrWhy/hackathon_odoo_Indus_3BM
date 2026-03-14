# NetStock Backend — Setup Guide

## What's in this folder

```
netstock-backend/
├── server.js              ← Main server (entry point)
├── package.json           ← Dependencies
├── .env.example           ← Copy this to .env and fill in your DB details
├── .gitignore
│
├── db/
│   ├── pool.js            ← PostgreSQL connection
│   └── setup.js           ← Creates all tables + seeds demo data
│
├── middleware/
│   └── auth.js            ← JWT token verification
│
├── routes/
│   ├── auth.js            ← POST /api/auth/login
│   ├── users.js           ← GET/POST/PATCH /api/users
│   ├── inventory.js       ← Stock, Products, Suppliers
│   ├── operations.js      ← Orders, Deliveries, Manufacture
│   ├── reports.js         ← Warehouse Reports
│   └── notifications.js   ← Notifications
│
└── api.js                 ← Copy this to your frontend folder
```

---

## ✅ STEP-BY-STEP SETUP

### Step 1 — Install Node.js
Download from: https://nodejs.org (choose LTS version)
After install, open terminal and check:
```
node --version    # should show v18 or higher
npm --version
```

---

### Step 2 — Install PostgreSQL
Download from: https://www.postgresql.org/download/

During install:
- Set a password for the `postgres` user (remember this!)
- Keep default port: **5432**

After install, open **pgAdmin** (installed with PostgreSQL) or use terminal.

---

### Step 3 — Create the Database

**Option A — pgAdmin (easier):**
1. Open pgAdmin
2. Right-click Databases → Create → Database
3. Name it: `netstock`
4. Click Save

**Option B — Terminal:**
```bash
psql -U postgres
CREATE DATABASE netstock;
\q
```

---

### Step 4 — Configure Environment

In the `netstock-backend` folder, copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Open `.env` and fill in your PostgreSQL password:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=netstock
DB_USER=postgres
DB_PASSWORD=your_actual_password_here   ← CHANGE THIS

PORT=3001
JWT_SECRET=netstock_super_secret_key_change_this_2026
FRONTEND_URL=http://localhost:5500
```

---

### Step 5 — Install Dependencies

In the `netstock-backend` folder, open terminal and run:
```bash
npm install
```

This installs: express, pg, cors, dotenv, bcryptjs, jsonwebtoken

---

### Step 6 — Create Tables & Seed Data

```bash
node db/setup.js
```

You should see:
```
✅ Connected to PostgreSQL
🗑  Dropped old tables
✅ All tables created
✅ All seed data inserted
🎉 Database setup complete! Run: npm start
```

---

### Step 7 — Start the Backend

```bash
npm start
```

You should see:
```
✅ PostgreSQL connected successfully
🚀 NetStock Backend running on http://localhost:3001
```

Test it — open browser and go to: http://localhost:3001
You should see the API info JSON.

---

### Step 8 — Connect Frontend

1. Copy `api.js` from this folder to your **frontend folder** (same folder as index.html)

2. Open `index.html` and add this line **BEFORE** `<script src="app.js">`:
```html
<script src="api.js"></script>
```

3. In `app.js`, replace the `doGmailLogin` function login call:

**Find this in app.js:**
```javascript
function doGmailLogin(){
  const uid=parseInt(document.getElementById('gmail-accounts').dataset.sel)||1;
  CU=USERS.find(u=>u.id===uid);
  if(!CU||CU.status==='Inactive'){toast('Account inactive. Contact your Admin.');return;}
  completeLogin();
}
```

**Replace with:**
```javascript
async function doGmailLogin(){
  const uid=parseInt(document.getElementById('gmail-accounts').dataset.sel)||1;
  const localUser=USERS.find(u=>u.id===uid);
  if(!localUser){toast('Select an account');return;}

  try {
    // Try backend login first
    CU = await apiLogin(localUser.email);
    completeLogin();
  } catch(err) {
    // Fallback to local demo mode if backend not running
    console.warn('Backend not available, using demo mode:', err.message);
    CU = localUser;
    completeLogin();
  }
}
```

---

## 📡 API Reference

### Authentication
| Method | URL | Body | Description |
|--------|-----|------|-------------|
| POST | `/api/auth/login` | `{ email }` | Login, returns JWT token |
| GET  | `/api/auth/me`    | —           | Get current user info |

### Users (Admin/Manager)
| Method | URL | Description |
|--------|-----|-------------|
| GET    | `/api/users` | Get all users |
| POST   | `/api/users` | Add new user |
| PATCH  | `/api/users/:id/role` | Change role |
| PATCH  | `/api/users/:id/status` | Activate/Deactivate |

### Inventory
| Method | URL | Description |
|--------|-----|-------------|
| GET    | `/api/inventory/stock` | Get all stock |
| POST   | `/api/inventory/stock` | Add/update stock |
| PATCH  | `/api/inventory/stock/:sku` | Edit stock qty |
| GET    | `/api/inventory/products` | Get all products |
| POST   | `/api/inventory/products` | Add product |
| GET    | `/api/inventory/suppliers` | Get suppliers |
| POST   | `/api/inventory/suppliers` | Add supplier |

### Operations
| Method | URL | Description |
|--------|-----|-------------|
| GET    | `/api/operations/orders` | Get orders |
| POST   | `/api/operations/orders` | Create order |
| GET    | `/api/operations/deliveries` | Get deliveries |
| POST   | `/api/operations/deliveries` | Add delivery |
| PATCH  | `/api/operations/deliveries/:id/status` | Update delivery |
| GET    | `/api/operations/manufacture` | Get MOs |
| POST   | `/api/operations/manufacture` | Create MO |

### Reports
| Method | URL | Description |
|--------|-----|-------------|
| GET    | `/api/reports` | Get reports (role-filtered) |
| POST   | `/api/reports` | Submit report |
| PATCH  | `/api/reports/:ref/status` | Update status |

---

## 🗄️ Database Tables

| Table | Description |
|-------|-------------|
| `users` | All system users with roles |
| `suppliers` | Supplier list |
| `products` | Product catalog |
| `stock` | Current stock levels per SKU |
| `orders` | Customer orders |
| `deliveries` | Incoming deliveries |
| `manufacture_orders` | Production orders |
| `reports` | Warehouse staff reports |
| `notifications` | System alerts |

---

## 🔐 How Login Works

1. User selects email on login screen
2. Frontend calls `POST /api/auth/login` with `{ email }`
3. Backend checks `users` table — if Active, returns a **JWT token**
4. Token is stored in `localStorage` as `netstock_token`
5. All future API calls include `Authorization: Bearer <token>`
6. Token expires after **8 hours** (auto-logout)

---

## ❓ Troubleshooting

**"PostgreSQL connection failed"**
→ Check DB_PASSWORD in .env matches what you set during PostgreSQL install

**"database netstock does not exist"**
→ Run: `psql -U postgres -c "CREATE DATABASE netstock;"`

**"npm not found"**
→ Node.js is not installed. Download from nodejs.org

**Frontend can't reach backend (CORS error)**
→ Make sure FRONTEND_URL in .env matches where your HTML is served from
→ If using VS Code Live Server it's usually http://localhost:5500

**Port 3001 already in use**
→ Change PORT=3002 in .env (and update API_BASE in api.js to match)
