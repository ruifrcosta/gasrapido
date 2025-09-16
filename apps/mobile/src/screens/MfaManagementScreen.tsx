import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Switch } from 'react-native';
import authService from '@gasrapido/shared/services/authService';
import mfaService, { MfaMethod } from '@gasrapido/shared/services/mfaService';
import MfaSetupComponent from '@gasrapido/ui/src/MfaSetupComponent';

const MfaManagementScreen = () => {
  const [userMfaMethods, setUserMfaMethods] = useState<MfaMethod[]>([]);
  const [showMfaSetup, setShowMfaSetup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    loadUserMfaMethods();
  }, []);

  const loadUserMfaMethods = async () => {
    setLoading(true);
    try {
      // Em uma implementação real, obteríamos o ID do usuário autenticado
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUserId(currentUser.id);
        const methods = await authService.getUserMfaMethods(currentUser.id);
        setUserMfaMethods(methods);
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar métodos MFA');
    } finally {
      setLoading(false);
    }
  };

  const handleSetupComplete = () => {
    setShowMfaSetup(false);
    loadUserMfaMethods(); // Recarregar os métodos após configuração
    Alert.alert('Sucesso', 'Método MFA adicionado com sucesso!');
  };

  const handleSetupCancel = () => {
    setShowMfaSetup(false);
  };

  const handleRemoveMethod = async (methodId: string) => {
    Alert.alert(
      'Confirmar',
      'Tem certeza que deseja remover este método de autenticação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await mfaService.removeMfaMethod(methodId);
              loadUserMfaMethods(); // Recarregar os métodos após remoção
              Alert.alert('Sucesso', 'Método MFA removido com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Falha ao remover método MFA');
            }
          }
        }
      ]
    );
  };

  const handleSetPrimaryMethod = async (methodId: string) => {
    try {
      const result = await mfaService.setPrimaryMfaMethod(methodId);
      if (result) {
        loadUserMfaMethods(); // Recarregar os métodos após mudança
        Alert.alert('Sucesso', 'Método MFA definido como primário!');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao definir método MFA como primário');
    }
  };

  const getMethodLabel = (type: string) => {
    switch (type) {
      case 'totp': return 'App Autenticador';
      case 'sms': return 'SMS';
      case 'email': return 'Email';
      case 'backup': return 'Códigos de Backup';
      default: return 'Método Desconhecido';
    }
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'totp': return '📱';
      case 'sms': return '💬';
      case 'email': return '📧';
      case 'backup': return '🔐';
      default: return '🔒';
    }
  };

  if (showMfaSetup) {
    return (
      <View style={styles.container}>
        <MfaSetupComponent
          userId={userId}
          onSetupComplete={handleSetupComplete}
          onCancel={handleSetupCancel}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Autenticação Multifator</Text>
      <Text style={styles.subtitle}>
        Adicione uma camada extra de segurança à sua conta
      </Text>
      
      {loading ? (
        <Text>Carregando métodos MFA...</Text>
      ) : (
        <>
          {userMfaMethods.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Você ainda não configurou nenhum método de autenticação multifator.
              </Text>
            </View>
          ) : (
            <View style={styles.methodsContainer}>
              {userMfaMethods.map((method) => (
                <View key={method.id} style={styles.methodCard}>
                  <View style={styles.methodHeader}>
                    <Text style={styles.methodIcon}>{getMethodIcon(method.type)}</Text>
                    <View style={styles.methodInfo}>
                      <Text style={styles.methodName}>{getMethodLabel(method.type)}</Text>
                      {method.phoneNumber && (
                        <Text style={styles.methodDetail}>Número: {method.phoneNumber}</Text>
                      )}
                      {method.emailAddress && (
                        <Text style={styles.methodDetail}>Email: {method.emailAddress}</Text>
                      )}
                    </View>
                  </View>
                  
                  <View style={styles.methodActions}>
                    <View style={styles.switchContainer}>
                      <Text style={styles.switchLabel}>Primário</Text>
                      <Switch
                        value={method.isPrimary}
                        onValueChange={() => handleSetPrimaryMethod(method.id)}
                        disabled={!method.isVerified}
                      />
                    </View>
                    
                    {method.type !== 'backup' && (
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handleRemoveMethod(method.id)}
                      >
                        <Text style={styles.removeButtonText}>Remover</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  
                  <View style={styles.methodStatus}>
                    <Text style={[
                      styles.statusText,
                      method.isVerified ? styles.verified : styles.notVerified
                    ]}>
                      {method.isVerified ? 'Verificado' : 'Não verificado'}
                    </Text>
                    {method.isPrimary && (
                      <Text style={styles.primaryBadge}>Primário</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowMfaSetup(true)}
          >
            <Text style={styles.addButtonText}>+ Adicionar Método MFA</Text>
          </TouchableOpacity>
          
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>O que é Autenticação Multifator?</Text>
            <Text style={styles.infoText}>
              A autenticação multifator (MFA) adiciona uma camada extra de segurança à sua conta, 
              exigindo mais do que apenas uma senha para fazer login.
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  methodsContainer: {
    marginBottom: 20,
  },
  methodCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  methodIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  methodDetail: {
    fontSize: 14,
    color: '#666',
  },
  methodActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    marginRight: 10,
    fontSize: 16,
  },
  removeButton: {
    padding: 10,
  },
  removeButtonText: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  methodStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusText: {
    fontSize: 14,
  },
  verified: {
    color: '#34C759',
  },
  notVerified: {
    color: '#FF9500',
  },
  primaryBadge: {
    backgroundColor: '#007AFF',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default MfaManagementScreen;