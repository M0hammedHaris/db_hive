# DB Hive Product Requirements Document (PRD)

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-07 | v0.1 | Initial PRD draft created from `docs/brief.md` | GitHub Copilot |
| 2025-10-07 | v0.2 | Compiled full PRD draft including epics and Epic 1 stories; added UI, technical, and epic details. | GitHub Copilot |

## Goals

- Enable secure SSH database connections to major DB engines so users can query without exposing credentials.
- Provide a visual query builder (drag-and-drop + basic filters/joins) so non-SQL users can construct queries.
- Support offline schema upload and local query-building for secure, air-gapped workflows.
- Offer basic LLM-assisted query suggestions and error explanations to reduce query errors and speed workflows.
- Visualize query results in interactive tables and charts to support fast data exploration.

## Background Context

DB Hive addresses the common pain of repetitive, error-prone SQL work in enterprise settings by combining an accessible visual query builder, SSH-backed secure connections, and LLM-assisted guidance. Target users are developers and data analysts who need quick, secure access to data without deep SQL expertise; a secondary user segment includes non-technical analysts who require a simpler exploration interface. The MVP focuses on delivering a secure connection mechanism, an approachable visual query editor, offline schema support for sensitive workflows, and basic AI help to reduce errors and accelerate query authoring.

## Requirements

### Functional Requirements

1. FR1: Secure SSH Database Connection — Allow users to establish SSH-tunneled connections to PostgreSQL, MySQL, and other common DBs with credential management.
2. FR2: Visual Query Builder — Provide drag-and-drop query construction with support for filters, joins, and basic aggregations.
3. FR3: Result Visualization — Render query results as interactive tables and charts (bar, line, pie).
4. FR4: Offline Schema Upload — Enable uploading and local use of database schema files for offline query composition and testing.
5. FR5: Basic LLM Assistance — Offer query suggestions, clarification prompts, and basic error explanations when queries fail.
6. FR6: Authentication & User Management — Integrate Clerk for user auth, roles, and session handling.

### Additional Functional Requirements (applied from critique)

- FR7: Role-Based Access Control — Support Admin/Editor/Viewer roles; enforce permissions on data sources, exports, and connection configurations.
- FR8: Query Execution Controls — Timeouts, concurrency limits, pagination/streaming for large results, and cancellation support.
- FR9: Result Export & Sharing — Allow CSV/JSON export and secure, shareable links with expiry.
- FR10: Connection & Secret Management — Secure storage for SSH credentials, support key rotation, connection testing, and session timeouts.
- FR11: Audit Logging — Record connection events, queries executed, and exports for compliance; provide admin access to export logs.
- FR12: Schema Import & Validation — Support SQL dumps and JSON schema formats with validation before enabling offline queries.
- FR13: LLM Safety & Cost Controls — Implement rate limits, per-user/org token or cost budgets, prompt/result audit trail, and graceful degradation to non-LLM flows.
- FR14: Read-Only Sandboxing — Default query execution in read-only mode for external DBs with explicit, audited elevated flows for write operations.

### Non-Functional Requirements

1. NFR1: Performance — Typical query execution for representative datasets should complete under 5 seconds (where possible).
2. NFR2: Security — End-to-end encryption for connections and data isolation in offline mode.
3. NFR3: Browser Support — Support modern browsers (Chrome, Firefox, Safari, Edge) and ES6+ environments.
4. NFR4: Maintainability — Codebase structured to support a monorepo with clear frontend/backend separation.
5. NFR5: Testability — Include unit tests and integration tests for core query and connection flows.

### Non-Functional Requirement Refinements

- NFR1 (refined): Performance — 95th percentile query latency <= 5s for datasets up to 100k rows under standard concurrency (e.g., 5 concurrent users); specify benchmarks for larger loads.
- NFR5 (refined): Testability — Minimum 70% automated test coverage for core modules; include integration tests for SSH connectivity, offline schema handling, and LLM fallback scenarios.

### Acceptance Criteria Examples

- FR1 Acceptance: Connection test succeeds and returns schema preview; saved connections store encrypted secrets; UI indicates live vs offline state.
- FR8 Acceptance: Queries exceeding 10s are canceled with clear error messaging and user option to request extended execution.
- FR11 Acceptance: Audit logs include timestamp, user, connection id, query hash, and action type; admins can export logs filtered by date/user.

## User Interface Design Goals

**Condition:** PRD includes UX/UI requirements — prefilled from project brief and product goals.

### UX Vision

DB Hive's UI will prioritize clarity, safety, and progressive disclosure to make complex query construction approachable for both technical and non-technical users. The interface balances a visual, low-friction query builder with an optional raw SQL view for power users, and surfaces LLM assistance contextually to reduce errors while keeping user control over generated queries.

**Rationale & Assumptions:** Prioritizes discoverability and security over feature-dense design for the MVP. Assumes no existing brand/style guide supplied; visual language will be modern, neutral, and accessible. We assume users are primarily desktop/web users but may occasionally use tablet screens.

### Key Interaction Paradigms

- Drag-and-drop visual query builder with composable blocks for tables, joins, filters, and aggregations.
- Schema Explorer sidebar for browsing tables/columns and dragging fields into the query canvas.
- Contextual LLM assistant panel (suggestions, query hints, error explanations) with explicit "Apply" to accept generated SQL.
- Toggle between Visual Builder and Raw SQL preview (two-way sync when possible).
- Offline Workspace: a local sandbox view for uploaded schemas with clear indicators that no live connections are used.
- Result Exploration: table view with inline charting, pagination/streaming controls, and export actions.

**Rationale & Trade-offs:** Visual builder reduces cognitive load for non-SQL users; the raw SQL view preserves transparency for technical users. LLM assistance is opt-in per query to control cost and trust. Offline workspace requires careful UX to avoid confusion between live and offline states.

### Core Screens

- Authentication / Onboarding: Sign-up, connection setup wizard, and brief interactive tutorial for the visual builder.
- Dashboard: Recent connections, saved queries, and usage metrics.
- Connection Manager: Add/test/manage SSH connections and saved credentials.
- Query Builder (Primary): Visual canvas, schema explorer, LLM assistant panel, SQL preview.
- Offline Workspace / Schema Upload: Upload/manage schema files and test queries locally.
- Results View: Table + chart tabs, pagination/streaming, export controls.
- Settings & Admin: RBAC, audit logs, LLM usage controls, billing/limits.

**Rationale:** Screens are chosen to map directly to MVP features; onboarding and connection management are prioritized to remove setup friction.

