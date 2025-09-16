import { SupabaseClient } from '@supabase/supabase-js';

export interface PricingFactors {
  scarcity: number; // 0-1 (0 = abundant, 1 = scarce)
  weather: number; // 0-1 (0 = good, 1 = bad)
  traffic: number; // 0-1 (0 = light, 1 = heavy)
  demand: number; // 0-1 (0 = low, 1 = high)
  timeOfDay: number; // 0-1 (0 = off-peak, 1 = peak)
  dayOfWeek: number; // 0-1 (0 = weekday, 1 = weekend)
}

export interface PriceCalculation {
  basePrice: number;
  finalPrice: number;
  factors: PricingFactors;
  multiplier: number;
  timestamp: Date;
}

export interface HistoricalPrice {
  id: string;
  orderId?: string;
  productId: string;
  basePrice: number;
  finalPrice: number;
  factors: PricingFactors;
  multiplier: number;
  calculatedAt: Date;
  location?: {
    lat: number;
    lng: number;
  };
}

export class PricingService {
  private supabase: SupabaseClient;
  private cache: Map<string, { price: PriceCalculation; timestamp: Date }> = new Map();
  private cacheExpiry: number = 5 * 60 * 1000; // 5 minutes

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  /**
   * Calcula o preço dinâmico baseado em múltiplos fatores
   * @param basePrice Preço base do produto
   * @param factors Fatores que influenciam o preço
   * @returns Preço calculado e detalhes dos fatores
   */
  calculateDynamicPrice(basePrice: number, factors: PricingFactors): PriceCalculation {
    // Validar fatores
    const validatedFactors = this.validateFactors(factors);
    
    // Calcular multiplicador baseado nos fatores
    const multiplier = this.calculateMultiplier(validatedFactors);
    
    // Calcular preço final
    const finalPrice = basePrice * multiplier;
    
    return {
      basePrice,
      finalPrice: parseFloat(finalPrice.toFixed(2)),
      factors: validatedFactors,
      multiplier: parseFloat(multiplier.toFixed(2)),
      timestamp: new Date()
    };
  }

  /**
   * Valida e normaliza os fatores de precificação
   */
  private validateFactors(factors: PricingFactors): PricingFactors {
    return {
      scarcity: Math.max(0, Math.min(1, factors.scarcity || 0)),
      weather: Math.max(0, Math.min(1, factors.weather || 0)),
      traffic: Math.max(0, Math.min(1, factors.traffic || 0)),
      demand: Math.max(0, Math.min(1, factors.demand || 0)),
      timeOfDay: Math.max(0, Math.min(1, factors.timeOfDay || 0)),
      dayOfWeek: Math.max(0, Math.min(1, factors.dayOfWeek || 0))
    };
  }

  /**
   * Calcula o multiplicador de preço baseado nos fatores
   */
  private calculateMultiplier(factors: PricingFactors): number {
    // Pesos para cada fator (podem ser ajustados)
    const weights = {
      scarcity: 0.3,
      weather: 0.15,
      traffic: 0.2,
      demand: 0.25,
      timeOfDay: 0.05,
      dayOfWeek: 0.05
    };

    // Calcular impacto ponderado de cada fator
    const weightedImpact = 
      (factors.scarcity * weights.scarcity) +
      (factors.weather * weights.weather) +
      (factors.traffic * weights.traffic) +
      (factors.demand * weights.demand) +
      (factors.timeOfDay * weights.timeOfDay) +
      (factors.dayOfWeek * weights.dayOfWeek);

    // Multiplicador base (1.0) + impacto ponderado
    // O impacto pode variar de -50% a +300% do preço base
    const multiplier = 1 + (weightedImpact * 3 - 0.5);
    
    // Garantir que o multiplicador não seja menor que 0.5
    return Math.max(0.5, multiplier);
  }

  /**
   * Obtém dados de clima em tempo real para uma localização
   */
  async getWeatherData(lat: number, lng: number): Promise<number> {
    try {
      // Esta função seria integrada com uma API real de clima
      // Por enquanto, retornamos um valor simulado
      // Em implementação real, faríamos uma chamada à API de clima
      
      // Simular dados de clima (0 = bom, 1 = ruim)
      const simulatedWeather = Math.random() * 0.4; // Clima geralmente bom (0-0.4)
      return simulatedWeather;
    } catch (error) {
      console.error('Erro ao obter dados de clima:', error);
      // Retornar valor neutro em caso de erro
      return 0.2;
    }
  }

  /**
   * Obtém dados de tráfego em tempo real para uma localização
   */
  async getTrafficData(lat: number, lng: number): Promise<number> {
    try {
      // Esta função seria integrada com uma API real de tráfego
      // Por enquanto, retornamos um valor simulado
      
      // Simular dados de tráfego (0 = leve, 1 = pesado)
      const simulatedTraffic = Math.random() * 0.6; // Tráfego moderado (0-0.6)
      return simulatedTraffic;
    } catch (error) {
      console.error('Erro ao obter dados de tráfego:', error);
      // Retornar valor neutro em caso de erro
      return 0.3;
    }
  }

