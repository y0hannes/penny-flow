import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import Text from './Text';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingsSection = ({ title, children }: SettingsSectionProps) => {
  return (
    <View style={styles.container}>
      <Text variant="caption" color="textSecondary" bold style={styles.title}>
        {title.toUpperCase()}
      </Text>
      <View style={styles.content}>
        {React.Children.map(children, (child, index) => (
          <>
            {child}
            {index < React.Children.count(children) - 1 && (
              <View style={styles.separator} />
            )}
          </>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    paddingHorizontal: theme.spacing.xs,
    paddingBottom: theme.spacing.sm,
    letterSpacing: 1.2,
    fontSize: 14,
    color: '#1A1A1A', // Darker gray for section headers
    fontWeight: '700' as const,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20, // More rounded corners
    overflow: 'hidden',
    // Remove border, use shadow or just clean separation
  },
  separator: {
    height: 1,
    backgroundColor: '#F7F8F9',
    marginLeft: theme.spacing.md + 40 + theme.spacing.md, // icon space + padding
  },
});

export default SettingsSection;
