const express = require('express');
const AWS = require('../utils/aws');
const logger = require('../utils/logger');

const router = express.Router();
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Get all products
router.get('/', async (req, res) => {
  try {
    const params = {
      TableName: process.env.PRODUCTS_TABLE || 'products'
    };

    const result = await dynamodb.scan(params).promise();
    
    res.json({
      products: result.Items,
      count: result.Count
    });
  } catch (error) {
    logger.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const params = {
      TableName: process.env.PRODUCTS_TABLE || 'products',
      Key: { id: req.params.id }
    };

    const result = await dynamodb.get(params).promise();
    
    if (!result.Item) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.Item);
  } catch (error) {
    logger.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product
router.post('/', async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const id = Date.now().toString();
    
    const product = {
      id,
      name,
      description,
      price,
      category,
      stock,
      createdAt: new Date().toISOString()
    };

    const params = {
      TableName: process.env.PRODUCTS_TABLE || 'products',
      Item: product
    };

    await dynamodb.put(params).promise();
    
    logger.info(`Product created: ${id}`);
    res.status(201).json(product);
  } catch (error) {
    logger.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

module.exports = router;