const AWS = require('aws-sdk')

// Point to LocalStack when AWS_ENDPOINT_URL is set (local dev)
// In production on EKS, this env var is not set so it uses real AWS
if (process.env.AWS_ENDPOINT_URL) {
  AWS.config.update({
    endpoint: process.env.AWS_ENDPOINT_URL,
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
  })
}

module.exports = AWS