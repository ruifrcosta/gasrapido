import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@gasrapido/ui/src/components/common/Button';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../utils/theme';

const { width } = Dimensions.get('window');

export default function ClientDashboardScreen() {
  const router = useRouter();

  const handleOrderGas = () => {
    router.push('/order-gas');
  };

  const handleViewOrders = () => {
    router.push('/orders');
  };

  const handleViewProfile = () => {
    router.push('/profile');
  };

  const handleViewWallet = () => {
    router.push('/wallet');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: 'https://via.placeholder.com/50x50/1F3A93/FFFFFF?text=U' }}
            style={styles.userAvatar}
          />
          <View>
            <Text style={styles.userName}>João Silva</Text>
            <Text style={styles.userPhone}>+244 912 345 678</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleViewProfile}>
          <Ionicons name="settings-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Button
          variant="primary"
          size="lg"
          onPress={handleOrderGas}
          style={styles.orderButton}
        >
          <Ionicons name="flame" size={20} color={Colors.white} />
          <Text style={styles.orderButtonText}>Pedir Gás</Text>
        </Button>

        <View style={styles.secondaryActions}>
          <TouchableOpacity style={styles.secondaryAction} onPress={handleViewOrders}>
            <Ionicons name="time" size={24} color={Colors.primary} />
            <Text style={styles.secondaryActionText}>Meus Pedidos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryAction} onPress={handleViewWallet}>
            <Ionicons name="wallet" size={24} color={Colors.primary} />
            <Text style={styles.secondaryActionText}>Carteira</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Orders */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pedidos Recentes</Text>
          <TouchableOpacity onPress={handleViewOrders}>
            <Text style={styles.seeAllText}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {recentOrders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderSupplier}>{order.supplier}</Text>
              <Text style={styles.orderDate}>{order.date}</Text>
            </View>
            <View style={styles.orderStatus}>
              <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                {order.status}
              </Text>
            </View>
          </View>
        ))}

        {recentOrders.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="time" size={48} color={Colors.gray} />
            <Text style={styles.emptyStateText}>Nenhum pedido ainda</Text>
            <Text style={styles.emptyStateSubtext}>
              Faça seu primeiro pedido de gás
            </Text>
          </View>
        )}
      </View>

      {/* Saved Addresses */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Endereços Salvos</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Gerenciar</Text>
          </TouchableOpacity>
        </View>

        {savedAddresses.map((address) => (
          <View key={address.id} style={styles.addressCard}>
            <Ionicons name="location" size={20} color={Colors.primary} />
            <View style={styles.addressInfo}>
              <Text style={styles.addressName}>{address.name}</Text>
              <Text style={styles.addressText}>{address.address}</Text>
            </View>
          </View>
        ))}

        {savedAddresses.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="location" size={48} color={Colors.gray} />
            <Text style={styles.emptyStateText}>Nenhum endereço salvo</Text>
            <Text style={styles.emptyStateSubtext}>
              Adicione um endereço para facilitar seus pedidos
            </Text>
            <Button
              variant="outline"
              size="sm"
              style={styles.addButton}
              onPress={() => router.push('/setup-address')}
            >
              Adicionar Endereço
            </Button>
          </View>
        )}
      </View>
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
    default:
      return Colors.gray;
  }
};

const recentOrders = [
  {
    id: 1,
    supplier: 'Posto Central',
    date: '23 Nov, 14:30',
    status: 'Entregue',
  },
  {
    id: 2,
    supplier: 'Gás Express',
    date: '22 Nov, 10:15',
    status: 'Em andamento',
  },
];

const savedAddresses = [
  {
    id: 1,
    name: 'Casa',
    address: 'Rua Exemplo, 123 - Bairro, Luanda',
  },
  {
    id: 2,
    name: 'Trabalho',
    address: 'Av. Principal, 456 - Bairro, Luanda',
  },
];

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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.md,
  },
  userName: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
  },
  userPhone: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray,
  },
  quickActions: {
    padding: Spacing.md,
  },
  orderButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  orderButtonText: {
    color: Colors.white,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    marginLeft: Spacing.sm,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryAction: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    flex: 0.48,
    ...Shadows.sm,
  },
  secondaryActionText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.black,
    marginTop: Spacing.sm,
  },
  section: {
    padding: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
  },
  seeAllText: {
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
    fontWeight: Typography.weights.medium,
  },
  orderCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Shadows.sm,
  },
  orderInfo: {
    flex: 1,
  },
  orderSupplier: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  orderDate: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray,
  },
  orderStatus: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
  addressCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.sm,
  },
  addressInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  addressName: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  addressText: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray,
  },
  emptyState: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyStateText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptyStateSubtext: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  addButton: {
    marginTop: Spacing.sm,
  },
});