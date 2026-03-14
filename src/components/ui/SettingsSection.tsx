import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme as staticTheme } from '@/theme';
import Text from './Text';
import { useTheme } from '@/context/ThemeContext';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingsSection = ({ title, children }: SettingsSectionProps) => {
  const { theme, isDark } = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="caption" color="textSecondary" bold style={styles.title}>
        {title.toUpperCase()}
      </Text>
      <View style={[styles.content, { backgroundColor: isDark ? theme.colors.unselectedCategoryBg : '#FFFFFF' }]}>
        {React.Children.map(children, (child, index) => (
          <React.Fragment key={index}>
            {child}
            {index < React.Children.count(children) - 1 && (
              <View style={[styles.separator, { backgroundColor: isDark ? '#2C2C2C' : '#F7F8F9' }]} />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: staticTheme.spacing.lg,
  },
  title: {
    paddingHorizontal: staticTheme.spacing.xs,
    paddingBottom: staticTheme.spacing.sm,
    letterSpacing: 1.2,
    fontSize: 14,
    fontWeight: '700' as const,
  },
  content: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  separator: {
    height: 1,
    marginLeft: staticTheme.spacing.md + 40 + staticTheme.spacing.md,
  },
});

export default SettingsSection;
