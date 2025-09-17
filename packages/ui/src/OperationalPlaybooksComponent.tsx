// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { OperationalPlaybooksService, Playbook, Incident } from '@gasrapido/shared';

interface OperationalPlaybooksComponentProps {
  playbooksService: OperationalPlaybooksService;
}

const OperationalPlaybooksComponent: React.FC<OperationalPlaybooksComponentProps> = ({ 
  playbooksService 
}) => {
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingIncidents, setLoadingIncidents] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'playbooks' | 'incidents' | 'create'>('playbooks');
  const [newIncident, setNewIncident] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    playbook_id: ''
  });

  useEffect(() => {
    fetchPlaybooks();
    fetchIncidents();
  }, []);

  const fetchPlaybooks = async () => {
    try {
      setLoading(true);
      const { playbooks: fetchedPlaybooks, error } = await playbooksService.getActivePlaybooks();
      
      if (error) throw error;
      
      setPlaybooks(fetchedPlaybooks);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar playbooks operacionais');
      console.error('Error fetching playbooks:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchIncidents = async () => {
    try {
      setLoadingIncidents(true);
      const { incidents: fetchedIncidents, error } = await playbooksService.getIncidentsByStatus('open');
      
      if (error) throw error;
      
      setIncidents(fetchedIncidents);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar incidentes');
      console.error('Error fetching incidents:', err);
    } finally {
      setLoadingIncidents(false);
    }
  };

  const handlePlaybookSelect = async (playbookId: string) => {
    try {
      const { playbook, error } = await playbooksService.getPlaybookWithSteps(playbookId);
      
      if (error) throw error;
      
      setSelectedPlaybook(playbook);
      setActiveTab('playbooks');
    } catch (err) {
      setError('Erro ao carregar detalhes do playbook');
      console.error('Error fetching playbook details:', err);
    }
  };

  const handleIncidentSelect = (incident: Incident) => {
    setSelectedIncident(incident);
    setActiveTab('incidents');
  };

  const handleCreateIncident = async () => {
    try {
      const { incident, error } = await playbooksService.createIncident({
        ...newIncident,
        status: 'open',
        reported_by: 'current-user-id', // This would be the actual user ID in a real app
        assigned_to: ''
      });
      
      if (error) throw error;
      
      if (incident) {
        setIncidents([incident, ...incidents]);
        setNewIncident({
          title: '',
          description: '',
          priority: 'medium',
          playbook_id: ''
        });
        setActiveTab('incidents');
      }
    } catch (err) {
      setError('Erro ao criar incidente');
      console.error('Error creating incident:', err);
    }
  };

  const handleUpdateIncidentStatus = async (incidentId: string, status: Incident['status']) => {
    try {
      const { success, error } = await playbooksService.updateIncidentStatus(incidentId, status);
      
      if (error) throw error;
      
      if (success) {
        // Refresh incidents
        fetchIncidents();
        
        // If we were viewing this incident, clear the selection
        if (selectedIncident && selectedIncident.id === incidentId) {
          setSelectedIncident(null);
        }
      }
    } catch (err) {
      setError('Erro ao atualizar status do incidente');
      console.error('Error updating incident status:', err);
    }
  };

  const getCategoryLabel = (category: Playbook['category']): string => {
    switch (category) {
      case 'cell_failure': return 'Falha de Célula';
      case 'price_spike': return 'Pico de Preço';
      case 'system_failure': return 'Falha do Sistema';
      case 'other': return 'Outro';
      default: return category;
    }
  };

  const getPriorityLabel = (priority: Incident['priority']): string => {
    switch (priority) {
      case 'low': return 'Baixa';
      case 'medium': return 'Média';
      case 'high': return 'Alta';
      case 'critical': return 'Crítica';
      default: return priority;
    }
  };

  const getStatusLabel = (status: Incident['status']): string => {
    switch (status) {
      case 'open': return 'Aberto';
      case 'in_progress': return 'Em Progresso';
      case 'resolved': return 'Resolvido';
      case 'closed': return 'Fechado';
      default: return status;
    }
  };

  const getPriorityColor = (priority: Incident['priority']): string => {
    switch (priority) {
      case 'low': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'high': return '#f44336';
      case 'critical': return '#d32f2f';
      default: return '#666';
    }
  };

  if (loading && loadingIncidents) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Carregando playbooks e incidentes...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Playbooks Operacionais</h2>
      
      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'playbooks' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('playbooks')}
        >
          Playbooks
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'incidents' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('incidents')}
        >
          Incidentes ({incidents.length})
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'create' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('create')}
        >
          Novo Incidente
        </button>
      </div>
      
      {error && (
        <div style={styles.error}>{error}</div>
      )}
      
      {/* Playbooks Tab */}
      {activeTab === 'playbooks' && (
        <div style={styles.tabContent}>
          {!selectedPlaybook ? (
            <div style={styles.playbookList}>
              <h3 style={styles.sectionTitle}>Playbooks Disponíveis</h3>
              <div style={styles.playbookGrid}>
                {playbooks.map(playbook => (
                  <div 
                    key={playbook.id}
                    style={styles.playbookCard}
                    onClick={() => handlePlaybookSelect(playbook.id)}
                  >
                    <div style={styles.playbookHeader}>
                      <h4 style={styles.playbookTitle}>{playbook.title}</h4>
                      <span style={{
                        ...styles.playbookCategory,
                        backgroundColor: getCategoryColor(playbook.category)
                      }}>
                        {getCategoryLabel(playbook.category)}
                      </span>
                    </div>
                    <p style={styles.playbookDescription}>{playbook.description}</p>
                    <div style={styles.playbookMeta}>
                      <span style={{
                        ...styles.playbookPriority,
                        backgroundColor: getPriorityColor(playbook.priority)
                      }}>
                        {getPriorityLabel(playbook.priority)}
                      </span>
                      <span style={styles.playbookSteps}>
                        {playbook.steps.length} passos
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={styles.playbookDetail}>
              <button 
                onClick={() => setSelectedPlaybook(null)}
                style={styles.backButton}
              >
                ← Voltar para lista
              </button>
              <h3 style={styles.sectionTitle}>{selectedPlaybook.title}</h3>
              <p style={styles.playbookDetailDescription}>{selectedPlaybook.description}</p>
              
              <div style={styles.playbookDetailMeta}>
                <span style={{
                  ...styles.playbookCategory,
                  backgroundColor: getCategoryColor(selectedPlaybook.category)
                }}>
                  {getCategoryLabel(selectedPlaybook.category)}
                </span>
                <span style={{
                  ...styles.playbookPriority,
                  backgroundColor: getPriorityColor(selectedPlaybook.priority)
                }}>
                  {getPriorityLabel(selectedPlaybook.priority)}
                </span>
              </div>
              
              <h4 style={styles.stepsTitle}>Passos do Playbook</h4>
              <div style={styles.stepsList}>
                {selectedPlaybook.steps.map((step, index) => (
                  <div key={step.id} style={styles.stepItem}>
                    <div style={styles.stepNumber}>{index + 1}</div>
                    <div style={styles.stepContent}>
                      <h5 style={styles.stepTitle}>{step.title}</h5>
                      <p style={styles.stepDescription}>{step.description}</p>
                      <div style={styles.stepDetails}>
                        <span style={styles.stepRole}>
                          Responsável: {step.responsible_role}
                        </span>
                        <span style={styles.stepTime}>
                          Tempo estimado: {step.estimated_time_minutes} min
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Incidents Tab */}
      {activeTab === 'incidents' && (
        <div style={styles.tabContent}>
          <h3 style={styles.sectionTitle}>Incidentes Ativos</h3>
          <div style={styles.incidentsList}>
            {incidents.length > 0 ? (
              incidents.map(incident => (
                <div 
                  key={incident.id}
                  style={{
                    ...styles.incidentItem,
                    ...(selectedIncident?.id === incident.id ? styles.selectedIncident : {})
                  }}
                  onClick={() => handleIncidentSelect(incident)}
                >
                  <div style={styles.incidentHeader}>
                    <h4 style={styles.incidentTitle}>{incident.title}</h4>
                    <span style={{
                      ...styles.incidentPriority,
                      backgroundColor: getPriorityColor(incident.priority)
                    }}>
                      {getPriorityLabel(incident.priority)}
                    </span>
                  </div>
                  <p style={styles.incidentDescription}>{incident.description}</p>
                  <div style={styles.incidentMeta}>
                    <span style={styles.incidentStatus}>
                      Status: {getStatusLabel(incident.status)}
                    </span>
                    <span style={styles.incidentDate}>
                      {new Date(incident.created_at).toLocaleDateString('pt-AO')}
                    </span>
                  </div>
                  
                  {selectedIncident?.id === incident.id && (
                    <div style={styles.incidentActions}>
                      {incident.status === 'open' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateIncidentStatus(incident.id, 'in_progress');
                          }}
                          style={{...styles.actionButton, ...styles.progressButton}}
                        >
                          Em Progresso
                        </button>
                      )}
                      {(incident.status === 'open' || incident.status === 'in_progress') && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateIncidentStatus(incident.id, 'resolved');
                          }}
                          style={{...styles.actionButton, ...styles.resolveButton}}
                        >
                          Resolvido
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateIncidentStatus(incident.id, 'closed');
                        }}
                        style={{...styles.actionButton, ...styles.closeButton}}
                      >
                        Fechar
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={styles.noIncidents}>
                Nenhum incidente ativo encontrado
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Create Incident Tab */}
      {activeTab === 'create' && (
        <div style={styles.tabContent}>
          <h3 style={styles.sectionTitle}>Criar Novo Incidente</h3>
          <div style={styles.createIncidentForm}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Título</label>
              <input
                type="text"
                value={newIncident.title}
                onChange={(e) => setNewIncident({...newIncident, title: e.target.value})}
                style={styles.formInput}
                placeholder="Descreva brevemente o incidente"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Descrição</label>
              <textarea
                value={newIncident.description}
                onChange={(e) => setNewIncident({...newIncident, description: e.target.value})}
                style={{...styles.formInput, height: '100px'}}
                placeholder="Descreva detalhadamente o incidente"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Prioridade</label>
              <select
                value={newIncident.priority}
                onChange={(e) => setNewIncident({...newIncident, priority: e.target.value as any})}
                style={styles.formInput}
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Playbook Relacionado (Opcional)</label>
              <select
                value={newIncident.playbook_id}
                onChange={(e) => setNewIncident({...newIncident, playbook_id: e.target.value})}
                style={styles.formInput}
              >
                <option value="">Selecione um playbook</option>
                {playbooks.map(playbook => (
                  <option key={playbook.id} value={playbook.id}>
                    {playbook.title}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleCreateIncident}
              style={styles.createButton}
              disabled={!newIncident.title || !newIncident.description}
            >
              Criar Incidente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions
const getCategoryColor = (category: Playbook['category']): string => {
  switch (category) {
    case 'cell_failure': return '#ef4444';
    case 'price_spike': return '#f59e0b';
    case 'system_failure': return '#8b5cf6';
    case 'other': return '#6b7280';
    default: return '#6b7280';
  }
};

const getPriorityColor = (priority: Incident['priority']): string => {
  switch (priority) {
    case 'low': return '#4caf50';
    case 'medium': return '#ff9800';
    case 'high': return '#f44336';
    case 'critical': return '#d32f2f';
    default: return '#666';
  }
};

// Styles
const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    minHeight: '100%',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  tabs: {
    display: 'flex',
    marginBottom: '20px',
    borderBottom: '1px solid #ddd',
  },
  tab: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#666',
  },
  activeTab: {
    borderBottom: '2px solid #1976d2',
    color: '#1976d2',
  },
  tabContent: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  loading: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#666',
  },
  error: {
    padding: '12px',
    backgroundColor: '#ffebee',
    color: '#d32f2f',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#333',
  },
  playbookList: {
  },
  playbookGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  playbookCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    cursor: 'pointer',
    transition: 'box-shadow 0.2s',
  },
  playbookCardHover: {
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  playbookHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
  },
  playbookTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    margin: 0,
    flex: 1,
  },
  playbookCategory: {
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    color: 'white',
  },
  playbookDescription: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '12px',
  },
  playbookMeta: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  playbookPriority: {
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    color: 'white',
  },
  playbookSteps: {
    fontSize: '12px',
    color: '#666',
  },
  backButton: {
    marginBottom: '16px',
    padding: '8px 16px',
    backgroundColor: '#f5f5f5',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  playbookDetail: {
  },
  playbookDetailDescription: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '16px',
  },
  playbookDetailMeta: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  stepsTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#333',
  },
  stepsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  stepItem: {
    display: 'flex',
    gap: '16px',
    padding: '16px',
    border: '1px solid #eee',
    borderRadius: '8px',
  },
  stepNumber: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#1976d2',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
  },
  stepDescription: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
  },
  stepDetails: {
    display: 'flex',
    gap: '16px',
    fontSize: '12px',
    color: '#666',
  },
  stepRole: {
  },
  stepTime: {
  },
  incidentsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  incidentItem: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    cursor: 'pointer',
  },
  selectedIncident: {
    backgroundColor: '#e3f2fd',
  },
  incidentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
  },
  incidentTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    margin: 0,
    flex: 1,
  },
  incidentPriority: {
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    color: 'white',
  },
  incidentDescription: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '12px',
  },
  incidentMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#666',
  },
  incidentStatus: {
  },
  incidentDate: {
  },
  incidentActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #eee',
  },
  actionButton: {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  progressButton: {
    backgroundColor: '#1976d2',
    color: 'white',
  },
  resolveButton: {
    backgroundColor: '#4caf50',
    color: 'white',
  },
  closeButton: {
    backgroundColor: '#666',
    color: 'white',
  },
  noIncidents: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#666',
  },
  createIncidentForm: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  formLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  formInput: {
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
  createButton: {
    padding: '12px 24px',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
  },
};

export default OperationalPlaybooksComponent;