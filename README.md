# AWS Enterprise Ecommerce Platform + AI Infrastructure

A production-grade microservices ecommerce platform running on an AI-ready Kubernetes cluster. Built to showcase enterprise AWS services, DevOps practices, and AI/ML infrastructure engineering — including GPU scheduling, ML workload orchestration, and full-stack observability with Prometheus, Grafana, and Loki.

## Architecture Overview

### Microservices
- **User Service** - User management, authentication (Cognito)
- **Product Service** - Product catalog (DynamoDB)
- **Order Service** - Order processing (RDS PostgreSQL)
- **Payment Service** - Payment processing (Lambda + SQS)
- **Inventory Service** - Stock management (DynamoDB + ElastiCache)
- **Notification Service** - Email/SMS notifications (SNS + SES)
- **Analytics Service** - Real-time analytics (Kinesis + Lambda)

### AWS Services Used
- **Compute**: EKS, ECS, Lambda, API Gateway
- **Storage**: RDS (PostgreSQL), DynamoDB, S3, ElastiCache (Redis)
- **Messaging**: SQS, SNS, EventBridge, Kinesis
- **Security**: Cognito, Secrets Manager, Parameter Store, WAF
- **Monitoring**: CloudWatch, X-Ray, AWS Config
- **CDN/DNS**: CloudFront, Route53
- **CI/CD**: CodePipeline, CodeBuild, CodeDeploy

### DevOps + AI Infrastructure Stack
- **IaC**: Terraform (VPC, EKS with GPU node groups, RDS, DynamoDB, ElastiCache)
- **CI/CD**: GitHub Actions + AWS CodePipeline
- **Containerization**: Docker + Kubernetes (EKS)
- **GitOps**: ArgoCD
- **Monitoring**: Prometheus + Grafana (with GPU dashboards via DCGM)
- **Logging**: Loki + Promtail (replaces ELK for cloud-native log aggregation)
- **GPU Observability**: NVIDIA DCGM Exporter → Prometheus → Grafana
- **Security**: Trivy, OWASP ZAP, AWS Security Hub

### AI/ML Infrastructure
- GPU node group (g4dn.xlarge - NVIDIA T4) with taints/tolerations
- NVIDIA GPU device plugin DaemonSet
- DCGM Exporter for GPU metrics (temperature, memory, utilization)
- ML training Jobs with dataset PVCs (500Gi high-throughput gp3)
- ML inference Deployment with GPU-aware HPA
- Persistent Volumes for datasets and model storage
- AI workloads namespace with dedicated node affinity

## Project Structure

```
├── infrastructure/          # Terraform IaC
├── services/               # Microservices
├── k8s/                   # Kubernetes manifests
├── helm/                  # Helm charts
├── .github/               # GitHub Actions workflows
├── monitoring/            # Monitoring stack
├── scripts/               # Utility scripts
└── docs/                  # Documentation
```

## Getting Started

1. **Prerequisites**
   - AWS CLI configured
   - Terraform installed
   - Docker installed
   - kubectl installed
   - Helm installed

2. **Infrastructure Setup**
   ```bash
   cd infrastructure
   terraform init
   terraform plan
   terraform apply
   ```

3. **Deploy Services**
   ```bash
   # Build and push images
   ./scripts/build-and-push.sh
   
   # Deploy to EKS
   kubectl apply -f k8s/
   ```

## Development Workflow

1. Code changes trigger GitHub Actions
2. Automated testing and security scanning
3. Docker image build and push to ECR
4. ArgoCD detects changes and deploys to EKS
5. Monitoring and alerting via Prometheus/Grafana

## Monitoring & Observability

- **Metrics**: Prometheus + Grafana
- **Logs**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Tracing**: AWS X-Ray + Jaeger
- **Alerting**: AlertManager + SNS

## Security

- **Container Scanning**: Trivy
- **SAST**: SonarQube
- **DAST**: OWASP ZAP
- **Infrastructure**: AWS Config, Security Hub
- **Secrets**: AWS Secrets Manager + External Secrets Operator