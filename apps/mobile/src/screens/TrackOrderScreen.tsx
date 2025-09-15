import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Card } from '@gasrapido/ui';

interface OrderStatus {
  id: string;
  status: 'pending' | 'confirmed' | 'dispatched' | 'in_transit' | 'delivered' | 'completed';
  timestamp: string;
  description: string;
}

interface TrackOrderScreenProps {
  route: {
    params: {
      orderId: string;
    };
  };
}

const TrackOrderScreen: React.FC<TrackOrderScreenProps> = (props: TrackOrderScreenProps) => {
  const { orderId } = props.route.params;
  const [orderStatus, setOrderStatus] = useState<OrderStatus[]>([]);
  const [currentStatus, setCurrentStatus] = useState<string>('pending');

  useEffect(() => {
    // Simular carregamento do status do pedido
    loadOrderStatus();
  }, [orderId]);

  const loadOrderStatus = () => {
    // Em uma implementação real, isso viria de uma API
    const mockStatus: OrderStatus[] = [
      {
        id: '1',
        status: 'pending',
        timestamp: '2023-05-01 10:00:00',
        description: 'Pedido recebido e aguardando confirmação do fornecedor'
      },
      {
        id: '2',
        status: 'confirmed',
        timestamp: '2023-05-01 10:15:00',
        description: 'Pedido confirmado pelo fornecedor'
      },
      {
        id: '3',
        status: 'dispatched',
        timestamp: '2023-05-01 10:30:00',
        description: 'Pedido despachado para entrega'
      },
      {
        id: '4',
        status: 'in_transit',
        timestamp: '2023-05-01 10:45:00',
        description: 'Entregador a caminho do seu endereço'
      }
    ];
    
    setOrderStatus(mockStatus);
    setCurrentStatus('in_transit');
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Aguardando Confirmação';
      case 'confirmed': return 'Confirmado';
      case 'dispatched': return 'Despachado';
      case 'in_transit': return 'Em Trânsito';
      case 'delivered': return 'Entregue';
      case 'completed': return 'Concluído';
      default: return 'Desconhecido';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'confirmed': return '#17a2b8';
      case 'dispatched': return '#6f42c1';
      case 'in_transit': return '#007bff';
      case 'delivered': return '#28a745';
      case 'completed': return '#20c997';
      default: return '#6c757d';
    }
  };

  const isStatusActive = (status: string) => {
    const statusOrder = ['pending', 'confirmed', 'dispatched', 'in_transit', 'delivered', 'completed'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const statusIndex = statusOrder.indexOf(status);
    return statusIndex <= currentIndex;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acompanhar Pedido</Text>
      <Text style={styles.orderId}>Pedido #{orderId}</Text>
      
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Status Atual</Text>
        <View style={styles.currentStatusContainer}>
          <Text style={[styles.currentStatusText, { color: getStatusColor(currentStatus) }]}>
            {getStatusText(currentStatus)}
          </Text>
        </View>
      </Card>
      
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Histórico do Pedido</Text>
        {orderStatus.map((statusItem: OrderStatus) => (
          <View 
            key={statusItem.id} 
            style={[
              styles.statusItem, 
              isStatusActive(statusItem.status) && styles.activeStatusItem
            ]}
          >
            <View style={styles.statusIndicatorContainer}>
              <View 
                style={[
                  styles.statusIndicator, 
                  { backgroundColor: getStatusColor(statusItem.status) },
                  isStatusActive(statusItem.status) && styles.activeStatusIndicator
                ]} 
              />
              {statusItem.id !== String(orderStatus.length) && (
                <View 
                  style={[
                    styles.statusLine,
                    isStatusActive(statusItem.status) && styles.activeStatusLine
                  ]} 
                />
              )}
            </View>
            <View style={styles.statusContent}>
              <Text style={styles.statusTitle}>{getStatusText(statusItem.status)}</Text>
              <Text style={styles.statusTime}>{statusItem.timestamp}</Text>
              <Text style={styles.statusDescription}>{statusItem.description}</Text>
            </View>
          </View>
        ))}
      </Card>
      
      {currentStatus === 'in_transit' && (
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Detalhes do Entregador</Text>
          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryLabel}>Nome:</Text>
            <Text style={styles.deliveryValue}>João Silva</Text>
          </View>
          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryLabel}>Telefone:</Text>
            <Text style={styles.deliveryValue}>+351 912 345 678</Text>
          </View>
          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryLabel}>Veículo:</Text>
            <Text style={styles.deliveryValue}>Van VW T5 - AA-12-34</Text>
          </View>
          <Button 
            variant="primary" 
            size="lg" 
            style={styles.contactButton}
          >
            Contactar Entregador
          </Button>
        </Card>
      )}
    </View>
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
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  orderId: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  card: {
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#444',
  },
  currentStatusContainer: {
    alignItems: 'center',
    padding: 20,
  },
  currentStatusText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  activeStatusItem: {
    opacity: 1,
  },
  statusIndicatorContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ccc',
  },
  activeStatusIndicator: {
    borderWidth: 3,
    borderColor: '#fff',
  },
  statusLine: {
    width: 2,
    height: 40,
    backgroundColor: '#ccc',
    marginTop: 4,
  },
  activeStatusLine: {
    backgroundColor: '#007bff',
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusDescription: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  deliveryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  deliveryLabel: {
    fontSize: 16,
    color: '#666',
  },
  deliveryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  contactButton: {
    marginTop: 16,
  },
});

export default TrackOrderScreen;