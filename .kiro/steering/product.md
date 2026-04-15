# Product Overview

AWS Enterprise Ecommerce Platform — a production-grade, cloud-native online store built on a microservices architecture running on EKS. The platform also serves as an AI/ML infrastructure showcase, with GPU-accelerated workloads, ML training jobs, and inference deployments alongside the core commerce functionality.

## Core Capabilities

- User registration, authentication, and profile management (backed by AWS Cognito in production)
- Product catalog browsing, search, and detail views
- Shopping cart, wishlist, and checkout flows
- Order placement and order history
- Payment processing via async SQS queue
- Real-time inventory tracking with Redis caching
- Email/SMS notifications via SNS/SES
- AI/ML workload orchestration on GPU nodes (NVIDIA T4 via g4dn.xlarge)

## Users

End customers shopping via the React frontend, and platform engineers managing infrastructure, deployments, and ML workloads.

## Environments

- **Local dev**: Docker Compose with LocalStack emulating AWS services
- **Production**: AWS EKS with full managed AWS services (Cognito, DynamoDB, RDS, ElastiCache, SQS, SNS, SES)
