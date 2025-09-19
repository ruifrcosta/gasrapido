import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ComprehensiveDashboardComponent } from '@gasrapido/ui';
import { MetricsService } from '@gasrapido/shared';
import { supabase } from '@gasrapido/shared';

// Create metrics service instance
const metricsService = new MetricsService(supabase);

const FinancialDashboardScreen = () => {
  return (
    <View style={styles.container}>
      <ComprehensiveDashboardComponent 
        metricsService={metricsService}
        userRole="finance"
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

export default FinancialDashboardScreen;