### Accessibility

Suggested baseline: WCAG AA compliance for MVP (keyboard navigation, readable contrast, semantic markup, screen-reader-friendly controls).

**Assumptions:** No accessibility audit/report exists yet. If your project requires WCAG AAA or custom accessibility constraints, select that explicitly.

### Branding & Visual Style Notes

No formal brand guide provided in the brief. Recommendation: adopt a clean, neutral design system (shadcn tokens) for MVP to accelerate delivery; capture branding tokens later when provided.

### Target Devices & Platforms

Suggested target: Web Responsive (primary), optimize for desktop workflows; ensure basic tablet compatibility. Mobile-specific UI is out-of-scope for MVP.

**Rationale:** Brief indicates primary users are developers/analysts who use desktop browsers; responsive web ensures broader compatibility without committing to native mobile.

### Where I made assumptions

- Branding and accessibility baseline (WCAG AA) chosen by default; confirm if you require different standards.
- Target platforms set to Web Responsive; confirm if mobile-first or mobile-only is required.

### UI Metrics & Telemetry

- Instrument lightweight telemetry hooks to measure: time-to-first-query, query-success-rate, onboarding-completion-rate, LLM-apply-rate, offline-mode-success-rate, and export/share usage. Record events with minimal PII and provide sampling options for privacy and cost control.
- Dashboard Widgets (MVP): "First Query Success" card, "Onboarding Completion" funnel, and "LLM Usage" summary (applied vs suggested counts, token usage estimate).

### Connection Manager Enhancements

- Add an explicit "Test connection" flow that returns a schema preview and basic connectivity diagnostics (<10s target). Surface clear live vs offline badges across the app and add retry/diagnostics links in the Connection Manager.
- Provide UI for secure connection storage: connection name, host/port, auth method (SSH key or password), rotation instructions, and a one-click "Re-test" action.

### Offline Upload / Preflight UX

- Implement a preflight validation step when users upload schema files: parse the file, show detected tables/columns, highlight parsing errors/warnings, and request confirmation before enabling the offline query canvas.
- Show a clear "Offline Workspace" banner and isolate offline datasets from live connections to prevent accidental data leakage.

### LLM Controls & Usage Dashboard

- Add per-user and per-org LLM consent controls (opt-in per session and per-query toggle) and a settings panel for admins to set token/cost budgets.
- Provide an LLM Usage dashboard with daily/weekly summaries: suggestions generated, suggestions applied, token estimates, and budget consumption with alerts when thresholds are reached.

### Results Export & Share Flow

- Result View: expose CSV/JSON export buttons and a "Create share link" flow that generates secure, expiring links with optional password protection.
- Include pagination/streaming controls and a clear UX for partial-result exports (e.g., "Export first 10k rows" warning and sample options).

### Admin Audit Viewer

- Add an Admin Audit Viewer UI with filters (date range, user, connection id, action type) and an "Export Logs" action (CSV). Surface query hashes (not raw payloads by default) with a drill-down option for authorized admins.

### UX Acceptance Criteria (UI-focused)

- Onboarding: 80% of new users complete connection setup and run their first successful query within 10 minutes.
- Connection Manager: "Test connection" returns a schema preview within 10s for healthy connections.
- Offline Upload: Preflight validation surfaces parsing errors/warnings before enabling queries.
- LLM Assistant: Users must opt-in per-query; admins can set per-org budgets; record an LLM-apply-rate metric.
- Results Export: Users can export CSV/JSON within two clicks from the Results View and create expiring share links.

**Notes & Rationale:** These UI changes directly map to the PRD goals and KPIs and provide concrete, testable acceptance criteria to validate the MVP. They are intentionally lightweight to keep the solo-dev MVP feasible while enabling enterprise needs like auditability and cost control.

## Technical Assumptions

### High-level Choices (selected)

- Repository Structure: Polyrepo — frontend, backend, and tooling live in separate repositories to simplify CI/CD boundaries and deployment ownership while using a shared packages registry for reusable components.
- Service Architecture: Serverless — backend functionality implemented as serverless functions (e.g., AWS Lambda / Vercel Serverless Functions) to reduce operations overhead, enable burst scaling for query proxying, and align with the solo-developer constraint.
- Testing Requirements: Unit + Integration — automated unit tests for modules and integration tests for critical flows (SSH connection lifecycle, schema import/parsing, query execution sandbox, LLM fallback). CI runs unit tests on every PR and integration tests on main branch merges or scheduled runs.

### Technology Preferences & Constraints

- Frontend: Next.js (app router) + shadcn/ui for rapid, accessible UI composition. Use TypeScript throughout.
- Auth: Clerk for authentication and basic RBAC primitives (integrate admin/roles for FR7).
- Backend: Node.js serverless functions (TypeScript) for connection proxying, schema parsing, LLM orchestration, and audit/event logging.
- Primary data store: NeonDB (serverless PostgreSQL) for user metadata, saved queries, and audit logs; ephemeral or proxied connections to external user DBs for query execution.
- LLM Provider: Default to OpenAI-compatible API; design provider-agnostic adapter to allow Anthropic or self-hosted LLMs later.
- Secrets & Keys: Use a managed secret store (AWS Secrets Manager / Vercel Environment variables) with UI for connection secrets; support SSH key uploads with client-side encryption where feasible.
- Deployment: Frontend to Vercel; serverless functions and background jobs to AWS/GCP serverless platforms depending on integration needs (e.g., long-running tasks may use Fargate or Cloud Run).

### Developer & Testing Notes

- Local development: Provide a lightweight dev stack with mocked DB connectors and an offline-schema fixture for testing the visual builder without live connections.
- Integration testing: Include test harness that can run headless browser tests for Query Builder flows and an SSH simulator to validate connection lifecycle and schema discovery.
- Monitoring & Observability: Integrate basic logging and metrics (Prometheus/CloudWatch + Sentry) with dashboards for the UI metrics defined earlier.

### Constraints, Trade-offs & Rationale

- Polyrepo reduces cognitive overhead for independent services and fits teams that will later expand ownership; it increases cross-repo coordination for shared packages (resolve via an internal package registry).
- Serverless simplifies operations and lowers infra costs for MVP, but imposes execution-time limits and cold-start trade-offs; long-running or heavy queries may require a hybrid approach (background workers) in later phases.
- Unit + Integration testing balances speed of feedback with validation coverage required for security-critical flows like SSH and LLM interactions.

### Technical Acceptance Criteria

