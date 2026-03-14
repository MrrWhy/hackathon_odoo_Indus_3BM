// ============================================================
// api.js — Frontend ↔ Backend connector for NetStock
// Add this as a separate <script src="api.js"> in index.html
// BEFORE <script src="app.js">
// ============================================================

const API_BASE = 'http://localhost:3001/api';
let AUTH_TOKEN = localStorage.getItem('netstock_token') || null;

// ── Helper: make authenticated API calls ──
async function api(method, path, body = null) {
  const opts = {
    method,
    headers: {
      'Content-Type':  'application/json',
      'Authorization': AUTH_TOKEN ? `Bearer ${AUTH_TOKEN}` : '',
    },
  };
  if (body) opts.body = JSON.stringify(body);

  try {
    const res = await fetch(API_BASE + path, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'API error');
    return data;
  } catch (err) {
    // If token expired, clear it
    if (err.message.includes('expired') || err.message.includes('Invalid')) {
      AUTH_TOKEN = null;
      localStorage.removeItem('netstock_token');
    }
    throw err;
  }
}

// ── AUTH ──
async function apiLogin(email) {
  const data = await api('POST', '/auth/login', { email });
  AUTH_TOKEN = data.token;
  localStorage.setItem('netstock_token', data.token);
  return data.user;
}

function apiLogout() {
  AUTH_TOKEN = null;
  localStorage.removeItem('netstock_token');
}

// ── USERS ──
const apiGetUsers       = ()           => api('GET',   '/users');
const apiAddUser        = (body)       => api('POST',  '/users', body);
const apiChangeRole     = (id, role)   => api('PATCH', `/users/${id}/role`, { role });
const apiToggleStatus   = (id, status) => api('PATCH', `/users/${id}/status`, { status });

// ── INVENTORY ──
const apiGetStock       = (search)     => api('GET',  '/inventory/stock' + (search ? `?search=${search}` : ''));
const apiAddStock       = (body)       => api('POST', '/inventory/stock', body);
const apiUpdateStock    = (sku, body)  => api('PATCH',`/inventory/stock/${sku}`, body);
const apiGetProducts    = ()           => api('GET',  '/inventory/products');
const apiAddProduct     = (body)       => api('POST', '/inventory/products', body);
const apiUpdateProduct  = (sku, body)  => api('PUT',  `/inventory/products/${sku}`, body);
const apiGetSuppliers   = ()           => api('GET',  '/inventory/suppliers');
const apiAddSupplier    = (body)       => api('POST', '/inventory/suppliers', body);

// ── OPERATIONS ──
const apiGetOrders      = (q, st)      => api('GET', '/operations/orders' + (q||st ? `?${q?'search='+q:''}${q&&st?'&':''}${st?'status='+st:''}` : ''));
const apiAddOrder       = (body)       => api('POST', '/operations/orders', body);
const apiUpdateOrder    = (id, status) => api('PATCH',`/operations/orders/${id}`, { status });
const apiGetDeliveries  = ()           => api('GET',  '/operations/deliveries');
const apiAddDelivery    = (body)       => api('POST', '/operations/deliveries', body);
const apiUpdateDelivery = (id, status) => api('PATCH',`/operations/deliveries/${id}/status`, { status });
const apiGetMO          = ()           => api('GET',  '/operations/manufacture');
const apiAddMO          = (body)       => api('POST', '/operations/manufacture', body);
const apiUpdateMO       = (mo, status) => api('PATCH',`/operations/manufacture/${mo}/status`, { status });

// ── REPORTS ──
const apiGetReports     = (type)       => api('GET',  '/reports' + (type ? `?type=${type}` : ''));
const apiAddReport      = (body)       => api('POST', '/reports', body);
const apiUpdateReport   = (ref, status)=> api('PATCH',`/reports/${ref}/status`, { status });

// ── NOTIFICATIONS ──
const apiGetNotifs      = ()           => api('GET',    '/notifications');
const apiMarkRead       = (id)         => api('PATCH',  `/notifications/${id}/read`);
const apiMarkAllRead    = ()           => api('PATCH',  '/notifications/read-all');
const apiClearNotifs    = ()           => api('DELETE', '/notifications');

// ── Backend health check ──
async function checkBackend() {
  try {
    const res = await fetch('http://localhost:3001/');
    return res.ok;
  } catch {
    return false;
  }
}
