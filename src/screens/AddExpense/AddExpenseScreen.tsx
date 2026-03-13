import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme';
import { Text, CategoryCard } from '@/components/ui';
import { useNavigation } from '@react-navigation/native';
import { useExpenses } from '@/context/ExpenseContext';

// Icon mapping for categories
const categoryIcons: Record<string, string> = {
  Food: 'restaurant',
  Shopping: 'cart',
  Bills: 'receipt',
  Transport: 'car',
  Salary: 'briefcase',
  Freelance: 'laptop',
  Gift: 'gift',
  Investment: 'trending-up',
};

const expenseCategories = [
  { id: '1', label: 'Food', icon: 'restaurant' as const },
  { id: '2', label: 'Shopping', icon: 'cart' as const },
  { id: '3', label: 'Bills', icon: 'receipt' as const },
  { id: '4', label: 'Transport', icon: 'car' as const },
];

const incomeCategories = [
  { id: '1', label: 'Salary', icon: 'briefcase' as const },
  { id: '2', label: 'Freelance', icon: 'laptop' as const },
  { id: '3', label: 'Gift', icon: 'gift' as const },
  { id: '4', label: 'Investment', icon: 'trending-up' as const },
];

export default function AddExpenseScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { addExpense } = useExpenses();

  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Food');
  const [note, setNote] = useState('');
  const [account, setAccount] = useState('Primary Wallet');

  const categories = type === 'expense' ? expenseCategories : incomeCategories;

  const handleTypeChange = (newType: 'expense' | 'income') => {
    setType(newType);
    setSelectedCategory(newType === 'expense' ? 'Food' : 'Salary');
  };

  const handleSaveExpense = () => {
    // Validate amount
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    // Get current date/time
    const now = new Date();
    const dateStr = `Today, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    // Create new expense/income
    addExpense({
      title: note || `${selectedCategory} ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      category: selectedCategory,
      amount: numAmount,
      date: dateStr,
      type: type,
      icon: categoryIcons[selectedCategory] || 'cash',
      note,
      account,
    });

    // Navigate back
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Ionicons name="close" size={28} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text variant="subheading" bold color="textPrimary">
          Add New {type === 'expense' ? 'Expense' : 'Income'}
        </Text>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Type Selector */}
        <View style={styles.typeSelectorContainer}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'expense' && styles.activeExpenseButton,
            ]}
            onPress={() => handleTypeChange('expense')}
          >
            <Text
              variant="body"
              bold={type === 'expense'}
              color={type === 'expense' ? 'buttonText' : 'textSecondary'}
            >
              Expense
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'income' && styles.activeIncomeButton,
            ]}
            onPress={() => handleTypeChange('income')}
          >
            <Text
              variant="body"
              bold={type === 'income'}
              color={type === 'income' ? 'buttonText' : 'textSecondary'}
            >
              Income
            </Text>
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <View style={styles.amountContainer}>
          <Text variant="caption" color="textTertiary" bold align="center" style={styles.amountLabel}>
            AMOUNT
          </Text>
          <View style={styles.amountRow}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              style={styles.amountValue}
              placeholder="0.00"
              placeholderTextColor={theme.colors.textTertiary}
              autoFocus
            />
          </View>
        </View>

        {/* Category Section */}
        <View style={styles.sectionHeader}>
          <Text variant="subheading" bold color="textPrimary">
            Category
          </Text>
          <TouchableOpacity>
            <Text variant="link" color="primary">
              See All
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoryGrid}>
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              label={cat.label}
              icon={cat.icon}
              variant="grid"
              selected={selectedCategory === cat.label}
              onPress={() => setSelectedCategory(cat.label)}
            />
          ))}
        </View>

        {/* Details Section */}
        <View style={styles.sectionHeader}>
          <Text variant="subheading" bold color="textPrimary">
            Details
          </Text>
        </View>

        <View style={styles.detailsContainer}>
          {/* Date Picker Item */}
          <TouchableOpacity style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons name="calendar-outline" size={24} color={theme.colors.textSecondary} />
            </View>
            <View style={styles.detailContent}>
              <Text variant="caption" color="textTertiary" bold>DATE</Text>
              <Text variant="body" color="textPrimary">Today, Oct 24</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
          </TouchableOpacity>

          {/* Note Item */}
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons name="menu-outline" size={24} color={theme.colors.textSecondary} />
            </View>
            <View style={styles.detailContent}>
              <Text variant="caption" color="textTertiary" bold>NOTE</Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Add a description..."
                placeholderTextColor={theme.colors.textTertiary}
                style={styles.textInput}
              />
            </View>
          </View>

          {/* Account Item */}
          <TouchableOpacity style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons name="card-outline" size={24} color={theme.colors.textSecondary} />
            </View>
            <View style={styles.detailContent}>
              <Text variant="caption" color="textTertiary" bold>ACCOUNT</Text>
              <Text variant="body" color="textPrimary">Primary Wallet</Text>
            </View>
            <Ionicons name="chevron-down" size={20} color={theme.colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: type === 'expense' ? theme.colors.danger : theme.colors.success }
          ]}
          onPress={handleSaveExpense}
          activeOpacity={0.8}
        >
          <Text variant="button" bold>
            Save {type === 'expense' ? 'Expense' : 'Income'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  amountLabel: {
    letterSpacing: 1.5,
    marginBottom: theme.spacing.sm,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencySymbol: {
    fontSize: 40,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    marginRight: 4,
    marginTop: 8,
  },
  amountValue: {
    fontSize: 64,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    minWidth: 150,
    textAlign: 'center',
    padding: 0,
  },
  typeSelectorContainer: {
    flexDirection: 'row',
    backgroundColor: '#F7F8F9',
    borderRadius: theme.borderRadius.medium,
    padding: 4,
    marginBottom: theme.spacing.xl,
  },
  typeButton: {
    flex: 1,
    height: 40,
    borderRadius: theme.borderRadius.medium - 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeExpenseButton: {
    backgroundColor: theme.colors.danger,
  },
  activeIncomeButton: {
    backgroundColor: theme.colors.success,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.xs,
  },
  detailsContainer: {
    backgroundColor: '#F7F8F9',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  detailContent: {
    flex: 1,
  },
  textInput: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    padding: 0,
    marginTop: 2,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
    // Shadow for depth
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
});
