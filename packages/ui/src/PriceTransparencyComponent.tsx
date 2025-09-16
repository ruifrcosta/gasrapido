// @ts-nocheck
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Button } from './components/common';

interface PriceFactor {
  id: string;
  name: string;
  description: string;
  value: number;
  impact: 'positive' | 'negative' | 'neutral';
}

interface PriceBreakdown {
  basePrice: number;
  scarcityFactor: number;
  demandFactor: number;
  weatherFactor: number;
  trafficFactor: number;
  serviceFee: number;
  totalPrice: number;
  factors: PriceFactor[];
}

interface PriceTransparencyComponentProps {
  productId: string;
  basePrice: number;
  currentPrice: number;
  onPriceAccepted?: () => void;
}

const PriceTransparencyComponent: React.FC<PriceTransparencyComponentProps> = ({
  productId,
  basePrice,
  currentPrice,
  onPriceAccepted
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  
  // Mock price breakdown data
  const priceBreakdown: PriceBreakdown = {
    basePrice: basePrice,
    scarcityFactor: 15.50,
    demandFactor: 12.75,
    weatherFactor: 8.25,
    trafficFactor: 5.00,
    serviceFee: 3.50,
    totalPrice: currentPrice,
    factors: [
      {
        id: 'factor-1',
        name: 'Escassez de Produto',
        description: 'Produto com baixa disponibilidade no estoque',
        value: 15.50,
        impact: 'positive'
      },
      {
        id: 'factor-2',
        name: 'Alta Demanda',
        description: 'Período de pico de demanda',
        value: 12.75,
        impact: 'positive'
      },
      {
        id: 'factor-3',
        name: 'Condições Climáticas',
        description: 'Clima adverso afetando a logística',
        value: 8.25,
        impact: 'positive'
      },
      {
        id: 'factor-4',
        name: 'Tráfego',
        description: 'Tráfego intenso na área de entrega',
        value: 5.00,
        impact: 'positive'
      },
      {
        id: 'factor-5',
        name: 'Taxa de Serviço',
        description: 'Taxa para manutenção da plataforma',
        value: 3.50,
        impact: 'neutral'
      }
    ]
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return '#dc3545';
      case 'negative': return '#28a745';
      case 'neutral': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(amount);
  };

  const handleAcceptPrice = () => {
    onPriceAccepted?.();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Transparência de Preços</Text>
      
      <Card style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Resumo do Preço</Text>
        <View style={styles.priceRow}>
          <Text style={styles.basePriceLabel}>Preço Base</Text>
          <Text style={styles.basePrice}>{formatCurrency(basePrice)}</Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.currentPriceLabel}>Preço Atual</Text>
          <Text style={styles.currentPrice}>{formatCurrency(currentPrice)}</Text>
        </View>
        
        <View style={styles.savingsRow}>
          <Text style={styles.savingsLabel}>Diferença</Text>
          <Text style={styles.savingsValue}>
            {formatCurrency(currentPrice - basePrice)} ({(((currentPrice - basePrice) / basePrice) * 100).toFixed(1)}%)
          </Text>
        </View>
        
        <Button 
          variant="outline" 
          size="sm" 
          onPress={() => setShowBreakdown(!showBreakdown)}
          style={styles.toggleButton}
        >
          {showBreakdown ? 'Ocultar Detalhes' : 'Ver Detalhes de Preço'}
        </Button>
      </Card>
      
      {showBreakdown && (
        <Card style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Detalhamento do Preço</Text>
          
          {priceBreakdown.factors.map((factor) => (
            <View key={factor.id} style={styles.factorRow}>
              <View style={styles.factorInfo}>
                <Text style={styles.factorName}>{factor.name}</Text>
                <Text style={styles.factorDescription}>{factor.description}</Text>
              </View>
              <Text style={[styles.factorValue, { color: getImpactColor(factor.impact) }]}>
                {formatCurrency(factor.value)}
              </Text>
            </View>
          ))}
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(priceBreakdown.totalPrice)}</Text>
          </View>
        </Card>
      )}
      
      <Card style={styles.explanationCard}>
        <Text style={styles.explanationTitle}>Como o Preço é Calculado</Text>
        <Text style={styles.explanationText}>
          Nosso sistema de precificação dinâmica considera múltiplos fatores para 
          garantir preços justos e equilibrar oferta e demanda:
        </Text>
        
        <View style={styles.bulletPoint}>
          <Text style={styles.bulletSymbol}>•</Text>
          <Text style={styles.bulletText}>
            <Text style={styles.bold}>Escassez:</Text> Quando um produto está em baixa 
            disponibilidade, o preço pode aumentar para refletir a demanda.
          </Text>
        </View>
        
        <View style={styles.bulletPoint}>
          <Text style={styles.bulletSymbol}>•</Text>
          <Text style={styles.bulletText}>
            <Text style={styles.bold}>Demanda:</Text> Durante períodos de pico, os preços 
            podem ser ajustados para equilibrar a carga.
          </Text>
        </View>
        
        <View style={styles.bulletPoint}>
          <Text style={styles.bulletSymbol}>•</Text>
          <Text style={styles.bulletText}>
            <Text style={styles.bold}>Condições Externas:</Text> Fatores como clima e 
            tráfego podem afetar os custos operacionais.
          </Text>
        </View>
        
        <View style={styles.bulletPoint}>
          <Text style={styles.bulletSymbol}>•</Text>
          <Text style={styles.bulletText}>
            <Text style={styles.bold}>Taxas de Serviço:</Text> Taxas fixas para manter 
            a qualidade da plataforma e suporte ao cliente.
          </Text>
        </View>
      </Card>
      
      <View style={styles.actionContainer}>
        <Button 
          variant="primary" 
          size="md" 
          onPress={handleAcceptPrice}
          style={styles.actionButton}
        >
          Aceitar Preço e Continuar
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryCard: {
    marginBottom: 16,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  basePriceLabel: {
    fontSize: 16,
    color: '#666',
  },
  basePrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  currentPriceLabel: {
    fontSize: 16,
    color: '#666',
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  savingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  savingsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  savingsValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  toggleButton: {
    alignSelf: 'center',
  },
  breakdownCard: {
    marginBottom: 16,
    padding: 16,
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  factorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  factorInfo: {
    flex: 1,
  },
  factorName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  factorDescription: {
    fontSize: 12,
    color: '#666',
  },
  factorValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  explanationCard: {
    marginBottom: 16,
    padding: 16,
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  explanationText: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
    color: '#555',
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bulletSymbol: {
    fontSize: 16,
    marginRight: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
  },
  bold: {
    fontWeight: 'bold',
  },
  actionContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  actionButton: {
    minWidth: 200,
  },
});

export default PriceTransparencyComponent;