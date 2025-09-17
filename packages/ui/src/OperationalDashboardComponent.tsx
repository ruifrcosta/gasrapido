// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { MetricsService, DashboardMetrics } from '@gasrapido/shared';

interface OperationalDashboardComponentProps {
  metricsService: MetricsService;
}

const OperationalDashboardComponent: React.FC<OperationalDashboardComponentProps> = ({ 
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Carregando métricas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-6">
        <div className="text-center">Nenhuma métrica disponível</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Painel Operacional</h1>
      
      {/* User Metrics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Métricas de Usuários</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-blue-600">{metrics.totalUsers}</div>
            <div className="text-gray-600">Total de Usuários</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-green-600">{metrics.activeUsers}</div>
            <div className="text-gray-600">Usuários Ativos</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-purple-600">{metrics.newUsersToday}</div>
            <div className="text-gray-600">Novos Hoje</div>
          </div>
        </div>
      </div>
      
      {/* Order Metrics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Métricas de Pedidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-blue-600">{metrics.totalOrders}</div>
            <div className="text-gray-600">Total de Pedidos</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-green-600">{metrics.ordersToday}</div>
            <div className="text-gray-600">Pedidos Hoje</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-yellow-600">
              {metrics.averageOrderValue.toLocaleString('pt-AO', { 
                style: 'currency', 
                currency: 'AOA' 
              })}
            </div>
            <div className="text-gray-600">Valor Médio</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-purple-600">{metrics.orderCompletionRate}%</div>
            <div className="text-gray-600">Taxa de Conclusão</div>
          </div>
        </div>
      </div>
      
      {/* Financial Metrics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Métricas Financeiras</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-blue-600">
              {metrics.totalRevenue.toLocaleString('pt-AO', { 
                style: 'currency', 
                currency: 'AOA' 
              })}
            </div>
            <div className="text-gray-600">Receita Total</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-green-600">
              {metrics.revenueToday.toLocaleString('pt-AO', { 
                style: 'currency', 
                currency: 'AOA' 
              })}
            </div>
            <div className="text-gray-600">Receita Hoje</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-red-600">{metrics.pendingPayments}</div>
            <div className="text-gray-600">Pagamentos Pendentes</div>
          </div>
        </div>
      </div>
      
      {/* Performance Metrics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Métricas de Desempenho</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-blue-600">{metrics.averageResponseTime}ms</div>
            <div className="text-gray-600">Tempo Médio de Resposta</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-green-600">{metrics.systemUptime}%</div>
            <div className="text-gray-600">Disponibilidade</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-red-600">{metrics.errorRate}%</div>
            <div className="text-gray-600">Taxa de Erros</div>
          </div>
        </div>
      </div>
      
      {/* Operational Metrics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Métricas Operacionais</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-yellow-600">{metrics.pendingOrders}</div>
            <div className="text-gray-600">Pedidos Pendentes</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-blue-600">{metrics.activeDeliveries}</div>
            <div className="text-gray-600">Entregas Ativas</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-purple-600">{metrics.supportTickets}</div>
            <div className="text-gray-600">Tickets de Suporte</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationalDashboardComponent;