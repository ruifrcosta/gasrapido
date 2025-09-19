// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { MetricsService, DashboardMetrics } from '@gasrapido/shared';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface ComprehensiveDashboardComponentProps {
  metricsService: MetricsService;
  userRole: 'admin' | 'ops' | 'finance';
}

const ComprehensiveDashboardComponent: React.FC<ComprehensiveDashboardComponentProps> = ({ 
  metricsService,
  userRole
}) => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'orders' | 'financial' | 'performance' | 'operational'>('overview');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const dashboardMetrics = await metricsService.getDashboardMetrics();
        setMetrics(dashboardMetrics);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar métricas do dashboard');
        console.error('Error fetching metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    
    // Refresh metrics every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [metricsService]);

  // Filter tabs based on user role
  const getAvailableTabs = () => {
    const allTabs = [
      { id: 'overview', label: 'Visão Geral', roles: ['admin', 'ops', 'finance'] },
      { id: 'users', label: 'Usuários', roles: ['admin', 'ops'] },
      { id: 'orders', label: 'Pedidos', roles: ['admin', 'ops'] },
      { id: 'financial', label: 'Financeiro', roles: ['admin', 'finance'] },
      { id: 'performance', label: 'Desempenho', roles: ['admin', 'ops'] },
      { id: 'operational', label: 'Operacional', roles: ['admin', 'ops'] }
    ];
    
    return allTabs.filter(tab => tab.roles.includes(userRole));
  };

  const availableTabs = getAvailableTabs();

  // Set initial tab based on user role if overview is not available
  useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.find(tab => tab.id === activeTab)) {
      setActiveTab(availableTabs[0].id as any);
    }
  }, [userRole]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando métricas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!metrics) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>Nenhuma métrica disponível</Text>
      </View>
    );
  }

  const renderOverview = () => (
    <ScrollView>
      <Text style={styles.sectionTitle}>Visão Geral do Sistema</Text>
      
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{metrics.totalUsers}</Text>
          <Text style={styles.metricLabel}>Total de Usuários</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{metrics.activeUsers}</Text>
          <Text style={styles.metricLabel}>Usuários Ativos</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{metrics.totalOrders}</Text>
          <Text style={styles.metricLabel}>Total de Pedidos</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>
            {metrics.totalRevenue.toLocaleString('pt-AO', { 
              style: 'currency', 
              currency: 'AOA' 
            })}
          </Text>
          <Text style={styles.metricLabel}>Receita Total</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Indicadores-Chave</Text>
        <View style={styles.kpiGrid}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{metrics.systemUptime}%</Text>
            <Text style={styles.kpiLabel}>Disponibilidade</Text>
          </View>
          
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{metrics.orderCompletionRate}%</Text>
            <Text style={styles.kpiLabel}>Taxa de Conclusão</Text>
          </View>
          
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{metrics.averageResponseTime}ms</Text>
            <Text style={styles.kpiLabel}>Tempo de Resposta</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderUserMetrics = () => (
    <ScrollView>
      <Text style={styles.sectionTitle}>Métricas de Usuários</Text>
      
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{metrics.totalUsers}</Text>
          <Text style={styles.metricLabel}>Total de Usuários</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{metrics.activeUsers}</Text>
          <Text style={styles.metricLabel}>Usuários Ativos</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{metrics.newUsersToday}</Text>
          <Text style={styles.metricLabel}>Novos Hoje</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gráfico de Crescimento</Text>
        <View style={styles.chartPlaceholder}>
          <Text>Gráfico de crescimento de usuários</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderOrderMetrics = () => (
    <ScrollView>
      <Text style={styles.sectionTitle}>Métricas de Pedidos</Text>
      
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{metrics.totalOrders}</Text>
          <Text style={styles.metricLabel}>Total de Pedidos</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{metrics.ordersToday}</Text>
          <Text style={styles.metricLabel}>Pedidos Hoje</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>
            {metrics.averageOrderValue.toLocaleString('pt-AO', { 
              style: 'currency', 
              currency: 'AOA' 
            })}
          </Text>
          <Text style={styles.metricLabel}>Ticket Médio</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{metrics.orderCompletionRate}%</Text>
          <Text style={styles.metricLabel}>Taxa de Conclusão</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status dos Pedidos</Text>
        <View style={styles.statusGrid}>
          <View style={styles.statusCard}>
            <Text style={styles.statusValue}>{metrics.pendingOrders}</Text>
            <Text style={styles.statusLabel}>Pendentes</Text>
          </View>
          
          <View style={styles.statusCard}>
            <Text style={styles.statusValue}>{metrics.activeDeliveries}</Text>
            <Text style={styles.statusLabel}>Em Entrega</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderFinancialMetrics = () => (
    <ScrollView>
      <Text style={styles.sectionTitle}>Métricas Financeiras</Text>
      
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>
            {metrics.totalRevenue.toLocaleString('pt-AO', { 
              style: 'currency', 
              currency: 'AOA' 
            })}
          </Text>
          <Text style={styles.metricLabel}>Receita Total</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>
            {metrics.revenueToday.toLocaleString('pt-AO', { 
              style: 'currency', 
              currency: 'AOA' 
            })}
          </Text>
          <Text style={styles.metricLabel}>Receita Hoje</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{metrics.pendingPayments}</Text>
          <Text style={styles.metricLabel}>Pagamentos Pendentes</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Indicadores Financeiros</Text>
        <View style={styles.indicatorsGrid}>
          <View style={styles.indicator}>
            <Text style={styles.indicatorLabel}>Margem Bruta</Text>
            <Text style={styles.indicatorValue}>65%</Text>
          </View>
          
          <View style={styles.indicator}>
            <Text style={styles.indicatorLabel}>Crescimento Mês</Text>
            <Text style={styles.indicatorValuePositive}>+12%</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderPerformanceMetrics = () => (
    <ScrollView>
      <Text style={styles.sectionTitle}>Métricas de Desempenho</Text>
      
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{metrics.averageResponseTime}ms</Text>
          <Text style={styles.metricLabel}>Tempo Médio de Resposta</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{metrics.systemUptime}%</Text>
          <Text style={styles.metricLabel}>Disponibilidade</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{metrics.errorRate}%</Text>
          <Text style={styles.metricLabel}>Taxa de Erros</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Monitoramento em Tempo Real</Text>
        <View style={styles.chartPlaceholder}>
          <Text>Gráfico de desempenho em tempo real</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderOperationalMetrics = () => (
    <ScrollView>
      <Text style={styles.sectionTitle}>Métricas Operacionais</Text>
      
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{metrics.pendingOrders}</Text>
          <Text style={styles.metricLabel}>Pedidos Pendentes</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{metrics.activeDeliveries}</Text>
          <Text style={styles.metricLabel}>Entregas Ativas</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{metrics.supportTickets}</Text>
          <Text style={styles.metricLabel}>Tickets de Suporte</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Eficiência Operacional</Text>
        <View style={styles.indicatorsGrid}>
          <View style={styles.indicator}>
            <Text style={styles.indicatorLabel}>Tempo Médio de Entrega</Text>
            <Text style={styles.indicatorValue}>45 min</Text>
          </View>
          
          <View style={styles.indicator}>
            <Text style={styles.indicatorLabel}>Taxa de Sucesso</Text>
            <Text style={styles.indicatorValue}>98.5%</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'users': return renderUserMetrics();
      case 'orders': return renderOrderMetrics();
      case 'financial': return renderFinancialMetrics();
      case 'performance': return renderPerformanceMetrics();
      case 'operational': return renderOperationalMetrics();
      default: return renderOverview();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel de Controle</Text>
      
      {availableTabs.length > 1 && (
        <View style={styles.tabContainer}>
          {availableTabs.map(tab => (
            <TouchableOpacity 
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              onPress={() => setActiveTab(tab.id as any)}
            >
              <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      <View style={styles.content}>
        {renderContent()}
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
  loadingText: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
  },
  errorText: {
    textAlign: 'center',
    padding: 20,
    color: '#d32f2f',
  },
  noDataText: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  metricCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
  },
  kpiGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  kpiCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  kpiLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
  },
  indicatorsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  indicator: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  indicatorLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  indicatorValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  indicatorValuePositive: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});

export default ComprehensiveDashboardComponent;