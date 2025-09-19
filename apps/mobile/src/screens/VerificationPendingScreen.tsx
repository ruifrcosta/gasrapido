import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@gasrapido/ui/src/components/common/Button';
// @ts-ignore
import { verificationService } from '@gasrapido/shared/src';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../utils/theme';

export default function VerificationPendingScreen() {
  const [verificationStatus, setVerificationStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate fetching verification status
    const fetchStatus = async () => {
      try {
        // In a real implementation, you would get the current user ID
        const userId = 'current-user-id'; // This should come from auth context
        const status = await verificationService.getVerificationStatus(userId);
        setVerificationStatus(status);
      } catch (error) {
        console.error('Error fetching verification status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const handleCheckStatus = async () => {
    setLoading(true);
    try {
      // In a real implementation, you would get the current user ID
      const userId = 'current-user-id'; // This should come from auth context
      const status = await verificationService.getVerificationStatus(userId);
      setVerificationStatus(status);
    } catch (error) {
      alert('Erro ao verificar status. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleContactSupport = () => {
    router.push('/contact-support');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Carregando status...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="time" size={64} color={Colors.accent} />
        </View>
        
        <Text style={styles.title}>Verificação em Andamento</Text>
        
        <Text style={styles.description}>
          Seus documentos foram enviados com sucesso e estão em processo de verificação. 
          Nossa equipe está analisando as informações fornecidas.
        </Text>
        
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>Status da Verificação</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>
                {verificationStatus?.status === 'approved' ? 'Aprovado' : 
                 verificationStatus?.status === 'rejected' ? 'Rejeitado' : 'Em Andamento'}
              </Text>
            </View>
          </View>
          
          <View style={styles.timeline}>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineIcon, styles.completedIcon]}>
                <Ionicons name="checkmark" size={16} color={Colors.white} />
              </View>
              <View>
                <Text style={styles.timelineTitle}>Documentos Enviados</Text>
                <Text style={styles.timelineDate}>Hoje, 14:30</Text>
              </View>
            </View>
            
            <View style={styles.timelineItem}>
              <View style={[
                styles.timelineIcon, 
                verificationStatus?.status === 'pending' ? styles.activeIcon : styles.completedIcon
              ]}>
                <Ionicons 
                  name={verificationStatus?.status === 'pending' ? "time" : "checkmark"} 
                  size={16} 
                  color={Colors.white} 
                />
              </View>
              <View>
                <Text style={styles.timelineTitle}>Em Verificação</Text>
                <Text style={styles.timelineDescription}>Nossa equipe está analisando seus documentos</Text>
              </View>
            </View>
            
            <View style={styles.timelineItem}>
              <View style={[
                styles.timelineIcon, 
                verificationStatus?.status === 'approved' ? styles.completedIcon : styles.pendingIcon
              ]}>
                <Ionicons 
                  name={verificationStatus?.status === 'approved' ? "checkmark" : "checkmark"} 
                  size={16} 
                  color={verificationStatus?.status === 'approved' ? Colors.white : Colors.gray} 
                />
              </View>
              <View>
                <Text style={styles.timelineTitle}>
                  {verificationStatus?.status === 'approved' ? 'Aprovado' : 'Aprovar'}
                </Text>
                <Text style={styles.timelineDescription}>
                  {verificationStatus?.status === 'approved' ? 
                    'Você pode acessar sua conta' : 
                    'Você poderá acessar sua conta'}
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>O que esperar?</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>•</Text>
            <Text style={styles.infoText}>
              O processo de verificação pode levar de 1 a 3 dias úteis
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>•</Text>
            <Text style={styles.infoText}>
              Você receberá uma notificação quando a verificação for concluída
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>•</Text>
            <Text style={styles.infoText}>
              Em caso de problemas, nossa equipe entrará em contato
            </Text>
          </View>
        </View>
        
        <View style={styles.actions}>
          <Button
            variant="primary"
            size="lg"
            onPress={handleCheckStatus}
            style={styles.actionButton}
            disabled={loading}
          >
            {loading ? 'Verificando...' : 'Verificar Status'}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onPress={handleContactSupport}
            style={styles.actionButton}
          >
            Contatar Suporte
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.sizes.md,
    color: Colors.gray,
  },
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
  },
  iconContainer: {
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
  description: {
    fontSize: Typography.sizes.md,
    color: Colors.gray,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  statusCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  statusTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
  },
  statusBadge: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  statusBadgeText: {
    fontSize: Typography.sizes.sm,
    color: Colors.white,
    fontWeight: Typography.weights.medium,
  },
  timeline: {
    marginLeft: 12,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  timelineIcon: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  completedIcon: {
    backgroundColor: Colors.success,
  },
  activeIcon: {
    backgroundColor: Colors.accent,
  },
  pendingIcon: {
    backgroundColor: Colors.lightGray,
  },
  timelineTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  timelineDate: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray,
  },
  timelineDescription: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray,
  },
  infoSection: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
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
  actions: {
    marginTop: Spacing.lg,
  },
  actionButton: {
    marginBottom: Spacing.md,
  },
});