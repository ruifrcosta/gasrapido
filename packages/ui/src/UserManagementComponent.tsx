// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { UserManagementService, Profile, UserRole, UserAuditLog } from '@gasrapido/shared';

interface UserManagementComponentProps {
  userManagementService: UserManagementService;
}

const UserManagementComponent: React.FC<UserManagementComponentProps> = ({ 
  userManagementService 
}) => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [auditLogs, setAuditLogs] = useState<UserAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAuditLogs, setLoadingAuditLogs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, activeFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { users: fetchedUsers, error } = await userManagementService.getUsers();
      
      if (error) throw error;
      
      setUsers(fetchedUsers);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar usuários');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let result = [...users];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        (user.full_name && user.full_name.toLowerCase().includes(term)) ||
        user.email.toLowerCase().includes(term)
      );
    }
    
    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    
    // Apply active filter
    if (activeFilter !== 'all') {
      const isActive = activeFilter === 'active';
      result = result.filter(user => user.is_active === isActive);
    }
    
    setFilteredUsers(result);
  };

  const fetchAuditLogs = async (userId: string) => {
    try {
      setLoadingAuditLogs(true);
      const { logs, error } = await userManagementService.getUserAuditLogs(userId);
      
      if (error) throw error;
      
      setAuditLogs(logs);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar logs de auditoria');
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoadingAuditLogs(false);
    }
  };

  const handleUserSelect = async (user: Profile) => {
    setSelectedUser(user);
    await fetchAuditLogs(user.id);
  };

  const handleActivateUser = async (userId: string) => {
    try {
      const { success, error } = await userManagementService.activateUser(userId);
      
      if (error) throw error;
      
      if (success) {
        // Refresh the user list
        fetchUsers();
        
        // If the selected user was deactivated, update the selection
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser({ ...selectedUser, is_active: true });
        }
      }
    } catch (err) {
      setError('Erro ao ativar usuário');
      console.error('Error activating user:', err);
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    try {
      const { success, error } = await userManagementService.deactivateUser(userId);
      
      if (error) throw error;
      
      if (success) {
        // Refresh the user list
        fetchUsers();
        
        // If the selected user was activated, update the selection
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser({ ...selectedUser, is_active: false });
        }
      }
    } catch (err) {
      setError('Erro ao desativar usuário');
      console.error('Error deactivating user:', err);
    }
  };

  const handleChangeRole = async (userId: string, newRole: UserRole) => {
    try {
      const { success, error } = await userManagementService.changeUserRole(userId, newRole);
      
      if (error) throw error;
      
      if (success) {
        // Refresh the user list
        fetchUsers();
        
        // If the selected user's role was changed, update the selection
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser({ ...selectedUser, role: newRole });
        }
      }
    } catch (err) {
      setError('Erro ao alterar função do usuário');
      console.error('Error changing user role:', err);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Carregando usuários...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Gestão de Usuários</h2>
      
      {/* Filters */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Pesquisar por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
          style={styles.filterSelect}
        >
          <option value="all">Todas as funções</option>
          <option value="admin">Administrador</option>
          <option value="vendor">Fornecedor</option>
          <option value="courier">Entregador</option>
          <option value="client">Cliente</option>
        </select>
        
        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value as any)}
          style={styles.filterSelect}
        >
          <option value="all">Todos os status</option>
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
        </select>
        
        <button onClick={fetchUsers} style={styles.refreshButton}>
          Atualizar
        </button>
      </div>
      
      <div style={styles.content}>
        {/* User List */}
        <div style={styles.userList}>
          <h3 style={styles.sectionTitle}>Usuários ({filteredUsers.length})</h3>
          <div style={styles.userListContainer}>
            {filteredUsers.map(user => (
              <div 
                key={user.id}
                style={{
                  ...styles.userItem,
                  ...(selectedUser?.id === user.id ? styles.selectedUserItem : {})
                }}
                onClick={() => handleUserSelect(user)}
              >
                <div style={styles.userBasicInfo}>
                  <div style={styles.userName}>{user.full_name || 'Nome não definido'}</div>
                  <div style={styles.userEmail}>{user.email}</div>
                </div>
                <div style={styles.userMeta}>
                  <span style={{
                    ...styles.userRole,
                    backgroundColor: getUserRoleColor(user.role)
                  }}>
                    {getUserRoleLabel(user.role)}
                  </span>
                  <span style={{
                    ...styles.userStatus,
                    ...(user.is_active ? styles.activeStatus : styles.inactiveStatus)
                  }}>
                    {user.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* User Details */}
        <div style={styles.userDetails}>
          {selectedUser ? (
            <>
              <h3 style={styles.sectionTitle}>Detalhes do Usuário</h3>
              <div style={styles.userDetailCard}>
                <div style={styles.detailRow}>
                  <strong>Nome:</strong>
                  <span>{selectedUser.full_name || 'Não definido'}</span>
                </div>
                <div style={styles.detailRow}>
                  <strong>Email:</strong>
                  <span>{selectedUser.email}</span>
                </div>
                <div style={styles.detailRow}>
                  <strong>Função:</strong>
                  <select
                    value={selectedUser.role}
                    onChange={(e) => handleChangeRole(selectedUser.id, e.target.value as UserRole)}
                    style={styles.roleSelect}
                  >
                    <option value="admin">Administrador</option>
                    <option value="vendor">Fornecedor</option>
                    <option value="courier">Entregador</option>
                    <option value="client">Cliente</option>
                  </select>
                </div>
                <div style={styles.detailRow}>
                  <strong>Status:</strong>
                  <span style={selectedUser.is_active ? styles.activeStatus : styles.inactiveStatus}>
                    {selectedUser.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <div style={styles.detailRow}>
                  <strong>Telefone:</strong>
                  <span>{selectedUser.phone || 'Não definido'}</span>
                </div>
                <div style={styles.detailRow}>
                  <strong>Endereço:</strong>
                  <span>{selectedUser.address || 'Não definido'}</span>
                </div>
                <div style={styles.detailRow}>
                  <strong>Data de Registro:</strong>
                  <span>{new Date(selectedUser.created_at).toLocaleDateString('pt-AO')}</span>
                </div>
                
                <div style={styles.actionButtons}>
                  {selectedUser.is_active ? (
                    <button 
                      onClick={() => handleDeactivateUser(selectedUser.id)}
                      style={{...styles.actionButton, ...styles.deactivateButton}}
                    >
                      Desativar Usuário
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleActivateUser(selectedUser.id)}
                      style={{...styles.actionButton, ...styles.activateButton}}
                    >
                      Ativar Usuário
                    </button>
                  )}
                </div>
              </div>
              
              {/* Audit Logs */}
              <h3 style={styles.sectionTitle}>Logs de Auditoria</h3>
              <div style={styles.auditLogsContainer}>
                {loadingAuditLogs ? (
                  <div style={styles.loading}>Carregando logs...</div>
                ) : auditLogs.length > 0 ? (
                  auditLogs.map(log => (
                    <div key={log.id} style={styles.auditLogItem}>
                      <div style={styles.auditLogHeader}>
                        <span style={styles.auditLogAction}>{getActionLabel(log.action)}</span>
                        <span style={styles.auditLogTime}>
                          {new Date(log.timestamp).toLocaleString('pt-AO')}
                        </span>
                      </div>
                      <div style={styles.auditLogDetails}>
                        {Object.entries(log.details).map(([key, value]) => (
                          <div key={key} style={styles.auditLogDetail}>
                            <strong>{key}:</strong> {JSON.stringify(value)}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={styles.noAuditLogs}>Nenhum log de auditoria encontrado</div>
                )}
              </div>
            </>
          ) : (
            <div style={styles.noUserSelected}>
              Selecione um usuário para ver os detalhes
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getUserRoleLabel = (role: UserRole): string => {
  switch (role) {
    case 'admin': return 'Administrador';
    case 'vendor': return 'Fornecedor';
    case 'courier': return 'Entregador';
    case 'client': return 'Cliente';
    default: return role;
  }
};

const getUserRoleColor = (role: UserRole): string => {
  switch (role) {
    case 'admin': return '#ef4444';
    case 'vendor': return '#3b82f6';
    case 'courier': return '#10b981';
    case 'client': return '#8b5cf6';
    default: return '#6b7280';
  }
};

const getActionLabel = (action: string): string => {
  switch (action) {
    case 'update_user': return 'Atualização de Usuário';
    case 'activate_user': return 'Ativação de Usuário';
    case 'deactivate_user': return 'Desativação de Usuário';
    case 'change_role': return 'Alteração de Função';
    default: return action;
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
  loading: {
    textAlign: 'center',
    padding: '20px',
    color: '#666',
  },
  error: {
    textAlign: 'center',
    padding: '20px',
    color: '#d32f2f',
    backgroundColor: '#ffebee',
    borderRadius: '4px',
    margin: '10px 0',
  },
  filters: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap' as const,
  },
  searchInput: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    flex: 1,
    minWidth: '200px',
  },
  filterSelect: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
  },
  refreshButton: {
    padding: '8px 16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    backgroundColor: '#1976d2',
    color: 'white',
    cursor: 'pointer',
  },
  content: {
    display: 'flex',
    gap: '20px',
    height: 'calc(100% - 100px)',
  },
  userList: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#333',
  },
  userListContainer: {
    maxHeight: 'calc(100vh - 250px)',
    overflowY: 'auto' as const,
  },
  userItem: {
    padding: '12px',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedUserItem: {
    backgroundColor: '#e3f2fd',
  },
  userBasicInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  userEmail: {
    fontSize: '14px',
    color: '#666',
  },
  userMeta: {
    display: 'flex',
    gap: '8px',
  },
  userRole: {
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    color: 'white',
  },
  userStatus: {
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    color: 'white',
  },
  activeStatus: {
    backgroundColor: '#4caf50',
  },
  inactiveStatus: {
    backgroundColor: '#f44336',
  },
  userDetails: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    maxHeight: 'calc(100vh - 180px)',
    overflowY: 'auto' as const,
  },
  userDetailCard: {
    marginBottom: '20px',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #eee',
  },
  roleSelect: {
    padding: '4px 8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  actionButtons: {
    marginTop: '20px',
    display: 'flex',
    gap: '10px',
  },
  actionButton: {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  activateButton: {
    backgroundColor: '#4caf50',
    color: 'white',
  },
  deactivateButton: {
    backgroundColor: '#f44336',
    color: 'white',
  },
  auditLogsContainer: {
    maxHeight: '300px',
    overflowY: 'auto' as const,
  },
  auditLogItem: {
    padding: '12px',
    borderBottom: '1px solid #eee',
  },
  auditLogHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  auditLogAction: {
    fontWeight: 'bold',
    color: '#1976d2',
  },
  auditLogTime: {
    fontSize: '12px',
    color: '#666',
  },
  auditLogDetails: {
    fontSize: '14px',
    color: '#666',
  },
  auditLogDetail: {
    marginBottom: '4px',
  },
  noAuditLogs: {
    textAlign: 'center',
    padding: '20px',
    color: '#666',
  },
  noUserSelected: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#666',
  },
};

export default UserManagementComponent;