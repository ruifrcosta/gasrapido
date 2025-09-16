import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { Ticket, TicketCategory, TicketPriority, TicketStatus, TicketFilter } from '@gasrapido/shared/services/ticketingService';
import { ticketingService } from '@gasrapido/shared/services/ticketingService';

interface TicketingManagementComponentProps {
  userId: string;
  onTicketCreated?: (ticket: Ticket) => void;
  onTicketUpdated?: (ticket: Ticket) => void;
}

export const TicketingManagementComponent: React.FC<TicketingManagementComponentProps> = ({
  userId,
  onTicketCreated,
  onTicketUpdated
}) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<TicketFilter>({});
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'other' as TicketCategory,
    priority: 'medium' as TicketPriority
  });

  // Carregar tickets ao montar o componente
  useEffect(() => {
    loadTickets();
  }, []);

  // Aplicar filtros quando mudarem
  useEffect(() => {
    applyFilters();
  }, [tickets, filter]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const fetchedTickets = await ticketingService.listTickets();
      setTickets(fetchedTickets);
    } catch (error) {
      console.error('Erro ao carregar tickets:', error);
      Alert.alert('Erro', 'Não foi possível carregar os tickets');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tickets];
    
    if (filter.category) {
      filtered = filtered.filter(ticket => ticket.category === filter.category);
    }
    
    if (filter.priority) {
      filtered = filtered.filter(ticket => ticket.priority === filter.priority);
    }
    
    if (filter.status) {
      filtered = filtered.filter(ticket => ticket.status === filter.status);
    }
    
    setFilteredTickets(filtered);
  };

  const handleCreateTicket = async () => {
    if (!newTicket.title || !newTicket.description) {
      Alert.alert('Erro', 'Título e descrição são obrigatórios');
      return;
    }

    try {
      const ticketData = {
        ...newTicket,
        created_by: userId
      };

      const createdTicket = await ticketingService.createTicket(ticketData);
      
      if (createdTicket) {
        setTickets([createdTicket, ...tickets]);
        setNewTicket({
          title: '',
          description: '',
          category: 'other',
          priority: 'medium'
        });
        setShowCreateForm(false);
        onTicketCreated?.(createdTicket);
        Alert.alert('Sucesso', 'Ticket criado com sucesso!');
      } else {
        Alert.alert('Erro', 'Não foi possível criar o ticket');
      }
    } catch (error) {
      console.error('Erro ao criar ticket:', error);
      Alert.alert('Erro', 'Não foi possível criar o ticket');
    }
  };

  const handleUpdateTicket = async (ticketId: string, status: TicketStatus) => {
    try {
      const updatedTicket = await ticketingService.updateTicket({
        id: ticketId,
        status
      });
      
      if (updatedTicket) {
        const updatedTickets = tickets.map(ticket => 
          ticket.id === ticketId ? updatedTicket : ticket
        );
        setTickets(updatedTickets);
        onTicketUpdated?.(updatedTicket);
        Alert.alert('Sucesso', 'Ticket atualizado com sucesso!');
      } else {
        Alert.alert('Erro', 'Não foi possível atualizar o ticket');
      }
    } catch (error) {
      console.error('Erro ao atualizar ticket:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o ticket');
    }
  };

  const handleCloseTicket = async (ticketId: string, resolutionNotes: string) => {
    try {
      const success = await ticketingService.closeTicket(ticketId, resolutionNotes);
      
      if (success) {
        const updatedTickets = tickets.map(ticket => 
          ticket.id === ticketId 
            ? { ...ticket, status: 'closed', resolution_notes: resolutionNotes } 
            : ticket
        );
        setTickets(updatedTickets);
        Alert.alert('Sucesso', 'Ticket fechado com sucesso!');
      } else {
        Alert.alert('Erro', 'Não foi possível fechar o ticket');
      }
    } catch (error) {
      console.error('Erro ao fechar ticket:', error);
      Alert.alert('Erro', 'Não foi possível fechar o ticket');
    }
  };

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case 'low': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'high': return '#F44336';
      case 'urgent': return '#D32F2F';
      default: return '#9E9E9E';
    }
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'open': return '#2196F3';
      case 'in_progress': return '#FF9800';
      case 'resolved': return '#4CAF50';
      case 'closed': return '#9E9E9E';
      case 'escalated': return '#D32F2F';
      default: return '#9E9E9E';
    }
  };

  const getCategoryLabel = (category: TicketCategory) => {
    const labels: Record<TicketCategory, string> = {
      technical: 'Técnico',
      billing: 'Cobrança',
      account: 'Conta',
      order: 'Pedido',
      delivery: 'Entrega',
      feature_request: 'Recurso',
      complaint: 'Reclamação',
      other: 'Outro'
    };
    return labels[category] || category;
  };

  const getStatusLabel = (status: TicketStatus) => {
    const labels: Record<TicketStatus, string> = {
      open: 'Aberto',
      in_progress: 'Em Progresso',
      resolved: 'Resolvido',
      closed: 'Fechado',
      escalated: 'Escalado'
    };
    return labels[status] || status;
  };

  const getPriorityLabel = (priority: TicketPriority) => {
    const labels: Record<TicketPriority, string> = {
      low: 'Baixa',
      medium: 'Média',
      high: 'Alta',
      urgent: 'Urgente'
    };
    return labels[priority] || priority;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestão de Tickets</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => setShowCreateForm(!showCreateForm)}
        >
          <Text style={styles.createButtonText}>
            {showCreateForm ? 'Cancelar' : 'Novo Ticket'}
          </Text>
        </TouchableOpacity>
      </View>

      {showCreateForm && (
        <View style={styles.createForm}>
          <Text style={styles.formTitle}>Criar Novo Ticket</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Título do ticket"
            value={newTicket.title}
            onChangeText={(text) => setNewTicket({...newTicket, title: text})}
          />
          
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descrição detalhada"
            multiline
            numberOfLines={4}
            value={newTicket.description}
            onChangeText={(text) => setNewTicket({...newTicket, description: text})}
          />
          
          <View style={styles.selectContainer}>
            <Text style={styles.selectLabel}>Categoria:</Text>
            <View style={styles.select}>
              {(['technical', 'billing', 'account', 'order', 'delivery', 'feature_request', 'complaint', 'other'] as TicketCategory[]).map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.selectOption,
                    newTicket.category === category && styles.selectOptionSelected
                  ]}
                  onPress={() => setNewTicket({...newTicket, category})}
                >
                  <Text style={[
                    styles.selectOptionText,
                    newTicket.category === category && styles.selectOptionTextSelected
                  ]}>
                    {getCategoryLabel(category)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.selectContainer}>
            <Text style={styles.selectLabel}>Prioridade:</Text>
            <View style={styles.select}>
              {(['low', 'medium', 'high', 'urgent'] as TicketPriority[]).map(priority => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.selectOption,
                    newTicket.priority === priority && styles.selectOptionSelected
                  ]}
                  onPress={() => setNewTicket({...newTicket, priority})}
                >
                  <Text style={[
                    styles.selectOptionText,
                    newTicket.priority === priority && styles.selectOptionTextSelected
                  ]}>
                    {getPriorityLabel(priority)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <TouchableOpacity style={styles.submitButton} onPress={handleCreateTicket}>
            <Text style={styles.submitButtonText}>Criar Ticket</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.filters}>
        <Text style={styles.filterTitle}>Filtros</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterOptions}>
            <TouchableOpacity 
              style={[styles.filterOption, !filter.category && styles.filterOptionActive]}
              onPress={() => setFilter({...filter, category: undefined})}
            >
              <Text style={[styles.filterOptionText, !filter.category && styles.filterOptionTextActive]}>
                Todas Categorias
              </Text>
            </TouchableOpacity>
            
            {(['technical', 'billing', 'account', 'order', 'delivery', 'feature_request', 'complaint', 'other'] as TicketCategory[]).map(category => (
              <TouchableOpacity
                key={category}
                style={[styles.filterOption, filter.category === category && styles.filterOptionActive]}
                onPress={() => setFilter({...filter, category})}
              >
                <Text style={[styles.filterOptionText, filter.category === category && styles.filterOptionTextActive]}>
                  {getCategoryLabel(category)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Carregando tickets...</Text>
        </View>
      ) : (
        <ScrollView style={styles.ticketsList}>
          {filteredTickets.map(ticket => (
            <View key={ticket.id} style={styles.ticketCard}>
              <View style={styles.ticketHeader}>
                <Text style={styles.ticketTitle}>{ticket.title}</Text>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(ticket.priority) }]}>
                  <Text style={styles.priorityText}>{getPriorityLabel(ticket.priority)}</Text>
                </View>
              </View>
              
              <Text style={styles.ticketDescription} numberOfLines={2}>
                {ticket.description}
              </Text>
              
              <View style={styles.ticketMeta}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Categoria:</Text>
                  <Text style={styles.metaValue}>{getCategoryLabel(ticket.category)}</Text>
                </View>
                
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Status:</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.status) }]}>
                    <Text style={styles.statusText}>{getStatusLabel(ticket.status)}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.ticketActions}>
                {ticket.status === 'open' && (
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.inProgressButton]}
                    onPress={() => handleUpdateTicket(ticket.id, 'in_progress')}
                  >
                    <Text style={styles.actionButtonText}>Em Progresso</Text>
                  </TouchableOpacity>
                )}
                
                {ticket.status === 'in_progress' && (
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.resolveButton]}
                    onPress={() => handleUpdateTicket(ticket.id, 'resolved')}
                  >
                    <Text style={styles.actionButtonText}>Resolver</Text>
                  </TouchableOpacity>
                )}
                
                {(ticket.status === 'open' || ticket.status === 'in_progress') && (
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.closeButton]}
                    onPress={() => {
                      const notes = prompt('Notas de resolução:');
                      if (notes !== null) {
                        handleCloseTicket(ticket.id, notes);
                      }
                    }}
                  >
                    <Text style={styles.actionButtonText}>Fechar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
          
          {filteredTickets.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Nenhum ticket encontrado</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8
  },
  createButtonText: {
    color: 'white',
    fontWeight: '600'
  },
  createForm: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  selectContainer: {
    marginBottom: 12
  },
  selectLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333'
  },
  select: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  selectOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0'
  },
  selectOptionSelected: {
    backgroundColor: '#007AFF'
  },
  selectOptionText: {
    color: '#666'
  },
  selectOptionTextSelected: {
    color: 'white'
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16
  },
  filters: {
    marginBottom: 16
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333'
  },
  filterOptions: {
    flexDirection: 'row',
    gap: 8
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e0e0e0'
  },
  filterOptionActive: {
    backgroundColor: '#007AFF'
  },
  filterOptionText: {
    color: '#666'
  },
  filterOptionTextActive: {
    color: 'white'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  ticketsList: {
    flex: 1
  },
  ticketCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    color: '#333'
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  priorityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600'
  },
  ticketDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12
  },
  ticketMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  metaLabel: {
    fontSize: 12,
    color: '#999'
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333'
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600'
  },
  ticketActions: {
    flexDirection: 'row',
    gap: 8
  },
  actionButton: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    alignItems: 'center'
  },
  inProgressButton: {
    backgroundColor: '#FF9800'
  },
  resolveButton: {
    backgroundColor: '#4CAF50'
  },
  closeButton: {
    backgroundColor: '#9E9E9E'
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999'
  }
});