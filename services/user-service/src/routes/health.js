const express = require('express')
const logger = require('../utils/logger')

const router = express.Router()

router.get('/', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'user-service',
    version: '1.0.0',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    dependencies: {}
  }

  // Check AWS/LocalStack connectivity
  try {
    const AWS = require('../utils/aws')
    const cognito = new AWS.CognitoIdentityServiceProvider()
    await Promise.race([
      cognito.listUserPools({ MaxResults: 1 }).promise(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
    ])
    health.dependencies.cognito = 'healthy'
  } catch (error) {
    // Degraded but still operational — auth falls back to local mode
    health.dependencies.cognito = process.env.AWS_ENDPOINT_URL ? 'localstack' : 'unavailable'
    logger.warn('Cognito health check:', error.message)
  }

  res.status(200).json(health)
})

router.get('/ready', (req, res) => {
  res.status(200).json({ status: 'ready', timestamp: new Date().toISOString() })
})

router.get('/live', (req, res) => {
  res.status(200).json({ status: 'alive', timestamp: new Date().toISOString() })
})

module.exports = router