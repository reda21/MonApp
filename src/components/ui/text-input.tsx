import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  useColorScheme,
  View,
  ViewStyle,
} from 'react-native';

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  clearable?: boolean;
  containerStyle?: ViewStyle;
}

export function TextInput({
  label,
  error,
  hint,
  clearable = false,
  value,
  onChangeText,
  containerStyle,
  style,
  ...rest
}: TextInputProps) {
  const isDark = useColorScheme() === 'dark';
  const [isFocused, setIsFocused] = useState(false);

  const showClear = clearable && !!value && value.length > 0;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            { color: error ? '#FF3B30' : isDark ? '#E5E5EA' : '#1C1C1E' },
          ]}
        >
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
            borderColor: error
              ? '#FF3B30'
              : isFocused
              ? '#007AFF'
              : isDark
              ? '#3A3A3C'
              : '#E5E5EA',
          },
        ]}
      >
        <RNTextInput
          style={[
            styles.input,
            {
              color: isDark ? '#FFFFFF' : '#000000',
            },
            style,
          ]}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={isDark ? '#8E8E93' : '#AEAEB2'}
          {...rest}
        />

        {showClear && (
          <Pressable
            onPress={() => onChangeText?.('')}
            hitSlop={8}
            style={styles.clearButton}
          >
            <View
              style={[
                styles.clearCircle,
                { backgroundColor: isDark ? '#48484A' : '#C7C7CC' },
              ]}
            >
              <Text
                style={[
                  styles.clearText,
                  { color: isDark ? '#E5E5EA' : '#FFFFFF' },
                ]}
              >
                ✕
              </Text>
            </View>
          </Pressable>
        )}
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : hint ? (
        <Text
          style={[
            styles.hintText,
            { color: isDark ? '#8E8E93' : '#666666' },
          ]}
        >
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    minHeight: 46,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
  },
  clearButton: {
    marginLeft: 8,
  },
  clearCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearText: {
    fontSize: 10,
    fontWeight: '800',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
    marginLeft: 2,
  },
  hintText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 2,
  },
});
