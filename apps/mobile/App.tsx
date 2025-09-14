import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import App from './src/App';

// Polyfill for URL required by Supabase
import 'react-native-url-polyfill/auto';

export default function Main() {
  return (
    <SafeAreaProvider>
      <App />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

registerRootComponent(Main);