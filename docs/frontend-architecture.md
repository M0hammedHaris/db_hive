# DB Hive Frontend Architecture Document

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-08 | v0.1 | Initial frontend architecture draft created and awaiting elicitation to continue. | GitHub Copilot |

---

## Introduction

This document captures the frontend-specific architecture for DB Hive. It complements `docs/architecture.md` and focuses on UI patterns, project structure, component standards, state management, and API integration patterns required to implement the PRD's UX flows (Query Builder, Connection Manager, Offline Workspace, Results View).

Primary goals:
- Provide a developer-ready frontend architecture that supports rapid iteration and accessible UX for both technical and non-technical users.
- Ensure clear contracts with backend APIs, predictable state management, and a testable component structure.
- Make explicit any starter templates or conventions to reduce decision friction for implementers and AI agents.

Dependencies / Required artifacts:
- `docs/prd.md` (Product Requirements Document)
- `docs/architecture.md` (system architecture)
- Any existing frontend repo or starter template (if present)

---

Section: Starter Template or Existing Project (ELICITATION REQUIRED)

Section content (what I need to know / decision to record):
- Determine whether this frontend will be based on an existing starter (e.g., Next.js + Vercel template, shadcn starter, or a company-internal UI scaffold) or if this is a greenfield implementation.
- If a starter exists, provide repo/link or attach files so we can analyze:
  - Preinstalled dependencies and pinned versions
  - Project structure and conventions
  - Existing components or design system
  - Testing setup and CI preview behavior
- If greenfield, decide and confirm starter recommendations (I suggest Next.js + shadcn/ui + Tailwind + TypeScript) and whether Storybook + Vercel previews are required.

Rationale, trade-offs, and assumptions:
- Starter (recommended if available):
  - Pros: Faster time-to-first-screen, consistent conventions, built-in previews and CI templates.
  - Cons: Potential constraints (locked-in routing patterns, preselected state libraries), may force upgrades or migrations later.
- Greenfield:
  - Pros: Full control, tailored structure for the Query Builder UX, clean dependency slate.
  - Cons: More initial setup; longer time-to-canary.

Key assumptions:
- PRD prefers Next.js and TypeScript (see `docs/prd.md`); recommending a Next.js starter aligns with that assumption.
- Team values rapid previews and Vercel-integrated preview deployments.
- Accessible primitives (Radix + shadcn) are acceptable as the project's UI foundation.

Items needing validation / info requested from you:
- Is there an existing frontend starter or repo to analyze? If yes, provide the link or indicate where it lives.
- If no starter exists, do you accept the recommended starter: Next.js (App Router) + TypeScript + shadcn/ui + Tailwind + Storybook?
- Must Storybook or component-driven development be included in the initial MVP?
- Are there any organizational constraints (for example, specific private UI packages or styling tokens that must be used)?

Detailed rationale for the recommendation (Next.js starter):
- Matches PRD's frontend preference and allows SSR/SSG or hybrid rendering when needed for performance and SEO.
- Integrates tightly with Vercel for PR preview deployments, accelerating the canary feedback loop.
- TypeScript support and shared types with the backend improve DX and reduce drift for visual_spec typing.

Elicitation options (MANDATORY — respond with 1-9):

---

Section: Frontend Tech Stack (ELICITATION REQUIRED)

