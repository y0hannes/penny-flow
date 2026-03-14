import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme as staticTheme } from '@/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Text,
  SummaryCard,
  CategoryCard,
  TransactionCard,
  FloatingActionButton,
} from '@/components/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { useExpenses } from '@/context/ExpenseContext';
import { useTheme } from '@/context/ThemeContext';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { expenses, currency } = useExpenses();
  const { theme, isDark } = useTheme();

  // Calculate category totals from expenses
  const categories = useMemo(() => {
    const categoryMap = new Map<string, { label: string; amount: number; icon: string }>();

    expenses.forEach((expense) => {
      if (expense.type === 'expense') {
        const existing = categoryMap.get(expense.category);
        if (existing) {
          existing.amount += expense.amount;
        } else {
          categoryMap.set(expense.category, {
            label: expense.category,
            amount: expense.amount,
            icon: expense.icon,
          });
        }
      }
    });

    return Array.from(categoryMap.values()).map((cat, index) => ({
      id: index.toString(),
      ...cat,
    }));
  }, [expenses]);

  // Calculate total spent this month (all expenses)
  const totalSpent = useMemo(() => {
    return expenses
      .filter((exp) => exp.type === 'expense')
      .reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  // Calculate total income this month
  const totalIncome = useMemo(() => {
    return expenses
      .filter((exp) => exp.type === 'income')
      .reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  const balance = totalIncome - totalSpent;

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <View
          style={[
            styles.profileContainer,
            { backgroundColor: isDark ? theme.colors.unselectedCategoryBg : '#E0E0E0' },
          ]}
        >
          <Image
            source={{ uri: 'https://avatar.iran.liara.run/public/65' }} // Placeholder avatar
            style={styles.avatar}
          />
        </View>
        <Text variant="subheading" bold color="textPrimary">
          Penny Flow
        </Text>
        <TouchableOpacity
          style={[
            styles.notificationButton,
            { backgroundColor: isDark ? theme.colors.unselectedCategoryBg : '#F5F5F5' },
          ]}
        >
          <Ionicons name="notifications" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
      >
        {/* Main Summary */}
        <SummaryCard
          variant="large"
          label="Total Balance"
          amount={balance}
          comparison={balance >= 0 ? `+${currency.symbol}250 from last month` : `-${currency.symbol}150 from last month`}
          amountColor={balance >= 0 ? "success" : "danger"}
        />

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <SummaryCard
            label="Income"
            amount={totalIncome}
            progress={1}
            amountColor="success"
          />
          <SummaryCard
            label="Expenses"
            amount={totalSpent}
            progress={totalSpent / (totalIncome || 1)}
            amountColor="danger"
          />
        </View>

        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text variant="subheading" bold color="textPrimary">
            Categories
          </Text>
          <TouchableOpacity>
            <Text variant="link" color="primary">
              See All
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              label={cat.label}
              amount={cat.amount}
              icon={cat.icon as any}
            />
          ))}
        </ScrollView>

        {/* Transactions Section */}
        <View style={styles.sectionHeader}>
          <Text variant="subheading" bold color="textPrimary">
            Recent Transactions
          </Text>
        </View>

        <View style={styles.transactionsList}>
          {expenses.map((expense) => (
            <TransactionCard
              key={expense.id}
              title={expense.title}
              category={expense.category}
              amount={expense.amount}
              date={expense.date}
              type={expense.type}
              icon={expense.icon as any}
            />
          ))}
        </View>

        {/* Bottom Spacing for FAB */}
        <View style={{ height: 100 }} />
      </ScrollView>

      <FloatingActionButton onPress={() => navigation.navigate('AddExpense')} />
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
  profileContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: staticTheme.spacing.md,
    paddingTop: staticTheme.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: staticTheme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: staticTheme.spacing.md,
    marginTop: staticTheme.spacing.sm,
  },
  categoriesScroll: {
    paddingBottom: staticTheme.spacing.md,
  },
  transactionsList: {
    marginBottom: staticTheme.spacing.lg,
  },
});
