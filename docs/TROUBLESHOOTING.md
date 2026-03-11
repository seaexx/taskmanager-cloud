# Troubleshooting Guide

## Postgres Mount Issues

**Error:** `initdb: directory "/var/lib/postgresql/data" exists but is not empty`

**Solution:** Add `subPath: pgdata` to volumeMount:
```yaml
volumeMounts:
- name: postgres-storage
  mountPath: /var/lib/postgresql/data
  subPath: pgdata
```

## ARM/AMD64 Image Issues

**Error:** `exec format error`

**Cause:** Built image on Apple Silicon (ARM64), DigitalOcean uses AMD64

**Solution:** Build for correct platform:
```bash
docker buildx build --platform linux/amd64 -t image:latest .
```
Issue: Frontend couldn't connect to backend - "Error connecting to server"
Root cause: Ingress rewrite annotation stripping /api path before forwarding to backend
What we did:

Verified backend pod running and connected to postgres/redis ✅
Confirmed ingress routing configured: /api → backend, / → frontend ✅
Tested API endpoint - got 404 error
Discovered nginx.ingress.kubernetes.io/rewrite-target: / annotation
This caused /api/health → rewritten to /health → backend 404
Removed rewrite annotation from ingress
Backend now receives full /api/* paths correctly ✅

Fix: Removed nginx.ingress.kubernetes.io/rewrite-target annotation from dev ingress configuration
Result: Full-stack app working - frontend communicating with backend through ingress routing
