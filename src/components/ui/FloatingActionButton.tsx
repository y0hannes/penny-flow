import React from 'react';
import { StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme as staticTheme } from '@/theme';
import { useTheme } from '@/context/ThemeContext';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  size?: number;
  bottom?: number;
  right?: number;
}

const FloatingActionButton = ({
  onPress,
  icon = 'add',
  size = 56,
  bottom = 20,
  right = 20,
}: FloatingActionButtonProps) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          bottom: bottom,
          right: right,
          backgroundColor: theme.colors.primary,
          shadowColor: theme.colors.primary,
        },
      ]}
    >
      <Ionicons name={icon} size={32} color={theme.colors.buttonText} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});

export default FloatingActionButton;
