const express = require('express');
const AWS = require('../utils/aws');
const logger = require('../utils/logger');

const router = express.Router();
const sqs = new AWS.SQS();

// Process payment
router.post('/', async (req, res) => {
  try {
    const { orderId, amount, paymentMethod, cardToken } = req.body;
    
    // Simulate payment processing
    const paymentId = `pay_${Date.now()}`;
    const success = Math.random() > 0.1; // 90% success rate
    
    const paymentResult = {
      paymentId,
      orderId,
      amount,
      status: success ? 'completed' : 'failed',
      timestamp: new Date().toISOString()
    };
    
    // Send payment result to SQS
    const sqsParams = {
      QueueUrl: process.env.PAYMENT_QUEUE_URL,
      MessageBody: JSON.stringify(paymentResult),
      MessageAttributes: {
        'eventType': {
          DataType: 'String',
          StringValue: 'payment.processed'
        }
      }
    };
    
    if (process.env.PAYMENT_QUEUE_URL) {
      await sqs.sendMessage(sqsParams).promise();
    }
    
    logger.info(`Payment processed: ${paymentId}, Status: ${paymentResult.status}`);
    
    res.status(success ? 200 : 400).json(paymentResult);
  } catch (error) {
    logger.error('Error processing payment:', error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

// Get payment status
router.get('/:paymentId', async (req, res) => {
  try {
    // In a real implementation, this would query a database
    res.json({
      paymentId: req.params.paymentId,
      status: 'completed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error fetching payment:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

module.exports = router;