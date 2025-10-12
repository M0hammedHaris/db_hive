<!-- DB Hive developer quickstart and pinned toolchain -->

# DB Hive — Developer Setup & Quickstart

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-12 | v0.1 | Initial developer quickstart and pinned toolchain | GitHub Copilot |
| 2025-10-12 | v0.2 | Update pinned toolchain to latest stable versions per MCP (Node 22.17.0, Next.js 15.1.8, TypeScript 5.9.2, TanStack Query v5.84.1, Zod v4.0.1, Vitest v3.2.4, Storybook v9.0.15, shadcn/ui@0.9.0, OpenAI SDK v6.1.0) | GitHub Copilot |
| 2025-10-12 | v0.3 | Add Neon quickstart, verification commands, and CI/test guidance (Neon-first, no Docker) | GitHub Copilot |
| 2025-10-12 | v0.4 | Pin pnpm and Zustand (confirmed via upstream docs); add verification commands for remaining packages | GitHub Copilot |
| 2025-10-12 | v0.5 | Pin Tailwind, Playwright, React Hook Form, and Clerk SDKs (web-verified) | GitHub Copilot |

## Purpose

Provide a minimal, repeatable developer onboarding checklist and commands to run DB Hive locally for development, testing and canary validation. This document lists pinned tool versions, local prerequisites, environment variables, recommended workflows and troubleshooting tips.

## Pinned toolchain (recommended)

- Node: 22.17.0 (use an `.nvmrc` to pin this exact version).
- Package manager: pnpm 10.x (pin via Corepack: `corepack use pnpm@latest-10` for project-level reproducibility).
- Frontend: Next.js 15.1.8 (App Router).
- Language: TypeScript 5.9.2.
- Styling: Tailwind CSS 4.1.14.
- Server-state: TanStack Query v5.84.1.
- Local-state: Zustand v5.0.8 (confirmed upstream; pin exact version in `package.json`).
- Forms: React Hook Form 7.65.0 + zod 4.0.1.
- Unit tests: Vitest v3.2.4.
- E2E tests: Playwright (`@playwright/test`) 1.56.0.
- UI primitives: shadcn/ui @0.9.0 (optional but recommended).
- Auth: Clerk — `@clerk/nextjs` 6.33.3 (Next.js); `@clerk/clerk-react` 5.51.0 (React); `@clerk/clerk-js` 5.99.0 (browser). For Node backend integration prefer `@clerk/express` for Express-based apps — note `@clerk/clerk-sdk-node` (v5.1.6) is deprecated.
- Storybook: v9.0.15 (optional, component-driven development).
- LLM SDK: OpenAI Node SDK v6.1.0 (or provider adapter of choice).

Notes:

- Pin exact versions in `package.json` and lockfiles (`pnpm-lock.yaml` / `package-lock.json`) to avoid CI/dev drift.
- Keep `.nvmrc` updated to the Node version used across the team and CI: `22.17.0`.

## Prerequisites (macOS / zsh)

- git
- nvm (or any Node version manager) or use `corepack` for pnpm
- pnpm (or npm/yarn)
- (No Docker required — Neon-first development is preferred)
- VS Code (recommended) + ESLint, Prettier, Tailwind CSS IntelliSense extensions

## Quickstart — clone, install, run

1. Clone the repo and checkout the working branch:

```bash
git clone git@github.com:M0hammedHaris/db_hive.git
cd db_hive
git checkout release/prd-v0.2
```

1. Set Node version and enable pnpm (examples):

```bash
# ensure Node 22.17.0 is installed and active (reads .nvmrc)
nvm install 22.17.0
nvm use 22.17.0
corepack enable
# prepare a pnpm version for the repo (use a specific version if desired)
corepack prepare pnpm@latest --activate
```

1. Install dependencies (root workspace):

```bash
pnpm install
```

1. Create local environment file from template and populate secrets (see `.env.example`):

```bash
cp .env.example .env.local
# edit .env.local with local values (DB URL, Clerk keys, LLM keys)
```

1. Start local services required for development

Option A — Neon (recommended): point your local env to a Neon dev or staging project. No Docker is required for local development — use a Neon test project or shared staging Neon instance for integration tests.

Option B — External DBs & simulators: if you need to validate SSH connections or external database discovery, use the project's integration simulator harness (non-containerized) or a remote test endpoint. Avoid Docker for local developer onboarding to reduce friction.


1. Start backend & frontend (project layout may vary):

```bash
# Backend (serverless functions / API)
cd backend
pnpm dev

# Frontend (Next.js)
cd ../frontend
pnpm dev
```

If repository uses a monorepo/workspace, the commands will be similar to `pnpm --filter backend dev` and `pnpm --filter frontend dev`.

## Neon DB — Development & Testing (no Docker required)

NeonDB is the primary data store for DB Hive. For local development and integration testing prefer connecting to a Neon project (dev or staging). This removes the need to run local Postgres containers — no Docker required.

Obtain the Neon connection string from the Neon console and add it to your local environment file:

```dotenv
NEON_DATABASE_URL=postgresql://<user>:<password>@<host>:5432/<db>?sslmode=require
```

### Neon quickstart (minimal)

1. Sign up / create a Neon project

