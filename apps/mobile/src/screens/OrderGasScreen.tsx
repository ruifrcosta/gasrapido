import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// @ts-ignore
import { OrderService } from '@gasrapido/shared';
// @ts-ignore
import { supabase } from '../services/supabase';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../utils/theme';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

interface OrderFormData {
  productId: string;
  quantity: number;
  deliveryAddress: string;
  deliveryLocation: {
    lat: number;
    lng: number;
  };
  specialInstructions: string;
}

interface OrderGasScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

export default function OrderGasScreen({ navigation }: OrderGasScreenProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    productId: 'gas-13kg', // ID do produto padrão
    quantity: 1,
    deliveryAddress: '',
    deliveryLocation: {
      lat: -8.839078,
      lng: 13.289393, // Coordenadas padrão para Luanda
    },
    specialInstructions: '',
  });

  const [loading, setLoading] = useState(false);
  
  // Inicializar o serviço de pedidos
  const orderService = new OrderService(supabase);

  const handlePlaceOrder = async () => {
    if (!formData.deliveryAddress.trim()) {
      Alert.alert('Erro', 'Por favor, insira o endereço de entrega');
      return;
    }

    setLoading(true);
    
    try {
      // Obter o ID do cliente (simulação - em uma implementação real, você obteria do contexto de autenticação)
      const customerId = 'customer-id-placeholder'; // Substituir com o ID real do cliente
      
      // Preparar os dados do pedido
      const orderData = {
        items: [{
          productId: formData.productId,
          quantity: formData.quantity,
          price: 8500 // Preço em AOA
        }],
        deliveryAddress: formData.deliveryAddress,
        deliveryLocation: formData.deliveryLocation,
        specialInstructions: formData.specialInstructions,
        customerId: customerId
      };
      
      // Chamar o serviço real para criar o pedido
      const response = await orderService.createOrder(orderData);
      
      if (response.success) {
        Alert.alert(
          'Pedido Confirmado!',
          'Seu pedido foi registrado com sucesso. Você receberá atualizações sobre o status da entrega.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Pedidos'),
            },
          ]
        );
      } else {
        Alert.alert('Erro', response.error || 'Falha ao registrar o pedido. Por favor, tente novamente.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao registrar o pedido. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (value: number) => {
    if (value >= 1 && value <= 10) {
      setFormData({ ...formData, quantity: value });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pedir Gás</Text>
        <View style={{ width: 24 }} /> {/* Spacer para centralizar o título */}
      </View>

      <View style={styles.content}>
        {/* Seleção de Produto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Produto</Text>
          <View style={styles.productCard}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>Botija de Gás 13kg</Text>
              <Text style={styles.productPrice}>AOA 8.500</Text>
            </View>
            <View style={styles.quantitySelector}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => updateQuantity(formData.quantity - 1)}
                disabled={formData.quantity <= 1}
              >
                <Ionicons name="remove" size={20} color={Colors.primary} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{formData.quantity}</Text>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => updateQuantity(formData.quantity + 1)}
                disabled={formData.quantity >= 10}
              >
                <Ionicons name="add" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Endereço de Entrega */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Endereço de Entrega</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu endereço completo"
            value={formData.deliveryAddress}
            onChangeText={(text: string) => setFormData({ ...formData, deliveryAddress: text })}
            multiline
            numberOfLines={3}
          />
          
          <TouchableOpacity style={styles.locationButton}>
            <Ionicons name="location" size={20} color={Colors.primary} />
            <Text style={styles.locationButtonText}>Usar localização atual</Text>
          </TouchableOpacity>
        </View>

        {/* Instruções Especiais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instruções Especiais</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Alguma instrução especial para o entregador? (opcional)"
            value={formData.specialInstructions}
            onChangeText={(text: string) => setFormData({ ...formData, specialInstructions: text })}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Resumo do Pedido */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>AOA {8500 * formData.quantity}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Taxa de Entrega</Text>
            <Text style={styles.summaryValue}>AOA 1.500</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>AOA {8500 * formData.quantity + 1500}</Text>
          </View>
        </View>

        {/* Botão de Confirmar Pedido */}
        <TouchableOpacity 
          style={[styles.confirmButton, loading && styles.disabledButton]}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <Ionicons name="hourglass" size={20} color={Colors.white} />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
              <Text style={styles.confirmButtonText}>Confirmar Pedido</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  headerTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
  },
  content: {
    padding: Spacing.md,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
    marginBottom: Spacing.md,
  },
  productCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  productPrice: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral,
    borderRadius: BorderRadius.full,
  },
  quantityButton: {
    padding: Spacing.sm,
  },
  quantityText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
    minWidth: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.sizes.md,
    color: Colors.black,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neutral,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.sm,
  },
  locationButtonText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: Colors.primary,
    marginLeft: Spacing.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
  },
  summaryLabel: {
    fontSize: Typography.sizes.md,
    color: Colors.gray,
  },
  summaryValue: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: Colors.black,
  },
  totalLabel: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
  },
  totalValue: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginVertical: Spacing.md,
  },
  disabledButton: {
    opacity: 0.7,
  },
  confirmButtonText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
    marginLeft: Spacing.xs,
  },
});