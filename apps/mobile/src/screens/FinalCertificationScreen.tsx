// @ts-nocheck
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Order } from '../../../packages/shared/types/order';
import { Evidence } from '../../../packages/shared/types/evidence';
import EvidenceCaptureComponent from '../components/EvidenceCaptureComponent';
import certificationService from '../../../packages/shared/services/certificationService';
import complianceService from '../../../packages/shared/services/complianceService';
import CustomButton from '../../../packages/shared/components/CustomButton';
import { useAuth } from '../../../packages/shared/contexts/AuthContext';

type RootStackParamList = {
  FinalCertification: { order: Order };
  OrderHistory: undefined;
};

type FinalCertificationScreenRouteProp = RouteProp<RootStackParamList, 'FinalCertification'>;
type FinalCertificationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'FinalCertification'>;

type Props = {
  route: FinalCertificationScreenRouteProp;
  navigation: FinalCertificationScreenNavigationProp;
};

const FinalCertificationScreen: React.FC<Props> = ({ route, navigation }) => {
  const { order } = route.params;
  const { user } = useAuth();
  const [evidence, setEvidence] = useState<Evidence | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [isCertifying, setIsCertifying] = useState<boolean>(false);

  // Manipular evidência capturada
  const handleEvidenceCaptured = (capturedEvidence: Evidence) => {
    setEvidence(capturedEvidence);
    setIsCapturing(false);
  };

  // Cancelar captura de evidência
  const handleCaptureCancelled = () => {
    setIsCapturing(false);
  };

  // Iniciar captura de evidências
  const startEvidenceCapture = () => {
    setIsCapturing(true);
  };

  // Certificar entrega final
  const certifyDelivery = async () => {
    if (!evidence || !user) {
      Alert.alert('Erro', 'Evidências não capturadas ou usuário não autenticado');
      return;
    }

    setIsCertifying(true);
    
    try {
      // Certificar entrega com o serviço de certificação
      const certificationResult = await certificationService.certifyDelivery({
        orderId: order.id,
        clientId: order.clientId,
        supplierId: order.supplierId,
        courierId: user.id,
        deliveryTimestamp: evidence.deliveryTimestamp,
        gpsCoordinates: evidence.gpsCoordinates,
        photos: evidence.photos,
        signature: evidence.signature,
        checklist: evidence.checklist,
        notes: evidence.notes
      });

      // Atualizar status do pedido para "entregue"
      // Em uma implementação real, isso faria uma chamada à API
      await complianceService.simulateApiCall();

      Alert.alert(
        'Sucesso',
        'Entrega certificada com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('OrderHistory')
          }
        ]
      );
    } catch (error) {
      console.error('Erro ao certificar entrega:', error);
      Alert.alert('Erro', 'Falha ao certificar entrega');
    } finally {
      setIsCertifying(false);
    }
  };

  // Renderizar resumo do pedido
  const renderOrderSummary = () => (
    <View style={styles.summaryContainer}>
      <Text style={styles.sectionTitle}>Resumo da Entrega</Text>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Pedido:</Text>
        <Text style={styles.value}>{order.id}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Cliente:</Text>
        <Text style={styles.value}>{order.clientName}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Endereço:</Text>
        <Text style={styles.value}>{order.deliveryAddress}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Produtos:</Text>
        <Text style={styles.value}>{order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Valor Total:</Text>
        <Text style={styles.value}>R$ {order.totalAmount.toFixed(2)}</Text>
      </View>
    </View>
  );

  // Renderizar evidências capturadas
  const renderEvidenceSummary = () => {
    if (!evidence) return null;

    return (
      <View style={styles.evidenceContainer}>
        <Text style={styles.sectionTitle}>Evidências Capturadas</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Fotos:</Text>
          <Text style={styles.value}>{evidence.photos.length}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Localização:</Text>
          <Text style={styles.value}>
            {evidence.gpsCoordinates.latitude.toFixed(6)}, {evidence.gpsCoordinates.longitude.toFixed(6)}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Horário:</Text>
          <Text style={styles.value}>
            {new Date(evidence.deliveryTimestamp).toLocaleString('pt-BR')}
          </Text>
        </View>
      </View>
    );
  };

  // Se estiver capturando evidências, mostrar o componente de captura
  if (isCapturing) {
    return (
      <EvidenceCaptureComponent
        orderId={order.id}
        clientId={order.clientId}
        supplierId={order.supplierId}
        courierId={user?.id || ''}
        onEvidenceCaptured={handleEvidenceCaptured}
        onCaptureCancelled={handleCaptureCancelled}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Certificação Final</Text>
      
      {renderOrderSummary()}
      
      {evidence ? (
        <>
          {renderEvidenceSummary()}
          
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Recapturar Evidências"
              onPress={startEvidenceCapture}
              variant="secondary"
              style={styles.button}
            />
            
            <CustomButton
              title={isCertifying ? "Certificando..." : "Certificar Entrega"}
              onPress={certifyDelivery}
              disabled={isCertifying}
              style={styles.button}
            />
          </View>
        </>
      ) : (
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Capturar Evidências"
            onPress={startEvidenceCapture}
            style={styles.button}
          />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  summaryContainer: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  evidenceContainer: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
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
    fontWeight: '500',
    color: '#333',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
  buttonContainer: {
    margin: 16,
  },
  button: {
    marginVertical: 8,
  },
});

export default FinalCertificationScreen;