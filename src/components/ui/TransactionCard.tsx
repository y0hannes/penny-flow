import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme';
import Text from './Text';
import { TransactionType } from '@/types/ui-variants';

interface TransactionCardProps {
  title: string;
  category: string;
  amount: number;
  date: string;
  type: TransactionType;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}

const TransactionCard = ({
  title,
  category,
  amount,
  date,
  type,
  icon,
  onPress,
}: TransactionCardProps) => {
  const isExpense = type === 'expense';
  const amountPrefix = isExpense ? '-' : '+';
  const amountColor = isExpense ? 'textPrimary' : 'success';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.container}
    >
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name={icon} size={24} color={theme.colors.textPrimary} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="body" bold color="textPrimary">
            {title}
          </Text>
          <Text variant="body" bold color={amountColor}>
            {amountPrefix}${amount.toFixed(2)}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text variant="caption" color="textTertiary">
            {date}
          </Text>
          <Text variant="caption" color="textTertiary">
            {category}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.sm,
    // Add subtle border similar to design
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  iconContainer: {
    marginRight: theme.spacing.md,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F7F8F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default TransactionCard;
