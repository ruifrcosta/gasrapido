// @ts-nocheck
import React from 'react';
import { View, StyleSheet } from 'react-native';
import UserManagementComponent from '@gasrapido/ui/src/UserManagementComponent';
import { useSupabase } from '../contexts/SupabaseContext';
import { UserManagementService } from '@gasrapido/shared';

const UserManagementScreen = () => {
  const { supabase } = useSupabase();
  const userManagementService = new UserManagementService(supabase);

  return (
    <View style={styles.container}>
      <UserManagementComponent userManagementService={userManagementService} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default UserManagementScreen;