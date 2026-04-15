#!/bin/bash

set -e

# Configuration
AWS_REGION=${AWS_REGION:-us-west-2}
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# Services to build
SERVICES=("user-service" "product-service" "order-service" "payment-service" "inventory-service" "notification-service")

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    if ! command -v aws &> /dev/null; then
        error "AWS CLI is not installed"
    fi
    
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        error "AWS credentials not configured"
    fi
    
    log "Prerequisites check passed"
}

# Login to ECR
ecr_login() {
    log "Logging into Amazon ECR..."
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY
}

# Create ECR repositories if they don't exist
create_ecr_repos() {
    log "Creating ECR repositories if they don't exist..."
    
    for service in "${SERVICES[@]}"; do
        if ! aws ecr describe-repositories --repository-names $service --region $AWS_REGION &> /dev/null; then
            log "Creating ECR repository for $service"
            aws ecr create-repository --repository-name $service --region $AWS_REGION
        else
            log "ECR repository for $service already exists"
        fi
    done
}

# Build and push service
build_and_push_service() {
    local service=$1
    local image_tag=${2:-latest}
    
    log "Building and pushing $service..."
    
    if [ ! -d "services/$service" ]; then
        warn "Service directory services/$service does not exist, skipping..."
        return
    fi
    
    cd "services/$service"
    
    # Build image
    log "Building Docker image for $service"
    docker build -t $service:$image_tag .
    
    # Tag for ECR
    docker tag $service:$image_tag $ECR_REGISTRY/$service:$image_tag
    docker tag $service:$image_tag $ECR_REGISTRY/$service:latest
    
    # Push to ECR
    log "Pushing $service to ECR"
    docker push $ECR_REGISTRY/$service:$image_tag
    docker push $ECR_REGISTRY/$service:latest
    
    # Clean up local images
    docker rmi $service:$image_tag $ECR_REGISTRY/$service:$image_tag $ECR_REGISTRY/$service:latest || true
    
    cd - > /dev/null
    
    log "Successfully built and pushed $service"
}

# Main execution
main() {
    local image_tag=${1:-latest}
    
    log "Starting build and push process..."
    log "Image tag: $image_tag"
    log "ECR Registry: $ECR_REGISTRY"
    
    check_prerequisites
    ecr_login
    create_ecr_repos
    
    # Build and push all services
    for service in "${SERVICES[@]}"; do
        build_and_push_service $service $image_tag
    done
    
    log "All services built and pushed successfully!"
}

# Run main function with all arguments
main "$@"