This section must stay synchronized with the main architecture Tech Stack. Below I propose a definitive frontend tech stack (pinned versions as of Oct 2025). Confirm or change each selection.

Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|---|---:|---:|---|---|
| Framework | Next.js (App Router) | 13.5.4 | App framework, routing, SSR/SSG | Vercel integration, streaming layouts, fast previews |
| Language | TypeScript | 5.4.2 | Strict typing across UI & shared types | Matches backend DX, reduces runtime errors |
| UI Primitives | shadcn/ui + Radix | latest (pin before release) | Accessible primitives & design tokens | Accelerates accessible component composition |
| Styling | Tailwind CSS | 3.4.0 | Utility-first styling & design tokens | Fast iteration and consistent tokens |
| State (server) | TanStack Query | 5.x | Server-state caching, queries & mutations | Centralized fetching, caching, optimistic updates |
| State (local) | Zustand | 4.x | Lightweight local UI state | Simple, minimal boilerplate for local UI state |
| Forms & Validation | React Hook Form + zod | RHF 7.x, zod 4.x | Efficient form handling + schema validation | Performance & strong runtime validation |
| Testing (unit) | Vitest | 1.x | Fast unit tests with Vite | Works well with TS and Next components |
| Testing (E2E) | Playwright | 1.x | Deterministic E2E for critical flows | Cross-browser reliable automation |
| Component Docs | Storybook (optional) | 8.x | Component-driven development & visual review | Useful for design collaboration and review |
| Build / Monorepo tooling | Vercel, Turborepo (optional) | Vercel + Turborepo | Preview builds, caching, workspace orchestration | Enables fast previews and incremental builds |

Rationale & trade-offs

- Next.js + Vercel: fastest path to preview deployments and supports flexible rendering strategies; trade-off: App Router is newer and teams must align on routing patterns.
- shadcn/ui + Radix + Tailwind: accelerates accessible UI creation but requires discipline to keep token and utility usage consistent.
- TanStack Query + Zustand split simplifies server vs local state responsibilities; consider Redux Toolkit if complex cross-cutting client state is anticipated.
- Storybook is optional for MVP but recommended if designers will iterate against components.

Assumptions

- Team is comfortable with TypeScript and React.
- Vercel preview builds are acceptable; if the organization requires a different CI provider, we will adapt build configs accordingly.
- Design tokens or a brand guide may be provided later; initial token set should be included in the Tailwind config.

Items to confirm

- Do we lock to the exact versions above or allow minor patch updates via lockfile?
- Do you want Storybook included in the MVP or deferred to post-canary?
- State management preference: do you accept TanStack Query + Zustand, or prefer Redux Toolkit for more structured state?

Elicitation options (MANDATORY — respond with 1-9):

---

Section: Project Structure (ELICITATION REQUIRED)

Goal: Define an opinionated, developer-friendly folder layout for the Next.js App Router frontend that supports discoverability, testability, and clear boundaries for features vs shared components.

Recommended layout (App Router + feature-first):

```
app/                              # Next.js App Router routes and layouts
  layout.tsx                      # Root layout (providers, global UI)
  page.tsx                        # Root page (dashboard or landing)
  (auth)/                         # optional route group for auth flows
    layout.tsx
    login/page.tsx
  connections/                     # feature route group for Connection Manager
    page.tsx
    components/                    # small feature-scoped components
    tests/                         # feature-specific tests (integration)
components/                        # Reusable UI components (atoms/molecules)
  ui/                              # primitive components (buttons, inputs)
  query/                           # query-builder shared blocks
  schema-explorer/                 # explorer widgets used across features
  tests/                           # unit tests for components
hooks/                              # shared React hooks (useQueryBuilder, useAuth)
lib/                                # utility libraries (api client wrappers, formatters)
styles/                             # tailwind config, global CSS, design tokens
types/                              # shared TypeScript types (visual_spec, api types)
public/                             # static assets (icons, images)
stories/                            # Storybook stories if enabled
tests/                              # global integration/e2e helpers and fixtures
  fixtures/
  e2e/                              # Playwright / test runners
scripts/                            # helper scripts (generate-types, codegen)

```

Conventions & rules

