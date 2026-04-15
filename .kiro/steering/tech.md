# Tech Stack

## Backend Services (Node.js Microservices)

- **Runtime**: Node.js >= 18 (CommonJS modules)
- **Framework**: Express 4.x
- **Validation**: `express-validator`, `joi`
- **Logging**: `winston` (JSON format in production, colorized console in dev)
- **Metrics**: `prom-client` (Prometheus `/metrics` endpoint)
- **Auth**: `jsonwebtoken`, `bcryptjs`; AWS Cognito in production
- **AWS SDK**: `aws-sdk` v2
- **Testing**: Jest + Supertest
- **Linting**: ESLint

Standard middleware applied to every service: `helmet`, `cors`, `compression`, `morgan`.

## Frontend

- **Framework**: React 19 (JSX, ES modules)
- **Build tool**: Vite 8
- **Routing**: React Router DOM v7
- **Icons**: lucide-react
- **State**: React Context API (AuthContext, CartContext, WishlistContext)
- **API**: Native `fetch` via a central `src/api/client.js` module
- **Linting**: ESLint with react-hooks and react-refresh plugins

## Infrastructure & DevOps

- **IaC**: Terraform >= 1.0 (AWS provider ~5.0, Kubernetes ~2.23, Helm ~2.11); state in S3
- **Containers**: Docker (multi-stage builds, node:18-alpine, non-root `nodejs` user)
- **Orchestration**: Kubernetes on AWS EKS; manifests in `k8s/`
- **GitOps**: ArgoCD
- **CI/CD**: GitHub Actions + AWS CodePipeline/CodeBuild/CodeDeploy
- **Local AWS emulation**: LocalStack 3.0 (DynamoDB, S3, SQS, SNS, SES, Cognito, Secrets Manager, SSM)

## Data Stores

| Store | Service | Usage |
|---|---|---|
| PostgreSQL 15 | order-service | Relational order data |
| DynamoDB | product-service, inventory-service | Product catalog, stock |
| Redis 7 | inventory-service | Caching layer |
| S3 | various | Object/asset storage |

## Monitoring

- **Metrics**: Prometheus + Grafana (with DCGM GPU dashboards)
- **Logs**: Loki + Promtail
- **Tracing**: AWS X-Ray + Jaeger
- **Alerting**: AlertManager + SNS

## Common Commands

### Local Development
```bash
# Start full stack locally
docker compose up

# Start a single service
docker compose up user-service

# Rebuild after code changes
docker compose up --build <service-name>
```

### Backend Services (run inside a service directory)
```bash
npm start          # production
npm run dev        # nodemon watch mode
npm test           # Jest
npm run test:coverage
npm run lint
npm run lint:fix
```

### Frontend (run inside frontend/)
```bash
npm run dev        # Vite dev server
npm run build      # production build
npm run preview    # preview production build
npm run lint
```

### Infrastructure
```bash
cd infrastructure
terraform init
terraform plan
terraform apply
```

### Kubernetes
```bash
# Deploy all manifests
kubectl apply -f k8s/

# Build and push images to ECR
./scripts/build-and-push.sh

# Deploy to EKS
./scripts/deploy.sh
```
