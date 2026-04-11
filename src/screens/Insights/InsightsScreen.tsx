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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { theme as staticTheme } from '@/theme';
import {
  Text,
  SegmentedControl,
  DonutChart,
  LineChart,
} from '@/components/ui';
import { useExpenses } from '@/context/ExpenseContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

const { width } = Dimensions.get('window');

export default function InsightsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { expenses, currency, stealthMode, toggleStealthMode } = useExpenses();
  const { theme, isDark } = useTheme();
  const { t } = useLanguage();
  const [selectedTabIndex, setSelectedTabIndex] = useState(1); // 0=Weekly, 1=Monthly, 2=Yearly
  const [showAllCategories, setShowAllCategories] = useState(false);
  
  const tabOptions = [t('weekly'), t('monthly'), t('yearly')];

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

  const parseDateForFiltering = (exp: any) => {
    const d = exp.rawDate ? new Date(exp.rawDate) : parseDate(exp.date);
    return isNaN(d.getTime()) ? null : d;
  };

  const periodResults = useMemo(() => {
    const now = new Date();
    // Normalize "now" to end of day to include all of today's transactions
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    // Set up range for current period
    let currentStart: Date, currentEnd: Date;
    let prevStart: Date, prevEnd: Date;
    let labelKey = 'totalSpentThisMonth';
    let vsKey = 'vsLastMonth';
    let rangeLabel = '';

    if (selectedTabIndex === 0) { // Weekly (Last 7 Days)
      currentEnd = todayEnd;
      // Subtract 6 days from today's start to get a 7-day range INCLUDING today
      currentStart = new Date(todayStart);
      currentStart.setDate(todayStart.getDate() - 6);
      
      prevEnd = new Date(currentStart);
      prevEnd.setMilliseconds(-1); // One millisecond before current start
      prevStart = new Date(prevEnd);
      prevStart.setDate(prevStart.getDate() - 6);
      prevStart.setHours(0, 0, 0, 0);
      
      labelKey = 'totalSpentThisWeek';
      vsKey = 'vsLastWeek';
      rangeLabel = `${currentStart.toLocaleDateString(undefined, {month:'short', day:'numeric'})} - ${currentEnd.toLocaleDateString(undefined, {month:'short', day:'numeric'})}`;
    } else if (selectedTabIndex === 1) { // Monthly
      currentStart = new Date(currentYear, currentMonth, 1, 0, 0, 0, 0);
      currentEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);
      
      prevStart = new Date(currentYear, currentMonth - 1, 1, 0, 0, 0, 0);
      prevEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);
      
      labelKey = 'totalSpentThisMonth';
      vsKey = 'vsLastMonth';
      rangeLabel = currentStart.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    } else { // Yearly
      currentStart = new Date(currentYear, 0, 1, 0, 0, 0, 0);
      currentEnd = new Date(currentYear, 11, 31, 23, 59, 59, 999);
      
      prevStart = new Date(currentYear - 1, 0, 1, 0, 0, 0, 0);
      prevEnd = new Date(currentYear - 1, 11, 31, 23, 59, 59, 999);
      
      labelKey = 'totalSpentThisYear';
      vsKey = 'vsLastYear';
      rangeLabel = `Jan 1 - Dec 31, ${currentYear}`;
    }

    const currentExpenses = expenses.filter(exp => {
      if (exp.type !== 'expense') return false;
      const d = parseDateForFiltering(exp);
      return d && d >= currentStart && d <= currentEnd;
    });

    const previousExpenses = expenses.filter(exp => {
      if (exp.type !== 'expense') return false;
      const d = parseDateForFiltering(exp);
      return d && d >= prevStart && d <= prevEnd;
    });

    const currentTotal = currentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const prevTotal = previousExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    let trend = 0;
    if (prevTotal > 0) {
      trend = ((currentTotal - prevTotal) / prevTotal) * 100;
    }

    // Aggregating for LineChart
    let chartData: number[] = [];
    if (selectedTabIndex === 0) { // Last 7 days
      const days: Record<string, number> = {};
      for (let i = 0; i < 7; i++) {
        const d = new Date(currentStart);
        d.setDate(d.getDate() + i);
        days[d.toDateString()] = 0;
      }
      currentExpenses.forEach(exp => {
        const d = parseDateForFiltering(exp);
        // Normalize time for key comparison
        if (d) {
          const key = d.toDateString();
          if (days[key] !== undefined) {
             days[key] += exp.amount;
          }
        }
      });
      chartData = Object.values(days);
    } else if (selectedTabIndex === 1) { // Current Month (aggregated by weeks or bins of 4)
      const parts = 4;
      chartData = new Array(parts).fill(0);
      const daysInMonth = currentEnd.getDate();
      currentExpenses.forEach(exp => {
        const d = parseDateForFiltering(exp);
        if (d) {
          const day = d.getDate();
          const bin = Math.min(Math.floor((day - 1) / (daysInMonth / parts)), parts - 1);
          chartData[bin] += exp.amount;
        }
      });
    } else { // Current Year (aggregated by months)
      chartData = new Array(12).fill(0);
      currentExpenses.forEach(exp => {
        const d = parseDateForFiltering(exp);
        if (d) {
          chartData[d.getMonth()] += exp.amount;
        }
      });
    }

    if (chartData.every(v => v === 0)) chartData = [0, 0, 0, 0];

    return {
      currentExpenses,
      currentTotal,
      trend,
      labelKey,
      vsKey,
      rangeLabel,
      chartData
    };
  }, [expenses, selectedTabIndex]);

  const totalSpent = periodResults.currentTotal;
  const filteredExpenses = periodResults.currentExpenses;

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

  const trendData = periodResults.chartData;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text variant="subheading" bold color="textPrimary">
          {t('analytics')}
        </Text>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="calendar-outline" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Period Selector Tabs */}
        <SegmentedControl
          options={tabOptions}
          selectedOption={tabOptions[selectedTabIndex]}
          onSelect={(label) => setSelectedTabIndex(tabOptions.indexOf(label))}
        />

        <View style={styles.summarySection}>
          <Text variant="caption" color="textSecondary" bold align="center" style={styles.summaryLabel}>
            {t(periodResults.labelKey)}
          </Text>
          <View style={styles.totalAmountContainer}>
            <Text style={styles.totalAmount}>
              {stealthMode ? '••••' : totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency.symbol}
            </Text>
            <TouchableOpacity onPress={toggleStealthMode} style={styles.stealthToggle}>
              <Ionicons 
                name={stealthMode ? "eye-outline" : "eye-off-outline"} 
                size={24} 
                color={theme.colors.textTertiary} 
              />
            </TouchableOpacity>
          </View>
          <View style={styles.trendContainer}>
            <Ionicons name={periodResults.trend >= 0 ? "trending-up" : "trending-down"} size={16} color={periodResults.trend >= 0 ? theme.colors.danger : theme.colors.primary} />
            <Text variant="caption" color={periodResults.trend >= 0 ? "danger" : "primary"} bold style={styles.trendText}>
              {periodResults.trend >= 0 ? '+' : ''}{periodResults.trend.toFixed(1)}% {t(periodResults.vsKey)}
            </Text>
          </View>
        </View>

        {/* Donut Chart */}
        <View style={styles.chartContainer}>
          <DonutChart data={donutData} />
        </View>

        {/* Daily Trends Card */}
        <View
          style={[
            styles.trendsCard,
            { backgroundColor: isDark ? theme.colors.unselectedCategoryBg : '#FFFFFF' },
          ]}
        >
          <View style={styles.cardHeader}>
            <View>
              <Text variant="body" bold color="textPrimary">{t(selectedTabIndex === 2 ? 'monthlyTrends' : 'dailyTrends')}</Text>
              <Text variant="caption" color="textTertiary">{periodResults.rangeLabel}</Text>
            </View>
            <TouchableOpacity style={styles.detailsButton}>
              <Text variant="caption" bold color="primary">{t('details')}</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.lineChartWrapper}>
            <LineChart data={trendData} />
            {/* Tooltip mockup for the last point */}
            <View style={styles.tooltip}>
              <Text style={styles.tooltipText}>{stealthMode ? '••••' : trendData[trendData.length - 1].toLocaleString(undefined, { maximumFractionDigits: 2 })} {currency.symbol}</Text>
            </View>
          </View>
        </View>


        {/* Top Categories */}
        <View style={styles.sectionHeader}>
          <Text variant="subheading" bold color="textPrimary">{t('topCategories')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AllCategories')}>
            <Text variant="link" color="primary">{t('viewAll')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoryList}>
          {categoriesStats.slice(0, 3).map((item, index) => (
            <View key={index} style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: isDark ? `${item.color}33` : `${item.color}15` }]}>
                <Ionicons name={item.icon as any} size={20} color={item.color} />
              </View>
              <View style={styles.categoryContent}>
                <View style={styles.categoryInfoRow}>
                  <View>
                    <Text variant="body" bold color="textPrimary">{Object.keys(staticTheme.colors).includes(item.label) ? item.label : t(item.label.toLowerCase()) || item.label}</Text>
                    <Text variant="caption" color="textTertiary">{item.count} {t('transactions')}</Text>
                  </View>
                    <View style={styles.categoryAmountInfo}>
                      <Text variant="body" bold color="textPrimary">
                        {stealthMode ? '••••' : item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency.symbol}
                      </Text>
                      <Text variant="caption" color="textTertiary" align="right">{Math.round(item.percentage)}%</Text>
                    </View>
                </View>
                <View style={[styles.progressTrack, { backgroundColor: isDark ? '#2C2C2C' : '#F0F0F0' }]}>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: staticTheme.spacing.md,
    paddingVertical: staticTheme.spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingTop: staticTheme.spacing.md,
    paddingHorizontal: staticTheme.spacing.md,
  },
  summarySection: {
    alignItems: 'center',
    marginTop: staticTheme.spacing.lg,
    marginBottom: staticTheme.spacing.lg,
  },
  summaryLabel: {
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 42,
    fontFamily: staticTheme.fonts.bold,
  },
  totalAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stealthToggle: {
    marginLeft: 10,
    padding: 4,
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
    marginVertical: staticTheme.spacing.xl,
  },
  trendsCard: {
    marginHorizontal: staticTheme.spacing.md,
    borderRadius: 24,
    padding: staticTheme.spacing.lg,
    marginBottom: staticTheme.spacing.xl,
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
    marginBottom: staticTheme.spacing.lg,
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
    fontFamily: staticTheme.fonts.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: staticTheme.spacing.md,
    marginBottom: staticTheme.spacing.md,
  },
  categoryList: {
    paddingHorizontal: staticTheme.spacing.md,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: staticTheme.spacing.lg,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: staticTheme.spacing.md,
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
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
});