- Feature-first organization: prefer grouping by feature (connections, query, results) under `app/` with feature-scoped components to keep ownership clear and reduce cross-feature coupling.
- Shared components: place truly reusable components under `components/` and keep them framework-agnostic and well-documented in Storybook (if enabled).
- Tests: colocate unit tests with the implementation (e.g., `components/button/Button.test.tsx`) and keep higher-level integration tests under the feature `tests/` directories.
- Types: keep domain types in `types/` and generate API types from OpenAPI into `types/api/` to avoid drift between frontend and backend.
- API interaction: centralize API client configuration in `lib/api.ts` (or `services/`) to ensure auth/headers/idempotency handling is consistent.
- Naming: React components in PascalCase, hooks prefixed with `use`, files kebab-case for pages/routes.
- Storybook: if enabled, each component should include a story and a minimal doc block showing required props and examples.

Monorepo / shared packages notes

- If adopting polyrepo (recommended at system level), publish shared types as a private package (e.g., `@db-hive/types`) consumed by frontend and backend. If adopting monorepo, place shared types under `packages/types` and add workspace references.
- Generated SDKs from `docs/openapi.yaml` should be consumed via `types/api/` or published package to keep contracts in sync.

Items needing validation

- Confirm whether frontend will live in a polyrepo or monorepo (affects where `types/` and generated clients are authored and published).
- Confirm Storybook requirement for MVP (include it in MVP or defer to post-canary).
- Confirm exact naming conventions and any company-wide linting rules to enforce.

Elicitation options (MANDATORY — respond with 1-9):

---

Section: Component Standards (ELICITATION REQUIRED)

Purpose

Define exact, minimal component standards so AI agents and engineers produce consistent, accessible, testable UI components. Keep rules focused on preventing common issues and enabling component reuse.

Critical rules (must-follow)

- Component files / folders:
  - Use a feature-first layout. Place shared, reusable components under `components/` in PascalCase folders (e.g., `components/Button/`).
  - Component entry files: prefer `index.tsx` or `ComponentName.tsx` and a single `index.ts` that exports the component.
- Naming:
  - Component names in PascalCase (e.g., `QueryCard`).
  - Props type named `ComponentNameProps` and exported if reused.
- Props & typing:
  - Always type props with an explicit interface/type. Use optional properties for non-required props.
  - Avoid `any`. Prefer narrow types and reuse shared types from `types/`.
- Styling:
  - Use Tailwind utility classes and CSS variables for tokens. Avoid inline style objects in components except for dynamic CSS variables.
  - Keep className composition via a `cn(...)` helper (e.g., `clsx` or `tailwind-merge`).
- Accessibility:
  - Ensure accessible semantics: use native elements where possible, set meaningful aria-* attributes, and provide keyboard focus handlers when implementing custom controls.
  - All interactive components must accept a `ref` (forwardRef) so they can be focused programmatically.
  - Provide visible focus rings and support high-contrast modes by default.
- Behavior & separation of concerns:
  - Components must be presentational where possible; heavy logic belongs in hooks (`hooks/`) or services (`lib/`).
  - Side-effects and networking must not be performed inside pure UI components.
- Performance:
  - Memoize expensive components with `React.memo` and use `useCallback` / `useMemo` for callback and derived values when necessary.
  - Avoid unnecessary re-renders by keeping prop shapes stable (avoid inline object/array literals in JSX props).
- Logging & debugging:
  - Do not include console.debug/console.log in production code; use structured logger only in application-level code, not components.
- Tests & docs:
  - Each reusable component must include at least one unit test and a Storybook story (if Storybook is enabled).

Component template (TypeScript — minimal, copyable)

```typescript
// components/Button/index.tsx
import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', children, ...rest }, ref) => {
    const base =
      'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium';
    const variantClass =
      variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-900';

    return (
      <button ref={ref} className={`${base} ${variantClass} ${className}`} {...rest}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
```

Storybook story example (if enabled)

```tsx
// components/Button/Button.stories.tsx
import React from 'react';
import { Button } from './index';

export default { title: 'UI/Button', component: Button };

export const Primary = () => <Button variant="primary">Primary</Button>;
```

Unit test example (Vitest + React Testing Library)

```ts
// components/Button/Button.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from './index';

test('renders label', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
});
```

Accessibility checklist for components

