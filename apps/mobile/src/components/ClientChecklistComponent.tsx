import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

// Definir interfaces locais para evitar problemas de importação
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

interface ClientChecklistComponentProps {
  order: Order;
  onChecklistComplete: (checklistData: any) => void;
  onChecklistCancel: () => void;
}

const ClientChecklistComponent: React.FC<ClientChecklistComponentProps> = (props: ClientChecklistComponentProps) => {
  const { order, onChecklistComplete, onChecklistCancel } = props;
  
  // Estado para controlar os itens selecionados
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [signature, setSignature] = useState<string>('');

  // Inicializa os itens do checklist com base nos itens do pedido
  const initializeChecklistItems = (): Record<string, boolean> => {
    const items: Record<string, boolean> = {};
    order.items.forEach((item: OrderItem) => {
      items[item.id] = false;
    });
    return items;
  };

  // Atualiza o estado quando um item é marcado/desmarcado
  const handleItemToggle = (itemId: string) => {
    setCheckedItems((prev: Record<string, boolean>) => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Verifica se todos os itens foram marcados
  const isChecklistComplete = (): boolean => {
    return Object.values(checkedItems).every((checked) => checked as boolean);
  };

  // Manipula o envio do checklist
  const handleSubmit = () => {
    const checklistData = {
      orderId: order.id,
      checkedItems,
      signature,
      timestamp: new Date().toISOString(),
    };
    onChecklistComplete(checklistData);
  };

  // Inicializa os itens do checklist
  useEffect(() => {
    setCheckedItems(initializeChecklistItems());
  }, [order]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Checklist de Conformidade</Text>
        <View style={styles.divider} />
        
        <Text style={styles.orderInfo}>
          Pedido #{order.id} - {order.clientName}
        </Text>
        
        <Text style={styles.sectionTitle}>Verifique os itens entregues:</Text>
        
        {order.items.map((item: OrderItem) => (
          <View key={item.id} style={styles.checklistItem}>
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => handleItemToggle(item.id)}
            >
              <View style={[styles.checkbox, checkedItems[item.id] && styles.checked]}>
                {checkedItems[item.id] && <View style={styles.checkedInner} />}
              </View>
              <Text style={styles.checkboxLabel}>{`${item.productName} (x${item.quantity})`}</Text>
            </TouchableOpacity>
          </View>
        ))}
        
        <View style={styles.signatureSection}>
          <Text style={styles.sectionTitle}>Assinatura Digital:</Text>
          {/* Aqui seria integrado o componente de captura de assinatura */}
          <TouchableOpacity 
            style={styles.signaturePlaceholder}
            onPress={() => console.log('Abrir captura de assinatura')}
          >
            <Text style={styles.signatureText}>
              {signature ? 'Assinatura capturada' : 'Toque para assinar'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onChecklistCancel}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.confirmButton, !isChecklistComplete() && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={!isChecklistComplete()}
          >
            <Text style={styles.confirmButtonText}>Confirmar Entrega</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  orderInfo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  checklistItem: {
    marginBottom: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checked: {
    borderColor: '#4caf50',
    backgroundColor: '#4caf50',
  },
  checkedInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  checkboxLabel: {
    fontSize: 16,
    flex: 1,
  },
  signatureSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  signaturePlaceholder: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  signatureText: {
    color: '#666',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelButton: {
    borderColor: '#ff6b6b',
    borderWidth: 1,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ff6b6b',
    fontWeight: '600',
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#4caf50',
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
});

export default ClientChecklistComponent;