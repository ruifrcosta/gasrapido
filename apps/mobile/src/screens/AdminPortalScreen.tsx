// @ts-nocheck
import React from 'react';
import { View, StyleSheet } from 'react-native';
import AdminPortalComponent from '@gasrapido/ui/src/AdminPortalComponent';
import { useSupabase } from '../contexts/SupabaseContext';
import { UserManagementService } from '@gasrapido/shared';

const AdminPortalScreen = () => {
  const { supabase } = useSupabase();
  const userManagementService = new UserManagementService(supabase);
  
  // In a real app, this would come from the auth context
  const currentUser = {
    id: 'admin-1',
    name: 'Administrador',
    email: 'admin@example.com',
    role: 'admin'
  };

  return (
    <View style={styles.container}>
      <AdminPortalComponent 
        userManagementService={userManagementService}
        currentUser={currentUser}
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

export default AdminPortalScreen;