// Type definitions for React Navigation in GasRápido

// Declare modules to avoid TypeScript errors
declare module '@react-navigation/native' {
  export type NavigationProp<P = ParamListBase, RouteName extends keyof P = keyof P> = any;
  export type ParamListBase = any;
}
declare module '@react-navigation/bottom-tabs' {
  export const createBottomTabNavigator: any;
}
declare module '@react-navigation/stack' {
  export const createStackNavigator: any;
}
declare module '@expo/vector-icons' {
  export const Ionicons: any;
}
declare module 'react' {
  export const useState: any;
  export const useEffect: any;
  export default function React(): any;
}
declare module 'react-native' {
  export const View: any;
  export const Text: any;
  export const StyleSheet: any;
  export const ScrollView: any;
  export const TouchableOpacity: any;
  export const Image: any;
  export const Dimensions: any;
  export const TextInput: any;
  export const Alert: any;
}
declare module 'expo-constants' {
  const Constants: any;
  export default Constants;
}

export type RootStackParamList = {
  Home: undefined;
  OrderGas: undefined;
  TrackOrder: { orderId: string };
};

export type HomeStackParamList = {
  HomeMain: undefined;
  OrderGas: undefined;
};

export type OrdersStackParamList = {
  OrdersMain: undefined;
  TrackOrder: { orderId: string };
};

export type TabParamList = {
  Home: undefined;
  Pedidos: undefined;
  Carteira: undefined;
  Perfil: undefined;
};