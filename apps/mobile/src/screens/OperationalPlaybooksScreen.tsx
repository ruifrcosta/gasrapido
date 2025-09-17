// @ts-nocheck
import React from 'react';
import { View, StyleSheet } from 'react-native';
import OperationalPlaybooksComponent from '@gasrapido/ui/src/OperationalPlaybooksComponent';
import { useSupabase } from '../contexts/SupabaseContext';
import { OperationalPlaybooksService } from '@gasrapido/shared';

const OperationalPlaybooksScreen = () => {
  const { supabase } = useSupabase();
  const playbooksService = new OperationalPlaybooksService(supabase);

  return (
    <View style={styles.container}>
      <OperationalPlaybooksComponent playbooksService={playbooksService} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default OperationalPlaybooksScreen;