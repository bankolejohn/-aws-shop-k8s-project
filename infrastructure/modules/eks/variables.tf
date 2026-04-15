variable "cluster_name" {
  description = "EKS cluster name"
  type        = string
}

variable "kubernetes_version" {
  description = "Kubernetes version"
  type        = string
  default     = "1.29"
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "subnet_ids" {
  description = "Subnet IDs for node groups"
  type        = list(string)
}

variable "node_groups" {
  description = "Node group configurations"
  type = object({
    general = object({
      instance_types = list(string)
      min_size       = number
      max_size       = number
      desired_size   = number
    })
    gpu = object({
      min_size     = number
      max_size     = number
      desired_size = number
    })
    spot = object({
      min_size     = number
      max_size     = number
      desired_size = number
    })
  })
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}