- Sign up for a Neon account and create a new dev/test project in the Neon Console. See the Neon docs for details: [Neon Console](https://console.neon.tech) and [Neon Docs](https://neon.com/docs).

1. Create an isolated test database or branch

- Use Neon branching or a dedicated test project to isolate CI/test runs from production data.

1. Copy the connection string

- From the Neon Console, open the project's connection settings and copy the connection string for Postgres/pg. Add it to `.env.local` as `NEON_DATABASE_URL`.

1. Verify connectivity (psql)

- Quick verification using the psql client:

```bash
# verify a basic connection and simple query
psql "$NEON_DATABASE_URL" -c "SELECT 1;"
```

1. Seed the test database (integration tests)

- Seed deterministic fixtures in CI or locally for integration tests using psql:

```bash
psql "$NEON_DATABASE_URL" -f tests/fixtures/seed.sql
```

1. Optional: Neon CLI & branching

- Neon provides a CLI for managing projects and branches — see the Neon CLI docs: [Neon CLI docs](https://neon.com/docs/reference/neon-cli). Use the CLI for scripted test setup and teardown in CI where appropriate.

### Node example (pg)

- Minimal Node snippet (use `pg` or your chosen Postgres/ORM client):

```js
import { Client } from 'pg'

const client = new Client({ connectionString: process.env.NEON_DATABASE_URL })
await client.connect()
const res = await client.query('SELECT 1')
console.log(res.rows)
await client.end()
```

Notes:

- If you encounter TLS/SSL issues in local development, consult the Neon Console connection docs for driver-specific SSL settings. Avoid disabling certificate verification in CI/production.
- For CI: create a dedicated Neon test project (or branch) and store `NEON_DATABASE_URL` as a secret in your CI provider. Prefer ephemeral branches/databases when running parallel integration suites.

## Environment variables (example)

Add required variables to `.env.local` (this file should NOT be committed). Add only test/dev credentials here.

```dotenv
# Backend
# Primary DB (Neon): set NEON_DATABASE_URL to your Neon project's connection string.
# Optionally set DATABASE_URL to the same value for libraries/tools that expect DATABASE_URL.
NEON_DATABASE_URL=postgresql://<user>:<password>@<host>:5432/<db>?sslmode=require
DATABASE_URL=postgresql://<user>:<password>@<host>:5432/<db>?sslmode=require  # optional alias to NEON_DATABASE_URL
SECRET_KEY_BASE=changeme

# Frontend
NEXT_PUBLIC_API_BASE=http://localhost:3001

# Auth (Clerk)
CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# LLM
LLM_PROVIDER=openai
LLM_API_KEY=sk-xxxxx
LLM_BUDGET_LIMIT=100

# Observability
SENTRY_DSN=

# Local dev toggles
DEV_SSH_SIMULATOR_HOST=localhost
DEV_SSH_SIMULATOR_PORT=2222
DEV_SSH_SIMULATOR_USER=sim
DEV_SSH_SIMULATOR_KEY_PATH=~/.ssh/id_rsa_sim
```

## Running tests

- Unit tests (Vitest):

```bash
pnpm test:unit
```

- Integration tests (Neon-backed):

Integration tests should point to a Neon test database via `NEON_DATABASE_URL`. If your tests need to validate external SSH discovery flows, run the project's integration simulator harness in CI (no Docker required).

```bash
NEON_DATABASE_URL="$NEON_DATABASE_URL" pnpm test:integration
```

- Playwright E2E tests (install browsers first):

```bash
npx playwright install
pnpm test:e2e
```

If your project uses workspace filters, use `pnpm --filter <package> test`.

## Developer scripts to add (recommended)

- `dev:frontend` — Start Next.js dev server (port configurable).
- `dev:backend` — Start serverless backend in local emulation (vercel dev or serverless-offline).
- `start:ssh-sim` — (optional) Start the project's SSH simulator harness (e.g. `node tests/ssh-simulator/start.js`) for integration tests that simulate external DBs. Avoid Docker in local dev.
- `test:unit`, `test:integration`, `test:e2e` — standard test runners.

Add these scripts to `package.json` and to CI for parity between local and CI jobs.

## VS Code & editor recommendations

- Extensions: ESLint, Prettier, Tailwind CSS IntelliSense, GitLens, Playwright Test for VS Code.
- Settings: enable `editor.formatOnSave` (Prettier), enable `eslint.validate` for TS/JS.

## Troubleshooting

- Node version mismatch: run `nvm use` or install the version in `.nvmrc`.
- Missing env vars: check `.env.local` for required keys and confirm CI secret names match.
- Playwright failures: run `npx playwright test --debug` to view failed flows.
- SSH simulator issues: confirm port mapping (default `2222`) and that the simulator user/credentials match `.env.local`.

## Security notes for local dev

- Never commit real secrets to the repository. Use `.env.local` for local dev and secrets manager in staging/prod.
- When testing SSH key flows, consider client-side encryption of the private key in tests to mimic production behavior and avoid plaintext storage.

## Where to update docs

- `docs/prd.md`, `docs/architecture.md`, `docs/frontend-architecture.md` — update when architectural or acceptance criteria change.

## Verify pinned/desired versions (quick checks)

Run these locally to confirm exact package versions before committing pins. If you paste results I will update the doc with exact minor/patch pins.

```bash
# Node runtime
node -v

# pnpm CLI (after corepack use) — confirms pnpm 10.x
pnpm -v

# Check latest published package version via npm/pnpm
npm view tailwindcss version
npm view @playwright/test version
npm view react-hook-form version
npm view zustand version
npm view next version
npm view typescript version

# Clerk packages
npm view @clerk/nextjs version
npm view @clerk/clerk-react version
npm view @clerk/clerk-js version

# Playwright runtime check
npx playwright --version
```

Notes: Where upstream docs provided a clear stable major (e.g., pnpm 10.x and zustand v5.0.8), I pinned above. For Clerk, I pinned the client/Next.js packages appropriate to the frontend stack. For backend server SDKs, consult Clerk docs (some Node SDKs have deprecation notices; prefer `@clerk/express` for Express apps).

---
