// Serviço para gerenciar geolocalização no GasRápido
export interface Location {
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy?: number;
  altitude?: number;
  speed?: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  formatted: string;
}

export interface Geofence {
  id: string;
  name: string;
  center: Location;
  radius: number; // em metros
  active: boolean;
}

class GeolocationService {
  // Simular posição atual (em uma implementação real, isso viria do dispositivo)
  private currentLocation: Location | null = null;

  // Geofences ativas
  private geofences: Geofence[] = [];

  // Obter posição atual do usuário
  async getCurrentLocation(): Promise<Location> {
    // Em uma implementação real, isso usaria APIs de geolocalização do dispositivo
    await this.simulateApiCall();
    
    // Simular posição atual (Lisboa, Portugal)
    this.currentLocation = {
      latitude: 38.7223,
      longitude: -9.1393,
      timestamp: new Date().toISOString(),
      accuracy: 10,
      altitude: 50,
      speed: 0
    };
    
    return this.currentLocation;
  }

  // Obter endereço a partir de coordenadas (geocodificação reversa)
  async reverseGeocode(location: Location): Promise<Address> {
    await this.simulateApiCall();
    
    // Simular resultado de geocodificação reversa
    return {
      street: 'Rua Augusta',
      city: 'Lisboa',
      state: 'Lisboa',
      country: 'Portugal',
      postalCode: '1100-001',
      formatted: 'Rua Augusta, 1100-001 Lisboa, Portugal'
    };
  }

  // Obter coordenadas a partir de um endereço (geocodificação)
  async geocode(address: string): Promise<Location> {
    await this.simulateApiCall();
    
    // Simular resultado de geocodificação
    return {
      latitude: 38.7223,
      longitude: -9.1393,
      timestamp: new Date().toISOString()
    };
  }

  // Calcular distância entre dois pontos (em metros)
  calculateDistance(location1: Location, location2: Location): number {
    const R = 6371e3; // Raio da Terra em metros
    const φ1 = location1.latitude * Math.PI/180;
    const φ2 = location2.latitude * Math.PI/180;
    const Δφ = (location2.latitude-location1.latitude) * Math.PI/180;
    const Δλ = (location2.longitude-location1.longitude) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  // Verificar se uma localização está dentro de uma geofence
  isLocationInGeofence(location: Location, geofence: Geofence): boolean {
    const distance = this.calculateDistance(location, geofence.center);
    return distance <= geofence.radius;
  }

  // Criar uma nova geofence
  async createGeofence(
    name: string,
    center: Location,
    radius: number
  ): Promise<Geofence> {
    await this.simulateApiCall();
    
    const geofence: Geofence = {
      id: this.generateId(),
      name,
      center,
      radius,
      active: true
    };
    
    this.geofences.push(geofence);
    return geofence;
  }

  // Atualizar uma geofence existente
  async updateGeofence(
    id: string,
    updates: Partial<Omit<Geofence, 'id'>>
  ): Promise<Geofence | null> {
    await this.simulateApiCall();
    
    const index = this.geofences.findIndex(g => g.id === id);
    if (index !== -1) {
      this.geofences[index] = { ...this.geofences[index], ...updates };
      return this.geofences[index];
    }
    
    return null;
  }

  // Remover uma geofence
  async removeGeofence(id: string): Promise<boolean> {
    await this.simulateApiCall();
    
    const initialLength = this.geofences.length;
    this.geofences = this.geofences.filter(g => g.id !== id);
    
    return this.geofences.length < initialLength;
  }

  // Obter todas as geofences
  async getGeofences(): Promise<Geofence[]> {
    await this.simulateApiCall();
    return [...this.geofences];
  }

  // Obter geofences ativas
  async getActiveGeofences(): Promise<Geofence[]> {
    await this.simulateApiCall();
    return this.geofences.filter(g => g.active);
  }

  // Verificar se a localização atual está em alguma geofence ativa
  async checkGeofenceBoundaries(location: Location): Promise<Geofence[]> {
    await this.simulateApiCall();
    
    const activeGeofences = await this.getActiveGeofences();
    return activeGeofences.filter(g => this.isLocationInGeofence(location, g));
  }

  // Calcular tempo estimado de chegada (em minutos)
  async calculateETA(
    origin: Location,
    destination: Location,
    speed: number = 30 // km/h
  ): Promise<number> {
    await this.simulateApiCall();
    
    const distance = this.calculateDistance(origin, destination) / 1000; // converter para km
    return (distance / speed) * 60; // converter para minutos
  }

  // Obter direções entre dois pontos
  async getDirections(
    origin: Location,
    destination: Location
  ): Promise<any> {
    await this.simulateApiCall();
    
    // Simular resultado de direções
    return {
      distance: this.calculateDistance(origin, destination),
      duration: await this.calculateETA(origin, destination),
      steps: [
        {
          instruction: 'Siga em frente por 200 metros',
          distance: 200,
          duration: 2
        },
        {
          instruction: 'Vire à direita na Rua Nova',
          distance: 150,
          duration: 1.5
        }
      ]
    };
  }

  // Métodos auxiliares
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private async simulateApiCall(): Promise<void> {
    // Simular latência de rede
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export default new GeolocationService();