import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  FlatList,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme as staticTheme } from '@/theme';
import { Text, CategoryCard } from '@/components/ui';
import { useNavigation } from '@react-navigation/native';
import { useExpenses } from '@/context/ExpenseContext';
import { useTheme } from '@/context/ThemeContext';

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
  const { addExpense, currency, wallets, primaryWallet, stealthMode } = useExpenses();
  const { theme, isDark } = useTheme();

  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Food');
  const [note, setNote] = useState('');
  const [selectedWallet, setSelectedWallet] = useState(primaryWallet || wallets[0]);
  const [isWalletModalVisible, setIsWalletModalVisible] = useState(false);
  const noteInputRef = useRef<TextInput>(null);

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
      account: selectedWallet?.name || 'Primary Wallet',
    });

    // Navigate back
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text variant="subheading" bold color="textPrimary">Add New {type === 'expense' ? 'Expense' : 'Income'}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={[styles.typeSelectorContainer, { backgroundColor: isDark ? theme.colors.unselectedCategoryBg : '#F7F8F9' }]}>
            <TouchableOpacity style={[styles.typeButton, type === 'expense' && styles.activeExpenseButton]} onPress={() => handleTypeChange('expense')}>
              <Text variant="body" bold={type === 'expense'} color={type === 'expense' ? 'buttonText' : 'textSecondary'}>Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.typeButton, type === 'income' && styles.activeIncomeButton]} onPress={() => handleTypeChange('income')}>
              <Text variant="body" bold={type === 'income'} color={type === 'income' ? 'buttonText' : 'textSecondary'}>Income</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.amountContainer}>
            <Text variant="caption" color="textTertiary" bold align="center" style={styles.amountLabel}>AMOUNT</Text>
            <View style={styles.amountRow}>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                style={[styles.amountValue, { color: theme.colors.textPrimary }]}
                placeholder="0.00"
                placeholderTextColor={theme.colors.textTertiary}
                autoFocus
                returnKeyType="next"
                onSubmitEditing={() => noteInputRef.current?.focus()}
                blurOnSubmit={false}
                secureTextEntry={stealthMode}
              />
              <Text style={[styles.currencySymbol, { color: theme.colors.textPrimary }]}>{currency.symbol}</Text>
            </View>
          </View>
          <View style={styles.sectionHeader}>
            <Text variant="subheading" bold color="textPrimary">Category</Text>
            <TouchableOpacity>
              <Text variant="link" color="primary">See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                label={cat.label}
                icon={cat.icon}
                variant="horizontal"
                selected={selectedCategory === cat.label}
                onPress={() => setSelectedCategory(cat.label)}
              />
            ))}
          </ScrollView>
          <View style={styles.sectionHeader}>
            <Text variant="subheading" bold color="textPrimary">Details</Text>
          </View>
          <View style={[styles.detailsContainer, { backgroundColor: isDark ? theme.colors.unselectedCategoryBg : '#F7F8F9' }]}>
            <View style={styles.detailItem}>
              <View style={[styles.detailIcon, { backgroundColor: isDark ? theme.colors.background : '#FFFFFF' }]}>
                <Ionicons name="menu-outline" size={24} color={theme.colors.textSecondary} />
              </View>
              <View style={styles.detailContent}>
                <Text variant="caption" color="textTertiary" bold>NOTE</Text>
                <TextInput
                  ref={noteInputRef}
                  value={note}
                  onChangeText={setNote}
                  placeholder="Add a description..."
                  placeholderTextColor={theme.colors.textTertiary}
                  style={[styles.textInput, { color: theme.colors.textPrimary }]}
                  returnKeyType="done"
                  onSubmitEditing={handleSaveExpense}
                />
              </View>
            </View>
            <TouchableOpacity style={styles.detailItem}>
              <View style={[styles.detailIcon, { backgroundColor: isDark ? theme.colors.background : '#FFFFFF' }]}>
                <Ionicons name="calendar-outline" size={24} color={theme.colors.textSecondary} />
              </View>
              <View style={styles.detailContent}>
                <Text variant="caption" color="textTertiary" bold>DATE</Text>
                <Text variant="body" color="textPrimary">Today, Oct 24</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
            </TouchableOpacity>

            {/* Wallet Selector (Only show if multiple wallets exist) */}
            {wallets.length > 1 && (
              <TouchableOpacity 
                style={styles.detailItem}
                onPress={() => setIsWalletModalVisible(true)}
              >
                <View style={[styles.detailIcon, { backgroundColor: isDark ? theme.colors.background : '#FFFFFF' }]}>
                  <Ionicons name="wallet-outline" size={24} color={theme.colors.textSecondary} />
                </View>
                <View style={styles.detailContent}>
                  <Text variant="caption" color="textTertiary" bold>WALLET / BANK</Text>
                  <Text variant="body" color="textPrimary">{selectedWallet?.name || 'Select Wallet'}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.saveButton,
              {
                backgroundColor: type === 'expense' ? theme.colors.danger : theme.colors.success,
                shadowColor: type === 'expense' ? theme.colors.danger : theme.colors.success,
                marginBottom: insets.bottom + 20,
              },
            ]}
            onPress={handleSaveExpense}
            activeOpacity={0.8}
          >
            <Text variant="button" bold>Save {type === 'expense' ? 'Expense' : 'Income'}</Text>
          </TouchableOpacity>
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>

      {/* Wallet Selection Modal */}
      <Modal
        visible={isWalletModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsWalletModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <View style={styles.modalHeader}>
              <Text variant="subheading" bold>Select Wallet / Bank</Text>
              <TouchableOpacity onPress={() => setIsWalletModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={wallets}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.walletOption, { borderBottomColor: isDark ? '#2C2C2C' : '#F9F9F9' }]}
                  onPress={() => {
                    setSelectedWallet(item);
                    setIsWalletModalVisible(false);
                  }}
                >
                  <View style={styles.walletOptionInfo}>
                    <View style={[styles.walletOptionIcon, { backgroundColor: `${item.color}15` }]}>
                      <Ionicons name={item.icon as any || 'wallet'} size={20} color={item.color} />
                    </View>
                    <View>
                      <Text variant="body" bold={selectedWallet?.id === item.id}>{item.name}</Text>
                      <Text variant="caption" color="textTertiary">{item.balance.toLocaleString()} {currency.symbol}</Text>
                    </View>
                  </View>
                  {selectedWallet?.id === item.id && (
                    <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
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
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: staticTheme.spacing.md,
    paddingTop: staticTheme.spacing.xl,
    paddingBottom: staticTheme.spacing.xl,
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: staticTheme.spacing.xl,
  },
  amountLabel: {
    letterSpacing: 1.5,
    marginBottom: staticTheme.spacing.sm,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencySymbol: {
    fontSize: 40,
    fontFamily: staticTheme.fonts.bold,
    marginRight: 4,
    marginTop: 8,
  },
  amountValue: {
    fontSize: 64,
    fontFamily: staticTheme.fonts.bold,
    minWidth: 150,
    textAlign: 'center',
    padding: 0,
  },
  typeSelectorContainer: {
    flexDirection: 'row',
    borderRadius: staticTheme.borderRadius.medium,
    padding: 4,
    marginBottom: staticTheme.spacing.xl,
  },
  typeButton: {
    flex: 1,
    height: 40,
    borderRadius: staticTheme.borderRadius.medium - 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeExpenseButton: {
    backgroundColor: '#FF4D4D',
  },
  activeIncomeButton: {
    backgroundColor: '#00D09C',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: staticTheme.spacing.md,
    marginTop: staticTheme.spacing.lg,
  },
  categoryScroll: {
    paddingRight: staticTheme.spacing.md,
  },
  detailsContainer: {
    borderRadius: staticTheme.borderRadius.medium,
    padding: staticTheme.spacing.sm,
    marginBottom: staticTheme.spacing.xl,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: staticTheme.spacing.sm,
    paddingHorizontal: staticTheme.spacing.sm,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: staticTheme.spacing.md,
  },
  detailContent: {
    flex: 1,
  },
  textInput: {
    fontSize: 16,
    padding: 0,
    marginTop: 2,
  },
  saveButton: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: staticTheme.spacing.lg,
    // Shadow for depth
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: staticTheme.spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EBEBEB',
  },
  walletOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: staticTheme.spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F0F0F0',
  },
  walletOptionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: staticTheme.spacing.md,
  },
});
