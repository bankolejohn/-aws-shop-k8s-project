# Getting Started with AWS Enterprise Ecommerce Platform

This guide will help you set up and deploy the complete AWS Enterprise Ecommerce Platform.

## Prerequisites

### Required Tools
- AWS CLI (v2.x)
- Terraform (>= 1.0)
- Docker
- kubectl
- Helm (v3.x)
- Node.js (>= 18.x)

### AWS Account Setup
1. Create an AWS account if you don't have one
2. Create an IAM user with appropriate permissions
3. Configure AWS CLI: `aws configure`

### Required AWS Permissions
Your IAM user needs permissions for:
- EC2, VPC, EKS, RDS, DynamoDB, S3, ECR
- IAM role creation and management
- CloudWatch, X-Ray, Cognito
- API Gateway, Lambda, SQS, SNS

## Quick Start

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd aws-ecommerce-platform
```

### 2. Infrastructure Deployment
```bash
cd infrastructure

# Initialize Terraform
terraform init

# Review the plan
terraform plan

# Apply infrastructure
terraform apply
```

### 3. Build and Push Services
```bash
# Make scripts executable
chmod +x scripts/*.sh

# Build and push all services to ECR
./scripts/build-and-push.sh
```

### 4. Deploy to Kubernetes
```bash
# Deploy all services
./scripts/deploy.sh

# Verify deployment
kubectl get pods -n ecommerce
```

### 5. Setup Monitoring
```bash
# Add Prometheus Helm repo
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install Prometheus stack
helm install prometheus prometheus-community/kube-prometheus-stack \
  -n monitoring \
  --create-namespace \
  -f monitoring/prometheus/values.yaml
```

## Architecture Overview

### Microservices
- **User Service**: Authentication and user management
- **Product Service**: Product catalog management
- **Order Service**: Order processing and management
- **Payment Service**: Payment processing
- **Inventory Service**: Stock management
- **Notification Service**: Email/SMS notifications

### AWS Services Used
- **Compute**: EKS, Lambda, API Gateway
- **Storage**: RDS (PostgreSQL), DynamoDB, S3, ElastiCache
- **Messaging**: SQS, SNS, EventBridge
- **Security**: Cognito, Secrets Manager, WAF
- **Monitoring**: CloudWatch, X-Ray

## Development Workflow

### Local Development
1. Each service can be run locally with Docker
2. Use docker-compose for local development environment
3. Services communicate via REST APIs

### CI/CD Pipeline
1. Code push triggers GitHub Actions
2. Automated testing and security scanning
3. Docker images built and pushed to ECR
4. Deployment to EKS via ArgoCD

### Testing Strategy
- Unit tests for each service
- Integration tests for API endpoints
- End-to-end tests for critical user flows
- Performance testing with load testing tools

## Monitoring and Observability

### Metrics
- Prometheus for metrics collection
- Grafana for visualization
- Custom application metrics

### Logging
- Centralized logging with ELK stack
- Structured JSON logging
- Log aggregation from all services

### Tracing
- AWS X-Ray for distributed tracing
- Request correlation across services
- Performance bottleneck identification

### Alerting
- AlertManager for alert routing
- SNS for notification delivery
- PagerDuty integration for critical alerts

## Security

### Container Security
- Trivy for vulnerability scanning
- Distroless base images
- Non-root user execution

### Application Security
- OWASP ZAP for security testing
- SonarQube for code quality
- AWS Security Hub for compliance

### Infrastructure Security
- VPC with private subnets
- Security groups and NACLs
- Secrets Manager for sensitive data
- IAM roles with least privilege

## Troubleshooting

### Common Issues

#### EKS Cluster Access
```bash
# Update kubeconfig
aws eks update-kubeconfig --region us-west-2 --name aws-ecommerce-dev

# Verify access
kubectl get nodes
```

#### Service Discovery Issues
```bash
# Check service endpoints
kubectl get endpoints -n ecommerce

# Check DNS resolution
kubectl run -it --rm debug --image=busybox --restart=Never -- nslookup user-service.ecommerce.svc.cluster.local
```

#### Database Connectivity
```bash
# Check RDS endpoint
aws rds describe-db-instances --db-instance-identifier aws-ecommerce-dev

# Test connectivity from pod
kubectl exec -it <pod-name> -n ecommerce -- nc -zv <rds-endpoint> 5432
```

### Useful Commands

#### Kubernetes
```bash
# Get all resources in namespace
kubectl get all -n ecommerce

# View pod logs
kubectl logs -f <pod-name> -n ecommerce

# Port forward to service
kubectl port-forward svc/user-service 8080:80 -n ecommerce
```

#### AWS
```bash
# List ECR repositories
aws ecr describe-repositories

# Get EKS cluster info
aws eks describe-cluster --name aws-ecommerce-dev

# Check RDS instances
aws rds describe-db-instances
```

## Next Steps

1. **Customize Configuration**: Update variables in `infrastructure/variables.tf`
2. **Add More Services**: Follow the pattern in existing services
3. **Setup Domain**: Configure Route53 and SSL certificates
4. **Production Hardening**: Review security settings and resource limits
5. **Cost Optimization**: Implement auto-scaling and spot instances

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review AWS CloudWatch logs
3. Check Kubernetes events: `kubectl get events -n ecommerce`
4. Create an issue in the repository