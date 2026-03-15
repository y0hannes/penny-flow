import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme as staticTheme } from '@/theme';
import { Text, SettingsItem } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useExpenses } from '@/context/ExpenseContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { theme, isDark } = useTheme();
  const { wallets, currency, stealthMode, toggleStealthMode } = useExpenses();
  const { user, signOut } = useAuth();

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={[styles.avatarContainer, { borderColor: theme.colors.primary }]}>
            <Image
              source={{ uri: 'https://avatar.iran.liara.run/public/65' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={[styles.editBadge, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="camera" size={12} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text variant="subheading" bold color="textPrimary" style={styles.userName}>
            {user?.user_metadata?.full_name || 'User'}
          </Text>
          <Text variant="caption" color="textTertiary">{user?.email}</Text>
        </View>

        {/* Wealth Summary */}
        <View style={[styles.wealthCard, { backgroundColor: isDark ? theme.colors.unselectedCategoryBg : '#F7F8F9' }]}>
          <Text variant="caption" color="textTertiary" bold>TOTAL WEALTH</Text>
          <View style={styles.amountContainer}>
            <Text style={[styles.totalAmount, { color: theme.colors.textPrimary }]}>
              {stealthMode ? '••••' : totalBalance.toLocaleString()} {currency.symbol}
            </Text>
            <TouchableOpacity onPress={toggleStealthMode} style={styles.stealthToggle}>
              <Ionicons 
                name={stealthMode ? "eye-outline" : "eye-off-outline"} 
                size={20} 
                color={theme.colors.textTertiary} 
              />
            </TouchableOpacity>
          </View>
          <View style={styles.walletCount}>
            <Ionicons name="wallet-outline" size={14} color={theme.colors.primary} />
            <Text variant="caption" color="primary" bold style={{ marginLeft: 4 }}>
              {wallets.length} Wallets Active
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <Text variant="caption" color="textTertiary" bold style={styles.menuTitle}>MY FINANCES</Text>
          <SettingsItem
            icon="wallet-outline"
            label="Manage Wallets"
            onPress={() => navigation.navigate('Wallets' as never)}
          />
          <SettingsItem
            icon="card-outline"
            label="Payment Methods"
            onPress={() => {}}
          />
          <SettingsItem
            icon="analytics-outline"
            label="Financial Reports"
            onPress={() => {}}
          />

          <Text variant="caption" color="textTertiary" bold style={[styles.menuTitle, { marginTop: 24 }]}>ACCOUNT</Text>
          <SettingsItem
            icon="person-outline"
            label="Personal Information"
            onPress={() => {}}
          />
          <SettingsItem
            icon="settings-outline"
            label="Settings"
            onPress={() => navigation.navigate('Settings' as never)}
          />
          <SettingsItem
            icon="log-out-outline"
            label="Logout"
            destructive
            onPress={signOut}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 46,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent', // Will be dynamic in some designs
  },
  userName: {
    fontSize: 22,
    marginBottom: 2,
  },
  wealthCard: {
    marginHorizontal: staticTheme.spacing.md,
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  stealthToggle: {
    marginLeft: 10,
    padding: 4,
  },
  walletCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F9F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  menuContainer: {
    paddingHorizontal: staticTheme.spacing.md,
    paddingVertical: 24,
  },
  menuTitle: {
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 4,
  },
});
