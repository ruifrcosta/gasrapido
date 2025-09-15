import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../utils/theme';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

interface OrdersScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

export default function OrdersScreen({ navigation }: OrdersScreenProps) {
  const handleTrackOrder = (orderId: string) => {
    navigation.navigate('TrackOrder', { orderId });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Pedidos</Text>
      </View>

      {mockOrders.map((order) => (
        <View key={order.id} style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderId}>#{order.id}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
              <Text style={styles.statusText}>{order.status}</Text>
            </View>
          </View>

          <View style={styles.orderDetails}>
            <Text style={styles.supplierName}>{order.supplierName}</Text>
            <Text style={styles.orderDate}>{order.date}</Text>
            <Text style={styles.orderPrice}>AOA {order.price}</Text>
          </View>

          <View style={styles.orderActions}>
            <TouchableOpacity 
              style={styles.trackButton}
              onPress={() => handleTrackOrder(order.id)}
            >
              <Ionicons name="location" size={16} color={Colors.primary} />
              <Text style={styles.trackButtonText}>Rastrear</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.contactButton}>
              <Ionicons name="call" size={16} color={Colors.accent} />
              <Text style={styles.contactButtonText}>Contactar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Entregue':
      return Colors.success;
    case 'Em andamento':
      return Colors.accent;
    case 'Cancelado':
      return Colors.error;
    case 'Pendente':
      return Colors.gray;
    default:
      return Colors.gray;
  }
};

const mockOrders = [
  {
    id: '001',
    supplierName: 'Posto Central',
    date: '12 Set, 2025 - 14:30',
    price: '8.500',
    status: 'Em andamento',
  },
  {
    id: '002',
    supplierName: 'Gás Express',
    date: '11 Set, 2025 - 10:15',
    price: '8.200',
    status: 'Entregue',
  },
  {
    id: '003',
    supplierName: 'Botija Rápida',
    date: '10 Set, 2025 - 16:45',
    price: '8.800',
    status: 'Entregue',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral,
  },
  header: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
  },
  orderCard: {
    backgroundColor: Colors.white,
    margin: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  orderId: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    color: Colors.white,
  },
  orderDetails: {
    marginBottom: Spacing.md,
  },
  supplierName: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  orderDate: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray,
    marginBottom: Spacing.xs,
  },
  orderPrice: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    flex: 0.48,
    justifyContent: 'center',
  },
  trackButtonText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.primary,
    marginLeft: Spacing.xs,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    flex: 0.48,
    justifyContent: 'center',
  },
  contactButtonText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.accent,
    marginLeft: Spacing.xs,
  },
});