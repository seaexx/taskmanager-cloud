# Cluster ID
output "cluster_id" {
  description = "The unique identifier for the cluster"
  value       =  digitalocean_kubernetes_cluster.main.id
}

# Cluster Name
output "cluster_name" {
    description = "The name of the cluster"
    value       = digitalocean_kubernetes_cluster.main.name
}

# Cluster Endpoint
output "cluster_endpoint" {
    description = "The endpoint for the cluster's Kubernetes API"
    value       = digitalocean_kubernetes_cluster.main.endpoint
} 

# Cluster Status
output "cluster_status" {
    description = "The current status of the cluster"
    value       = digitalocean_kubernetes_cluster.main.status
}

# Kubernetes Version
output "k8s_version" {
    description = "The Kubernetes version of the cluster"
    value       = digitalocean_kubernetes_cluster.main.version
}

# cluster Region
output "cluster_region" {       
    description = "The region where the cluster is deployed"
    value       = digitalocean_kubernetes_cluster.main.region
}

# cluster Node Pool ID
output "node_pool_id" {
    description = "The unique identifier for the node pool"
    value       = digitalocean_kubernetes_cluster.main.node_pool[0].id
}

# cluster creation time
output "cluster_created_at" {
    description = "The timestamp when the cluster was created"
    value       = digitalocean_kubernetes_cluster.main.created_at
}

# cluster kubeconfig
output "kubeconfig" {
    description = "The kubeconfig file content for the cluster"
    value       = digitalocean_kubernetes_cluster.main.kube_config[0].raw_config
    sensitive = true
}   