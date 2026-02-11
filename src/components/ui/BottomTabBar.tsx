import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Text from './Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme';

const tabIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: 'grid',
  Insights: 'stats-chart',
  Settings: 'settings',
  Profile: 'person',
};

const BottomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        paddingBottom: insets.bottom,
      }}
    >
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          // Determine label
          const labelText =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : typeof options.tabBarLabel === 'function'
                ? options
                  .tabBarLabel({
                    focused: state.index === index,
                    color: '',
                    position: 'below-icon',
                    children: route.name,
                  })
                  ?.toString() // convert to string for Text
                : (options.title ?? route.name);

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const iconName = tabIcons[route.name] || 'help-circle-outline';

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole='button'
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={
                typeof options.tabBarAccessibilityLabel === 'string'
                  ? options.tabBarAccessibilityLabel
                  : labelText
              }
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
            >
              <Ionicons
                name={iconName as keyof typeof Ionicons.glyphMap}
                size={24}
                color={
                  isFocused ? theme.colors.primary : theme.colors.nonActive
                }
              />

              <Text
                variant='caption'
                color={isFocused ? 'primary' : 'nonActive'}
                style={styles.label}
              >
                {labelText}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    paddingTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    position: 'relative',
  },
  label: {
    marginTop: 4,
    fontWeight: '500',
  },
});

export default BottomTabBar;
