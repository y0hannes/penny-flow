import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme';
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

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  // Mock data - in a real app, this would come from a state management store
  const categories = [
    { id: '1', label: 'Food', amount: 840.5, icon: 'restaurant' as const },
    { id: '2', label: 'Transport', amount: 320.0, icon: 'car' as const },
    { id: '3', label: 'Shopping', amount: 512.0, icon: 'cart' as const },
  ];

  const transactions = [
    {
      id: '1',
      title: 'Starbucks Coffee',
      category: 'Food',
      amount: 5.4,
      date: 'Today, 09:45 AM',
      type: 'expense' as const,
      icon: 'cafe' as const,
    },
    {
      id: '2',
      title: 'Uber Trip',
      category: 'Transport',
      amount: 12.5,
      date: 'Yesterday, 08:20 PM',
      type: 'expense' as const,
      icon: 'car' as const,
    },
    {
      id: '3',
      title: 'Freelance Payment',
      category: 'Income',
      amount: 850.0,
      date: 'Oct 24, 02:00 PM',
      type: 'income' as const,
      icon: 'cash' as const,
    },
    {
      id: '4',
      title: 'Whole Foods',
      category: 'Food',
      amount: 45.9,
      date: 'Oct 23, 11:30 AM',
      type: 'expense' as const,
      icon: 'basket' as const,
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: 'https://avatar.iran.liara.run/public/65' }} // Placeholder avatar
            style={styles.avatar}
          />
        </View>
        <Text variant="subheading" bold color="textPrimary">
          Penny Flow
        </Text>
        <TouchableOpacity style={styles.notificationButton}>
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
          label="Total Spent This Month"
          amount={2450.0}
          comparison="+12% vs last month"
          amountColor="textPrimary"
        />

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <SummaryCard
            label="Daily Average"
            amount={81.66}
            progress={0.65}
            amountColor="textPrimary"
          />
          <SummaryCard
            label="Remaining"
            amount={1550.0}
            progress={0.4}
            amountColor="primary"
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
              icon={cat.icon}
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
          {transactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              title={transaction.title}
              category={transaction.category}
              amount={transaction.amount}
              date={transaction.date}
              type={transaction.type}
              icon={transaction.icon}
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
    backgroundColor: '#FBFBFB', // Subtle off-white background from design
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  profileContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
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
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  categoriesScroll: {
    paddingBottom: theme.spacing.md,
  },
  transactionsList: {
    marginBottom: theme.spacing.lg,
  },
});
