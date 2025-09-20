# Setup Guides

This directory contains setup and configuration guides for the GasRápido platform.

## Available Guides

### Environment Configuration
- **[Environment Configuration Summary](ENV_CONFIGURATION_SUMMARY.md)** - Overview of existing environment configuration
- **[Final Setup Summary](FINAL_SETUP_SUMMARY.md)** - Comprehensive setup completion summary
- **[Quick Setup Reference](QUICK_SETUP_REFERENCE.md)** - Quick reference for common setup tasks

### Complete Setup Guide
For the most comprehensive setup guide, see [Complete Environment Setup Guide](../COMPLETE_ENVIRONMENT_SETUP_GUIDE.md) in the main docs directory.

## Setup Process Overview

1. **Environment Variables**: Configure all required environment variables for Supabase, external APIs, and services
2. **Database Migration**: Run database migrations to set up the complete schema
3. **Service Configuration**: Configure all microservices and external integrations
4. **Development Environment**: Set up local development environment with hot reload
5. **Production Deployment**: Deploy to production with proper security configurations

## Quick Start

For a quick start, follow these steps:

1. Copy `.env.example` to `.env` and configure your environment variables
2. Run database migrations: `npm run migrate`
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`

For detailed instructions, refer to the individual guide documents in this directory.