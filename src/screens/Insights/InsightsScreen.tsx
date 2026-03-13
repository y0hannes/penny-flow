import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme';
import {
  Text,
  SegmentedControl,
  DonutChart,
  LineChart,
} from '@/components/ui';
import { useExpenses } from '@/context/ExpenseContext';

const { width } = Dimensions.get('window');

export default function InsightsScreen() {
  const insets = useSafeAreaInsets();
  const { expenses } = useExpenses();
  const [selectedTab, setSelectedTab] = useState('Monthly');

  // Helper to parse dates from the mock data
  const parseDate = (dateStr: string) => {
    if (dateStr.includes('Today')) return new Date();
    if (dateStr.includes('Yesterday')) {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return d;
    }
    // Handle formats like "Mar 01, 2026" or "Oct 24, 02:00 PM"
    return new Date(dateStr);
  };

  const filteredExpenses = useMemo(() => {
    const now = new Date();
    const currentYear = 2026; // Since our mock data is set in 2026
    const currentMonth = 2; // March is index 2

    return expenses.filter(exp => {
      if (exp.type !== 'expense') return false;
      const expDate = parseDate(exp.date);

      if (selectedTab === 'Weekly') {
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(now.getDate() - 7);
        return expDate >= oneWeekAgo;
      } else if (selectedTab === 'Monthly') {
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
      } else if (selectedTab === 'Yearly') {
        return expDate.getFullYear() === currentYear || expDate.getFullYear() === 2025;
      }
      return true;
    });
  }, [expenses, selectedTab]);

  // Calculate stats based on filtered expenses
  const totalSpent = useMemo(() => {
    return filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [filteredExpenses]);

  const categoriesStats = useMemo(() => {
    const statsMap = new Map<string, { amount: number; count: number; icon: string; color: string }>();

    // Base categories for visuals
    const categoryConfig: Record<string, { icon: string; color: string }> = {
      Housing: { icon: 'home', color: '#00D09C' },
      Food: { icon: 'restaurant', color: '#FFB100' },
      Transport: { icon: 'car', color: '#4D9AFF' },
      Shopping: { icon: 'cart', color: '#FF4D4D' },
      Bills: { icon: 'flash', color: '#9C27B0' },
      Entertainment: { icon: 'wine', color: '#FF9800' },
      Health: { icon: 'fitness', color: '#E91E63' },
    };

    filteredExpenses.forEach(exp => {
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

    const categories = Array.from(statsMap.entries()).map(([label, stat]) => ({
      label,
      ...stat,
      percentage: (stat.amount / (totalSpent || 1)) * 100
    }));

    return categories.sort((a, b) => b.amount - a.amount);
  }, [filteredExpenses, totalSpent]);

  const donutData = useMemo(() => {
    if (categoriesStats.length === 0) return [{ percentage: 100, color: '#F0F0F0' }];
    return categoriesStats.map(stat => ({
      percentage: stat.percentage,
      color: stat.color
    }));
  }, [categoriesStats]);

  // Mock trend data for line chart
  const trendData = selectedTab === 'Weekly' ? [120, 150, 80, 100, 140, 90, 110] : [150, 180, 120, 220, 190, 242, 210, 280];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text variant="subheading" bold color="textPrimary">
          Analytics
        </Text>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="calendar-outline" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Period Selector Tabs */}
        <SegmentedControl
          options={['Weekly', 'Monthly', 'Yearly']}
          selectedOption={selectedTab}
          onSelect={setSelectedTab}
        />

        <View style={styles.summarySection}>
          <Text variant="caption" color="textSecondary" bold align="center" style={styles.summaryLabel}>
            Total spent this month
          </Text>
          <Text style={styles.totalAmount}>
            ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <View style={styles.trendContainer}>
            <Ionicons name="trending-up" size={16} color={theme.colors.danger} />
            <Text variant="caption" color="danger" bold style={styles.trendText}>
              +8.4% vs last month
            </Text>
          </View>
        </View>

        {/* Donut Chart */}
        <View style={styles.chartContainer}>
          <DonutChart data={donutData} />
        </View>

        {/* Daily Trends Card */}
        <View style={styles.trendsCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text variant="body" bold color="textPrimary">Daily Trends</Text>
              <Text variant="caption" color="textTertiary">August 1 - August 31</Text>
            </View>
            <TouchableOpacity style={styles.detailsButton}>
              <Text variant="caption" bold color="primary">Details</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.lineChartWrapper}>
            <LineChart data={trendData} />
            {/* Tooltip mockup */}
            <View style={styles.tooltip}>
              <Text style={styles.tooltipText}>$242.00</Text>
            </View>
          </View>
        </View>

        {/* Top Categories */}
        <View style={styles.sectionHeader}>
          <Text variant="subheading" bold color="textPrimary">Top Categories</Text>
          <TouchableOpacity>
            <Text variant="link" color="primary">View All</Text>
          </TouchableOpacity>
        </View>

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

        {/* Padding for Bottom Nav */}
        <View style={{ height: 100 }} />
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
  },
  summarySection: {
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  summaryLabel: {
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 42,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  trendText: {
    marginLeft: 4,
  },
  chartContainer: {
    marginVertical: theme.spacing.xl,
  },
  trendsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: theme.spacing.md,
    borderRadius: 24,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lineChartWrapper: {
    marginTop: 10,
    alignItems: 'center',
  },
  tooltip: {
    position: 'absolute',
    top: 0,
    right: 30,
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: theme.fonts.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  categoryList: {
    paddingHorizontal: theme.spacing.md,
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
