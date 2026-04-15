#!/bin/bash
# ─────────────────────────────────────────────
# Start the full local stack
# ─────────────────────────────────────────────

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()  { echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"; }
warn() { echo -e "${YELLOW}[$(date +'%H:%M:%S')] $1${NC}"; }

log "Starting AWS Ecommerce Platform locally..."

# Check Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Docker is not running. Please start Docker first."
  exit 1
fi

# Build and start all services
log "Building and starting all containers..."
docker compose up --build -d

log "Waiting for services to be healthy..."
sleep 10

log ""
log "✅ Stack is up! Access points:"
log ""
log "  🛍️  Frontend:       http://localhost:5173"
log "  🔀  API Gateway:    http://localhost:8080"
log "  📊  Grafana:        http://localhost:3000  (admin / admin123)"
log "  📈  Prometheus:     http://localhost:9090"
log "  ☁️   LocalStack:     http://localhost:4566"
log ""
log "  Microservices:"
log "    User Service:         http://localhost:3001/health"
log "    Product Service:      http://localhost:3002/health"
log "    Order Service:        http://localhost:3003/health"
log "    Payment Service:      http://localhost:3004/health"
log "    Inventory Service:    http://localhost:3005/health"
log "    Notification Service: http://localhost:3006/health"
log ""
log "  Databases:"
log "    PostgreSQL:  localhost:5432  (ecommerce / ecommerce123)"
log "    Redis:       localhost:6379"
log ""
warn "Run 'docker compose logs -f' to tail all logs"
warn "Run 'docker compose down' to stop everything"