# Cluster name
variable "cluster_name" {
  description = "Name of the Kubernetes cluster"
  type        = string
  default     = "taskmanager-terraform"
}

# Region
variable "region" {
  description = "DigitalOcean region"
  type        = string
  default     = "nyc1"
}

# Node size
variable "node_size" {
  description = "Size of worker nodes"
  type        = string
  default     = "s-2vcpu-4gb"
}

# Node count
variable "node_count" {
  description = "Number of worker nodes"
  type        = number
  default     = 3
}

# Kubernetes version
variable "k8s_version" {
  description = "Kubernetes version"
  type        = string
  default     = "1.32"
}