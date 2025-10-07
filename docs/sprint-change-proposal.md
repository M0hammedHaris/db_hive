# Sprint Change Proposal — Correct Course (YOLO)

Date: 2025-10-07
Author: Correct-Course Task (batched analysis)

## Change trigger (assumption)
The PM Checklist run on the PRD identified a small set of blockers that must be resolved before handing the PRD to architecture: missing user research artifacts, undefined LLM budget defaults and enforcement, unspecified retention/retention-job specs, and an unclear long-running query strategy. This proposal addresses those blockers in a single batched pass and proposes concrete edits to the PRD shards.

If this trigger differs from what you intended, tell me and I will re-run the analysis for the alternate trigger.

## Executive summary of analysis
- The PRD is well-formed and near-ready for architecture but has several cross-cutting operational gaps that block safe rollout (LLM cost controls, retention policies) and architect-level decisions (long-running query strategy, secrets lifecycle).
- Addressing these gaps requires small, targeted PRD edits (add conservative defaults and explicit spikes) plus a user-research sprint and a short architecture spike. These are low-risk, high-value changes that will unblock the architecture team.
- Recommended approach (fastest path to unblock):
  1. Add concrete LLM budget defaults and enforcement text to `06-technical-assumptions.md` and `08-pm-checklist.md`.
  2. Add retention defaults and a retention-job story to Epic 5 (audit logging) and PM Checklist.
  3. Create a new short "Infra Spike" story (2–3 days) in Epic 1 or Epic 4 specifically to evaluate serverless vs hybrid workers for long-running queries and secrets handling.
  4. Add 3–5 lightweight user interviews + a 1-week prototype usability check to PRD Next Steps and mark as must-do before extensive UX polish.
  5. Split a couple large stories (e.g., Visual Query Builder joins + aggregations) to make sprint-size stories clear.
  6. De-scope or deprioritize Post-MVP items (Plugin SDK, real-time co-editing) from the canary pipeline and move them to Epic 7 backlog notes.

## Proposed path forward (detailed)
- Priority: unblock architecture and reduce immediate risk.
- Actions to apply now (low-effort, high-impact):
  - Add LLM budget defaults: per-user 10k tokens/day, per-org 500k tokens/month (conservative defaults), add denial/fallback behavior and audit events when budgets exhausted.
  - Add retention defaults: prompts 90 days, LLM prompt/results log retention 90 days, audit metadata 365 days (configurable per-org); add retention-job story to Epic 5.
  - Add Infra Spike story: 2–3 day spike to decide long-running query handling (serverless limits vs background workers) and secrets lifecycle design (secret store choice, client-side key handling).
  - Add User Research micro-sprint: 3–5 interviews + 1 remote usability session for visual query builder; update PRD Next Steps and PM Checklist.
  - Split Story 2.5 into two stories: (a) joins; (b) aggregations & group-by. Update estimates.
  - Explicitly mark Plugin SDK and real-time collaboration as Post‑MVP (deferred) in Epic 7 and PM Checklist.

## Specific proposed edits (copy/paste ready)
Below are suggested insertions and replacements for the shard files. You can approve and I will apply them (I can make the edits automatically once you confirm). Each item includes the target file path and the exact markdown to add.

1) Add LLM budget defaults to `docs/prd_shards/06-technical-assumptions.md`

Append the following subsection under "Technology Preferences & Constraints" or near the LLM Provider paragraph:

---

### LLM Budget Defaults & Enforcement (PROPOSED)

- Conservative default budgets (configurable per-org):
  - Per-user: 10,000 tokens/day
  - Per-org: 500,000 tokens/month
- Enforcement behavior:
  - Requests that would exceed the budget are rejected at the adapter layer with a clear UI message and an audit event (action: llm.request.rejected, reason: budget_exceeded).
  - Fallback: when budgets are exhausted, the UI shows deterministic/manual tips and disables the "Generate" action; admins can set soft thresholds to warn users before hard rejects.
- Telemetry: token usage is recorded per-request and attributed to user + org; token-usage metrics are available in the LLM Usage dashboard and trigger alerts when thresholds are hit.

Rationale: conservative defaults give a safe starting point for cost control and can be revised after the canary and initial telemetry.

---

2) Add retention defaults and retention job story to `docs/prd_shards/08-pm-checklist.md` and Epic 5 (`docs/prd_shards/epics/epic-5.md`)

Suggested insertion in PM Checklist "Recommendations" and in Epic 5 stories:

---

**Retention Defaults (PROPOSED)**

- Suggested org-default retention windows (configurable per-org):
  - LLM prompts & generated results: 90 days
  - Audit metadata (connection events, query hashes, exports): 365 days
  - Snapshots (exported result snapshots): 365 days (configurable for legal/compliance needs)
- Add a new story under Epic 5 (Audit Logging / Retention):