- CI Pipeline: Runs unit tests on all PRs and scheduled integration tests against staging; PRs must pass unit tests before merge.
- SSH Integration: Integration test covers connection setup, schema discovery, and a sample read-only query against a simulated DB.
- Secrets Management: Secrets are never stored in plaintext in repos; connection secrets are stored encrypted in the secret manager; rotation instructions documented.
- LLM Adapter: LLM calls go through a single adapter layer with configurable provider, rate limiting, and budget controls.

## Epic List (Reordered for Hybrid Canary-first approach)

Epics are ordered to prioritize an early canary Core Query Experience while delivering a minimal security baseline. Each epic remains a sequence of deployable vertical slices.

- Epic 1: Foundation & Canary — Deliver repo scaffolding, CI/CD pipeline, basic deployment (canary route), user authentication (Clerk), and an end-to-end canary flow that stitches a minimal SSH connection, a simple visual query canvas (single-table queries, basic filters), and a results table with CSV export. This epic validates end-to-end infra assumptions and supports quick user feedback.

- Epic 2: Core Query Experience — Complete the Connection Manager (schema preview, secure credential storage, connection tests), implement Offline Schema Upload / Preflight, and expand the Visual Query Builder (joins, aggregations, two-way SQL preview). Ensure the UI shows clear live vs offline states and supports vertical-slice query creation.

- Epic 3: Result Visualization & Export — Build interactive result tables and charts, pagination/streaming controls, export flows (CSV/JSON) and secure share links with expiry. Add result-level UX for charting and inline drilldowns.

- Epic 4: Performance, Monitoring & Polish — Implement telemetry, performance optimizations, observability dashboards (for UI metrics and LLM usage), and accessibility refinements to reach WCAG AA baseline. Address performance bottlenecks surfaced by canary telemetry.

- Epic 5: Admin, RBAC & Auditability — Implement granular RBAC, admin UI for user/org management, audit log viewer/export, and organization-level policies (LLM budgets, connection policies). Ensure audit logs and RBAC controls are in place for enterprise customers.

- Epic 6: LLM Assistance & Governance — Integrate LLM suggestions, provide opt-in per-query flows, build the LLM adapter for provider-agnostic integrations, and implement cost controls, budgets, and prompt/audit trail features.

- Epic 7: Post-MVP Enhancements & Integrations — Add collaboration/share workflows, third-party integrations, mobile improvements, and advanced AI features (natural-language-to-SQL) as future expansion items.

**Notes:** This ordering merges the most impactful user-facing elements earlier while deferring heavier governance and enterprise features until after the canary validates product-market fit. Epic numbering and scope are changeable; if you approve I will now draft sequential, vertical-slice stories for Epic 1.

## Epic 1: Foundation & Canary — Stories and Acceptance Criteria

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

## Epic 2: Core Query Experience — Stories and Acceptance Criteria

These stories complete the Connection Manager, Offline Schema UX, Schema Explorer, and expand the Visual Query Builder to support joins, aggregations, and two-way SQL sync. Each story is a vertical slice with clear acceptance criteria and an estimate.

- Story 2.1: Connection Manager — Full Feature Set
  - Description: Implement the full Connection Manager UI and backend: create/edit/delete connection entries, secure storage of credentials, connection grouping, and connection status indicators.
  - Acceptance Criteria:
    - Users can create, edit, and delete connection entries from the UI.
    - Connection entries support name, host, port, DB type, auth method (SSH key/file or password), and optional tags.
    - Connection list shows live status badges (connected, disconnected, error) with last-tested timestamp.
    - Unit/integration tests cover create/edit/delete and status flows.
  - Estimate: 1–2 days

- Story 2.2: Secure Secrets & Rotation UI
  - Description: Provide secure storage for connection secrets using serverless secret manager integration and UI flows for rotating credentials and re-testing connections.
  - Acceptance Criteria:
    - Secrets are stored using configured secret store (no plaintext in DB or logs).
    - UI exposes a "Rotate" action that allows uploading a new key or updating credentials and re-testing the connection.
    - Audit event emitted for secret rotations (for later use in audit viewer).
    - Integration tests validate secret storage path and rotation workflow using test secret provider.
  - Estimate: 1 day

- Story 2.3: Offline Schema Upload & Parser
  - Description: Implement a schema upload UI, serverless parsing function, and validation feedback. Support SQL dump and JSON schema formats with clear parsing errors.
  - Acceptance Criteria:
    - Users can upload SQL dump (.sql) and JSON schema files via the Offline Workspace.
    - Parsing function returns parsed tables/columns and errors/warnings within an acceptable timeframe (<10s for typical files).
    - UI shows parsed schema preview and blocks enabling the offline canvas until parsing issues are resolved or user confirms acceptance.
    - Integration tests validate parser behavior with valid and invalid schema samples.
  - Estimate: 1–2 days

- Story 2.4: Schema Explorer & Drag-to-Canvas
  - Description: Build the Schema Explorer component to display parsed or live schema and allow dragging tables/columns into the visual canvas to create query building blocks.
  - Acceptance Criteria:
    - Schema Explorer lists tables and columns for the selected connection or uploaded schema.
    - Dragging a table/column onto the canvas creates a block representing that entity and updates the SQL preview accordingly.
    - Search and filtering available in the explorer for large schemas.
    - Integration test covers drag-to-canvas flows for live and offline schemas.
  - Estimate: 1–2 days

- Story 2.5: Visual Query Builder — Joins & Aggregations
  - Description: Extend the visual query canvas to support multi-table joins, aliasing, basic aggregations (COUNT, SUM, AVG), and group-by controls; keep raw SQL preview in sync.
  - Acceptance Criteria:
    - Users can create joins by connecting table blocks and selecting join type (INNER, LEFT, RIGHT).
    - Aggregation controls available on column blocks and reflected in SQL preview.
    - SQL preview updates in near-real-time and users can switch to raw SQL view.
    - Integration tests validate join generation and aggregated query generation.
  - Estimate: 2–3 days

- Story 2.6: Two-way SQL Sync & Edit Flow
  - Description: Implement two-way synchronization between the visual canvas and raw SQL editor: edits in SQL view update the canvas when possible and canvas changes update SQL.
  - Acceptance Criteria:
    - Changing visual elements updates the SQL preview instantly.
    - Edits to SQL are parsed and attempt to update the canvas; unsupported SQL edits are surfaced with a graceful fallback and warning.
    - Users can toggle between views without losing state.
    - Integration test ensures sync works for supported SQL patterns; fallback behavior tested for unsupported edits.
  - Estimate: 1–2 days

