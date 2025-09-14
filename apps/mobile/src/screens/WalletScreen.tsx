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

export default function WalletScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo Disponível</Text>
        <Text style={styles.balanceAmount}>AOA 25.400</Text>
        <TouchableOpacity style={styles.addFundsButton}>
          <Ionicons name="add" size={20} color={Colors.white} />
          <Text style={styles.addFundsText}>Adicionar Fundos</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="card" size={24} color={Colors.primary} />
          <Text style={styles.actionText}>Cartão</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="phone-portrait" size={24} color={Colors.primary} />
          <Text style={styles.actionText}>Multicaixa</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="receipt" size={24} color={Colors.primary} />
          <Text style={styles.actionText}>Histórico</Text>
        </TouchableOpacity>
      </View>

      {/* Payment Methods */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Métodos de Pagamento</Text>
        
        {paymentMethods.map((method) => (
          <View key={method.id} style={styles.paymentMethodCard}>
            <View style={styles.methodInfo}>
              <Ionicons name={method.icon as any} size={24} color={Colors.primary} />
              <View style={styles.methodDetails}>
                <Text style={styles.methodName}>{method.name}</Text>
                <Text style={styles.methodDescription}>{method.description}</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transações Recentes</Text>
        
        {recentTransactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionCard}>
            <View style={styles.transactionInfo}>
              <View style={[styles.transactionIcon, { backgroundColor: getTransactionColor(transaction.type) }]}>
                <Ionicons 
                  name={transaction.type === 'payment' ? 'arrow-up' : 'arrow-down'} 
                  size={16} 
                  color={Colors.white} 
                />
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
            </View>
            <Text style={[styles.transactionAmount, { color: getTransactionColor(transaction.type) }]}>
              {transaction.type === 'payment' ? '-' : '+'}AOA {transaction.amount}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const getTransactionColor = (type: string) => {
  return type === 'payment' ? Colors.error : Colors.success;
};

const paymentMethods = [
  {
    id: 1,
    name: 'Multicaixa Express',
    description: 'Pagamento via telefone',
    icon: 'phone-portrait',
  },
  {
    id: 2,
    name: 'Cartão de Crédito',
    description: '**** **** **** 1234',
    icon: 'card',
  },
  {
    id: 3,
    name: 'Dinheiro',
    description: 'Pagamento na entrega',
    icon: 'cash',
  },
];

const recentTransactions = [
  {
    id: 1,
    title: 'Pagamento - Posto Central',
    date: '12 Set, 14:30',
    amount: '8.500',
    type: 'payment',
  },
  {
    id: 2,
    title: 'Recarga de Saldo',
    date: '11 Set, 09:15',
    amount: '20.000',
    type: 'credit',
  },
  {
    id: 3,
    title: 'Pagamento - Gás Express',
    date: '10 Set, 16:45',
    amount: '8.200',
    type: 'payment',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral,
  },
  balanceCard: {
    backgroundColor: Colors.primary,
    margin: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.lg,
  },
  balanceLabel: {
    fontSize: Typography.sizes.md,
    color: Colors.white,
    opacity: 0.8,
    marginBottom: Spacing.sm,
  },
  balanceAmount: {
    fontSize: Typography.sizes.xxxl,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
    marginBottom: Spacing.lg,
  },
  addFundsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  addFundsText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: Colors.white,
    marginLeft: Spacing.sm,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
    margin: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.black,
    marginTop: Spacing.sm,
  },
  section: {
    margin: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
    marginBottom: Spacing.md,
  },
  paymentMethodCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodDetails: {
    marginLeft: Spacing.md,
  },
  methodName: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  methodDescription: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray,
  },
  transactionCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionDetails: {
    marginLeft: Spacing.md,
  },
  transactionTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  transactionDate: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray,
  },
  transactionAmount: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
  },
});