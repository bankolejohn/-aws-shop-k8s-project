const express = require('express');
const redis = require('redis');
const logger = require('../utils/logger');

const router = express.Router();

router.get('/', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'inventory-service',
    version: '1.0.0',
    uptime: process.uptime(),
    dependencies: {}
  };

  if (process.env.REDIS_URL) {
    try {
      const client = redis.createClient({ url: process.env.REDIS_URL });
      await client.connect();
      await client.ping();
      health.dependencies.redis = 'healthy';
      await client.disconnect();
    } catch (error) {
      health.dependencies.redis = 'unhealthy';
      health.status = 'degraded';
      logger.warn('Redis health check failed:', error.message);
    }
  } else {
    health.dependencies.redis = 'not_configured';
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