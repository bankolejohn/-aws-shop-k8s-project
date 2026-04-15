#!/bin/bash
# ─────────────────────────────────────────────────────────
# LocalStack Init Script
# Runs automatically when LocalStack is ready.
# Creates all AWS resources needed locally.
# ─────────────────────────────────────────────────────────

set -e
ENDPOINT="http://localhost:4566"
REGION="us-east-1"
ACCOUNT="000000000000"

echo ">>> Creating DynamoDB tables..."

aws --endpoint-url=$ENDPOINT dynamodb create-table \
  --table-name products \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region $REGION 2>/dev/null || echo "products table already exists"

aws --endpoint-url=$ENDPOINT dynamodb create-table \
  --table-name inventory \
  --attribute-definitions AttributeName=productId,AttributeType=S \
  --key-schema AttributeName=productId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region $REGION 2>/dev/null || echo "inventory table already exists"

echo ">>> Seeding products into DynamoDB..."

aws --endpoint-url=$ENDPOINT dynamodb put-item \
  --table-name products --region $REGION \
  --item '{"id":{"S":"1"},"name":{"S":"Wireless Noise-Cancelling Headphones"},"category":{"S":"electronics"},"price":{"N":"299.99"},"stock":{"N":"15"},"rating":{"N":"4.8"}}' 2>/dev/null || true

aws --endpoint-url=$ENDPOINT dynamodb put-item \
  --table-name products --region $REGION \
  --item '{"id":{"S":"2"},"name":{"S":"Smart Watch Series X"},"category":{"S":"electronics"},"price":{"N":"449.99"},"stock":{"N":"8"},"rating":{"N":"4.6"}}' 2>/dev/null || true

aws --endpoint-url=$ENDPOINT dynamodb put-item \
  --table-name products --region $REGION \
  --item '{"id":{"S":"3"},"name":{"S":"Minimalist Running Shoes"},"category":{"S":"sports"},"price":{"N":"129.99"},"stock":{"N":"42"},"rating":{"N":"4.7"}}' 2>/dev/null || true

echo ">>> Creating SQS queues..."

aws --endpoint-url=$ENDPOINT sqs create-queue \
  --queue-name payment-queue \
  --region $REGION 2>/dev/null || echo "payment-queue already exists"

aws --endpoint-url=$ENDPOINT sqs create-queue \
  --queue-name notification-queue \
  --region $REGION 2>/dev/null || echo "notification-queue already exists"

aws --endpoint-url=$ENDPOINT sqs create-queue \
  --queue-name order-events-queue \
  --region $REGION 2>/dev/null || echo "order-events-queue already exists"

echo ">>> Creating SNS topics..."

aws --endpoint-url=$ENDPOINT sns create-topic \
  --name order-notifications \
  --region $REGION 2>/dev/null || echo "order-notifications topic already exists"

aws --endpoint-url=$ENDPOINT sns create-topic \
  --name payment-notifications \
  --region $REGION 2>/dev/null || echo "payment-notifications topic already exists"

echo ">>> Creating S3 buckets..."

aws --endpoint-url=$ENDPOINT s3 mb s3://ecommerce-assets --region $REGION 2>/dev/null || true
aws --endpoint-url=$ENDPOINT s3 mb s3://ecommerce-datasets --region $REGION 2>/dev/null || true
aws --endpoint-url=$ENDPOINT s3 mb s3://ecommerce-models --region $REGION 2>/dev/null || true

echo ">>> Creating Cognito User Pool..."

aws --endpoint-url=$ENDPOINT cognito-idp create-user-pool \
  --pool-name ecommerce-users \
  --region $REGION 2>/dev/null || echo "User pool already exists"

echo ">>> Creating Secrets Manager secrets..."

aws --endpoint-url=$ENDPOINT secretsmanager create-secret \
  --name /ecommerce/db/password \
  --secret-string "ecommerce123" \
  --region $REGION 2>/dev/null || true

aws --endpoint-url=$ENDPOINT secretsmanager create-secret \
  --name /ecommerce/jwt/secret \
  --secret-string "local-dev-jwt-secret-key-change-in-prod" \
  --region $REGION 2>/dev/null || true

echo ""
echo "✅ LocalStack initialization complete!"
echo "   DynamoDB tables: products, inventory"
echo "   SQS queues: payment-queue, notification-queue, order-events-queue"
echo "   SNS topics: order-notifications, payment-notifications"
echo "   S3 buckets: ecommerce-assets, ecommerce-datasets, ecommerce-models"
echo "   Cognito: ecommerce-users pool"
echo "   Secrets: /ecommerce/db/password, /ecommerce/jwt/secret"