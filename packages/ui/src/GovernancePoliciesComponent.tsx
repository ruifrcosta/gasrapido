// @ts-nocheck
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import { Card, Button, Modal, Checkbox, Dropdown } from './components/common';

interface Policy {
  id: string;
  title: string;
  description: string;
  category: 'security' | 'privacy' | 'compliance' | 'operations' | 'financial';
  version: string;
  effectiveDate: string;
  lastUpdated: string;
  approvedBy: string;
  status: 'active' | 'draft' | 'deprecated';
  content: string;
}

interface PolicyApproval {
  id: string;
  policyId: string;
  userId: string;
  approvedAt: string;
  signature: string;
}

const GovernancePoliciesComponent: React.FC = () => {
  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: 'pol-001',
      title: 'Política de Segurança da Informação',
      description: 'Diretrizes para proteção de dados sensíveis e segurança cibernética',
      category: 'security',
      version: '2.1',
      effectiveDate: '2023-01-15',
      lastUpdated: '2023-06-20',
      approvedBy: 'CTO',
      status: 'active',
      content: 'Esta política estabelece os requisitos para proteção de informações...'
    },
    {
      id: 'pol-002',
      title: 'Política de Privacidade de Dados',
      description: 'Regras para coleta, uso e proteção de dados pessoais dos usuários',
      category: 'privacy',
      version: '1.5',
      effectiveDate: '2023-03-10',
      lastUpdated: '2023-07-05',
      approvedBy: 'DPO',
      status: 'active',
      content: 'Esta política descreve como coletamos, usamos e protegemos dados pessoais...'
    },
    {
      id: 'pol-003',
      title: 'Política de Compliance Regulatório',
      description: 'Requisitos para conformidade com regulamentações locais e internacionais',
      category: 'compliance',
      version: '3.0',
      effectiveDate: '2023-02-28',
      lastUpdated: '2023-08-12',
      approvedBy: 'Legal',
      status: 'active',
      content: 'Esta política garante conformidade com todas as regulamentações aplicáveis...'
    },
    {
      id: 'pol-004',
      title: 'Política de Operações',
      description: 'Procedimentos padrão para operações diárias e gestão de incidentes',
      category: 'operations',
      version: '1.2',
      effectiveDate: '2023-04-05',
      lastUpdated: '2023-09-01',
      approvedBy: 'COO',
      status: 'active',
      content: 'Esta política define os procedimentos operacionais padrão...'
    }
  ]);

  const [approvals, setApprovals] = useState<PolicyApproval[]>([
    {
      id: 'app-001',
      policyId: 'pol-001',
      userId: 'admin-123',
      approvedAt: '2023-06-20T10:30:00Z',
      signature: 'Digital Signature'
    }
  ]);

  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [acknowledgedPolicies, setAcknowledgedPolicies] = useState<string[]>([]);

  const [newPolicy, setNewPolicy] = useState<Omit<Policy, 'id' | 'version' | 'effectiveDate' | 'lastUpdated' | 'status'>>({
    title: '',
    description: '',
    category: 'operations',
    approvedBy: '',
    content: ''
  });

  const getCategoryColor = (category: Policy['category']) => {
    switch (category) {
      case 'security': return '#dc3545';
      case 'privacy': return '#28a745';
      case 'compliance': return '#ffc107';
      case 'operations': return '#007bff';
      case 'financial': return '#6f42c1';
      default: return '#6c757d';
    }
  };

  const getCategoryLabel = (category: Policy['category']) => {
    switch (category) {
      case 'security': return 'Segurança';
      case 'privacy': return 'Privacidade';
      case 'compliance': return 'Compliance';
      case 'operations': return 'Operações';
      case 'financial': return 'Financeiro';
      default: return category;
    }
  };

  const getStatusColor = (status: Policy['status']) => {
    switch (status) {
      case 'active': return '#28a745';
      case 'draft': return '#6c757d';
      case 'deprecated': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const handleViewPolicy = (policy: Policy) => {
    setSelectedPolicy(policy);
    setShowPolicyModal(true);
  };

  const handleCreatePolicy = () => {
    const policy: Policy = {
      ...newPolicy,
      id: `pol-${Date.now()}`,
      version: '1.0',
      effectiveDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      status: 'draft'
    };
    
    setPolicies([...policies, policy]);
    setShowCreateModal(false);
    setNewPolicy({
      title: '',
      description: '',
      category: 'operations',
      approvedBy: '',
      content: ''
    });
    Alert.alert('Sucesso', 'Política criada com sucesso');
  };

  const handleAcknowledgePolicy = (policyId: string) => {
    if (!acknowledgedPolicies.includes(policyId)) {
      setAcknowledgedPolicies([...acknowledgedPolicies, policyId]);
      Alert.alert('Sucesso', 'Política reconhecida com sucesso');
    }
  };

  const isPolicyAcknowledged = (policyId: string) => {
    return acknowledgedPolicies.includes(policyId);
  };

  const filteredPolicies = policies.filter(policy => policy.status === 'active');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Políticas de Governança</Text>
      
      <View style={styles.actionsContainer}>
        <Button 
          variant="primary" 
          size="md" 
          onPress={() => setShowCreateModal(true)}
          style={styles.actionButton}
        >
          Criar Nova Política
        </Button>
        
        <Button 
          variant="secondary" 
          size="md" 
          onPress={() => {}}
          style={styles.actionButton}
        >
          Histórico de Alterações
        </Button>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Políticas Ativas</Text>
        {filteredPolicies.map((policy) => (
          <Card key={policy.id} style={styles.policyCard}>
            <View style={styles.policyHeader}>
              <View style={styles.policyInfo}>
                <Text style={styles.policyTitle}>{policy.title}</Text>
                <Text style={styles.policyDescription}>{policy.description}</Text>
              </View>
              <View style={styles.policyTags}>
                <Text style={[styles.categoryTag, { backgroundColor: getCategoryColor(policy.category) }]}>
                  {getCategoryLabel(policy.category)}
                </Text>
                <Text style={[styles.statusTag, { color: getStatusColor(policy.status) }]}>
                  {policy.status.toUpperCase()}
                </Text>
              </View>
            </View>
            
            <View style={styles.policyMeta}>
              <Text style={styles.metaText}>Versão {policy.version}</Text>
              <Text style={styles.metaText}>Atualizado em {new Date(policy.lastUpdated).toLocaleDateString()}</Text>
              <Text style={styles.metaText}>Aprovado por {policy.approvedBy}</Text>
            </View>
            
            <View style={styles.policyActions}>
              <Button 
                variant="outline" 
                size="sm" 
                onPress={() => handleViewPolicy(policy)}
                style={styles.actionButtonSmall}
              >
                Ver Detalhes
              </Button>
              
              {!isPolicyAcknowledged(policy.id) && (
                <Button 
                  variant="primary" 
                  size="sm" 
                  onPress={() => handleAcknowledgePolicy(policy.id)}
                  style={styles.actionButtonSmall}
                >
                  Reconhecer
                </Button>
              )}
            </View>
            
            {isPolicyAcknowledged(policy.id) && (
              <View style={styles.acknowledgment}>
                <Text style={styles.acknowledgmentText}>✓ Política reconhecida</Text>
              </View>
            )}
          </Card>
        ))}
      </View>

      {/* Modal para visualizar política */}
      <Modal
        visible={showPolicyModal && selectedPolicy !== null}
        onClose={() => setShowPolicyModal(false)}
        title={selectedPolicy?.title || ''}
        size="lg"
      >
        {selectedPolicy && (
          <ScrollView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalDescription}>{selectedPolicy.description}</Text>
              <View style={styles.modalTags}>
                <Text style={[styles.categoryTag, { backgroundColor: getCategoryColor(selectedPolicy.category) }]}>
                  {getCategoryLabel(selectedPolicy.category)}
                </Text>
                <Text style={[styles.statusTag, { color: getStatusColor(selectedPolicy.status) }]}>
                  {selectedPolicy.status.toUpperCase()}
                </Text>
              </View>
            </View>
            
            <View style={styles.modalMeta}>
              <Text><Text style={styles.metaLabel}>Versão:</Text> {selectedPolicy.version}</Text>
              <Text><Text style={styles.metaLabel}>Efetiva desde:</Text> {new Date(selectedPolicy.effectiveDate).toLocaleDateString()}</Text>
              <Text><Text style={styles.metaLabel}>Última atualização:</Text> {new Date(selectedPolicy.lastUpdated).toLocaleDateString()}</Text>
              <Text><Text style={styles.metaLabel}>Aprovado por:</Text> {selectedPolicy.approvedBy}</Text>
            </View>
            
            <View style={styles.modalContentSection}>
              <Text style={styles.contentTitle}>Conteúdo da Política</Text>
              <Text style={styles.policyContent}>{selectedPolicy.content}</Text>
            </View>
            
            <View style={styles.modalActions}>
              <Button 
                variant="primary" 
                size="md" 
                onPress={() => handleAcknowledgePolicy(selectedPolicy.id)}
                disabled={isPolicyAcknowledged(selectedPolicy.id)}
              >
                {isPolicyAcknowledged(selectedPolicy.id) ? 'Política Reconhecida' : 'Reconhecer Política'}
              </Button>
            </View>
          </ScrollView>
        )}
      </Modal>

      {/* Modal para criar política */}
      <Modal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Criar Nova Política"
        size="lg"
      >
        <ScrollView style={styles.modalContent}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Título</Text>
            <TextInput
              style={styles.input}
              value={newPolicy.title}
              onChangeText={(text) => setNewPolicy({...newPolicy, title: text})}
              placeholder="Título da política"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newPolicy.description}
              onChangeText={(text) => setNewPolicy({...newPolicy, description: text})}
              placeholder="Breve descrição"
              multiline
              numberOfLines={3}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Categoria</Text>
            <Dropdown
              options={[
                { value: 'security', label: 'Segurança' },
                { value: 'privacy', label: 'Privacidade' },
                { value: 'compliance', label: 'Compliance' },
                { value: 'operations', label: 'Operações' },
                { value: 'financial', label: 'Financeiro' }
              ]}
              value={newPolicy.category}
              onChange={(value) => setNewPolicy({...newPolicy, category: value as any})}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Aprovado por</Text>
            <TextInput
              style={styles.input}
              value={newPolicy.approvedBy}
              onChangeText={(text) => setNewPolicy({...newPolicy, approvedBy: text})}
              placeholder="Nome do aprovador"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Conteúdo</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newPolicy.content}
              onChangeText={(text) => setNewPolicy({...newPolicy, content: text})}
              placeholder="Conteúdo completo da política"
              multiline
              numberOfLines={8}
            />
          </View>
          
          <View style={styles.modalActions}>
            <Button 
              variant="primary" 
              size="md" 
              onPress={handleCreatePolicy}
            >
              Criar Política
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </ScrollView>
  );
};

// Note: TextInput component is not imported, but we're using it in the form
// In a real implementation, we would import it from react-native

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
  policyCard: {
    marginBottom: 12,
    padding: 16,
  },
  policyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  policyInfo: {
    flex: 1,
  },
  policyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#007AFF',
  },
  policyDescription: {
    fontSize: 14,
    color: '#666',
  },
  policyTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  statusTag: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  policyMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  policyActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButtonSmall: {
    minWidth: 120,
  },
  acknowledgment: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#d4edda',
    borderRadius: 4,
  },
  acknowledgmentText: {
    color: '#155724',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContent: {
    padding: 16,
  },
  modalHeader: {
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 12,
    color: '#666',
  },
  modalTags: {
    flexDirection: 'row',
    gap: 8,
  },
  modalMeta: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  metaLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  modalContentSection: {
    marginBottom: 16,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  policyContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
  },
  modalActions: {
    marginTop: 16,
    alignItems: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default GovernancePoliciesComponent;