// @ts-nocheck
import React from 'react';
import { View, StyleSheet } from 'react-native';
import GovernancePoliciesComponent from '@gasrapido/ui/src/GovernancePoliciesComponent';

const GovernancePoliciesScreen = () => {
  return (
    <View style={styles.container}>
      <GovernancePoliciesComponent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default GovernancePoliciesScreen;