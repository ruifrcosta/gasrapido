// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Switch, ActivityIndicator } from 'react-native';

// Interfaces para tipagem
interface AIAgent {
  id: string;
  name: string;
  type: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  lastActiveAt: Date;
}

interface AgentTask {
  id: string;
  agentId: string;
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  input: any;
  output: any;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

interface AIAgentsManagementComponentProps {
  aiAgentsService: any; // Em implementação real, tipar corretamente
  onAgentTaskExecute?: (agentId: string, taskData: any) => void;
}

export const AIAgentsManagementComponent: React.FC<AIAgentsManagementComponentProps> = ({
  aiAgentsService,
  onAgentTaskExecute
}) => {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [taskInput, setTaskInput] = useState<string>('');
  const [executingTask, setExecutingTask] = useState<boolean>(false);

  // Carregar agentes e tarefas ao montar o componente
  useEffect(() => {
    loadAgents();
  }, []);

  // Carregar agentes
  const loadAgents = async () => {
    try {
      setLoading(true);
      // Em implementação real, chamar o serviço
      const agentsData = aiAgentsService.getAgents();
      setAgents(agentsData);
    } catch (error) {
      console.error('Erro ao carregar agentes:', error);
      Alert.alert('Erro', 'Falha ao carregar agentes de IA');
    } finally {
      setLoading(false);
    }
  };

  // Alternar status do agente
  const toggleAgentStatus = async (agentId: string, currentStatus: boolean) => {
    try {
      // Em implementação real, chamar o serviço
      const success = aiAgentsService.updateAgentStatus(agentId, !currentStatus);
      if (success) {
        setAgents(agents.map(agent => 
          agent.id === agentId 
            ? { ...agent, isActive: !currentStatus, lastActiveAt: new Date() } 
            : agent
        ));
        Alert.alert('Sucesso', `Agente ${!currentStatus ? 'ativado' : 'desativado'} com sucesso`);
      } else {
        Alert.alert('Erro', 'Falha ao atualizar status do agente');
      }
    } catch (error) {
      console.error('Erro ao alternar status do agente:', error);
      Alert.alert('Erro', 'Falha ao atualizar status do agente');
    }
  };

  // Executar tarefa no agente
  const executeAgentTask = async () => {
    if (!selectedAgent || !taskInput) {
      Alert.alert('Erro', 'Por favor, selecione um agente e insira os dados da tarefa');
      return;
    }

    if (!selectedAgent.isActive) {
      Alert.alert('Erro', 'O agente selecionado não está ativo');
      return;
    }

    try {
      setExecutingTask(true);
      
      // Em implementação real, chamar o serviço
      const taskId = `task-${Date.now()}`;
      const taskData = { text: taskInput }; // Simplificação para exemplo
      
      if (onAgentTaskExecute) {
        onAgentTaskExecute(selectedAgent.id, taskData);
      }
      
      Alert.alert('Sucesso', 'Tarefa enviada para o agente de IA');
      setTaskInput('');
    } catch (error) {
      console.error('Erro ao executar tarefa:', error);
      Alert.alert('Erro', 'Falha ao executar tarefa no agente de IA');
    } finally {
      setExecutingTask(false);
    }
  };

  // Obter cor baseada no tipo de agente
  const getAgentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'deepseek': '#FF6B6B',
      'customer_support': '#4ECDC4',
      'backoffice': '#45B7D1',
      'user_assist': '#96CEB4',
      'ticket_classifier': '#FFEAA7',
      'fraud_detector': '#DDA0DD',
      'maintenance_predictor': '#98D8C8'
    };
    return colors[type] || '#95A5A6';
  };

  // Obter rótulo amigável para o tipo de agente
  const getAgentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'deepseek': 'DeepSeek AI',
      'customer_support': 'Suporte ao Cliente',
      'backoffice': 'Backoffice',
      'user_assist': 'Assistente do Usuário',
      'ticket_classifier': 'Classificador de Tickets',
      'fraud_detector': 'Detector de Fraudes',
      'maintenance_predictor': 'Preditor de Manutenção'
    };
    return labels[type] || type;
  };

  // Renderizar cartão de agente
  const renderAgentCard = (agent: AIAgent) => (
    <View 
      key={agent.id} 
      style={[
        styles.agentCard, 
        selectedAgent?.id === agent.id && styles.selectedAgentCard
      ]}
      onTouchEnd={() => setSelectedAgent(agent)}
    >
      <View style={styles.agentHeader}>
        <View style={[styles.agentTypeBadge, { backgroundColor: getAgentTypeColor(agent.type) }]}>
          <Text style={styles.agentTypeText}>{getAgentTypeLabel(agent.type)}</Text>
        </View>
        <Switch
          value={agent.isActive}
          onValueChange={() => toggleAgentStatus(agent.id, agent.isActive)}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={agent.isActive ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>
      
      <Text style={styles.agentName}>{agent.name}</Text>
      <Text style={styles.agentDescription}>{agent.description}</Text>
      
      <View style={styles.agentFooter}>
        <Text style={styles.agentStatus}>
          {agent.isActive ? 'Ativo' : 'Inativo'}
        </Text>
        <Text style={styles.agentLastActive}>
          Última atividade: {new Date(agent.lastActiveAt).toLocaleString()}
        </Text>
      </View>
    </View>
  );

  // Renderizar cartão de tarefa
  const renderTaskCard = (task: AgentTask) => (
    <View key={task.id} style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskId}>Tarefa: {task.taskId}</Text>
        <View style={[
          styles.taskStatusBadge, 
          { backgroundColor: getTaskStatusColor(task.status) }
        ]}>
          <Text style={styles.taskStatusText}>
            {getTaskStatusLabel(task.status)}
          </Text>
        </View>
      </View>
      
      <Text style={styles.taskInput} numberOfLines={2}>
        Input: {JSON.stringify(task.input)}
      </Text>
      
      {task.output && (
        <Text style={styles.taskOutput} numberOfLines={2}>
          Output: {JSON.stringify(task.output)}
        </Text>
      )}
      
      {task.error && (
        <Text style={styles.taskError}>Erro: {task.error}</Text>
      )}
      
      <Text style={styles.taskDate}>
        Criada em: {new Date(task.createdAt).toLocaleString()}
      </Text>
      
      {task.completedAt && (
        <Text style={styles.taskDate}>
          Concluída em: {new Date(task.completedAt).toLocaleString()}
        </Text>
      )}
    </View>
  );

  // Obter cor para status da tarefa
  const getTaskStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': '#FFA500',
      'processing': '#1E90FF',
      'completed': '#32CD32',
      'failed': '#FF0000'
    };
    return colors[status] || '#95A5A6';
  };

  // Obter rótulo para status da tarefa
  const getTaskStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'pending': 'Pendente',
      'processing': 'Processando',
      'completed': 'Concluída',
      'failed': 'Falhou'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1F3A93" />
        <Text style={styles.loadingText}>Carregando agentes de IA...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gestão de Agentes de IA</Text>
      
      {/* Seção de Agentes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Agentes Disponíveis</Text>
        {agents.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum agente encontrado</Text>
        ) : (
          <View style={styles.agentsGrid}>
            {agents.map(renderAgentCard)}
          </View>
        )}
      </View>

      {/* Seção de Execução de Tarefas */}
      {selectedAgent && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executar Tarefa no Agente</Text>
          <Text style={styles.selectedAgentInfo}>
            Agente selecionado: {selectedAgent.name} ({getAgentTypeLabel(selectedAgent.type)})
          </Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dados da Tarefa</Text>
            <TextInput
              style={styles.textInput}
              value={taskInput}
              onChangeText={setTaskInput}
              placeholder="Insira os dados para a tarefa do agente"
              multiline
              numberOfLines={4}
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.executeButton, executingTask && styles.executeButtonDisabled]}
            onPress={executeAgentTask}
            disabled={executingTask}
          >
            {executingTask ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.executeButtonText}>Executar Tarefa</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Seção de Histórico de Tarefas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Histórico de Tarefas</Text>
        {tasks.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma tarefa encontrada</Text>
        ) : (
          <View style={styles.tasksList}>
            {tasks.map(renderTaskCard)}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333'
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333'
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: 20
  },
  agentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  agentCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  selectedAgentCard: {
    borderColor: '#1F3A93',
    backgroundColor: '#f0f4ff'
  },
  agentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  agentTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  agentTypeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold'
  },
  agentName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333'
  },
  agentDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8
  },
  agentFooter: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8
  },
  agentStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: '#28a745'
  },
  agentLastActive: {
    fontSize: 10,
    color: '#999',
    marginTop: 2
  },
  selectedAgentInfo: {
    fontSize: 14,
    color: '#1F3A93',
    fontWeight: '600',
    marginBottom: 12
  },
  inputGroup: {
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#555'
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 14,
    backgroundColor: 'white',
    textAlignVertical: 'top'
  },
  executeButton: {
    backgroundColor: '#1F3A93',
    borderRadius: 6,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  executeButtonDisabled: {
    backgroundColor: '#a0a0a0'
  },
  executeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  tasksList: {
    gap: 12
  },
  taskCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee'
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  taskId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  taskStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  taskStatusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold'
  },
  taskInput: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4
  },
  taskOutput: {
    fontSize: 12,
    color: '#28a745',
    marginBottom: 4
  },
  taskError: {
    fontSize: 12,
    color: '#dc3545',
    marginBottom: 4
  },
  taskDate: {
    fontSize: 10,
    color: '#999',
    marginTop: 2
  }
});