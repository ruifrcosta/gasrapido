// @ts-ignore
import { serviceDiscovery } from '../../../packages/shared/src';

/**
 * Initialize service discovery for the web application
 */
export async function initializeServiceDiscovery() {
  try {
    // Register the web service
    const success = await serviceDiscovery.registerService({
      name: 'gasrapido-web',
      address: 'web', // This will be the docker service name
      port: 3000,
      tags: ['frontend', 'web'],
      meta: {
        version: '1.0.0',
        // @ts-ignore
        environment: process.env.NODE_ENV || 'development'
      }
    });

    if (success) {
      console.log('Web service registered with Consul');
    } else {
      console.error('Failed to register web service with Consul');
    }
  } catch (error) {
    console.error('Error initializing service discovery:', error);
  }
}

/**
 * Discover a service by name
 */
export async function discoverService(serviceName: string) {
  try {
    const services = await serviceDiscovery.getHealthyServices(serviceName);
    return services;
  } catch (error) {
    console.error(`Error discovering service ${serviceName}:`, error);
    return [];
  }
}

/**
 * Get all available services
 */
export async function getAllServices() {
  try {
    const services = await serviceDiscovery.getAllServices();
    return services;
  } catch (error) {
    console.error('Error getting all services:', error);
    return {};
  }
}

/**
 * Deregister the web service on shutdown
 */
export async function deregisterService() {
  try {
    const success = await serviceDiscovery.deregisterService('gasrapido-web');
    if (success) {
      console.log('Web service deregistered from Consul');
    } else {
      console.error('Failed to deregister web service from Consul');
    }
  } catch (error) {
    console.error('Error deregistering service:', error);
  }
}