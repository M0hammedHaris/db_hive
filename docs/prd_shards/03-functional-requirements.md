# Functional Requirements

1. FR1: Secure SSH Database Connection — Allow users to establish SSH-tunneled connections to PostgreSQL, MySQL, and other common DBs with credential management.
2. FR2: Visual Query Builder — Provide drag-and-drop query construction with support for filters, joins, and basic aggregations.
3. FR3: Result Visualization — Render query results as interactive tables and charts (bar, line, pie).
4. FR4: Offline Schema Upload — Enable uploading and local use of database schema files for offline query composition and testing.
5. FR5: Basic LLM Assistance — Offer query suggestions, clarification prompts, and basic error explanations when queries fail.
6. FR6: Authentication & User Management — Integrate Clerk for user auth, roles, and session handling.

## Additional Functional Requirements (applied from critique)

- FR7: Role-Based Access Control — Support Admin/Editor/Viewer roles; enforce permissions on data sources, exports, and connection configurations.
- FR8: Query Execution Controls — Timeouts, concurrency limits, pagination/streaming for large results, and cancellation support.
- FR9: Result Export & Sharing — Allow CSV/JSON export and secure, shareable links with expiry.
- FR10: Connection & Secret Management — Secure storage for SSH credentials, support key rotation, connection testing, and session timeouts.
- FR11: Audit Logging — Record connection events, queries executed, and exports for compliance; provide admin access to export logs.
- FR12: Schema Import & Validation — Support SQL dumps and JSON schema formats with validation before enabling offline queries.
- FR13: LLM Safety & Cost Controls — Implement rate limits, per-user/org token or cost budgets, prompt/result audit trail, and graceful degradation to non-LLM flows.
- FR14: Read-Only Sandboxing — Default query execution in read-only mode for external DBs with explicit, audited elevated flows for write operations.
