// @ts-nocheck
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Button } from './components/common';
import AdminOverrideControlsComponent from './AdminOverrideControlsComponent';
import IntelligenceEngineManagementComponent from './IntelligenceEngineManagementComponent';
import { IntelligenceEngineService } from '@gasrapido/shared';

interface AdminDashboardComponentProps {
  userId: string;
  intelligenceEngineService: IntelligenceEngineService;
}

const AdminDashboardComponent: React.FC<AdminDashboardComponentProps> = ({
  userId,
  intelligenceEngineService
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'overrides' | 'intelligence'>('overview');

  const renderOverview = () => (
    <ScrollView>
      <Text style={styles.sectionTitle}>Visão Geral do Sistema</Text>
      
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>24</Text>
          <Text style={styles.statLabel}>Alertas Ativos</Text>
        </Card>
        
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Overrides Pendentes</Text>
        </Card>
        
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>8</Text>
          <Text style={styles.statLabel}>Políticas Ativas</Text>
        </Card>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <View style={styles.quickActions}>
          <Button 
            variant="primary" 
            size="md" 
            onPress={() => setActiveTab('overrides')}
            style={styles.quickActionButton}
          >
            Gerenciar Overrides
          </Button>
          
          <Button 
            variant="secondary" 
            size="md" 
            onPress={() => setActiveTab('intelligence')}
            style={styles.quickActionButton}
          >
            Motor de Inteligência
          </Button>
          
          <Button 
            variant="outline" 
            size="md" 
            onPress={() => {}}
            style={styles.quickActionButton}
          >
            Logs de Auditoria
          </Button>
          
          <Button 
            variant="outline" 
            size="md" 
            onPress={() => {}}
            style={styles.quickActionButton}
          >
            Configurações
          </Button>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Últimos Eventos</Text>
        <Card style={styles.eventCard}>
          <Text style={styles.eventTitle}>Novo Override Aplicado</Text>
          <Text>Usuário admin-1 aplicou override para pedido #12345</Text>
          <Text style={styles.eventTime}>Há 5 minutos</Text>
        </Card>
        
        <Card style={styles.eventCard}>
          <Text style={styles.eventTitle}>Alerta de SLA</Text>
          <Text>Pedido #67890 está atrasado além do SLA definido</Text>
          <Text style={styles.eventTime}>Há 12 minutos</Text>
        </Card>
        
        <Card style={styles.eventCard}>
          <Text style={styles.eventTitle}>Política Atualizada</Text>
          <Text>Regra "Preço Emergencial" foi desativada</Text>
          <Text style={styles.eventTime}>Há 1 hora</Text>
        </Card>
      </View>
    </ScrollView>
  );

  const renderOverrides = () => (
    <AdminOverrideControlsComponent 
      userId={userId}
      onOverrideApplied={(override) => console.log('Override aplicado:', override)}
      onPolicyUpdated={(policy) => console.log('Política atualizada:', policy)}
    />
  );

  const renderIntelligence = () => (
    <IntelligenceEngineManagementComponent 
      intelligenceEngineService={intelligenceEngineService}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel Administrativo</Text>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Visão Geral
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'overrides' && styles.activeTab]}
          onPress={() => setActiveTab('overrides')}
        >
          <Text style={[styles.tabText, activeTab === 'overrides' && styles.activeTabText]}>
            Overrides
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'intelligence' && styles.activeTab]}
          onPress={() => setActiveTab('intelligence')}
        >
          <Text style={[styles.tabText, activeTab === 'intelligence' && styles.activeTabText]}>
            Inteligência
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'overrides' && renderOverrides()}
        {activeTab === 'intelligence' && renderIntelligence()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 8,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    minWidth: '48%',
    marginBottom: 12,
  },
  eventCard: {
    marginBottom: 12,
    padding: 16,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#007AFF',
  },
  eventTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
});

export default AdminDashboardComponent;