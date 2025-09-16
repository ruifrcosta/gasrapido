# System Patterns - GasRápido

## Architecture Overview
GasRápido follows a monorepo architecture with the following structure:
```
apps/
  mobile/          # React Native PWA application
  web/             # Next.js PWA application
packages/
  shared/          # Shared services and utilities
  ui/              # Reusable UI components
supabase/          # Backend with database and functions
```

## Core Technical Patterns

### Authentication & Authorization
- Multi-factor authentication (MFA) with TOTP, SMS, and email options
- Role-based access control (RBAC) with roles: admin, vendor, courier, client
- Row Level Security (RLS) policies in PostgreSQL database
- Secure storage for sensitive data

### Data Management
- PostgreSQL database with PostGIS for geolocation
- Supabase as the backend platform
- Edge Functions for server-side logic
- Real-time subscriptions for data updates

### Service Layer
- Modular service architecture in shared package
- Each service encapsulates specific business logic
- Services are designed to be reusable across applications
- TypeScript interfaces for type safety

### Component Architecture
- UI components in shared ui package
- Mobile-first design approach
- Responsive components for cross-platform compatibility
- Design system with consistent styling

### AI & Intelligence
- Specialized AI agents for different functions
- Intelligence engine for decision-making
- Machine learning models for pricing and matching
- Anomaly detection for fraud prevention

## Integration Patterns

### External Services
- Google Maps for geolocation and routing
- Payment providers for transaction processing
- SMS/email services for notifications
- Cloud storage for document management

### Internal Communication
- REST APIs for synchronous operations
- Real-time subscriptions for updates
- Event-driven architecture for background processing
- Shared database for data consistency

## Security Patterns
- End-to-end encryption for sensitive data
- Regular security audits and compliance checks
- Backup and disaster recovery systems
- Monitoring and alerting for suspicious activities

## Deployment Patterns
- Continuous integration and deployment (CI/CD)
- Environment-specific configurations
- Automated testing in deployment pipeline
- Monitoring and logging for all services