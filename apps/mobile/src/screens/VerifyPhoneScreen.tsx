import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '@gasrapido/ui/src/components/common/Input';
import { Button } from '@gasrapido/ui/src/components/common/Button';
import { Colors, Spacing, Typography } from '../utils/theme';

export default function VerifyPhoneScreen() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev === 1) {
          setCanResend(true);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      Alert.alert('Erro', 'Por favor, insira o código completo de 6 dígitos');
      return;
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, you would verify the OTP here
      // const result = await authService.verifyPhoneOtp(otpCode);
      
      Alert.alert(
        'Sucesso',
        'Telefone verificado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => router.push('/setup-address'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Código inválido. Por favor, tente novamente.');
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real implementation, you would resend the OTP here
      // await authService.resendPhoneOtp();
      
      setCanResend(false);
      Alert.alert('Sucesso', 'Novo código enviado para o seu telefone');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao reenviar código. Por favor, tente novamente.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Verificar Telefone</Text>
        <Text style={styles.subtitle}>
          Enviamos um código de 6 dígitos para o seu telefone
        </Text>
      </View>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <Input
            key={index}
            id={`otp-${index}`}
            value={digit}
            onChangeText={(value) => handleOtpChange(index, value)}
            keyboardType="number-pad"
            maxLength={1}
            style={styles.otpInput}
          />
        ))}
      </View>

      <Button
        variant="primary"
        size="lg"
        onPress={handleVerify}
        style={styles.verifyButton}
      >
        Verificar
      </Button>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>
          Não recebeu o código?{' '}
          <Button
            variant="ghost"
            disabled={!canResend}
            onPress={handleResendCode}
            style={styles.resendButton}
          >
            <Text style={[styles.resendButtonText, !canResend && styles.disabledText]}>
              Reenviar {canResend ? '' : `(${timer}s)`}
            </Text>
          </Button>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
    justifyContent: 'center',
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  otpInput: {
    width: 45,
    height: 50,
    textAlign: 'center',
  },
  verifyButton: {
    marginBottom: Spacing.lg,
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: Typography.sizes.md,
    color: Colors.gray,
  },
  resendButton: {
    padding: 0,
  },
  resendButtonText: {
    fontSize: Typography.sizes.md,
    color: Colors.primary,
    fontWeight: Typography.weights.medium,
  },
  disabledText: {
    color: Colors.gray,
  },
});