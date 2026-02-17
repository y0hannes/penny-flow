import React from 'react';
import { TouchableOpacity, View, StyleSheet, Switch, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme';
import Text from './Text';

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
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={showSwitch || !onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <View style={styles.iconBackground}>
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
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#E6F9F5', // Light teal background
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  label: {
    fontSize: 16,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    marginRight: theme.spacing.xs,
    fontSize: 16,
  },
});

export default SettingsItem;
