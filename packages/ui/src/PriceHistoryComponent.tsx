// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Button, Dropdown } from './components/common';

interface PriceRecord {
  timestamp: string;
  price: number;
  basePrice: number;
  factors: {
    name: string;
    value: number;
  }[];
}

interface PriceHistoryComponentProps {
  productId: string;
  productName: string;
  currentPrice: number;
  onTimeRangeChange?: (range: string) => void;
}

const PriceHistoryComponent: React.FC<PriceHistoryComponentProps> = ({
  productId,
  productName,
  currentPrice,
  onTimeRangeChange
}) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [priceHistory, setPriceHistory] = useState<PriceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for price history
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockData: PriceRecord[] = [
        {
          timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          price: 2800,
          basePrice: 2500,
          factors: [
            { name: 'Escassez', value: 15.5 },
            { name: 'Demanda', value: 12.75 }
          ]
        },
        {
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          price: 2950,
          basePrice: 2500,
          factors: [
            { name: 'Escassez', value: 18.0 },
            { name: 'Demanda', value: 14.5 }
          ]
        },
        {
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          price: 3100,
          basePrice: 2500,
          factors: [
            { name: 'Escassez', value: 20.5 },
            { name: 'Demanda', value: 16.25 }
          ]
        },
        {
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          price: 3250,
          basePrice: 2500,
          factors: [
            { name: 'Escassez', value: 22.0 },
            { name: 'Demanda', value: 18.0 }
          ]
        },
        {
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          price: 3150,
          basePrice: 2500,
          factors: [
            { name: 'Escassez', value: 21.0 },
            { name: 'Demanda', value: 16.5 }
          ]
        },
        {
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          price: 3050,
          basePrice: 2500,
          factors: [
            { name: 'Escassez', value: 19.5 },
            { name: 'Demanda', value: 15.0 }
          ]
        },
        {
          timestamp: new Date().toISOString(),
          price: currentPrice,
          basePrice: 2500,
          factors: [
            { name: 'Escassez', value: 18.0 },
            { name: 'Demanda', value: 14.0 }
          ]
        }
      ];
      
      setPriceHistory(mockData);
      setLoading(false);
    }, 500);
  }, [timeRange, currentPrice]);

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    onTimeRangeChange?.(range);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-PT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getHighestPrice = () => {
    return Math.max(...priceHistory.map(record => record.price), currentPrice);
  };

  const getLowestPrice = () => {
    return Math.min(...priceHistory.map(record => record.price), currentPrice);
  };

  const getPriceChange = () => {
    if (priceHistory.length === 0) return 0;
    const firstPrice = priceHistory[0].price;
    const lastPrice = currentPrice;
    return lastPrice - firstPrice;
  };

  const getPriceChangePercentage = () => {
    if (priceHistory.length === 0) return 0;
    const firstPrice = priceHistory[0].price;
    const lastPrice = currentPrice;
    return ((lastPrice - firstPrice) / firstPrice) * 100;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando histórico de preços...</Text>
      </View>
    );
  }

  const highestPrice = getHighestPrice();
  const lowestPrice = getLowestPrice();
  const priceChange = getPriceChange();
  const priceChangePercentage = getPriceChangePercentage();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Histórico de Preços</Text>
      <Text style={styles.productName}>{productName}</Text>
      
      <Card style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Preço Atual</Text>
            <Text style={styles.currentPrice}>{formatCurrency(currentPrice)}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Maior Preço</Text>
            <Text style={styles.highestPrice}>{formatCurrency(highestPrice)}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Menor Preço</Text>
            <Text style={styles.lowestPrice}>{formatCurrency(lowestPrice)}</Text>
          </View>
        </View>
        
        <View style={styles.changeRow}>
          <Text style={styles.changeLabel}>Variação no Período:</Text>
          <Text style={[styles.changeValue, priceChange >= 0 ? styles.positiveChange : styles.negativeChange]}>
            {formatCurrency(priceChange)} ({priceChangePercentage.toFixed(1)}%)
          </Text>
        </View>
      </Card>
      
      <Card style={styles.filterCard}>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Período:</Text>
          <Dropdown
            options={[
              { value: '1d', label: 'Últimas 24h' },
              { value: '7d', label: 'Últimos 7 dias' },
              { value: '30d', label: 'Últimos 30 dias' },
              { value: '90d', label: 'Últimos 90 dias' }
            ]}
            value={timeRange}
            onChange={handleTimeRangeChange}
            style={styles.dropdown}
          />
        </View>
      </Card>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Histórico Detalhado</Text>
        {priceHistory.map((record, index) => (
          <Card key={index} style={styles.historyCard}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyDate}>{formatDate(record.timestamp)}</Text>
              <Text style={styles.historyTime}>{formatTime(record.timestamp)}</Text>
            </View>
            
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Preço:</Text>
              <Text style={styles.priceValue}>{formatCurrency(record.price)}</Text>
            </View>
            
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Preço Base:</Text>
              <Text style={styles.basePriceValue}>{formatCurrency(record.basePrice)}</Text>
            </View>
            
            <View style={styles.factorsSection}>
              <Text style={styles.factorsTitle}>Fatores Aplicados:</Text>
              <View style={styles.factorsList}>
                {record.factors.map((factor, factorIndex) => (
                  <View key={factorIndex} style={styles.factorItem}>
                    <Text style={styles.factorName}>{factor.name}:</Text>
                    <Text style={styles.factorValue}>+{factor.value}%</Text>
                  </View>
                ))}
              </View>
            </View>
          </Card>
        ))}
      </View>
      
      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>Entendendo o Histórico</Text>
        <Text style={styles.infoText}>
          O histórico de preços mostra como o preço deste produto variou ao longo do tempo, 
          ajudando você a tomar decisões informadas sobre quando comprar.
        </Text>
        <Text style={styles.infoText}>
          Preços mais altos geralmente indicam alta demanda ou baixa disponibilidade, 
          enquanto preços mais baixos podem indicar o oposto.
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
    marginBottom: 4,
    textAlign: 'center',
  },
  productName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 50,
  },
  summaryCard: {
    marginBottom: 16,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  highestPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc3545',
  },
  lowestPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  changeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  changeLabel: {
    fontSize: 14,
    color: '#333',
  },
  changeValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  positiveChange: {
    color: '#dc3545',
  },
  negativeChange: {
    color: '#28a745',
  },
  filterCard: {
    marginBottom: 16,
    padding: 16,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterLabel: {
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    minWidth: 150,
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
  historyCard: {
    marginBottom: 12,
    padding: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  historyTime: {
    fontSize: 14,
    color: '#666',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  basePriceValue: {
    fontSize: 14,
    color: '#666',
  },
  factorsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  factorsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  factorsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  factorItem: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  factorName: {
    fontSize: 12,
    color: '#007AFF',
    marginRight: 4,
  },
  factorValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  infoCard: {
    padding: 16,
    backgroundColor: '#e8f5e9',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#28a745',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
    color: '#555',
  },
});

export default PriceHistoryComponent;