  /**
   * Calcula o nível de escassez baseado no inventário
   */
  calculateScarcity(inventoryLevel: number, maxInventory: number): number {
    if (maxInventory <= 0) return 1; // Escasso se não há inventário máximo
    
    const scarcity = 1 - (inventoryLevel / maxInventory);
    return Math.max(0, Math.min(1, scarcity));
  }

  /**
   * Calcula o nível de demanda baseado em pedidos recentes
   */
  calculateDemand(recentOrders: number, averageOrders: number): number {
    if (averageOrders <= 0) return 0;
    
    const demand = recentOrders / averageOrders;
    // Normalizar para 0-1, onde >1 significa alta demanda
    return Math.max(0, Math.min(1, demand > 1 ? (demand - 1) * 2 : 0));
  }

  /**
   * Calcula o fator de hora do dia (pico vs fora de pico)
   */
  calculateTimeOfDayFactor(): number {
    const now = new Date();
    const hour = now.getHours();
    
    // Horários de pico: 7-9 e 17-19
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      return 1; // Pico máximo
    }
    
    // Horários intermediários: 6-7, 9-17, 19-20
    if ((hour >= 6 && hour < 7) || (hour > 9 && hour < 17) || (hour > 19 && hour <= 20)) {
      return 0.5; // Pico médio
    }
    
    // Horários fora de pico
    return 0; // Fora de pico
  }

  /**
   * Calcula o fator de dia da semana
   */
  calculateDayOfWeekFactor(): number {
    const day = new Date().getDay();
    
    // Finais de semana (sábado = 6, domingo = 0)
    if (day === 0 || day === 6) {
      return 1; // Fim de semana
    }
    
    // Sexta-feira
    if (day === 5) {
      return 0.7; // Sexta-feira
    }
    
    // Dias úteis
    return 0;
  }

  /**
   * Obtém preço em cache ou calcula novo
   */
  async getPrice(productId: string, basePrice: number, location?: { lat: number; lng: number }): Promise<PriceCalculation> {
    // Verificar cache
    const cached = this.cache.get(productId);
    if (cached && (Date.now() - cached.timestamp.getTime()) < this.cacheExpiry) {
      return cached.price;
    }

    // Coletar fatores em tempo real
    const factors: PricingFactors = {
      scarcity: 0.2, // Valor padrão, seria obtido do inventário
      weather: location ? await this.getWeatherData(location.lat, location.lng) : 0.1,
      traffic: location ? await this.getTrafficData(location.lat, location.lng) : 0.2,
      demand: 0.3, // Valor padrão, seria obtido de análises de pedidos
      timeOfDay: this.calculateTimeOfDayFactor(),
      dayOfWeek: this.calculateDayOfWeekFactor()
    };

    // Calcular preço
    const price = this.calculateDynamicPrice(basePrice, factors);
    
    // Atualizar cache
    this.cache.set(productId, {
      price,
      timestamp: new Date()
    });

    return price;
  }

  /**
   * Salva histórico de preços no Supabase
   */
  async savePriceHistory(priceData: Omit<HistoricalPrice, 'id' | 'calculatedAt'>): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('price_history')
        .insert({
          ...priceData,
          calculated_at: new Date()
        });

      if (error) {
        console.error('Erro ao salvar histórico de preços:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao salvar histórico de preços:', error);
      return false;
    }
  }

  /**
   * Obtém histórico de preços para um produto
   */
  async getPriceHistory(productId: string, limit: number = 50): Promise<HistoricalPrice[]> {
    try {
      const { data, error } = await this.supabase
        .from('price_history')
        .select('*')
        .eq('product_id', productId)
        .order('calculated_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Erro ao obter histórico de preços:', error);
        return [];
      }

      return data.map(item => ({
        id: item.id,
        orderId: item.order_id,
        productId: item.product_id,
        basePrice: item.base_price,
        finalPrice: item.final_price,
        factors: item.factors,
        multiplier: item.multiplier,
        calculatedAt: new Date(item.calculated_at),
        location: item.location
      }));
    } catch (error) {
      console.error('Erro ao obter histórico de preços:', error);
      return [];
    }
  }

  /**
   * Limpa o cache de preços
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Aplica override manual de preço
   */
  applyManualOverride(basePrice: number, overrideMultiplier: number): PriceCalculation {
    const finalPrice = basePrice * overrideMultiplier;
    
    return {
      basePrice,
      finalPrice: parseFloat(finalPrice.toFixed(2)),
      factors: {
        scarcity: 0,
        weather: 0,
        traffic: 0,
        demand: 0,
        timeOfDay: 0,
        dayOfWeek: 0
      },
      multiplier: overrideMultiplier,
      timestamp: new Date()
    };
  }
}