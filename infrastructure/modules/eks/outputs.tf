output "cluster_name" {
  description = "EKS cluster name"
  value       = aws_eks_cluster.main.name
}

output "cluster_endpoint" {
  description = "EKS cluster endpoint"
  value       = aws_eks_cluster.main.endpoint
}

output "cluster_ca_certificate" {
  description = "EKS cluster CA certificate"
  value       = aws_eks_cluster.main.certificate_authority[0].data
}

output "cluster_version" {
  description = "EKS cluster Kubernetes version"
  value       = aws_eks_cluster.main.version
}

output "gpu_node_group_name" {
  description = "GPU node group name"
  value       = aws_eks_node_group.gpu.node_group_name
}

output "general_node_group_name" {
  description = "General node group name"
  value       = aws_eks_node_group.general.node_group_name
}