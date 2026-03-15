import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme as staticTheme } from '@/theme';
import Text from './Text';
import { TextColorVariant } from '@/types/ui-variants';
import { useExpenses } from '@/context/ExpenseContext';
import { useTheme } from '@/context/ThemeContext';

interface SummaryCardProps {
  label: string;
  amount: number;
  variant?: 'large' | 'small';
  progress?: number; // 0 to 1
  comparison?: string;
  amountColor?: TextColorVariant;
  showStealthToggle?: boolean;
}

const { width } = Dimensions.get('window');
const SMALL_CARD_WIDTH = (width - staticTheme.spacing.md * 2 - staticTheme.spacing.md) / 2;

const SummaryCard = ({
  label,
  amount,
  variant = 'small',
  progress,
  comparison,
  amountColor,
  showStealthToggle = false,
}: SummaryCardProps) => {
  const { currency, stealthMode, toggleStealthMode } = useExpenses();
  const { theme, isDark } = useTheme();
  const isLarge = variant === 'large';

  // Default amount color logic if not explicitly provided
  const resolvedAmountColor = amountColor ||
    (isLarge ? 'textPrimary' : (progress !== undefined ? 'primary' : 'textPrimary'));

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background, borderColor: isDark ? '#2C2C2C' : '#F0F0F0' },
        isLarge ? styles.largeContainer : styles.smallContainer,
      ]}
    >
      <Text
        variant="caption"
        color="textSecondary"
        align="center"
        style={styles.label}
      >
        {label}
      </Text>

      <View style={styles.amountContainer}>
        <Text
          variant={isLarge ? 'heading' : 'subheading'}
          color={resolvedAmountColor}
          align="center"
          style={isLarge ? styles.largeAmount : styles.smallAmount}
        >
          {stealthMode ? '••••' : amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency.symbol}
        </Text>
        {showStealthToggle && (
          <TouchableOpacity 
            onPress={toggleStealthMode} 
            style={[styles.stealthToggle, isLarge ? styles.largeStealthToggle : styles.smallStealthToggle]}
          >
            <Ionicons 
              name={stealthMode ? "eye-outline" : "eye-off-outline"} 
              size={isLarge ? 24 : 18} 
              color={theme.colors.textTertiary} 
            />
          </TouchableOpacity>
        )}
      </View>

      {comparison && (
        <View style={[
          styles.comparisonContainer,
          { backgroundColor: comparison.startsWith('+') ? (isDark ? '#0F2D26' : '#E6F9F5') : (isDark ? '#3D1B1B' : '#FFE5E5') }
        ]}>
          <Text
            variant="caption"
            color={comparison.startsWith('+') ? 'success' : 'danger'}
            bold
          >
            {comparison}
          </Text>
        </View>
      )}

      {progress !== undefined && (
        <View style={[styles.progressTrack, { backgroundColor: isDark ? '#2C2C2C' : '#F0F0F0' }]}>
          <View
            style={[
              styles.progressBar,
              { width: `${Math.min(100, progress * 100)}%`, backgroundColor: theme.colors.primary },
            ]}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: staticTheme.borderRadius.medium,
    padding: staticTheme.spacing.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeContainer: {
    width: '100%',
    paddingVertical: staticTheme.spacing.lg,
    marginBottom: staticTheme.spacing.md,
    borderWidth: 0,
  },
  smallContainer: {
    width: SMALL_CARD_WIDTH,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: staticTheme.spacing.xs,
  },
  largeAmount: {
    fontSize: 40,
    lineHeight: 48,
  },
  smallAmount: {
    fontSize: 24,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stealthToggle: {
    marginLeft: 8,
    padding: 4,
  },
  largeStealthToggle: {
    marginTop: 4,
  },
  smallStealthToggle: {
    marginTop: 0,
  },
  comparisonContainer: {
    paddingHorizontal: staticTheme.spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: staticTheme.spacing.sm,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    marginTop: staticTheme.spacing.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
});

export default SummaryCard;
