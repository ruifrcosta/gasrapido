// @ts-nocheck
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SupabaseProvider } from './contexts/SupabaseContext';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import OrderGasScreen from './screens/OrderGasScreen';
import TrackOrderScreen from './screens/TrackOrderScreen';
import SupplierDashboardScreen from './screens/SupplierDashboardScreen';
import CourierDashboardScreen from './screens/CourierDashboardScreen';
import FinalCertificationScreen from './screens/FinalCertificationScreen';
import MFASetupScreen from './screens/MFASetupScreen';
import MFAVerificationScreen from './screens/MFAVerificationScreen';
import BackupManagementScreen from './screens/BackupManagementScreen';
import TicketingManagementScreen from './screens/TicketingManagementScreen';
import AIAgentsManagementScreen from './screens/AIAgentsManagementScreen';
import IntelligenceEngineManagementScreen from './screens/IntelligenceEngineManagementScreen';
import MatchingManagementScreen from './screens/MatchingManagementScreen';
import PricingDashboardScreen from './screens/PricingDashboardScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import AIAlertsScreen from './screens/AIAlertsScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SupabaseProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'GasRápido' }} 
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ title: 'Entrar' }} 
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ title: 'Registar' }} 
          />
          <Stack.Screen 
            name="OrderGas" 
            component={OrderGasScreen} 
            options={{ title: 'Encomendar Gás' }} 
          />
          <Stack.Screen 
            name="TrackOrder" 
            component={TrackOrderScreen} 
            options={{ title: 'Rastrear Pedido' }} 
          />
          <Stack.Screen 
            name="SupplierDashboard" 
            component={SupplierDashboardScreen} 
            options={{ title: 'Dashboard Fornecedor' }} 
          />
          <Stack.Screen 
            name="CourierDashboard" 
            component={CourierDashboardScreen} 
            options={{ title: 'Dashboard Entregador' }} 
          />
          <Stack.Screen 
            name="FinalCertification" 
            component={FinalCertificationScreen} 
            options={{ title: 'Certificação Final' }} 
          />
          <Stack.Screen 
            name="MFASetup" 
            component={MFASetupScreen} 
            options={{ title: 'Configurar MFA' }} 
          />
          <Stack.Screen 
            name="MFAVerification" 
            component={MFAVerificationScreen} 
            options={{ title: 'Verificação MFA' }} 
          />
          <Stack.Screen 
            name="BackupManagement" 
            component={BackupManagementScreen} 
            options={{ title: 'Gestão de Backups' }} 
          />
          <Stack.Screen 
            name="TicketingManagement" 
            component={TicketingManagementScreen} 
            options={{ title: 'Gestão de Tickets' }} 
          />
          <Stack.Screen 
            name="AIAgentsManagement" 
            component={AIAgentsManagementScreen} 
            options={{ title: 'Gestão de Agentes IA' }} 
          />
          <Stack.Screen 
            name="IntelligenceEngineManagement" 
            component={IntelligenceEngineManagementScreen} 
            options={{ title: 'Motor de Inteligência' }} 
          />
          <Stack.Screen 
            name="MatchingManagement" 
            component={MatchingManagementScreen} 
            options={{ title: 'Gestão de Matching' }} 
          />
          <Stack.Screen 
            name="PricingDashboard" 
            component={PricingDashboardScreen} 
            options={{ title: 'Dashboard de Preços' }} 
          />
          <Stack.Screen 
            name="Notifications" 
            component={NotificationsScreen} 
            options={{ title: 'Notificações e Alertas' }} 
          />
          <Stack.Screen 
            name="AIAlerts" 
            component={AIAlertsScreen} 
            options={{ title: 'Alertas de IA' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SupabaseProvider>
  );
};

export default App;