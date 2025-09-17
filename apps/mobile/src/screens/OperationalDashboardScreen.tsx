// @ts-nocheck
import React from 'react';
import { View, StyleSheet } from 'react-native';
import OperationalDashboardComponent from '@gasrapido/ui/src/OperationalDashboardComponent';
import { useSupabase } from '../contexts/SupabaseContext';
import { MetricsService } from '@gasrapido/shared';

const OperationalDashboardScreen = () => {
  const { supabase } = useSupabase();
  const metricsService = new MetricsService(supabase);

  return (
    <View style={styles.container}>
      <OperationalDashboardComponent metricsService={metricsService} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default OperationalDashboardScreen;