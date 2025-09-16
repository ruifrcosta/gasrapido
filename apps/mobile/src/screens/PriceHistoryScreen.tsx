// @ts-nocheck
import React from 'react';
import { View, StyleSheet } from 'react-native';
import PriceHistoryComponent from '@gasrapido/ui/src/PriceHistoryComponent';

const PriceHistoryScreen = () => {
  const handleTimeRangeChange = (range: string) => {
    console.log('Período alterado para:', range);
    // Aqui você poderia recarregar os dados com o novo período
  };

  return (
    <View style={styles.container}>
      <PriceHistoryComponent 
        productId="gas-123"
        productName="Gás de Cozinha 13kg"
        currentPrice={3200}
        onTimeRangeChange={handleTimeRangeChange}
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

export default PriceHistoryScreen;