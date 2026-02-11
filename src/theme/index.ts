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

export const theme: Theme = {
  colors: {
    primary: '#00D09C', // More vibrant and polished Teal
    background: '#FFFFFF',
    textPrimary: '#1A1A1A', // Slightly softer black
    textSecondary: '#7A7A7A', // Better gray for labels
    textTertiary: '#BDBDBD', // Lighter gray
    success: '#00D09C',
    warning: '#FFB100',
    danger: '#FF4D4D',
    border: '#F0F0F0',
    buttonText: '#FFFFFF',
    selectedCategoryBg: '#E6F9F5', // Light teal background
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
    small: 12, // "See All", placeholders
    medium: 16, // Field values, category names
    large: 20, // Section headers like "Category", "Details"
    xlarge: 48, // Large amount "$0.00"
  },
  spacing: {
    xs: 4, // Small gaps
    sm: 8, // Between elements
    md: 16, // Section padding
    lg: 24, // Larger margins
    xl: 32, // Major spacing
  },
  borderRadius: {
    small: 8, // Category buttons
    medium: 12, // Input fields
    large: 24, // Full-width button
  },
};