- Story 2.7: Query Execution Controls & Safety
  - Description: Add execution controls such as timeouts, row limits, pagination/streaming, and a cancel action; enforce read-only sandbox defaults for external connections.
  - Acceptance Criteria:
    - Users can set a per-query row limit and the UI warns when exporting large datasets.
    - Queries that exceed configured execution time are canceled and surfaced with informative error messages.
    - Cancel action aborts running queries with visual feedback.
    - Default execution mode for external DBs is read-only sandbox; write queries are blocked with clear messaging.
    - Integration tests validate timeout/cancel behavior and enforcement of read-only mode.
  - Estimate: 1–2 days

- Story 2.8: Core Query Experience Integration Test Suite
  - Description: Create an automated integration test suite that runs through the Core Query Experience flows (create connection -> parse schema -> create query with a join -> run -> export) against staged simulators.
  - Acceptance Criteria:
    - Integration suite runs in CI and covers all main flows for Core Query Experience.
    - Failures produce actionable logs and stack traces for debugging.
    - Test data fixtures included for common schema shapes.
  - Estimate: 1 day

### Definition of Done (for Epic 2)

- All Epic 2 stories implemented, merged to `main` (or feature branches merged into `canary` as appropriate), and passing integration tests in CI.
- Documentation updated: Connection Manager usage, Offline Upload instructions, and Canvas quick-start.
- Security review checklist completed for secrets handling and parser behavior.

## Epic 3: Result Visualization & Export — Stories and Acceptance Criteria

These stories focus on delivering interactive result tables, charting, export/share flows, and UX for large datasets. Each story is a vertical slice with acceptance criteria and a planning estimate.

- Story 3.1: Results Table Core Features
  - Description: Implement a performant, accessible results table component that handles sorting, column resizing, basic inline filtering, and client-side pagination for the canary dataset.
  - Acceptance Criteria:
    - Table supports column sort, resize, hide/show, and basic column-level filters.
    - Client-side pagination with page size controls renders pages under 300ms for canary-sized datasets.
    - Table component meets baseline accessibility checks (keyboard nav, ARIA attributes).
    - Unit tests cover table behaviors and edge cases.
  - Estimate: 1–2 days

- Story 3.2: Server-side Pagination & Streaming
  - Description: Implement server-side pagination and streaming APIs for large result sets to avoid loading full datasets into the browser. Provide a progressive loading UX and a "preview first N rows" option.
  - Acceptance Criteria:
    - Backend supports paginated result endpoints and streaming chunked responses.
    - UI progressively renders rows as they arrive and displays a clear indicator for partial results.
    - Export actions allow exporting partial or full result sets (with warnings for large exports).
    - Integration tests simulate large dataset flows and validate streaming behavior.
  - Estimate: 2 days

- Story 3.3: Inline Charting & Visualization Controls
  - Description: Add inline charting support for numeric columns (bar, line, pie), pivoting controls, and quick chart transforms from the results table.
  - Acceptance Criteria:
    - Users can open a chart view for a selected numeric column and select chart type.
    - Basic pivot/grouping UI exists for quick aggregations (e.g., group by column X, visualize SUM of Y).
    - Chart rendering performs acceptably (initial render < 500ms for typical canary results).
    - Unit and integration tests validate chart generation and data mapping.
  - Estimate: 1–2 days

- Story 3.4: Export & Secure Share Flow
  - Description: Implement CSV/JSON export flows with export size warnings, and a secure share link generator that produces expiring, optionally password-protected links for result snapshots.
  - Acceptance Criteria:
    - Users can export visible results as CSV and JSON; exports respect applied filters and pagination choices.
    - Export actions warn when exporting large datasets and allow the user to confirm partial exports.
    - Share link generator creates a time-limited URL, stores snapshot metadata securely, and allows optional password protection.
    - Integration tests validate export formats and share link lifecycle (create, access, expire).
  - Estimate: 1–2 days

- Story 3.5: Saved Views & Report Snapshots
  - Description: Allow users to save result views (selected columns, filters, chart config) and create named snapshots for later retrieval or sharing.
  - Acceptance Criteria:
    - Users can save and name a view; saved views are listed in the Dashboard and can be applied to rehydrate the results view.
    - Snapshots capture the result set (or a sampled snapshot) and chart state; snapshot retrieval is performant.
    - Permission check: only users with access to the original data can view shared snapshots.
    - Unit/integration tests cover save/restore flows and permission enforcement.
  - Estimate: 1 day

- Story 3.6: Accessibility & Data Viz Best Practices
  - Description: Ensure charts and tables meet accessibility guidelines (color contrast, meaningful alt text, keyboard access to chart controls) and add explanatory summaries for charted data.
  - Acceptance Criteria:
    - Charts include accessible labels and keyboard focusable controls.
    - Color palettes meet WCAG AA contrast guidelines by default; provide high-contrast theme option.
    - Each chart includes a short textual summary (1–2 sentences) describing the key takeaway or aggregation shown.
    - Accessibility tests and manual QA checklist documented.
  - Estimate: 0.5–1 day

- Story 3.7: Visualization Performance & Caching
  - Description: Implement client-side rendering optimizations (virtualized lists, memoization) and optional server-side result caching for repeated queries to improve UX for common views.
  - Acceptance Criteria:
    - Table uses virtualization for large result sets to keep memory and render costs low.
    - Server-side caching layer available for repeatable query results with TTL controls; cache hits are measured in telemetry.
    - Performance metrics show improvement over naive rendering (document baseline and target improvements).
    - Integration tests verify caching behavior and cache invalidation heuristics.
  - Estimate: 1–2 days

- Story 3.8: Result Visualization Integration Tests
  - Description: Create an integration test suite covering the visualization and export flows (table behaviors, streaming, charting, export/share lifecycle) using staged simulators and fixtures.
  - Acceptance Criteria:
    - Integration suite runs in CI and validates main visualization flows.
    - Test failures provide actionable diagnostics for frontend and backend troubleshooting.
    - Fixtures include large dataset shapes to validate streaming and export behavior.
  - Estimate: 1 day

### Definition of Done (for Epic 3)

- All Epic 3 stories implemented and passing integration tests in CI.
- Documentation updated: Results View usage, Share/Export guidelines, and visualization best-practices.
- Telemetry added for export usage, share-link clicks, chart interactions, and visualization performance metrics.

