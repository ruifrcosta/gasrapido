import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Button, Card } from '@gasrapido/ui';

// Definir interfaces locais já que não podemos importar do shared
interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
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

interface SupplierDashboardScreenProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
  };
}

const SupplierDashboardScreen: React.FC<SupplierDashboardScreenProps> = (props: SupplierDashboardScreenProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      // Em uma implementação real, isso carregaria os pedidos do fornecedor
      const mockOrders: Order[] = [
        {
          id: 'order-001',
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
          status: 'pending',
          totalPrice: 15.99,
          createdAt: '2023-05-01T10:00:00Z',
          updatedAt: '2023-05-01T10:00:00Z'
        },
        {
          id: 'order-002',
          clientId: 'client-456',
          clientName: 'Maria Santos',
          clientPhone: '+351 987 654 321',
          deliveryAddress: 'Avenida Central, 456, Porto',
          deliveryInstructions: 'Apartamento 3B',
          items: [
            {
              id: 'item-2',
              productId: 'gas-002',
              productName: 'Botijão de Butano 13kg',
              quantity: 2,
              price: 18.50
            }
          ],
          status: 'confirmed',
          totalPrice: 37.00,
          createdAt: '2023-05-01T09:30:00Z',
          updatedAt: '2023-05-01T09:45:00Z'
        }
      ];
      
      setOrders(mockOrders);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
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

  const handleOrderPress = (order: Order) => {
    props.navigation.navigate('OrderDetail', { orderId: order.id });
  };

  const handleRefresh = () => {
    setLoading(true);
    loadOrders();
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <Card style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Pedido #{item.id.slice(-6)}</Text>
        <Text style={[styles.orderStatus, { color: getStatusColor(item.status) }]}>
          {getStatusText(item.status)}
        </Text>
      </View>
      
      <View style={styles.orderDetails}>
        <Text style={styles.clientName}>{item.clientName}</Text>
        <Text style={styles.deliveryAddress}>{item.deliveryAddress}</Text>
        
        <View style={styles.itemsContainer}>
          {item.items.map((orderItem: OrderItem) => (
            <Text key={orderItem.id} style={styles.itemText}>
              {orderItem.quantity}x {orderItem.productName}
            </Text>
          ))}
        </View>
        
        <View style={styles.orderFooter}>
          <Text style={styles.totalPrice}>€{item.totalPrice.toFixed(2)}</Text>
          <Text style={styles.orderDate}>
            {new Date(item.createdAt).toLocaleDateString('pt-PT')}
          </Text>
        </View>
      </View>
      
      <Button 
        variant="outline" 
        size="sm" 
        onPress={() => handleOrderPress(item)}
        style={styles.viewButton}
      >
        Ver Detalhes
      </Button>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard de Fornecedor</Text>
      
      <Card style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Pedidos Hoje</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>8</Text>
          <Text style={styles.statLabel}>Pendentes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>€1,240</Text>
          <Text style={styles.statLabel}>Faturação</Text>
        </View>
      </Card>
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Pedidos Recentes</Text>
        <Button 
          variant="outline" 
          size="sm" 
          onPress={handleRefresh}
          disabled={loading}
        >
          Atualizar
        </Button>
      </View>
      
      {loading ? (
        <Text style={styles.loadingText}>Carregando pedidos...</Text>
      ) : orders.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum pedido encontrado</Text>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item: Order) => item.id}
          style={styles.ordersList}
          refreshing={loading}
          onRefresh={handleRefresh}
        />
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
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
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
  ordersList: {
    flex: 1,
  },
  orderCard: {
    marginBottom: 16,
    padding: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  orderDetails: {
    marginBottom: 16,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 4,
  },
  deliveryAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  itemsContainer: {
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
    color: '#555',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
  orderDate: {
    fontSize: 14,
    color: '#888',
  },
  viewButton: {
    alignSelf: 'flex-start',
  },
});

export default SupplierDashboardScreen;