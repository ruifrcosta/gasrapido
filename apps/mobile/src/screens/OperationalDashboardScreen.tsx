import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ComprehensiveDashboardComponent } from '@gasrapido/ui';
import { supabase } from '@gasrapido/shared/src/services/supabase';
import { MetricsService } from '@gasrapido/shared/src/services/metricsService';

// Create metrics service instance
const metricsService = new MetricsService(supabase);

const OperationalDashboardScreen = () => {
  return (
    <View style={styles.container}>
      <ComprehensiveDashboardComponent 
        metricsService={metricsService}
        userRole="ops"
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

export default OperationalDashboardScreen;