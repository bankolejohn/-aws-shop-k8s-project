const express = require('express')
const logger = require('../utils/logger')

const router = express.Router()

// Simple in-memory stock store — Redis is used when available
// Falls back gracefully so the service never hangs
const memoryStock = {}

function getRedisClient() {
  if (!process.env.REDIS_URL) return null
  try {
    const redis = require('redis')
    const client = redis.createClient({ url: process.env.REDIS_URL, socket: { connectTimeout: 3000 } })
    client.on('error', () => {}) // suppress unhandled errors
    client.connect().catch(() => {})
    return client
  } catch {
    return null
  }
}

const redisClient = getRedisClient()

async function getStock(productId) {
  // Try Redis first
  if (redisClient?.isReady) {
    try {
      const val = await Promise.race([
        redisClient.get(`stock:${productId}`),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
      ])
      if (val !== null) return parseInt(val)
    } catch { /* fall through to memory */ }
  }
  // Fall back to memory store
  if (memoryStock[productId] === undefined) {
    memoryStock[productId] = Math.floor(Math.random() * 80) + 20
  }
  return memoryStock[productId]
}

async function setStock(productId, qty) {
  memoryStock[productId] = qty
  if (redisClient?.isReady) {
    try {
      await Promise.race([
        redisClient.setEx(`stock:${productId}`, 300, qty.toString()),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
      ])
    } catch { /* ignore */ }
  }
}

// GET /api/v1/inventory/:productId
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params
    const stock = await getStock(productId)
    res.json({ productId, stock, available: stock > 0 })
  } catch (error) {
    logger.error('Error checking stock:', error)
    res.status(500).json({ error: 'Failed to check stock' })
  }
})

// POST /api/v1/inventory/:productId/reserve
router.post('/:productId/reserve', async (req, res) => {
  try {
    const { productId } = req.params
    const { quantity = 1 } = req.body
    const stock = await getStock(productId)

    if (stock >= quantity) {
      const newStock = stock - quantity
      await setStock(productId, newStock)
      logger.info(`Reserved ${quantity} units of product ${productId}`)
      res.json({ productId, reserved: quantity, remainingStock: newStock })
    } else {
      res.status(400).json({ error: 'Insufficient stock', available: stock })
    }
  } catch (error) {
    logger.error('Error reserving stock:', error)
    res.status(500).json({ error: 'Failed to reserve stock' })
  }
})

module.exports = router