## Epic 4: Performance, Monitoring & Polish — Stories and Acceptance Criteria

These stories focus on making DB Hive reliable, observable, performant, and accessible. Each story is a vertical slice that improves user experience, reduces risk, or hardens operations.

- Story 4.1: Telemetry & Metrics Baseline
  - Description: Instrument application-wide telemetry for critical metrics: time-to-first-query, query-latency (p50/p95), onboarding funnel, LLM-apply-rate, export counts, and error rates. Integrate with monitoring backend (CloudWatch/Prometheus) and basic dashboard setup.
  - Acceptance Criteria:
    - Telemetry events emitted for defined metrics with consistent naming and minimal PII.
    - Dashboards created for p95 latency, onboarding funnel, and LLM usage trends.
    - Alerts configured for SLO breaches (e.g., p95 latency > 5s) and high error rates.
    - Unit/integration tests verify telemetry emission for key flows.
  - Estimate: 1 day

- Story 4.2: Performance Profiling & Hotspot Remediation
  - Description: Run profiling on both frontend and backend under representative canary loads to identify hotspots; implement targeted optimizations (SQL generation efficiency, payload size reductions, memoization, virtualization).
  - Acceptance Criteria:
    - Profiling reports produced and prioritized list of 3 top hotspots documented.
    - Implemented optimizations reduce p95 query latency to meet NFR targets for canary workloads.
    - Regression tests ensure no functional regressions from optimizations.
  - Estimate: 1–2 days

- Story 4.3: SLOs, Error Budget & Incident Playbooks
  - Description: Define service-level objectives (SLOs) for availability and latency, set error budgets, and create an incident response playbook and runbook for common failures (e.g., DB connection failures, LLM rate limit hits).
  - Acceptance Criteria:
    - Documented SLOs (e.g., 99% availability, p95 latency <= 5s), error budget policy, and SLA implications.
    - Incident playbooks for at least three common failure modes with runbook steps and escalation paths.
    - On-call rotation guidance and alerting thresholds documented.
  - Estimate: 0.5–1 day

- Story 4.4: Observability & Tracing
  - Description: Add distributed tracing (OpenTelemetry) to key request flows (connection test, query execution, LLM call) and wire traces into observability backend.
  - Acceptance Criteria:
    - Traces captured across frontend, serverless functions, and any background workers for core flows.
    - Traces correlate with telemetry events and are visible in the tracing dashboard.
    - Integration tests validate trace propagation for simulated flows.
  - Estimate: 1 day

- Story 4.5: Load & Stress Testing
  - Description: Create automated load tests that simulate realistic query patterns and concurrency to validate scaling behavior and cold-start impacts for serverless functions. Document capacity limits and suggested scaling strategies.
  - Acceptance Criteria:
    - Load tests simulate target concurrency and measure latency, error rate, and resource consumption.
    - Report produced showing capacity limits and recommended mitigations (e.g., caching, background workers for long queries).
    - CI job or scheduled task runs load smoke tests and fails if critical thresholds exceeded.
  - Estimate: 1–2 days

- Story 4.6: Caching & Query Result Optimization
  - Description: Implement a pragmatic caching layer for repeated queries and result snapshots with configurable TTLs and invalidation policies to reduce backend load and improve response times.
  - Acceptance Criteria:
    - Cache layer implemented for query results with TTL controls and metrics for cache hit/miss.
    - Cache invalidation strategy documented for snapshot and live data scenarios.
    - Integration tests verify cache correctness and TTL behavior.
  - Estimate: 1–2 days

- Story 4.7: Accessibility Polishing & WCAG AA Compliance
  - Description: Complete accessibility work across the app, including keyboard navigation, focus management, color contrast checks, and screen-reader labels; run manual and automated accessibility audits.
  - Acceptance Criteria:
    - App passes core WCAG AA checkpoints for critical screens (Onboarding, Connection Manager, Query Builder, Results View).
    - Accessibility audit report generated and remediation items tracked.
    - Manual QA checklist and automated accessibility tests added to CI.
  - Estimate: 1–2 days

- Story 4.8: Error Handling, Retries & Circuit Breakers
  - Description: Standardize error handling patterns, implement retry/backoff where safe, and add circuit-breaker patterns for downstream dependencies (LLM provider, DB proxy) to protect the system from cascading failures.
  - Acceptance Criteria:
    - Consistent error surface for frontend consumers and user-facing messages for recoverable errors.
    - Retry/backoff policies implemented for transient failures and documented.
    - Circuit breakers in place for third-party calls with telemetry metrics for trips and recoveries.
    - Integration tests validate retry behavior, circuit breaker trips, and safe degradation.
  - Estimate: 1–2 days

### Definition of Done (for Epic 4)

- All Epic 4 stories implemented and passing integration/load tests.
- Dashboards and alerts active for key SLOs and telemetry metrics.
- Accessibility audit passed for critical MVP flows.
- Documentation: Incident playbooks, capacity report, and performance optimization notes committed to repo.

## Epic 5: Admin, RBAC & Auditability — Stories and Acceptance Criteria

These stories establish administrative controls, role-based permissions, audit logging, and compliance-oriented features required for enterprise readiness. Each story is a vertical slice with acceptance criteria and estimates.

- Story 5.1: Admin Authentication & Admin UI Bootstrapping
  - Description: Implement admin access controls and an Admin Dashboard shell with basic org-level settings. Admin sign-in should use Clerk with elevated privileges or admin-only SSO configuration.
  - Acceptance Criteria:
    - Admin users can be flagged via the DB or Clerk claims and can access the Admin Dashboard.
    - Admin Dashboard shows organization summary: active users, recent connections, and recent audit events.
    - Unit tests cover admin-only routes and role gating.
  - Estimate: 0.5–1 day

- Story 5.2: RBAC Model & Enforcement
  - Description: Design and implement RBAC primitives (roles, permissions, resource scoping) and enforce them across UI and API layers (e.g., connection management, export actions, saved views).
  - Acceptance Criteria:
    - Role model supports Admin, Editor, Viewer, and custom roles at org level.
    - Permissions checked server-side for all sensitive actions; UI hides or disables unauthorized actions.
    - Integration tests verify permission enforcement for major actions (create connection, export, create snapshot, view audit logs).
  - Estimate: 1–2 days

- Story 5.3: Organization & User Management
  - Description: Provide UI and backend flows for creating organizations, inviting users, assigning roles, and managing organization-level settings (LLM budgets, retention policies).
  - Acceptance Criteria:
    - Admins can invite users to an org, assign roles, and revoke access.
    - Organization settings page allows setting default LLM budgets and default retention periods for audit logs.
    - Email invite flow integrated with Clerk or invite tokens; integration tests for invite acceptance.
  - Estimate: 1–2 days

- Story 5.4: Audit Logging Backend & Schema
  - Description: Implement robust audit logging for security-relevant events (connection creation, test, query execution metadata, exports, secret rotations, role changes) with configurable retention.
  - Acceptance Criteria:
    - Audit events persisted with fields: timestamp, user id, org id, action type, resource id, metadata (query hash, connection id), and actor IP where available.
    - Retention policy configurable per org and enforced by a retention job.
    - Unit/integration tests validate event writing and retention behavior.
  - Estimate: 1–2 days

- Story 5.5: Admin Audit Viewer & Export
  - Description: Build the Admin Audit Viewer UI allowing filtered views (by date, user, action type, connection id) and CSV export of audit slices for compliance reviews.
  - Acceptance Criteria:
    - Admins can filter and page through audit events using multiple filters and time ranges.
    - CSV export of filtered audit slices produces a standard format including key metadata and is gated to admin users only.
    - Export actions are throttled and logged as audit events themselves.
  - Estimate: 1–2 days

- Story 5.6: Permission Checks for Saved Views & Snapshots
  - Description: Ensure that saved views, snapshots, and shared links are subject to RBAC checks and adhere to org-level policies (e.g., cannot share across orgs if forbidden).
  - Acceptance Criteria:
    - Saved views inherit visibility and permission scopes; editors can modify, viewers can view only, admins can manage access.
    - Share links validate viewer permissions; expired links are rejected cleanly.
    - Integration tests validate enforcement for cross-org and within-org sharing scenarios.
  - Estimate: 0.5–1 day

- Story 5.7: LLM Budgets & Organization Policy UI
  - Description: Provide UI components and backend enforcement for per-org LLM budgets, usage thresholds, and policy controls (e.g., opt-in required, maximum tokens per query).
  - Acceptance Criteria:
    - Admins can set org-level LLM budgets and thresholds; UI shows current consumption.
    - When budgets are exceeded, LLM suggestions are disabled and appropriate audit events emitted.
    - Telemetry captures token usage with attribution to user and org for billing purposes.
    - Integration tests cover budget enforcement and alerts.
  - Estimate: 1–2 days

- Story 5.8: Compliance & Retention Controls
  - Description: Implement retention policy enforcement for audit logs and snapshots, and provide export flows for compliance (e-discovery) with appropriate access controls and logging.
  - Acceptance Criteria:
    - Admins can configure retention windows for audit logs and snapshots per org.
    - Retention job enforces deletions and records retention-compliance events in the audit log.
    - Compliance export flow produces time-boxed exports and requires admin approval if sensitive.
    - Integration tests validate retention enforcement and export correctness.
  - Estimate: 1–2 days

### Definition of Done (for Epic 5)

- All Epic 5 stories implemented, merged, and passing integration tests.
- Admin Dashboard and Audit Viewer documented and accessible to authorized admins.
- RBAC model documented and covered by automated tests across core actions.
- Retention and compliance behaviors validated via tests and documented runbooks.

## Epic 6: LLM Assistance & Governance — Stories and Acceptance Criteria

These stories focus on integrating LLM assistance into the Query Builder while enforcing governance, cost controls, safety, and auditability. Each story is a vertical slice with acceptance criteria and estimates.

- Story 6.1: LLM Adapter & Provider Abstraction
  - Description: Implement an LLM adapter layer that abstracts provider specifics (OpenAI, Anthropic, or self-hosted) and centralizes rate limiting, retry/backoff, and error handling.
  - Acceptance Criteria:
    - Adapter provides a uniform API for generating suggestions, explanations, and SQL transformations.
    - Provider configuration supports multiple provider backends and a fallback mechanism.
    - Rate limiting applied at adapter level with metrics emitted for throttling events.
    - Integration tests mock providers and validate adapter behavior under normal and error conditions.
  - Estimate: 1–2 days

- Story 6.2: Opt-in UX & Per-Query Consent
  - Description: Implement UI flows requiring explicit per-query opt-in for LLM suggestions and a session-level consent toggle; include inline indicators when LLM was used to generate or modify SQL.
  - Acceptance Criteria:
    - Users must opt-in per-query (or session) before an LLM suggestion is generated.
    - UI badges indicate LLM-sourced SQL, and users can inspect the prompt used and accept/reject the suggestion.
    - Consent changes and LLM usage generate audit events tied to user/org.
    - Unit/integration tests cover consent flows and UI indication behaviors.
  - Estimate: 0.5–1 day

- Story 6.3: Prompt Engineering Templates & Safe-SQL Generation
  - Description: Create curated prompt templates optimized for reliable SQL generation and include prompt constraints to avoid destructive or unsafe operations; implement prompt parameterization for context (schema, user role, budgets).
  - Acceptance Criteria:
    - Prompt templates stored and versioned; templates include safety constraints (e.g., translate to read-only SQL only).
    - Generated SQL is validated against safety rules before being presented to the user.
    - Integration tests validate template rendering and safety validation for sample prompts.
  - Estimate: 1 day

- Story 6.4: LLM Cost Controls & Budget Enforcement
  - Description: Implement per-user and per-org token/cost budgets, real-time budget checks before generating suggestions, and fallback to non-LLM flows when budgets are exceeded.
  - Acceptance Criteria:
    - Admins can set budgets and thresholds; UI shows current consumption.
    - Adapter enforces budget checks and rejects generation requests when budgets exceeded, emitting an audit event.
    - Fallback behavior (e.g., show manual tips or disable suggestion button) implemented and tested.
    - Integration tests simulate budget exhaustion and verify correct enforcement and audit events.
  - Estimate: 1–2 days

- Story 6.5: Logging, Prompt/Result Auditing & Data Redaction
  - Description: Record prompt inputs, token usage, and generated outputs in an audit-safe manner with configurable retention and redaction options for PII-sensitive content.
  - Acceptance Criteria:
    - Prompts and results logged with metadata (user, org, timestamp, token usage) and a configurable redaction policy.
    - Audit logs accessible via Admin Audit Viewer with filters for LLM events.
    - Retention policy enforced for prompt/result logs; tests validate redaction and retention behavior.
  - Estimate: 1–2 days

