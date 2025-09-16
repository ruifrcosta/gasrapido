import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import mfaService from '@gasrapido/shared/services/mfaService';

interface MfaVerificationComponentProps {
  challengeId: string;
  methodType: 'totp' | 'sms' | 'email' | 'backup';
  onVerificationComplete: (token: string) => void;
  onResendCode?: () => void;
  onCancel: () => void;
}

const MfaVerificationComponent: React.FC<MfaVerificationComponentProps> = ({
  challengeId,
  methodType,
  onVerificationComplete,
  onResendCode,
  onCancel
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if (!verificationCode) {
      Alert.alert('Erro', 'Por favor, insira o código de verificação');
      return;
    }

    setIsLoading(true);

    try {
      const isValid = await mfaService.verifyMfaChallenge(challengeId, verificationCode);
      
      if (isValid) {
        onVerificationComplete(verificationCode);
      } else {
        Alert.alert('Erro', 'Código de verificação inválido');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao verificar código');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    if (onResendCode) {
      onResendCode();
    }
  };

  const getMethodLabel = () => {
    switch (methodType) {
      case 'totp': return 'App Autenticador';
      case 'sms': return 'SMS';
      case 'email': return 'Email';
      case 'backup': return 'Código de Backup';
      default: return 'Método de Autenticação';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verificação em Duas Etapas</Text>
      <Text style={styles.subtitle}>
        Insira o código de verificação do seu {getMethodLabel()}
      </Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Código de verificação</Text>
        <TextInput
          style={styles.input}
          value={verificationCode}
          onChangeText={setVerificationCode}
          placeholder="000000"
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
        />
      </View>
      
      {methodType !== 'totp' && methodType !== 'backup' && (
        <TouchableOpacity onPress={handleResendCode}>
          <Text style={styles.resendText}>Reenviar código</Text>
        </TouchableOpacity>
      )}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.primaryButton, isLoading && styles.disabledButton]} 
          onPress={handleVerify}
          disabled={isLoading}
        >
          <Text style={styles.primaryButtonText}>
            {isLoading ? 'Verificando...' : 'Verificar'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
  resendText: {
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default MfaVerificationComponent;