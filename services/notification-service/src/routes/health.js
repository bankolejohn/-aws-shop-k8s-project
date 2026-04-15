const express = require('express');
const AWS = require('../utils/aws');
const logger = require('../utils/logger');

const router = express.Router();

router.get('/', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'notification-service',
    version: '1.0.0',
    uptime: process.uptime(),
    dependencies: {}
  };

  try {
    const sns = new AWS.SNS();
    await sns.listTopics().promise();
    health.dependencies.sns = 'healthy';
  } catch (error) {
    health.dependencies.sns = 'unhealthy';
    health.status = 'degraded';
    logger.warn('SNS health check failed:', error.message);
  }

  try {
    const ses = new AWS.SES();
    await ses.getIdentityVerificationAttributes().promise();
    health.dependencies.ses = 'healthy';
  } catch (error) {
    health.dependencies.ses = 'unhealthy';
    health.status = 'degraded';
    logger.warn('SES health check failed:', error.message);
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