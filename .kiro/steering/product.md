---
inclusion: always
---

# DB Hive Product Guidelines

DB Hive is a secure web application that enables users to construct database queries through an intuitive visual interface, connect to databases via SSH tunnels, and visualize results with charts and tables.

## Product Principles for AI Development

### Security-First Approach
- **Default to read-only**: All database connections should default to read-only mode
- **SSH tunneling required**: Never allow direct database connections without SSH tunnels
- **Audit everything**: Log all connections, queries, and data exports for compliance
- **Ephemeral connections**: SSH tunnels should be per-request, not persistent
- **Client-side encryption**: Sensitive data should be encrypted before transmission

### User Experience Priorities
- **Visual-first**: Prioritize drag-and-drop query building over raw SQL editing
- **Progressive disclosure**: Show simple options first, advanced features on demand
- **Error prevention**: Use UI constraints to prevent invalid queries before execution
- **Accessibility**: Ensure WCAG AA compliance for all interactive elements
- **Performance**: Query execution should complete within 5 seconds (95th percentile)

### Feature Development Guidelines
- **Offline capability**: Support air-gapped workflows for sensitive environments
- **LLM integration**: Provide contextual query suggestions and error explanations
- **Export flexibility**: Support CSV, JSON, and secure sharing with expiration
- **Multi-database support**: Design for PostgreSQL, MySQL, and future database types
- **Schema discovery**: Automatically parse and visualize database structure

## Target User Personas

### Primary: Technical Users
- Developers and data analysts who need secure, quick database access
- Comfortable with SQL but prefer visual tools for complex queries
- Require audit trails and security compliance for enterprise environments

### Secondary: Business Users
- Analysts and managers who need data insights without SQL expertise
- Rely on visual query builders and AI assistance for query construction
- Need export capabilities for reporting and presentation purposes

## AI Assistant Development Rules

### When Building Features
- Always implement security measures first (SSH, encryption, audit logging)
- Create visual components before adding raw SQL editing capabilities
- Include loading states and error handling for all database operations
- Design for offline mode compatibility from the start
- Add accessibility attributes and keyboard navigation support

### When Writing Code
- Follow the established component patterns for query builder blocks
- Implement proper connection pooling and cleanup for SSH tunnels
- Use TypeScript interfaces for all database schema representations
- Create reusable components for common query operations (filters, joins, aggregations)
- Include comprehensive error messages with suggested fixes

### When Testing
- Test with multiple database types and connection scenarios
- Verify security measures (connection isolation, data encryption)
- Test accessibility features with screen readers and keyboard navigation
- Validate query builder output against expected SQL
- Test offline mode functionality without network dependencies

## Success Criteria for Features

### Performance Targets
- Query execution: <5 seconds (95th percentile)
- Schema discovery: <10 seconds for connection tests
- UI responsiveness: <300ms for query builder interactions
- Export generation: <30 seconds for datasets up to 10MB

### Security Requirements
- All database connections must use SSH tunnels
- Sensitive data encrypted with client-side keys
- Audit logs for all data access and modifications
- Connection credentials never stored in application state
- Read-only database access by default with explicit write permissions

### User Experience Standards
- Visual query builder supports 90% of common SQL operations
- Error messages include actionable suggestions for resolution
- Keyboard navigation available for all interactive elements
- Mobile-responsive design for tablets and larger screens
- Contextual help and tooltips for complex features