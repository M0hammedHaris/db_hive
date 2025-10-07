# User Interface Design Goals

DB Hive's UI will prioritize clarity, safety, and progressive disclosure to make complex query construction approachable for both technical and non-technical users. The interface balances a visual, low-friction query builder with an optional raw SQL view for power users, and surfaces LLM assistance contextually to reduce errors while keeping user control over generated queries.

## UX Vision

DB Hive's UI will prioritize clarity, safety, and progressive disclosure to make complex query construction approachable for both technical and non-technical users. The interface balances a visual, low-friction query builder with an optional raw SQL view for power users, and surfaces LLM assistance contextually to reduce errors while keeping user control over generated queries.

## Key Interaction Paradigms

- Drag-and-drop visual query builder with composable blocks for tables, joins, filters, and aggregations.
- Schema Explorer sidebar for browsing tables/columns and dragging fields into the query canvas.
- Contextual LLM assistant panel (suggestions, query hints, error explanations) with explicit "Apply" to accept generated SQL.
- Toggle between Visual Builder and Raw SQL preview (two-way sync when possible).
- Offline Workspace: a local sandbox view for uploaded schemas with clear indicators that no live connections are used.
- Result Exploration: table view with inline charting, pagination/streaming controls, and export actions.

## Core Screens

- Authentication / Onboarding: Sign-up, connection setup wizard, and brief interactive tutorial for the visual builder.
- Dashboard: Recent connections, saved queries, and usage metrics.
- Connection Manager: Add/test/manage SSH connections and saved credentials.
- Query Builder (Primary): Visual canvas, schema explorer, LLM assistant panel, SQL preview.
- Offline Workspace / Schema Upload: Upload/manage schema files and test queries locally.
- Results View: Table + chart tabs, pagination/streaming, export controls.
- Settings & Admin: RBAC, audit logs, LLM usage controls, billing/limits.

## Accessibility

Suggested baseline: WCAG AA compliance for MVP (keyboard navigation, readable contrast, semantic markup, screen-reader-friendly controls).

## UI Metrics & Telemetry

- Instrument lightweight telemetry hooks to measure: time-to-first-query, query-success-rate, onboarding-completion-rate, LLM-apply-rate, offline-mode-success-rate, and export/share usage. Record events with minimal PII and provide sampling options for privacy and cost control.
- Dashboard Widgets (MVP): "First Query Success" card, "Onboarding Completion" funnel, and "LLM Usage" summary (applied vs suggested counts, token usage estimate).
