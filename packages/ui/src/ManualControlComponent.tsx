// @ts-nocheck
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Button, Toggle, Dropdown, Toast } from './components/common';
import { alertService } from '@gasrapido/shared';

interface ManualControlComponentProps {
  userId: string;
}

const ManualControlComponent: React.FC<ManualControlComponentProps> = ({ userId }) => {
  const [systemStatus, setSystemStatus] = useState({
    pricingEngine: true,
    matchingEngine: true,
    notificationService: true,
    paymentProcessing: true,
    inventorySync: true
  });
  
  const [pricingMode, setPricingMode] = useState('dynamic');
  const [slaExtension, setSlaExtension] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const toggleSystem = (system: keyof typeof systemStatus) => {
    setSystemStatus(prev => ({
      ...prev,
      [system]: !prev[system]
    }));
    
    setToastMessage(`Sistema ${system} ${!systemStatus[system] ? 'desativado' : 'ativado'}`);
    setShowToast(true);
  };

  const handleTriggerAlert = async (alertType: string) => {
    try {
      const alertData = {
        title: `Alerta Manual: ${alertType}`,
        message: `Alerta manual acionado pelo administrador ${userId}`,
        type: alertType as any,
        severity: 'high' as const,
        userId: userId
      };
      
      await alertService.createAlert(alertData);
      setToastMessage(`Alerta ${alertType} criado com sucesso`);
      setShowToast(true);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar alerta manual');
    }
  };

  const handlePricingModeChange = (mode: string) => {
    setPricingMode(mode);
    setToastMessage(`Modo de precificação alterado para ${mode === 'dynamic' ? 'Dinâmico' : 'Fixo'}`);
    setShowToast(true);
  };

  const handleExtendSLA = () => {
    if (slaExtension > 0) {
      setToastMessage(`SLA estendido em ${slaExtension} minutos`);
      setShowToast(true);
      setSlaExtension(0);
    }
  };

  const handleResetSystem = () => {
    Alert.alert(
      'Confirmar Reset',
      'Tem certeza que deseja resetar todos os sistemas para o estado padrão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Resetar', 
          style: 'destructive',
          onPress: () => {
            setSystemStatus({
              pricingEngine: true,
              matchingEngine: true,
              notificationService: true,
              paymentProcessing: true,
              inventorySync: true
            });
            setPricingMode('dynamic');
            setToastMessage('Sistemas resetados para configuração padrão');
            setShowToast(true);
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Controles Manuais do Sistema</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status dos Sistemas</Text>
        {Object.entries(systemStatus).map(([system, status]) => (
          <Card key={system} style={styles.controlCard}>
            <View style={styles.controlRow}>
              <Text style={styles.controlLabel}>
                {system === 'pricingEngine' && 'Motor de Precificação'}
                {system === 'matchingEngine' && 'Motor de Matching'}
                {system === 'notificationService' && 'Serviço de Notificações'}
                {system === 'paymentProcessing' && 'Processamento de Pagamentos'}
                {system === 'inventorySync' && 'Sincronização de Inventário'}
              </Text>
              <Toggle
                checked={status}
                onChange={() => toggleSystem(system as keyof typeof systemStatus)}
              />
            </View>
          </Card>
        ))}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Controles de Precificação</Text>
        <Card style={styles.controlCard}>
          <View style={styles.controlRow}>
            <Text style={styles.controlLabel}>Modo de Precificação</Text>
            <Dropdown
              options={[
                { value: 'dynamic', label: 'Dinâmico' },
                { value: 'fixed', label: 'Fixo' }
              ]}
              value={pricingMode}
              onChange={handlePricingModeChange}
            />
          </View>
        </Card>
        
        <Card style={styles.controlCard}>
          <View style={styles.controlRow}>
            <Text style={styles.controlLabel}>Ajuste Manual de Preços</Text>
            <Button 
              variant="secondary" 
              size="sm" 
              onPress={() => {}}
            >
              Configurar
            </Button>
          </View>
        </Card>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Controles de SLA</Text>
        <Card style={styles.controlCard}>
          <View style={styles.controlRow}>
            <Text style={styles.controlLabel}>Extensão de SLA (minutos)</Text>
            <Dropdown
              options={[
                { value: '0', label: '0' },
                { value: '15', label: '15' },
                { value: '30', label: '30' },
                { value: '60', label: '60' },
                { value: '120', label: '120' }
              ]}
              value={slaExtension.toString()}
              onChange={(value) => setSlaExtension(parseInt(value))}
            />
          </View>
          <Button 
            variant="primary" 
            size="md" 
            onPress={handleExtendSLA}
            disabled={slaExtension === 0}
            style={styles.actionButton}
          >
            Aplicar Extensão
          </Button>
        </Card>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alertas Manuais</Text>
        <View style={styles.buttonGrid}>
          <Button 
            variant="outline" 
            size="md" 
            onPress={() => handleTriggerAlert('scarcity')}
            style={styles.alertButton}
          >
            Alerta de Escassez
          </Button>
          
          <Button 
            variant="outline" 
            size="md" 
            onPress={() => handleTriggerAlert('sla')}
            style={styles.alertButton}
          >
            Alerta de SLA
          </Button>
          
          <Button 
            variant="outline" 
            size="md" 
            onPress={() => handleTriggerAlert('pricing')}
            style={styles.alertButton}
          >
            Alerta de Preço
          </Button>
          
          <Button 
            variant="outline" 
            size="md" 
            onPress={() => handleTriggerAlert('warning')}
            style={styles.alertButton}
          >
            Alerta Geral
          </Button>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ações do Sistema</Text>
        <Button 
          variant="destructive" 
          size="md" 
          onPress={handleResetSystem}
          style={styles.actionButton}
        >
          Resetar Todos os Sistemas
        </Button>
      </View>
      
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  controlCard: {
    marginBottom: 12,
    padding: 16,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  controlLabel: {
    fontSize: 16,
    color: '#333',
  },
  actionButton: {
    marginTop: 16,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  alertButton: {
    minWidth: '48%',
    marginBottom: 12,
  },
});

export default ManualControlComponent;