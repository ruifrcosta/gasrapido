import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../utils/theme';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: 'https://via.placeholder.com/80x80/1F3A93/FFFFFF?text=U' }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>João Silva</Text>
        <Text style={styles.profilePhone}>+244 912 345 678</Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Options */}
      <View style={styles.menuSection}>
        {menuOptions.map((option) => (
          <TouchableOpacity key={option.id} style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name={option.icon as any} size={24} color={Colors.primary} />
              <Text style={styles.menuItemText}>{option.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
          </TouchableOpacity>
        ))}

        {/* Notifications Toggle */}
        <View style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="notifications" size={24} color={Colors.primary} />
            <Text style={styles.menuItemText}>Notificações</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: Colors.lightGray, true: Colors.primary }}
            thumbColor={notificationsEnabled ? Colors.white : Colors.gray}
          />
        </View>
      </View>

      {/* Support Section */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Suporte</Text>
        
        {supportOptions.map((option) => (
          <TouchableOpacity key={option.id} style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name={option.icon as any} size={24} color={Colors.primary} />
              <Text style={styles.menuItemText}>{option.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="log-out" size={20} color={Colors.error} />
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>

      {/* App Version */}
      <Text style={styles.versionText}>Versão 1.0.0</Text>
    </ScrollView>
  );
}

const menuOptions = [
  {
    id: 1,
    title: 'Endereços Salvos',
    icon: 'location',
  },
  {
    id: 2,
    title: 'Histórico de Pedidos',
    icon: 'time',
  },
  {
    id: 3,
    title: 'Métodos de Pagamento',
    icon: 'card',
  },
  {
    id: 4,
    title: 'Convites e Promoções',
    icon: 'gift',
  },
  {
    id: 5,
    title: 'Configurações',
    icon: 'settings',
  },
];

const supportOptions = [
  {
    id: 1,
    title: 'Central de Ajuda',
    icon: 'help-circle',
  },
  {
    id: 2,
    title: 'Contactar Suporte',
    icon: 'chatbubble',
  },
  {
    id: 3,
    title: 'Sobre o GasRápido',
    icon: 'information-circle',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral,
  },
  profileHeader: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  profileName: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  profilePhone: {
    fontSize: Typography.sizes.md,
    color: Colors.gray,
    marginBottom: Spacing.md,
  },
  editButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  editButtonText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.white,
  },
  menuSection: {
    backgroundColor: Colors.white,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.gray,
    padding: Spacing.md,
    paddingBottom: 0,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: Typography.sizes.md,
    color: Colors.black,
    marginLeft: Spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  logoutText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: Colors.error,
    marginLeft: Spacing.sm,
  },
  versionText: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
});