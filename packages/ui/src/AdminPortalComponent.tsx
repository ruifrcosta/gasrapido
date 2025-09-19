// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Card, Button, Dropdown, Toggle } from './components/common';
// @ts-ignore
import { UserManagementService, verificationService, verificationNotificationService } from '@gasrapido/shared';

interface PendingUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  createdAt: string;
  invitationType: 'client' | 'vendor' | 'courier';
  documents?: any[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface AdminPortalComponentProps {
  userManagementService: UserManagementService;
  currentUser: any;
}

interface Invite {
  id: string;
  code: string;
  type: 'client' | 'vendor' | 'courier';
  email: string;
  invitedBy: string | null;
  acceptedBy: string | null;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface VerificationRequest {
  id: string;
  userId: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  rejectionReason: string | null;
  submittedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
}

interface VerificationDocument {
  id: string;
  userId: string;
  documentType: 'id' | 'license' | 'insurance' | 'vehicle_registration';
  filePath: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason: string | null;
  uploadedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
}

const AdminPortalComponent: React.FC<AdminPortalComponentProps> = ({ 
  userManagementService,
  currentUser
}) => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'approvals' | 'roles' | 'audit' | 'invitations' | 'verifications'>('approvals');
  const [invites, setInvites] = useState<Invite[]>([]);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [selectedVerification, setSelectedVerification] = useState<VerificationRequest | null>(null);
  const [userDocuments, setUserDocuments] = useState<Record<string, VerificationDocument[]>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch pending users, roles, and invites in parallel
      const [pendingUsersResult, rolesResult] = await Promise.all([
        userManagementService.getUsersByStatus('pending'),
        userManagementService.getRoles()
      ]);

      if (pendingUsersResult.error) throw pendingUsersResult.error;
      if (rolesResult.error) throw rolesResult.error;

      setPendingUsers(pendingUsersResult.users || []);
      setRoles(rolesResult.roles || []);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados do portal administrativo');
      console.error('Error fetching admin portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVerificationRequests = async () => {
    try {
      // In a real implementation, you would fetch verification requests from the backend
      // For now, we'll use mock data
      const mockRequests: VerificationRequest[] = [
        {
          id: '1',
          userId: 'user1',
          status: 'pending',
          rejectionReason: null,
          submittedAt: new Date().toISOString(),
          reviewedAt: null,
          reviewedBy: null
        },
        {
          id: '2',
          userId: 'user2',
          status: 'in_review',
          rejectionReason: null,
          submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          reviewedAt: null,
          reviewedBy: null
        }
      ];
      setVerificationRequests(mockRequests);
    } catch (err) {
      console.error('Error fetching verification requests:', err);
    }
  };

  const fetchUserDocuments = async (userId: string) => {
    try {
      // In a real implementation, you would fetch user documents from the backend
      // For now, we'll use mock data
      const mockDocuments: VerificationDocument[] = [
        {
          id: 'doc1',
          userId: userId,
          documentType: 'id',
          filePath: '/documents/id.pdf',
          fileName: 'Documento de Identidade.pdf',
          mimeType: 'application/pdf',
          fileSize: 1024000,
          status: 'pending',
          rejectionReason: null,
          uploadedAt: new Date().toISOString(),
          reviewedAt: null,
          reviewedBy: null
        },
        {
          id: 'doc2',
          userId: userId,
          documentType: 'license',
          filePath: '/documents/license.pdf',
          fileName: 'Licença Comercial.pdf',
          mimeType: 'application/pdf',
          fileSize: 2048000,
          status: 'pending',
          rejectionReason: null,
          uploadedAt: new Date().toISOString(),
          reviewedAt: null,
          reviewedBy: null
        }
      ];
      
      setUserDocuments(prev => ({
        ...prev,
        [userId]: mockDocuments
      }));
    } catch (err) {
      console.error('Error fetching user documents:', err);
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      const { success, error } = await userManagementService.updateUserStatus(userId, 'active');
      
      if (error) throw error;
      
      if (success) {
        // Refresh the pending users list
        fetchData();
        Alert.alert('Sucesso', 'Usuário aprovado com sucesso');
      }
    } catch (err) {
      setError('Erro ao aprovar usuário');
      console.error('Error approving user:', err);
      Alert.alert('Erro', 'Falha ao aprovar usuário');
    }
  };

  const handleRejectUser = async (userId: string, reason: string) => {
    try {
      const { success, error } = await userManagementService.updateUserStatus(userId, 'rejected', reason);
      
      if (error) throw error;
      
      if (success) {
        // Refresh the pending users list
        fetchData();
        Alert.alert('Sucesso', 'Usuário rejeitado com sucesso');
      }
    } catch (err) {
      setError('Erro ao rejeitar usuário');
      console.error('Error rejecting user:', err);
      Alert.alert('Erro', 'Falha ao rejeitar usuário');
    }
  };

  const handleApproveVerification = async (requestId: string) => {
    try {
      // Get user name for notification
      const userName = "Usuário"; // In a real implementation, you would fetch the user name
      
      // In a real implementation, you would call the verification service
      // const result = await verificationService.updateVerificationStatus(requestId, 'approved', currentUser.id, userName);
      
      // For now, we'll just update the local state
      setVerificationRequests(prev => 
        prev.map(req => 
          req.id === requestId ? { ...req, status: 'approved', reviewedAt: new Date().toISOString(), reviewedBy: currentUser.id } : req
        )
      );
      
      // Send notification
      // await verificationNotificationService.sendDocumentsApprovedNotification(request.userId, userName);
      
      Alert.alert('Sucesso', 'Verificação aprovada com sucesso');
    } catch (err) {
      console.error('Error approving verification:', err);
      Alert.alert('Erro', 'Falha ao aprovar verificação');
    }
  };

  const handleRejectVerification = async (requestId: string, reason: string) => {
    try {
      // Get user name for notification
      const userName = "Usuário"; // In a real implementation, you would fetch the user name
      
      // In a real implementation, you would call the verification service
      // const result = await verificationService.updateVerificationStatus(requestId, 'rejected', currentUser.id, userName, reason);
      
      // For now, we'll just update the local state
      setVerificationRequests(prev => 
        prev.map(req => 
          req.id === requestId ? { ...req, status: 'rejected', reviewedAt: new Date().toISOString(), reviewedBy: currentUser.id, rejectionReason: reason } : req
        )
      );
      
      // Send notification
      // await verificationNotificationService.sendDocumentsRejectedNotification(request.userId, userName, reason);
      
      Alert.alert('Sucesso', 'Verificação rejeitada com sucesso');
    } catch (err) {
      console.error('Error rejecting verification:', err);
      Alert.alert('Erro', 'Falha ao rejeitar verificação');
    }
  };

  const handleUserSelect = (user: PendingUser) => {
    setSelectedUser(user);
  };

  const handleVerificationSelect = (request: VerificationRequest) => {
    setSelectedVerification(request);
    fetchUserDocuments(request.userId);
  };

  const fetchInvites = async () => {
    try {
      // This would fetch invites from the invitation service
      // For now, we'll use mock data
      const mockInvites: Invite[] = [
        {
          id: '1',
          code: 'ABC123',
          type: 'vendor',
          email: 'fornecedor@example.com',
          invitedBy: 'admin1',
          acceptedBy: null,
          status: 'pending',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          acceptedAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          code: 'XYZ789',
          type: 'courier',
          email: 'entregador@example.com',
          invitedBy: 'admin1',
          acceptedBy: null,
          status: 'pending',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          acceptedAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      setInvites(mockInvites);
    } catch (err) {
      console.error('Error fetching invites:', err);
    }
  };

  const getRoleLabel = (role: string): string => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'vendor': return 'Fornecedor';
      case 'courier': return 'Entregador';
      case 'client': return 'Cliente';
      default: return role;
    }
  };

  const getInvitationTypeLabel = (type: string): string => {
    switch (type) {
      case 'client': return 'Cliente';
      case 'vendor': return 'Fornecedor';
      case 'courier': return 'Entregador';
      default: return type;
    }
  };

  const getDocumentTypeLabel = (type: string): string => {
    switch (type) {
      case 'id': return 'Documento de Identidade';
      case 'license': return 'Licença Comercial';
      case 'insurance': return 'Seguro';
      case 'vehicle_registration': return 'Registro do Veículo';
      default: return type;
    }
  };

  const getVerificationStatusLabel = (status: string): string => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in_review': return 'Em Revisão';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      default: return status;
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando portal administrativo...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Portal Administrativo</Text>
      
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'approvals' && styles.activeTab]}
          onPress={() => setActiveTab('approvals')}
        >
          <Text style={[styles.tabText, activeTab === 'approvals' && styles.activeTabText]}>
            Aprovações ({pendingUsers.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'verifications' && styles.activeTab]}
          onPress={() => {
            setActiveTab('verifications');
            fetchVerificationRequests();
          }}
        >
          <Text style={[styles.tabText, activeTab === 'verifications' && styles.activeTabText]}>
            Verificações ({verificationRequests.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'roles' && styles.activeTab]}
          onPress={() => setActiveTab('roles')}
        >
          <Text style={[styles.tabText, activeTab === 'roles' && styles.activeTabText]}>
            Funções ({roles.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'invitations' && styles.activeTab]}
          onPress={() => setActiveTab('invitations')}
        >
          <Text style={[styles.tabText, activeTab === 'invitations' && styles.activeTabText]}>
            Convites ({invites.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'audit' && styles.activeTab]}
          onPress={() => setActiveTab('audit')}
        >
          <Text style={[styles.tabText, activeTab === 'audit' && styles.activeTabText]}>
            Auditoria
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Approvals Tab */}
      {activeTab === 'approvals' && (
        <View style={styles.tabContent}>
          <Text style={styles.sectionTitle}>Fila de Aprovações</Text>
          
          {pendingUsers.length > 0 ? (
            <ScrollView>
              {pendingUsers.map(user => (
                <Card key={user.id} style={styles.userCard}>
                  <View style={styles.userHeader}>
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{user.name}</Text>
                      <Text style={styles.userEmail}>{user.email}</Text>
                    </View>
                    <View style={styles.userTags}>
                      <Text style={[styles.tag, styles.roleTag]}>
                        {getRoleLabel(user.role)}
                      </Text>
                      <Text style={[styles.tag, styles.typeTag]}>
                        {getInvitationTypeLabel(user.invitationType)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.userDetails}>
                    <Text style={styles.detailText}>Telefone: {user.phone}</Text>
                    <Text style={styles.detailText}>
                      Registrado em: {new Date(user.createdAt).toLocaleDateString('pt-AO')}
                    </Text>
                  </View>
                  
                  <View style={styles.userActions}>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onPress={() => handleApproveUser(user.id)}
                      style={styles.actionButton}
                    >
                      Aprovar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onPress={() => handleRejectUser(user.id, 'Documentos inválidos')}
                      style={styles.actionButton}
                    >
                      Rejeitar
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onPress={() => handleUserSelect(user)}
                      style={styles.actionButton}
                    >
                      Detalhes
                    </Button>
                  </View>
                </Card>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Nenhum usuário pendente de aprovação</Text>
            </View>
          )}
        </View>
      )}
      
      {/* Verifications Tab */}
      {activeTab === 'verifications' && (
        <View style={styles.tabContent}>
          <Text style={styles.sectionTitle}>Verificação de Documentos</Text>
          
          {verificationRequests.length > 0 ? (
            <ScrollView>
              {verificationRequests.map(request => (
                <Card key={request.id} style={styles.verificationCard}>
                  <View style={styles.verificationHeader}>
                    <View style={styles.verificationInfo}>
                      <Text style={styles.verificationId}>Verificação #{request.id.substring(0, 8)}</Text>
                      <Text style={styles.verificationSubmitted}>
                        Submetido em: {new Date(request.submittedAt).toLocaleDateString('pt-AO')}
                      </Text>
                    </View>
                    <View style={styles.verificationTags}>
                      <Text style={[styles.tag, 
                        request.status === 'pending' ? styles.pendingTag : 
                        request.status === 'in_review' ? styles.inReviewTag : 
                        request.status === 'approved' ? styles.acceptedTag : styles.rejectedTag]}>
                        {getVerificationStatusLabel(request.status)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.verificationActions}>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onPress={() => handleVerificationSelect(request)}
                      style={styles.actionButton}
                    >
                      Revisar Documentos
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onPress={() => handleApproveVerification(request.id)}
                      style={styles.actionButton}
                      disabled={request.status !== 'pending' && request.status !== 'in_review'}
                    >
                      Aprovar
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onPress={() => handleRejectVerification(request.id, 'Documentos inválidos')}
                      style={styles.actionButton}
                      disabled={request.status !== 'pending' && request.status !== 'in_review'}
                    >
                      Rejeitar
                    </Button>
                  </View>
                </Card>
              ))}
              
              {/* Document Review Section */}
              {selectedVerification && (
                <Card style={styles.documentReviewCard}>
                  <Text style={styles.sectionTitle}>Documentos do Usuário</Text>
                  <Text style={styles.userIdText}>ID do Usuário: {selectedVerification.userId}</Text>
                  
                  {(userDocuments[selectedVerification.userId] || []).map(document => (
                    <View key={document.id} style={styles.documentCard}>
                      <View style={styles.documentHeader}>
                        <Text style={styles.documentName}>{getDocumentTypeLabel(document.documentType)}</Text>
                        <Text style={[styles.tag, 
                          document.status === 'pending' ? styles.pendingTag : 
                          document.status === 'approved' ? styles.acceptedTag : styles.rejectedTag]}>
                          {getVerificationStatusLabel(document.status)}
                        </Text>
                      </View>
                      <Text style={styles.documentFileName}>{document.fileName}</Text>
                      <Text style={styles.documentSize}>{(document.fileSize / 1024).toFixed(2)} KB</Text>
                      
                      <View style={styles.documentActions}>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          style={styles.documentActionButton}
                        >
                          Visualizar
                        </Button>
                        <Button 
                          variant="primary" 
                          size="sm" 
                          style={styles.documentActionButton}
                          disabled={document.status !== 'pending'}
                        >
                          Aprovar
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          style={styles.documentActionButton}
                          disabled={document.status !== 'pending'}
                        >
                          Rejeitar
                        </Button>
                      </View>
                    </View>
                  ))}
                  
                  <View style={styles.verificationDecisionActions}>
                    <Button 
                      variant="primary" 
                      size="md" 
                      onPress={() => handleApproveVerification(selectedVerification.id)}
                      style={styles.decisionButton}
                    >
                      Aprovar Todos
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="md" 
                      onPress={() => handleRejectVerification(selectedVerification.id, 'Documentos inválidos')}
                      style={styles.decisionButton}
                    >
                      Rejeitar Todos
                    </Button>
                  </View>
                </Card>
              )}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Nenhuma verificação pendente</Text>
            </View>
          )}
        </View>
      )}
      
      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <View style={styles.tabContent}>
          <Text style={styles.sectionTitle}>Gestão de Funções</Text>
          
          <View style={styles.rolesGrid}>
            {roles.map(role => (
              <Card key={role.id} style={styles.roleCard}>
                <Text style={styles.roleName}>{role.name}</Text>
                <Text style={styles.roleDescription}>{role.description}</Text>
                <Text style={styles.permissionsCount}>
                  {role.permissions.length} permissões
                </Text>
                <Button 
                  variant="outline" 
                  size="sm" 
                  style={styles.editRoleButton}
                >
                  Editar Função
                </Button>
              </Card>
            ))}
          </View>
          
          <Button 
            variant="primary" 
            size="md" 
            style={styles.createRoleButton}
          >
            Criar Nova Função
          </Button>
        </View>
      )}
      
      {/* Audit Tab */}
      {activeTab === 'audit' && (
        <View style={styles.tabContent}>
          <Text style={styles.sectionTitle}>Logs de Auditoria</Text>
          
          <View style={styles.auditFilters}>
            <Dropdown
              options={[
                { label: 'Todas as ações', value: 'all' },
                { label: 'Aprovações', value: 'approval' },
                { label: 'Rejeições', value: 'rejection' },
                { label: 'Atualizações', value: 'update' }
              ]}
              selectedValue="all"
              onValueChange={() => {}}
              style={styles.filterDropdown}
            />
          </View>
          
          <ScrollView>
            <Card style={styles.auditCard}>
              <Text style={styles.auditAction}>Aprovação de Usuário</Text>
              <Text style={styles.auditDescription}>
                Usuário "João Silva" aprovado por "admin@example.com"
              </Text>
              <Text style={styles.auditTime}>Há 2 horas</Text>
            </Card>
            
            <Card style={styles.auditCard}>
              <Text style={styles.auditAction}>Rejeição de Usuário</Text>
              <Text style={styles.auditDescription}>
                Usuário "Maria Santos" rejeitado por "admin@example.com" - Motivo: Documentos inválidos
              </Text>
              <Text style={styles.auditTime}>Há 3 horas</Text>
            </Card>
            
            <Card style={styles.auditCard}>
              <Text style={styles.auditAction}>Atualização de Função</Text>
              <Text style={styles.auditDescription}>
                Função "Entregador" atualizada por "admin@example.com"
              </Text>
              <Text style={styles.auditTime}>Há 1 dia</Text>
            </Card>
          </ScrollView>
        </View>
      )}
      
      {/* Invitations Tab */}
      {activeTab === 'invitations' && (
        <View style={styles.tabContent}>
          <Text style={styles.sectionTitle}>Gestão de Convites</Text>
          
          <View style={styles.invitationActions}>
            <Button 
              variant="primary" 
              size="md" 
              style={styles.createInviteButton}
            >
              Criar Novo Convite
            </Button>
          </View>
          
          {invites.length > 0 ? (
            <ScrollView>
              {invites.map(invite => (
                <Card key={invite.id} style={styles.inviteCard}>
                  <View style={styles.inviteHeader}>
                    <View style={styles.inviteInfo}>
                      <Text style={styles.inviteCode}>{invite.code}</Text>
                      <Text style={styles.inviteEmail}>{invite.email}</Text>
                    </View>
                    <View style={styles.inviteTags}>
                      <Text style={[styles.tag, styles.typeTag]}>
                        {getInvitationTypeLabel(invite.type)}
                      </Text>
                      <Text style={[styles.tag, invite.status === 'pending' ? styles.pendingTag : 
                                   invite.status === 'accepted' ? styles.acceptedTag : 
                                   invite.status === 'expired' ? styles.expiredTag : styles.revokedTag]}>
                        {invite.status === 'pending' ? 'Pendente' : 
                         invite.status === 'accepted' ? 'Aceito' : 
                         invite.status === 'expired' ? 'Expirado' : 'Revogado'}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.inviteDetails}>
                    <Text style={styles.detailText}>
                      Expira em: {new Date(invite.expiresAt).toLocaleDateString('pt-AO')}
                    </Text>
                    <Text style={styles.detailText}>
                      Criado em: {new Date(invite.createdAt).toLocaleDateString('pt-AO')}
                    </Text>
                  </View>
                  
                  <View style={styles.inviteActions}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      style={styles.actionButton}
                    >
                      Copiar Link
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      style={styles.actionButton}
                      disabled={invite.status !== 'pending'}
                    >
                      Revogar
                    </Button>
                  </View>
                </Card>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Nenhum convite criado</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  loadingText: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
  },
  errorText: {
    textAlign: 'center',
    padding: 20,
    color: '#d32f2f',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  userCard: {
    marginBottom: 12,
    padding: 16,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  userTags: {
    flexDirection: 'row',
  },
  tag: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
    color: 'white',
    fontWeight: 'bold',
  },
  roleTag: {
    backgroundColor: '#007AFF',
  },
  typeTag: {
    backgroundColor: '#34C759',
  },
  pendingTag: {
    backgroundColor: '#007AFF',
  },
  inReviewTag: {
    backgroundColor: '#FF9500',
  },
  acceptedTag: {
    backgroundColor: '#34C759',
  },
  rejectedTag: {
    backgroundColor: '#d32f2f',
  },
  expiredTag: {
    backgroundColor: '#d32f2f',
  },
  revokedTag: {
    backgroundColor: '#ccc',
  },
  userDetails: {
    marginBottom: 16,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
  },
  verificationCard: {
    marginBottom: 12,
    padding: 16,
  },
  verificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  verificationInfo: {
    flex: 1,
  },
  verificationId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  verificationSubmitted: {
    fontSize: 14,
    color: '#666',
  },
  verificationTags: {
    flexDirection: 'row',
  },
  verificationActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  documentReviewCard: {
    marginTop: 16,
    padding: 16,
  },
  userIdText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  documentCard: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  documentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  documentFileName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  documentSize: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  documentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  documentActionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  verificationDecisionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  decisionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  rolesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  roleCard: {
    width: '48%',
    marginBottom: 12,
    padding: 16,
  },
  roleName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  roleDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  permissionsCount: {
    fontSize: 12,
    color: '#888',
    marginBottom: 16,
  },
  editRoleButton: {
    alignSelf: 'flex-start',
  },
  createRoleButton: {
    alignSelf: 'center',
  },
  auditFilters: {
    marginBottom: 16,
  },
  filterDropdown: {
    width: '100%',
  },
  auditCard: {
    marginBottom: 12,
    padding: 16,
  },
  auditAction: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  auditDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  auditTime: {
    fontSize: 12,
    color: '#888',
  },
  invitationActions: {
    marginBottom: 16,
  },
  createInviteButton: {
    alignSelf: 'center',
  },
  inviteCard: {
    marginBottom: 12,
    padding: 16,
  },
  inviteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  inviteInfo: {
    flex: 1,
  },
  inviteCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  inviteEmail: {
    fontSize: 14,
    color: '#666',
  },
  inviteTags: {
    flexDirection: 'row',
  },
  inviteDetails: {
    marginBottom: 16,
  },
  inviteActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default AdminPortalComponent;