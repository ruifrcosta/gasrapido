import axios from 'axios';

export interface ServiceInfo {
  ID: string;
  Service: string;
  Address: string;
  Port: number;
  Tags: string[];
  Meta: Record<string, string>;
}

export class ServiceDiscovery {
  private consulUrl: string;
  private services: Map<string, ServiceInfo[]> = new Map();

  constructor(consulUrl?: string) {
    this.consulUrl = consulUrl || process.env.CONSUL_HTTP_ADDR || 'http://localhost:8500';
  }

  /**
   * Register a service with Consul
   */
  async registerService(serviceInfo: {
    name: string;
    address: string;
    port: number;
    tags?: string[];
    meta?: Record<string, string>;
  }): Promise<boolean> {
    try {
      const serviceData = {
        Name: serviceInfo.name,
        Address: serviceInfo.address,
        Port: serviceInfo.port,
        Tags: serviceInfo.tags || [],
        Meta: serviceInfo.meta || {}
      };

      await axios.put(`${this.consulUrl}/v1/agent/service/register`, serviceData);
      console.log(`Service ${serviceInfo.name} registered successfully`);
      return true;
    } catch (error) {
      console.error(`Failed to register service ${serviceInfo.name}:`, error);
      return false;
    }
  }

  /**
   * Deregister a service from Consul
   */
  async deregisterService(serviceId: string): Promise<boolean> {
    try {
      await axios.put(`${this.consulUrl}/v1/agent/service/deregister/${serviceId}`);
      console.log(`Service ${serviceId} deregistered successfully`);
      return true;
    } catch (error) {
      console.error(`Failed to deregister service ${serviceId}:`, error);
      return false;
    }
  }

  /**
   * Discover services by name
   */
  async discoverService(serviceName: string): Promise<ServiceInfo[]> {
    try {
      // Check if we have cached services
      if (this.services.has(serviceName)) {
        return this.services.get(serviceName) || [];
      }

      // Fetch services from Consul
      const response = await axios.get(`${this.consulUrl}/v1/catalog/service/${serviceName}`);
      const services: ServiceInfo[] = response.data;

      // Cache the services
      this.services.set(serviceName, services);

      return services;
    } catch (error) {
      console.error(`Failed to discover service ${serviceName}:`, error);
      return [];
    }
  }

  /**
   * Get all available services
   */
  async getAllServices(): Promise<Record<string, string[]>> {
    try {
      const response = await axios.get(`${this.consulUrl}/v1/catalog/services`);
      return response.data;
    } catch (error) {
      console.error('Failed to get all services:', error);
      return {};
    }
  }

  /**
   * Health check for a service
   */
  async checkServiceHealth(serviceId: string): Promise<boolean> {
    try {
      const response = await axios.get(`${this.consulUrl}/v1/health/checks/${serviceId}`);
      const checks = response.data;
      
      // Check if all checks are passing
      return checks.every((check: any) => check.Status === 'passing');
    } catch (error) {
      console.error(`Failed to check health for service ${serviceId}:`, error);
      return false;
    }
  }

  /**
   * Get healthy services by name
   */
  async getHealthyServices(serviceName: string): Promise<ServiceInfo[]> {
    try {
      const response = await axios.get(`${this.consulUrl}/v1/health/service/${serviceName}?passing=true`);
      const services: ServiceInfo[] = response.data.map((item: any) => ({
        ID: item.Service.ID,
        Service: item.Service.Service,
        Address: item.Service.Address,
        Port: item.Service.Port,
        Tags: item.Service.Tags,
        Meta: item.Service.Meta
      }));

      return services;
    } catch (error) {
      console.error(`Failed to get healthy services for ${serviceName}:`, error);
      return [];
    }
  }

  /**
   * Clear service cache
   */
  clearCache(): void {
    this.services.clear();
  }
}

// Export a singleton instance
export default new ServiceDiscovery();