# SYSTEM PATTERNS

## Framework
- Mobile: React Native with Expo
- Web: Next.js
- Backend: Supabase (PostgreSQL, Edge Functions, Storage)
- Monorepo: npm workspaces with Turbo

## UI Library
- Custom component library in `packages/ui`
- Tailwind CSS for styling
- Headless UI for accessible components

## State Management
- React Context API for authentication
- React Hooks for local component state
- Supabase for server-side state

## Navigation
- React Navigation for mobile
- Next.js routing for web

## Data Fetching
- Supabase client for database operations
- Custom services in `packages/shared/services`

## Authentication
- Supabase Auth with custom AuthContext
- Role-based access control (RBAC)

## Storage
- Supabase Storage for file uploads
- Secure storage with encryption for sensitive data

## Testing
- Jest for unit tests
- React Testing Library for component tests

## Deployment
- Vercel for web deployment
- Expo for mobile app stores