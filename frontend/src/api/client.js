// ─────────────────────────────────────────────
// API Client - connects frontend to microservices
// via the Nginx API Gateway
// ─────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(error.error || 'Request failed')
  }

  return res.json()
}

// ── Products ──────────────────────────────────
export const productsApi = {
  getAll: ()       => request('/api/v1/products'),
  getById: (id)    => request(`/api/v1/products/${id}`),
  create: (data)   => request('/api/v1/products', { method: 'POST', body: JSON.stringify(data) }),
}

// ── Orders ────────────────────────────────────
export const ordersApi = {
  getAll: ()       => request('/api/v1/orders'),
  getById: (id)    => request(`/api/v1/orders/${id}`),
  create: (data)   => request('/api/v1/orders', { method: 'POST', body: JSON.stringify(data) }),
}

// ── Users ─────────────────────────────────────
export const usersApi = {
  login: (data)    => request('/api/v1/users/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => request('/api/v1/users/register', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: ()   => request('/api/v1/users/profile'),
}

// ── Payments ──────────────────────────────────
export const paymentsApi = {
  process: (data)  => request('/api/v1/payments', { method: 'POST', body: JSON.stringify(data) }),
}

// ── Inventory ─────────────────────────────────
export const inventoryApi = {
  getStock: (id)   => request(`/api/v1/inventory/${id}`),
  reserve: (id, qty) => request(`/api/v1/inventory/${id}/reserve`, { method: 'POST', body: JSON.stringify({ quantity: qty }) }),
}

// ── Health ────────────────────────────────────
export const healthApi = {
  check: () => request('/health'),
}