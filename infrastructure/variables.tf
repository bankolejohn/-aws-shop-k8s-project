variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "aws-ecommerce"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "eks_node_groups" {
  description = "EKS node groups configuration"
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
  default = {
    general = {
      instance_types = ["t3.medium"]
      min_size       = 2
      max_size       = 5
      desired_size   = 3
    }
    gpu = {
      min_size     = 0
      max_size     = 4
      desired_size = 0  # scale to 0 when no GPU workloads to save cost
    }
    spot = {
      min_size     = 0
      max_size     = 10
      desired_size = 2
    }
  }
}

variable "rds_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}