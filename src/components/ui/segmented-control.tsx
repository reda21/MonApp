import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ViewStyle,
} from 'react-native';

export interface SegmentOption<T extends string = string> {
  value: T;
  label: string;
  badge?: string | number;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentOption<T>[];
  selectedValue: T;
  onValueChange: (value: T) => void;
  style?: ViewStyle;
}

export function SegmentedControl<T extends string = string>({
  options,
  selectedValue,
  onValueChange,
  style,
}: SegmentedControlProps<T>) {
  const isDark = useColorScheme() === 'dark';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#2C2C2E' : '#E5E5EA',
        },
        style,
      ]}
    >
      {options.map((option) => {
        const isSelected = option.value === selectedValue;
        return (
          <Pressable
            key={option.value}
            onPress={() => onValueChange(option.value)}
            style={[
              styles.segment,
              isSelected && [
                styles.selectedSegment,
                {
                  backgroundColor: isDark ? '#636366' : '#FFFFFF',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isDark ? 0.3 : 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                },
              ],
            ]}
          >
            <Text
              style={[
                styles.label,
                {
                  color: isSelected
                    ? isDark
                      ? '#FFFFFF'
                      : '#000000'
                    : isDark
                    ? '#8E8E93'
                    : '#666666',
                  fontWeight: isSelected ? '600' : '500',
                },
              ]}
            >
              {option.label}
            </Text>
            {option.badge !== undefined && (
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: isSelected
                      ? isDark
                        ? '#007AFF'
                        : '#007AFF'
                      : isDark
                      ? '#3A3A3C'
                      : '#D1D1D6',
                  },
                ]}
              >
                <Text style={styles.badgeText}>{option.badge}</Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 3,
    marginVertical: 8,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 9,
  },
  selectedSegment: {},
  label: {
    fontSize: 13,
  },
  badge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
