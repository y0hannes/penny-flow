import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/theme';
import { Text, SettingsItem, SettingsSection } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useExpenses, currencies } from '@/context/ExpenseContext';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { currency, setCurrency } = useExpenses();

  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [budget, setBudget] = useState(2500);
  const [isCurrencyModalVisible, setIsCurrencyModalVisible] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text variant="subheading" bold color="textPrimary" style={styles.headerTitle}>
          App Settings
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* GENERAL SECTION */}
        <SettingsSection title="General">
          <SettingsItem
            icon="cash-outline"
            label="Currency"
            value={`${currency.label} (${currency.symbol})`}
            onPress={() => setIsCurrencyModalVisible(true)}
          />
          <SettingsItem
            icon="globe-outline"
            label="Language"
            value="English"
            onPress={() => { }}
          />
        </SettingsSection>

        {/* FINANCIAL SECTION */}
        <SettingsSection title="Financial">
          <View style={styles.budgetCard}>
            <View style={styles.budgetHeader}>
              <View style={styles.budgetIconContainer}>
                <Ionicons name="wallet-outline" size={22} color={theme.colors.primary} />
              </View>
              <Text style={styles.budgetLabel}>Monthly Budget</Text>
              <Text style={styles.budgetValue}>{currency.symbol}{budget.toLocaleString()}</Text>
            </View>

            <View style={styles.sliderContainer}>
              <View style={styles.sliderTrack}>
                <View style={[styles.sliderFill, { width: '25%' }]} />
                <View style={[styles.sliderThumb, { left: '25%' }]} />
              </View>
              <View style={styles.sliderLabels}>
                <Text variant="caption" color="textTertiary">{currency.symbol}0</Text>
                <Text variant="caption" color="textTertiary">{currency.symbol}10,000</Text>
              </View>
            </View>
          </View>

          <SettingsItem
            icon="notifications-outline"
            label="Budget Alerts"
            showSwitch
            switchValue={budgetAlerts}
            onSwitchChange={setBudgetAlerts}
          />
        </SettingsSection>

        {/* APP PREFERENCES SECTION */}
        <SettingsSection title="App Preferences">
          <SettingsItem
            icon="moon-outline"
            label="Dark Mode"
            showSwitch
            switchValue={darkMode}
            onSwitchChange={setDarkMode}
          />
          <SettingsItem
            icon="notifications-outline"
            label="Push Notifications"
            onPress={() => { }}
          />
        </SettingsSection>

        {/* SUPPORT SECTION */}
        <SettingsSection title="Support">
          <SettingsItem
            icon="help-circle-outline"
            label="Help Center"
            onPress={() => { }}
          />
          <SettingsItem
            icon="shield-checkmark-outline"
            label="Privacy Policy"
            rightIcon="open-outline"
            onPress={() => { }}
          />
        </SettingsSection>
      </ScrollView>

      {/* Modal for Currency Selection */}
      <Modal
        visible={isCurrencyModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsCurrencyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="subheading" bold>Select Currency</Text>
              <TouchableOpacity onPress={() => setIsCurrencyModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={currencies}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.currencyOption}
                  onPress={() => {
                    setCurrency(item.code);
                    setIsCurrencyModalVisible(false);
                  }}
                >
                  <View style={styles.currencyInfo}>
                    <View style={styles.currencySymbolCircle}>
                      <Text style={styles.currencySymbolText}>{item.symbol}</Text>
                    </View>
                    <Text variant="body" bold={currency.code === item.code}>
                      {item.label} ({item.code})
                    </Text>
                  </View>
                  {currency.code === item.code && (
                    <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Footer / Credits can go here if needed, but not in the image */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    backgroundColor: '#F7F8F9',
    position: 'relative',
    minHeight: 56,
  },
  backButton: {
    position: 'absolute',
    left: theme.spacing.md,
    padding: theme.spacing.xs,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    paddingTop: theme.spacing.sm,
  },
  budgetCard: {
    padding: theme.spacing.md,
    backgroundColor: '#FFFFFF',
  },
  budgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  budgetIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E6F9F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  budgetLabel: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
  },
  budgetValue: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  sliderContainer: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: '#EBEBEB',
    borderRadius: 3,
    position: 'relative',
    justifyContent: 'center',
  },
  sliderFill: {
    height: 6,
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
    position: 'absolute',
    left: 0,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    position: 'absolute',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    // Shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F9F9F9',
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbolCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F6F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  currencySymbolText: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
});
