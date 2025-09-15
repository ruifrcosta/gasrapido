import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Card } from '@gasrapido/ui';

// Definir interfaces locais
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  userId?: string;
  orderId?: string;
}

interface NotificationsComponentProps {
  userId: string;
  onNotificationPress?: (notification: Notification) => void;
  onMarkAsRead?: (notificationId: string) => void;
}

const NotificationsComponent: React.FC<NotificationsComponentProps> = (props: NotificationsComponentProps) => {
  const { userId, onNotificationPress, onMarkAsRead } = props;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadNotifications();
  }, [userId]);

  const loadNotifications = async () => {
    try {
      // Em uma implementação real, isso carregaria as notificações do serviço
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'Pedido Confirmado',
          message: 'Seu pedido #12345 foi confirmado pelo fornecedor.',
          type: 'success',
          timestamp: '2023-05-01T10:15:00Z',
          read: false,
          orderId: 'order-12345'
        },
        {
          id: '2',
          title: 'Entregador a Caminho',
          message: 'Seu entregador está a caminho com o seu pedido.',
          type: 'info',
          timestamp: '2023-05-01T10:45:00Z',
          read: false,
          orderId: 'order-12345'
        },
        {
          id: '3',
          title: 'Novo Pedido',
          message: 'Você tem um novo pedido para processar.',
          type: 'info',
          timestamp: '2023-05-01T09:30:00Z',
          read: true,
          userId: 'supplier-123'
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '✓';
      case 'warning': return '⚠';
      case 'error': return '✗';
      case 'info': 
      default: return 'ℹ';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '#28a745';
      case 'warning': return '#ffc107';
      case 'error': return '#dc3545';
      case 'info': 
      default: return '#17a2b8';
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    if (onNotificationPress) {
      onNotificationPress(notification);
    }
    
    // Marcar como lida ao clicar
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
      // Atualizar localmente também
      setNotifications((prev: Notification[]) => 
        prev.map((n: Notification) => 
          n.id === notification.id ? { ...n, read: true } : n
        )
      );
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-PT');
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      style={[styles.notificationItem, !item.read && styles.unreadNotification]}
      onPress={() => handleNotificationPress(item)}
    >
      <Card style={styles.notificationCard}>
        <View style={styles.notificationHeader}>
          <Text style={[styles.notificationIcon, { color: getNotificationColor(item.type) }]}>
            {getNotificationIcon(item.type)}
          </Text>
          <View style={styles.notificationTitleContainer}>
            <Text style={[styles.notificationTitle, !item.read && styles.unreadTitle]}>
              {item.title}
            </Text>
            <Text style={styles.notificationTime}>
              {formatTimestamp(item.timestamp)}
            </Text>
          </View>
        </View>
        <Text style={[styles.notificationMessage, !item.read && styles.unreadMessage]}>
          {item.message}
        </Text>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando notificações...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notificações</Text>
      {notifications.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma notificação</Text>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item: Notification) => item.id}
          style={styles.notificationsList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 30,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 30,
  },
  notificationsList: {
    flex: 1,
  },
  notificationItem: {
    marginBottom: 12,
  },
  unreadNotification: {
    opacity: 1,
  },
  notificationCard: {
    padding: 16,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationIcon: {
    fontSize: 20,
    marginRight: 12,
    fontWeight: 'bold',
  },
  notificationTitleContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  unreadTitle: {
    color: '#333',
    fontWeight: 'bold',
  },
  notificationTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  unreadMessage: {
    color: '#444',
  },
});

export default NotificationsComponent;