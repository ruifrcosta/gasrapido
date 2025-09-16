import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import authService from '@gasrapido/shared/services/authService';
import MfaVerificationComponent from '@gasrapido/ui/src/MfaVerificationComponent';
import MfaSetupComponent from '@gasrapido/ui/src/MfaSetupComponent';

const LoginWithMfaScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mfaChallenge, setMfaChallenge] = useState<any>(null);
  const [mfaMethodType, setMfaMethodType] = useState<string>('');
  const [showMfaSetup, setShowMfaSetup] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.login({ email, password });
      
      if (result.needsMfa && result.challenge) {
        // Requer MFA, mostrar tela de verificação
        setMfaChallenge(result.challenge);
        setMfaMethodType(result.methodType || 'totp');
      } else {
        // Login bem-sucedido sem MFA
        Alert.alert('Sucesso', 'Login realizado com sucesso!', [
          { text: 'OK', onPress: () => router.push('/home') }
        ]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMfaComplete = async (token: string) => {
    if (!mfaChallenge) return;

    try {
      const result = await authService.completeMfaLogin(mfaChallenge.id, token);
      
      if (result) {
        Alert.alert('Sucesso', 'Login realizado com sucesso!', [
          { text: 'OK', onPress: () => router.push('/home') }
        ]);
      } else {
        Alert.alert('Erro', 'Falha na verificação MFA');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha na verificação MFA');
    }
  };

  const handleMfaCancel = () => {
    setMfaChallenge(null);
  };

  const handleMfaResend = () => {
    Alert.alert('Informação', 'Código reenviado');
  };

  const handleSetupComplete = () => {
    setShowMfaSetup(false);
    Alert.alert('Sucesso', 'MFA configurado com sucesso!');
  };

  const handleSetupCancel = () => {
    setShowMfaSetup(false);
  };

  // Se estivermos no processo de verificação MFA
  if (mfaChallenge) {
    return (
      <View style={styles.container}>
        <MfaVerificationComponent
          challengeId={mfaChallenge.id}
          methodType={mfaMethodType as any}
          onVerificationComplete={handleMfaComplete}
          onResendCode={handleMfaResend}
          onCancel={handleMfaCancel}
        />
      </View>
    );
  }

  // Se estivermos configurando MFA
  if (showMfaSetup) {
    return (
      <View style={styles.container}>
        <MfaSetupComponent
          userId="temp-user-id" // Em uma implementação real, obteríamos o ID do usuário
          onSetupComplete={handleSetupComplete}
          onCancel={handleSetupCancel}
        />
      </View>
    );
  }

  // Tela de login normal
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="seu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Sua senha"
          secureTextEntry
        />
      </View>
      
      <TouchableOpacity 
        style={[styles.loginButton, isLoading && styles.disabledButton]} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.loginButtonText}>
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.mfaSetupButton}
        onPress={() => setShowMfaSetup(true)}
      >
        <Text style={styles.mfaSetupButtonText}>
          Configurar Autenticação Multifator
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.push('/forgot-password')}>
        <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
      </TouchableOpacity>
      
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Não tem uma conta? </Text>
        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={styles.signupLink}>Registre-se</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
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
  loginButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mfaSetupButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  mfaSetupButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    fontSize: 16,
  },
  signupLink: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default LoginWithMfaScreen;