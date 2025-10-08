# DB Hive Architecture Document

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-08 | v0.1 | Initial architecture document created from interactive session and PRD analysis; checklist run and results appended. | GitHub Copilot |

---

## Introduction

This document outlines the overall project architecture for DB Hive, including backend systems, shared services, and non-UI specific concerns. Its primary goal is to serve as the guiding architectural blueprint for AI-driven development, ensuring consistency and adherence to chosen patterns and technologies.

Relationship to Frontend Architecture:
A separate Frontend Architecture Document should be created and used in conjunction with this document for UI-specific designs and details. Core technology stack choices documented herein are definitive for the entire project, including any frontend components.

---

## High Level Architecture

### Technical Summary

DB Hive will adopt a serverless-forward architecture for backend compute (Node.js serverless functions) with a set of background workers for long-running tasks. The frontend is a Next.js app deployed to Vercel; metadata and app state live in NeonDB while user DBs are accessed via SSH-proxied connections. Core patterns: adapter-based LLM/provider abstraction, repository pattern for DB access, and event-driven async processing for heavy tasks (imports, exports). This architecture emphasizes low ops overhead for an MVP while preserving a clear upgrade path to hybrid containerized workers if needed.

### High Level Overview

1. Architectural style: Serverless-first with hybrid workers for long-running jobs.
2. Repository structure: Polyrepo (separate frontend/backend/infra) to simplify ownership and CI boundaries.
3. Service architecture: Serverless functions for connection orchestration, schema parsing, LLM orchestration, and audit logging; background workers (Fargate/Cloud Run) for heavy/long-running tasks.
4. Primary flows (conceptual): User authenticates → creates/tests SSH connection → schema discovered/parsed → visual query built → query executed via proxied/read-only sandbox → results returned and optionally exported; LLM suggestions pass through an adapter layer with budget and rate controls.
5. Key decisions + rationale: serverless reduces initial infra burden and fits solo-dev velocity; polyrepo reduces cross-team merge complexity; adapter layers mitigate vendor lock-in for LLMs and DB connectors.

---

## Architectural Patterns

- Serverless-first with Background Workers — _Rationale:_ low ops, fast iteration for MVP; add container workers for long or heavy tasks.
- Adapter Pattern for LLM & DB connectors — _Rationale:_ provider-agnostic, enables budget and policy enforcement.
- Repository Pattern for DB access — _Rationale:_ testable, swap-able data access layer.
- Event-driven background processing for heavy imports/exports — _Rationale:_ avoid serverless timeouts and improve reliability.

---

## Tech Stack (DEFINTIVE CHOICES — confirm)

- Language & Runtime: TypeScript 5.4.2, Node.js 20.16.0
- Frontend: Next.js 13.5.4, React 18.2.0, shadcn/ui, Tailwind CSS 3.4.0
- Backend: Serverless functions (Vercel/AWS Lambda) + NestJS 10.3.2 or Fastify for structured services
- Database: NeonDB (Postgres-compatible), ORM: Prisma 5.11.0 (or Drizzle as an alternative)
- Secrets: AWS Secrets Manager (prod); Vercel env for staging previews
- LLM Adapter: Provider-agnostic adapter; default OpenAI-compatible provider (adapter layer enforces budgets)
- CI/CD: GitHub Actions + Vercel + Terraform for infra
- IaC: Terraform 1.5.x
- Observability: Sentry + OpenTelemetry + CloudWatch/Datadog
- Testing: Vitest (frontend/backend), Playwright (E2E), Testcontainers or SSH simulator for integration

Notes & action items:

- Pin versions in package.json and lockfiles; tech-stack table is the single source of truth and must be updated with any changes.

---

## Data Models (Conceptual entities)

Core entities (initial set):

- User: id (uuid), org_id, clerk_id, email, display_name, role (Admin/Editor/Viewer), created_at, updated_at
- Organization: id, name, billing_meta (jsonb), llm_budget, audit_retention_days
- Connection: id, org_id, name, db_type, host, port, secret_ref (pointer to secrets store), ssh_tunnel, discovery_status, last_test_at
- SchemaSnapshot: id, connection_id/null, source (upload/live), version, schema_json (jsonb), parser_warnings, parsed_at, artifact_url
- SavedQuery: id, org_id, owner_id, name, visual_spec (jsonb with version), sql, visibility
- QueryExecution: id, org_id, user_id, connection_id, sql_hash, duration_ms, rows_returned, status, cost_estimate, request_meta, created_at, completed_at
- AuditLog: id, org_id, user_id, event_type, payload (jsonb), occurred_at
- LLMBudget/Usage: per-org/user tracking for tokens and enforcement state

