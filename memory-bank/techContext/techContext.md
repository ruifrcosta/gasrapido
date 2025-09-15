# TECHNICAL CONTEXT

## Platform Information
- OS: Windows 23H2
- Shell: PowerShell
- Node.js: Not installed or not in PATH
- npm: Not installed or not in PATH

## Project Structure
- Monorepo with npm workspaces
- apps/mobile: React Native mobile application
- apps/web: Next.js web application
- packages/shared: Shared types and services
- packages/ui: Shared UI components

## Dependencies
### Root
- turbo: ^1.10.16
- @types/node: ^20.8.0
- typescript: ^5.2.2
- eslint: ^8.51.0
- prettier: ^3.0.3

### Mobile App
- expo: ~49.0.15
- react: 18.2.0
- react-native: 0.72.6
- @react-navigation/native: ^6.1.7
- @supabase/supabase-js: ^2.38.0
- Various Expo modules for camera, location, notifications, etc.

### Web App
- next: 14.0.0
- react: ^18.2.0
- react-dom: ^18.2.0
- next-pwa: ^5.6.0
- @supabase/supabase-js: ^2.38.0
- Tailwind CSS and related packages

### Shared Packages
- @supabase/supabase-js: ^2.38.0
- zod: ^3.22.4
- crypto-js: (used in certification service)

## TypeScript Configuration
- Strict mode enabled
- JSX preserve for web, react-jsx for mobile
- Path aliases for shared packages

## Environment
- No Node.js or npm detected in PATH
- Project dependencies not yet installed