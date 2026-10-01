import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Button,
  Badge,
  Card,
  TextInput,
  SegmentedControl,
  ProgressBar,
  Collapsible,
} from '@/components/ui';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

type DemoCategory = 'all' | 'buttons' | 'forms' | 'cards' | 'feedback';

export default function UIComponentsDemoScreen() {
  const isDark = useColorScheme() === 'dark';
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };

  // États interactifs pour tester les composants
  const [selectedCategory, setSelectedCategory] = useState<DemoCategory>('all');
  const [btnLoading, setBtnLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [switchValue, setSwitchValue] = useState(true);
  const [progress, setProgress] = useState(65);
  const [clickCount, setClickCount] = useState(0);

  const simulateLoading = () => {
    setBtnLoading(true);
    setTimeout(() => {
      setBtnLoading(false);
      setClickCount((prev) => prev + 1);
    }, 1800);
  };

  const showSection = (cat: DemoCategory) =>
    selectedCategory === 'all' || selectedCategory === cat;

  return (
    <ScrollView
      style={[
        styles.scrollView,
        { backgroundColor: isDark ? '#000000' : '#F2F2F7' },
      ]}
      contentContainerStyle={[
        styles.contentContainer,
        {
          paddingTop: Platform.OS === 'android' ? insets.top + Spacing.two : Spacing.four,
          paddingBottom: insets.bottom,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text
            style={[
              styles.headerTitle,
              { color: isDark ? '#FFFFFF' : '#000000' },
            ]}
          >
            Galerie de Composants UI
          </Text>
          <Text
            style={[
              styles.headerSubtitle,
              { color: isDark ? '#8E8E93' : '#666666' },
            ]}
          >
            Bibliothèque de composants natifs réutilisables
          </Text>

          {/* Filtre par catégorie (SegmentedControl) */}
          <SegmentedControl<DemoCategory>
            options={[
              { value: 'all', label: 'Tous' },
              { value: 'buttons', label: 'Boutons' },
              { value: 'forms', label: 'Saisie' },
              { value: 'cards', label: 'Cartes' },
              { value: 'feedback', label: 'Statuts' },
            ]}
            selectedValue={selectedCategory}
            onValueChange={setSelectedCategory}
            style={styles.segmentedControl}
          />
        </View>

        {/* 1. SECTION BOUTONS */}
        {showSection('buttons') && (
          <Card
            title="1. Boutons & Actions (Button)"
            subtitle="Variantes de style, tailles et gestion de l'état asynchrone"
          >
            <Text style={[styles.sectionSubtitle, { color: isDark ? '#A1A1A6' : '#555555' }]}>
              Variantes de couleur :
            </Text>
            <View style={styles.wrapRow}>
              <Button label="Primary" variant="primary" />
              <Button label="Secondary" variant="secondary" />
              <Button label="Outline" variant="outline" />
              <Button label="Ghost" variant="ghost" />
              <Button label="Danger" variant="danger" />
            </View>

            <Text style={[styles.sectionSubtitle, { color: isDark ? '#A1A1A6' : '#555555' }]}>
              Tailles :
            </Text>
            <View style={styles.wrapRow}>
              <Button label="Small" size="sm" />
              <Button label="Medium (Défaut)" size="md" />
              <Button label="Large" size="lg" />
            </View>

            <Text style={[styles.sectionSubtitle, { color: isDark ? '#A1A1A6' : '#555555' }]}>
              Interactivité & Chargement :
            </Text>
            <View style={styles.wrapRow}>
              <Button
                label={btnLoading ? 'Opération...' : 'Simuler un chargement'}
                loading={btnLoading}
                onPress={simulateLoading}
              />
              <Button label="Désactivé" disabled variant="secondary" />
            </View>
            {clickCount > 0 && (
              <Text style={[styles.infoNote, { color: isDark ? '#30D158' : '#15803D' }]}>
                ✓ Opérations terminées : {clickCount}
              </Text>
            )}
          </Card>
        )}

        {/* 2. SECTION FORMULAIRES & SAISIE */}
        {showSection('forms') && (
          <Card
            title="2. Formulaires & Saisie (TextInput & Switch)"
            subtitle="Champs de texte avec label, bouton effacer et interrupteurs"
          >
            <TextInput
              label="Champ standard avec effacement"
              placeholder="Tapez un texte ici..."
              value={inputValue}
              onChangeText={setInputValue}
              clearable
              hint="Le bouton croix apparaît dès qu'il y a du texte."
            />

            <TextInput
              label="Champ avec validation d'erreur"
              placeholder="Entrez au moins 5 caractères"
              value={inputError}
              onChangeText={(text) => {
                setInputError(text);
              }}
              error={
                inputError.length > 0 && inputError.length < 5
                  ? 'Le texte doit comporter au moins 5 caractères'
                  : undefined
              }
            />

            <View style={styles.switchRow}>
              <View style={styles.switchTextContainer}>
                <Text
                  style={[
                    styles.switchLabel,
                    { color: isDark ? '#FFFFFF' : '#000000' },
                  ]}
                >
                  Mode notifications actives
                </Text>
                <Text
                  style={[
                    styles.switchDesc,
                    { color: isDark ? '#8E8E93' : '#666666' },
                  ]}
                >
                  Interrupteur natif React Native
                </Text>
              </View>
              <Switch
                value={switchValue}
                onValueChange={setSwitchValue}
                trackColor={{ false: '#767577', true: '#34C759' }}
              />
            </View>
          </Card>
        )}

        {/* 3. SECTION CARTES & CONTENEURS */}
        {showSection('cards') && (
          <Card
            title="3. Cartes (Card)"
            subtitle="Blocs visuels élégants avec en-tête, corps et pied"
          >
            <Card
              title="Carte interactive"
              subtitle="Appuyez pour tester l'animation de pression"
              onPress={() => alert('Carte pressée !')}
              footer={
                <View style={styles.cardFooterRow}>
                  <Text style={[styles.cardFooterText, { color: isDark ? '#8E8E93' : '#666666' }]}>
                    Statut : En ligne
                  </Text>
                  <Badge label="Actif" variant="success" size="sm" dot />
                </View>
              }
            >
              <Text style={{ color: isDark ? '#E5E5EA' : '#333333', lineHeight: 20 }}>
                Cette carte supporte un comportement interactif via la prop onPress,
                avec une mise à l'échelle subtile lors de l'appui.
              </Text>
            </Card>
          </Card>
        )}

        {/* 4. SECTION STATUTS & RETOURS */}
        {showSection('feedback') && (
          <Card
            title="4. Badges & Indicateurs (Badge)"
            subtitle="Étiquettes de statut sémantiques et contextuelles"
          >
            <Text style={[styles.sectionSubtitle, { color: isDark ? '#A1A1A6' : '#555555' }]}>
              Variantes sémantiques avec indicateur :
            </Text>
            <View style={styles.wrapRow}>
              <Badge label="Succès" variant="success" dot />
              <Badge label="Avertissement" variant="warning" dot />
              <Badge label="Erreur" variant="error" dot />
              <Badge label="Information" variant="info" dot />
              <Badge label="Neutre" variant="default" dot />
            </View>

            <Text style={[styles.sectionSubtitle, { color: isDark ? '#A1A1A6' : '#555555' }]}>
              Petite taille (sm) :
            </Text>
            <View style={styles.wrapRow}>
              <Badge label="Complété" variant="success" size="sm" />
              <Badge label="En attente" variant="warning" size="sm" />
              <Badge label="Échoué" variant="error" size="sm" />
              <Badge label="Nouveau" variant="info" size="sm" />
            </View>
          </Card>
        )}

        {/* 5. PROGRESSION & ACCORDÉONS */}
        {(showSection('all') || showSection('feedback')) && (
          <Card
            title="5. Barre de progression & Accordéon"
            subtitle="Composants dynamiques avec animations"
          >
            <ProgressBar
              progress={progress}
              label="Téléchargement du module"
              color="#007AFF"
            />

            <View style={styles.progressControls}>
              <Button
                label="-15%"
                size="sm"
                variant="outline"
                onPress={() => setProgress((p) => Math.max(0, p - 15))}
              />
              <Button
                label="+15%"
                size="sm"
                variant="outline"
                onPress={() => setProgress((p) => Math.min(100, p + 15))}
              />
              <Button
                label="Réinitialiser"
                size="sm"
                variant="ghost"
                onPress={() => setProgress(50)}
              />
            </View>

            <View style={{ marginTop: 16 }}>
              <Collapsible title="Détails du module (Accordéon animé)">
                <Text style={{ color: isDark ? '#A1A1A6' : '#666666', lineHeight: 22, marginTop: 4 }}>
                  Cet accordéon est propulsé par react-native-reanimated. Il se déplie
                  avec une transition fluide sans saccades.
                </Text>
              </Collapsible>
            </View>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  container: {
    maxWidth: MaxContentWidth,
    width: '100%',
    gap: Spacing.three,
  },
  header: {
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  segmentedControl: {
    marginTop: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
    marginBottom: 6,
  },
  infoNote: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 8,
  },
  switchTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  switchDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardFooterText: {
    fontSize: 13,
  },
  progressControls: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
});