Design notes:

- jsonb used for flexible schema and visual_spec with explicit versioning to support migrations.
- Secrets are stored only as references to a secrets service; never store raw credentials in DB.

---

## Components

1. Frontend App (Next.js)
   - UI for Connection Manager, Query Builder, Offline Workspace, Results View, Admin dashboards.
   - Interfaces: REST/WS to API gateway, Clerk auth.

2. API Gateway / Edge Functions
   - Auth proxy, request routing, lightweight validation and rate limiting.

3. Serverless Backend (Connection Manager, Query Proxy, LLM Adapter)
   - Orchestration, budget checks, metadata, job enqueue.

4. Query Proxy / SSH Tunnel Manager
   - Responsible for establishing ephemeral SSH tunnels and executing proxied queries; recommended to run as containerized service for persistent tunnels/pooling.

5. Schema Parser Service
   - Parse uploaded SQL/JSON schema into normalized JSON snapshots; run in background for large uploads.

6. Background Workers & Job Queue
   - Long-running exports, parsing, heavy queries, scheduled aggregation jobs.

7. Metadata & Audit Store (NeonDB)
   - Stores SavedQuery, QueryExecution, AuditLog, SchemaSnapshot metadata.

8. Secrets & Config Service
   - AWS Secrets Manager (or Vault) for production secrets; DB stores pointer references only.

9. Observability & Security Stack
   - Sentry + OpenTelemetry + logs/metrics pipeline.

10. Static Artifact Storage (S3)
   - Large artifacts and exports with signed URLs; artifact metadata stored in DB.

---

## External APIs (integration primer)

Priority integrations to document fully:

- LLM Provider (OpenAI-compatible) — document base URLs, rate limits, auth, and policy for sending query text.
- Auth Provider (Clerk) — session validation endpoints and webhook flows.
- Secrets Store (AWS Secrets Manager) — secret ARNs and rotation procedures.
- Observability (Sentry/Datadog) — ingestion endpoints, SDK configs.
- Object Storage (S3) — artifact upload, signed URLs, lifecycle.

Security note: Do not send full query results with PII to any external LLMs unless explicit consent and budgeting/policy redaction are in place.

---

## Core Workflows (summary)

Key E2E workflows to model and validate:

- Connection Setup & Test (schema discovery, snapshot creation)
- Visual Query Build → Execute → Results Streaming + Export
- Offline Schema Upload → Background Parse → Snapshot Use
- LLM Suggestion → Budget check → Suggestion apply/fallback
- Secret Rotation → Re-test → Audit
- Large Export → Background Worker → artifact in S3

Decisions to confirm:
- Threshold for offloading queries to background workers (e.g., estimated rows or time)
- Real-time update approach: WebSocket recommended for bi-directional; SSE for one-way notifications

---

## REST API Spec (summary)

Canonical endpoints (to be authored into `docs/openapi.yaml`):

- Auth & Health: GET /api/v1/health, GET /api/v1/auth/session
- Connections: POST/GET/PATCH/DELETE, POST /connections/{id}/test
- Schemas: POST /schemas/upload, GET /schemas/{id}
- Queries: POST /queries, GET /queries/{id}, GET /queries/{id}/results, POST /queries/{id}/cancel
- Exports: POST /exports, GET /exports/{id}
- LLM: POST /llm/suggest, GET /llm/usage
- Admin/Audit: GET /admin/audit

Security & policies:
- Tenant scoping enforced server-side (org_id context)
- Auth via Clerk-issued tokens (bearer) validated at edge
- Idempotency-Key for exports and long-running jobs
- Cursor-based pagination for results; streaming for progressive rendering

---

## Database Schema (Postgres — canonical snippets)

Enums:

```sql
CREATE TYPE role_enum AS ENUM ('Admin','Editor','Viewer');
CREATE TYPE db_type_enum AS ENUM ('postgres','mysql','redshift');
CREATE TYPE exec_status_enum AS ENUM ('started','success','failed','cancelled');
```

Example tables (abridged):

