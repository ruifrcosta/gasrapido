// @ts-nocheck
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Button } from './components/common';

interface ValueProposition {
  id: string;
  title: string;
  description: string;
  icon: string;
  benefit: string;
}

interface ValueCommunicationComponentProps {
  productId: string;
  productName: string;
  currentPrice: number;
  onValueAccepted?: () => void;
  onLearnMore?: (topic: string) => void;
}

const ValueCommunicationComponent: React.FC<ValueCommunicationComponentProps> = ({
  productId,
  productName,
  currentPrice,
  onValueAccepted,
  onLearnMore
}) => {
  const valuePropositions: ValueProposition[] = [
    {
      id: 'vp-1',
      title: 'Entrega Rápida',
      description: 'Receba seu gás em até 30 minutos',
      icon: '⏱️',
      benefit: 'Economize tempo e evite filas'
    },
    {
      id: 'vp-2',
      title: 'Preço Justo',
      description: 'Precificação transparente e competitiva',
      icon: '⚖️',
      benefit: 'Pague o valor correto pelo serviço'
    },
    {
      id: 'vp-3',
      title: 'Qualidade Garantida',
      description: 'Produto de primeira qualidade com garantia',
      icon: '✅',
      benefit: 'Tenha confiança na sua compra'
    },
    {
      id: 'vp-4',
      title: 'Atendimento 24/7',
      description: 'Suporte disponível a qualquer hora',
      icon: '📞',
      benefit: 'Ajuda sempre que precisar'
    },
    {
      id: 'vp-5',
      title: 'Pagamento Flexível',
      description: 'Múltiplas opções de pagamento',
      icon: '💳',
      benefit: 'Pague da forma que for mais conveniente'
    },
    {
      id: 'vp-6',
      title: 'Sustentabilidade',
      description: 'Compromisso com o meio ambiente',
      icon: '🌱',
      benefit: 'Contribua para um futuro melhor'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(amount);
  };

  const handleAcceptValue = () => {
    onValueAccepted?.();
  };

  const handleLearnMore = (topic: string) => {
    onLearnMore?.(topic);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Por que Escolher o GasRápido?</Text>
      <Text style={styles.subtitle}>{productName}</Text>
      
      <Card style={styles.priceCard}>
        <Text style={styles.priceLabel}>Preço Atual</Text>
        <Text style={styles.currentPrice}>{formatCurrency(currentPrice)}</Text>
        <Text style={styles.priceDescription}>
          Um preço justo por um serviço de qualidade
        </Text>
      </Card>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nosso Compromisso com Você</Text>
        <Text style={styles.sectionDescription}>
          Entendemos que você merece mais do que apenas um produto. 
          Oferecemos um serviço completo com benefícios reais:
        </Text>
        
        <View style={styles.valuePropositionsGrid}>
          {valuePropositions.map((vp) => (
            <Card key={vp.id} style={styles.valueCard}>
              <Text style={styles.valueIcon}>{vp.icon}</Text>
              <Text style={styles.valueTitle}>{vp.title}</Text>
              <Text style={styles.valueDescription}>{vp.description}</Text>
              <Text style={styles.valueBenefit}>{vp.benefit}</Text>
              <Button 
                variant="outline" 
                size="sm" 
                onPress={() => handleLearnMore(vp.id)}
                style={styles.learnMoreButton}
              >
                Saiba Mais
              </Button>
            </Card>
          ))}
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nossa Promessa</Text>
        <Card style={styles.promiseCard}>
          <Text style={styles.promiseText}>
            "Comprometemo-nos a entregar não apenas um produto, mas uma experiência 
            completa que valorize o seu tempo, dinheiro e confiança."
          </Text>
          <Text style={styles.promiseAuthor}>- Equipe GasRápido</Text>
        </Card>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Benefícios Comparativos</Text>
        <View style={styles.comparisonContainer}>
          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonLabel}>Velocidade de Entrega</Text>
            <Text style={styles.comparisonValue}>⭐⭐⭐⭐⭐</Text>
          </View>
          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonLabel}>Qualidade do Produto</Text>
            <Text style={styles.comparisonValue}>⭐⭐⭐⭐⭐</Text>
          </View>
          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonLabel}>Atendimento ao Cliente</Text>
            <Text style={styles.comparisonValue}>⭐⭐⭐⭐⭐</Text>
          </View>
          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonLabel}>Preço Competitivo</Text>
            <Text style={styles.comparisonValue}>⭐⭐⭐⭐</Text>
          </View>
          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonLabel}>Facilidade de Uso</Text>
            <Text style={styles.comparisonValue}>⭐⭐⭐⭐⭐</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.actionContainer}>
        <Button 
          variant="primary" 
          size="md" 
          onPress={handleAcceptValue}
          style={styles.actionButton}
        >
          Continuar com a Compra
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
    marginBottom: 4,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  priceCard: {
    marginBottom: 16,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
  },
  priceLabel: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 4,
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  priceDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
    color: '#555',
    textAlign: 'center',
  },
  valuePropositionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  valueCard: {
    width: '48%',
    marginBottom: 12,
    padding: 16,
    alignItems: 'center',
  },
  valueIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  valueTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
    textAlign: 'center',
  },
  valueDescription: {
    fontSize: 12,
    marginBottom: 8,
    color: '#666',
    textAlign: 'center',
  },
  valueBenefit: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#007AFF',
    textAlign: 'center',
  },
  learnMoreButton: {
    minWidth: 100,
  },
  promiseCard: {
    padding: 16,
    backgroundColor: '#e8f5e9',
  },
  promiseText: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 22,
    color: '#28a745',
    textAlign: 'center',
  },
  promiseAuthor: {
    fontSize: 14,
    textAlign: 'right',
    color: '#28a745',
    fontWeight: 'bold',
  },
  comparisonContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  comparisonLabel: {
    fontSize: 14,
    color: '#333',
  },
  comparisonValue: {
    fontSize: 14,
    color: '#ffc107',
  },
  actionContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  actionButton: {
    minWidth: 200,
  },
});

export default ValueCommunicationComponent;