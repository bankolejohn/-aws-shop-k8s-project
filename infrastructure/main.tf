terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.11"
    }
  }

  backend "s3" {
    # Configure your S3 backend
    # bucket = "your-terraform-state-bucket"
    # key    = "ecommerce/terraform.tfstate"
    # region = "us-west-2"
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "aws-ecommerce"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_caller_identity" "current" {}

# Local values
locals {
  cluster_name = "${var.project_name}-${var.environment}"
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# VPC Module
module "vpc" {
  source = "./modules/vpc"
  
  project_name = var.project_name
  environment  = var.environment
  vpc_cidr     = var.vpc_cidr
  azs          = data.aws_availability_zones.available.names
  
  tags = local.common_tags
}

# EKS Module
module "eks" {
  source = "./modules/eks"
  
  cluster_name   = local.cluster_name
  vpc_id         = module.vpc.vpc_id
  subnet_ids     = module.vpc.private_subnet_ids
  node_groups    = var.eks_node_groups
  
  tags = local.common_tags
}

# RDS Module
module "rds" {
  source = "./modules/rds"
  
  identifier     = "${var.project_name}-${var.environment}"
  vpc_id         = module.vpc.vpc_id
  subnet_ids     = module.vpc.database_subnet_ids
  instance_class = var.rds_instance_class
  
  tags = local.common_tags
}

# DynamoDB Module
module "dynamodb" {
  source = "./modules/dynamodb"
  
  project_name = var.project_name
  environment  = var.environment
  
  tags = local.common_tags
}

# ElastiCache Module
module "elasticache" {
  source = "./modules/elasticache"
  
  cluster_id = "${var.project_name}-${var.environment}"
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnet_ids
  
  tags = local.common_tags
}

# S3 Module
module "s3" {
  source = "./modules/s3"
  
  project_name = var.project_name
  environment  = var.environment
  
  tags = local.common_tags
}

# API Gateway Module
module "api_gateway" {
  source = "./modules/api-gateway"
  
  name        = "${var.project_name}-${var.environment}"
  environment = var.environment
  
  tags = local.common_tags
}

# Cognito Module
module "cognito" {
  source = "./modules/cognito"
  
  user_pool_name = "${var.project_name}-${var.environment}"
  environment    = var.environment
  
  tags = local.common_tags
}

# Monitoring Module
module "monitoring" {
  source = "./modules/monitoring"
  
  cluster_name = local.cluster_name
  environment  = var.environment
  
  tags = local.common_tags
}