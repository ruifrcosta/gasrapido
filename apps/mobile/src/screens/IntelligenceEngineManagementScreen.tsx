// @ts-nocheck
import React from 'react';
import { View, StyleSheet } from 'react-native';
import IntelligenceEngineManagementComponent from '@ui/src/IntelligenceEngineManagementComponent';
import { useSupabase } from '../contexts/SupabaseContext';
import { IntelligenceEngineService } from '@shared/services/intelligenceEngineService';

const IntelligenceEngineManagementScreen = () => {
  const { supabase } = useSupabase();
  const intelligenceEngineService = new IntelligenceEngineService(supabase);

  return (
    <View style={styles.container}>
      <IntelligenceEngineManagementComponent 
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

export default IntelligenceEngineManagementScreen;