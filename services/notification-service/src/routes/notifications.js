const express = require('express');
const AWS = require('../utils/aws');
const logger = require('../utils/logger');

const router = express.Router();
const sns = new AWS.SNS();
const ses = new AWS.SES();

// Send email notification
router.post('/email', async (req, res) => {
  try {
    const { to, subject, body, type } = req.body;
    
    const params = {
      Destination: {
        ToAddresses: [to]
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: body
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject
        }
      },
      Source: process.env.FROM_EMAIL || 'noreply@example.com'
    };
    
    if (process.env.NODE_ENV === 'production' && process.env.FROM_EMAIL) {
      const result = await ses.sendEmail(params).promise();
      logger.info(`Email sent: ${result.MessageId}`);
      
      res.json({
        messageId: result.MessageId,
        status: 'sent'
      });
    } else {
      // Simulate email sending in development
      logger.info(`Email simulated: ${to} - ${subject}`);
      res.json({
        messageId: `sim_${Date.now()}`,
        status: 'simulated'
      });
    }
  } catch (error) {
    logger.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Send SMS notification
router.post('/sms', async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;
    
    const params = {
      Message: message,
      PhoneNumber: phoneNumber
    };
    
    if (process.env.NODE_ENV === 'production') {
      const result = await sns.publish(params).promise();
      logger.info(`SMS sent: ${result.MessageId}`);
      
      res.json({
        messageId: result.MessageId,
        status: 'sent'
      });
    } else {
      // Simulate SMS sending in development
      logger.info(`SMS simulated: ${phoneNumber} - ${message}`);
      res.json({
        messageId: `sim_${Date.now()}`,
        status: 'simulated'
      });
    }
  } catch (error) {
    logger.error('Error sending SMS:', error);
    res.status(500).json({ error: 'Failed to send SMS' });
  }
});

// Send push notification
router.post('/push', async (req, res) => {
  try {
    const { deviceToken, title, body, data } = req.body;
    
    // Simulate push notification
    logger.info(`Push notification simulated: ${deviceToken} - ${title}`);
    
    res.json({
      messageId: `push_${Date.now()}`,
      status: 'simulated'
    });
  } catch (error) {
    logger.error('Error sending push notification:', error);
    res.status(500).json({ error: 'Failed to send push notification' });
  }
});

module.exports = router;