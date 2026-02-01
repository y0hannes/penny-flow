import { Platform } from 'react-native';

export interface Theme {
  colors: {
    primary: string; // Teal for accents, buttons, selected states
    background: string; // Main background
    textPrimary: string; // Main text color (black)
    textSecondary: string; // Secondary text, labels, placeholders (gray)
    textTertiary: string; // Lighter gray for unselected icons/text
    border: string; // Field borders
    buttonText: string; // Text on buttons
    selectedCategoryBg: string; // Background for selected category
    unselectedCategoryBg: string; // Background for unselected categories
    link: string; // For "See All"
  };
  fonts: {
    regular: string;
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
    primary: '#00BFA5', // Teal from "Food" button, "See All", "Save Expense" button
    background: '#FFFFFF', // White background
    textPrimary: '#000000', // Black for main texts like "Add New Expense", "Category", "Details"
    textSecondary: '#808080', // Gray for labels like "AMOUNT", "DATE", "NOTE", "ACCOUNT"
    textTertiary: '#A0A0A0', // Lighter gray for unselected category text/icons
    border: '#E0E0E0', // Light gray for field borders (approximated)
    buttonText: '#FFFFFF', // White text on primary buttons
    selectedCategoryBg: '#00BFA5', // Teal for selected category
    unselectedCategoryBg: '#F0F0F0', // Light gray for unselected categories
    link: '#00BFA5', // Teal for "See All"
  },
  fonts: {
    regular: Platform.OS === 'ios' ? 'System' : 'Roboto',
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
