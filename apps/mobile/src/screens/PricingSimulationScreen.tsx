// @ts-nocheck
import React from 'react';
import { View, StyleSheet } from 'react-native';
import PricingSimulationComponent from '@gasrapido/ui/src/PricingSimulationComponent';
import { useSupabase } from '../contexts/SupabaseContext';
import { PricingService } from '@gasrapido/shared';

const PricingSimulationScreen = () => {
  const { supabase } = useSupabase();
  const pricingService = new PricingService(supabase);

  return (
    <View style={styles.container}>
      <PricingSimulationComponent 
        pricingService={pricingService}
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

export default PricingSimulationScreen;