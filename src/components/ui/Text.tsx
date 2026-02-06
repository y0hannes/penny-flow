import {
  Text as NativeText,
  TextProps as NativeTextProps,
  StyleProp,
  TextStyle,
} from 'react-native';
import { TextVariant, TextColorVariant } from '@/types/ui-variants';
import { theme } from '@/theme';

interface TextProps extends NativeTextProps {
  variant?: TextVariant;
  color?: TextColorVariant;
  align?: 'left' | 'right' | 'center';
  bold?: boolean;
  style?: StyleProp<TextStyle>;
}

const Text = ({
  variant = 'default',
  color,
  align,
  bold = false,
  style,
  children,
  ...props
}: TextProps) => {
  const baseStyle: TextStyle = {
    color: theme.colors.primary,
    fontFamily: theme.fonts.regular,
  };
  const variantStyles: Record<TextVariant, TextStyle> = {
    default: { fontSize: theme.fontSizes.medium },
    heading: { fontSize: theme.fontSizes.xlarge, fontFamily: theme.fonts.bold },
    subheading: {
      fontSize: theme.fontSizes.large,
      fontFamily: theme.fonts.medium,
    },
    body: { fontSize: theme.fontSizes.medium },
    caption: {
      fontSize: theme.fontSizes.small,
      fontFamily: theme.fonts.regular,
    },
    amount: { fontSize: theme.fontSizes.xlarge, fontFamily: theme.fonts.bold },
    button: {
      color: theme.colors.buttonText,
      fontSize: theme.fontSizes.medium,
      fontFamily: theme.fonts.medium,
    },
    error: { color: theme.colors.danger, fontSize: theme.fontSizes.small },
    link: { color: theme.colors.link },
  };

  const colorStyles: Record<TextColorVariant, TextStyle> = {
    primary: { color: theme.colors.primary },
    textPrimary: { color: theme.colors.textPrimary },
    textSecondary: { color: theme.colors.textSecondary },
    textTertiary: { color: theme.colors.textTertiary },
    success: { color: theme.colors.success },
    danger: { color: theme.colors.danger },
    warning: { color: theme.colors.warning },
    nonActive: { color: theme.colors.nonActive },
  };

  const combinedStyle: StyleProp<TextStyle> = [
    baseStyle,
    variantStyles[variant],
    color && colorStyles[color],
    bold && ({ fontFamily: theme.fonts.bold } as TextStyle),
    align && ({ textAlign: align } as TextStyle),
    style,
  ];

  return (
    <NativeText style={combinedStyle} {...props}>
      {children}
    </NativeText>
  );
};

export default Text;
