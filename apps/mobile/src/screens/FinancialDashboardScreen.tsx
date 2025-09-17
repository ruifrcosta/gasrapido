// @ts-nocheck
import React from 'react';
import { View, StyleSheet } from 'react-native';
import FinancialDashboardComponent from '@gasrapido/ui/src/FinancialDashboardComponent';
import { useSupabase } from '../contexts/SupabaseContext';
import { MetricsService } from '@gasrapido/shared';

const FinancialDashboardScreen = () => {
  const { supabase } = useSupabase();
  const metricsService = new MetricsService(supabase);

  return (
    <View style={styles.container}>
      <FinancialDashboardComponent metricsService={metricsService} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default FinancialDashboardScreen;