import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  ViewStyle,
  TextStyle,
} from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
}: ButtonProps) {
  const isDark = useColorScheme() === 'dark';

  const getContainerStyle = (pressed: boolean): ViewStyle => {
    let bg = '#007AFF';
    let border = 'transparent';

    switch (variant) {
      case 'primary':
        bg = '#007AFF';
        break;
      case 'secondary':
        bg = isDark ? '#2C2C2E' : '#E5E5EA';
        break;
      case 'outline':
        bg = 'transparent';
        border = isDark ? '#3A3A3C' : '#C7C7CC';
        break;
      case 'ghost':
        bg = 'transparent';
        break;
      case 'danger':
        bg = '#FF3B30';
        break;
    }

    const sizePaddings: Record<ButtonSize, { py: number; px: number; radius: number }> = {
      sm: { py: 8, px: 12, radius: 8 },
      md: { py: 12, px: 18, radius: 12 },
      lg: { py: 16, px: 24, radius: 16 },
    };

    const currentSize = sizePaddings[size];

    return {
      backgroundColor: bg,
      borderColor: border,
      borderWidth: variant === 'outline' ? 1.5 : 0,
      paddingVertical: currentSize.py,
      paddingHorizontal: currentSize.px,
      borderRadius: currentSize.radius,
      opacity: disabled ? 0.5 : pressed ? 0.75 : 1,
      transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
    };
  };

  const getTextStyle = (): TextStyle => {
    let color = '#FFFFFF';
    switch (variant) {
      case 'primary':
      case 'danger':
        color = '#FFFFFF';
        break;
      case 'secondary':
      case 'outline':
        color = isDark ? '#FFFFFF' : '#000000';
        break;
      case 'ghost':
        color = isDark ? '#64D2FF' : '#007AFF';
        break;
    }

    const fontSizes: Record<ButtonSize, number> = {
      sm: 13,
      md: 15,
      lg: 17,
    };

    return {
      color,
      fontSize: fontSizes[size],
      fontWeight: '600',
    };
  };

  const loaderColor =
    variant === 'primary' || variant === 'danger'
      ? '#FFFFFF'
      : isDark
      ? '#FFFFFF'
      : '#000000';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [styles.baseButton, getContainerStyle(pressed), style]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={loaderColor} style={styles.loader} />
      ) : (
        <>
          {icon && iconPosition === 'left' ? icon : null}
          <Text style={[getTextStyle(), icon ? styles.textWithIcon : undefined]}>
            {label}
          </Text>
          {icon && iconPosition === 'right' ? icon : null}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  loader: {
    paddingHorizontal: 8,
  },
  textWithIcon: {
    marginHorizontal: 6,
  },
});
