// @ts-nocheck
import React from 'react';
import { View, StyleSheet } from 'react-native';
import AdminDashboardComponent from '@gasrapido/ui/src/AdminDashboardComponent';
import { useAuth } from '../contexts/AuthContext';
import { useSupabase } from '../contexts/SupabaseContext';
import { IntelligenceEngineService } from '@gasrapido/shared';

const AdminDashboardScreen = () => {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  
  const intelligenceEngineService = new IntelligenceEngineService(supabase);

  return (
    <View style={styles.container}>
      <AdminDashboardComponent 
        userId={user?.id || 'unknown-user'}
        intelligenceEngineService={intelligenceEngineService}
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

export default AdminDashboardScreen;