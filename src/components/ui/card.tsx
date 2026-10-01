import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ViewStyle,
} from 'react-native';

export interface CardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export function Card({
  title,
  subtitle,
  children,
  footer,
  onPress,
  style,
}: CardProps) {
  const isDark = useColorScheme() === 'dark';

  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      style={({ pressed }: { pressed?: boolean }) => [
        styles.card,
        {
          backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
          borderColor: isDark ? '#2C2C2E' : '#E5E5EA',
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.99 : 1 }],
        },
        style,
      ]}
    >
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && (
            <Text
              style={[
                styles.title,
                { color: isDark ? '#FFFFFF' : '#000000' },
              ]}
            >
              {title}
            </Text>
          )}
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                { color: isDark ? '#8E8E93' : '#666666' },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      )}

      {children && <View style={styles.content}>{children}</View>}

      {footer && (
        <View
          style={[
            styles.footer,
            { borderTopColor: isDark ? '#2C2C2E' : '#F2F2F7' },
          ]}
        >
          {footer}
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    marginVertical: 6,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  content: {
    marginVertical: 4,
  },
  footer: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
  },
});
