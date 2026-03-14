import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme as staticTheme } from '@/theme';
import { Text } from '@/components/ui';
import { useNavigation } from '@react-navigation/native';
import { useExpenses } from '@/context/ExpenseContext';
import { useTheme } from '@/context/ThemeContext';
import { Wallet } from '@/types/expense';

export default function WalletsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { wallets, addWallet, updateWallet, deleteWallet, setPrimaryWallet, currency } = useExpenses();
  const { theme, isDark } = useTheme();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const [walletName, setWalletName] = useState('');
  const [walletBalance, setWalletBalance] = useState('');
  const [selectedColor, setSelectedColor] = useState('#00D09C');

  const colors = ['#00D09C', '#4D9AFF', '#9C27B0', '#FFB100', '#FF4D4D', '#795548', '#607D8B'];

  const handleOpenModal = (wallet?: Wallet) => {
    if (wallet) {
      setEditingWallet(wallet);
      setWalletName(wallet.name);
      setWalletBalance(wallet.balance.toString());
      setSelectedColor(wallet.color);
    } else {
      setEditingWallet(null);
      setWalletName('');
      setWalletBalance('0');
      setSelectedColor('#00D09C');
    }
    setIsModalVisible(true);
  };

  const handleSaveWallet = () => {
    if (!walletName.trim()) {
      Alert.alert('Error', 'Please enter a wallet name');
      return;
    }

    const balance = parseFloat(walletBalance) || 0;

    if (editingWallet) {
      updateWallet(editingWallet.id, {
        name: walletName,
        balance: balance,
        color: selectedColor,
      });
    } else {
      addWallet({
        name: walletName,
        balance: balance,
        color: selectedColor,
        icon: 'wallet',
        isPrimary: wallets.length === 0,
      });
    }
    setIsModalVisible(false);
  };

  const handleDeleteWallet = (id: string, isPrimary: boolean) => {
    if (isPrimary && wallets.length > 1) {
      Alert.alert('Cannot Delete', 'You cannot delete the primary wallet. Set another wallet as primary first.');
      return;
    }
    
    Alert.alert(
      'Delete Wallet',
      'Are you sure you want to delete this wallet? All history associated with this wallet name will remain but the wallet itself will be removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteWallet(id) },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text variant="subheading" bold color="textPrimary">Manage Wallets</Text>
        <TouchableOpacity onPress={() => handleOpenModal()} style={styles.addButton}>
          <Ionicons name="add" size={28} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text variant="caption" color="textTertiary" bold style={styles.sectionTitle}>YOUR WALLETS</Text>
        
        {wallets.map((wallet) => (
          <View 
            key={wallet.id} 
            style={[
              styles.walletItem, 
              { backgroundColor: isDark ? theme.colors.unselectedCategoryBg : '#F7F8F9' }
            ]}
          >
            <View style={[styles.walletIcon, { backgroundColor: `${wallet.color}15` }]}>
              <Ionicons name={wallet.icon as any || 'wallet'} size={24} color={wallet.color} />
            </View>
            
            <View style={styles.walletInfo}>
              <View style={styles.row}>
                <Text variant="body" bold color="textPrimary">{wallet.name}</Text>
                {wallet.isPrimary && (
                  <View style={styles.primaryBadge}>
                    <Text style={styles.primaryText}>PRIMARY</Text>
                  </View>
                )}
              </View>
              <Text variant="subheading" bold color="textPrimary">
                {currency.symbol}{wallet.balance.toLocaleString()}
              </Text>
            </View>

            <View style={styles.actions}>
              {!wallet.isPrimary && (
                <TouchableOpacity 
                  onPress={() => setPrimaryWallet(wallet.id)}
                  style={styles.actionButton}
                >
                  <Ionicons name="star-outline" size={20} color={theme.colors.textTertiary} />
                </TouchableOpacity>
              )}
              {wallet.isPrimary && (
                <View style={styles.actionButton}>
                  <Ionicons name="star" size={20} color="#FFB100" />
                </View>
              )}
              <TouchableOpacity 
                onPress={() => handleOpenModal(wallet)}
                style={styles.actionButton}
              >
                <Ionicons name="pencil-outline" size={20} color={theme.colors.textTertiary} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => handleDeleteWallet(wallet.id, wallet.isPrimary)}
                style={styles.actionButton}
              >
                <Ionicons name="trash-outline" size={20} color={theme.colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <View style={styles.modalHeader}>
              <Text variant="subheading" bold>{editingWallet ? 'Edit Wallet' : 'New Wallet'}</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text variant="caption" color="textTertiary" bold style={styles.inputLabel}>WALLET NAME</Text>
              <TextInput
                value={walletName}
                onChangeText={setWalletName}
                placeholder="e.g. Cash, Savings"
                placeholderTextColor={theme.colors.textTertiary}
                style={[styles.input, { color: theme.colors.textPrimary, borderBottomColor: isDark ? '#2C2C2C' : '#EBEBEB' }]}
              />

              <Text variant="caption" color="textTertiary" bold style={[styles.inputLabel, { marginTop: 20 }]}>INITIAL BALANCE ({currency.symbol})</Text>
              <TextInput
                value={walletBalance}
                onChangeText={setWalletBalance}
                keyboardType="decimal-pad"
                style={[styles.input, { color: theme.colors.textPrimary, borderBottomColor: isDark ? '#2C2C2C' : '#EBEBEB' }]}
              />

              <Text variant="caption" color="textTertiary" bold style={[styles.inputLabel, { marginTop: 20 }]}>THEME COLOR</Text>
              <View style={styles.colorRow}>
                {colors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => setSelectedColor(color)}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: color },
                      selectedColor === color && { borderColor: theme.colors.textPrimary, borderWidth: 2 }
                    ]}
                  />
                ))}
              </View>

              <TouchableOpacity
                onPress={handleSaveWallet}
                style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
              >
                <Text variant="button" bold>Save Wallet</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: staticTheme.spacing.md,
    paddingVertical: staticTheme.spacing.md,
  },
  backButton: {
    padding: staticTheme.spacing.xs,
  },
  addButton: {
    padding: staticTheme.spacing.xs,
  },
  scrollContent: {
    paddingHorizontal: staticTheme.spacing.md,
    paddingTop: staticTheme.spacing.md,
  },
  sectionTitle: {
    letterSpacing: 1,
    marginBottom: staticTheme.spacing.md,
  },
  walletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: staticTheme.spacing.md,
    borderRadius: 20,
    marginBottom: staticTheme.spacing.md,
  },
  walletIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: staticTheme.spacing.md,
  },
  walletInfo: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  primaryBadge: {
    backgroundColor: '#E6F9F5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  primaryText: {
    color: '#00D09C',
    fontSize: 8,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
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
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: staticTheme.spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EBEBEB',
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
  colorRow: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 30,
    justifyContent: 'space-between',
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  saveButton: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});
