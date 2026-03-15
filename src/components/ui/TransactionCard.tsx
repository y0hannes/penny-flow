import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme as staticTheme } from '@/theme';
import Text from './Text';
import { TransactionType } from '@/types/ui-variants';
import { useExpenses } from '@/context/ExpenseContext';
import { useTheme } from '@/context/ThemeContext';

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
  const { currency, stealthMode } = useExpenses();
  const { theme, isDark } = useTheme();
  const isExpense = type === 'expense';
  const amountPrefix = isExpense ? '-' : '+';
  const amountColor = isExpense ? 'textPrimary' : 'success';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.container, { backgroundColor: theme.colors.background, borderBottomColor: isDark ? '#2C2C2C' : '#F5F5F5' }]}
    >
      <View style={styles.iconContainer}>
        <View style={[styles.iconCircle, { backgroundColor: isDark ? theme.colors.unselectedCategoryBg : '#F7F8F9' }]}>
          <Ionicons name={icon} size={24} color={theme.colors.textPrimary} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="body" bold color="textPrimary">
            {title}
          </Text>
          <Text variant="body" bold color={amountColor}>
            {amountPrefix}{stealthMode ? '••••' : amount.toFixed(2)} {currency.symbol}
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
    paddingVertical: staticTheme.spacing.md,
    paddingHorizontal: staticTheme.spacing.md,
    borderRadius: staticTheme.borderRadius.medium,
    marginBottom: staticTheme.spacing.sm,
    borderBottomWidth: 1,
  },
  iconContainer: {
    marginRight: staticTheme.spacing.md,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
