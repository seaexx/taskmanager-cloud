#!/bin/bash
# update-ingress-patch-ips

NEW_IP=$(kubectl get svc -n ingress-nginx ingress-nginx-controller \
  -o jsonpath='{.status.loadBalancer.ingress[0].ip}')

if [ -z "$NEW_IP" ]; then
  echo "❌ Could not fetch IP. Is ingress-nginx running?"
  exit 1
fi

OLD_IP=$(grep -r "nip.io" k8s/overlays/prod/ingress-patch.yaml | grep -oE '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' | head -1)

if [ -z "$OLD_IP" ]; then
  echo "❌ Could not detect old IP from manifests"
  exit 1
fi

echo "Replacing $OLD_IP → $NEW_IP"
find . -type f \( -name "*.yaml" -o -name "*.yml" \) -exec sed -i '' "s/$OLD_IP/$NEW_IP/g" {} +
echo "✅ Done. Review with: git diff"
