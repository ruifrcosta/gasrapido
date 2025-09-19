import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@gasrapido/ui/src/components/common/Input';
import { Button } from '@gasrapido/ui/src/components/common/Button';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../utils/theme';

// Mock data for demonstration
const mockUsers = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@exemplo.com',
    role: 'client',
    status: 'active',
    phone: '+244 912 345 678',
    createdAt: '2023-10-15',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@exemplo.com',
    role: 'vendor',
    status: 'active',
    phone: '+244 923 456 789',
    createdAt: '2023-10-10',
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    email: 'carlos@exemplo.com',
    role: 'courier',
    status: 'pending',
    phone: '+244 934 567 890',
    createdAt: '2023-10-20',
  },
  {
    id: '4',
    name: 'Ana Costa',
    email: 'ana@exemplo.com',
    role: 'admin',
    status: 'active',
    phone: '+244 945 678 901',
    createdAt: '2023-09-05',
  },
  {
    id: '5',
    name: 'Pedro Almeida',
    email: 'pedro@exemplo.com',
    role: 'client',
    status: 'blocked',
    phone: '+244 956 789 012',
    createdAt: '2023-10-18',
  },
];

export default function UserManagementScreen() {
  const [users, setUsers] = useState(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const filterUsers = () => {
    let result = [...users];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    }
    
    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status === statusFilter);
    }
    
    setFilteredUsers(result);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert('Sucesso', 'Lista de usuários atualizada');
    }, 1000);
  };

  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
  };

  const handleActivateUser = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: 'active' } : user
    ));
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({ ...selectedUser, status: 'active' });
    }
    Alert.alert('Sucesso', 'Usuário ativado com sucesso');
  };

  const handleBlockUser = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: 'blocked' } : user
    ));
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({ ...selectedUser, status: 'blocked' });
    }
    Alert.alert('Sucesso', 'Usuário bloqueado com sucesso');
  };

  const handleChangeRole = (userId: string, newRole: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({ ...selectedUser, role: newRole });
    }
    Alert.alert('Sucesso', 'Função do usuário alterada com sucesso');
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'vendor': return 'Fornecedor';
      case 'courier': return 'Entregador';
      case 'client': return 'Cliente';
      default: return role;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'pending': return 'Pendente';
      case 'blocked': return 'Bloqueado';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return Colors.success;
      case 'pending': return Colors.warning;
      case 'blocked': return Colors.error;
      default: return Colors.gray;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return Colors.primary;
      case 'vendor': return Colors.info;
      case 'courier': return Colors.success;
      case 'client': return Colors.accent;
      default: return Colors.gray;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Gestão de Usuários</Text>
        <TouchableOpacity onPress={() => router.push('/admin-dashboard')}>
          <Ionicons name="close" size={24} color={Colors.black} />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        <Input
          placeholder="Pesquisar por nome ou email"
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
        />
        
        <View style={styles.filterRow}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Função:</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity 
                style={[
                  styles.filterOption, 
                  roleFilter === 'all' && styles.activeFilter
                ]}
                onPress={() => setRoleFilter('all')}
              >
                <Text style={[
                  styles.filterOptionText,
                  roleFilter === 'all' && styles.activeFilterText
                ]}>Todas</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.filterOption, 
                  roleFilter === 'client' && styles.activeFilter
                ]}
                onPress={() => setRoleFilter('client')}
              >
                <Text style={[
                  styles.filterOptionText,
                  roleFilter === 'client' && styles.activeFilterText
                ]}>Clientes</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.filterOption, 
                  roleFilter === 'vendor' && styles.activeFilter
                ]}
                onPress={() => setRoleFilter('vendor')}
              >
                <Text style={[
                  styles.filterOptionText,
                  roleFilter === 'vendor' && styles.activeFilterText
                ]}>Fornecedores</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Status:</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity 
                style={[
                  styles.filterOption, 
                  statusFilter === 'all' && styles.activeFilter
                ]}
                onPress={() => setStatusFilter('all')}
              >
                <Text style={[
                  styles.filterOptionText,
                  statusFilter === 'all' && styles.activeFilterText
                ]}>Todos</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.filterOption, 
                  statusFilter === 'active' && styles.activeFilter
                ]}
                onPress={() => setStatusFilter('active')}
              >
                <Text style={[
                  styles.filterOptionText,
                  statusFilter === 'active' && styles.activeFilterText
                ]}>Ativos</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* User List */}
        <View style={styles.userList}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Usuários ({filteredUsers.length})</Text>
          </View>
          
          <ScrollView 
            style={styles.userListContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {filteredUsers.map(user => (
              <TouchableOpacity
                key={user.id}
                style={[
                  styles.userItem,
                  selectedUser?.id === user.id && styles.selectedUserItem
                ]}
                onPress={() => handleUserSelect(user)}
              >
                <View style={styles.userBasicInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
                <View style={styles.userMeta}>
                  <View style={[styles.badge, { backgroundColor: getRoleColor(user.role) }]}>
                    <Text style={styles.badgeText}>{getRoleLabel(user.role)}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: getStatusColor(user.status) }]}>
                    <Text style={styles.badgeText}>{getStatusLabel(user.status)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* User Details */}
        <View style={styles.userDetails}>
          {selectedUser ? (
            <ScrollView style={styles.userDetailContainer}>
              <View style={styles.userDetailHeader}>
                <Text style={styles.userDetailTitle}>Detalhes do Usuário</Text>
              </View>
              
              <View style={styles.detailCard}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Nome:</Text>
                  <Text style={styles.detailValue}>{selectedUser.name}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Email:</Text>
                  <Text style={styles.detailValue}>{selectedUser.email}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Telefone:</Text>
                  <Text style={styles.detailValue}>{selectedUser.phone}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Função:</Text>
                  <View style={[styles.badge, { backgroundColor: getRoleColor(selectedUser.role) }]}>
                    <Text style={styles.badgeText}>{getRoleLabel(selectedUser.role)}</Text>
                  </View>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <View style={[styles.badge, { backgroundColor: getStatusColor(selectedUser.status) }]}>
                    <Text style={styles.badgeText}>{getStatusLabel(selectedUser.status)}</Text>
                  </View>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Registrado em:</Text>
                  <Text style={styles.detailValue}>{selectedUser.createdAt}</Text>
                </View>
                
                <View style={styles.actionButtons}>
                  {selectedUser.status === 'active' ? (
                    <Button
                      variant="outline"
                      onPress={() => handleBlockUser(selectedUser.id)}
                      style={styles.actionButton}
                    >
                      Bloquear Usuário
                    </Button>
                  ) : selectedUser.status === 'blocked' ? (
                    <Button
                      variant="primary"
                      onPress={() => handleActivateUser(selectedUser.id)}
                      style={styles.actionButton}
                    >
                      Ativar Usuário
                    </Button>
                  ) : null}
                  
                  <Button
                    variant="ghost"
                    onPress={() => Alert.alert('Função', 'Alterar função do usuário')}
                    style={styles.actionButton}
                  >
                    Alterar Função
                  </Button>
                </View>
              </View>
              
              <View style={styles.auditSection}>
                <Text style={styles.sectionTitle}>Histórico de Atividades</Text>
                {auditLogs.map(log => (
                  <View key={log.id} style={styles.auditItem}>
                    <Text style={styles.auditAction}>{log.action}</Text>
                    <Text style={styles.auditTime}>{log.time}</Text>
                    <Text style={styles.auditDescription}>{log.description}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.noUserSelected}>
              <Ionicons name="person" size={48} color={Colors.gray} />
              <Text style={styles.noUserText}>Selecione um usuário para ver os detalhes</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const auditLogs = [
  {
    id: '1',
    action: 'Registro de Usuário',
    time: '2023-10-15 14:30',
    description: 'Usuário registrado com sucesso',
  },
  {
    id: '2',
    action: 'Atualização de Perfil',
    time: '2023-10-16 09:15',
    description: 'Telefone atualizado',
  },
  {
    id: '3',
    action: 'Pedido Realizado',
    time: '2023-10-17 16:45',
    description: 'Pedido #12345 criado',
  },
];

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
  filters: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  searchInput: {
    marginBottom: Spacing.md,
  },
  filterRow: {
    marginBottom: Spacing.sm,
  },
  filterGroup: {
    marginBottom: Spacing.md,
  },
  filterLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  activeFilter: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterOptionText: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray,
  },
  activeFilterText: {
    color: Colors.white,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  userList: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: Colors.lightGray,
  },
  listHeader: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  listTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
  },
  userListContainer: {
    flex: 1,
  },
  userItem: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  selectedUserItem: {
    backgroundColor: Colors.primary + '10',
  },
  userBasicInfo: {
    marginBottom: Spacing.xs,
  },
  userName: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
  },
  userEmail: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray,
  },
  userMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  badgeText: {
    fontSize: Typography.sizes.xs,
    color: Colors.white,
    fontWeight: Typography.weights.medium,
  },
  userDetails: {
    flex: 1,
  },
  userDetailContainer: {
    flex: 1,
  },
  userDetailHeader: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  userDetailTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
  },
  detailCard: {
    backgroundColor: Colors.white,
    margin: Spacing.md,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  detailLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray,
    flex: 1,
  },
  detailValue: {
    fontSize: Typography.sizes.sm,
    color: Colors.black,
    fontWeight: Typography.weights.medium,
    flex: 1,
    textAlign: 'right',
  },
  actionButtons: {
    marginTop: Spacing.lg,
  },
  actionButton: {
    marginBottom: Spacing.sm,
  },
  auditSection: {
    margin: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
    marginBottom: Spacing.md,
  },
  auditItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  auditAction: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  auditTime: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray,
    marginBottom: Spacing.xs,
  },
  auditDescription: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray,
  },
  noUserSelected: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  noUserText: {
    fontSize: Typography.sizes.md,
    color: Colors.gray,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});