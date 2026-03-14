import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme as staticTheme } from '@/theme';
import Text from './Text';
import { useTheme } from '@/context/ThemeContext';
import { useExpenses } from '@/context/ExpenseContext';

interface CategoryCardProps {
  label: string;
  amount?: number;
  icon: keyof typeof Ionicons.glyphMap;
  selected?: boolean;
  onPress?: () => void;
  variant?: 'grid' | 'horizontal';
}

const { width } = Dimensions.get('window');
const GRID_WIDTH = (width - staticTheme.spacing.md * 2 - staticTheme.spacing.sm * 2) / 3;

const CategoryCard = ({
  label,
  amount,
  icon,
  selected = false,
  onPress,
  variant = 'horizontal',
}: CategoryCardProps) => {
  const { theme, isDark } = useTheme();
  const { currency } = useExpenses();
  const isGrid = variant === 'grid';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.container,
        { backgroundColor: theme.colors.background, borderColor: isDark ? '#2C2C2C' : '#F0F0F0' },
        isGrid && { 
          width: GRID_WIDTH, 
          aspectRatio: 1, 
          backgroundColor: isDark ? theme.colors.unselectedCategoryBg : '#F7F8F9', 
          margin: staticTheme.spacing.xs 
        },
        variant === 'horizontal' && { 
          minWidth: 85,
          paddingVertical: staticTheme.spacing.sm,
          paddingHorizontal: staticTheme.spacing.md,
          marginRight: staticTheme.spacing.sm, 
          borderWidth: 1,
        },
        selected && { backgroundColor: isDark ? '#003328' : '#E8FAF6', borderColor: theme.colors.primary },
      ]}
    >
      <View
        style={[
          styles.iconCircle,
          !isGrid && { width: 40, height: 40, borderRadius: 20, marginBottom: 4 },
          { backgroundColor: selected ? theme.colors.primary : (isDark ? '#2C2C2C' : '#F7F8F9') },
        ]}
      >
        <Ionicons
          name={icon}
          size={isGrid ? 28 : 20}
          color={selected ? theme.colors.buttonText : theme.colors.textPrimary}
        />
      </View>

      <Text
        variant="caption"
        bold
        color="textPrimary"
        numberOfLines={1}
        style={styles.label}
      >
        {label}
      </Text>

      {amount !== undefined && (
        <Text variant="caption" color="textTertiary">
          {currency.symbol}{amount.toFixed(2)}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: staticTheme.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    padding: staticTheme.spacing.md,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: staticTheme.spacing.sm,
  },
  label: {
    marginBottom: 2,
    textAlign: 'center',
  },
});

export default CategoryCard;
