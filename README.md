# TaskManager Cloud
A production Kubernetes deployment demonstrating Infrastructure as Code, GitOps, and automated CI/CD workflows.

## What I Built
- Kubernetes cluster provisioned with Terraform
- GitOps deployment using ArgoCD  
- Automated builds and deployments via GitHub Actions
- Three environments: dev, staging, production
- Auto-scaling with HPA
- HTTPS using cert-manager and Let's Encrypt

## Tech Stack
**Infrastructure**: Terraform, Kubernetes, DigitalOcean  
**Deployment**: ArgoCD, GitHub Actions  
**Monitoring**: Prometheus, Grafana  
**Tools**: Docker, Kustomize, Helm

## Structure
- terraform/       # Infrastructure as code
- k8s/             # Kubernetes manifests
- base/          # Base configs
- overlays/      # Environment-specific configs
- argocd-apps/     # GitOps applications
- .github/         # CI/CD workflows
  
## How It Works
1. Push code to GitHub
2. GitHub Actions builds Docker image
3. ArgoCD detects changes and deploys
4. Self-healing keeps cluster synced with Git

## Running It
```bash
# Provision infrastructure
cd terraform/
terraform init
terraform apply

# Get kubeconfig
terraform output -raw kubeconfig > ~/.kube/config

# Deploy apps (ArgoCD handles this automatically)
kubectl get pods --all-namespaces
```
NB 
install ingress controller via helm repo
install cert manager
install ArgoCD
install kube-prometheus-stack

## What I Learned
- Infrastructure as code with Terraform
- GitOps patterns and ArgoCD
- Multi-environment Kubernetes management
- CI/CD automation
- Production debugging (HPA tuning, resource optimization)
- Cloud-native best practices

## Timeline
December 2025 - March 2026 (4 months of learning and building)
Built while learning DevOps - from zero to production deployments.
