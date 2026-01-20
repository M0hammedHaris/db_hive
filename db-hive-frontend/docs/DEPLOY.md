# Frontend DEPLOY Runbook

This is a minimal canary deploy runbook for the frontend.

Prerequisites

- `VERCEL_TOKEN` set in GitHub Actions secrets

## Steps

1. Push changes to `canary` branch
2. CI runs tests and builds
3. CI deploys to Vercel canary route
4. CI runs `CI_HEALTH_CHECK_URL` assertion and blocks promotion on failure

Rollback

- Toggle feature flag or revert the canary deployment via Vercel dashboard
