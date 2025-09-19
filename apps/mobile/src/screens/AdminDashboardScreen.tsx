import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ComprehensiveDashboardComponent } from '@gasrapido/ui';
import { metricsService } from '@gasrapido/shared';

const AdminDashboardScreen = () => {
  return (
    <View style={styles.container}>
      <ComprehensiveDashboardComponent 
        metricsService={metricsService}
        userRole="admin"
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
