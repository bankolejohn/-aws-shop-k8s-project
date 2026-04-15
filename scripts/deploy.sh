#!/bin/bash

set -e

# Configuration
CLUSTER_NAME=${CLUSTER_NAME:-aws-ecommerce-dev}
AWS_REGION=${AWS_REGION:-us-west-2}
NAMESPACE=${NAMESPACE:-ecommerce}

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
    
    if ! command -v kubectl &> /dev/null; then
        error "kubectl is not installed"
    fi
    
    if ! command -v aws &> /dev/null; then
        error "AWS CLI is not installed"
    fi
    
    log "Prerequisites check passed"
}

# Update kubeconfig
update_kubeconfig() {
    log "Updating kubeconfig for cluster $CLUSTER_NAME..."
    aws eks update-kubeconfig --region $AWS_REGION --name $CLUSTER_NAME
}

# Create namespace if it doesn't exist
create_namespace() {
    log "Creating namespace $NAMESPACE if it doesn't exist..."
    kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
}

# Deploy services
deploy_services() {
    local image_tag=${1:-latest}
    
    log "Deploying services with image tag: $image_tag"
    
    # Update image tags in deployment files
    if [ "$image_tag" != "latest" ]; then
        log "Updating image tags to $image_tag"
        find k8s -name "deployment.yaml" -exec sed -i.bak "s|:latest|:$image_tag|g" {} \;
    fi
    
    # Apply Kubernetes manifests
    log "Applying Kubernetes manifests..."
    
    # Apply in order
    kubectl apply -f k8s/namespace.yaml || true
    kubectl apply -f k8s/configmaps/ || true
    kubectl apply -f k8s/secrets/ || true
    kubectl apply -f k8s/user-service/
    kubectl apply -f k8s/product-service/ || true
    kubectl apply -f k8s/order-service/ || true
    kubectl apply -f k8s/payment-service/ || true
    kubectl apply -f k8s/inventory-service/ || true
    kubectl apply -f k8s/notification-service/ || true
    
    # Restore original files if we modified them
    if [ "$image_tag" != "latest" ]; then
        find k8s -name "deployment.yaml.bak" -exec bash -c 'mv "$1" "${1%.bak}"' _ {} \;
    fi
}

# Wait for deployments to be ready
wait_for_deployments() {
    log "Waiting for deployments to be ready..."
    
    local deployments=(
        "user-service"
        "product-service"
        "order-service"
        "payment-service"
        "inventory-service"
        "notification-service"
    )
    
    for deployment in "${deployments[@]}"; do
        if kubectl get deployment $deployment -n $NAMESPACE &> /dev/null; then
            log "Waiting for $deployment to be ready..."
            kubectl rollout status deployment/$deployment -n $NAMESPACE --timeout=300s
        else
            warn "Deployment $deployment not found, skipping..."
        fi
    done
}

# Verify deployment
verify_deployment() {
    log "Verifying deployment..."
    
    log "Pods status:"
    kubectl get pods -n $NAMESPACE
    
    log "Services status:"
    kubectl get services -n $NAMESPACE
    
    log "Ingress status:"
    kubectl get ingress -n $NAMESPACE || true
}

# Main execution
main() {
    local image_tag=${1:-latest}
    
    log "Starting deployment process..."
    log "Cluster: $CLUSTER_NAME"
    log "Region: $AWS_REGION"
    log "Namespace: $NAMESPACE"
    log "Image tag: $image_tag"
    
    check_prerequisites
    update_kubeconfig
    create_namespace
    deploy_services $image_tag
    wait_for_deployments
    verify_deployment
    
    log "Deployment completed successfully!"
}

# Run main function with all arguments
main "$@"