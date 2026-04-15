const express = require('express');
const { Pool } = require('pg');
const logger = require('../utils/logger');

const router = express.Router();

router.get('/', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'order-service',
    version: '1.0.0',
    uptime: process.uptime(),
    dependencies: {}
  };

  try {
    const pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'orders',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    
    await pool.query('SELECT 1');
    health.dependencies.postgresql = 'healthy';
    await pool.end();
  } catch (error) {
    health.dependencies.postgresql = 'unhealthy';
    health.status = 'degraded';
    logger.warn('PostgreSQL health check failed:', error.message);
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

router.get('/ready', (req, res) => {
  res.status(200).json({ status: 'ready', timestamp: new Date().toISOString() });
});

router.get('/live', (req, res) => {
  res.status(200).json({ status: 'alive', timestamp: new Date().toISOString() });
});

module.exports = router;