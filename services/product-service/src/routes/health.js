const express = require('express');
const AWS = require('../utils/aws');
const logger = require('../utils/logger');

const router = express.Router();

router.get('/', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'product-service',
    version: '1.0.0',
    uptime: process.uptime(),
    dependencies: {}
  };

  try {
    const dynamodb = new AWS.DynamoDB();
    await dynamodb.listTables().promise();
    health.dependencies.dynamodb = 'healthy';
  } catch (error) {
    health.dependencies.dynamodb = 'unhealthy';
    health.status = 'degraded';
    logger.warn('DynamoDB health check failed:', error.message);
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