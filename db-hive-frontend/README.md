# db-hive-frontend

Minimal frontend repository skeleton for the DB Hive project.

Layout (minimal):

- frontend/
- backend/
- infra/
- tests/
- docs/


## Purpose

This repository is a lightweight scaffold for the frontend (Next.js) portion of DB Hive. It exists to provide a reproducible directory layout and developer onboarding information for the frontend team.


## Local validation

To validate that the repository skeleton exists (workspace-level script):

  node scripts/validate-skeletons.js

## Contribution & deploy notes

- Add local development instructions here when the frontend implementation is created.
- CI expectations: unit tests should run on PRs and the canary workflow should deploy to Vercel when pushing to `canary`.

## How to run tests locally

If this repository contains frontend code (Next.js), run:

```bash
npm install
npm test
```

## CI expectations

- Pull requests must run unit tests and linters.
- Pushes to `canary` should run tests, build artifacts, and deploy to a canary route in Vercel.

## Deploying a canary (frontend)

This project uses Vercel for frontend canary deployments. Configure the Vercel project and set `VERCEL_TOKEN` in GitHub Actions secrets. The CI workflow will build and deploy to the canary route when pushed to `canary`.

## Running the staging health-check locally


If you need to run the health-check against a staging endpoint, set `CI_HEALTH_CHECK_URL` to the staging health endpoint and run:

```bash
curl -sSf "$CI_HEALTH_CHECK_URL" | jq -e '.status == "ok" and .services.db == "ok"'
```

