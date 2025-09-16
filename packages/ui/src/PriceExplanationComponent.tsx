// @ts-nocheck
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Button, Toggle } from './components/common';

interface PricingFactor {
  id: string;
  name: string;
  description: string;
  currentValue: number;
  normalRange: { min: number; max: number };
  impact: 'high' | 'medium' | 'low';
  trend: 'increasing' | 'decreasing' | 'stable';
  explanation: string;
}

interface PriceExplanationComponentProps {
  productId: string;
  factors: PricingFactor[];
  onFactorInfoRequested?: (factorId: string) => void;
}

const PriceExplanationComponent: React.FC<PriceExplanationComponentProps> = ({
  productId,
  factors,
  onFactorInfoRequested
}) => {
  const [expandedFactors, setExpandedFactors] = useState<string[]>([]);
  const [showOnlyActive, setShowOnlyActive] = useState(false);

  const toggleFactorExpansion = (factorId: string) => {
    if (expandedFactors.includes(factorId)) {
      setExpandedFactors(expandedFactors.filter(id => id !== factorId));
    } else {
      setExpandedFactors([...expandedFactors, factorId]);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '↗️';
      case 'decreasing': return '↘️';
      case 'stable': return '➡️';
      default: return '';
    }
  };

  const filteredFactors = showOnlyActive 
    ? factors.filter(factor => factor.currentValue !== 0) 
    : factors;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Explicação de Fatores de Preço</Text>
      
      <Card style={styles.filterCard}>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Mostrar apenas fatores ativos</Text>
          <Toggle
            checked={showOnlyActive}
            onChange={setShowOnlyActive}
          />
        </View>
      </Card>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fatores que Afetam o Preço</Text>
        {filteredFactors.map((factor) => (
          <Card key={factor.id} style={styles.factorCard}>
            <View style={styles.factorHeader}>
              <View style={styles.factorInfo}>
                <Text style={styles.factorName}>{factor.name}</Text>
                <View style={styles.factorMeta}>
                  <Text style={[styles.impactBadge, { backgroundColor: getImpactColor(factor.impact) }]}>
                    Impacto {factor.impact}
                  </Text>
                  <Text style={styles.trendText}>
                    {getTrendIcon(factor.trend)} {factor.trend === 'increasing' ? 'Aumentando' : factor.trend === 'decreasing' ? 'Diminuindo' : 'Estável'}
                  </Text>
                </View>
              </View>
              <Button 
                variant="outline" 
                size="sm" 
                onPress={() => toggleFactorExpansion(factor.id)}
                style={styles.expandButton}
              >
                {expandedFactors.includes(factor.id) ? 'Ocultar' : 'Detalhes'}
              </Button>
            </View>
            
            {expandedFactors.includes(factor.id) && (
              <View style={styles.factorDetails}>
                <Text style={styles.factorDescription}>{factor.description}</Text>
                
                <View style={styles.valueRow}>
                  <Text style={styles.valueLabel}>Valor Atual:</Text>
                  <Text style={styles.valueText}>{factor.currentValue.toFixed(2)}</Text>
                </View>
                
                <View style={styles.valueRow}>
                  <Text style={styles.valueLabel}>Faixa Normal:</Text>
                  <Text style={styles.valueText}>
                    {factor.normalRange.min.toFixed(2)} - {factor.normalRange.max.toFixed(2)}
                  </Text>
                </View>
                
                <View style={styles.explanationSection}>
                  <Text style={styles.explanationTitle}>Como isso afeta o seu preço:</Text>
                  <Text style={styles.explanationText}>{factor.explanation}</Text>
                </View>
                
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onPress={() => onFactorInfoRequested?.(factor.id)}
                  style={styles.infoButton}
                >
                  Mais Informações
                </Button>
              </View>
            )}
          </Card>
        ))}
      </View>
      
      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>Entendendo a Precificação Dinâmica</Text>
        <Text style={styles.infoText}>
          Nossa precificação dinâmica ajusta os preços em tempo real com base em 
          múltiplos fatores para garantir equilíbrio entre oferta e demanda.
        </Text>
        <Text style={styles.infoText}>
          Isso nos permite oferecer preços justos que refletem as condições atuais 
          do mercado, garantindo disponibilidade de produtos e qualidade de serviço.
        </Text>
      </Card>
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
  filterCard: {
    marginBottom: 16,
    padding: 16,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 16,
    color: '#333',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  factorCard: {
    marginBottom: 12,
    padding: 16,
  },
  factorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  factorInfo: {
    flex: 1,
  },
  factorName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#007AFF',
  },
  factorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  impactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  trendText: {
    fontSize: 12,
    color: '#666',
  },
  expandButton: {
    minWidth: 80,
  },
  factorDetails: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
    marginTop: 12,
  },
  factorDescription: {
    fontSize: 14,
    marginBottom: 12,
    color: '#555',
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  valueLabel: {
    fontSize: 14,
    color: '#666',
  },
  valueText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  explanationSection: {
    marginVertical: 12,
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
  },
  infoButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  infoCard: {
    padding: 16,
    backgroundColor: '#e3f2fd',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#007AFF',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
    color: '#555',
  },
});

export default PriceExplanationComponent;