- Keyboard operable (tab, enter/space for activation)
- Proper ARIA roles when non-semantic elements are used
- Visible focus styles
- Labels for inputs and meaningful link text
- Screen-reader-friendly order and landmarks

Conventions for complex components (Query Builder blocks / Schema Explorer)

- Create small composable primitives that can be composed into larger blocks (e.g., FieldPicker, ColumnBadge, JoinConnector).
- Keep a serializable `spec` shape for any visual builder state; ensure the component accepts and emits the spec via props/events so it can be saved as `visual_spec`.
- Provide `onChange(spec)` and `onApply()` callbacks; do not mutate passed-in spec objects (treat as immutable).

Documentation & discoverability

- Components must include a short docblock comment describing purpose, public props, and expected behavior.
- Maintain a `components/README.md` with high-level grouping and usage examples for teams and AI agents.

Elicitation options (MANDATORY — respond with 1-9):

---

Section: State Management (ELICITATION REMOVED FROM FILE)

Goal

Define a pragmatic approach to client-side state for DB Hive that balances developer velocity, testability, and the needs of the visual Query Builder (which must serialize state as `visual_spec`). This section documents server-state vs local-state decisions, cache/invalidation strategies, optimistic updates, and examples.

Principles

- Split responsibilities: server-state (remote data) handled by TanStack Query; local UI state (transient canvas state, UI preferences) handled by a lightweight store (Zustand). Keep domain types in `types/` and ensure `visual_spec` shape lives in `types/visual_spec.ts` with a `version` field.
- Keep serializable state serializable: any state that must be saved or shared (SavedQuery.visual_spec) must be a plain JSON-serializable object with a documented version. Components accept and emit spec objects via props/events rather than holding inscrutable internal state.
- Centralize side-effects: network calls, persistence, and billing/LLM budget checks live in services under `lib/` or `services/`. UI components call hooks that encapsulate side-effects.

Server-state (TanStack Query) patterns

- Use descriptive query keys: `['schema', connectionId, snapshotVersion]`, `['savedQueries', orgId]`, `['queryExecution', queryId]`.
- Cache times:
  - Short-lived: query results and live schema previews — staleTime = 30s, cacheTime = 5m (adjustable).
  - Long-lived: saved queries, org-level settings — staleTime = 5m, cacheTime = 30m.
- Invalidation rules:
  - After a successful mutation (e.g., save query), invalidate `['savedQueries', orgId]`.
  - After schema discovery, invalidate `['schema', connectionId]` and refresh the canvas if the user has an open matching saved query (prompt before auto-apply).
- Optimistic updates & rollbacks:
  - Use optimistic updates for quick UX (e.g., saving metadata), but always have rollback handlers that revalidate with server state on error.
  - For expensive operations (exports, large queries), enqueue background job and show progress instead of optimistic immediate success.

Local UI state (Zustand) patterns

- Use a small, focused store for UI-only state that does not need persistence: current canvas selection, UI panels open/closed, transient filters, and editing mode.
- Example store shape:

```ts
// stores/ui.ts
import create from 'zustand';

type UIState = {
  canvasSelection?: string;
  sidebarOpen: boolean;
  setCanvasSelection: (id?: string) => void;
  toggleSidebar: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  canvasSelection: undefined,
  sidebarOpen: true,
  setCanvasSelection: (id) => set({ canvasSelection: id }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
```

Serializing visual_spec

- Provide a single translator layer `lib/visualSpecSerializer.ts` responsible for:
  - Normalizing the in-memory editor state to the `visual_spec` JSON schema used by the backend
  - Validating the `spec.version` and migrating older versions to the current format
  - Ensuring no functions/classes leak into the persisted spec (must be pure JSON)
- Save operations should include `spec_version` and `schema_snapshot_id` to make replays deterministic.

LLM suggestions & state interaction

