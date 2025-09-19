import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@gasrapido/ui/src/components/common/Button';
import { Colors, Spacing, Typography, BorderRadius } from '../utils/theme';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  const handleClientRegister = () => {
    router.push('/client-register');
  };

  const handleInvitationEntry = () => {
    router.push('/invitation-entry');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>GasRápido</Text>
          </View>
        </View>

        {/* Welcome Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.title}>Bem-vindo ao GasRápido</Text>
          <Text style={styles.subtitle}>
            A maneira mais rápida e segura de receber gás em casa
          </Text>
        </View>

        {/* Value Proposition */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>⏱️</Text>
            <Text style={styles.featureText}>Entrega em minutos</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🔒</Text>
            <Text style={styles.featureText}>Segurança garantida</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>💰</Text>
            <Text style={styles.featureText}>Preços transparentes</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            variant="primary"
            size="lg"
            onPress={handleClientRegister}
            style={styles.registerButton}
          >
            Registrar como Cliente
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onPress={handleInvitationEntry}
            style={styles.invitationButton}
          >
            Tenho Convite
          </Button>
        </View>

        {/* Terms and Conditions */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            Ao continuar, você concorda com nossos{' '}
            <Text style={styles.linkText}>Termos de Serviço</Text>
            {' '}e{' '}
            <Text style={styles.linkText}>Política de Privacidade</Text>
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
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoText: {
    color: Colors.white,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: Typography.sizes.md,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresContainer: {
    marginBottom: Spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  featureText: {
    fontSize: Typography.sizes.md,
    color: Colors.black,
    fontWeight: Typography.weights.medium,
  },
  actionsContainer: {
    marginBottom: Spacing.xl,
  },
  registerButton: {
    marginBottom: Spacing.md,
  },
  invitationButton: {
    marginBottom: Spacing.md,
  },
  termsContainer: {
    alignItems: 'center',
  },
  termsText: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
  linkText: {
    color: Colors.primary,
    fontWeight: Typography.weights.medium,
  },
});