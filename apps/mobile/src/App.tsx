import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from './screens/HomeScreen';
import OrdersScreen from './screens/OrdersScreen';
import WalletScreen from './screens/WalletScreen';
import ProfileScreen from './screens/ProfileScreen';
import OrderGasScreen from './screens/OrderGasScreen';
import TrackOrderScreen from './screens/TrackOrderScreen';

// Theme
import { Colors } from './utils/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen}
        options={{ title: 'Início' }}
      />
      <Stack.Screen 
        name="OrderGas" 
        component={OrderGasScreen}
        options={{ title: 'Pedir Gás' }}
      />
    </Stack.Navigator>
  );
}

function OrdersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="OrdersMain" 
        component={OrdersScreen}
        options={{ title: 'Meus Pedidos' }}
      />
      <Stack.Screen 
        name="TrackOrder" 
        component={TrackOrderScreen}
        options={{ title: 'Rastrear Pedido' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }: { route: any }) => ({
          tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Pedidos') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'Carteira') {
              iconName = focused ? 'wallet' : 'wallet-outline';
            } else if (route.name === 'Perfil') {
              iconName = focused ? 'person' : 'person-outline';
            } else {
              iconName = 'ellipse';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.gray,
          tabBarStyle: {
            backgroundColor: Colors.white,
            borderTopWidth: 1,
            borderTopColor: Colors.lightGray,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeStack}
          options={{ title: 'Início' }}
        />
        <Tab.Screen 
          name="Pedidos" 
          component={OrdersStack}
          options={{ title: 'Pedidos' }}
        />
        <Tab.Screen 
          name="Carteira" 
          component={WalletScreen}
          options={{ title: 'Carteira' }}
        />
        <Tab.Screen 
          name="Perfil" 
          component={ProfileScreen}
          options={{ title: 'Perfil' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}