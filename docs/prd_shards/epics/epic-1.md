# Epic 1: Foundation & Canary — Stories and Acceptance Criteria

The following stories are sequential, vertical slices that together deliver an end-to-end canary: connect → build → run → export. Each story is small enough to be completed independently and includes clear acceptance criteria and an estimate for planning.

- Story 1.1: Repository & CI/CD Scaffold
	- Description: Create polyrepo skeleton (frontend, backend, infra tooling), configure CI to run unit tests and deploy a canary branch to staging (Vercel for frontend, serverless functions for backend).
	- Acceptance Criteria:
		- Repos created with README and minimal directory layout.
		- CI pipeline runs unit tests and deploys a canary build on merge to `canary` branch.
		- A public staging health endpoint returns 200 and a JSON status payload.
		- Basic contribution & deploy instructions documented in README.
	- Estimate: 1.5 days

- Story 1.2: Authentication & User Model (Clerk)
	- Description: Integrate Clerk for authentication, implement signup/login flows and a simple user model in NeonDB to store user metadata and roles.
	- Acceptance Criteria:
		- Users can sign up and sign in via Clerk.
		- A minimal user record is created in NeonDB (user id, email, role default = Viewer).
		- Role field exists and can be updated via DB or admin UI (future).
		- Unit tests for auth integration exist and pass.
	- Estimate: 0.5–1 day

- Story 1.3: Canary Deployment & Health Check
	- Description: Deploy a lightweight canary route and serverless health-check function; validate deploy pipeline and observable logs.
	- Acceptance Criteria:
		- Canary route deployed and accessible on staging.
		- Health-check function returns service metadata and basic infra checks (db reachable, env OK).
		- Logs are visible in centralized logging (CloudWatch / Vercel logs) for the canary invocation.
	- Estimate: 0.5 day

- Story 1.4: Minimal Connection Manager (Simulator-backed)
	- Description: Implement a minimal Connection Manager UI that lets users add a connection (name, host, port, auth type), upload an SSH key (stored encrypted), and run a "Test Connection" action against a local SSH simulator that returns a sample schema.
	- Acceptance Criteria:
		- User can create a connection entry in the UI and save it.
		- SSH key upload is accepted; secrets are never stored in plaintext.
		- "Test Connection" returns a parsed schema preview from the simulator within 10s and surfaces errors clearly.
		- Integration test validates the Test Connection flow using an SSH simulator.
	- Security note: All simulator data is synthetic; production connectors will use proxied connections.
	- Estimate: 1–2 days

- Story 1.5: Minimal Visual Query Canvas (Single-table)
	- Description: Implement a simple visual query canvas allowing selection of a table and columns, simple filters, and a "Run" action that calls a backend serverless function (simulated execution) and returns results.
	- Acceptance Criteria:
		- User can select a table and columns from the schema explorer and run the query.
		- Backend returns simulated rows and UI displays them in the Results View.
		- The canvas supports switching to a raw SQL preview that shows the generated SQL for the current visual state.
		- Integration test covers full UI → backend → results flow using simulated DB.
	- Estimate: 1–2 days

- Story 1.6: Results View & Export
	- Description: Build the Results View for the canary with a table, basic inline charting for numeric columns, and a CSV export button.
	- Acceptance Criteria:
		- Results table renders returned rows and supports pagination for the canary dataset.
		- CSV export downloads the visible result set; export action requires no more than two user clicks.
		- Inline charting toggles for numeric columns and renders a basic bar/line chart.
		- Unit/integration tests verify export functionality and correct CSV format.
	- Estimate: 0.5–1 day

- Story 1.7: End-to-End Canary Test & Telemetry
	- Description: Implement lightweight telemetry hooks for first-query success and onboarding completion; define and emit events during the canary flow to validate assumptions.
	- Acceptance Criteria:
		- Events emitted: onboarding.start, connection.test.succeeded, first_query.success, first_query.failure.
		- Staging dashboard (or logs) shows first-query success events within 24 hours of test runs.
		- A simple automated end-to-end integration test asserts the entire canary path (create connection → test → create query → run → export) succeeds in staging.
	- Estimate: 0.5 day

### Definition of Done (for Epic 1)

- All above stories implemented and merged to `canary` branch.
- Automated integration test covering the canary path passes on main/staging.
- README includes how to run the canary locally and how to reproduce the simulated flows.
- Basic telemetry visible for the canary metrics defined in the PRD.

## Story 1.8 (Spike): Long-running Query Strategy & Secrets Handling

- Description: Run a 2–3 day architecture spike to evaluate serverless function limits, background worker options (Fargate/Cloud Run), secrets store options (AWS Secrets Manager vs Vercel env), and recommend a short design decision with operational trade-offs.
- Acceptance Criteria:
  - Documented recommendation: serverless-only vs hybrid approach, with pros/cons and cost/operational implications.
  - Draft design for secrets handling (client-side key upload flow, server-side storage, rotation procedure).
  - Short runbook for handling long query timeouts and background job patterns.

Estimate: 2–3 days
