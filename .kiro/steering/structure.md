# Project Structure

```
.
├── frontend/                  # React frontend (Vite) — served via Nginx in Docker
├── services/                  # Node.js microservices
│   ├── user-service/          # Auth & user management (port 3001)
│   ├── product-service/       # Product catalog (port 3002)
│   ├── order-service/         # Order processing (port 3003)
│   ├── payment-service/       # Payment processing (port 3004)
│   ├── inventory-service/     # Stock management (port 3005)
│   ├── notification-service/  # Email/SMS (port 3006)
│   └── frontend/              # Minimal frontend stub (unused in favour of /frontend)
├── infrastructure/            # Terraform IaC
│   └── modules/               # vpc, eks, rds, dynamodb, elasticache, s3, cognito, etc.
├── k8s/                       # Kubernetes manifests
│   ├── user-service/          # Deployment, Service, HPA
│   ├── ai-workloads/          # ML training jobs, inference deployment, ConfigMap, PVCs
│   ├── gpu/                   # NVIDIA device plugin, DCGM exporter, RuntimeClass
│   └── namespace.yaml
├── monitoring/
│   ├── prometheus/            # prometheus.yml, alert rules, Helm values
│   ├── grafana/               # Helm values, provisioned datasources & dashboards
│   └── loki/                  # Helm values
├── nginx/                     # API gateway nginx.conf (routes /api/v1/* to services)
├── scripts/                   # Utility shell scripts (build, deploy, localstack init, etc.)
├── docs/                      # Additional documentation
├── .github/workflows/         # GitHub Actions CI/CD pipelines
└── docker-compose.yml         # Full local stack (services + LocalStack + Postgres + Redis + monitoring)
```

## Service Layout Convention

Every backend service follows the same internal structure:

```
services/<name>/
├── src/
│   ├── index.js          # Express app entry point
│   ├── routes/           # Route handlers (one file per resource)
│   ├── middleware/        # Custom middleware (auth, metrics, etc.)
│   └── utils/
│       ├── logger.js     # Winston logger instance
│       └── aws.js        # AWS SDK client setup
├── Dockerfile            # Multi-stage build (builder → runtime, non-root user)
├── healthcheck.js        # Used by Docker/K8s health probes
└── package.json
```

## Frontend Layout Convention

```
frontend/src/
├── api/client.js         # All fetch calls — single source of truth for API URLs
├── context/              # React Context providers (Auth, Cart, Wishlist)
├── components/           # Shared UI components (Navbar, Footer, ProductCard, Toast)
├── pages/                # One file per route (Home, Products, Cart, Checkout, etc.)
└── assets/               # Static images/icons
```

## Key Conventions

- All backend API routes are versioned: `/api/v1/<resource>`
- Health endpoints live at `/health` on every service
- Prometheus metrics exposed at `/metrics` on every service
- Environment-specific config is injected via environment variables — no config files committed with secrets
- Local dev uses `AWS_ENDPOINT_URL=http://localstack:4566` to redirect all AWS SDK calls to LocalStack
- Terraform resources are grouped into reusable modules under `infrastructure/modules/`
- All Terraform resources share common tags: `Project`, `Environment`, `ManagedBy=terraform`
- Docker images use `node:18-alpine`, multi-stage builds, and run as non-root user `nodejs` (uid 1001)
