import React from 'react';
import { alertService, Alert } from '@gasrapido/shared';
import { Button } from './components/common';

interface AlertsManagementComponentProps {
  userId: string;
}

const AlertsManagementComponent: React.FC<AlertsManagementComponentProps> = ({ userId }: AlertsManagementComponentProps) => {
  const [alerts, setAlerts] = React.useState<Alert[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  React.useEffect(() => {
    loadAlerts();
  }, [userId]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const userAlerts = await alertService.getAlerts({ userId });
      setAlerts(userAlerts);
    } catch (error) {
      console.error('Erro ao carregar alertas:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAlerts();
    setRefreshing(false);
  };

  const markAsRead = async (alertId: string) => {
    try {
      await alertService.markAsRead(alertId);
      // Atualizar a lista de alertas
      await loadAlerts();
    } catch (error) {
      console.error('Erro ao marcar alerta como lido:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await alertService.markAllAsRead(userId);
      // Atualizar a lista de alertas
      await loadAlerts();
    } catch (error) {
      console.error('Erro ao marcar todos os alertas como lidos:', error);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      await alertService.resolveAlert(alertId);
      // Atualizar a lista de alertas
      await loadAlerts();
    } catch (error) {
      console.error('Erro ao resolver alerta:', error);
    }
  };

  const removeAlert = async (alertId: string) => {
    try {
      await alertService.removeAlert(alertId);
      // Atualizar a lista de alertas
      await loadAlerts();
    } catch (error) {
      console.error('Erro ao remover alerta:', error);
    }
  };

  const getAlertStyle = (type: Alert['type']) => {
    switch (type) {
      case 'scarcity':
        return { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' };
      case 'sla':
        return { backgroundColor: '#FEE2E2', borderColor: '#EF4444' };
      case 'pricing':
        return { backgroundColor: '#DBEAFE', borderColor: '#3B82F6' };
      case 'warning':
        return { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' };
      case 'error':
        return { backgroundColor: '#FEE2E2', borderColor: '#EF4444' };
      case 'info':
      default:
        return { backgroundColor: '#DBEAFE', borderColor: '#3B82F6' };
    }
  };

  const getSeverityIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return '🔴';
      case 'high':
        return '🟠';
      case 'medium':
        return '🟡';
      case 'low':
      default:
        return '🟢';
    }
  };

  if (loading) {
    return React.createElement('div', { style: { padding: '16px' } },
      React.createElement('p', null, 'Carregando alertas...')
    );
  }

  return React.createElement('div', { style: { padding: '16px' } },
    React.createElement('div', { 
      style: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '16px' 
      }
    },
      React.createElement('h2', { style: { fontSize: '24px', fontWeight: 'bold' } }, 'Alertas e Notificações'),
      alerts.length > 0 && React.createElement(Button, { 
        variant: "secondary", 
        size: "sm", 
        onClick: markAllAsRead 
      }, 'Marcar todos como lidos')
    ),
    alerts.length === 0 ? 
      React.createElement('div', { 
        style: { 
          padding: '32px', 
          textAlign: 'center',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          backgroundColor: '#f9fafb'
        }
      },
        React.createElement('p', { style: { fontSize: '16px', color: '#666' } }, 'Nenhum alerta no momento')
      ) :
      React.createElement('div', null,
        alerts.map((alert: Alert) => 
          React.createElement('div', { 
            key: alert.id, 
            style: {
              marginBottom: '12px',
              padding: '16px',
              borderRadius: '8px',
              borderWidth: '1px',
              borderStyle: 'solid',
              ...getAlertStyle(alert.type),
              ...(alert.read ? {} : { borderLeft: '4px solid #3B82F6' })
            }
          },
            React.createElement('div', { 
              style: { 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '8px' 
              }
            },
              React.createElement('h3', { style: { fontSize: '18px', fontWeight: 'bold' } }, alert.title),
              React.createElement('span', { style: { fontSize: '16px' } }, getSeverityIcon(alert.severity))
            ),
            React.createElement('p', { style: { fontSize: '14px', marginBottom: '12px' } }, alert.message),
            React.createElement('div', { 
              style: { 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }
            },
              React.createElement('span', { style: { fontSize: '12px', color: '#666' } },
                new Date(alert.createdAt).toLocaleString('pt-BR')
              ),
              React.createElement('div', { style: { display: 'flex' } },
                !alert.read && React.createElement('button', { 
                  style: { 
                    marginLeft: '12px',
                    fontSize: '12px',
                    color: '#3B82F6',
                    fontWeight: 'bold',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  },
                  onClick: () => markAsRead(alert.id)
                }, 'Marcar como lido'),
                alert.type !== 'info' && !alert.resolvedAt && React.createElement('button', { 
                  style: { 
                    marginLeft: '12px',
                    fontSize: '12px',
                    color: '#3B82F6',
                    fontWeight: 'bold',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  },
                  onClick: () => resolveAlert(alert.id)
                }, 'Resolver'),
                React.createElement('button', { 
                  style: { 
                    marginLeft: '12px',
                    fontSize: '12px',
                    color: '#3B82F6',
                    fontWeight: 'bold',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  },
                  onClick: () => removeAlert(alert.id)
                }, 'Remover')
              )
            )
          )
        )
      )
  );
};

export default AlertsManagementComponent;