- Story 6.6: Safe-Fallbacks & Explainability
  - Description: When the LLM fails, or the generated SQL is unsafe, provide deterministic fallback suggestions, detailed explanations of why a suggestion was rejected, and clear user guidance.
  - Acceptance Criteria:
    - The system validates generated SQL and rejects unsafe outputs with a clear explanation (e.g., potential write op, access violation, or heavy resource use).
    - Fallback deterministic heuristics or example templates provided when LLM is unavailable.
    - Integration tests cover failure and fallback scenarios with expected UI messages.
  - Estimate: 1 day

- Story 6.7: LLM Usage Telemetry & Effectiveness Metrics
  - Description: Instrument metrics to measure LLM effectiveness: suggestions generated, suggestions applied (LLM-apply-rate), average token cost per applied suggestion, and downstream query success rates when suggestions applied.
  - Acceptance Criteria:
    - Telemetry events emitted for suggestion generation, apply/accept actions, and cost attribution.
    - Dashboard widgets added for LLM metrics and cost burn rates per org.
    - Integration tests validate telemetry emission and accuracy for composite flows.
  - Estimate: 0.5–1 day

- Story 6.8: Local Dev & Test Harness for LLMs
  - Description: Provide a local dev mode with mocked LLM responses and a test harness that can simulate common LLM behaviors (good suggestions, hallucinations, high-latency, errors) for reliable development and CI tests.
  - Acceptance Criteria:
    - Developers can run the app locally with a mock LLM provider producing configurable behaviors.
    - CI tests use the harness to validate adapters and LLM-related flows deterministically.
    - Documentation for running and configuring the mock provider included.
  - Estimate: 1 day

### Definition of Done (for Epic 6)

- All Epic 6 stories implemented and passing integration tests; adapter supports at least one production LLM provider.
- Auditing, budgeting, and safety validation in place; admin controls available to manage budgets and budgets enforcement tested.
- Telemetry and dashboards for LLM effectiveness and cost are available, and local dev mock harness is documented for contributors.

## Epic 7: Post-MVP Enhancements & Integrations — Stories and Acceptance Criteria

These stories capture valuable enhancements and integrations to pursue after validating the MVP. They are ordered for potential prioritization and include acceptance criteria and estimates.

- Story 7.1: Collaboration & Query Sharing Workflows
  - Description: Add collaborative features such as shared query folders, comments on saved views, and real-time presence indicators for simple co-editing scenarios.
  - Acceptance Criteria:
    - Users can share saved queries/views with team members and optionally allow editing or view-only access.
    - Comments can be attached to saved views and snapshots; users receive notifications for mentions.
    - Presence indicator shows who is viewing or editing a shared view in near-real-time (best-effort sync).
    - Integration tests validate sharing, permissions, and comment flows.
  - Estimate: 2–3 days

- Story 7.2: Third-Party Integrations (BI & Alerts)
  - Description: Implement connectors and export targets for popular BI tools (e.g., Tableau, Power BI) and simple alerting integrations (Slack, email) for query results or thresholds.
  - Acceptance Criteria:
    - Users can configure an integration to export query results or push scheduled snapshots to a configured endpoint.
    - Slack/email notifications can be configured for query thresholds or scheduled report deliveries.
    - Integration tests validate delivery to mocked endpoints and error handling for failed deliveries.
  - Estimate: 2–3 days

- Story 7.3: Natural Language → SQL (Advanced AI Feature)
  - Description: Provide a controlled, opt-in natural language to SQL feature that converts user prompts into safe, validated SQL using the LLM adapter and safety layer.
  - Acceptance Criteria:
    - Users can enter natural language queries and receive generated SQL with an explanation and an explicit accept button.
    - Generated SQL undergoes safety validation to block unsafe operations.
    - Telemetry captures effectiveness and LLM-apply-rate for NL→SQL conversions.
    - Integration tests validate generation, safety checks, and acceptance flows.
  - Estimate: 3–5 days

- Story 7.4: Mobile Optimizations & Lightweight App
  - Description: Improve responsive behaviors and build a lightweight mobile web experience for viewing results, running saved queries, and sharing snapshots.
  - Acceptance Criteria:
    - Core read-only flows (view saved queries, view results, export small snapshots) are optimized for mobile with usable touch interactions.
    - Mobile performance targets documented and met for common flows.
    - Manual and automated smoke tests validate mobile usability.
  - Estimate: 2–3 days

- Story 7.5: Advanced Data Connectors & Drivers
  - Description: Expand the list of supported external databases and provide more robust driver support (ODBC/JDBC proxies, cloud-native connectors) and improved schema discovery heuristics.
  - Acceptance Criteria:
    - New connector adapters added for at least two additional DB systems with validated connection/test flows.
    - Driver-based proxy supports tighter integration and improved schema accuracy for complex DBs.
    - Integration tests validate new connectors against simulator fixtures.
  - Estimate: 2–3 days

- Story 7.6: Enterprise Governance & SSO/SCIM
  - Description: Implement enterprise-grade SSO workflows (SAML/SCIM integration), org provisioning, and delegated admin roles for large customers.
  - Acceptance Criteria:
    - SSO integration supports both SAML and OIDC flows for at least one enterprise IdP.
    - SCIM provisioning endpoints implemented to sync users and groups from IdP.
    - Delegated admin roles available with appropriate permission scoping.
    - Integration tests validate SSO flows and provisioning behaviors.
  - Estimate: 3–5 days

- Story 7.7: Plugin Ecosystem & SDK
  - Description: Define and ship a simple plugin SDK that lets external developers add small UI/UX plugins (visualizations, export formats) and serverless function integrations that can be installed into an org.
  - Acceptance Criteria:
    - SDK docs and a sample plugin (visualization or export target) included in repo.
    - Plugin installation/uninstallation flows exist in Admin Dashboard and respect org-level policies.
    - Security review performed for plugin sandboxing model.
  - Estimate: 3–4 days

- Story 7.8: Internationalization & Localization
  - Description: Add i18n support and localize core UI flows into one or two initial languages (e.g., Spanish, French) and ensure date/number formatting follows locale.
  - Acceptance Criteria:
    - UI strings are externalized into resource files and two target languages are translated for core screens.
    - Locale-specific formats for dates, numbers, and CSV exports applied.
    - Tests validate localization usage and fallback behavior.
  - Estimate: 1–2 days

### Definition of Done (for Epic 7)

- All Epic 7 stories implemented and passing integration tests (as prioritized).
- Plugin SDK and integration docs published for external contributors.
- Mobile/intl improvements validated via smoke tests and included in release notes.

