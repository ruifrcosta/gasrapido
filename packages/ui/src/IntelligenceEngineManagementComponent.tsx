// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { IntelligenceEngineService } from '../../shared/services/intelligenceEngineService';
import { Decision, FraudDetectionResult, MaintenancePrediction, Anomaly } from '../../shared/types/intelligenceTypes';

interface IntelligenceEngineManagementComponentProps {
  intelligenceEngineService: IntelligenceEngineService;
  onDecisionMake?: (decision: Decision) => void;
  onFraudDetect?: (result: FraudDetectionResult) => void;
  onMaintenancePredict?: (prediction: MaintenancePrediction) => void;
}

const IntelligenceEngineManagementComponent: React.FC<IntelligenceEngineManagementComponentProps> = ({
  intelligenceEngineService,
  onDecisionMake,
  onFraudDetect,
  onMaintenancePredict
}) => {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [fraudResults, setFraudResults] = useState<FraudDetectionResult[]>([]);
  const [maintenancePredictions, setMaintenancePredictions] = useState<MaintenancePrediction[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadIntelligenceData();
  }, []);

  const loadIntelligenceData = async () => {
    try {
      setLoading(true);
      const [decisionData, fraudData, maintenanceData] = await Promise.all([
        intelligenceEngineService.getDecisionHistory(),
        intelligenceEngineService.getFraudHistory(),
        intelligenceEngineService.getMaintenanceHistory()
      ]);
      
      setDecisions(decisionData);
      setFraudResults(fraudData);
      setMaintenancePredictions(maintenanceData);
    } catch (error) {
      console.error('Erro ao carregar dados de inteligência:', error);
      Alert.alert('Erro', 'Falha ao carregar dados de inteligência');
    } finally {
      setLoading(false);
    }
  };

  const handleMakeDecision = async () => {
    try {
      const mockData = {
        orderId: 'ORD-' + Math.random().toString(36).substring(7),
        customerId: 'CUST-' + Math.random().toString(36).substring(7),
        amount: Math.floor(Math.random() * 1000) + 100
      };
      
      const decision = await intelligenceEngineService.makeDecision(mockData, 'ORDER_APPROVAL');
      setDecisions([decision, ...decisions]);
      onDecisionMake?.(decision);
      Alert.alert('Sucesso', 'Decisão tomada com sucesso');
    } catch (error) {
      console.error('Erro ao tomar decisão:', error);
      Alert.alert('Erro', 'Falha ao tomar decisão');
    }
  };

  const handleDetectFraud = async () => {
    try {
      const mockTransaction = {
        id: 'TXN-' + Math.random().toString(36).substring(7),
        amount: Math.floor(Math.random() * 5000) + 100,
        customerId: 'CUST-' + Math.random().toString(36).substring(7),
        timestamp: new Date().toISOString()
      };
      
      const fraudResult = await intelligenceEngineService.detectFraud(mockTransaction);
      setFraudResults([fraudResult, ...fraudResults]);
      onFraudDetect?.(fraudResult);
      Alert.alert('Sucesso', 'Detecção de fraude realizada com sucesso');
    } catch (error) {
      console.error('Erro ao detectar fraude:', error);
      Alert.alert('Erro', 'Falha ao detectar fraude');
    }
  };

  const handlePredictMaintenance = async () => {
    try {
      const mockEquipment = {
        id: 'EQP-' + Math.random().toString(36).substring(7),
        type: 'DELIVERY_VEHICLE',
        lastMaintenance: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
        usageHours: Math.floor(Math.random() * 1000) + 100
      };
      
      const prediction = await intelligenceEngineService.predictMaintenance(mockEquipment);
      setMaintenancePredictions([prediction, ...maintenancePredictions]);
      onMaintenancePredict?.(prediction);
      Alert.alert('Sucesso', 'Predição de manutenção realizada com sucesso');
    } catch (error) {
      console.error('Erro ao prever manutenção:', error);
      Alert.alert('Erro', 'Falha ao prever manutenção');
    }
  };

  const handleDetectAnomalies = async () => {
    try {
      const mockData = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        value: Math.random() * 100,
        timestamp: new Date(Date.now() - i * 60000).toISOString()
      }));
      
      const detectedAnomalies = await intelligenceEngineService.detectAnomalies(mockData);
      setAnomalies([...detectedAnomalies, ...anomalies]);
      Alert.alert('Sucesso', `Detectadas ${detectedAnomalies.length} anomalias`);
    } catch (error) {
      console.error('Erro ao detectar anomalias:', error);
      Alert.alert('Erro', 'Falha ao detectar anomalias');
    }
  };

  const renderDecisionItem = (decision: Decision) => (
    <View key={decision.id} style={styles.itemContainer}>
      <Text style={styles.itemTitle}>Decisão #{decision.id.substring(0, 6)}</Text>
      <Text>Recomendação: {decision.recommendation}</Text>
      <Text>Confiança: {(decision.confidence * 100).toFixed(1)}%</Text>
      <Text>Fatores: {decision.factors.join(', ')}</Text>
      <Text>{new Date(decision.timestamp).toLocaleString()}</Text>
    </View>
  );

  const renderFraudItem = (fraud: FraudDetectionResult) => (
    <View key={Math.random()} style={styles.itemContainer}>
      <Text style={styles.itemTitle}>Detecção de Fraude</Text>
      <Text>Fraudulenta: {fraud.isFraudulent ? 'Sim' : 'Não'}</Text>
      <Text>Score de Risco: {(fraud.riskScore * 100).toFixed(1)}%</Text>
      <Text>Indicadores: {fraud.indicators.join(', ') || 'Nenhum'}</Text>
      <Text>{new Date(fraud.timestamp).toLocaleString()}</Text>
    </View>
  );

  const renderMaintenanceItem = (maintenance: MaintenancePrediction) => (
    <View key={maintenance.equipmentId} style={styles.itemContainer}>
      <Text style={styles.itemTitle}>Predição de Manutenção</Text>
      <Text>Equipamento: {maintenance.equipmentId.substring(0, 6)}</Text>
      <Text>Manutenção Necessária: {maintenance.needsMaintenance ? 'Sim' : 'Não'}</Text>
      <Text>Prazo: {maintenance.predictedTimeframe}</Text>
      <Text>Confiança: {(maintenance.confidence * 100).toFixed(1)}%</Text>
      <Text>Fatores de Risco: {maintenance.riskFactors.join(', ') || 'Nenhum'}</Text>
      <Text>{new Date(maintenance.timestamp).toLocaleString()}</Text>
    </View>
  );

  const renderAnomalyItem = (anomaly: Anomaly) => (
    <View key={anomaly.id} style={styles.itemContainer}>
      <Text style={styles.itemTitle}>Anomalia Detectada</Text>
      <Text>Tipo: {anomaly.type}</Text>
      <Text>Severidade: {anomaly.severity}</Text>
      <Text>Descrição: {anomaly.description}</Text>
      <Text>{new Date(anomaly.timestamp).toLocaleString()}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando dados de inteligência...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Motor de Inteligência</Text>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleMakeDecision}>
          <Text style={styles.buttonText}>Tomar Decisão</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleDetectFraud}>
          <Text style={styles.buttonText}>Detectar Fraude</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handlePredictMaintenance}>
          <Text style={styles.buttonText}>Prever Manutenção</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleDetectAnomalies}>
          <Text style={styles.buttonText}>Detectar Anomalias</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={loadIntelligenceData}>
          <Text style={styles.buttonText}>Atualizar Dados</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Decisões Recentes</Text>
        {decisions.slice(0, 5).map(renderDecisionItem)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detecções de Fraude</Text>
        {fraudResults.slice(0, 5).map(renderFraudItem)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Predições de Manutenção</Text>
        {maintenancePredictions.slice(0, 5).map(renderMaintenanceItem)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Anomalias Detectadas</Text>
        {anomalies.slice(0, 5).map(renderAnomalyItem)}
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
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    margin: 4,
    flex: 1,
    minWidth: 120,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  itemContainer: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#007AFF',
  },
});

export default IntelligenceEngineManagementComponent;