// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { matchingService, Order, MatchResult, RoutingResult } from '@gasrapido/shared/services/matchingService';

interface MatchingManagementComponentProps {
  userId: string;
  onOrderMatched?: (matchResult: MatchResult) => void;
  onRouteGenerated?: (routingResult: RoutingResult) => void;
}

export const MatchingManagementComponent: React.FC<MatchingManagementComponentProps> = ({
  userId,
  onOrderMatched,
  onRouteGenerated
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [matchingOrders, setMatchingOrders] = useState<Record<string, boolean>>({});
  const [routingOrders, setRoutingOrders] = useState<Record<string, boolean>>({});

  // Carregar pedidos pendentes ao montar o componente
  useEffect(() => {
    loadPendingOrders();
  }, []);

  const loadPendingOrders = async () => {
    setLoading(true);
    try {
      // Em uma implementação real, isso chamaria um serviço para obter pedidos pendentes
      // Para este exemplo, vamos simular com dados fictícios
      
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Dados fictícios de pedidos pendentes
      const mockOrders: Order[] = [
        {
          id: 'order-1',
          clientId: 'client-1',
          pickupLocation: { lat: -8.839, lng: 13.289 },
          deliveryLocation: { lat: -8.835, lng: 13.290 },
          status: 'pending',
          priority: 'medium',
          createdAt: new Date().toISOString()
        },
        {
          id: 'order-2',
          clientId: 'client-2',
          pickupLocation: { lat: -8.840, lng: 13.288 },
          deliveryLocation: { lat: -8.836, lng: 13.291 },
          status: 'pending',
          priority: 'high',
          createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hora atrás
        }
      ];
      
      setOrders(mockOrders);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os pedidos pendentes');
    } finally {
      setLoading(false);
    }
  };

  const handleMatchOrder = async (orderId: string) => {
    try {
      // Marcar como em processamento
      setMatchingOrders(prev => ({ ...prev, [orderId]: true }));
      
      // Realizar matching do pedido
      const matchResult = await matchingService.matchOrder(orderId);
      
      if (matchResult) {
        // Atualizar status do pedido (em uma implementação real, isso seria feito no backend)
        const updatedOrders = orders.map(order => 
          order.id === orderId 
            ? { ...order, status: 'matched' } 
            : order
        );
        setOrders(updatedOrders);
        
        // Notificar sobre o matching
        onOrderMatched?.(matchResult);
        
        Alert.alert(
          'Sucesso', 
          `Pedido ${orderId} matched com sucesso!\nConfiança: ${(matchResult.confidence * 100).toFixed(1)}%`
        );
      } else {
        Alert.alert('Erro', 'Não foi possível realizar o matching do pedido');
      }
    } catch (error) {
      console.error('Erro ao realizar matching:', error);
      Alert.alert('Erro', 'Falha ao realizar matching do pedido');
    } finally {
      // Remover marcação de processamento
      setMatchingOrders(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const handleGenerateRoute = async (orderId: string) => {
    try {
      // Marcar como em processamento
      setRoutingOrders(prev => ({ ...prev, [orderId]: true }));
      
      // Gerar rota para o pedido
      const routingResult = await matchingService.generateRoute(orderId);
      
      if (routingResult) {
        // Notificar sobre a rota gerada
        onRouteGenerated?.(routingResult);
        
        Alert.alert(
          'Sucesso', 
          `Rota gerada para pedido ${orderId}!\nDistância: ${(routingResult.totalDistance / 1000).toFixed(2)} km\nDuração estimada: ${routingResult.estimatedDuration.toFixed(0)} minutos`
        );
      } else {
        Alert.alert('Erro', 'Não foi possível gerar a rota para o pedido');
      }
    } catch (error) {
      console.error('Erro ao gerar rota:', error);
      Alert.alert('Erro', 'Falha ao gerar rota para o pedido');
    } finally {
      // Remover marcação de processamento
      setRoutingOrders(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return '#FFA500';
      case 'matched': return '#1E90FF';
      case 'assigned': return '#9370DB';
      case 'in_progress': return '#FF8C00';
      case 'delivered': return '#32CD32';
      case 'cancelled': return '#FF0000';
      default: return '#808080';
    }
  };

  const getPriorityColor = (priority: Order['priority']) => {
    switch (priority) {
      case 'low': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'high': return '#F44336';
      case 'urgent': return '#D32F2F';
      default: return '#9E9E9E';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestão de Matching e Roteamento</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={loadPendingOrders}
          disabled={loading}
        >
          <Text style={styles.refreshButtonText}>Atualizar</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Carregando pedidos...</Text>
        </View>
      ) : (
        <ScrollView style={styles.ordersList}>
          {orders.map(order => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Pedido #{order.id.slice(-4)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                  <Text style={styles.statusText}>
                    {order.status === 'pending' && 'Pendente'}
                    {order.status === 'matched' && 'Matched'}
                    {order.status === 'assigned' && 'Atribuído'}
                    {order.status === 'in_progress' && 'Em Progresso'}
                    {order.status === 'delivered' && 'Entregue'}
                    {order.status === 'cancelled' && 'Cancelado'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.orderDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Prioridade:</Text>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(order.priority) }]}>
                    <Text style={styles.priorityText}>
                      {order.priority === 'low' && 'Baixa'}
                      {order.priority === 'medium' && 'Média'}
                      {order.priority === 'high' && 'Alta'}
                      {order.priority === 'urgent' && 'Urgente'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Criado em:</Text>
                  <Text style={styles.detailValue}>{formatTime(order.createdAt)}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Localização de coleta:</Text>
                  <Text style={styles.detailValue}>
                    {order.pickupLocation.lat.toFixed(4)}, {order.pickupLocation.lng.toFixed(4)}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Localização de entrega:</Text>
                  <Text style={styles.detailValue}>
                    {order.deliveryLocation.lat.toFixed(4)}, {order.deliveryLocation.lng.toFixed(4)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.orderActions}>
                {order.status === 'pending' && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.matchButton]}
                    onPress={() => handleMatchOrder(order.id)}
                    disabled={matchingOrders[order.id]}
                  >
                    {matchingOrders[order.id] ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.actionButtonText}>Realizar Matching</Text>
                    )}
                  </TouchableOpacity>
                )}
                
                {order.status === 'matched' && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.routeButton]}
                    onPress={() => handleGenerateRoute(order.id)}
                    disabled={routingOrders[order.id]}
                  >
                    {routingOrders[order.id] ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.actionButtonText}>Gerar Rota</Text>
                    )}
                  </TouchableOpacity>
                )}
                
                {(order.status === 'assigned' || order.status === 'in_progress') && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.viewRouteButton]}
                    onPress={() => handleGenerateRoute(order.id)}
                  >
                    <Text style={styles.actionButtonText}>Ver Rota</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
          
          {orders.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Nenhum pedido pendente encontrado</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: '600'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666'
  },
  ordersList: {
    flex: 1
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  orderDetails: {
    marginBottom: 16
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600'
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    textAlign: 'right',
    flex: 1,
    marginLeft: 8
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  orderActions: {
    flexDirection: 'row',
    gap: 8
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  matchButton: {
    backgroundColor: '#007AFF'
  },
  routeButton: {
    backgroundColor: '#34C759'
  },
  viewRouteButton: {
    backgroundColor: '#AF52DE'
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999'
  }
});