## PM Checklist Validation Report

### Executive Summary

- PRD completeness: ~85% (PARTIAL → approaching PASS). The document provides a clear problem statement, goals, detailed epics, and a thorough story breakdown for Epics 1–7. Several cross-cutting and operational details (retention policies, explicit user research evidence, and exact LLM budget defaults) are missing or need clearer, testable baselines.

- MVP scope appropriateness: PARTIAL — Generally well scoped for a solo-developer MVP but several Post‑MVP items and enterprise features are large and should be deferred for a true MVP canary.

- Readiness for architecture phase: NEARLY READY — Enough to start architecture work for core canary flow, but the architect should resolve a small set of blockers (see below) before finalizing infra choices.

- Most critical gaps or concerns: lack of explicit user research evidence and baselines, unclear LLM budget defaults and alerting thresholds, incomplete compliance/retention policy definitions, and limited details on long-running query handling.

### Category Statuses

| Category                         | Status  | Critical Issues (summary) |
| -------------------------------- | ------- | ------------------------- |
| 1. Problem Definition & Context  | PARTIAL | Limited documented user research; success metric baselines missing |
| 2. MVP Scope Definition          | PARTIAL | Some Epics contain features better classified as Post-MVP (collab, plugins) |
| 3. User Experience Requirements  | PASS    | UX flows, core screens, accessibility baseline, and acceptance criteria present |
| 4. Functional Requirements       | PASS    | FRs are comprehensive and testable; traceability to epics present |
| 5. Non-Functional Requirements   | PARTIAL | Performance targets present but capacity/scale numbers and SLAs need specificity |
| 6. Epic & Story Structure        | PARTIAL | Good vertical slices; a few stories could be split further and smaller estimates validated |
| 7. Technical Guidance            | PARTIAL | High-level choices stated (serverless, polyrepo); architecture risks flagged but require next-step investigation |
| 8. Cross-Functional Requirements | PARTIAL | Data retention, migration, and compliance details are high-level; integration specs need expansion |
| 9. Clarity & Communication       | PASS    | Document is well-structured, clear language, and includes acceptance criteria and estimates |

### Critical Deficiencies (must-fix before architect deep-dive)

1. Missing explicit user research or evidence (interview summaries, persona validation) — blocks confident prioritization and trade-offs.

2. No concrete LLM budget defaults or enforcement thresholds in the PRD (only references to budgets) — blocks safe LLM rollout and cost planning.

3. Retention and compliance policy defaults (audit log retention by org, legal export workflows) are unspecified — blocks compliance scoping for enterprise customers.

4. Long-running query handling strategy not prescriptive (background workers, time quotas) — architect needs explicit options & constraints.

### Top Issues by Priority

- BLOCKERS
  - Lack of user research artifacts and baseline metrics to validate MVP hypotheses. Recommendation: 3–5 lightweight interviews and at least one usability session for the visual builder canary before building heavy UX investment.
  - Undefined LLM budget defaults and enforcement actions. Recommendation: Define conservative defaults (e.g., per-user daily token cap, per-org monthly cap) and the fallback UX when budgets are exhausted.

- HIGH
  - Retention & compliance policies need concrete defaults and a documented retention job pattern.
  - Secrets management details (rotation cadence, key escrow) need to be specified for security review.

- MEDIUM
  - Some Epic stories include multiple concerns and should be split for better sprint planning (e.g., Story 2.5 joins + aggregations could be two stories).
  - Add explicit telemetry SLAs and sampling rules for LLM telemetry to avoid excessive cost.

- LOW
  - Consider deferring Plugin SDK and advanced collaboration until post-MVP validation.

### MVP Scope Assessment

- Features that might be cut or deferred from MVP:

  - Collaboration real-time presence and plugin SDK — defer to Post‑MVP to reduce scope and surface learning from single-user canary.
  - Broad connector expansion (ODBC/JDBC proxies) — focus on 2–3 core DBs for MVP (Postgres, MySQL, a popular cloud DB).

- Missing features that are essential or need clearer spec:

  - Explicit LLM budget defaults and admin controls for budgets/alerts.
  - Retention defaults for audit logs and snapshots; export and e‑discovery flow requirements for compliance.

- Timeline realism:

  - Canary (Epic 1) is realistically achievable as a tight MVP within 2–3 sprints for a focused solo dev if non-essential Epics (collab, plugins) are deferred.

### Technical Readiness

- Clarity of technical constraints: serverless/polyrepo selected — good defaults for MVP. However, long-running query strategy (hybrid workers) must be decided and documented.

- Identified technical risks:

  - Cold-start and execution-time limits for serverless functions when proxying queries.
  - LLM cost/runaway risk without hard token/budget enforcement.
  - Secrets lifecycle and secure SSH key handling require architectural decisions and threat modeling.

- Areas needing architect investigation:

  - Background worker design for long queries and snapshot generation.
  - Secrets management integration and client-side key handling for uploads.
  - Caching and pagination approach for very large datasets (beyond canary size).

### Recommendations (actionable)

1. Conduct 3–5 rapid user interviews and one remote usability session of a prototype (paper or Figma) focused on the visual query builder and connection setup (1 week).

2. Define conservative LLM budget defaults and enforcement behaviors in the PRD (e.g., per-user 10k tokens/day, per-org 500k tokens/month) and add explicit audit/alert flows.

3. Specify default audit retention (e.g., 90 days for prompts, 365 days for audit metadata, configurable per-org) and add a retention job story in Epic 5.

4. Split any large stories in Epic 2 and 3 into smaller vertical slices to make scope predictable for a solo developer.

5. Run a short architecture spike (2–3 days) to evaluate serverless vs hybrid background workers for long-running queries and to draft a secrets management design.

6. De-scope Post‑MVP items (plugins, real-time co-editing) from initial canary and add them to a prioritized backlog for post-MVP work.

### Next Steps

- Do 1-week user validation sprint (prototype tests) before finalizing UX polish effort.

- Add concrete LLM budget defaults and retention numbers to the PRD (I can apply these changes if you want).

- Schedule an architecture spike for long-running queries and secrets handling (assign to architect/engineer).

### Final Decision

- NEEDS REFINEMENT → The PRD is well-formed and nearly ready for architecture, but the PM should address the critical deficiencies listed above before handing to architecture for final infra design.

---

*PM Checklist run by GitHub Copilot on 2025-10-07. If you want a more granular, section-by-section interactive review, reply `interactive` and I will walk through each checklist item with suggested edits per section.*
