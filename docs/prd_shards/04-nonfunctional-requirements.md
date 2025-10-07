# Non-Functional Requirements

1. NFR1: Performance — Typical query execution for representative datasets should complete under 5 seconds (where possible).
2. NFR2: Security — End-to-end encryption for connections and data isolation in offline mode.
3. NFR3: Browser Support — Support modern browsers (Chrome, Firefox, Safari, Edge) and ES6+ environments.
4. NFR4: Maintainability — Codebase structured to support a monorepo with clear frontend/backend separation.
5. NFR5: Testability — Include unit tests and integration tests for core query and connection flows.

## Non-Functional Requirement Refinements

- NFR1 (refined): Performance — 95th percentile query latency <= 5s for datasets up to 100k rows under standard concurrency (e.g., 5 concurrent users); specify benchmarks for larger loads.
- NFR5 (refined): Testability — Minimum 70% automated test coverage for core modules; include integration tests for SSH connectivity, offline schema handling, and LLM fallback scenarios.
