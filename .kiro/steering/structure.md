---
inclusion: always
---

# DB Hive Project Structure & Organization

## Repository Layout

This is a multi-repository structure with separate repositories for different concerns:

```
db_hive/                          # Root repository (documentation, coordination)
├── .bmad-core/                   # Framework (agents, workflows, templates)
├── .kiro/steering/               # AI assistant steering rules
├── docs/                         # Architecture, PRD, operational guides, diagrams
├── db-hive-frontend/             # Next.js application (separate repo)
├── db-hive-backend/              # Serverless functions (separate repo)
├── db-hive-infra/                # Infrastructure as Code (separate repo)
├── scripts/                      # Build, validation, promotion scripts
└── tests/                        # Cross-service integration tests
```

## Frontend Structure (Next.js App Router)

**CRITICAL**: Always use Next.js App Router patterns, not Pages Router.

```
app/                              # Next.js App Router routes
├── layout.tsx                    # Root layout with providers
├── page.tsx                      # Dashboard/landing page
├── (auth)/                       # Auth route group
├── connections/                  # Connection Manager feature
│   ├── page.tsx
│   ├── components/               # Feature-scoped components
│   └── tests/                    # Feature integration tests
└── queries/                      # Query Builder feature

components/                       # Reusable UI components
├── ui/                          # Primitive components (buttons, inputs)
├── query/                       # Query builder blocks
└── schema-explorer/             # Schema navigation widgets

hooks/                           # Shared React hooks
lib/                            # Utilities, API clients, formatters
types/                          # Shared TypeScript definitions
styles/                         # Tailwind config, design tokens
public/                         # Static assets
stories/                        # Storybook stories (if enabled)
tests/                          # E2E tests and fixtures
```

## Backend Structure (Serverless)

```
functions/                       # Serverless function handlers
├── health/                     # Health check endpoint
├── connections/                # Connection management
├── queries/                    # Query execution proxy
├── schema/                     # Schema discovery and parsing
└── llm/                       # LLM adapter and suggestions

src/                            # Shared business logic
├── health.js                   # Health check utilities
├── telemetry.js               # Observability helpers
├── ssh/                       # SSH tunnel management
├── parsers/                   # Schema parsing utilities
└── adapters/                  # LLM provider adapters

tests/                         # Unit and integration tests
├── unit/                      # Component tests
└── fixtures/                  # Test data and mocks
```

## AI Assistant Guidelines

### When Creating New Files
1. **Always follow the established directory structure**
2. **Use correct file naming conventions** (see below)
3. **Place files in feature-appropriate locations**
4. **Create barrel exports for new component directories**

### When Working with Features
- **Group related functionality together** (connections, queries, results)
- **Keep feature-scoped components within feature directories**
- **Minimize cross-feature dependencies**
- **Use feature-first organization over technical grouping**

### Security Requirements
- **Never store secrets in application code**
- **Implement client-side encryption for sensitive uploads**
- **Add audit logging for all data access and modifications**
- **Default to read-only for external database connections**

## File Naming Conventions

### Components (REQUIRED)
- **React components**: PascalCase (`QueryBuilder.tsx`)
- **Component folders**: PascalCase (`components/QueryBuilder/`)
- **Hooks**: camelCase with `use` prefix (`useQueryBuilder.ts`)
- **Utilities**: camelCase (`apiClient.ts`)

### Routes and Pages (REQUIRED)
- **Route folders**: kebab-case (`connections/`, `saved-queries/`)
- **Page files**: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- **API routes**: kebab-case (`api/saved-queries/route.ts`)

### Tests and Stories (REQUIRED)
- **Test files**: `ComponentName.test.tsx`
- **Story files**: `ComponentName.stories.tsx`
- **E2E tests**: Descriptive names (`user-can-create-query.spec.ts`)

## Import and Export Patterns

### Barrel Exports (REQUIRED for new component directories)
```typescript
// components/index.ts
export { Button } from './Button';
export { QueryBuilder } from './QueryBuilder';
export { SchemaExplorer } from './SchemaExplorer';
```

### Import Rules
- **Use relative imports within features**
- **Use absolute imports for shared utilities**
- **Prefer named exports over default exports**
- **Import types separately when possible**

### Type Definitions
```typescript
// types/visual-spec.ts
export interface VisualSpec {
  version: string;
  tables: TableSpec[];
  joins: JoinSpec[];
  filters: FilterSpec[];
}
```

## Architecture Patterns

### Separation of Concerns
- **Frontend**: UI components, state management, user interactions
- **Backend**: Business logic, external integrations, data processing
- **Infrastructure**: Deployment, monitoring, secrets management
- **Documentation**: Architecture decisions, operational procedures

### Shared Resources
- **Types**: Published as private packages or workspace references
- **Design tokens**: Centralized in Tailwind config
- **API contracts**: Generated from OpenAPI specifications
- **Test fixtures**: Reusable across services

This structure supports rapid development while maintaining clear boundaries and enabling independent deployment of services.