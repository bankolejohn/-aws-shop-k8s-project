const express = require('express');
const { Pool } = require('pg');
const logger = require('../utils/logger');

const router = express.Router();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'orders',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Get user orders
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.sub || req.headers['x-user-id'];
    
    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    res.json({
      orders: result.rows,
      count: result.rowCount
    });
  } catch (error) {
    logger.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create order
router.post('/', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { items, total, shippingAddress } = req.body;
    const userId = req.user?.sub || req.headers['x-user-id'];
    
    const orderResult = await client.query(
      'INSERT INTO orders (user_id, total, status, shipping_address, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [userId, total, 'pending', JSON.stringify(shippingAddress)]
    );
    
    const orderId = orderResult.rows[0].id;
    
    // Insert order items
    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.productId, item.quantity, item.price]
      );
    }
    
    await client.query('COMMIT');
    
    logger.info(`Order created: ${orderId}`);
    res.status(201).json(orderResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    client.release();
  }
});

module.exports = router;