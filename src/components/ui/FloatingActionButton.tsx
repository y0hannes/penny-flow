import React from 'react';
import { StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme';

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
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
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
