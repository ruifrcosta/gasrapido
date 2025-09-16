// @ts-nocheck
import React from 'react';
import { View, StyleSheet } from 'react-native';
import ManualControlComponent from '@gasrapido/ui/src/ManualControlComponent';
import { useAuth } from '../contexts/AuthContext';

const ManualControlScreen = () => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <ManualControlComponent 
        userId={user?.id || 'unknown-user'}
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

export default ManualControlScreen;