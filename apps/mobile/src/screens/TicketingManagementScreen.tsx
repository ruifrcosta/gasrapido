import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { TicketingManagementComponent } from '@gasrapido/ui/src/TicketingManagementComponent';

export const TicketingManagementScreen: React.FC = () => {
  // Em uma implementação real, este ID viria do contexto de autenticação
  const userId = 'user-demo-123';

  const handleTicketCreated = (ticket: any) => {
    console.log('Ticket criado:', ticket);
    // Aqui você poderia atualizar o estado da aplicação ou enviar notificações
  };

  const handleTicketUpdated = (ticket: any) => {
    console.log('Ticket atualizado:', ticket);
    // Aqui você poderia atualizar o estado da aplicação ou enviar notificações
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ flex: 1, padding: 16 }}>
          <TicketingManagementComponent 
            userId={userId}
            onTicketCreated={handleTicketCreated}
            onTicketUpdated={handleTicketUpdated}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};