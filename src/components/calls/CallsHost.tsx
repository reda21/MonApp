import React from 'react';
import { ConfirmCall } from './ConfirmCall';
import { InputCall } from './InputCall';
import { ChoiceCall } from './ChoiceCall';

/**
 * CallsHost regroupe les points de montage (Roots) des composants callables.
 *
 * Fonctionnement clé de react-call :
 * - Chaque composant créé avec `createCallable` est AUSSI le composant racine qui écoute
 *   et rend ses appels actifs.
 * - En plaçant `<CallsHost />` au sommet de votre application (par exemple dans `_layout.tsx`),
 *   toutes vos modals `react-call` deviennent prêtes à être déclenchées depuis n'importe quel
 *   écran ou sous-composant sans avoir à instancier manuellement des <Modal> partout.
 */
export function CallsHost() {
  return (
    <>
      <ConfirmCall />
      <InputCall />
      <ChoiceCall />
    </>
  );
}