**Story 5.9: Retention Job & Policy Enforcement**
- Description: Implement a scheduled retention job that enforces org-configured retention windows for audit logs, LLM prompt/results, and snapshots; log retention actions in the audit log.
- Acceptance Criteria:
  - Retention job runs on schedule and deletes data older than configured windows.
  - Retention events are recorded in the audit log with metadata (time window, records deleted, job run id).
  - Admin UI shows current retention settings and last run status.
- Estimate: 1 day

Rationale: a retention job and defaults are required for compliance and clear architecture decisions about storage/retention costs.

---

3) Add an Infra Spike story to evaluate long-running queries & secrets handling. Add to Epic 1 (or Epic 4) as a small story `epic-1.md` or `epic-4.md`:

---

**Story 1.8 (Spike): Long-running Query Strategy & Secrets Handling**
- Description: Run a 2–3 day architecture spike to evaluate serverless function limits, background worker options (Fargate/Cloud Run), secrets store options (AWS Secrets Manager vs Vercel env), and recommend a short design decision (with a small mermaid diagram if needed).
- Acceptance Criteria:
  - Documented recommendation: serverless-only vs hybrid approach, with pros/cons and cost/operational implications.
  - Draft design for secrets handling (client-side key upload flow, server-side storage, rotation procedure).
  - Short runbook for handling long query timeouts and background job patterns.
- Estimate: 2–3 days

Rationale: Architect needs a focused spike to choose the final infra approach before full implementation.

---

4) Add User Research micro-sprint to `docs/prd_shards/08-pm-checklist.md` and PRD Next Steps

---

**User Research: 1-week micro-sprint (PROPOSED)**
- Action: Conduct 3–5 lightweight user interviews and one remote usability test of a visual-builder prototype (paper/Figma). Capture key pain points for connection setup and visual query flows.
- Deliverables: 5 interview notes, 1 usability test recording & summary, list of 5 prioritized UX changes (if any).
- Timing: 1 week (can be executed before detailed visual polish).

Rationale: Reduced risk and better validation for UX assumptions in the PRD.

---

5) Split Story 2.5 (Visual Query Builder — Joins & Aggregations)

Replace Story 2.5 with two stories (in `docs/prd_shards/epics/epic-2.md`):

---

**Story 2.5a: Visual Query Builder — Joins**
- Description: Enable multi-table joins, aliasing, and basic join UI (connect table blocks, choose join type).
- Acceptance Criteria: Users can create INNER/LEFT/RIGHT joins via UI; SQL preview reflects join clauses.
- Estimate: 1–2 days

**Story 2.5b: Visual Query Builder — Aggregations & Group-by**
- Description: Add aggregation controls (COUNT, SUM, AVG) and group-by UI on column blocks; keep SQL preview in sync.
- Acceptance Criteria: Aggregations available and reflected in SQL; group-by controls exist; tests validate generated SQL.
- Estimate: 1–2 days

Rationale: Smaller stories improve sprint predictability for a solo dev.

---

6) De-scope Plugin SDK and Real-time Collaboration from canary (Epic 7)

Add a short note in `docs/prd_shards/epics/epic-7.md` and `08-pm-checklist.md` that these items are Post‑MVP and will be deprioritized for the canary.

Suggested text:

---

**Post-MVP Deferment (PROPOSED)**

To minimize canary scope and time-to-feedback, defer Plugin SDK and real-time co-editing features to Post‑MVP backlog (Epic 7). Keep them in the roadmap, but remove from immediate canary acceptance criteria.

---

## Acceptance criteria for this Change Proposal
- PRD shards updated with the above edits and stories.
- PM approves updates and signals architecture team to run the infra spike.
- User research sprint scheduled and in-flight before major UI polish work.

## Risks & mitigations
- Risk: LLM budget defaults may be either too conservative or too permissive. Mitigation: label them as conservative defaults and note they are configurable; instrument token telemetry to refine them after canary.
- Risk: Retention default choices may not satisfy legal/compliance for some customers. Mitigation: make fields configurable per-org and surface warnings about compliance.

## Proposed timeline for the corrective work
- Day 0: Approve Sprint Change Proposal and apply PRD edits.
- Week 0–1: User research micro-sprint (1 week).
- Week 0–1: Infra spike (2–3 days) runs in parallel with interviews where possible.
- Week 1+: Apply architecture decisions and continue with Epic 1 canary work.

## Next actions (what I will do once you approve)
- If you approve, I will apply the above edits directly to the shard files (`docs/prd_shards/*`) and open a commit with a clear message (e.g., "chore(docs): apply correct-course PRD edits — LLM budgets, retention, spike").
- I can also add the newly-created stories to the epic files and update estimates.

---

Please review the proposed edits above. Reply with:

- `apply` — to have me apply all proposed edits and commit them.
- `apply partial` — to apply a subset; then list which items to apply (e.g., "apply 1,2,3").
- `reject` — to cancel and take no changes.
- `tweak:` followed by short edits to the proposed defaults (for example: `tweak: per-user 5k tokens/day, per-org 250k tokens/month`) and I will adjust the proposal and apply if you confirm.

If you want me to act, tell me which option and I'll proceed. If you have questions about any specific proposed edit, ask and I'll clarify.
