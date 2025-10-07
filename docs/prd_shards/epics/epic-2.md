# Epic 2: Core Query Experience — Stories and Acceptance Criteria

These stories complete the Connection Manager, Offline Schema UX, Schema Explorer, and expand the Visual Query Builder to support joins, aggregations, and two-way SQL sync. Each story is a vertical slice with clear acceptance criteria and an estimate.

- Story 2.1: Connection Manager — Full Feature Set
	- Description: Implement the full Connection Manager UI and backend: create/edit/delete connection entries, secure storage of credentials, connection grouping, and connection status indicators.
	- Acceptance Criteria:
		- Users can create, edit, and delete connection entries from the UI.
		- Connection entries support name, host, port, DB type, auth method (SSH key/file or password), and optional tags.
		- Connection list shows live status badges (connected, disconnected, error) with last-tested timestamp.
		- Unit/integration tests cover create/edit/delete and status flows.
	- Estimate: 1–2 days

