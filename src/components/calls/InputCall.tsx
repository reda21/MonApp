import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { createCallable } from 'react-call';

// 1. Définition des options passées lors de l'appel : InputCall.call(...)
export interface InputProps {
  title?: string;
  message?: string;
  placeholder?: string;
  defaultValue?: string;
  confirmText?: string;
  cancelText?: string;
}

// 2. Valeur de retour : la chaîne saisie ou null en cas d'annulation
export type InputResponse = string | null;

/**
 * InputCall est un composant callable avec formulaire de saisie.
 *
 * Fonctionnement avec react-call :
 * - `createCallable` permet d'utiliser des hooks React standards (`useState`, `useEffect`, etc.)
 *   à l'intérieur du composant callable.
 * - Le composant gère la saisie locale dans son propre état React (`value`).
 * - Lors de la validation, `call.end(value)` termine l'appel et retourne la valeur saisie
 *   directement à la ligne qui a exécuté `const valeur = await InputCall.call(...)`.
 */
export const InputCall = createCallable<InputProps, InputResponse>(
  ({
    call, // Fourni par react-call, permet de clore l'appel via call.end(...)
    title = 'Saisie requise',
    message,
    placeholder = 'Entrez votre texte...',
    defaultValue = '',
    confirmText = 'Valider',
    cancelText = 'Annuler',
  }) => {
    const isDark = useColorScheme() === 'dark';
    // État local du composant pour capturer la saisie utilisateur
    const [value, setValue] = useState(defaultValue);

    return (
      <Modal
        transparent
        animationType="fade"
        visible={!call.ended}
        // Annulation par le bouton physique ou geste de retour
        onRequestClose={() => call.end(null)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.overlay}
        >
          {/* Clic hors du modal pour annuler */}
          <Pressable
            style={styles.backdrop}
            onPress={() => call.end(null)}
          />

          <View
            style={[
              styles.dialogCard,
              { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' },
            ]}
          >
            {/* Titre */}
            <Text
              style={[
                styles.title,
                { color: isDark ? '#FFFFFF' : '#111111' },
              ]}
            >
              {title}
            </Text>

            {/* Message d'instruction facultatif */}
            {message ? (
              <Text
                style={[
                  styles.message,
                  { color: isDark ? '#A1A1A6' : '#666666' },
                ]}
              >
                {message}
              </Text>
            ) : null}

            {/* Champ de saisie React Native */}
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
                  color: isDark ? '#FFFFFF' : '#111111',
                  borderColor: isDark ? '#3A3A3C' : '#E5E5EA',
                },
              ]}
              value={value}
              onChangeText={setValue}
              placeholder={placeholder}
              placeholderTextColor={isDark ? '#8E8E93' : '#AEAEB2'}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={() => call.end(value.trim())}
            />

            {/* Actions : Annuler ou Valider */}
            <View style={styles.buttonRow}>
              {/* Annuler -> renvoie null */}
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.cancelButton,
                  {
                    backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
                onPress={() => call.end(null)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    { color: isDark ? '#FFFFFF' : '#000000' },
                  ]}
                >
                  {cancelText}
                </Text>
              </Pressable>

              {/* Valider -> renvoie le texte saisi */}
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.confirmButton,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
                onPress={() => {
                  // Le résultat transmis à call.end() devient la valeur de retour du await !
                  call.end(value.trim());
                }}
              >
                <Text style={styles.confirmButtonText}>{confirmText}</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.2)',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
