import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Card } from '@gasrapido/ui';

interface OrderParams {
  orderId: string;
  clientName: string;
  deliveryAddress: string;
  gasType: string;
  quantity: number;
  totalPrice: number;
}

interface OrderConfirmationScreenProps {
  route: {
    params: OrderParams;
  };
}

const OrderConfirmationScreen: React.FC<OrderConfirmationScreenProps> = ({ route }) => {
  const { orderId, clientName, deliveryAddress, gasType, quantity, totalPrice } = route.params;

  const handlePayment = () => {
    // Implementar lógica de pagamento
    console.log('Processando pagamento...');
  };

  const handleTrackOrder = () => {
    // Implementar navegação para rastreamento
    console.log('Rastreando pedido...');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pedido Confirmado!</Text>
      
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Resumo do Pedido</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Número do Pedido:</Text>
          <Text style={styles.value}>{orderId}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Cliente:</Text>
          <Text style={styles.value}>{clientName}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Endereço de Entrega:</Text>
          <Text style={styles.value}>{deliveryAddress}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Produto:</Text>
          <Text style={styles.value}>{gasType} ({quantity} unidade{quantity > 1 ? 's' : ''})</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Valor Total:</Text>
          <Text style={styles.totalValue}>€{totalPrice.toFixed(2)}</Text>
        </View>
      </Card>
      
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Opções de Pagamento</Text>
        <Text style={styles.paymentInfo}>Escolha como deseja pagar pelo seu pedido</Text>
        
        <Button 
          variant="primary" 
          size="lg" 
          onPress={handlePayment}
          style={styles.paymentButton}
        >
          Pagar com MB Way
        </Button>
        
        <Button 
          variant="outline" 
          size="lg" 
          onPress={handlePayment}
          style={styles.paymentButton}
        >
          Pagar com Cartão de Crédito
        </Button>
        
        <Button 
          variant="outline" 
          size="lg" 
          onPress={handlePayment}
          style={styles.paymentButton}
        >
          Pagar em Dinheiro
        </Button>
      </Card>
      
      <Button 
        variant="secondary" 
        size="lg" 
        onPress={handleTrackOrder}
        style={styles.trackButton}
      >
        Acompanhar Pedido
      </Button>
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
    color: '#28a745',
  },
  card: {
    marginBottom: 16,
    padding: 16,
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
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  paymentInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  paymentButton: {
    marginBottom: 12,
  },
  trackButton: {
    marginTop: 16,
  },
});

export default OrderConfirmationScreen;