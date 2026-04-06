# TaskManager Cloud
A full-stack task management application built specifically as a practical learning vehicle for DevOps engineering and cloud-native deployment. A production Kubernetes deployment demonstrating Infrastructure as Code, GitOps, and automated CI/CD workflows.

# What It Is
A complete web application with:
Frontend: React-based UI for managing tasks
Backend: Node.js/Express API
Database: PostgreSQL for persistent storage
Architecture: Three-tier containerized application

It's deliberately simple as an application but complex as an infrastructure challenge:
The app itself is intentionally basic (CRUD operations on tasks) because the goal isn't to learn React or Node — it's to learn how to deploy, scale, monitor, and maintain applications in production-like environments.

# What makes it perfect for DevOps learning:
- Real multi-service architecture — not just a single container, but frontend + backend + database with actual networking between them
- Stateful components — PostgreSQL requires persistent volumes, backups, migrations
- Environment complexity — managing dev/staging/prod configurations
- Real infrastructure decisions — load balancing, ingress, TLS certificates, resource limits
- Actual problems to solve — not tutorial problems, but real issues like ARM/AMD64 architecture mismatches, storage provisioning, memory constraints

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
