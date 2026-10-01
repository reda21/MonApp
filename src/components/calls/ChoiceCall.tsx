import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { createCallable } from 'react-call';

export interface ChoiceOption {
  id: string;
  label: string;
  description?: string;
  badge?: string;
}

// 1. Props passées lors de l'appel : ChoiceCall.call(...)
export interface ChoiceProps {
  title?: string;
  message?: string;
  choices: ChoiceOption[];
  cancelText?: string;
}

// 2. Type de retour : l'ID du choix retenu (ou null si fermé)
export type ChoiceResponse = string | null;

/**
 * ChoiceCall est un composant de sélection d'option utilisant react-call.
 *
 * Principes clés :
 * - `createCallable<ChoiceProps, ChoiceResponse>` : Spécifie les props d'entrée et le type de retour.
 * - Le composant présente une liste d'options interactives.
 * - Dès que l'utilisateur clique sur une option, on exécute `call.end(option.id)`.
 * - Cela résout immédiatement la promesse côté appelant : `const choix = await ChoiceCall.call(...)`.
 */
export const ChoiceCall = createCallable<ChoiceProps, ChoiceResponse>(
  ({
    call, // Objet fourni par react-call avec call.end(...)
    title = 'Faites un choix',
    message,
    choices,
    cancelText = 'Fermer',
  }) => {
    const isDark = useColorScheme() === 'dark';

    return (
      <Modal
        transparent
        animationType="fade"
        visible={!call.ended}
        // Fermeture Android ou balayage
        onRequestClose={() => call.end(null)}
      >
        <View style={styles.overlay}>
          {/* Clic hors du modal */}
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
            {/* En-tête */}
            <Text
              style={[
                styles.title,
                { color: isDark ? '#FFFFFF' : '#111111' },
              ]}
            >
              {title}
            </Text>

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

            {/* Liste des choix proposés */}
            <ScrollView style={styles.choicesList} bounces={false}>
              {choices.map((choice) => (
                <Pressable
                  key={choice.id}
                  style={({ pressed }) => [
                    styles.choiceItem,
                    {
                      backgroundColor: pressed
                        ? isDark
                          ? '#2C2C2E'
                          : '#E5E5EA'
                        : isDark
                        ? '#242426'
                        : '#F2F2F7',
                      borderColor: isDark ? '#3A3A3C' : '#E5E5EA',
                    },
                  ]}
                  onPress={() => {
                    // call.end(...) renvoie l'ID sélectionné et résout la promesse
                    call.end(choice.id);
                  }}
                >
                  <View style={styles.choiceTextContainer}>
                    <Text
                      style={[
                        styles.choiceLabel,
                        { color: isDark ? '#FFFFFF' : '#111111' },
                      ]}
                    >
                      {choice.label}
                    </Text>
                    {choice.description ? (
                      <Text
                        style={[
                          styles.choiceDescription,
                          { color: isDark ? '#8E8E93' : '#666666' },
                        ]}
                      >
                        {choice.description}
                      </Text>
                    ) : null}
                  </View>

                  <Text style={styles.chevron}>›</Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Bouton de fermeture / annulation */}
            <Pressable
              style={({ pressed }) => [
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
                  styles.cancelButtonText,
                  { color: isDark ? '#FFFFFF' : '#000000' },
                ]}
              >
                {cancelText}
              </Text>
            </Pressable>
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
    maxWidth: 380,
    maxHeight: '80%',
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
    marginBottom: 6,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 18,
  },
  choicesList: {
    marginBottom: 16,
  },
  choiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
  choiceTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  choiceLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  choiceDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  chevron: {
    fontSize: 22,
    color: '#8E8E93',
    fontWeight: '300',
  },
  cancelButton: {
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.2)',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
