# Technical Assumptions

## High-level Choices (selected)

- Repository Structure: Polyrepo — frontend, backend, and tooling live in separate repositories to simplify CI/CD boundaries and deployment ownership while using a shared packages registry for reusable components.
- Service Architecture: Serverless — backend functionality implemented as serverless functions (e.g., AWS Lambda / Vercel Serverless Functions) to reduce operations overhead, enable burst scaling for query proxying, and align with the solo-developer constraint.
- Testing Requirements: Unit + Integration — automated unit tests for modules and integration tests for critical flows (SSH connection lifecycle, schema import/parsing, query execution sandbox, LLM fallback). CI runs unit tests on every PR and integration tests on main branch merges or scheduled runs.

## Technology Preferences & Constraints

- Frontend: Next.js (app router) + shadcn/ui for rapid, accessible UI composition. Use TypeScript throughout.
- Auth: Clerk for authentication and basic RBAC primitives (integrate admin/roles for FR7).
- Backend: Node.js serverless functions (TypeScript) for connection proxying, schema parsing, LLM orchestration, and audit/event logging.
- Primary data store: NeonDB (serverless PostgreSQL) for user metadata, saved queries, and audit logs; ephemeral or proxied connections to external user DBs for query execution.
- LLM Provider: Default to OpenAI-compatible API; design provider-agnostic adapter to allow Anthropic or self-hosted LLMs later.
- Secrets & Keys: Use a managed secret store (AWS Secrets Manager / Vercel Environment variables) with UI for connection secrets; support SSH key uploads with client-side encryption where feasible.
- Deployment: Frontend to Vercel; serverless functions and background jobs to AWS/GCP serverless platforms depending on integration needs (e.g., long-running tasks may use Fargate or Cloud Run).

### LLM Budget Defaults & Enforcement (PROPOSED)

- Conservative default budgets (configurable per-org):
	- Per-user: 10,000 tokens/day
	- Per-org: 500,000 tokens/month

- Enforcement behavior:
	- Requests that would exceed the budget are rejected at the adapter layer with a clear UI message and an audit event (action: `llm.request.rejected`, reason: `budget_exceeded`).
	- Fallback: when budgets are exhausted, the UI shows deterministic/manual tips and disables the "Generate" action; admins can set soft thresholds to warn users before hard rejects.

- Telemetry: token usage is recorded per-request and attributed to user + org; token-usage metrics are available in the LLM Usage dashboard and trigger alerts when thresholds are hit.

Rationale: conservative defaults give a safe starting point for cost control and can be revised after the canary and initial telemetry.

## Developer & Testing Notes

- Local development: Provide a lightweight dev stack with mocked DB connectors and an offline-schema fixture for testing the visual builder without live connections.
- Integration testing: Include test harness that can run headless browser tests for Query Builder flows and an SSH simulator to validate connection lifecycle and schema discovery.
- Monitoring & Observability: Integrate basic logging and metrics (Prometheus/CloudWatch + Sentry) with dashboards for the UI metrics defined earlier.

## Constraints, Trade-offs & Rationale

- Polyrepo reduces cognitive overhead for independent services and fits teams that will later expand ownership; it increases cross-repo coordination for shared packages (resolve via an internal package registry).
- Serverless simplifies operations and lowers infra costs for MVP, but imposes execution-time limits and cold-start trade-offs; long-running or heavy queries may require a hybrid approach (background workers) in later phases.
- Unit + Integration testing balances speed of feedback with validation coverage required for security-critical flows like SSH and LLM interactions.

## Technical Acceptance Criteria

- CI Pipeline: Runs unit tests on all PRs and scheduled integration tests against staging; PRs must pass unit tests before merge.
- SSH Integration: Integration test covers connection setup, schema discovery, and a sample read-only query against a simulated DB.
- Secrets Management: Secrets are never stored in plaintext in repos; connection secrets are stored encrypted in the secret manager; rotation instructions documented.
- LLM Adapter: LLM calls go through a single adapter layer with configurable provider, rate limiting, and budget controls.
