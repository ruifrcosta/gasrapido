// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { MetricsService, DashboardMetrics } from '@gasrapido/shared';

interface FinancialDashboardComponentProps {
  metricsService: MetricsService;
}

const FinancialDashboardComponent: React.FC<FinancialDashboardComponentProps> = ({ 
  metricsService 
}) => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const dashboardMetrics = await metricsService.getDashboardMetrics();
        setMetrics(dashboardMetrics);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar métricas financeiras');
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

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Carregando métricas financeiras...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error}</div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div style={styles.container}>
        <div style={styles.noData}>Nenhuma métrica financeira disponível</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Painel Financeiro</h2>
      
      <div style={styles.metricsGrid}>
        <div style={styles.metricCard}>
          <div style={styles.metricValue}>
            {metrics.totalRevenue.toLocaleString('pt-AO', { 
              style: 'currency', 
              currency: 'AOA' 
            })}
          </div>
          <div style={styles.metricLabel}>Receita Total</div>
        </div>
        
        <div style={styles.metricCard}>
          <div style={styles.metricValue}>
            {metrics.revenueToday.toLocaleString('pt-AO', { 
              style: 'currency', 
              currency: 'AOA' 
            })}
          </div>
          <div style={styles.metricLabel}>Receita Hoje</div>
        </div>
        
        <div style={styles.metricCard}>
          <div style={styles.metricValue}>
            {metrics.averageOrderValue.toLocaleString('pt-AO', { 
              style: 'currency', 
              currency: 'AOA' 
            })}
          </div>
          <div style={styles.metricLabel}>Ticket Médio</div>
        </div>
        
        <div style={styles.metricCard}>
          <div style={styles.metricValue}>{metrics.pendingPayments}</div>
          <div style={styles.metricLabel}>Pagamentos Pendentes</div>
        </div>
      </div>
      
      <div style={styles.chartContainer}>
        <h3 style={styles.sectionTitle}>Receita por Período</h3>
        <div style={styles.chartPlaceholder}>
          <div>Gráfico de receita por período</div>
          <div>(Integração com biblioteca de gráficos)</div>
        </div>
      </div>
      
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Indicadores Financeiros</h3>
        <div style={styles.indicatorsGrid}>
          <div style={styles.indicator}>
            <div style={styles.indicatorLabel}>Margem Bruta</div>
            <div style={styles.indicatorValue}>65%</div>
          </div>
          
          <div style={styles.indicator}>
            <div style={styles.indicatorLabel}>Crescimento Mês</div>
            <div style={styles.indicatorValuePositive}>+12%</div>
          </div>
          
          <div style={styles.indicator}>
            <div style={styles.indicatorLabel}>Ticket Médio</div>
            <div style={styles.indicatorValue}>
              {metrics.averageOrderValue.toLocaleString('pt-AO', { 
                style: 'currency', 
                currency: 'AOA' 
              })}
            </div>
          </div>
          
          <div style={styles.indicator}>
            <div style={styles.indicatorLabel}>Conversão</div>
            <div style={styles.indicatorValue}>3.2%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    minHeight: '100%',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    color: '#666',
  },
  error: {
    textAlign: 'center',
    padding: '20px',
    color: '#d32f2f',
  },
  noData: {
    textAlign: 'center',
    padding: '20px',
    color: '#666',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  metricCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  metricValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: '8px',
  },
  metricLabel: {
    fontSize: '14px',
    color: '#666',
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '30px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#333',
  },
  chartPlaceholder: {
    height: '300px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  indicatorsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
  },
  indicator: {
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    textAlign: 'center',
  },
  indicatorLabel: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
  },
  indicatorValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
  },
  indicatorValuePositive: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#4caf50',
  },
};

export default FinancialDashboardComponent;