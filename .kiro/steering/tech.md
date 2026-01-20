---
inclusion: always
---

# DB Hive Technical Guidelines

## Technology Stack

### Frontend (Next.js 15.1.8)
- **Language**: TypeScript 5.9.2 with strict mode enabled
- **UI Framework**: shadcn/ui @0.9.0 with Radix primitives
- **Styling**: Tailwind CSS 4.1.14 with design tokens
- **State Management**: TanStack Query v5.84.1 (server) + Zustand v5.0.8 (client)
- **Forms**: React Hook Form 7.65.0 + Zod 4.0.1 validation
- **Authentication**: Clerk (@clerk/nextjs 6.33.3)

### Backend (Node.js 22.17.0)
- **Architecture**: Serverless functions (Vercel/AWS Lambda)
- **Database**: NeonDB (serverless PostgreSQL)
- **LLM Integration**: OpenAI SDK v6.1.0 (provider-agnostic)
- **Package Manager**: pnpm 10.x with Corepack

### Testing Stack
- **Unit Tests**: Vitest v3.2.4
- **E2E Tests**: Playwright 1.56.0
- **Coverage**: Minimum 70% for core modules

## Code Standards & Patterns

### TypeScript Rules
- Use strict typing throughout - avoid `any` type
- Prefer interfaces over types for object shapes
- Use proper generic constraints and utility types
- Export types alongside implementation code

### Component Conventions
- **Naming**: PascalCase for components (`QueryBuilder.tsx`)
- **Props**: Use `forwardRef` for interactive elements
- **Structure**: Feature-first organization by domain
- **Accessibility**: WCAG AA compliance required

### API & State Management
- **API Client**: Centralized with auth, correlation IDs, retry logic
- **Query State**: Use TanStack Query for server state caching
- **Local State**: Zustand for client-side state (keep serializable)
- **Visual Spec**: Maintain serializable state for query builder

### File & Folder Naming
- **Components**: PascalCase (`components/QueryBuilder/`)
- **Routes**: kebab-case (`connections/`, `saved-queries/`)
- **Utilities**: camelCase (`apiClient.ts`, `formatters.ts`)
- **Tests**: `ComponentName.test.tsx`

## Architecture Principles

### Security First
- **Secrets**: Never store in code - use managed stores only
- **SSH Tunnels**: Ephemeral per-request connections
- **Database Access**: Default to read-only sandbox mode
- **Audit Logging**: Track all connections, queries, exports

### Performance Targets
- Query execution: <5 seconds (95th percentile)
- Schema discovery: <10 seconds for connection tests
- Client pagination: <300ms page renders
- Bundle size: Monitor and optimize regularly

### Repository Structure
- **Polyrepo**: Separate repos for frontend, backend, infrastructure
- **Shared Types**: Published as private packages or workspace refs
- **Feature Organization**: Group by domain (connections, queries, results)

## Development Workflow

### Required Environment Variables
```bash
# .env.local for local development
NEON_DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
LLM_API_KEY=sk-xxxxx
NEXT_PUBLIC_API_BASE=http://localhost:3001
```

### Common Commands
```bash
# Setup
nvm use 22.17.0 && corepack enable
pnpm install

# Development
pnpm dev:frontend    # Next.js dev server
pnpm dev:backend     # Serverless functions locally

# Testing
pnpm test:unit       # Vitest unit tests
pnpm test:e2e        # Playwright E2E tests
pnpm test:integration # With Neon test DB
```

### Testing Strategy
- **Unit**: Components, hooks, utilities with Vitest
- **Integration**: SSH connectivity, schema parsing, query execution
- **E2E**: Critical flows (connect → query → export) with Playwright
- **No Docker**: Use Neon test instances for database testing

## AI Assistant Guidelines

### When Writing Code
- Always use TypeScript with proper typing
- Follow the established file naming conventions
- Implement proper error handling and loading states
- Include accessibility attributes (ARIA labels, keyboard navigation)
- Use the existing UI components from shadcn/ui library

### When Testing
- Write unit tests for new components and utilities
- Use Vitest for unit tests, Playwright for E2E
- Test accessibility features and keyboard navigation
- Mock external services appropriately

### When Working with Database
- Use NeonDB connection patterns established in the codebase
- Implement proper connection pooling and cleanup
- Follow security guidelines for SSH tunneling
- Log all database operations for audit purposes