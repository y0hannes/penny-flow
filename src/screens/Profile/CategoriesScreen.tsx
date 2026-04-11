import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, FlatList, Modal, TextInput, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme as staticTheme } from '@/theme';
import { Text } from '@/components/ui';
import { useExpenses } from '@/context/ExpenseContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import { Category } from '@/types/expense';

const availableIcons = [
  'restaurant', 'cart', 'receipt', 'car', 'briefcase', 'laptop', 'gift', 
  'trending-up', 'cash', 'card', 'home', 'bus', 'airplane', 'medical', 
  'fitness', 'game-controller', 'book', 'school', 'construct', 'shirt'
];

export default function CategoriesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { categories, addCategory, deleteCategory } = useExpenses();
  const { theme, isDark } = useTheme();
  const { t } = useLanguage();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newIcon, setNewIcon] = useState('cash');
  const [newType, setNewType] = useState<'expense' | 'income'>('expense');
  const [isSaving, setIsSaving] = useState(false);

  const handleCreateCategory = async () => {
    if (!newLabel.trim()) {
      Alert.alert(t('error'), t('pleaseEnterCategoryName'));
      return;
    }

    setIsSaving(true);
    await addCategory({
      label: newLabel.trim(),
      icon: newIcon,
      type: newType,
    });
    setIsSaving(false);
    setIsModalVisible(false);
    setNewLabel('');
    setNewIcon('cash');
  };

  const handleDeleteCategory = (cat: Category) => {
    Alert.alert(
      t('delete'),
      `${t('deleteWalletWarning')} (${cat.label})`,
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('delete'), 
          style: 'destructive',
          onPress: () => deleteCategory(cat.id)
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text variant="subheading" bold color="textPrimary">{t('manageCategories')}</Text>
        <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.addButton}>
          <Ionicons name="add" size={28} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Expenses Section */}
        <View style={styles.sectionHeader}>
            <Text variant="caption" bold color="textTertiary">{t('expense').toUpperCase()}</Text>
        </View>
        <View style={styles.categoriesGrid}>
            {categories.filter(c => c.type === 'expense').map(cat => (
                <View key={cat.id} style={[styles.categoryItem, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
                    <View style={[styles.iconBox, { backgroundColor: `${theme.colors.danger}15` }]}>
                        <Ionicons name={cat.icon as any} size={24} color={theme.colors.danger} />
                    </View>
                    <Text variant="body" bold style={styles.catLabel}>{cat.label}</Text>
                    <TouchableOpacity onPress={() => handleDeleteCategory(cat)} style={styles.deleteButton}>
                        <Ionicons name="trash-outline" size={18} color={theme.colors.textTertiary} />
                    </TouchableOpacity>
                </View>
            ))}
        </View>

        {/* Income Section */}
        <View style={styles.sectionHeader}>
            <Text variant="caption" bold color="textTertiary">{t('income').toUpperCase()}</Text>
        </View>
        <View style={styles.categoriesGrid}>
            {categories.filter(c => c.type === 'income').map(cat => (
                <View key={cat.id} style={[styles.categoryItem, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
                    <View style={[styles.iconBox, { backgroundColor: `${theme.colors.success}15` }]}>
                        <Ionicons name={cat.icon as any} size={24} color={theme.colors.success} />
                    </View>
                    <Text variant="body" bold style={styles.catLabel}>{cat.label}</Text>
                    <TouchableOpacity onPress={() => handleDeleteCategory(cat)} style={styles.deleteButton}>
                        <Ionicons name="trash-outline" size={18} color={theme.colors.textTertiary} />
                    </TouchableOpacity>
                </View>
            ))}
        </View>
      </ScrollView>

      {/* Manual Back Button for non-stack navigation test */}
      {/* (Actual back navigation usually handled by router) */}

      {/* Modal for Creating Category */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <View style={styles.modalHeader}>
              <Text variant="subheading" bold>{t('addNewCategory')}</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalBody}>
              <Text variant="caption" color="textTertiary" bold style={styles.inputLabel}>{t('categoryName')}</Text>
              <TextInput
                value={newLabel}
                onChangeText={setNewLabel}
                placeholder={t('categoryName')}
                placeholderTextColor={theme.colors.textTertiary}
                style={[styles.input, { color: theme.colors.textPrimary, borderBottomColor: isDark ? '#2C2C2C' : '#EBEBEB' }]}
              />

              <Text variant="caption" color="textTertiary" bold style={[styles.inputLabel, { marginTop: 20 }]}>{t('categoryType')}</Text>
              <View style={styles.typeSelector}>
                <TouchableOpacity 
                  onPress={() => setNewType('expense')}
                  style={[styles.typeButton, newType === 'expense' && { backgroundColor: theme.colors.danger }]}
                >
                  <Text variant="body" bold={newType === 'expense'} color={newType === 'expense' ? 'buttonText' : 'textSecondary'}>{t('expense')}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                   onPress={() => setNewType('income')}
                   style={[styles.typeButton, newType === 'income' && { backgroundColor: theme.colors.success }]}
                >
                  <Text variant="body" bold={newType === 'income'} color={newType === 'income' ? 'buttonText' : 'textSecondary'}>{t('income')}</Text>
                </TouchableOpacity>
              </View>

              <Text variant="caption" color="textTertiary" bold style={[styles.inputLabel, { marginTop: 20, marginBottom: 15 }]}>{t('categoryIcon')}</Text>
              <View style={styles.iconGrid}>
                {availableIcons.map((icon) => (
                  <TouchableOpacity
                    key={icon}
                    onPress={() => setNewIcon(icon)}
                    style={[
                      styles.iconOption,
                      newIcon === icon && { backgroundColor: theme.colors.primary + '20', borderColor: theme.colors.primary }
                    ]}
                  >
                    <Ionicons name={icon as any} size={24} color={newIcon === icon ? theme.colors.primary : theme.colors.textSecondary} />
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                onPress={handleCreateCategory}
                disabled={isSaving}
                style={[styles.saveButton, { backgroundColor: theme.colors.primary, opacity: isSaving ? 0.7 : 1 }]}
              >
                <Text variant="button" bold>{isSaving ? '...' : t('saveCategory')}</Text>
              </TouchableOpacity>
            </ScrollView>
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
    padding: staticTheme.spacing.md,
  },
  backButton: {
    padding: 8,
  },
  addButton: {
    padding: 4,
  },
  sectionHeader: {
    paddingHorizontal: staticTheme.spacing.md,
    marginTop: 20,
    marginBottom: 10,
  },
  categoriesGrid: {
    paddingHorizontal: staticTheme.spacing.md,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    // Shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  catLabel: {
    flex: 1,
  },
  deleteButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: staticTheme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
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
  typeSelector: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  typeButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F8F9',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  iconOption: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#F7F8F9',
  },
  saveButton: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
});
