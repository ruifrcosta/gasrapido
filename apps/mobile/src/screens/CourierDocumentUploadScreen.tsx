import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Button } from '@gasrapido/ui/src/components/common/Button';
// @ts-ignore
import { verificationService } from '@gasrapido/shared/src';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../utils/theme';

export default function CourierDocumentUploadScreen() {
  const [documents, setDocuments] = useState({
    idDocument: null as DocumentPicker.DocumentPickerAsset | null,
    drivingLicense: null as DocumentPicker.DocumentPickerAsset | null,
    vehicleRegistration: null as DocumentPicker.DocumentPickerAsset | null,
    insurance: null as DocumentPicker.DocumentPickerAsset | null,
  });
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const router = useRouter();

  const requiredDocuments = [
    { id: 'idDocument', name: 'Documento de Identidade', description: 'Bilhete de identidade ou passaporte' },
    { id: 'drivingLicense', name: 'Carta de Condução', description: 'Carta de condução válida' },
    { id: 'vehicleRegistration', name: 'Registro do Veículo', description: 'Documento de propriedade do veículo' },
    { id: 'insurance', name: 'Seguro de Veículo', description: 'Comprovante de seguro válido' },
  ];

  const handleSelectDocument = async (documentId: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedDocument = result.assets[0];
        setDocuments({ ...documents, [documentId]: selectedDocument });
        Alert.alert('Sucesso', 'Documento selecionado com sucesso!');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao selecionar documento. Por favor, tente novamente.');
    }
  };

  const handleUploadDocument = async (documentId: string) => {
    const document = documents[documentId as keyof typeof documents];
    if (!document) {
      Alert.alert('Erro', 'Por favor, selecione um documento primeiro');
      return;
    }
    
    // Simulate upload progress
    setUploadProgress({ ...uploadProgress, [documentId]: 0 });
    
    const interval = setInterval(() => {
      setUploadProgress((prev: Record<string, number>) => {
        const currentProgress = prev[documentId] || 0;
        if (currentProgress >= 100) {
          clearInterval(interval);
          return prev;
        }
        return { ...prev, [documentId]: currentProgress + 10 };
      });
    }, 200);
    
    try {
      // In a real implementation, you would get the current user ID
      const userId = 'current-user-id'; // This should come from auth context
      
      // Create a File object from the document picker result
      // Note: This is a simplified approach. In a real app, you might need to handle this differently
      const file = {
        uri: document.uri,
        name: document.name || 'document',
        type: document.mimeType || 'application/octet-stream',
        size: document.size || 0,
      } as unknown as File;
      
      // Upload document using verification service
      const result = await verificationService.uploadDocument(
        userId,
        documentId as 'id' | 'license' | 'insurance' | 'vehicle_registration',
        file
      );
      
      if (result.success) {
        clearInterval(interval);
        setUploadProgress({ ...uploadProgress, [documentId]: 100 });
        Alert.alert('Sucesso', 'Documento enviado com sucesso!');
      } else {
        clearInterval(interval);
        setUploadProgress({ ...uploadProgress, [documentId]: 0 });
        Alert.alert('Erro', result.error || 'Falha ao enviar documento. Por favor, tente novamente.');
      }
    } catch (error) {
      clearInterval(interval);
      setUploadProgress({ ...uploadProgress, [documentId]: 0 });
      Alert.alert('Erro', 'Falha ao enviar documento. Por favor, tente novamente.');
    }
  };

  const handleRemoveDocument = (documentId: string) => {
    setDocuments({ ...documents, [documentId]: null });
    setUploadProgress({ ...uploadProgress, [documentId]: 0 });
  };

  const areAllDocumentsUploaded = () => {
    return requiredDocuments.every(doc => 
      documents[doc.id as keyof typeof documents] && 
      uploadProgress[doc.id] === 100
    );
  };

  const handleSubmitForReview = async () => {
    if (!areAllDocumentsUploaded()) {
      Alert.alert('Erro', 'Por favor, envie todos os documentos obrigatórios');
      return;
    }
    
    try {
      // In a real implementation, you would submit for review here
      // For now, we'll simulate getting the current user ID
      const userId = 'current-user-id'; // This should come from auth context
      const userName = 'Entregador'; // This should come from user context
      const result = await verificationService.submitForVerification(userId, userName);
      
      if (result.success) {
        Alert.alert(
          'Documentos Enviados',
          'Seus documentos foram enviados para verificação. Você receberá uma notificação quando forem aprovados.',
          [
            {
              text: 'OK',
              onPress: () => router.push('/verification-pending'),
            },
          ]
        );
      } else {
        Alert.alert('Erro', result.error || 'Falha ao enviar documentos. Por favor, tente novamente.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao enviar documentos. Por favor, tente novamente.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upload de Documentos</Text>
        <Text style={styles.subtitle}>
          Entregador - Envie os documentos necessários para verificação
        </Text>
      </View>

      <View style={styles.content}>
        {requiredDocuments.map((doc) => (
          <View key={doc.id} style={styles.documentCard}>
            <View style={styles.documentHeader}>
              <View>
                <Text style={styles.documentName}>{doc.name}</Text>
                <Text style={styles.documentDescription}>{doc.description}</Text>
              </View>
            </View>
            
            {!documents[doc.id as keyof typeof documents] ? (
              <View style={styles.uploadSection}>
                <TouchableOpacity 
                  style={styles.uploadButton}
                  onPress={() => handleSelectDocument(doc.id)}
                >
                  <Ionicons name="cloud-upload" size={24} color={Colors.primary} />
                  <Text style={styles.uploadButtonText}>Selecionar Documento</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.uploadedSection}>
                {uploadProgress[doc.id] < 100 ? (
                  <View style={styles.progressSection}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { width: `${uploadProgress[doc.id] || 0}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {uploadProgress[doc.id] || 0}%
                    </Text>
                  </View>
                ) : (
                  <View style={styles.uploadedSection}>
                    <View style={styles.uploadedIcon}>
                      <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
                    </View>
                    <Text style={styles.uploadedText}>Documento enviado</Text>
                  </View>
                )}
                
                <View style={styles.documentActions}>
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() => handleUploadDocument(doc.id)}
                    disabled={uploadProgress[doc.id] > 0 && uploadProgress[doc.id] < 100}
                    style={styles.actionButton}
                  >
                    Enviar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onPress={() => handleRemoveDocument(doc.id)}
                    style={styles.actionButton}
                  >
                    Remover
                  </Button>
                </View>
              </View>
            )}
          </View>
        ))}
        
        <Button
          variant="primary"
          size="lg"
          onPress={handleSubmitForReview}
          disabled={!areAllDocumentsUploaded()}
          style={styles.submitButton}
        >
          Enviar para Verificação
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.sizes.md,
    color: Colors.gray,
  },
  content: {
    padding: Spacing.md,
  },
  documentCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  documentName: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  documentDescription: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray,
  },
  uploadSection: {
    alignItems: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.md,
    width: '100%',
  },
  uploadButtonText: {
    color: Colors.primary,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    marginLeft: Spacing.sm,
  },
  uploadedSection: {
    alignItems: 'center',
  },
  progressSection: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  progressText: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray,
    marginBottom: Spacing.md,
  },
  uploadedIcon: {
    marginBottom: Spacing.sm,
  },
  uploadedText: {
    fontSize: Typography.sizes.sm,
    color: Colors.success,
    fontWeight: Typography.weights.medium,
    marginBottom: Spacing.md,
  },
  documentActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButton: {
    marginHorizontal: Spacing.sm,
  },
  submitButton: {
    marginTop: Spacing.lg,
  },
});