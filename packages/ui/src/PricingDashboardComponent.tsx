// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';

interface PricingFactors {
  scarcity: number;
  weather: number;
  traffic: number;
  demand: number;
  timeOfDay: number;
  dayOfWeek: number;
}

interface PriceCalculation {
  basePrice: number;
  finalPrice: number;
  factors: PricingFactors;
  multiplier: number;
  timestamp: Date;
}

interface HistoricalPrice {
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

interface PricingService {
  calculateDynamicPrice: (basePrice: number, factors: PricingFactors) => PriceCalculation;
  applyManualOverride: (basePrice: number, overrideMultiplier: number) => PriceCalculation;
  getPriceHistory: (productId: string) => Promise<HistoricalPrice[]>;
  savePriceHistory: (priceData: any) => Promise<boolean>;
}

interface PricingDashboardComponentProps {
  pricingService: PricingService;
  onPriceUpdate?: (productId: string, price: PriceCalculation) => void;
}

export const PricingDashboardComponent: React.FC<PricingDashboardComponentProps> = ({
  pricingService,
  onPriceUpdate
}) => {
  const [basePrice, setBasePrice] = useState<string>('100');
  const [productId, setProductId] = useState<string>('gas-13kg');
  const [factors, setFactors] = useState<PricingFactors>({
    scarcity: 0.2,
    weather: 0.1,
    traffic: 0.3,
    demand: 0.4,
    timeOfDay: 0.5,
    dayOfWeek: 0.2
  });
  const [calculatedPrice, setCalculatedPrice] = useState<PriceCalculation | null>(null);
  const [overrideMultiplier, setOverrideMultiplier] = useState<string>('1.0');
  const [history, setHistory] = useState<HistoricalPrice[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Calcular preço quando os fatores mudarem
  useEffect(() => {
    if (basePrice && parseFloat(basePrice) > 0) {
      const price = pricingService.calculateDynamicPrice(parseFloat(basePrice), factors);
      setCalculatedPrice(price);
    }
  }, [basePrice, factors]);

  // Carregar histórico de preços
  useEffect(() => {
    loadPriceHistory();
  }, []);

  const loadPriceHistory = async () => {
    setLoading(true);
    try {
      const historyData = await pricingService.getPriceHistory(productId);
      setHistory(historyData);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      Alert.alert('Erro', 'Falha ao carregar histórico de preços');
    } finally {
      setLoading(false);
    }
  };

  const handleFactorChange = (factor: keyof PricingFactors, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFactors(prev => ({
      ...prev,
      [factor]: Math.max(0, Math.min(1, numValue))
    }));
  };

  const handleCalculatePrice = () => {
    if (!basePrice || parseFloat(basePrice) <= 0) {
      Alert.alert('Erro', 'Por favor, insira um preço base válido');
      return;
    }

    const price = pricingService.calculateDynamicPrice(parseFloat(basePrice), factors);
    setCalculatedPrice(price);
    
    if (onPriceUpdate) {
      onPriceUpdate(productId, price);
    }
  };

  const handleApplyOverride = () => {
    if (!basePrice || parseFloat(basePrice) <= 0) {
      Alert.alert('Erro', 'Por favor, insira um preço base válido');
      return;
    }

    const multiplier = parseFloat(overrideMultiplier) || 1.0;
    const price = pricingService.applyManualOverride(parseFloat(basePrice), multiplier);
    setCalculatedPrice(price);
    
    if (onPriceUpdate) {
      onPriceUpdate(productId, price);
    }
    
    Alert.alert('Sucesso', 'Override aplicado com sucesso');
  };

  const handleSavePrice = async () => {
    if (!calculatedPrice) {
      Alert.alert('Erro', 'Nenhum preço calculado para salvar');
      return;
    }

    try {
      const success = await pricingService.savePriceHistory({
        productId,
        basePrice: calculatedPrice.basePrice,
        finalPrice: calculatedPrice.finalPrice,
        factors: calculatedPrice.factors,
        multiplier: calculatedPrice.multiplier
      });

      if (success) {
        Alert.alert('Sucesso', 'Preço salvo no histórico');
        loadPriceHistory();
      } else {
        Alert.alert('Erro', 'Falha ao salvar preço no histórico');
      }
    } catch (error) {
      console.error('Erro ao salvar preço:', error);
      Alert.alert('Erro', 'Falha ao salvar preço no histórico');
    }
  };

  const getFactorLabel = (factor: keyof PricingFactors) => {
    const labels: Record<keyof PricingFactors, string> = {
      scarcity: 'Escassez',
      weather: 'Clima',
      traffic: 'Tráfego',
      demand: 'Demanda',
      timeOfDay: 'Hora do Dia',
      dayOfWeek: 'Dia da Semana'
    };
    return labels[factor];
  };

  const getFactorDescription = (factor: keyof PricingFactors) => {
    const descriptions: Record<keyof PricingFactors, string> = {
      scarcity: 'Nível de escassez do produto (0 = abundante, 1 = escasso)',
      weather: 'Condições climáticas (0 = boas, 1 = ruins)',
      traffic: 'Nível de tráfego (0 = leve, 1 = pesado)',
      demand: 'Nível de demanda (0 = baixa, 1 = alta)',
      timeOfDay: 'Período do dia (0 = fora de pico, 1 = pico)',
      dayOfWeek: 'Dia da semana (0 = dia útil, 1 = fim de semana)'
    };
    return descriptions[factor];
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Motor de Precificação Dinâmica</Text>
      
      {/* Seção de Entrada de Dados */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configuração de Preço</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>ID do Produto</Text>
          <TextInput
            style={styles.input}
            value={productId}
            onChangeText={setProductId}
            placeholder="Ex: gas-13kg"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Preço Base (AOA)</Text>
          <TextInput
            style={styles.input}
            value={basePrice}
            onChangeText={setBasePrice}
            keyboardType="numeric"
            placeholder="Ex: 1500"
          />
        </View>
      </View>

      {/* Seção de Fatores */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fatores de Precificação</Text>
        {Object.entries(factors).map(([key, value]) => (
          <View key={key} style={styles.factorRow}>
            <View style={styles.factorHeader}>
              <Text style={styles.factorLabel}>{getFactorLabel(key as keyof PricingFactors)}</Text>
              <Text style={styles.factorValue}>{(value * 100).toFixed(0)}%</Text>
            </View>
            <Text style={styles.factorDescription}>{getFactorDescription(key as keyof PricingFactors)}</Text>
            <View style={styles.sliderContainer}>
              <TextInput
                style={[styles.input, styles.smallInput]}
                value={value.toString()}
                onChangeText={(text) => handleFactorChange(key as keyof PricingFactors, text)}
                keyboardType="numeric"
              />
            </View>
          </View>
        ))}
      </View>

      {/* Seção de Preço Calculado */}
      {calculatedPrice && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preço Calculado</Text>
          <View style={styles.priceCard}>
            <Text style={styles.basePrice}>Preço Base: {calculatedPrice.basePrice.toFixed(2)} AOA</Text>
            <Text style={styles.multiplier}>Multiplicador: x{calculatedPrice.multiplier}</Text>
            <Text style={styles.finalPrice}>Preço Final: {calculatedPrice.finalPrice.toFixed(2)} AOA</Text>
          </View>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleCalculatePrice}>
              <Text style={styles.buttonText}>Recalcular</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleSavePrice}>
              <Text style={styles.buttonText}>Salvar Histórico</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Seção de Override Manual */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Override Manual</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Multiplicador de Override</Text>
          <TextInput
            style={styles.input}
            value={overrideMultiplier}
            onChangeText={setOverrideMultiplier}
            keyboardType="numeric"
            placeholder="Ex: 1.2"
          />
        </View>
        <TouchableOpacity style={[styles.button, styles.warningButton]} onPress={handleApplyOverride}>
          <Text style={styles.buttonText}>Aplicar Override</Text>
        </TouchableOpacity>
      </View>

      {/* Seção de Histórico */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Histórico de Preços</Text>
        {loading ? (
          <Text>Carregando histórico...</Text>
        ) : history.length === 0 ? (
          <Text>Nenhum histórico disponível</Text>
        ) : (
          <View>
            {history.slice(0, 10).map((item) => (
              <View key={item.id} style={styles.historyItem}>
                <Text style={styles.historyDate}>
                  {new Date(item.calculatedAt).toLocaleString()}
                </Text>
                <Text style={styles.historyPrice}>
                  {item.basePrice.toFixed(2)} AOA → {item.finalPrice.toFixed(2)} AOA
                </Text>
                <Text style={styles.historyMultiplier}>
                  Multiplicador: x{item.multiplier.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333'
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333'
  },
  inputGroup: {
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#555'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white'
  },
  smallInput: {
    width: 80
  },
  factorRow: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 6
  },
  factorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  factorLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  factorValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF'
  },
  factorDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  priceCard: {
    backgroundColor: '#e8f4ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16
  },
  basePrice: {
    fontSize: 16,
    marginBottom: 4,
    color: '#333'
  },
  multiplier: {
    fontSize: 16,
    marginBottom: 4,
    color: '#007AFF'
  },
  finalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 4
  },
  primaryButton: {
    backgroundColor: '#007AFF'
  },
  secondaryButton: {
    backgroundColor: '#28a745'
  },
  warningButton: {
    backgroundColor: '#ffc107'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  historyItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  historyDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4
  },
  historyPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2
  },
  historyMultiplier: {
    fontSize: 14,
    color: '#007AFF'
  }
});