import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ConfirmCall,
  InputCall,
  ChoiceCall,
} from '@/components/calls';
import { Spacing, MaxContentWidth } from '@/constants/theme';

export default function HomeScreen() {
  const isDark = useColorScheme() === 'dark';

  // État local pour afficher le résultat du dernier appel dans l'écran
  const [resultLog, setResultLog] = useState<{
    action: string;
    value: string;
    timestamp: string;
  } | null>(null);

  /**
   * 1. Démonstration du bouton "Confirmation"
   *
   * 💡 EXPLICATION PÉDAGOGIQUE :
   * - `await ConfirmCall.call(...)` : Déclenche l'affichage du modal et met en pause
   *   l'exécution de la fonction asynchrone jusqu'à ce que l'utilisateur prenne une décision.
   * - `call.end(true)` ou `call.end(false)` : Déclenché par les boutons dans le modal.
   * - Comment le résultat revient : la promesse retournée par `ConfirmCall.call` se résout
   *   avec le booléen passé à `call.end`, assigné directement à la constante `isConfirmed`.
   */
  const handleConfirmDemo = async () => {
    // -------------------------------------------------------------
    // AVEC REACT-CALL (APPROCHE MODERNE IMPÉRATIVE / ASYNCHRONE) :
    // -------------------------------------------------------------
    const isConfirmed = await ConfirmCall.call({
      title: 'Confirmer la suppression',
      message: 'Voulez-vous vraiment supprimer cet élément ? Cette action est irréversible.',
      confirmText: 'Confirmer',
      cancelText: 'Annuler',
      destructive: true,
    });

    setResultLog({
      action: 'Confirmation',
      value: isConfirmed ? '✅ Confirmé (true)' : '❌ Annulé (false)',
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  /**
   * 2. Démonstration du bouton "Saisie"
   *
   * 💡 EXPLICATION PÉDAGOGIQUE :
   * - `await InputCall.call(...)` ouvre la boîte de dialogue avec TextInput.
   * - Le composant callable gère la frappe de l'utilisateur avec son propre useState interne.
   * - Quand l'utilisateur clique sur "Valider", `call.end(texteSaisi)` résout la promesse
   *   et renvoie directement la chaîne de caractères à la constante `userInput`.
   */
  const handleInputDemo = async () => {
    const userInput = await InputCall.call({
      title: 'Nom d’utilisateur',
      message: 'Veuillez saisir votre pseudonyme pour continuer :',
      placeholder: 'Ex: Alice, Bob...',
      confirmText: 'Enregistrer',
      cancelText: 'Annuler',
    });

    setResultLog({
      action: 'Saisie utilisateur',
      value:
        userInput !== null
          ? `📝 Valeur reçue : "${userInput}"`
          : '🚫 Saisie annulée (null)',
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  /**
   * 3. Démonstration du bouton "Choix"
   *
   * 💡 EXPLICATION PÉDAGOGIQUE :
   * - `await ChoiceCall.call(...)` ouvre une liste d'options : « Calcul », « Historique », « Paramètres ».
   * - Au tap d'une option, `call.end(choix.id)` est appelé et transmet l'identifiant sélectionné.
   * - Le composant appelant reçoit directement le choix sans aucune variable d'état intermédiaire.
   */
  const handleChoiceDemo = async () => {
    const selectedChoice = await ChoiceCall.call({
      title: 'Sélectionnez un module',
      message: 'Choisissez la section vers laquelle vous souhaitez naviguer :',
      choices: [
        {
          id: 'Calcul',
          label: 'Calcul',
          description: 'Effectuer des opérations mathématiques',
        },
        {
          id: 'Historique',
          label: 'Historique',
          description: 'Consulter les entrées et actions précédentes',
        },
        {
          id: 'Paramètres',
          label: 'Paramètres',
          description: 'Configurer les préférences de l’application',
        },
      ],
      cancelText: 'Fermer',
    });

    setResultLog({
      action: 'Choix de module',
      value: selectedChoice
        ? `🎯 Option sélectionnée : "${selectedChoice}"`
        : '🚫 Aucun choix sélectionné (null)',
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  /**
   * 4. Bonus pédagogique : Enchaînement séquentiel (Workflow séquentiel)
   *
   * Regardez la lisibilité : 3 dialogues successifs s'enchaînent de manière linéaire !
   * En React classique avec `useState(false)`, cela nécessiterait 3 états booléens,
   * des callbacks imbriqués ou des machines à état complexes.
   */
  const handleSequentialDemo = async () => {
    // Étape 1 : Confirmation
    const proceed = await ConfirmCall.call({
      title: 'Démarrer l’assistant',
      message: 'Voulez-vous configurer un nouveau profil en 2 étapes ?',
      confirmText: 'Démarrer',
    });
    if (!proceed) {
      setResultLog({
        action: 'Workflow séquentiel',
        value: 'Arrêté à l’étape 1 (Annulé)',
        timestamp: new Date().toLocaleTimeString(),
      });
      return;
    }

    // Étape 2 : Saisie
    const pseudo = await InputCall.call({
      title: 'Étape 2/2 : Pseudonyme',
      message: 'Entrez le nom du profil :',
      placeholder: 'Ex: Développeur React Native',
    });
    if (!pseudo) {
      setResultLog({
        action: 'Workflow séquentiel',
        value: 'Arrêté à l’étape 2 (Saisie vide ou annulée)',
        timestamp: new Date().toLocaleTimeString(),
      });
      return;
    }

    // Étape 3 : Choix
    const role = await ChoiceCall.call({
      title: 'Rôle principal',
      choices: [
        { id: 'Calcul', label: 'Calcul', description: 'Profil orienté calculs' },
        { id: 'Historique', label: 'Historique', description: 'Profil archiveur' },
        { id: 'Paramètres', label: 'Paramètres', description: 'Profil administrateur' },
      ],
    });

    setResultLog({
      action: 'Workflow terminé avec succès 🎉',
      value: `Profil "${pseudo}" configuré sur la section [${role ?? 'Défaut'}]`,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: isDark ? '#000000' : '#F2F2F7' },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* En-tête */}
        <View style={styles.header}>
          <Text
            style={[
              styles.headerTitle,
              { color: isDark ? '#FFFFFF' : '#000000' },
            ]}
          >
            react-call dans Expo
          </Text>
          <Text
            style={[
              styles.headerSubtitle,
              { color: isDark ? '#A1A1A6' : '#666666' },
            ]}
          >
            Appels impératifs asynchrones avec await
          </Text>
        </View>

        {/* Panneau de comparaison pédagogique */}
        <View
          style={[
            styles.card,
            { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' },
          ]}
        >
          <Text
            style={[
              styles.cardTitle,
              { color: isDark ? '#FFFFFF' : '#111111' },
            ]}
          >
            💡 Différence clé : useState vs await Call
          </Text>

          {/* Approche classique */}
          <View style={styles.comparisonBox}>
            <Text style={styles.badgeOld}>Approche classique (useState)</Text>
            <Text style={[styles.codeText, { color: isDark ? '#FF9F0A' : '#D97706' }]}>
              {`// Nécessite plusieurs états éparpillés :\nconst [visible, setVisible] = useState(false);\nconst [data, setData] = useState(null);\n\n// Déclenchement puis callbacks séparés :\n<Button onPress={() => setVisible(true)} />\n<Modal visible={visible} onConfirm={(val) => { ... }} />`}
            </Text>
          </View>

          {/* Approche react-call */}
          <View style={styles.comparisonBox}>
            <Text style={styles.badgeNew}>Approche react-call (await)</Text>
            <Text style={[styles.codeText, { color: isDark ? '#30D158' : '#15803D' }]}>
              {`// Flux séquentiel direct et typé en 1 seule ligne :\nconst confirmed = await ConfirmCall.call({ message: "..." });\nif (confirmed) {\n  // Code exécuté directement ici !\n}`}
            </Text>
          </View>
        </View>

        {/* Section des boutons interactifs demandés */}
        <View
          style={[
            styles.card,
            { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' },
          ]}
        >
          <Text
            style={[
              styles.cardTitle,
              { color: isDark ? '#FFFFFF' : '#111111' },
            ]}
          >
            Démonstrations interactives
          </Text>

          {/* 1. Bouton Confirmation */}
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.blueButton,
              { opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={handleConfirmDemo}
          >
            <Text style={styles.actionButtonText}>
              1. Confirmation (await ConfirmCall.call)
            </Text>
            <Text style={styles.actionButtonSubtext}>
              Retourne true ou false avec call.end(bool)
            </Text>
          </Pressable>

          {/* 2. Bouton Saisie */}
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.greenButton,
              { opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={handleInputDemo}
          >
            <Text style={styles.actionButtonText}>
              2. Saisie de texte (await InputCall.call)
            </Text>
            <Text style={styles.actionButtonSubtext}>
              Modal avec TextInput retournant la saisie
            </Text>
          </Pressable>

          {/* 3. Bouton Choix */}
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.purpleButton,
              { opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={handleChoiceDemo}
          >
            <Text style={styles.actionButtonText}>
              3. Choix (await ChoiceCall.call)
            </Text>
            <Text style={styles.actionButtonSubtext}>
              Calcul, Historique ou Paramètres
            </Text>
          </Pressable>

          {/* 4. Chaînage séquentiel */}
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.orangeButton,
              { opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={handleSequentialDemo}
          >
            <Text style={styles.actionButtonText}>
              ⚡ Chaînage séquentiel (Workflow complet)
            </Text>
            <Text style={styles.actionButtonSubtext}>
              Enchaîne Confirmation ➔ Saisie ➔ Choix en un seul flux
            </Text>
          </Pressable>
        </View>

        {/* Affichage du résultat reçu */}
        <View
          style={[
            styles.card,
            { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' },
          ]}
        >
          <Text
            style={[
              styles.cardTitle,
              { color: isDark ? '#FFFFFF' : '#111111' },
            ]}
          >
            Résultat retourné à l’écran principal
          </Text>

          {resultLog ? (
            <View
              style={[
                styles.resultContainer,
                { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' },
              ]}
            >
              <View style={styles.resultHeader}>
                <Text
                  style={[
                    styles.resultAction,
                    { color: isDark ? '#64D2FF' : '#007AFF' },
                  ]}
                >
                  {resultLog.action}
                </Text>
                <Text style={styles.resultTime}>{resultLog.timestamp}</Text>
              </View>
              <Text
                style={[
                  styles.resultValue,
                  { color: isDark ? '#FFFFFF' : '#111111' },
                ]}
              >
                {resultLog.value}
              </Text>
            </View>
          ) : (
            <Text
              style={[
                styles.emptyText,
                { color: isDark ? '#8E8E93' : '#8E8E93' },
              ]}
            >
              Cliquez sur un des boutons ci-dessus pour déclencher un appel et
              voir la valeur retournée par le await s’afficher ici en direct.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.four,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
    gap: Spacing.four,
  },
  header: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 15,
    textAlign: 'center',
  },
  card: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  comparisonBox: {
    marginBottom: 14,
    borderRadius: 12,
    padding: 12,
    backgroundColor: 'rgba(128, 128, 128, 0.08)',
  },
  badgeOld: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  badgeNew: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  codeText: {
    fontFamily: Platform.select({ ios: 'Courier', default: 'monospace' }),
    fontSize: 12,
    lineHeight: 18,
  },
  actionButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  blueButton: {
    backgroundColor: '#007AFF',
  },
  greenButton: {
    backgroundColor: '#34C759',
  },
  purpleButton: {
    backgroundColor: '#AF52DE',
  },
  orangeButton: {
    backgroundColor: '#FF9500',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  actionButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
  },
  resultContainer: {
    padding: 16,
    borderRadius: 14,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultAction: {
    fontSize: 14,
    fontWeight: '700',
  },
  resultTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
