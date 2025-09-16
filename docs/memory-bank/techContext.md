# Technical Context - GasRápido

## Technology Stack

### Frontend
- **Mobile**: React Native with Expo
- **Web**: Next.js 14 with App Router
- **Styling**: TailwindCSS
- **UI Components**: Custom design system
- **Navigation**: React Navigation (mobile), Next.js routing (web)

### Backend
- **Platform**: Supabase
- **Database**: PostgreSQL with PostGIS
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Functions**: Supabase Edge Functions (Deno)
- **Real-time**: Supabase Real-time subscriptions

### Development Tools
- **Monorepo**: Turborepo
- **Language**: TypeScript
- **Package Management**: npm
- **Testing**: Jest
- **Linting**: ESLint, Prettier
- **CI/CD**: GitHub Actions

### Infrastructure
- **Deployment**: Vercel (web), Expo EAS (mobile)
- **Database Hosting**: Supabase
- **Storage**: Supabase Storage
- **Monitoring**: Supabase Analytics

## Development Environment
- Node.js 18+
- npm or yarn
- Supabase CLI
- Expo CLI
- Git for version control

## Key Dependencies
- React and React Native
- Next.js
- Supabase JavaScript client
- TailwindCSS
- React Navigation
- PostGIS for geolocation
- Various utility libraries

## Technical Constraints
- Mobile-first approach required
- Offline capabilities for mobile app
- Real-time updates for order tracking
- Security compliance for financial transactions
- Performance optimization for low-bandwidth environments
- Cross-platform compatibility

## Current State
The development environment is set up with the monorepo structure. Core infrastructure including authentication, database schema, and basic UI components are implemented. Advanced features like AI agents, dynamic pricing, and matching algorithms are in progress.