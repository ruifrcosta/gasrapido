// @ts-nocheck
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PricingDashboardComponent } from '@gasrapido/ui';

// Mock do serviço de precificação para demonstração
const mockPricingService = {
  calculateDynamicPrice: (basePrice: number, factors: any) => {
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
    const multiplier = 1 + (weightedImpact * 3 - 0.5);
    
    // Garantir que o multiplicador não seja menor que 0.5
    const finalMultiplier = Math.max(0.5, multiplier);
    const finalPrice = basePrice * finalMultiplier;
    
    return {
      basePrice,
      finalPrice: parseFloat(finalPrice.toFixed(2)),
      factors,
      multiplier: parseFloat(finalMultiplier.toFixed(2)),
      timestamp: new Date()
    };
  },
  
  applyManualOverride: (basePrice: number, overrideMultiplier: number) => {
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
  },
  
  getPriceHistory: async (productId: string) => {
    // Simular dados de histórico
    return [
      {
        id: '1',
        productId: 'gas-13kg',
        basePrice: 100,
        finalPrice: 125.50,
        factors: {
          scarcity: 0.3,
          weather: 0.1,
          traffic: 0.2,
          demand: 0.4,
          timeOfDay: 0.5,
          dayOfWeek: 0.2
        },
        multiplier: 1.26,
        calculatedAt: new Date(Date.now() - 3600000)
      },
      {
        id: '2',
        productId: 'gas-13kg',
        basePrice: 100,
        finalPrice: 118.75,
        factors: {
          scarcity: 0.2,
          weather: 0.1,
          traffic: 0.3,
          demand: 0.3,
          timeOfDay: 0.4,
          dayOfWeek: 0.1
        },
        multiplier: 1.19,
        calculatedAt: new Date(Date.now() - 7200000)
      }
    ];
  },
  
  savePriceHistory: async (priceData: any) => {
    // Simular salvamento
    console.log('Salvando histórico de preço:', priceData);
    return true;
  }
};

export const PricingDashboardScreen = () => {
  return (
    <View style={styles.container}>
      <PricingDashboardComponent 
        pricingService={mockPricingService}
        onPriceUpdate={(productId, price) => {
          console.log('Preço atualizado:', productId, price);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  }
});