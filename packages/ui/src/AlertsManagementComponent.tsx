import React from 'react';
import { alertService, Alert, notificationService } from '@gasrapido/shared';
import { Button } from './components/common';

// Definir interface para notificações
interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  userId?: string;
  orderId?: string;
}

// Definir tipo para itens unificados (alertas e notificações)
type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: 'scarcity' | 'sla' | 'pricing' | 'info' | 'warning' | 'error' | 'success';
  severity?: 'low' | 'medium' | 'high' | 'critical'; // Para alertas
  timestamp: string;
  read: boolean;
  itemType: 'alert' | 'notification';
}

interface AlertsManagementComponentProps {
  userId: string;
}

const AlertsManagementComponent: React.FC<AlertsManagementComponentProps> = ({ userId }: AlertsManagementComponentProps) => {
  const [items, setItems] = React.useState<NotificationItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  React.useEffect(() => {
    loadItems();
  }, [userId]);

  const loadItems = async () => {
    try {
      setLoading(true);
      
      // Carregar alertas
      const userAlerts = await alertService.getAlerts({ userId });
      
      // Carregar notificações
      const userNotifications = await notificationService.getUserNotifications(userId);
      
      // Combinar e formatar os itens
      const combinedItems: NotificationItem[] = [
        ...userAlerts.map((alert: Alert) => ({
          id: alert.id,
          title: alert.title,
          message: alert.message,
          type: alert.type,
          severity: alert.severity,
          timestamp: alert.createdAt,
          read: alert.read,
          itemType: 'alert' as const
        })),
        ...userNotifications.map((notification: AppNotification) => ({
          id: notification.id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          timestamp: notification.timestamp,
          read: notification.read,
          itemType: 'notification' as const
        }))
      ];
      
      // Ordenar por data (mais recente primeiro)
      combinedItems.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      setItems(combinedItems);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  };

  const markAsRead = async (itemId: string, itemType: 'alert' | 'notification') => {
    try {
      if (itemType === 'alert') {
        await alertService.markAsRead(itemId);
      } else {
        await notificationService.markAsRead(itemId);
      }
      // Atualizar a lista de itens
      await loadItems();
    } catch (error) {
      console.error('Erro ao marcar item como lido:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Marcar todos os alertas como lidos
      await alertService.markAllAsRead(userId);
      
      // Marcar todas as notificações como lidas
      await notificationService.markAllAsRead(userId);
      
      // Atualizar a lista de itens
      await loadItems();
    } catch (error) {
      console.error('Erro ao marcar todos os itens como lidos:', error);
    }
  };

  const resolveItem = async (itemId: string, itemType: 'alert' | 'notification') => {
    try {
      if (itemType === 'alert') {
        await alertService.resolveAlert(itemId);
      }
      // Notificações não precisam ser resolvidas, apenas marcadas como lidas
      // Atualizar a lista de itens
      await loadItems();
    } catch (error) {
      console.error('Erro ao resolver item:', error);
    }
  };

  const removeItem = async (itemId: string, itemType: 'alert' | 'notification') => {
    try {
      if (itemType === 'alert') {
        await alertService.removeAlert(itemId);
      } else {
        await notificationService.removeNotification(itemId);
      }
      // Atualizar a lista de itens
      await loadItems();
    } catch (error) {
      console.error('Erro ao remover item:', error);
    }
  };

  const getAlertStyle = (type: NotificationItem['type']) => {
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
      case 'success':
        return { backgroundColor: '#D1FAE5', borderColor: '#10B981' };
      case 'info':
      default:
        return { backgroundColor: '#DBEAFE', borderColor: '#3B82F6' };
    }
  };

  const getSeverityIcon = (severity: Alert['severity'] | undefined) => {
    if (!severity) return 'ℹ️'; // Para notificações
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

  const getItemTypeLabel = (itemType: 'alert' | 'notification') => {
    return itemType === 'alert' ? 'Alerta' : 'Notificação';
  };

  if (loading) {
    return React.createElement('div', { style: { padding: '16px' } },
      React.createElement('p', null, 'Carregando alertas e notificações...')
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
      items.length > 0 && React.createElement(Button, { 
        variant: "secondary", 
        size: "sm", 
        onClick: markAllAsRead 
      }, 'Marcar todos como lidos')
    ),
    items.length === 0 ? 
      React.createElement('div', { 
        style: { 
          padding: '32px', 
          textAlign: 'center',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          backgroundColor: '#f9fafb'
        }
      },
        React.createElement('p', { style: { fontSize: '16px', color: '#666' } }, 'Nenhum alerta ou notificação no momento')
      ) :
      React.createElement('div', null,
        items.map((item: NotificationItem) => 
          React.createElement('div', { 
            key: item.id, 
            style: {
              marginBottom: '12px',
              padding: '16px',
              borderRadius: '8px',
              borderWidth: '1px',
              borderStyle: 'solid',
              ...getAlertStyle(item.type),
              ...(item.read ? {} : { borderLeft: '4px solid #3B82F6' })
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
              React.createElement('div', { style: { display: 'flex', alignItems: 'center' } },
                React.createElement('h3', { style: { fontSize: '18px', fontWeight: 'bold', marginRight: '8px' } }, item.title),
                React.createElement('span', { 
                  style: { 
                    fontSize: '12px', 
                    backgroundColor: '#E5E7EB', 
                    padding: '2px 6px', 
                    borderRadius: '4px' 
                  } 
                }, getItemTypeLabel(item.itemType))
              ),
              React.createElement('span', { style: { fontSize: '16px' } }, getSeverityIcon(item.severity))
            ),
            React.createElement('p', { style: { fontSize: '14px', marginBottom: '12px' } }, item.message),
            React.createElement('div', { 
              style: { 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }
            },
              React.createElement('span', { style: { fontSize: '12px', color: '#666' } },
                new Date(item.timestamp).toLocaleString('pt-BR')
              ),
              React.createElement('div', { style: { display: 'flex' } },
                !item.read && React.createElement('button', { 
                  style: { 
                    marginLeft: '12px',
                    fontSize: '12px',
                    color: '#3B82F6',
                    fontWeight: 'bold',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  },
                  onClick: () => markAsRead(item.id, item.itemType)
                }, 'Marcar como lido'),
                item.itemType === 'alert' && item.type !== 'info' && React.createElement('button', { 
                  style: { 
                    marginLeft: '12px',
                    fontSize: '12px',
                    color: '#3B82F6',
                    fontWeight: 'bold',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  },
                  onClick: () => resolveItem(item.id, item.itemType)
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
                  onClick: () => removeItem(item.id, item.itemType)
                }, 'Remover')
              )
            )
          )
        )
      )
  );
};

export default AlertsManagementComponent;