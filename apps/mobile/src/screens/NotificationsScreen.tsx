import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { alertService, notificationService } from '@gasrapido/shared';
import { Card, Button } from '@gasrapido/ui';
import { Colors, Spacing, Typography } from '../constants';

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

// Definir interface para alertas
interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'scarcity' | 'sla' | 'pricing' | 'info' | 'warning' | 'error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  resourceId?: string;
  read: boolean;
  createdAt: string;
  triggeredAt?: string;
  resolvedAt?: string;
  metadata?: Record<string, any>;
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

interface NotificationsScreenProps {
  userId: string;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ userId }) => {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
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
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando notificações e alertas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notificações e Alertas</Text>
        {items.length > 0 && (
          <Button 
            variant="secondary" 
            size="sm" 
            onPress={markAllAsRead}
            style={styles.markAllButton}
          >
            Marcar todos como lidos
          </Button>
        )}
      </View>
      
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off" size={48} color={Colors.gray} />
          <Text style={styles.emptyText}>Nenhum alerta ou notificação no momento</Text>
          <Text style={styles.emptySubtext}>Você será notificado quando houver novidades</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {items.map((item: NotificationItem) => (
            <Card key={item.id} style={[styles.itemCard, getAlertStyle(item.type), !item.read && styles.unreadItem]}>
              <View style={styles.itemHeader}>
                <View style={styles.itemHeaderLeft}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <View style={styles.itemMeta}>
                    <Text style={styles.itemType}>{getItemTypeLabel(item.itemType)}</Text>
                    <Text style={styles.itemTime}>
                      {new Date(item.timestamp).toLocaleString('pt-BR')}
                    </Text>
                  </View>
                </View>
                <Text style={styles.severityIcon}>{getSeverityIcon(item.severity)}</Text>
              </View>
              
              <Text style={styles.itemMessage}>{item.message}</Text>
              
              <View style={styles.itemActions}>
                {!item.read && (
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => markAsRead(item.id, item.itemType)}
                  >
                    <Text style={styles.actionText}>Marcar como lido</Text>
                  </TouchableOpacity>
                )}
                
                {item.itemType === 'alert' && item.type !== 'info' && (
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => resolveItem(item.id, item.itemType)}
                  >
                    <Text style={styles.actionText}>Resolver</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => removeItem(item.id, item.itemType)}
                >
                  <Text style={styles.actionText}>Remover</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
  },
  markAllButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: Typography.sizes.md,
    color: Colors.gray,
    marginTop: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.medium,
    color: Colors.gray,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: Typography.sizes.sm,
    color: Colors.lightGray,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  itemCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
  },
  unreadItem: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  itemHeaderLeft: {
    flex: 1,
  },
  itemTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemType: {
    fontSize: Typography.sizes.xs,
    backgroundColor: Colors.lightGray,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: Spacing.xs,
  },
  itemTime: {
    fontSize: Typography.sizes.xs,
    color: Colors.gray,
  },
  severityIcon: {
    fontSize: Typography.sizes.lg,
  },
  itemMessage: {
    fontSize: Typography.sizes.sm,
    color: Colors.darkGray,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginLeft: Spacing.md,
  },
  actionText: {
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
    fontWeight: Typography.weights.medium,
  },
});

export default NotificationsScreen;