import React from 'react';
import { TouchableOpacity, View, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme as staticTheme } from '@/theme';
import Text from './Text';
import { useTheme } from '@/context/ThemeContext';

interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  iconColor?: string;
  destructive?: boolean;
  rightIcon?: keyof typeof Ionicons.glyphMap;
}

const SettingsItem = ({
  icon,
  label,
  value,
  onPress,
  showSwitch = false,
  switchValue = false,
  onSwitchChange,
  iconColor,
  destructive = false,
  rightIcon,
}: SettingsItemProps) => {
  const { theme, isDark } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: isDark ? theme.colors.unselectedCategoryBg : '#FFFFFF' }]}
      onPress={onPress}
      disabled={showSwitch || !onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <View style={[styles.iconBackground, { backgroundColor: isDark ? '#1A332E' : '#E6F9F5' }]}>
          <Ionicons
            name={icon}
            size={22}
            color={destructive ? theme.colors.danger : theme.colors.primary}
          />
        </View>
        <Text
          variant="body"
          color={destructive ? 'danger' : 'textPrimary'}
          bold={false}
          style={styles.label}
        >
          {label}
        </Text>
      </View>

      <View style={styles.rightContent}>
        {value && !showSwitch && (
          <Text variant="body" color="textSecondary" style={styles.value}>
            {value}
          </Text>
        )}
        {showSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor="#FFFFFF"
            ios_backgroundColor={theme.colors.border}
          />
        ) : (
          onPress && (
            <Ionicons
              name={rightIcon || "chevron-forward"}
              size={20}
              color={theme.colors.textTertiary}
            />
          )
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: staticTheme.spacing.md,
    paddingHorizontal: staticTheme.spacing.md,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: staticTheme.spacing.md,
  },
  label: {
    fontSize: 16,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    marginRight: staticTheme.spacing.xs,
    fontSize: 16,
  },
});

export default SettingsItem;
