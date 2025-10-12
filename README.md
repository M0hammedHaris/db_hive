# DB Hive — Repository (root)

This repository contains the DB Hive project artifacts. Copy or adapt `docs/templates/repo-README-template.md` for each service repository (frontend/backend/infra) when creating new repositories.

Overview

- Top-level layout (recommended):
  - `infra/` — IaC and deployment scripts
  - `frontend/` — Next.js application
  - `backend/` — Serverless functions (query proxy, parsers)
  - `tests/` — Integration and E2E fixtures
  - `docs/` — Architecture, runbooks, and story artifacts

Local development

- See `docs/DEVELOPER-SETUP.md` for environment setup and local mocks (if present).

Deployment & CI

- CI workflow: `.github/workflows/canary.yml` — runs unit tests, builds artifacts, deploys canary, and performs health checks. See `docs/DEPLOY.md` for canary runbook.

Contact

- Maintainers: [list of maintainers or teams]
