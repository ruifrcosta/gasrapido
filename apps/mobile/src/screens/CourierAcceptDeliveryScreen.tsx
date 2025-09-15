import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Card } from '@gasrapido/ui';

// Definir interfaces locais
interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface DeliveryOrder {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  deliveryAddress: string;
  deliveryInstructions: string;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'dispatched' | 'in_transit' | 'delivered' | 'completed' | 'cancelled';
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

interface CourierAcceptDeliveryScreenProps {
  route: {
    params: {
      orderId: string;
    };
  };
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
}

const CourierAcceptDeliveryScreen: React.FC<CourierAcceptDeliveryScreenProps> = (props: CourierAcceptDeliveryScreenProps) => {
  const { orderId } = props.route.params;
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      // Em uma implementação real, isso carregaria os detalhes do pedido
      const mockOrder: DeliveryOrder = {
        id: orderId,
        clientId: 'client-123',
        clientName: 'João Silva',
        clientPhone: '+351 912 345 678',
        deliveryAddress: 'Rua das Flores, 123, Lisboa',
        deliveryInstructions: 'Portão verde',
        items: [
          {
            id: 'item-1',
            productId: 'gas-001',
            productName: 'Botijão de Propano 11kg',
            quantity: 1,
            price: 15.99
          }
        ],
        status: 'dispatched',
        totalPrice: 15.99,
        createdAt: '2023-05-01T10:00:00Z',
        updatedAt: '2023-05-01T10:30:00Z'
      };
      
      setOrder(mockOrder);
    } catch (error) {
      console.error('Erro ao carregar detalhes do pedido:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'confirmed': return 'Confirmado';
      case 'dispatched': return 'Despachado';
      case 'in_transit': return 'Em Trânsito';
      case 'delivered': return 'Entregue';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
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
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const handleAcceptDelivery = () => {
    // Em uma implementação real, isso atualizaria o status do pedido
    props.navigation.navigate('CourierDeliveryInProgress', { orderId: order?.id });
  };

  const handleRejectDelivery = () => {
    // Em uma implementação real, isso rejeitaria a entrega
    props.navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando detalhes da entrega...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Entrega não encontrada</Text>
        <Button variant="outline" onPress={props.navigation.goBack}>
          Voltar
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Entrega</Text>
      
      <Card style={styles.card}>
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
            {getStatusText(order.status)}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações do Cliente</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Nome:</Text>
            <Text style={styles.value}>{order.clientName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Telefone:</Text>
            <Text style={styles.value}>{order.clientPhone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Endereço:</Text>
            <Text style={styles.value}>{order.deliveryAddress}</Text>
          </View>
          {order.deliveryInstructions ? (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Instruções:</Text>
              <Text style={styles.value}>{order.deliveryInstructions}</Text>
            </View>
          ) : null}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Itens para Entrega</Text>
          {order.items.map((item: OrderItem) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.productName}</Text>
              <Text style={styles.itemQuantity}>{item.quantity}x</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>€{order.totalPrice.toFixed(2)}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Adicionais</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>ID do Pedido:</Text>
            <Text style={styles.value}>#{order.id.slice(-6)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Data de Criação:</Text>
            <Text style={styles.value}>
              {new Date(order.createdAt).toLocaleString('pt-PT')}
            </Text>
          </View>
        </View>
      </Card>
      
      <View style={styles.actionsContainer}>
        <Button 
          variant="primary" 
          size="lg" 
          onPress={handleAcceptDelivery}
          style={styles.actionButton}
        >
          Aceitar Entrega
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          onPress={handleRejectDelivery}
          style={styles.actionButton}
        >
          Rejeitar
        </Button>
      </View>
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
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 30,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#dc3545',
    marginTop: 30,
  },
  card: {
    marginBottom: 16,
    padding: 16,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#444',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
  },
  itemName: {
    fontSize: 16,
    color: '#444',
    flex: 2,
  },
  itemQuantity: {
    fontSize: 16,
    color: '#666',
    flex: 1,
    textAlign: 'center',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default CourierAcceptDeliveryScreen;