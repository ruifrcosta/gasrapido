import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { aiAgentsService, alertService } from '@gasrapido/shared';
import { Card, Button } from '@gasrapido/ui';
import { Colors, Spacing, Typography, Shadows, BorderRadius } from '../constants';

// Definir interface para alertas de IA
interface AIAlert {
  id: string;
  title: string;
  message: string;
  type: 'scarcity' | 'sla' | 'pricing' | 'info' | 'warning' | 'error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  agentType: string;
  agentName: string;
  userId?: string;
  resourceId?: string;
  read: boolean;
  createdAt: string;
  triggeredAt?: string;
  resolvedAt?: string;
  metadata?: Record<string, any>;
  confidence?: number;
}

interface AIAlertsScreenProps {
  userId: string;
}

const AIAlertsScreen: React.FC<AIAlertsScreenProps> = ({ userId }) => {
  const [alerts, setAlerts] = useState<AIAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [availableAgents, setAvailableAgents] = useState<any[]>([]);

  useEffect(() => {
    loadAlerts();
    loadAvailableAgents();
  }, [userId]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      
      // Carregar alertas específicos de IA (isso seria filtrado no backend)
      const userAlerts = await alertService.getAlerts({ userId });
      
      // Filtrar apenas alertas gerados por agentes de IA
      // Na implementação real, isso seria feito no backend
      const aiAlerts = userAlerts.filter(alert => 
        alert.metadata && alert.metadata.generatedByAI
      ).map(alert => ({
        ...alert,
        agentType: alert.metadata?.agentType || 'unknown',
        agentName: alert.metadata?.agentName || 'Agente Desconhecido',
        confidence: alert.metadata?.confidence
      })) as AIAlert[];
      
      setAlerts(aiAlerts);
    } catch (error) {
      console.error('Erro ao carregar alertas de IA:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableAgents = async () => {
    try {
      const agents = await aiAgentsService.getAvailableAgents();
      setAvailableAgents(agents);
    } catch (error) {
      console.error('Erro ao carregar agentes de IA:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAlerts();
    setRefreshing(false);
  };

  const markAsRead = async (alertId: string) => {
    try {
      await alertService.markAsRead(alertId);
      // Atualizar a lista de alertas
      await loadAlerts();
    } catch (error) {
      console.error('Erro ao marcar alerta como lido:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Marcar todos os alertas como lidos
      await alertService.markAllAsRead(userId);
      // Atualizar a lista de alertas
      await loadAlerts();
    } catch (error) {
      console.error('Erro ao marcar todos os alertas como lidos:', error);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      await alertService.resolveAlert(alertId);
      // Atualizar a lista de alertas
      await loadAlerts();
    } catch (error) {
      console.error('Erro ao resolver alerta:', error);
    }
  };

  const removeAlert = async (alertId: string) => {
    try {
      await alertService.removeAlert(alertId);
      // Atualizar a lista de alertas
      await loadAlerts();
    } catch (error) {
      console.error('Erro ao remover alerta:', error);
    }
  };

  const getAlertStyle = (type: AIAlert['type']) => {
    switch (type) {
      case 'scarcity':
        return { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' };
      case 'sla':
        return { backgroundColor: '#FEE2E2', borderColor: '#EF4444' };
      case 'pricing':
        return { backgroundColor: '#DBEAFE', borderColor: '#3B82F6' };
      case 'warning':
        return { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' };
      case 'error':
        return { backgroundColor: '#FEE2E2', borderColor: '#EF4444' };
      case 'success':
        return { backgroundColor: '#D1FAE5', borderColor: '#10B981' };
      case 'info':
      default:
        return { backgroundColor: '#DBEAFE', borderColor: '#3B82F6' };
    }
  };

  const getSeverityIcon = (severity: AIAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return '🔴';
      case 'high':
        return '🟠';
      case 'medium':
        return '🟡';
      case 'low':
      default:
        return '🟢';
    }
  };

  const getAgentTypeLabel = (agentType: string) => {
    const labels: Record<string, string> = {
      'deepseek': 'DeepSeek AI',
      'customer_support': 'Suporte ao Cliente',
      'backoffice': 'Backoffice',
      'user_assist': 'Assistente do Usuário',
      'ticket_classifier': 'Classificador de Tickets',
      'fraud_detector': 'Detector de Fraudes',
      'maintenance_predictor': 'Preditor de Manutenção'
    };
    return labels[agentType] || agentType;
  };

  const getAgentTypeColor = (agentType: string) => {
    const colors: Record<string, string> = {
      'deepseek': '#FF6B6B',
      'customer_support': '#4ECDC4',
      'backoffice': '#45B7D1',
      'user_assist': '#96CEB4',
      'ticket_classifier': '#FFEAA7',
      'fraud_detector': '#DDA0DD',
      'maintenance_predictor': '#98D8C8'
    };
    return colors[agentType] || '#95A5A6';
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando alertas de IA...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Alertas de Inteligência Artificial</Text>
        {alerts.length > 0 && (
          <Button 
            variant="secondary" 
            size="sm" 
            onPress={markAllAsRead}
            style={styles.markAllButton}
          >
            Marcar todos como lidos
          </Button>
        )}
      </View>
      
      {/* Agentes disponíveis */}
      <View style={styles.agentsSection}>
        <Text style={styles.sectionTitle}>Agentes de IA Ativos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.agentsScroll}>
          {availableAgents.filter(agent => agent.enabled).map(agent => (
            <View 
              key={agent.id} 
              style={[styles.agentBadge, { backgroundColor: getAgentTypeColor(agent.type) }]}
            >
              <Text style={styles.agentBadgeText}>{getAgentTypeLabel(agent.type)}</Text>
            </View>
          ))}
          {availableAgents.filter(agent => agent.enabled).length === 0 && (
            <Text style={styles.noAgentsText}>Nenhum agente ativo</Text>
          )}
        </ScrollView>
      </View>
      
      {alerts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="analytics" size={48} color={Colors.gray} />
          <Text style={styles.emptyText}>Nenhum alerta gerado por IA</Text>
          <Text style={styles.emptySubtext}>Os agentes de IA irão gerar alertas conforme analisam dados do sistema</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {alerts.map((alert: AIAlert) => (
            <Card key={alert.id} style={[styles.alertCard, getAlertStyle(alert.type), !alert.read && styles.unreadAlert]}>
              <View style={styles.alertHeader}>
                <View style={styles.alertHeaderLeft}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <View style={styles.alertMeta}>
                    <View style={[styles.agentTypeBadge, { backgroundColor: getAgentTypeColor(alert.agentType) }]}>
                      <Text style={styles.agentTypeText}>{getAgentTypeLabel(alert.agentType)}</Text>
                    </View>
                    <Text style={styles.alertTime}>
                      {new Date(alert.createdAt).toLocaleString('pt-BR')}
                    </Text>
                  </View>
                </View>
                <Text style={styles.severityIcon}>{getSeverityIcon(alert.severity)}</Text>
              </View>
              
              <Text style={styles.alertMessage}>{alert.message}</Text>
              
              {alert.confidence && (
                <View style={styles.confidenceContainer}>
                  <Text style={styles.confidenceLabel}>Confiança: {Math.round(alert.confidence * 100)}%</Text>
                  <View style={styles.confidenceBar}>
                    <View 
                      style={[styles.confidenceFill, { width: `${alert.confidence * 100}%` }]} 
                    />
                  </View>
                </View>
              )}
              
              <View style={styles.alertActions}>
                {!alert.read && (
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => markAsRead(alert.id)}
                  >
                    <Text style={styles.actionText}>Marcar como lido</Text>
                  </TouchableOpacity>
                )}
                
                {alert.type !== 'info' && (
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => resolveAlert(alert.id)}
                  >
                    <Text style={styles.actionText}>Resolver</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => removeAlert(alert.id)}
                >
                  <Text style={styles.actionText}>Remover</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
  },
  markAllButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  agentsSection: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  agentsScroll: {
    flexDirection: 'row',
  },
  agentBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
  },
  agentBadgeText: {
    color: Colors.white,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
  noAgentsText: {
    color: Colors.gray,
    fontSize: Typography.sizes.sm,
    fontStyle: 'italic',
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: Typography.sizes.md,
    color: Colors.gray,
    marginTop: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.medium,
    color: Colors.gray,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: Typography.sizes.sm,
    color: Colors.lightGray,
    marginTop: Spacing.xs,
    textAlign: 'center',
    maxWidth: '80%',
  },
  alertCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
  },
  unreadAlert: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  alertHeaderLeft: {
    flex: 1,
  },
  alertTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  alertMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agentTypeBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
  },
  agentTypeText: {
    color: Colors.white,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
  },
  alertTime: {
    fontSize: Typography.sizes.xs,
    color: Colors.gray,
  },
  severityIcon: {
    fontSize: Typography.sizes.lg,
  },
  alertMessage: {
    fontSize: Typography.sizes.sm,
    color: Colors.darkGray,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  confidenceContainer: {
    marginBottom: Spacing.md,
  },
  confidenceLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray,
    marginBottom: Spacing.xs,
  },
  confidenceBar: {
    height: 6,
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.full,
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  alertActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginLeft: Spacing.md,
  },
  actionText: {
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
    fontWeight: Typography.weights.medium,
  },
});

export default AIAlertsScreen;