- LLM suggestions should be produced by the backend adapter and returned as diffs or suggestion objects. Avoid sending entire spec raw to third-party LLMs unless policy/consent permits it; backend should redact PII and enforce budget checks.
- Apply suggestions via an explicit UX flow: show suggestion preview, let user accept (applies to `visual_spec`) or reject. When accepted, execute a mutation that saves both the suggestion audit record and updated `visual_spec`.

Testing & determinism

- Unit test hooks and stores (Zustand only) with deterministic initial state and use Playwright for integration tests covering real flows (canvas editing → save → run).
- For server-state tests, mock TanStack Query's network layer (msw) or run against a deterministic staging backend simulator.

Migration & versioning

- visual_spec MUST include `version` property. When the UI upgrades format, include a migration function in `lib/visualSpecSerializer.ts` and include a migration test that converts an example old spec to the new shape.

Observability & metrics

- Emit client-side events for: canvas.created, canvas.applied, suggestion.applied, query.run.started, query.run.completed, export.requested. These events include minimal non-PII metadata and correlation_id to trace end-to-end.

Accessibility & performance

- Keep in-memory representation light; do not store large result sets in client memory (use pagination and streaming). For large query previews use server-side pagination.

---

Section: API Integration (ELICITATION REMOVED FROM FILE)

Purpose

Define how the frontend interacts with backend APIs securely and consistently. This includes client configuration, auth handling (Clerk), idempotency handling for long-running jobs, and error handling patterns that map to the backend's error model.

Patterns & recommendations

- Centralized API client: export a single `lib/api.ts` that builds and exports a configured fetch/axios client with auth headers, correlation-id propagation, timeout, and retry wrappers.
- Auth & session: validate Clerk session client-side and include the bearer token on requests. Edge-level validation expected server-side; do not trust client-provided org_id.
- Headers & tracing:
  - Always include `X-Correlation-Id` (generate if missing) and `X-Request-Id` where appropriate.
  - Include `Accept: application/json` and `Content-Type: application/json` by default.
- Idempotency & long-running operations:
  - For POST requests that create long-running jobs (exports, schema parsing), include an `Idempotency-Key` header generated by the client or the server to prevent duplicate side-effects on retries.
  - Use a job-polling or event-subscription pattern to receive updates about job progress; prefer web-sockets for bi-directional needs or SSE for one-way updates.
- Retry & error mapping:
  - Implement a retry policy for transient network errors (exponential backoff with jitter) but do NOT retry on 4xx errors except 429 (with Retry-After respect).
  - Map API error payloads to user-friendly messages using `error_code` and `user_message` from the backend; link to developer details via `error_id` when needed.
- Pagination & streaming:
  - Use cursor-based pagination for results endpoints; design the client to stream pages incrementally and render partial UI as data arrives.
  - For very large exports, request an export job and then download a signed URL when ready (do not attempt to stream full dataset into browser memory).

Service template (TypeScript example)

```ts
// lib/api.ts
import axios from 'axios';
import { getClerkToken } from './auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await getClerkToken();
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  // correlation id
  config.headers = config.headers ?? {};
  config.headers['X-Correlation-Id'] = config.headers['X-Correlation-Id'] || generateCorrelationId();
  return config;
});

export default api;

function generateCorrelationId() {
  return 'cid-' + Math.random().toString(36).slice(2, 9);
}
```

Service usage: include typed hooks that wrap API calls (use `react-query` hooks):

```ts
// lib/hooks/useSavedQueries.ts
import { useQuery } from '@tanstack/react-query';
import api from '../api';

export function useSavedQueries(orgId: string) {
  return useQuery(['savedQueries', orgId], async () => {
    const res = await api.get(`/api/v1/saved-queries?orgId=${orgId}`);
    return res.data;
  });
}
```

Error handling UX pattern

- Surface friendly messages for users (`user_message`) and provide a 'Details' view for admins that includes `error_id` and a link to internal logs (requires auth).
- For transient failures (network, 5xx), show a retry option and a short explanation; for quota/LLM budget blocks, show the org admin contact or a cost-control settings link.

