-- ─────────────────────────────────────────────
-- Orders Database Schema
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS orders (
  id              SERIAL PRIMARY KEY,
  user_id         VARCHAR(255) NOT NULL,
  total           DECIMAL(10,2) NOT NULL,
  status          VARCHAR(50) NOT NULL DEFAULT 'pending',
  shipping_address JSONB,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id          SERIAL PRIMARY KEY,
  order_id    INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id  VARCHAR(255) NOT NULL,
  quantity    INTEGER NOT NULL,
  price       DECIMAL(10,2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status  ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Seed some sample orders
INSERT INTO orders (user_id, total, status, shipping_address, created_at) VALUES
  ('user-001', 449.98, 'delivered', '{"address":"123 Main St","city":"New York","zip":"10001"}', NOW() - INTERVAL '13 days'),
  ('user-001', 129.99, 'shipped',   '{"address":"123 Main St","city":"New York","zip":"10001"}', NOW() - INTERVAL '6 days'),
  ('user-001', 189.99, 'processing','{"address":"123 Main St","city":"New York","zip":"10001"}', NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
  (1, '1', 1, 299.99),
  (1, '12', 1, 39.99),
  (2, '3', 1, 129.99),
  (3, '4', 1, 189.99)
ON CONFLICT DO NOTHING;