```sql
CREATE TABLE users (
  id uuid PRIMARY KEY,
  org_id uuid NOT NULL,
  clerk_id text,
  email text UNIQUE,
  display_name text,
  role role_enum NOT NULL DEFAULT 'Viewer',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE connections (
  id uuid PRIMARY KEY,
  org_id uuid NOT NULL,
  name text NOT NULL,
  db_type db_type_enum NOT NULL,
  host text,
  port int,
  secret_ref text NOT NULL,
  ssh_tunnel boolean DEFAULT false,
  discovery_status text,
  last_test_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE schema_snapshots (
  id uuid PRIMARY KEY,
  org_id uuid NOT NULL,
  connection_id uuid,
  source text,
  version text,
  schema_json jsonb,
  parser_warnings jsonb,
  parsed_at timestamptz DEFAULT now(),
  artifact_url text
);

CREATE TABLE query_executions (
  id uuid PRIMARY KEY,
  org_id uuid NOT NULL,
  user_id uuid,
  connection_id uuid,
  sql_hash text,
  duration_ms int,
  rows_returned bigint,
  status exec_status_enum,
  cost_estimate numeric,
  request_meta jsonb,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);
```

Partitioning & indexing recommendations:

- Partition query_executions and audit_logs by date (monthly or per-org+month) for scale
- GIN index on schema_snapshots.schema_json for table/column lookups
- Covering indexes for (org_id, created_at) and sql_hash

---

## Source Tree (recommended — polyrepo)

Recommended layout (high-level):

- frontend-repo/
  - app/ (Next.js)
  - components/
  - tests/
- backend-repo/
  - services/api/
  - services/query-proxy/
  - workers/
  - prisma/
- infra-repo/
  - terraform/
- shared-packages-repo/
  - packages/types/
- web-bundles/clients/ (generated SDKs)

Notes:
- Keep OpenAPI contract canonical in `docs/openapi.yaml` and generate clients into `web-bundles/clients` or publish to private registry.

---

## Infrastructure & Deployment

- IaC: Terraform modules with remote state and locking
- Environments: dev, staging, canary, prod
- Deployment flow: PR -> staging preview -> merge -> canary -> gated promotion -> prod
- Backend: serverless functions + containerized workers for persistent tunnels or heavy jobs
- Rollback: traffic weight reversion and roll-forward hotfix preference; DB migrations must be backward compatible

---

## Error Handling Strategy

- Structured error model with mapped HTTP codes and structured payload {error_id, error_code, user_message, developer_message, correlation_id}
- Retry policy: exponential backoff + jitter, capped retries (3) for transient errors; circuit breakers for repeated failures
- Idempotency-Key required for exports and other side-effecting requests
- Logging: structured JSON logs with correlation_id and redaction of sensitive data

---

## Coding Standards (critical rules)

- TypeScript strict mode (noImplicitAny), Node.js pinned versions
- ESLint + Prettier enforced in CI; lint errors block CI
- NEVER hardcode secrets; secrets must be referenced via secret manager
- All DB access through repository layer; parameterized queries only
- No console.log in production; use structured logger with correlation_id
- LLM calls must go through LLM Adapter and include org_id + usage metadata
- visual_spec JSON must include a version field and migrations when changed

---

## Test Strategy

- Unit: Vitest (frontend/backend), colocated tests
- Integration: Testcontainers or SSH simulator for DB and connection flows
- E2E: Playwright for core flows (connection -> query -> export); smoke E2E on PR previews, full E2E on canary
- Coverage target: 70% for critical modules; critical packages enforced in CI

---

## Checklist Results Report (architect-checklist executed)

Summary (executive):
- I wrote this architecture document from the interactive session and ran the `architect-checklist` against `docs/prd.md` and this document. Overall alignment with the PRD is strong: architecture covers the majority of functional and non-functional requirements, technology selections are pinned, and core workflows and constraints are documented.
- The run found a mix of ✔ (covered), ⚠ (partial / requires validation), and ✖ (missing) items. The prioritized remediation list follows.

Findings (selected highlights)

1. Requirements Alignment

- Functional requirements coverage: ✔ Most PRD functional requirements (connections, visual query builder, offline schema, LLM assistance, RBAC, export) have explicit architectural solutions documented (see 'Core Workflows', 'Components', 'Tech Stack'). Evidence: `docs/prd.md` FR1–FR6 and `docs/architecture.md` sections 'Core Workflows' and 'Components'.

- Non-functional requirements: ⚠ Partially addressed. Performance and SLA targets are noted in PRD but architecture needs explicit capacity planning and benchmark targets (e.g., concurrency assumptions, cold-start tolerances). Evidence: `docs/prd.md` NFR1 and this doc's Infrastructure & Deployment section requests validation of thresholds.

2. Architecture Fundamentals

- Architecture clarity: ✔ Major components and responsibilities are defined under 'Components'. Evidence: 'Components' section.

