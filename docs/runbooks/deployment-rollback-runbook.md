<!-- DB Hive deployment and rollback runbook (Canary + Emergency) -->

# DB Hive — Deployment & Rollback Runbook

Version: 2025-10-12 — v0.1

## Purpose

This runbook provides step-by-step instructions for safely deploying DB Hive changes using a canary approach, monitoring the canary, and performing controlled rollbacks or emergency mitigations. It is intended for Release Owners, SRE/On-call engineers, QA, and the Product Owner.

## Scope

- Frontend (Next.js) canary deployments and production promotions
- Backend serverless functions (Query Proxy, Parser) canary deployments
- DB migration guidance for NeonDB and backup/restore expectations
- Emergency mitigations (feature-flag toggles, LLM disable, traffic blocking)

## Prerequisites

- CI pipeline and deployment artifacts available for the release (artifact id / commit SHA).
- Monitoring dashboards and alerting configured (see `docs/architecture.md`).
- Feature-flag system in place (LaunchDarkly / Unleash / custom flags) with a `canary` toggle for new flows.
- Access to secrets manager and ability to rotate keys.
- Backup capability for NeonDB (snapshot/restore) tested and available.

## Roles & Contacts

- Release Owner — coordinates deployment, gives final go/no-go.
- On-call SRE — executes rollback steps and DB restore if required.
- QA Engineer — runs smoke and acceptance tests against the canary.
- Product Owner — communicates impact and approves major decisions.
- Communication channels: `#db-hive-release` (Slack), `#oncall` (pager), `oncall@company.example` (email/pager duty).

## Pre-deploy checklist (must pass)

- [ ] Code merged into deployment branch / release tag created (record commit SHA).
- [ ] CI status: unit, lint, typecheck, and integration tests passed.
- [ ] E2E smoke tests pass in staging for canary path.
- [ ] DB migrations reviewed and marked backward-compatible OR migration plan & snapshot created.
- [ ] Backup snapshot created for NeonDB (record snapshot id and timestamp).
- [ ] Secrets validated in secrets manager for target env (no missing env vars).
- [ ] Feature flag(s) prepared and tested (toggle on/off works).
- [ ] Monitoring dashboards active and alert thresholds validated.
- [ ] Rollback artifact identified (previous artifact id / commit SHA).

## Canary deployment steps (recommended sequence)

1) Notify stakeholders and create a release message in `#db-hive-release` with the release tag and commit SHA.

2) Trigger the CI job to deploy backend serverless functions to the canary environment (CI job name: `deploy:canary-backend`). Wait for the job to complete and confirm deployment logs show a successful publish.

3) Run backend smoke checks (health endpoint, sample schema discovery):
   - Verify `/api/health` returns OK.
   - Run the connection test flow against the SSH simulator (or staging DB) and confirm schema discovery succeeds.

4) Trigger frontend canary deployment (CI job: `deploy:canary-frontend`) to the canary route or preview URL.

5) Run quick E2E smoke tests against the canary route:
   - Create a test connection and perform a schema discovery.
   - Construct a minimal visual query, execute, and verify results and CSV export.
   - Ensure telemetry events are emitted (see Observability section).

6) Monitor for an initial observation window (default: 15 minutes):
   - Watch error rate, P95 latency, canary success rate, SSH error counts, and LLM error rate.
   - If any monitored metric exceeds thresholds (Decision matrix below), abort and start rollback.

7) If stable, optionally perform gradual traffic ramp (if using traffic-splitting):
   - Stage: 1% traffic (10–15 min) → 5% (15–30 min) → 25% (30–60 min) → 100% (final).
   - At each step run smoke tests and review metrics.

8) After full ramp and sustained health (default: 1–2 hours depending on risk), mark release as promoted in release tracker and announce completion.

## Decision matrix — when to rollback

Rollback triggers (examples):

- Canary 5xx errors exceed 1% of requests OR error rate increases > 3x baseline in a sustained 5+ minute window.
- P95 latency increases by more than configured threshold (e.g., > 200% above baseline) or exceeds SLA thresholds.
- Critical E2E smoke test failures (canary path broken).
- Security or privacy incident (suspected data leak via LLM or storage).
- Uncontrolled cost growth (e.g., LLM token spend exceeds emergency threshold).

If any trigger occurs, the Release Owner and On-call SRE execute rollback steps immediately.

## Quick rollback (fastest, least-invasive)

1) Toggle feature flag(s) that enable the new canary flow to OFF. This should remove traffic to the new UI/flow while preserving the deployment artifact.
   - If using LaunchDarkly: set flag to OFF for production; verify flag propagation in the UI.
   - Notify `#db-hive-release` and oncall escalation channel.

2) Re-run canary smoke tests to confirm the toggle restored baseline behavior.

3) If the toggle resolves the issue, keep the release paused while root cause is investigated. Do not re-enable until fixes are merged and validated.

## Full rollback (redeploy previous artifact)

Use when feature flag toggle cannot restore service or when infrastructure-level problems exist.

1) Identify the last-known-good artifact (artifact id / commit SHA).
2) Trigger the CI job to redeploy the last-known-good artifact to the affected environment (CI job: `deploy:redeploy-artifact`).
3) Verify backend and frontend health checks pass and run smoke tests.
4) Confirm monitoring metrics return to baseline; communicate status.

## DB rollback (for migration-related failures)

Use only when migration caused data or schema incompatibility and a safe migration reversal is available.

1) Consult SRE and Product Owner before initiating DB restore.
2) Restore NeonDB snapshot (recorded during Pre-deploy) into a recovery environment.
3) Validate data integrity and run acceptance tests against the recovery environment.
4) If recovery is successful and acceptable, coordinate a production restore following stakeholder approval.
5) For irreversible migrations: stop write traffic, coordinate with business stakeholders, and execute planned migration compensations (data transforms, re-ingest processes, or partial rollbacks).

## Emergency mitigations (additional actions)

- Disable LLM adapter: rotate API key or set LLM adapter to a safe stub to avoid further costs or data exposure.
- Scale down traffic via CDN or API gateway rules to reduce load while diagnosing.
- Block offending IPs or rate-limit problematic clients if attack-like behavior is observed.

## Post-rollback validation

- Re-run full smoke and regression test suite.
- Verify audit logs for the rollback window (connection events, query executions, LLM calls).
- Confirm backups and snapshots are intact.
- Engage in a rapid incident review and produce an initial incident bulletin for stakeholders.

## Post-incident & postmortem

- Run a blameless postmortem with engineering, SRE, QA, and PO present.
- Update this runbook with lessons learned and add missing automation where manual steps caused delays.
- Create follow-up issues for root cause remediation, test coverage gaps, and monitoring improvements.

## Appendix — useful references & placeholders

- CI job names (example): `deploy:canary-backend`, `deploy:canary-frontend`, `deploy:redeploy-artifact`
- Feature flag keys (example): `ff.canary_ui`, `ff.llm_adapter_enabled`
- Monitoring dashboards: `dashboards/db-hive-canary`
- Example log queries: CloudWatch / Vercel logs query templates for `requestId` and `errorType`
- Runbook ownership: `oncall-sre@company.example` (update with real contacts)
