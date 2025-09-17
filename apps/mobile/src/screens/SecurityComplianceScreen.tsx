// @ts-nocheck
import React from 'react';
import { View, StyleSheet } from 'react-native';
import SecurityComplianceComponent from '@gasrapido/ui/src/SecurityComplianceComponent';
import { useSupabase } from '../contexts/SupabaseContext';
import { SecurityComplianceService } from '@gasrapido/shared';

const SecurityComplianceScreen = () => {
  const { supabase } = useSupabase();
  const securityService = new SecurityComplianceService(supabase);

  return (
    <View style={styles.container}>
      <SecurityComplianceComponent securityService={securityService} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default SecurityComplianceScreen;