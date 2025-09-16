// @ts-nocheck
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Switch, Platform } from 'react-native';
import { Card, Button, Modal, Dropdown, Toggle } from './components/common';

interface OverrideRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  conditions: string[];
  actions: string[];
  createdBy: string;
  createdAt: string;
}

interface ManualOverride {
  id: string;
  ruleId: string;
  reason: string;
  userId: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface AdminOverrideControlsComponentProps {
  userId: string;
  onOverrideApplied?: (override: ManualOverride) => void;
  onPolicyUpdated?: (policy: OverrideRule) => void;
}

const AdminOverrideControlsComponent: React.FC<AdminOverrideControlsComponentProps> = ({
  userId,
  onOverrideApplied,
  onPolicyUpdated
}) => {
  const [rules, setRules] = useState<OverrideRule[]>([
    {
      id: 'rule-1',
      name: 'Preço Emergencial',
      description: 'Permitir aprovação manual de pedidos com preços acima do limite automático',
      enabled: true,
      conditions: ['preco > limite', 'cliente.prioritario == true'],
      actions: ['aprovar_pedido', 'notificar_equipe'],
      createdBy: 'admin-1',
      createdAt: '2023-05-15T10:30:00Z'
    },
    {
      id: 'rule-2',
      name: 'SLA Excepcional',
      description: 'Permitir extensão de SLA em situações de emergência',
      enabled: false,
      conditions: ['situacao == emergencia', 'area.afetada == true'],
      actions: ['estender_sla', 'notificar_cliente'],
      createdBy: 'admin-1',
      createdAt: '2023-05-16T14:22:00Z'
    }
  ]);

  const [overrides, setOverrides] = useState<ManualOverride[]>([
    {
      id: 'override-1',
      ruleId: 'rule-1',
      reason: 'Cliente VIP com urgência crítica',
      userId: 'user-123',
      timestamp: '2023-05-17T09:15:00Z',
      status: 'approved'
    }
  ]);

  const [showCreateRuleModal, setShowCreateRuleModal] = useState(false);
  const [showApplyOverrideModal, setShowApplyOverrideModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState<string>('');
  const [overrideReason, setOverrideReason] = useState<string>('');

  const [newRule, setNewRule] = useState<Omit<OverrideRule, 'id' | 'createdBy' | 'createdAt'>>({
    name: '',
    description: '',
    enabled: true,
    conditions: [],
    actions: []
  });

  const handleCreateRule = () => {
    const rule: OverrideRule = {
      ...newRule,
      id: `rule-${Date.now()}`,
      createdBy: userId,
      createdAt: new Date().toISOString()
    };
    
    setRules([...rules, rule]);
    onPolicyUpdated?.(rule);
    setShowCreateRuleModal(false);
    setNewRule({
      name: '',
      description: '',
      enabled: true,
      conditions: [],
      actions: []
    });
    Alert.alert('Sucesso', 'Regra de override criada com sucesso');
  };

  const handleApplyOverride = () => {
    if (!selectedRule || !overrideReason) {
      Alert.alert('Erro', 'Por favor, selecione uma regra e forneça um motivo');
      return;
    }

    const override: ManualOverride = {
      id: `override-${Date.now()}`,
      ruleId: selectedRule,
      reason: overrideReason,
      userId,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    setOverrides([override, ...overrides]);
    onOverrideApplied?.(override);
    setShowApplyOverrideModal(false);
    setSelectedRule('');
    setOverrideReason('');
    Alert.alert('Sucesso', 'Override aplicado com sucesso');
  };

  const toggleRuleStatus = (ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const getRuleName = (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    return rule ? rule.name : 'Regra Desconhecida';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'pending': return '#ffc107';
      default: return '#6c757d';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Controles de Override Administrativo</Text>
      
      <View style={styles.actionsContainer}>
        <Button 
          variant="primary" 
          size="md" 
          onPress={() => setShowCreateRuleModal(true)}
          style={styles.actionButton}
        >
          Criar Nova Regra
        </Button>
        
        <Button 
          variant="secondary" 
          size="md" 
          onPress={() => setShowApplyOverrideModal(true)}
          style={styles.actionButton}
        >
          Aplicar Override Manual
        </Button>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Regras de Override</Text>
        {rules.map((rule) => (
          <Card key={rule.id} style={styles.ruleCard}>
            <View style={styles.ruleHeader}>
              <View>
                <Text style={styles.ruleName}>{rule.name}</Text>
                <Text style={styles.ruleDescription}>{rule.description}</Text>
              </View>
              <Toggle
                checked={rule.enabled}
                onChange={() => toggleRuleStatus(rule.id)}
                label={rule.enabled ? 'Ativa' : 'Inativa'}
              />
            </View>
            
            <View style={styles.ruleDetails}>
              <Text style={styles.detailLabel}>Condições:</Text>
              <Text>{rule.conditions.join(', ') || 'Nenhuma'}</Text>
              
              <Text style={styles.detailLabel}>Ações:</Text>
              <Text>{rule.actions.join(', ') || 'Nenhuma'}</Text>
              
              <Text style={styles.detailLabel}>Criada por:</Text>
              <Text>{rule.createdBy} em {new Date(rule.createdAt).toLocaleDateString()}</Text>
            </View>
          </Card>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overrides Aplicados</Text>
        {overrides.map((override) => (
          <Card key={override.id} style={styles.overrideCard}>
            <View style={styles.overrideHeader}>
              <Text style={styles.overrideRuleName}>{getRuleName(override.ruleId)}</Text>
              <Text style={[styles.statusBadge, { color: getStatusColor(override.status) }]}>
                {override.status.toUpperCase()}
              </Text>
            </View>
            
            <Text style={styles.overrideReason}>Motivo: {override.reason}</Text>
            <Text style={styles.overrideUser}>Usuário: {override.userId}</Text>
            <Text style={styles.overrideDate}>
              {new Date(override.timestamp).toLocaleString()}
            </Text>
          </Card>
        ))}
      </View>

      {/* Modal para criar nova regra */}
      <Modal
        visible={showCreateRuleModal}
        onClose={() => setShowCreateRuleModal(false)}
        title="Criar Nova Regra de Override"
      >
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="Nome da Regra"
            value={newRule.name}
            onChangeText={(text) => setNewRule({...newRule, name: text})}
          />
          
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descrição"
            multiline
            numberOfLines={3}
            value={newRule.description}
            onChangeText={(text) => setNewRule({...newRule, description: text})}
          />
          
          <View style={styles.switchContainer}>
            <Text>Regra Ativa</Text>
            <Switch
              value={newRule.enabled}
              onValueChange={(value) => setNewRule({...newRule, enabled: value})}
            />
          </View>
          
          <Button 
            variant="primary" 
            size="md" 
            onPress={handleCreateRule}
            style={styles.modalButton}
          >
            Criar Regra
          </Button>
        </View>
      </Modal>

      {/* Modal para aplicar override */}
      <Modal
        visible={showApplyOverrideModal}
        onClose={() => setShowApplyOverrideModal(false)}
        title="Aplicar Override Manual"
      >
        <View style={styles.modalContent}>
          <Dropdown
            options={rules.filter(r => r.enabled).map(rule => ({
              value: rule.id,
              label: rule.name
            }))}
            value={selectedRule}
            onChange={setSelectedRule}
            placeholder="Selecione uma regra"
          />
          
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Motivo para o override"
            multiline
            numberOfLines={4}
            value={overrideReason}
            onChangeText={setOverrideReason}
          />
          
          <Button 
            variant="primary" 
            size="md" 
            onPress={handleApplyOverride}
            style={styles.modalButton}
          >
            Aplicar Override
          </Button>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  actionButton: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  ruleCard: {
    marginBottom: 12,
    padding: 16,
  },
  ruleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ruleName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#007AFF',
  },
  ruleDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ruleDetails: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
  },
  detailLabel: {
    fontWeight: 'bold',
    marginTop: 8,
    color: '#333',
  },
  overrideCard: {
    marginBottom: 12,
    padding: 16,
  },
  overrideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  overrideRuleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  overrideReason: {
    fontSize: 14,
    marginBottom: 4,
    color: '#555',
  },
  overrideUser: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  overrideDate: {
    fontSize: 12,
    color: '#888',
  },
  modalContent: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: 'white',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      }
    })
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalButton: {
    marginTop: 8,
  },
});

export default AdminOverrideControlsComponent;