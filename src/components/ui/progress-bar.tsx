import React from 'react';
import { StyleSheet, Text, useColorScheme, View, ViewStyle } from 'react-native';

export interface ProgressBarProps {
  progress: number; // 0 to 100
  label?: string;
  showPercentage?: boolean;
  color?: string;
  height?: number;
  style?: ViewStyle;
}

export function ProgressBar({
  progress,
  label,
  showPercentage = true,
  color = '#007AFF',
  height = 8,
  style,
}: ProgressBarProps) {
  const isDark = useColorScheme() === 'dark';
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <View style={[styles.container, style]}>
      {(label || showPercentage) && (
        <View style={styles.header}>
          {label && (
            <Text
              style={[
                styles.label,
                { color: isDark ? '#E5E5EA' : '#1C1C1E' },
              ]}
            >
              {label}
            </Text>
          )}
          {showPercentage && (
            <Text
              style={[
                styles.percentage,
                { color: isDark ? '#8E8E93' : '#666666' },
              ]}
            >
              {Math.round(clampedProgress)}%
            </Text>
          )}
        </View>
      )}

      <View
        style={[
          styles.track,
          {
            height,
            backgroundColor: isDark ? '#2C2C2E' : '#E5E5EA',
            borderRadius: height / 2,
          },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${clampedProgress}%`,
              backgroundColor: color,
              borderRadius: height / 2,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  percentage: {
    fontSize: 12,
    fontWeight: '500',
  },
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