Security notes

- Never include API keys or secrets in client code. Use backend adapters for LLM calls and secret retrieval.
- Redact or hash sensitive payloads before sending to third-party services; backend should enforce policy but client can pre-redact when possible.

Testing

- Mock API interactions with `msw` in unit/integration tests to simulate responses and error conditions.
- Provide test fixtures for common API shapes (saved query list, schema snapshot) and test hooks and UI flows that depend on them.

---

Section: Routing (Next.js App Router guidance)

Purpose

Provide concrete routing patterns and guardrails for implementing navigation, protected routes, and dynamic resource pages in the Next.js App Router.

Routing patterns

- Route groups and nested layouts: organize routes via folders in `app/` and use `layout.tsx` files to provide shared UI (providers, shell, sidebars). Use route groups (parentheses) for organizing concerns without affecting the URL.
- Dynamic routes: use bracket syntax for params: `app/connections/[connectionId]/page.tsx` and `app/queries/[queryId]/page.tsx`.
- Segment config: use `loading.tsx` for route-level loading UI and `error.tsx` for per-segment error boundaries.

Protected routes & auth

- Prefer server-side session checks at the edge/middleware for initial routing decisions to avoid flash-of-unauthenticated-content (FOUC). Use Clerk or the chosen auth provider's server-side helpers.
- Client-side guards: for client-rendered pages/components, wrap with a `RequireAuth` component to redirect or show a login flow if the session is missing.

Example: middleware.ts (edge) for org-scoped redirect

```ts
// middleware.ts (root)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export function middleware(req: NextRequest) {
  const { userId } = getAuth(req);
  const url = req.nextUrl.clone();

  // Redirect anonymous users away from protected routes
  if (!userId && url.pathname.startsWith('/app')) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = { matcher: ['/app/:path*'] };
```

Client-side RequireAuth wrapper (simple)

```tsx
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push('/login');
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) return <div>Redirecting...</div>;
  return <>{children}</>;
}
```

Route-level data fetching and caching

- Use server components for data-heavy pages and stream content where helpful. For UI that requires interactivity (canvas), use client components and hydrate with server-provided props.
- Keep data fetching logic in hooks/services and prefer descriptive query keys for caching with TanStack Query when used in client components.

Lazy loading & code-splitting

- Use dynamic imports for heavy components (visual builder, charting libs) to reduce initial bundle size:

```tsx
import dynamic from 'next/dynamic';
const VisualBuilder = dynamic(() => import('../components/visual/VisualBuilder'), {
  ssr: false,
  loading: () => <div>Loading editor...</div>,
});
```

Loading and error UX

- Implement `loading.tsx` files in route segments to show helpful skeletons while server components render.
- Use `error.tsx` per segment to capture errors and provide recovery actions (retry, go back, report with error_id).

SEO, deep-links, and share links

- Support deep-links to saved queries and snapshots: pages like `/saved/[slug]` should render server-side previews and fetch the correct `visual_spec` snapshot.
- Provide canonical metadata in server components (open graph, title, description) for share links and admin previews.

Notes & gotchas

- Beware mixing heavy client components in server pages — mark client components with `'use client'` and keep the server-client boundary minimal.
- For routes that stream large results, prefer server-side streaming endpoints and incremental hydration to avoid loading massive data into the browser.
- Keep routing stable: avoid remapping paths frequently to prevent cache/SEO churn.

---

## Diagrams

Visual references for the architecture and key flows are available in `docs/diagrams/`.

- High-level architecture flowchart: `docs/diagrams/architecture.png`
- Component diagram: `docs/diagrams/components.png`
- Sequence: Run Query flow: `docs/diagrams/sequences-run-query.png`
- Sequence: Save Query + LLM suggestion: `docs/diagrams/sequences-save-query.png`

Render the `.mmd` sources in `docs/diagrams/` if you need editable diagrams.
