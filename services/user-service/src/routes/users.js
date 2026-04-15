const express = require('express')
const { body, validationResult } = require('express-validator')
const logger = require('../utils/logger')

const router = express.Router()

// In-memory user store for local dev (Cognito in production)
const localUsers = new Map()

// POST /api/v1/users/register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password, firstName, lastName } = req.body

    if (localUsers.has(email)) {
      return res.status(409).json({ error: 'User already exists' })
    }

    const user = {
      id: `user-${Date.now()}`,
      email,
      firstName,
      lastName,
      role: 'customer',
      createdAt: new Date().toISOString()
    }

    localUsers.set(email, { ...user, password })

    logger.info(`User registered: ${email}`)
    res.status(201).json({ message: 'User registered successfully', user })
  } catch (error) {
    logger.error('Error registering user:', error)
    res.status(500).json({ error: 'Failed to register user' })
  }
})

// POST /api/v1/users/login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body
    const stored = localUsers.get(email)

    if (!stored || stored.password !== password) {
      // Accept any credentials in local dev mode
      if (process.env.NODE_ENV !== 'production') {
        const user = stored || {
          id: `user-${Date.now()}`,
          email,
          firstName: email.split('@')[0],
          lastName: '',
          role: 'customer'
        }
        if (!stored) localUsers.set(email, { ...user, password })
        logger.info(`Local dev login: ${email}`)
        return res.json({ message: 'Login successful', user })
      }
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const { password: _, ...user } = stored
    logger.info(`User logged in: ${email}`)
    res.json({ message: 'Login successful', user })
  } catch (error) {
    logger.error('Error logging in:', error)
    res.status(500).json({ error: 'Failed to login' })
  }
})

// GET /api/v1/users/profile
router.get('/profile', async (req, res) => {
  const userId = req.headers['x-user-id'] || 'anonymous'
  res.json({ id: userId, message: 'Profile endpoint - attach JWT middleware in production' })
})

module.exports = router