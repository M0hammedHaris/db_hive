# Deploy & Canary Runbook (Example)

This document provides example steps for deploying canary builds and promoting/rolling back releases. Copy relevant sections into repo-specific `docs/DEPLOY.md` or root `DEPLOY.md` in each new repository.

Prerequisites

- CI credentials configured as secrets: `VERCEL_TOKEN`, `CI_DEPLOY_KEY`, `NEON_DB_URL`, `LOGGING_DSN`.
- CI runner with appropriate permissions to deploy to Vercel or the chosen serverless provider.

Canary deployment steps (example)

1. Merge feature branch into `canary` branch or open a PR targeting `canary`.
2. CI workflow runs: install, unit tests, build, deploy frontend canary, deploy backend canary, canary health check.
3. CI health check hits `$CANARY_URL/health` and asserts `status == "ok"` and `services.db == "ok"`.
4. If health check passes, CI marks canary as successful and notifies release owner; optionally create a promotion PR to `main`.
5. If health check fails, CI fails the workflow and alerts the on-call engineer.

Rollback & Promotion

- Automatic rollback: optional CI job that redeploys last stable artifact on failure. Use with caution; require approvals if DB migrations or breaking infra changes are involved.
- Manual rollback: release owner follows these steps:
  - Identify last stable artifact (tag or commit).
  - Redeploy stable artifact to canary/staging.
  - Run health checks and smoke tests.
  - If stable, create a promotion PR for `main` or coordinate production rollbacks.

Contact & Roles

- Release Owner: [name] — responsible for promotions and rollbacks
- On-call: [name/team] — receives CI alerts for canary failures

Copy this file into each repo's `docs/DEPLOY.md` and update the provider-specific details.
