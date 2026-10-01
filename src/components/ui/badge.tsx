import React from 'react';
import { StyleSheet, Text, useColorScheme, View, ViewStyle } from 'react-native';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  style?: ViewStyle;
}

export function Badge({
  label,
  variant = 'default',
  size = 'md',
  dot = false,
  style,
}: BadgeProps) {
  const isDark = useColorScheme() === 'dark';

  const variantColors: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
    default: {
      bg: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.06)',
      text: isDark ? '#FFFFFF' : '#1C1C1E',
      dot: isDark ? '#FFFFFF' : '#8E8E93',
    },
    success: {
      bg: isDark ? 'rgba(52, 199, 89, 0.2)' : 'rgba(52, 199, 89, 0.15)',
      text: isDark ? '#30D158' : '#15803D',
      dot: '#34C759',
    },
    warning: {
      bg: isDark ? 'rgba(255, 159, 10, 0.2)' : 'rgba(255, 149, 0, 0.15)',
      text: isDark ? '#FF9F0A' : '#B45309',
      dot: '#FF9500',
    },
    error: {
      bg: isDark ? 'rgba(255, 69, 58, 0.2)' : 'rgba(255, 59, 48, 0.15)',
      text: isDark ? '#FF453A' : '#B91C1C',
      dot: '#FF3B30',
    },
    info: {
      bg: isDark ? 'rgba(10, 132, 255, 0.2)' : 'rgba(0, 122, 255, 0.15)',
      text: isDark ? '#64D2FF' : '#007AFF',
      dot: '#007AFF',
    },
  };

  const currentColors = variantColors[variant];
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: currentColors.bg,
          paddingVertical: isSmall ? 3 : 5,
          paddingHorizontal: isSmall ? 8 : 12,
          borderRadius: isSmall ? 6 : 8,
        },
        style,
      ]}
    >
      {dot && (
        <View
          style={[
            styles.dot,
            {
              backgroundColor: currentColors.dot,
              width: isSmall ? 5 : 7,
              height: isSmall ? 5 : 7,
            },
          ]}
        />
      )}
      <Text
        style={[
          styles.text,
          {
            color: currentColors.text,
            fontSize: isSmall ? 11 : 13,
            fontWeight: '600',
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  dot: {
    borderRadius: 999,
    marginRight: 6,
  },
  text: {
    letterSpacing: 0.2,
  },
});