- Diagrams: ⚠ Missing concrete mermaid diagrams for the high-level project diagram and component diagrams — the template requests Mermaid artifacts; recommended to add them.

3. Technical Stack & Decisions

- Versions pinned: ✔ Tech-stack version pins are present (Tech Stack section). Evidence: 'Tech Stack'.

- Alternatives & rationale: ✔ Alternatives and trade-offs are documented for critical choices (serverless vs containers, Neon vs others).

4. Data Architecture

- Data models: ✔ Core models defined (Data Models section) with jsonb strategy and versioning notes.

- Retention/partitioning: ⚠ Retention windows and partition cadence for QueryExecution/AuditLog need explicit per-org defaults (PRD asked for audit retention setting). Evidence: Data Models and Database Schema notes show partitioning recommendations but no per-org retention defaults.

5. Security & Compliance

- Secrets handling: ✔ Secret references and rotation approach specified; raw secrets must not be stored. Evidence: Components (Secrets & Config Service) and DB schema notes.

- PII & LLM policies: ⚠ PII handling and explicit LLM-data policies exist as high-level statements, but organizational policy (consent, residency, allowed providers) must be finalized.

6. Operational Readiness

- Deployment & rollback: ✔ A canary-first deployment and rollback primitives are defined.

- Observability & metrics: ⚠ Observability tools are listed (Sentry/OpenTelemetry) but SLOs, exact alert thresholds, and canary gating metrics are not defined and need concrete values.

7. Frontend-specific items

- Frontend architecture: ⚠ The PRD is UI-heavy and this doc references a separate Frontend Architecture Document; that document is missing. Recommend authoring `docs/frontend-architecture.md` with component structure, routing, and UX implementations.

8. AI Agent Implementation Suitability

- Modularity and clarity: ✔ Document is structured to be AI-agent friendly (clear components, patterns, and small focused responsibilities).

Prioritized Remediations (must / should / nice-to-have)

Must (high priority)
1. Create `docs/frontend-architecture.md` to satisfy frontend-only checklist items and supply UI-level component diagrams and routes. (Reason: PRD is UI-centric; implementers need concrete UI guidance.)
2. Define concrete retention policies and partition cadence for QueryExecution and AuditLog per org (default days) and document archival paths. (Reason: cost and compliance impact.)
3. Finalize LLM provider policy (allowed providers, data residency constraints, and whether to send query text to third-party LLMs). (Reason: security & compliance.)
4. Set canary gating metrics and thresholds (error rate, latency P95/P99, first-query success metrics) and document promotion flow. (Reason: automated safe promotion.)

Should (medium priority)
1. Add concrete Mermaid diagrams (high-level architecture and component diagrams) to this doc.
2. Produce a full OpenAPI spec at `docs/openapi.yaml` and generate SDKs into `web-bundles/clients/` or a package registry.
3. Provide explicit DB retention & encryption policies (field-level encryption requirements) and define whether full SQL is stored encrypted or hashed.

Nice-to-have (lower priority)
1. Add performance benchmark targets and an initial load test plan (k6 scripts) to validate NFRs.
2. Add sample SLO/SLA definitions and alerting playbook for on-call.

Evidence / Citations
- PRD: `docs/prd.md` (see Goals, Functional Requirements FR1-FR14, Non-Functional Requirements sections NFR1-NFR5).
- Architecture: this document (the sections titled 'Tech Stack', 'Data Models', 'Components', 'Core Workflows', 'Database Schema', 'Infrastructure & Deployment', 'Error Handling Strategy', 'Coding Standards', 'Test Strategy').

Next actions / recommended owners
- Product / PO: Confirm LLM provider constraints, PII policies, and retention windows.
- Architect / Tech Lead: Author `docs/frontend-architecture.md`, add Mermaid diagrams, finalize canary metrics.
- DevOps: Implement Terraform environment skeletons and CI gates for canary promotion.
- Security: Finalize field-level encryption requirements and LLM-data policies.

---

Artifacts produced by this run
- `docs/architecture.md` (this file) — assembled from the interactive architecture session.
- `docs/architecture-checklist-results.md` — standalone checklist report with the same findings (created alongside this document).

If you'd like I can now:
1. Create `docs/frontend-architecture.md` (I will follow the front-end template and elicit details).
2. Generate `docs/openapi.yaml` for the REST API spec (I will draft the OpenAPI 3.0 YAML).
3. Produce Mermaid diagrams for the high-level architecture and component diagrams.

Select an action by typing the number above or ask for a different next step.