// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Button, Dropdown, Toast } from './components/common';
import { PricingSimulationService, SimulationScenario, SimulationResult } from '@gasrapido/shared';

interface PricingSimulationComponentProps {
  pricingService: any; // In a real implementation, we would import the proper type
}

const PricingSimulationComponent: React.FC<PricingSimulationComponentProps> = ({ 
  pricingService 
}) => {
  const [simulationService, setSimulationService] = useState<PricingSimulationService | null>(null);
  const [scenarios, setScenarios] = useState<SimulationScenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    // Initialize the simulation service
    if (pricingService) {
      const service = new PricingSimulationService(pricingService);
      setSimulationService(service);
      setScenarios(service.getDefaultScenarios());
    }
  }, [pricingService]);

  const handleRunSimulation = async () => {
    if (!simulationService || !selectedScenario) {
      Alert.alert('Erro', 'Por favor, selecione um cenário');
      return;
    }

    setIsLoading(true);
    try {
      const scenario = scenarios.find(s => s.id === selectedScenario);
      if (scenario) {
        const result = await simulationService.runSimulation(scenario);
        setResults([result, ...results]);
        setToastMessage(`Simulação concluída: ${result.passed ? 'PASSOU' : 'FALHOU'}`);
        setShowToast(true);
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao executar simulação');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunAllSimulations = async () => {
    if (!simulationService) {
      Alert.alert('Erro', 'Serviço de simulação não disponível');
      return;
    }

    setIsLoading(true);
    try {
      const allResults = await simulationService.runAllSimulations();
      setResults([...allResults, ...results]);
      setToastMessage(`Todas as simulações concluídas (${allResults.length} testes)`);
      setShowToast(true);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao executar todas as simulações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = () => {
    if (!simulationService || results.length === 0) {
      Alert.alert('Erro', 'Nenhum resultado de simulação disponível');
      return;
    }

    const report = simulationService.generateSimulationReport(results);
    console.log(report);
    Alert.alert('Relatório de Simulação', 'Relatório gerado no console');
  };

  const getStatusColor = (passed: boolean) => {
    return passed ? '#28a745' : '#dc3545';
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Simulação de Precificação</Text>
      
      <Card style={styles.setupCard}>
        <Text style={styles.sectionTitle}>Configuração de Teste</Text>
        <Dropdown
          options={scenarios.map(scenario => ({
            value: scenario.id,
            label: scenario.name
          }))}
          value={selectedScenario}
          onChange={setSelectedScenario}
          placeholder="Selecione um cenário de teste"
        />
        
        <View style={styles.buttonRow}>
          <Button 
            variant="primary" 
            size="md" 
            onPress={handleRunSimulation}
            disabled={isLoading || !selectedScenario}
            style={styles.actionButton}
          >
            {isLoading ? 'Executando...' : 'Executar Simulação'}
          </Button>
          
          <Button 
            variant="secondary" 
            size="md" 
            onPress={handleRunAllSimulations}
            disabled={isLoading}
            style={styles.actionButton}
          >
            Executar Todos
          </Button>
        </View>
      </Card>
      
      <Card style={styles.resultsCard}>
        <View style={styles.resultsHeader}>
          <Text style={styles.sectionTitle}>Resultados Recentes</Text>
          <Button 
            variant="outline" 
            size="sm" 
            onPress={handleGenerateReport}
            disabled={results.length === 0}
          >
            Gerar Relatório
          </Button>
        </View>
        
        {results.length === 0 ? (
          <Text style={styles.noResults}>Nenhum resultado de simulação disponível</Text>
        ) : (
          results.slice(0, 10).map((result, index) => {
            const scenario = scenarios.find(s => s.id === result.scenarioId);
            return (
              <Card key={index} style={styles.resultItem}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>{scenario?.name || result.scenarioId}</Text>
                  <Text style={[styles.resultStatus, { color: getStatusColor(result.passed) }]}>
                    {result.passed ? 'PASSOU' : 'FALHOU'}
                  </Text>
                </View>
                
                <View style={styles.resultDetails}>
                  <Text>Preço Calculado: {result.calculatedPrice.toFixed(2)} AOA</Text>
                  <Text>Faixa Esperada: {result.expectedRange.min.toFixed(2)} - {result.expectedRange.max.toFixed(2)} AOA</Text>
                  <Text>Desvio: {result.deviation.toFixed(2)}</Text>
                  <Text style={styles.timestamp}>
                    {new Date(result.timestamp).toLocaleString('pt-PT')}
                  </Text>
                </View>
              </Card>
            );
          })
        )}
      </Card>
      
      <Card style={styles.scenariosCard}>
        <Text style={styles.sectionTitle}>Cenários Disponíveis</Text>
        {scenarios.map((scenario) => (
          <View key={scenario.id} style={styles.scenarioItem}>
            <Text style={styles.scenarioName}>{scenario.name}</Text>
            <Text style={styles.scenarioDescription}>{scenario.description}</Text>
            <Text style={styles.scenarioRange}>
              Faixa Esperada: {scenario.expectedPriceRange.min.toFixed(2)} - {scenario.expectedPriceRange.max.toFixed(2)} AOA
            </Text>
          </View>
        ))}
      </Card>
      
      <Toast 
        visible={showToast}
        message={toastMessage}
        onClose={() => setShowToast(false)}
        duration={3000}
      />
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
  setupCard: {
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  resultsCard: {
    marginBottom: 16,
    padding: 16,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  noResults: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  resultItem: {
    marginBottom: 12,
    padding: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  resultStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  resultDetails: {
    fontSize: 14,
    color: '#555',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  scenariosCard: {
    marginBottom: 16,
    padding: 16,
  },
  scenarioItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  scenarioName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  scenarioDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  scenarioRange: {
    fontSize: 12,
    color: '#888',
  },
});

export default PricingSimulationComponent;