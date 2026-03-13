import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme';
import { Text } from '@/components/ui';
import { useExpenses } from '@/context/ExpenseContext';
import { useNavigation } from '@react-navigation/native';

export default function AllCategoriesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { expenses } = useExpenses();

  const parseDate = (dateStr: string) => {
    if (dateStr.includes('Today')) return new Date();
    if (dateStr.includes('Yesterday')) {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return d;
    }
    return new Date(dateStr);
  };

  const categoriesStats = useMemo(() => {
    const statsMap = new Map<string, { amount: number; count: number; icon: string; color: string }>();

    const categoryConfig: Record<string, { icon: string; color: string }> = {
      Housing: { icon: 'home', color: '#00D09C' },
      Food: { icon: 'restaurant', color: '#FFB100' },
      Transport: { icon: 'car', color: '#4D9AFF' },
      Shopping: { icon: 'cart', color: '#FF4D4D' },
      Bills: { icon: 'flash', color: '#9C27B0' },
      Entertainment: { icon: 'wine', color: '#FF9800' },
      Health: { icon: 'fitness', color: '#E91E63' },
    };

    const expenseItems = expenses.filter(exp => exp.type === 'expense');
    const totalSpent = expenseItems.reduce((sum, exp) => sum + exp.amount, 0);

    expenseItems.forEach(exp => {
      const existing = statsMap.get(exp.category);
      const config = categoryConfig[exp.category] || { icon: 'help', color: '#7A7A7A' };

      if (existing) {
        existing.amount += exp.amount;
        existing.count += 1;
      } else {
        statsMap.set(exp.category, {
          amount: exp.amount,
          count: 1,
          icon: config.icon,
          color: config.color,
        });
      }
    });

    return Array.from(statsMap.entries()).map(([label, stat]) => ({
      label,
      ...stat,
      percentage: (stat.amount / (totalSpent || 1)) * 100
    })).sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text variant="subheading" bold color="textPrimary">
          All Categories
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.categoryList}>
          {categoriesStats.map((item, index) => (
            <View key={index} style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: `${item.color}15` }]}>
                <Ionicons name={item.icon as any} size={20} color={item.color} />
              </View>
              <View style={styles.categoryContent}>
                <View style={styles.categoryInfoRow}>
                  <View>
                    <Text variant="body" bold color="textPrimary">{item.label}</Text>
                    <Text variant="caption" color="textTertiary">{item.count} Transactions</Text>
                  </View>
                  <View style={styles.categoryAmountInfo}>
                    <Text variant="body" bold color="textPrimary">
                      ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </Text>
                    <Text variant="caption" color="textTertiary" align="right">{Math.round(item.percentage)}%</Text>
                  </View>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressBar, { width: `${item.percentage}%`, backgroundColor: item.color }]} />
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  categoryList: {
    marginTop: theme.spacing.md,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  categoryContent: {
    flex: 1,
  },
  categoryInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryAmountInfo: {
    alignItems: 'flex-end',
  },
  progressTrack: {
    height: 6,
    width: '100%',
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
});
