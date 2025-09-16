// @ts-nocheck
import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { MatchingManagementComponent } from '@gasrapido/ui/src/MatchingManagementComponent';

export const MatchingManagementScreen: React.FC = () => {
  // Em uma implementação real, este ID viria do contexto de autenticação
  const userId = 'admin-demo-123';

  const handleOrderMatched = (matchResult: any) => {
    console.log('Pedido matched:', matchResult);
    // Aqui você poderia atualizar o estado da aplicação ou enviar notificações
  };

  const handleRouteGenerated = (routingResult: any) => {
    console.log('Rota gerada:', routingResult);
    // Aqui você poderia atualizar o estado da aplicação ou enviar notificações
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ flex: 1, padding: 16 }}>
          <MatchingManagementComponent 
            userId={userId}
            onOrderMatched={handleOrderMatched}
            onRouteGenerated={handleRouteGenerated}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};