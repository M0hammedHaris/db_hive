# db-hive-backend

Minimal backend repository skeleton for the DB Hive project.

Layout (minimal):

- infra/
- frontend/
- backend/
- tests/
- docs/

## Purpose

This repository is a lightweight scaffold for the backend (serverless) portion of DB Hive. It is intentionally minimal and intended to hold serverless functions, parsers and integration utilities.

## Local validation

To validate that the repository skeleton exists (workspace-level script):

  node scripts/validate-skeletons.js

## Contribution & deploy notes

This repository contains the backend serverless functions and service code for DB Hive.

How to run tests locally

- Install dependencies (if a package.json is present):

```bash
npm install
npm test
```

- To run the health endpoint unit test directly (no test runner required):

```bash
node ./tests/unit/health.test.js
```

CI expectations

- Pull requests should run unit tests and linters.
- Pushes to the `canary` branch should run tests, build artifacts, deploy backend serverless functions to a canary stage, and run the canary health-check.

Deploying a canary (backend)

- The canary deploys are performed by CI using a deploy key or token stored in the `CI_DEPLOY_KEY` secret.
- When pushing to `canary` the CI workflow will attempt to deploy serverless functions to a canary stage; this is currently a placeholder in the scaffold and should be wired to your chosen provider (Vercel serverless / AWS Lambda / Serverless Framework).

Running the staging health-check locally

If you need to run the health-check against a staging endpoint, set `CI_HEALTH_CHECK_URL` to the staging health endpoint and run:

```bash
export CI_HEALTH_CHECK_URL="https://staging.example.com/health"
curl -sSf "$CI_HEALTH_CHECK_URL" | jq -e '.status == "ok" and .services.db == "ok"'
```

Contact

- Maintainers: backend team (add names/emails)
