import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme';
import Text from './Text';

interface CategoryCardProps {
  label: string;
  amount?: number;
  icon: keyof typeof Ionicons.glyphMap;
  selected?: boolean;
  onPress?: () => void;
  variant?: 'grid' | 'horizontal';
}

const { width } = Dimensions.get('window');
const GRID_WIDTH = (width - theme.spacing.md * 2 - theme.spacing.sm * 2) / 3;

const CategoryCard = ({
  label,
  amount,
  icon,
  selected = false,
  onPress,
  variant = 'horizontal',
}: CategoryCardProps) => {
  const isGrid = variant === 'grid';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.container,
        isGrid ? styles.gridContainer : styles.horizontalContainer,
        selected && styles.selectedContainer,
      ]}
    >
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: selected ? theme.colors.primary : '#F7F8F9' },
        ]}
      >
        <Ionicons
          name={icon}
          size={isGrid ? 28 : 24}
          color={selected ? theme.colors.buttonText : theme.colors.textPrimary}
        />
      </View>

      <Text
        variant="caption"
        bold
        color={selected ? 'textPrimary' : 'textPrimary'}
        style={styles.label}
      >
        {label}
      </Text>

      {amount !== undefined && (
        <Text variant="caption" color="textTertiary">
          ${amount.toFixed(2)}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  gridContainer: {
    width: GRID_WIDTH,
    aspectRatio: 1,
    backgroundColor: '#F7F8F9',
    margin: theme.spacing.xs,
  },
  horizontalContainer: {
    width: 100,
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  selectedContainer: {
    backgroundColor: '#E8FAF6',
    borderColor: theme.colors.primary,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  label: {
    marginBottom: 2,
    textAlign: 'center',
  },
});

export default CategoryCard;
