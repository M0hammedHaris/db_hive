# Epics Summary

Epics are ordered to prioritize an early canary Core Query Experience while delivering a minimal security baseline. Each epic remains a sequence of deployable vertical slices.

- Epic 1: Foundation & Canary — Deliver repo scaffolding, CI/CD pipeline, basic deployment (canary route), user authentication (Clerk), and an end-to-end canary flow that stitches a minimal SSH connection, a simple visual query canvas (single-table queries, basic filters), and a results table with CSV export. This epic validates end-to-end infra assumptions and supports quick user feedback.

- Epic 2: Core Query Experience — Complete the Connection Manager (schema preview, secure credential storage, connection tests), implement Offline Schema Upload / Preflight, and expand the Visual Query Builder (joins, aggregations, two-way SQL preview). Ensure the UI shows clear live vs offline states and supports vertical-slice query creation.

- Epic 3: Result Visualization & Export — Build interactive result tables and charts, pagination/streaming controls, export flows (CSV/JSON) and secure share links with expiry. Add result-level UX for charting and inline drilldowns.

- Epic 4: Performance, Monitoring & Polish — Implement telemetry, performance optimizations, observability dashboards (for UI metrics and LLM usage), and accessibility refinements to reach WCAG AA baseline. Address performance bottlenecks surfaced by canary telemetry.

- Epic 5: Admin, RBAC & Auditability — Implement granular RBAC, admin UI for user/org management, audit log viewer/export, and organization-level policies (LLM budgets, connection policies). Ensure audit logs and RBAC controls are in place for enterprise customers.

- Epic 6: LLM Assistance & Governance — Integrate LLM suggestions, provide opt-in per-query flows, build the LLM adapter for provider-agnostic integrations, and implement cost controls, budgets, and prompt/audit trail features.

- Epic 7: Post-MVP Enhancements & Integrations — Add collaboration/share workflows, third-party integrations, mobile improvements, and advanced AI features (natural-language-to-SQL) as future expansion items.
