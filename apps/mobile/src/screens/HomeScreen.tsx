import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../utils/theme';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const handleOrderGas = () => {
    navigation.navigate('OrderGas');
  };

  const handleEmergencyOrder = () => {
    // TODO: Navigate to emergency order
    console.log('Pedido de emergência');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Bem-vindo!</Text>
          <Text style={styles.locationText}>
            <Ionicons name="location-outline" size={16} color={Colors.gray} />
            {' '}Luanda, Angola
          </Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.primaryAction} onPress={handleOrderGas}>
          <Ionicons name="flame" size={32} color={Colors.white} />
          <Text style={styles.primaryActionText}>Pedir Gás</Text>
          <Text style={styles.primaryActionSubtext}>Entrega rápida e segura</Text>
        </TouchableOpacity>

        <View style={styles.secondaryActions}>
          <TouchableOpacity style={styles.secondaryAction} onPress={handleEmergencyOrder}>
            <Ionicons name="alert-circle" size={24} color={Colors.error} />
            <Text style={styles.secondaryActionText}>Emergência</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryAction}>
            <Ionicons name="time" size={24} color={Colors.accent} />
            <Text style={styles.secondaryActionText}>Agendar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Gas Stations Nearby */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Fornecedores Próximos</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {mockGasStations.map((station) => (
            <View key={station.id} style={styles.stationCard}>
              <Image source={{ uri: station.image }} style={styles.stationImage} />
              <Text style={styles.stationName}>{station.name}</Text>
              <Text style={styles.stationDistance}>{station.distance}</Text>
              <Text style={styles.stationPrice}>AOA {station.price}</Text>
              <View style={styles.stationRating}>
                <Ionicons name="star" size={12} color={Colors.accent} />
                <Text style={styles.ratingText}>{station.rating}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Recent Orders */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pedidos Recentes</Text>
        {mockRecentOrders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderStation}>{order.stationName}</Text>
              <Text style={styles.orderDate}>{order.date}</Text>
            </View>
            <View style={styles.orderStatus}>
              <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                {order.status}
              </Text>
            </View>
          </View>
        ))}
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

const mockGasStations = [
  {
    id: 1,
    name: 'Posto Central',
    distance: '0.5 km',
    price: '8.500',
    rating: '4.8',
    image: 'https://via.placeholder.com/100x80/1F3A93/FFFFFF?text=GAS',
  },
  {
    id: 2,
    name: 'Gás Express',
    distance: '1.2 km',
    price: '8.200',
    rating: '4.5',
    image: 'https://via.placeholder.com/100x80/1F3A93/FFFFFF?text=GAS',
  },
  {
    id: 3,
    name: 'Botija Rápida',
    distance: '2.1 km',
    price: '8.800',
    rating: '4.7',
    image: 'https://via.placeholder.com/100x80/1F3A93/FFFFFF?text=GAS',
  },
];

const mockRecentOrders = [
  {
    id: 1,
    stationName: 'Posto Central',
    date: '23 Nov, 14:30',
    status: 'Entregue',
  },
  {
    id: 2,
    stationName: 'Gás Express',
    date: '22 Nov, 10:15',
    status: 'Em andamento',
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
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  locationText: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray,
  },
  notificationButton: {
    padding: Spacing.sm,
  },
  quickActions: {
    padding: Spacing.md,
  },
  primaryAction: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  primaryActionText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
    marginTop: Spacing.sm,
  },
  primaryActionSubtext: {
    fontSize: Typography.sizes.sm,
    color: Colors.white,
    opacity: 0.8,
    marginTop: Spacing.xs,
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
  stationCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginRight: Spacing.md,
    width: 120,
    ...Shadows.sm,
  },
  stationImage: {
    width: '100%',
    height: 60,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  stationName: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  stationDistance: {
    fontSize: Typography.sizes.xs,
    color: Colors.gray,
    marginBottom: Spacing.xs,
  },
  stationPrice: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  stationRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: Typography.sizes.xs,
    color: Colors.gray,
    marginLeft: Spacing.xs / 2,
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
  orderStation: {
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
});