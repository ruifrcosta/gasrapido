import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Order } from '@gasrapido/shared/services/orderService';
import { ComplianceChecklist } from '@gasrapido/shared/services/complianceService';
import { SignatureData } from '@gasrapido/shared/services/signatureService';
import ClientChecklistComponent from '../components/ClientChecklistComponent';
import { Button } from '@rneui/themed';

type ConfirmDeliveryScreenRouteProp = RouteProp<{
  ConfirmDelivery: { order: Order };
}, 'ConfirmDelivery'>;

const ConfirmDeliveryScreen: React.FC = () => {
  const route = useRoute<ConfirmDeliveryScreenRouteProp>();
  const navigation = useNavigation();
  const { order } = route.params;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signature, setSignature] = useState<string>('');

  // Manipular conclusão do checklist
  const handleChecklistComplete = async (checklistData: any) => {
    setIsSubmitting(true);
    
    try {
      // Em uma implementação real, aqui chamaria os serviços:
      // 1. Salvar o checklist de conformidade
      // 2. Capturar e armazenar a assinatura
      // 3. Atualizar o status do pedido para "entregue"
      
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Entrega Confirmada',
        'A entrega foi confirmada com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao confirmar a entrega. Por favor, tente novamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manipular cancelamento do checklist
  const handleChecklistCancel = () => {
    Alert.alert(
      'Cancelar Confirmação',
      'Tem certeza que deseja cancelar a confirmação de entrega?',
      [
        {
          text: 'Não',
          style: 'cancel'
        },
        {
          text: 'Sim',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Confirmar Entrega</Text>
        <Text style={styles.orderId}>Pedido #{order.id}</Text>
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informações do Cliente</Text>
        <Text style={styles.infoText}>Nome: {order.clientName}</Text>
        <Text style={styles.infoText}>Telefone: {order.clientPhone}</Text>
        <Text style={styles.infoText}>Endereço: {order.deliveryAddress}</Text>
      </View>
      
      <View style={styles.checklistSection}>
        <ClientChecklistComponent
          order={order}
          onChecklistComplete={handleChecklistComplete}
          onChecklistCancel={handleChecklistCancel}
        />
      </View>
      
      {isSubmitting && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Confirmando entrega...</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  orderId: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  infoSection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  checklistSection: {
    margin: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ConfirmDeliveryScreen;