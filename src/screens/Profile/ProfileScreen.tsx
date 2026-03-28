import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, FlatList, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme as staticTheme } from '@/theme';
import { Text, SettingsItem, SettingsSection } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useExpenses, currencies } from '@/context/ExpenseContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { theme, isDark, toggleTheme } = useTheme();
  const { wallets, currency, stealthMode, toggleStealthMode, setCurrency } = useExpenses();
  const { user, signOut, updateProfile } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [isCurrencyModalVisible, setIsCurrencyModalVisible] = useState(false);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [editName, setEditName] = useState(user?.user_metadata?.full_name || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const languageOptions = [
    { code: 'en', label: 'English' },
    { code: 'am', label: 'አማርኛ' },
  ];

  const handleUpdateProfile = async () => {
    if (!editName.trim()) {
      return;
    }
    setIsUpdatingProfile(true);
    const { error } = await updateProfile({ full_name: editName });
    setIsUpdatingProfile(false);

    if (error) {
      Alert.alert(t('error'), t('errorUpdatingProfile') + ': ' + error.message);
    } else {
      Alert.alert(t('success'), t('profileUpdated'));
      setIsProfileModalVisible(false);
    }
  };

  const handleOpenProfileModal = () => {
    setEditName(user?.user_metadata?.full_name || '');
    setIsProfileModalVisible(true);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View
            style={[
              styles.avatarContainer,
              { 
                backgroundColor: isDark ? theme.colors.unselectedCategoryBg : '#F5F5F5',
                alignItems: 'center',
                justifyContent: 'center' 
              },
            ]}
          >
            <Ionicons name="person" size={50} color={theme.colors.textTertiary} />
          </View>
          <Text variant="subheading" bold color="textPrimary" style={styles.userName}>
            {user?.user_metadata?.full_name || 'User'}
          </Text>
          <Text variant="caption" color="textTertiary">{user?.email}</Text>
        </View>

        {/* Combined Menu Items */}
        <View style={styles.menuContainer}>
          
          <SettingsSection title={t('myFinances')}>
            <SettingsItem
              icon="wallet-outline"
              label={t('manageWallets')}
              value={`${wallets.length} ${t('active')}`}
              onPress={() => navigation.navigate('Wallets' as never)}
            />
            <SettingsItem
              icon="card-outline"
              label={t('paymentMethods')}
              onPress={() => {}}
            />
            <SettingsItem
              icon="analytics-outline"
              label={t('financialReports')}
              onPress={() => {}}
            />
          </SettingsSection>

          <SettingsSection title={t('appSettings')}>
            <SettingsItem
              icon="cash-outline"
              label={t('currency')}
              value={`${currency.label} (${currency.symbol})`}
              onPress={() => setIsCurrencyModalVisible(true)}
            />
            <SettingsItem
              icon="globe-outline"
              label={t('language')}
              value={languageOptions.find(o => o.code === language)?.label || 'English'}
              onPress={() => setIsLanguageModalVisible(true)}
            />
            <SettingsItem
              icon="moon-outline"
              label={t('darkMode')}
              showSwitch
              switchValue={isDark}
              onSwitchChange={toggleTheme}
            />
             <SettingsItem
              icon="notifications-outline"
              label={t('pushNotifications')}
              onPress={() => { }}
            />
          </SettingsSection>

          <SettingsSection title={t('account')}>
            <SettingsItem
              icon="person-outline"
              label={t('personalInformation')}
              onPress={handleOpenProfileModal}
            />
            <SettingsItem
              icon="help-circle-outline"
              label={t('helpCenter')}
              onPress={() => { }}
            />
            <SettingsItem
              icon="shield-checkmark-outline"
              label={t('privacyPolicy')}
              rightIcon="open-outline"
              onPress={() => { }}
            />
            <SettingsItem
              icon="log-out-outline"
              label={t('logout')}
              destructive
              onPress={signOut}
            />
          </SettingsSection>
        </View>
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
              <Text variant="subheading" bold>{t('selectCurrency')}</Text>
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

      {/* Modal for Language Selection */}
      <Modal
        visible={isLanguageModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <View style={[styles.modalHeader, { borderBottomColor: isDark ? '#2C2C2C' : '#F5F5F5' }]}>
              <Text variant="subheading" bold>{t('selectLanguage')}</Text>
              <TouchableOpacity onPress={() => setIsLanguageModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={languageOptions}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.currencyOption, { borderBottomColor: isDark ? '#2C2C2C' : '#F9F9F9' }]}
                  onPress={() => {
                    setLanguage(item.code as any);
                    setIsLanguageModalVisible(false);
                  }}
                >
                  <View style={styles.currencyInfo}>
                    <Text variant="body" bold={language === item.code}>
                      {item.label}
                    </Text>
                  </View>
                  {language === item.code && (
                    <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Modal for Personal Information */}
      <Modal
        visible={isProfileModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsProfileModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <View style={[styles.modalHeader, { borderBottomColor: isDark ? '#2C2C2C' : '#F5F5F5' }]}>
              <Text variant="subheading" bold>{t('personalInformation')}</Text>
              <TouchableOpacity onPress={() => setIsProfileModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text variant="caption" color="textTertiary" bold style={styles.inputLabel}>{t('email')}</Text>
              <TextInput
                value={user?.email || ''}
                editable={false}
                style={[styles.input, { color: theme.colors.textTertiary, borderBottomColor: isDark ? '#2C2C2C' : '#EBEBEB' }]}
              />

              <Text variant="caption" color="textTertiary" bold style={[styles.inputLabel, { marginTop: 20 }]}>{t('fullName')}</Text>
              <TextInput
                value={editName}
                onChangeText={setEditName}
                placeholder={t('fullName')}
                placeholderTextColor={theme.colors.textTertiary}
                style={[styles.input, { color: theme.colors.textPrimary, borderBottomColor: isDark ? '#2C2C2C' : '#EBEBEB' }]}
              />

              <TouchableOpacity
                onPress={handleUpdateProfile}
                disabled={isUpdatingProfile}
                style={[styles.saveButton, { backgroundColor: theme.colors.primary, opacity: isUpdatingProfile ? 0.7 : 1 }]}
              >
                <Text variant="button" bold>{isUpdatingProfile ? '...' : t('updateProfile')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: staticTheme.spacing.xl,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    padding: 4,
    marginBottom: 15,
  },
  userName: {
    fontSize: 22,
    marginBottom: 2,
  },
  menuContainer: {
    paddingHorizontal: staticTheme.spacing.md,
    paddingVertical: 24,
  },
  // Modal styles (Copied from SettingsScreen)
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
  modalBody: {
    padding: staticTheme.spacing.lg,
  },
  inputLabel: {
    letterSpacing: 1,
    fontSize: 10,
  },
  input: {
    fontSize: 18,
    paddingVertical: 10,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  saveButton: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
});
