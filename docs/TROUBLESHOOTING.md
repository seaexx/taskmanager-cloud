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
