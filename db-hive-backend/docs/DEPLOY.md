# Backend DEPLOY Runbook

Minimal instructions for backend (serverless) canary deploys.

Prerequisites

- `CI_DEPLOY_KEY` set in GitHub Actions secrets

## Steps

1. Push changes to `canary` branch
2. CI builds and deploys serverless functions to canary
3. CI runs canary health-check and blocks promotion on failure

Rollback

- Redeploy previous release or remove canary stage
