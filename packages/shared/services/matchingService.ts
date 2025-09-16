import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import geolocationService from './geolocationService';

// Tipo de localização compatível com o serviço de geolocalização
interface Location {
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy?: number;
  altitude?: number;
  speed?: number;
}

// Tipo de localização simplificada usada no matching
interface SimpleLocation {
  lat: number;
  lng: number;
}

// Função utilitária para converter SimpleLocation para Location
function simpleToLocation(simple: SimpleLocation): Location {
  return {
    latitude: simple.lat,
    longitude: simple.lng,
    timestamp: new Date().toISOString()
  };
}

// Função utilitária para calcular distância entre SimpleLocation
function calculateSimpleDistance(loc1: SimpleLocation, loc2: SimpleLocation): number {
  const R = 6371e3; // Raio da Terra em metros
  const φ1 = loc1.lat * Math.PI/180;
  const φ2 = loc2.lat * Math.PI/180;
  const Δφ = (loc2.lat-loc1.lat) * Math.PI/180;
  const Δλ = (loc2.lng-loc1.lng) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

// Tipos para o sistema de matching
export interface Order {
  id: string;
  clientId: string;
  supplierId?: string;
  courierId?: string;
  pickupLocation: SimpleLocation;
  deliveryLocation: SimpleLocation;
  status: 'pending' | 'matched' | 'assigned' | 'in_progress' | 'delivered' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  estimatedDeliveryTime?: string;
  distance?: number;
  estimatedCost?: number;
}

export interface Supplier {
  id: string;
  name: string;
  location: SimpleLocation;
  availability: boolean;
  rating: number;
  capacity: number;
  currentLoad: number;
  specialties: string[];
  operatingHours: { open: string; close: string };
}

export interface Courier {
  id: string;
  name: string;
  location: SimpleLocation;
  availability: boolean;
  rating: number;
  vehicleType: 'bike' | 'motorcycle' | 'car';
  capacity: number;
  currentLoad: number;
  operatingHours: { open: string; close: string };
}

export interface Cell {
  id: string;
  name: string;
  center: SimpleLocation;
  radius: number; // em metros
  suppliers: string[]; // IDs dos fornecedores na célula
  couriers: string[]; // IDs dos entregadores na célula
  isActive: boolean;
}

export interface MatchResult {
  orderId: string;
  supplierId?: string;
  courierId?: string;
  estimatedTime: number; // em minutos
  estimatedCost: number;
  distance: number; // em metros
  confidence: number; // 0-1
  fallbackUsed: boolean;
}

export interface RoutingResult {
  orderId: string;
  route: Array<SimpleLocation>;
  waypoints: Array<{ 
    type: 'pickup' | 'delivery' | 'intermediate'; 
    location: SimpleLocation;
    estimatedArrival: string;
  }>;
  totalDistance: number; // em metros
  estimatedDuration: number; // em minutos
  optimized: boolean;
}

export class MatchingService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = supabase;
  }

  /**
   * Encontra o melhor fornecedor para um pedido
   */
  async findBestSupplier(order: Order): Promise<{ supplierId: string; confidence: number } | null> {
    try {
      // Obter fornecedores disponíveis
      const suppliers = await this.getAvailableSuppliers(order.pickupLocation);
      
      if (suppliers.length === 0) {
        return null;
      }
      
      // Calcular pontuações para cada fornecedor
      const scoredSuppliers = suppliers.map(supplier => {
        const distance = calculateSimpleDistance(
          order.pickupLocation,
          supplier.location
        );
        
        // Fatores de pontuação:
        // 1. Distância (40%)
        const distanceScore = Math.max(0, 1 - (distance / 10000)); // Normalizar para 10km
        
        // 2. Rating (30%)
        const ratingScore = supplier.rating / 5;
        
        // 3. Capacidade disponível (20%)
        const capacityScore = Math.max(0, 1 - (supplier.currentLoad / supplier.capacity));
        
        // 4. Especialidades (10%)
        const specialtyScore = this.calculateSpecialtyMatch(order, supplier);
        
        // Pontuação final ponderada
        const totalScore = (
          distanceScore * 0.4 +
          ratingScore * 0.3 +
          capacityScore * 0.2 +
          specialtyScore * 0.1
        );
        
        return {
          supplier,
          score: totalScore,
          distance
        };
      });
      
      // Ordenar por pontuação
      scoredSuppliers.sort((a, b) => b.score - a.score);
      
      // Retornar o melhor fornecedor
      const bestSupplier = scoredSuppliers[0];
      return {
        supplierId: bestSupplier.supplier.id,
        confidence: bestSupplier.score
      };
    } catch (error) {
      console.error('Erro ao encontrar fornecedor:', error);
      return null;
    }
  }

  /**
   * Encontra o melhor entregador para um pedido
   */
  async findBestCourier(order: Order, supplierLocation: { lat: number; lng: number }): Promise<{ courierId: string; confidence: number } | null> {
    try {
      // Obter entregadores disponíveis
      const couriers = await this.getAvailableCouriers(order.deliveryLocation);
      
      if (couriers.length === 0) {
        return null;
      }
      
      // Calcular pontuações para cada entregador
      const scoredCouriers = couriers.map(courier => {
        // Distância do fornecedor ao entregador
        const supplierToCourierDistance = calculateSimpleDistance(
          supplierLocation,
          courier.location
        );
        
        // Distância do entregador ao cliente
        const courierToClientDistance = calculateSimpleDistance(
          courier.location,
          order.deliveryLocation
        );
        
        // Distância total
        const totalDistance = supplierToCourierDistance + courierToClientDistance;
        
        // Fatores de pontuação:
        // 1. Distância total (40%)
        const distanceScore = Math.max(0, 1 - (totalDistance / 20000)); // Normalizar para 20km
        
        // 2. Rating (25%)
        const ratingScore = courier.rating / 5;
        
        // 3. Capacidade disponível (15%)
        const capacityScore = Math.max(0, 1 - (courier.currentLoad / courier.capacity));
        
        // 4. Tipo de veículo (10%)
        const vehicleScore = this.calculateVehicleMatch(order, courier);
        
        // 5. Tempo estimado (10%)
        const timeScore = Math.max(0, 1 - (totalDistance / 5000)); // Assumindo 5km como tempo ideal
        
        // Pontuação final ponderada
        const totalScore = (
          distanceScore * 0.4 +
          ratingScore * 0.25 +
          capacityScore * 0.15 +
          vehicleScore * 0.1 +
          timeScore * 0.1
        );
        
        return {
          courier,
          score: totalScore,
          distance: totalDistance
        };
      });
      
      // Ordenar por pontuação
      scoredCouriers.sort((a, b) => b.score - a.score);
      
      // Retornar o melhor entregador
      const bestCourier = scoredCouriers[0];
      return {
        courierId: bestCourier.courier.id,
        confidence: bestCourier.score
      };
    } catch (error) {
      console.error('Erro ao encontrar entregador:', error);
      return null;
    }
  }

  /**
   * Realiza matching completo de um pedido
   */
  async matchOrder(orderId: string): Promise<MatchResult | null> {
    try {
      // Obter detalhes do pedido
      const order = await this.getOrderById(orderId);
      if (!order) {
        throw new Error('Pedido não encontrado');
      }
      
      // Encontrar fornecedor
      const supplierMatch = await this.findBestSupplier(order);
      if (!supplierMatch) {
        // Tentar fallback para células vizinhas
        const fallbackSupplier = await this.findFallbackSupplier(order);
        if (!fallbackSupplier) {
          return null;
        }
        
        return {
          orderId: order.id,
          supplierId: fallbackSupplier.supplierId,
          estimatedTime: 30, // estimativa padrão
          estimatedCost: 0,
          distance: 0,
          confidence: fallbackSupplier.confidence,
          fallbackUsed: true
        };
      }
      
      // Obter localização do fornecedor
      const supplier = await this.getSupplierById(supplierMatch.supplierId);
      if (!supplier) {
        throw new Error('Fornecedor não encontrado');
      }
      
      // Encontrar entregador
      const courierMatch = await this.findBestCourier(order, supplier.location);
      if (!courierMatch) {
        // Tentar fallback para células vizinhas
        const fallbackCourier = await this.findFallbackCourier(order, supplier.location);
        if (!fallbackCourier) {
          return {
            orderId: order.id,
            supplierId: supplierMatch.supplierId,
            estimatedTime: 45, // estimativa padrão
            estimatedCost: 0,
            distance: 0,
            confidence: supplierMatch.confidence,
            fallbackUsed: false
          };
        }
        
        return {
          orderId: order.id,
          supplierId: supplierMatch.supplierId,
          courierId: fallbackCourier.courierId,
          estimatedTime: 60, // estimativa padrão
          estimatedCost: 0,
          distance: 0,
          confidence: (supplierMatch.confidence + fallbackCourier.confidence) / 2,
          fallbackUsed: true
        };
      }
      
      // Calcular distância e tempo estimados
      const distance = calculateSimpleDistance(
        order.pickupLocation,
        order.deliveryLocation
      );
      
      // Estimativa simples de tempo (30 min por 10km + 15 min para processamento)
      const estimatedTime = (distance / 1000) * 3 + 15;
      
      return {
        orderId: order.id,
        supplierId: supplierMatch.supplierId,
        courierId: courierMatch.courierId,
        estimatedTime,
        estimatedCost: 0, // Será calculado pelo serviço de precificação
        distance,
        confidence: (supplierMatch.confidence + courierMatch.confidence) / 2,
        fallbackUsed: false
      };
    } catch (error) {
      console.error('Erro ao realizar matching do pedido:', error);
      return null;
    }
  }

  /**
   * Gera rota otimizada para um pedido
   */
  async generateRoute(orderId: string): Promise<RoutingResult | null> {
    try {
      // Obter detalhes do pedido
      const order = await this.getOrderById(orderId);
      if (!order) {
        throw new Error('Pedido não encontrado');
      }
      
      // Obter fornecedor e entregador atribuídos
      const supplier = order.supplierId ? await this.getSupplierById(order.supplierId) : null;
      const courier = order.courierId ? await this.getCourierById(order.courierId) : null;
      
      if (!supplier || !courier) {
        throw new Error('Fornecedor ou entregador não encontrado');
      }
      
      // Criar waypoints
      const waypoints = [
        {
          type: 'pickup' as const,
          location: supplier.location,
          estimatedArrival: new Date().toISOString()
        },
        {
          type: 'delivery' as const,
          location: order.deliveryLocation,
          estimatedArrival: new Date(Date.now() + 30 * 60000).toISOString() // +30 minutos
        }
      ];
      
      // Calcular distância total
      const totalDistance = calculateSimpleDistance(
        supplier.location,
        order.deliveryLocation
      );
      
      // Estimativa de duração (30 min por 10km)
      const estimatedDuration = (totalDistance / 1000) * 3;
      
      return {
        orderId: order.id,
        route: [
          supplier.location,
          order.deliveryLocation
        ],
        waypoints,
        totalDistance,
        estimatedDuration,
        optimized: true
      };
    } catch (error) {
      console.error('Erro ao gerar rota:', error);
      return null;
    }
  }

  /**
   * Obtém fornecedores disponíveis próximos a uma localização
   */
  private async getAvailableSuppliers(location: { lat: number; lng: number }): Promise<Supplier[]> {
    try {
      // Em uma implementação real, isso consultaria o banco de dados
      // Por enquanto, vamos simular com dados fictícios
      
      // Simular chamada à API
      await this.simulateApiCall();
      
      // Retornar fornecedores fictícios
      return [
        {
          id: 'supplier-1',
          name: 'Fornecedor Central',
          location: { lat: location.lat + 0.001, lng: location.lng + 0.001 },
          availability: true,
          rating: 4.8,
          capacity: 100,
          currentLoad: 30,
          specialties: ['botija_13kg', 'botija_6kg'],
          operatingHours: { open: '08:00', close: '20:00' }
        },
        {
          id: 'supplier-2',
          name: 'Fornecedor Norte',
          location: { lat: location.lat + 0.005, lng: location.lng - 0.002 },
          availability: true,
          rating: 4.5,
          capacity: 80,
          currentLoad: 20,
          specialties: ['botija_13kg'],
          operatingHours: { open: '07:00', close: '19:00' }
        }
      ];
    } catch (error) {
      console.error('Erro ao obter fornecedores:', error);
      return [];
    }
  }

  /**
   * Obtém entregadores disponíveis próximos a uma localização
   */
  private async getAvailableCouriers(location: { lat: number; lng: number }): Promise<Courier[]> {
    try {
      // Em uma implementação real, isso consultaria o banco de dados
      // Por enquanto, vamos simular com dados fictícios
      
      // Simular chamada à API
      await this.simulateApiCall();
      
      // Retornar entregadores fictícios
      return [
        {
          id: 'courier-1',
          name: 'Entregador João',
          location: { lat: location.lat - 0.002, lng: location.lng + 0.003 },
          availability: true,
          rating: 4.9,
          vehicleType: 'motorcycle',
          capacity: 5,
          currentLoad: 2,
          operatingHours: { open: '09:00', close: '21:00' }
        },
        {
          id: 'courier-2',
          name: 'Entregadora Maria',
          location: { lat: location.lat + 0.004, lng: location.lng - 0.001 },
          availability: true,
          rating: 4.7,
          vehicleType: 'bike',
          capacity: 3,
          currentLoad: 1,
          operatingHours: { open: '08:00', close: '20:00' }
        }
      ];
    } catch (error) {
      console.error('Erro ao obter entregadores:', error);
      return [];
    }
  }

  /**
   * Encontra fornecedor em células vizinhas (fallback)
   */
  private async findFallbackSupplier(order: Order): Promise<{ supplierId: string; confidence: number } | null> {
    try {
      // Obter célula atual do pedido
      const currentCell = await this.getCellForLocation(order.pickupLocation);
      if (!currentCell) {
        return null;
      }
      
      // Obter células vizinhas
      const neighborCells = await this.getNeighborCells(currentCell.id);
      
      // Procurar fornecedores nas células vizinhas
      for (const cell of neighborCells) {
        const suppliers = await this.getSuppliersInCell(cell.id);
        if (suppliers.length > 0) {
          // Retornar o primeiro fornecedor encontrado
          return {
            supplierId: suppliers[0].id,
            confidence: 0.7 // Confiança menor para fallback
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao encontrar fornecedor fallback:', error);
      return null;
    }
  }

  /**
   * Encontra entregador em células vizinhas (fallback)
   */
  private async findFallbackCourier(order: Order, supplierLocation: { lat: number; lng: number }): Promise<{ courierId: string; confidence: number } | null> {
    try {
      // Obter célula atual do fornecedor
      const currentCell = await this.getCellForLocation(supplierLocation);
      if (!currentCell) {
        return null;
      }
      
      // Obter células vizinhas
      const neighborCells = await this.getNeighborCells(currentCell.id);
      
      // Procurar entregadores nas células vizinhas
      for (const cell of neighborCells) {
        const couriers = await this.getCouriersInCell(cell.id);
        if (couriers.length > 0) {
          // Retornar o primeiro entregador encontrado
          return {
            courierId: couriers[0].id,
            confidence: 0.7 // Confiança menor para fallback
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao encontrar entregador fallback:', error);
      return null;
    }
  }

  /**
   * Obtém um pedido pelo ID
   */
  private async getOrderById(orderId: string): Promise<Order | null> {
    try {
      // Em uma implementação real, isso consultaria o banco de dados
      // Por enquanto, vamos simular com dados fictícios
      
      // Simular chamada à API
      await this.simulateApiCall();
      
      // Retornar pedido fictício
      return {
        id: orderId,
        clientId: 'client-1',
        pickupLocation: { lat: -8.839, lng: 13.289 }, // Luanda, Angola
        deliveryLocation: { lat: -8.835, lng: 13.290 },
        status: 'pending',
        priority: 'medium',
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erro ao obter pedido:', error);
      return null;
    }
  }

  /**
   * Obtém um fornecedor pelo ID
   */
  private async getSupplierById(supplierId: string): Promise<Supplier | null> {
    try {
      // Em uma implementação real, isso consultaria o banco de dados
      // Por enquanto, vamos simular com dados fictícios
      
      // Simular chamada à API
      await this.simulateApiCall();
      
      // Retornar fornecedor fictício
      return {
        id: supplierId,
        name: 'Fornecedor Exemplo',
        location: { lat: -8.838, lng: 13.288 },
        availability: true,
        rating: 4.5,
        capacity: 100,
        currentLoad: 30,
        specialties: ['botija_13kg'],
        operatingHours: { open: '08:00', close: '20:00' }
      };
    } catch (error) {
      console.error('Erro ao obter fornecedor:', error);
      return null;
    }
  }

  /**
   * Obtém um entregador pelo ID
   */
  private async getCourierById(courierId: string): Promise<Courier | null> {
    try {
      // Em uma implementação real, isso consultaria o banco de dados
      // Por enquanto, vamos simular com dados fictícios
      
      // Simular chamada à API
      await this.simulateApiCall();
      
      // Retornar entregador fictício
      return {
        id: courierId,
        name: 'Entregador Exemplo',
        location: { lat: -8.837, lng: 13.289 },
        availability: true,
        rating: 4.7,
        vehicleType: 'motorcycle',
        capacity: 5,
        currentLoad: 2,
        operatingHours: { open: '09:00', close: '21:00' }
      };
    } catch (error) {
      console.error('Erro ao obter entregador:', error);
      return null;
    }
  }

  /**
   * Obtém célula para uma localização
   */
  private async getCellForLocation(location: { lat: number; lng: number }): Promise<Cell | null> {
    try {
      // Em uma implementação real, isso consultaria o banco de dados
      // Por enquanto, vamos simular com dados fictícios
      
      // Simular chamada à API
      await this.simulateApiCall();
      
      // Retornar célula fictícia
      return {
        id: 'cell-1',
        name: 'Centro de Luanda',
        center: { lat: -8.839, lng: 13.289 },
        radius: 5000, // 5km
        suppliers: ['supplier-1', 'supplier-2'],
        couriers: ['courier-1', 'courier-2'],
        isActive: true
      };
    } catch (error) {
      console.error('Erro ao obter célula:', error);
      return null;
    }
  }

  /**
   * Obtém células vizinhas
   */
  private async getNeighborCells(cellId: string): Promise<Cell[]> {
    try {
      // Em uma implementação real, isso consultaria o banco de dados
      // Por enquanto, vamos simular com dados fictícios
      
      // Simular chamada à API
      await this.simulateApiCall();
      
      // Retornar células vizinhas fictícias
      return [
        {
          id: 'cell-2',
          name: 'Norte de Luanda',
          center: { lat: -8.835, lng: 13.289 },
          radius: 5000,
          suppliers: ['supplier-3'],
          couriers: ['courier-3'],
          isActive: true
        },
        {
          id: 'cell-3',
          name: 'Sul de Luanda',
          center: { lat: -8.843, lng: 13.289 },
          radius: 5000,
          suppliers: ['supplier-4'],
          couriers: ['courier-4'],
          isActive: true
        }
      ];
    } catch (error) {
      console.error('Erro ao obter células vizinhas:', error);
      return [];
    }
  }

  /**
   * Obtém fornecedores em uma célula
   */
  private async getSuppliersInCell(cellId: string): Promise<Supplier[]> {
    try {
      // Em uma implementação real, isso consultaria o banco de dados
      // Por enquanto, vamos simular com dados fictícios
      
      // Simular chamada à API
      await this.simulateApiCall();
      
      // Retornar fornecedores fictícios
      return [
        {
          id: 'supplier-3',
          name: 'Fornecedor Norte',
          location: { lat: -8.835, lng: 13.289 },
          availability: true,
          rating: 4.6,
          capacity: 80,
          currentLoad: 25,
          specialties: ['botija_13kg'],
          operatingHours: { open: '07:00', close: '19:00' }
        }
      ];
    } catch (error) {
      console.error('Erro ao obter fornecedores na célula:', error);
      return [];
    }
  }

  /**
   * Obtém entregadores em uma célula
   */
  private async getCouriersInCell(cellId: string): Promise<Courier[]> {
    try {
      // Em uma implementação real, isso consultaria o banco de dados
      // Por enquanto, vamos simular com dados fictícios
      
      // Simular chamada à API
      await this.simulateApiCall();
      
      // Retornar entregadores fictícios
      return [
        {
          id: 'courier-3',
          name: 'Entregador Norte',
          location: { lat: -8.834, lng: 13.289 },
          availability: true,
          rating: 4.8,
          vehicleType: 'motorcycle',
          capacity: 5,
          currentLoad: 1,
          operatingHours: { open: '08:00', close: '20:00' }
        }
      ];
    } catch (error) {
      console.error('Erro ao obter entregadores na célula:', error);
      return [];
    }
  }

  /**
   * Calcula compatibilidade de especialidades
   */
  private calculateSpecialtyMatch(order: Order, supplier: Supplier): number {
    // Neste exemplo, estamos usando uma lógica simples
    // Em uma implementação real, isso seria mais complexo
    return supplier.specialties.length > 0 ? 1 : 0;
  }

  /**
   * Calcula compatibilidade de veículo
   */
  private calculateVehicleMatch(order: Order, courier: Courier): number {
    // Neste exemplo, estamos usando uma lógica simples
    // Em uma implementação real, isso consideraria o tamanho do pedido
    return courier.vehicleType === 'motorcycle' ? 1 : 0.8;
  }

  /**
   * Simula chamada à API
   */
  private async simulateApiCall(): Promise<void> {
    // Simular latência de rede
    return new Promise(resolve => setTimeout(resolve, 100));
  }
}

// Exportar instância singleton do serviço
export const matchingService = new MatchingService();