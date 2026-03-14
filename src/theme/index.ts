import { Platform } from 'react-native';

export interface Theme {
  colors: {
    primary: string; // Teal for accents, buttons, selected states
    background: string; // Main background
    textPrimary: string; // Main text color (black)
    textSecondary: string; // Secondary text, labels, placeholders (gray)
    textTertiary: string; // Lighter gray for unselected icons/text
    success: string;
    warning: string;
    danger: string;
    border: string; // Field borders
    buttonText: string; // Text on buttons
    selectedCategoryBg: string; // Background for selected category
    unselectedCategoryBg: string; // Background for unselected categories
    link: string; // For "See All"
    nonActive: string;
  };
  fonts: {
    regular: string;
    medium: string;
    bold: string;
  };
  fontSizes: {
    small: number; // Labels, links
    medium: number; // Titles, field values
    large: number; // Section headers
    xlarge: number; // Amount value
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    small: number; // Category buttons
    medium: number; // Fields
    large: number; // Full button
  };
}

export const lightTheme: Theme = {
  colors: {
    primary: '#00D09C',
    background: '#FFFFFF',
    textPrimary: '#1A1A1A',
    textSecondary: '#7A7A7A',
    textTertiary: '#BDBDBD',
    success: '#00D09C',
    warning: '#FFB100',
    danger: '#FF4D4D',
    border: '#F0F0F0',
    buttonText: '#FFFFFF',
    selectedCategoryBg: '#E6F9F5',
    unselectedCategoryBg: '#F7F8F9',
    link: '#00D09C',
    nonActive: '#BDBDBD',
  },
  fonts: {
    regular: Platform.OS === 'ios' ? 'System' : 'Roboto',
    medium: Platform.OS === 'ios' ? 'System-Medium' : 'Roboto-Medium',
    bold: Platform.OS === 'ios' ? 'System-Bold' : 'Roboto-Bold',
  },
  fontSizes: {
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 48,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    small: 8,
    medium: 12,
    large: 24,
  },
};

export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: '#121212',
    textPrimary: '#FFFFFF',
    textSecondary: '#A0A0A0',
    textTertiary: '#666666',
    border: '#2C2C2C',
    unselectedCategoryBg: '#1E1E1E',
    selectedCategoryBg: '#0F2D26',
    buttonText: '#FFFFFF',
  },
};

export const theme = lightTheme;
