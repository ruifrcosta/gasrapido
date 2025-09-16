// @ts-nocheck
import React from 'react';
import { View, StyleSheet } from 'react-native';
import PriceExplanationComponent from '@gasrapido/ui/src/PriceExplanationComponent';

const PriceExplanationScreen = () => {
  // Mock data for pricing factors
  const pricingFactors = [
    {
      id: 'factor-1',
      name: 'Escassez de Produto',
      description: 'Nível de disponibilidade do produto no estoque',
      currentValue: 1.25,
      normalRange: { min: 0.8, max: 1.2 },
      impact: 'high',
      trend: 'increasing',
      explanation: 'Quando um produto está em baixa disponibilidade, o preço aumenta para refletir a demanda e incentivar reposição.'
    },
    {
      id: 'factor-2',
      name: 'Demanda em Tempo Real',
      description: 'Nível de demanda atual por este produto',
      currentValue: 1.15,
      normalRange: { min: 0.9, max: 1.1 },
      impact: 'medium',
      trend: 'stable',
      explanation: 'Durante períodos de pico de demanda, os preços podem ser ajustados para equilibrar a carga e garantir disponibilidade.'
    },
    {
      id: 'factor-3',
      name: 'Condições Climáticas',
      description: 'Impacto das condições climáticas na logística',
      currentValue: 1.08,
      normalRange: { min: 0.95, max: 1.05 },
      impact: 'low',
      trend: 'decreasing',
      explanation: 'Condições climáticas adversas podem aumentar os custos operacionais, afetando o preço final.'
    },
    {
      id: 'factor-4',
      name: 'Tráfego e Mobilidade',
      description: 'Nível de tráfego na área de entrega',
      currentValue: 1.05,
      normalRange: { min: 0.98, max: 1.02 },
      impact: 'low',
      trend: 'stable',
      explanation: 'Tráfego intenso pode aumentar o tempo e custo de entrega, impactando o preço final.'
    },
    {
      id: 'factor-5',
      name: 'Horário de Pico',
      description: 'Período do dia com maior demanda',
      currentValue: 0,
      normalRange: { min: 0, max: 1.3 },
      impact: 'high',
      trend: 'stable',
      explanation: 'Durante horários de pico, os preços podem ser ajustados para equilibrar a carga operacional.'
    }
  ];

  const handleFactorInfoRequested = (factorId: string) => {
    console.log('Informações solicitadas para o fator:', factorId);
    // Aqui você poderia abrir um modal com informações detalhadas sobre o fator
  };

  return (
    <View style={styles.container}>
      <PriceExplanationComponent 
        productId="gas-123"
        factors={pricingFactors}
        onFactorInfoRequested={handleFactorInfoRequested}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default PriceExplanationScreen;