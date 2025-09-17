// @ts-nocheck
import React from 'react';
import { View, StyleSheet } from 'react-native';
import AdminDashboardComponent from '@gasrapido/ui/src/AdminDashboardComponent';
import { useAuth } from '../contexts/AuthContext';
import { useSupabase } from '../contexts/SupabaseContext';
import { IntelligenceEngineService, MetricsService } from '@gasrapido/shared';

const AdminDashboardScreen = () => {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  
  const intelligenceEngineService = new IntelligenceEngineService(supabase);
  const metricsService = new MetricsService(supabase);

  return (
    <View style={styles.container}>
      <AdminDashboardComponent 
        userId={user?.id || 'unknown-user'}
        intelligenceEngineService={intelligenceEngineService}
        metricsService={metricsService}
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