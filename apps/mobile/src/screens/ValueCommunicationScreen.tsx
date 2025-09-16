// @ts-nocheck
import React from 'react';
import { View, StyleSheet } from 'react-native';
import ValueCommunicationComponent from '@gasrapido/ui/src/ValueCommunicationComponent';

const ValueCommunicationScreen = () => {
  const handleValueAccepted = () => {
    console.log('Valor aceito pelo usuário');
    // Aqui você poderia navegar para a próxima tela ou confirmar o pedido
  };

  const handleLearnMore = (topic: string) => {
    console.log('Saber mais sobre:', topic);
    // Aqui você poderia abrir um modal com informações detalhadas sobre o tópico
  };

  return (
    <View style={styles.container}>
      <ValueCommunicationComponent 
        productId="gas-123"
        productName="Gás de Cozinha 13kg"
        currentPrice={3200}
        onValueAccepted={handleValueAccepted}
        onLearnMore={handleLearnMore}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default ValueCommunicationScreen;