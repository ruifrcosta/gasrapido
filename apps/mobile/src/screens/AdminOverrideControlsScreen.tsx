// @ts-nocheck
import React from 'react';
import { View, StyleSheet } from 'react-native';
import AdminOverrideControlsComponent from '@gasrapido/ui/src/AdminOverrideControlsComponent';
import { useAuth } from '../contexts/AuthContext';

const AdminOverrideControlsScreen = () => {
  const { user } = useAuth();
  
  const handleOverrideApplied = (override: any) => {
    console.log('Override aplicado:', override);
    // Aqui você poderia enviar para um serviço de logging ou notificação
  };

  const handlePolicyUpdated = (policy: any) => {
    console.log('Política atualizada:', policy);
    // Aqui você poderia enviar para um serviço de gerenciamento de políticas
  };

  return (
    <View style={styles.container}>
      <AdminOverrideControlsComponent 
        userId={user?.id || 'unknown-user'}
        onOverrideApplied={handleOverrideApplied}
        onPolicyUpdated={handlePolicyUpdated}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default AdminOverrideControlsScreen;