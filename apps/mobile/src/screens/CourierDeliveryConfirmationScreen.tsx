import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
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

interface CourierDeliveryConfirmationScreenProps {
  route: {
    params: {
      orderId: string;
    };
  };
  navigation: {
    navigate: (screen: string, params?: any) => void;
    reset: (options: any) => void;
  };
}

const CourierDeliveryConfirmationScreen: React.FC<CourierDeliveryConfirmationScreenProps> = (props: CourierDeliveryConfirmationScreenProps) => {
  const { orderId } = props.route.params;
  const [signature, setSignature] = useState<string>('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');

  const handleAddSignature = () => {
    // Em uma implementação real, isso abriria um componente de assinatura
    Alert.alert('Assinatura', 'Aqui seria adicionada a assinatura do cliente');
  };

  const handleAddPhoto = () => {
    // Em uma implementação real, isso abriria a câmera ou galeria
    Alert.alert('Foto', 'Aqui seria adicionada uma foto da entrega');
  };

  const handleConfirmDelivery = () => {
    // Em uma implementação real, isso enviaria os dados de confirmação
    Alert.alert(
      'Confirmação',
      'Tem certeza que deseja confirmar a entrega?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: () => {
            // Em uma implementação real, isso atualizaria o status do pedido
            Alert.alert(
              'Sucesso', 
              'Entrega confirmada com sucesso!',
              [
                { 
                  text: 'OK', 
                  onPress: () => {
                    // Navegar de volta ao dashboard
                    props.navigation.reset({
                      index: 0,
                      routes: [{ name: 'CourierDashboard' }],
                    });
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  const handleReportIssue = () => {
    // Em uma implementação real, isso permitiria reportar um problema
    Alert.alert('Reportar Problema', 'Aqui seria reportado um problema com a entrega');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirmar Entrega</Text>
      <Text style={styles.orderId}>Pedido #{orderId.slice(-6)}</Text>
      
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Checklist de Entrega</Text>
        
        <View style={styles.checklistItem}>
          <Text style={styles.checklistText}>✓ Itens entregues corretamente</Text>
        </View>
        
        <View style={styles.checklistItem}>
          <Text style={styles.checklistText}>✓ Cliente presente no local</Text>
        </View>
        
        <View style={styles.checklistItem}>
          <Text style={styles.checklistText}>✓ Documento de identificação verificado</Text>
        </View>
      </Card>
      
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Assinatura do Cliente</Text>
        <View style={styles.signatureContainer}>
          {signature ? (
            <Text style={styles.signatureText}>Assinatura adicionada</Text>
          ) : (
            <Text style={styles.signaturePlaceholder}>Nenhuma assinatura adicionada</Text>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onPress={handleAddSignature}
            style={styles.signatureButton}
          >
            {signature ? 'Editar Assinatura' : 'Adicionar Assinatura'}
          </Button>
        </View>
      </Card>
      
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Fotos da Entrega</Text>
        <View style={styles.photosContainer}>
          {photos.length > 0 ? (
            <Text style={styles.photosText}>{photos.length} foto(s) adicionada(s)</Text>
          ) : (
            <Text style={styles.photosPlaceholder}>Nenhuma foto adicionada</Text>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onPress={handleAddPhoto}
            style={styles.photoButton}
          >
            Adicionar Foto
          </Button>
        </View>
      </Card>
      
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Observações</Text>
        <View style={styles.notesContainer}>
          <Text style={styles.notesPlaceholder}>Adicione observações sobre a entrega</Text>
          {/* Em uma implementação real, isso seria um TextInput */}
        </View>
      </Card>
      
      <View style={styles.actionsContainer}>
        <Button 
          variant="primary" 
          size="lg" 
          onPress={handleConfirmDelivery}
          style={styles.actionButton}
        >
          Confirmar Entrega
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          onPress={handleReportIssue}
          style={styles.actionButton}
        >
          Reportar Problema
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
    marginBottom: 4,
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
  checklistItem: {
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#d4edda',
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  checklistText: {
    fontSize: 16,
    color: '#155724',
  },
  signatureContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  signatureText: {
    fontSize: 16,
    color: '#28a745',
    marginBottom: 16,
  },
  signaturePlaceholder: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 16,
  },
  signatureButton: {
    width: '100%',
  },
  photosContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  photosText: {
    fontSize: 16,
    color: '#007bff',
    marginBottom: 16,
  },
  photosPlaceholder: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 16,
  },
  photoButton: {
    width: '100%',
  },
  notesContainer: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  notesPlaceholder: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
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

export default CourierDeliveryConfirmationScreen;