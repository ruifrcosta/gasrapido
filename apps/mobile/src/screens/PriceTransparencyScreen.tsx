// @ts-nocheck
import React from 'react';
import { View, StyleSheet } from 'react-native';
import PriceTransparencyComponent from '@gasrapido/ui/src/PriceTransparencyComponent';

const PriceTransparencyScreen = () => {
  const handlePriceAccepted = () => {
    console.log('Preço aceito pelo usuário');
    // Aqui você poderia navegar para a próxima tela ou confirmar o pedido
  };

  return (
    <View style={styles.container}>
      <PriceTransparencyComponent 
        productId="gas-123"
        basePrice={2500}
        currentPrice={3200}
        onPriceAccepted={handlePriceAccepted}
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

export default PriceTransparencyScreen;