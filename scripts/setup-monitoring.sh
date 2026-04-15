#!/bin/bash

set -e

AWS_REGION=${AWS_REGION:-us-west-2}
CLUSTER_NAME=${CLUSTER_NAME:-aws-ecommerce-dev}

GREEN='\033[0;32m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"; }

log "Updating kubeconfig..."
aws eks update-kubeconfig --region $AWS_REGION --name $CLUSTER_NAME

log "Adding Helm repos..."
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo add nvidia https://helm.ngc.nvidia.com/nvidia
helm repo update

log "Creating namespaces..."
kubectl apply -f k8s/namespace.yaml

log "Installing GPU operator..."
helm upgrade --install gpu-operator nvidia/gpu-operator \
  --namespace gpu-operator \
  --create-namespace \
  --set driver.enabled=true \
  --set toolkit.enabled=true \
  --set devicePlugin.enabled=true \
  --set dcgmExporter.enabled=true \
  --wait

log "Installing Prometheus + Grafana stack..."
helm upgrade --install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  -f monitoring/prometheus/values.yaml \
  --wait

log "Installing Loki stack..."
helm upgrade --install loki grafana/loki \
  --namespace logging \
  --create-namespace \
  -f monitoring/loki/values.yaml \
  --wait

log "Installing Promtail..."
helm upgrade --install promtail grafana/promtail \
  --namespace logging \
  --set config.lokiAddress=http://loki-gateway.logging.svc.cluster.local/loki/api/v1/push \
  --wait

log "Applying GPU manifests..."
kubectl apply -f k8s/gpu/runtime-class.yaml
kubectl apply -f k8s/gpu/dcgm-exporter.yaml

log "Applying Prometheus alert rules..."
kubectl apply -f monitoring/prometheus/alert-rules.yaml

log "Applying AI workload storage..."
kubectl apply -f k8s/ai-workloads/storage.yaml
kubectl apply -f k8s/ai-workloads/configmap.yaml

log ""
log "Monitoring stack deployed successfully!"
log ""
log "Access Grafana:"
log "  kubectl port-forward svc/prometheus-grafana 3000:80 -n monitoring"
log "  URL: http://localhost:3000 | admin / admin123"
log ""
log "Access Prometheus:"
log "  kubectl port-forward svc/prometheus-operated 9090:9090 -n monitoring"
log "  URL: http://localhost:9090"