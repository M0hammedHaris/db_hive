# Repository README Template

Use this template for new repositories (copy into `README.md` in each repo). Edit sections to match repo specifics.

Project: DB Hive — {{repo-name}}

Overview

- Purpose: Short description of the repo's role (frontend | backend | infra).

Getting started (local)

1. Clone the repository:
   - `git clone git@github.com:your-org/{{repo-name}}.git`
2. Install dependencies:
   - npm ci
3. Run in development mode:
   - Frontend: `npm run dev` (Next.js)
   - Backend (serverless): `npm run dev` or `npm run start:dev`

Running tests

- Unit tests: `npm test` (place unit tests under `tests/unit/`)
- E2E tests (Playwright): `npx playwright test` (playwright tests under `tests/e2e/`)

CI expectations

- CI workflow: `.github/workflows/canary.yml` should run on PRs and on pushes to `canary`.
- CI jobs: install-and-test, build, deploy:frontend-canary, deploy:backend-canary, canary:health-check.
- Secrets required in CI: `VERCEL_TOKEN`, `CI_DEPLOY_KEY`, `NEON_DB_URL`, `LOGGING_DSN`.

Deployment (Canary)

- To deploy a canary build, merge into `canary` branch or push a tag configured for canary.
- CI will deploy to the canary route and run health checks. See `docs/DEPLOY.md` for runbook.

Health-check contract

- CI will validate `/health` endpoint returns HTTP 200 and JSON `{ status: "ok", services: { db: "ok" } }`.

Contribution

- See `CONTRIBUTING.md` for commit message conventions and PR requirements.
