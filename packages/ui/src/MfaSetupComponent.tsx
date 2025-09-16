import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import mfaService from '@gasrapido/shared/services/mfaService';

interface MfaSetupComponentProps {
  userId: string;
  onSetupComplete: () => void;
  onCancel: () => void;
}

const MfaSetupComponent: React.FC<MfaSetupComponentProps> = ({
  userId,
  onSetupComplete,
  onCancel
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'totp' | 'sms' | 'email' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [methodId, setMethodId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [step, setStep] = useState<'select' | 'configure' | 'verify'>('select');

  const mfaMethodOptions = [
    {
      id: 'totp',
      name: 'App Autenticador',
      description: 'Use Google Authenticator, Authy ou outro app TOTP',
      icon: '🔒'
    },
    {
      id: 'sms',
      name: 'SMS',
      description: 'Receba códigos por mensagem de texto',
      icon: '📱'
    },
    {
      id: 'email',
      name: 'Email',
      description: 'Receba códigos por email',
      icon: '📧'
    }
  ];

  const handleMethodSelect = (method: 'totp' | 'sms' | 'email') => {
    setSelectedMethod(method);
    setStep('configure');
  };

  const handleConfigure = async () => {
    if (!selectedMethod) return;
    
    setIsLoading(true);
    
    try {
      let options: { phoneNumber?: string; emailAddress?: string } | undefined;
      if (selectedMethod === 'sms') {
        options = { phoneNumber };
      } else if (selectedMethod === 'email') {
        options = { emailAddress };
      }
      
      const result = await mfaService.registerMfaMethod(userId, selectedMethod, options);
      
      setMethodId(result.method.id);
      setSecret(result.secret || null);
      
      if (result.qrCode) {
        setQrCode(result.qrCode);
      }
      
      setStep('verify');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao configurar método MFA');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!methodId) return;
    
    setIsLoading(true);
    
    try {
      const isValid = await mfaService.verifyMfaMethod(methodId, verificationCode);
      
      if (isValid) {
        // Verificar se é o primeiro método e torná-lo primário
        const userMethods = mfaService.getUserMfaMethods(userId);
        if (userMethods.length === 1) {
          await mfaService.setPrimaryMfaMethod(methodId);
        }
        
        Alert.alert('Sucesso', 'Método MFA configurado com sucesso!', [
          { text: 'OK', onPress: onSetupComplete }
        ]);
      } else {
        Alert.alert('Erro', 'Código de verificação inválido');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao verificar método MFA');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!methodId) return;
    
    try {
      await mfaService.initiateMfaChallenge(userId, methodId);
      Alert.alert('Sucesso', 'Código reenviado');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao reenviar código');
    }
  };

  const renderSelectMethod = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Configurar Autenticação Multifator</Text>
      <Text style={styles.subtitle}>
        Escolha um método adicional para proteger sua conta
      </Text>
      
      {mfaMethodOptions.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={styles.methodOption}
          onPress={() => handleMethodSelect(option.id as 'totp' | 'sms' | 'email')}
        >
          <Text style={styles.methodIcon}>{option.icon}</Text>
          <View style={styles.methodText}>
            <Text style={styles.methodName}>{option.name}</Text>
            <Text style={styles.methodDescription}>{option.description}</Text>
          </View>
        </TouchableOpacity>
      ))}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderConfigureMethod = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Configurar {selectedMethod === 'totp' ? 'App Autenticador' : selectedMethod === 'sms' ? 'SMS' : 'Email'}</Text>
      
      {selectedMethod === 'totp' && (
        <View style={styles.totpContainer}>
          <Text style={styles.instruction}>
            1. Instale um app autenticador (Google Authenticator, Authy, etc.)
          </Text>
          <Text style={styles.instruction}>
            2. Escaneie o QR Code abaixo com o app
          </Text>
          {qrCode && (
            <Image 
              source={{ uri: qrCode }} 
              style={styles.qrCode}
              resizeMode="contain"
            />
          )}
          <Text style={styles.instruction}>
            3. Digite o código gerado pelo app
          </Text>
        </View>
      )}
      
      {selectedMethod === 'sms' && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Número de telefone</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="(XX) XXXXX-XXXX"
            keyboardType="phone-pad"
          />
        </View>
      )}
      
      {selectedMethod === 'email' && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Endereço de email</Text>
          <TextInput
            style={styles.input}
            value={emailAddress}
            onChangeText={setEmailAddress}
            placeholder="seu@email.com"
            keyboardType="email-address"
          />
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.primaryButton, isLoading && styles.disabledButton]} 
          onPress={handleConfigure}
          disabled={isLoading}
        >
          <Text style={styles.primaryButtonText}>
            {isLoading ? 'Configurando...' : 'Continuar'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.cancelButton} onPress={() => setStep('select')}>
          <Text style={styles.cancelButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderVerifyMethod = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Verificar Método</Text>
      <Text style={styles.subtitle}>
        {selectedMethod === 'totp' 
          ? 'Digite o código de 6 dígitos gerado pelo seu app autenticador'
          : selectedMethod === 'sms' 
          ? `Digite o código enviado para ${phoneNumber}`
          : `Digite o código enviado para ${emailAddress}`}
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
        />
      </View>
      
      {selectedMethod !== 'totp' && (
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
        
        <TouchableOpacity style={styles.cancelButton} onPress={() => setStep('configure')}>
          <Text style={styles.cancelButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {step === 'select' && renderSelectMethod()}
      {step === 'configure' && renderConfigureMethod()}
      {step === 'verify' && renderVerifyMethod()}
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
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  methodIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  methodText: {
    flex: 1,
  },
  methodName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  methodDescription: {
    fontSize: 14,
    color: '#666',
  },
  totpContainer: {
    marginBottom: 20,
  },
  instruction: {
    fontSize: 16,
    marginBottom: 15,
  },
  qrCode: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
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

export default MfaSetupComponent;