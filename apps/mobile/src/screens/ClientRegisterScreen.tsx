import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '@gasrapido/ui/src/components/common/Input';
import { Button } from '@gasrapido/ui/src/components/common/Button';
import { Colors, Spacing, Typography } from '../utils/theme';

export default function ClientRegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
      newErrors.phone = 'Telefone inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, you would call the auth service here
      // const result = await authService.register({
      //   name: formData.name,
      //   email: formData.email,
      //   phone: formData.phone,
      //   password: formData.password,
      //   role: 'client'
      // });
      
      Alert.alert(
        'Sucesso',
        'Conta criada com sucesso! Você receberá um código de verificação por SMS.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/verify-phone'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar conta. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>Preencha seus dados para começar</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Nome Completo"
          value={formData.name}
          onChangeText={(value) => handleInputChange('name', value)}
          error={errors.name}
          placeholder="Seu nome completo"
          style={styles.input}
        />
        
        <Input
          label="Email"
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          error={errors.email}
          placeholder="seu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        
        <Input
          label="Telefone"
          value={formData.phone}
          onChangeText={(value) => handleInputChange('phone', value)}
          error={errors.phone}
          placeholder="+244 9XX XXX XXX"
          keyboardType="phone-pad"
          style={styles.input}
        />
        
        <Input
          label="Senha"
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
          error={errors.password}
          placeholder="Crie uma senha segura"
          secureTextEntry
          style={styles.input}
        />
        
        <Input
          label="Confirmar Senha"
          value={formData.confirmPassword}
          onChangeText={(value) => handleInputChange('confirmPassword', value)}
          error={errors.confirmPassword}
          placeholder="Digite a senha novamente"
          secureTextEntry
          style={styles.input}
        />
        
        <Button
          variant="primary"
          size="lg"
          onPress={handleRegister}
          loading={isLoading}
          disabled={isLoading}
          style={styles.registerButton}
        >
          {isLoading ? 'Criando Conta...' : 'Criar Conta'}
        </Button>
        
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Já tem uma conta? </Text>
          <Button
            variant="ghost"
            onPress={() => router.push('/login')}
            style={styles.loginButton}
          >
            <Text style={styles.loginButtonText}>Entrar</Text>
          </Button>
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
  },
  form: {
    flex: 1,
  },
  input: {
    marginBottom: Spacing.md,
  },
  registerButton: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: Typography.sizes.md,
    color: Colors.gray,
  },
  loginButton: {
    padding: 0,
  },
  loginButtonText: {
    fontSize: Typography.sizes.md,
    color: Colors.primary,
    fontWeight: Typography.weights.medium,
  },
});