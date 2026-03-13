import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { theme } from '@/theme';
import Text from './Text';

import { TextColorVariant } from '@/types/ui-variants';

interface SummaryCardProps {
  label: string;
  amount: number;
  variant?: 'large' | 'small';
  progress?: number; // 0 to 1
  comparison?: string;
  amountColor?: TextColorVariant;
}

const { width } = Dimensions.get('window');
const SMALL_CARD_WIDTH = (width - theme.spacing.md * 2 - theme.spacing.md) / 2;

const SummaryCard = ({
  label,
  amount,
  variant = 'small',
  progress,
  comparison,
  amountColor,
}: SummaryCardProps) => {
  const isLarge = variant === 'large';

  // Default amount color logic if not explicitly provided
  const resolvedAmountColor = amountColor ||
    (isLarge ? 'textPrimary' : (progress !== undefined ? 'primary' : 'textPrimary'));

  return (
    <View
      style={[
        styles.container,
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

      <Text
        variant={isLarge ? 'heading' : 'subheading'}
        color={resolvedAmountColor}
        align="center"
        style={isLarge ? styles.largeAmount : styles.smallAmount}
      >
        ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </Text>

      {comparison && (
        <View style={[
          styles.comparisonContainer,
          { backgroundColor: comparison.startsWith('+') ? '#E6F9F5' : '#FFE5E5' }
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
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressBar,
              { width: `${Math.min(100, progress * 100)}%` },
            ]}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeContainer: {
    width: '100%',
    paddingVertical: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 0, // In the design, the large one is more integrated
  },
  smallContainer: {
    width: SMALL_CARD_WIDTH,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.xs,
  },
  largeAmount: {
    fontSize: 40,
    lineHeight: 48,
  },
  smallAmount: {
    fontSize: 24,
    marginBottom: theme.spacing.sm,
  },
  comparisonContainer: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: theme.spacing.sm,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    marginTop: theme.spacing.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
});

export default SummaryCard;
