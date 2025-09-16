// @ts-nocheck
import React from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { BackupManagementComponent } from '@gasrapido/ui/src/BackupManagementComponent';

export const BackupManagementScreen: React.FC = () => {
  const handleBackupCreated = (status: any) => {
    console.log('Backup criado:', status);
    // Aqui você poderia atualizar o estado da aplicação ou enviar notificações
  };

  const handleBackupRestored = (success: boolean) => {
    console.log('Backup restaurado:', success);
    // Aqui você poderia atualizar o estado da aplicação ou enviar notificações
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4">
        <View className="mb-6">
          <BackupManagementComponent 
            onBackupCreated={handleBackupCreated}
            onBackupRestored={handleBackupRestored}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};