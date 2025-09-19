# GasRápido Service Discovery Implementation

## Overview

This document describes the service discovery implementation for the GasRápido platform using HashiCorp Consul. Service discovery is a critical component of the microservices architecture that enables services to dynamically find and communicate with each other.

## Architecture

The service discovery implementation consists of:

1. **Consul Server**: Central service registry running in a Docker container
2. **Service Discovery Client**: TypeScript library in the shared package
3. **Service Registration**: Automatic registration of services on startup
4. **Service Discovery**: Dynamic discovery of services by name
5. **Health Checks**: Continuous monitoring of service health

## Implementation Details

### Consul Configuration

The Consul server is configured through `consul/config/consul.hcl`:

```hcl
datacenter = "gasrapido-dc1"
data_dir = "/consul/data"
ui = true
server = true
bootstrap_expect = 1
bind_addr = "0.0.0.0"
client_addr = "0.0.0.0"
```

### Docker Integration

Consul is integrated into the docker-compose.yml file as a service:

```yaml
consul:
  image: hashicorp/consul:1.16
  ports:
    - "8500:8500"
    - "8600:8600/tcp"
    - "8600:8600/udp"
  volumes:
    - ./consul/config:/consul/config
    - consul_data:/consul/data
  command: agent -server -ui -node=server-1 -bootstrap-expect=1 -client=0.0.0.0 -config-file=/consul/config/consul.hcl
```

### Service Discovery Client

The service discovery client is implemented in `packages/shared/src/services/serviceDiscovery.ts` and provides the following functionality:

1. **Service Registration**: Register services with Consul
2. **Service Deregistration**: Remove services from Consul
3. **Service Discovery**: Find services by name
4. **Health Checks**: Monitor service health
5. **Caching**: Cache service information for performance

### API

The service discovery client exposes the following methods:

```typescript
// Register a service
async registerService(serviceInfo: {
  name: string;
  address: string;
  port: number;
  tags?: string[];
  meta?: Record<string, string>;
}): Promise<boolean>

// Deregister a service
async deregisterService(serviceId: string): Promise<boolean>

// Discover services by name
async discoverService(serviceName: string): Promise<ServiceInfo[]>

// Get all available services
async getAllServices(): Promise<Record<string, string[]>>

// Health check for a service
async checkServiceHealth(serviceId: string): Promise<boolean>

// Get healthy services by name
async getHealthyServices(serviceName: string): Promise<ServiceInfo[]>
```

### Usage Example

To use the service discovery in applications:

```typescript
import { serviceDiscovery } from '@gasrapido/shared';

// Register a service
await serviceDiscovery.registerService({
  name: 'order-service',
  address: 'order-service',
  port: 3001,
  tags: ['backend', 'orders'],
  meta: {
    version: '1.0.0',
    environment: 'production'
  }
});

// Discover a service
const orderServices = await serviceDiscovery.getHealthyServices('order-service');
if (orderServices.length > 0) {
  const service = orderServices[0];
  console.log(`Found service at ${service.Address}:${service.Port}`);
}
```

## Benefits

1. **Dynamic Service Discovery**: Services can find each other without hardcoded addresses
2. **Health Monitoring**: Automatic detection of unhealthy services
3. **Load Balancing**: Integration with load balancing strategies
4. **Fault Tolerance**: Resilient to service failures
5. **Scalability**: Easy to add or remove service instances

## Integration with Existing Services

The service discovery is integrated with:

1. **Web Application**: Registers as 'gasrapido-web'
2. **Mobile Application**: Registers as 'gasrapido-mobile'
3. **Supabase Services**: Database, Auth, and Storage services
4. **Monitoring Services**: Prometheus, Grafana, ELK Stack
5. **Messaging Services**: Redis, RabbitMQ

## Future Enhancements

1. **Automatic Service Registration**: Integration with Kubernetes for automatic registration
2. **Advanced Health Checks**: Custom health check endpoints for each service
3. **Service Mesh**: Integration with Consul Connect for secure service-to-service communication
4. **Multi-Datacenter Support**: Configuration for multi-region deployments
5. **Service Configuration**: Integration with Consul KV store for service configuration

## Conclusion

The service discovery implementation provides a robust foundation for the GasRápido microservices architecture, enabling dynamic service discovery, health monitoring, and fault tolerance. This implementation completes one of the key remaining tasks for the platform and brings it closer to full production readiness.