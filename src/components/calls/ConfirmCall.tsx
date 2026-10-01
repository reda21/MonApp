import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { createCallable } from 'react-call';

// 1. Définition des types des props passées à ConfirmCall.call(...)
export interface ConfirmProps {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

// 2. Définition du type de retour attendu par le "await ConfirmCall.call(...)"
export type ConfirmResponse = boolean;

/**
 * ConfirmCall est un composant callable créé via `createCallable<Props, Response>`.
 *
 * Principes clés de react-call :
 * - `createCallable` : Transforme un composant React classique en une fonction asynchrone appelable.
 * - Le composant reçoit une prop spéciale `call` en plus de ses props ordinaires.
 * - `call.end(response)` : Termine l'appel et résout la promesse avec la valeur passée en paramètre.
 * - `await ConfirmCall.call(...)` : Déclenche l'affichage du composant et attend que `call.end()` soit exécuté.
 */
export const ConfirmCall = createCallable<ConfirmProps, ConfirmResponse>(
  ({
    call, // Objet injecté par react-call contenant notamment la méthode .end()
    title = 'Confirmation',
    message,
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    destructive = false,
  }) => {
    const isDark = useColorScheme() === 'dark';

    return (
      <Modal
        transparent
        animationType="fade"
        // Le modal est visible tant que l'appel n'a pas été terminé via call.end()
        visible={!call.ended}
        // Sur Android, le bouton retour matériel ferme le modal et renvoie false
        onRequestClose={() => call.end(false)}
      >
        <View style={styles.overlay}>
          {/* Clic sur le fond semi-transparent pour annuler */}
          <Pressable
            style={styles.backdrop}
            onPress={() => call.end(false)}
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

            {/* Message descriptif */}
            <Text
              style={[
                styles.message,
                { color: isDark ? '#A1A1A6' : '#666666' },
              ]}
            >
              {message}
            </Text>

            {/* Boutons d'action */}
            <View style={styles.buttonRow}>
              {/* Bouton Annuler : renvoie false à l'appelant */}
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.cancelButton,
                  {
                    backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
                onPress={() => {
                  // call.end(false) résout le "await ConfirmCall.call(...)" avec `false`
                  call.end(false);
                }}
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

              {/* Bouton Confirmer : renvoie true à l'appelant */}
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.confirmButton,
                  destructive && styles.destructiveButton,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
                onPress={() => {
                  // call.end(true) résout le "await ConfirmCall.call(...)" avec `true`
                  call.end(true);
                }}
              >
                <Text style={styles.confirmButtonText}>{confirmText}</Text>
              </Pressable>
            </View>
          </View>
        </View>
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
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
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
  destructiveButton: {
    backgroundColor: '#FF3B30',
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
