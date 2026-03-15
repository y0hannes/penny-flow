import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme as staticTheme } from '@/theme';
import { Text, SettingsItem, SettingsSection } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useExpenses, currencies } from '@/context/ExpenseContext';
import { useTheme } from '@/context/ThemeContext';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { currency, setCurrency, wallets } = useExpenses();
  const { theme, isDark, toggleTheme } = useTheme();

  const [isCurrencyModalVisible, setIsCurrencyModalVisible] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
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
          <SettingsItem
            icon="wallet-outline"
            label="Wallets"
            value={`${wallets.length} Active`}
            onPress={() => navigation.navigate('Wallets' as never)}
          />
        </SettingsSection>
        {/* APP PREFERENCES SECTION */}
        <SettingsSection title="App Preferences">
          <SettingsItem
            icon="moon-outline"
            label="Dark Mode"
            showSwitch
            switchValue={isDark}
            onSwitchChange={toggleTheme}
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
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <View style={[styles.modalHeader, { borderBottomColor: isDark ? '#2C2C2C' : '#F5F5F5' }]}>
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
                  style={[styles.currencyOption, { borderBottomColor: isDark ? '#2C2C2C' : '#F9F9F9' }]}
                  onPress={() => {
                    setCurrency(item.code);
                    setIsCurrencyModalVisible(false);
                  }}
                >
                  <View style={styles.currencyInfo}>
                    <View style={[styles.currencySymbolCircle, { backgroundColor: isDark ? '#2C2C2C' : '#F5F6F8' }]}>
                      <Text style={[styles.currencySymbolText, { color: theme.colors.textPrimary }]}>{item.symbol}</Text>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: staticTheme.spacing.md,
    position: 'relative',
    minHeight: 56,
  },
  backButton: {
    position: 'absolute',
    left: staticTheme.spacing.md,
    padding: staticTheme.spacing.xs,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: staticTheme.spacing.md,
    paddingBottom: staticTheme.spacing.xl,
    paddingTop: staticTheme.spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: staticTheme.spacing.lg,
    borderBottomWidth: 1,
  },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: staticTheme.spacing.lg,
    borderBottomWidth: 1,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbolCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: staticTheme.spacing.md,
  },
  currencySymbolText: {
    fontSize: 18,
    fontWeight: '700',
  },
});
