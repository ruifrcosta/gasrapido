import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginWithMfaScreen from '../screens/LoginWithMfaScreen';
import MfaManagementScreen from '../screens/MfaManagementScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="LoginWithMfa" 
        component={LoginWithMfaScreen}
        options={{ title: 'Login' }}
      />
      <Stack.Screen 
        name="MfaManagement" 
        component={MfaManagementScreen}
        options={{ title: 'Autenticação Multifator' }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;