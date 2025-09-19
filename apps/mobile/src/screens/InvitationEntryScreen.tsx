import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '@gasrapido/ui/src/components/common/Input';
import { Button } from '@gasrapido/ui/src/components/common/Button';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../utils/theme';

export default function InvitationEntryScreen() {
  const [invitationCode, setInvitationCode] = useState('');
  const [errors, setErrors] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    if (!invitationCode.trim()) {
      setErrors('Código de convite é obrigatório');
      return false;
    }
    
    if (invitationCode.length < 6) {
      setErrors('Código de convite inválido');
      return false;
    }
    
    setErrors('');
    return true;
  };

  const handleVerifyInvitation = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, you would verify the invitation code here
      // const result = await invitationService.verifyInvitation(invitationCode);
      
      // For demo purposes, we'll simulate different responses based on the code
      if (invitationCode.startsWith('SUP')) {
        // Supplier invitation
        router.push('/supplier-document-upload');
      } else if (invitationCode.startsWith('COUR')) {
        // Courier invitation
        router.push('/courier-document-upload');
      } else {
        Alert.alert('Erro', 'Código de convite inválido ou expirado');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao verificar convite. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToWelcome = () => {
    router.push('/welcome');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Entrar com Convite</Text>
        <Text style={styles.subtitle}>
          Insira o código de convite recebido por email
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Código de Convite"
          value={invitationCode}
          onChangeText={setInvitationCode}
          error={errors}
          placeholder="Ex: SUP-ABC123 ou COUR-XYZ789"
          autoCapitalize="characters"
          style={styles.input}
        />
        
        <Button
          variant="primary"
          size="lg"
          onPress={handleVerifyInvitation}
          loading={isLoading}
          disabled={isLoading}
          style={styles.verifyButton}
        >
          {isLoading ? 'Verificando...' : 'Verificar Convite'}
        </Button>
        
        <View style={styles.backContainer}>
          <Button
            variant="ghost"
            onPress={handleBackToWelcome}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </Button>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Como funciona?</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoBullet}>•</Text>
          <Text style={styles.infoText}>
            Receba um código de convite exclusivo por email
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoBullet}>•</Text>
          <Text style={styles.infoText}>
            Insira o código acima para começar o processo de registro
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoBullet}>•</Text>
          <Text style={styles.infoText}>
            Faça upload dos documentos necessários para verificação
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
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
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  input: {
    marginBottom: Spacing.lg,
  },
  verifyButton: {
    marginBottom: Spacing.md,
  },
  backContainer: {
    alignItems: 'center',
  },
  backButton: {
    padding: 0,
  },
  backButtonText: {
    fontSize: Typography.sizes.md,
    color: Colors.primary,
    fontWeight: Typography.weights.medium,
  },
  infoSection: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  infoTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
    marginBottom: Spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  infoBullet: {
    fontSize: Typography.sizes.md,
    color: Colors.primary,
    marginRight: Spacing.sm,
  },
  infoText: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray,
    flex: 1,
  },
});