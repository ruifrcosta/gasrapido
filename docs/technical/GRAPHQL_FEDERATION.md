# GraphQL Federation Implementation

## Overview

This document describes the GraphQL Federation implementation for the GasRápido platform. GraphQL Federation allows us to create a unified GraphQL API that combines multiple GraphQL services (subgraphs) into a single, cohesive API.

## Architecture

The GraphQL Federation architecture consists of:

1. **Subgraphs**: Individual GraphQL services that expose parts of the overall schema
2. **Gateway**: The Apollo Gateway that composes the subgraphs into a unified schema
3. **Supergraph**: The composed schema that clients query against

## Subgraphs

The GasRápido platform has the following subgraphs:

1. **Web Service** (`web`): Handles web application specific functionality
2. **Mobile Service** (`mobile`): Handles mobile application specific functionality

Each subgraph implements part of the overall schema defined in [graphql/schema.graphql](file:///c:/Users/rui.rodrigues/Desktop/GasRapido/graphql/schema.graphql).

## Gateway Implementation

The gateway is implemented using Apollo Gateway and runs as a separate service in the Docker Compose environment.

### Key Features

- Automatic schema composition from subgraphs
- Query planning and execution across multiple services
- Support for entities and references between subgraphs
- Health checks and failover mechanisms

### Configuration

The gateway is configured to connect to the following subgraphs:

```javascript
subgraphs: [
  { name: 'web', url: 'http://web:3000/graphql' },
  { name: 'mobile', url: 'http://mobile:19006/graphql' },
]
```

## Deployment

The GraphQL Gateway is deployed as part of the Docker Compose stack:

```yaml
graphql-gateway:
  build:
    context: ./apps/graphql-gateway
    dockerfile: Dockerfile
  ports:
    - "4000:4000"
  environment:
    - NODE_ENV=production
  depends_on:
    - web
    - mobile
  restart: unless-stopped
```

## Usage

Once deployed, the unified GraphQL API is available at:

```
http://localhost:4000/graphql
```

Clients can query the unified schema as if it were a single GraphQL service.

## Benefits

1. **Separation of Concerns**: Each team can own and develop their subgraph independently
2. **Scalability**: Services can be scaled independently based on demand
3. **Flexibility**: New services can be added to the federation without changing client code
4. **Performance**: Queries are executed in parallel across services when possible
5. **Maintainability**: Smaller, focused schemas are easier to maintain than a single large schema

## Future Enhancements

1. Add more subgraphs for specific domains (e.g., orders, users, payments)
2. Implement distributed tracing for better observability
3. Add caching strategies at the gateway level
4. Implement field-level permissions and authorization