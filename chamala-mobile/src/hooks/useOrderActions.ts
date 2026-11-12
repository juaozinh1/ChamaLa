import { useState } from 'react';
import { Alert } from 'react-native';
import { api } from '../services';
import { getErrorMessage } from '../utils/errors';

/** Aceitar e recusar solicitações (usado no Painel e na aba Solicitações). */
export function useOrderActions(onDone: () => void | Promise<void>) {
  const [busyId, setBusyId] = useState<string | null>(null);

  const run = async (id: string, fn: () => Promise<unknown>) => {
    setBusyId(id);
    try {
      await fn();
      await onDone();
    } catch (e) {
      Alert.alert('Não foi possível concluir', getErrorMessage(e));
    } finally {
      setBusyId(null);
    }
  };

  return {
    busyId,
    accept: (id: string) => run(id, () => api.orders.accept(id)),
    decline: (id: string) =>
      Alert.alert('Recusar solicitação?', 'O cliente será avisado.', [
        { text: 'Voltar', style: 'cancel' },
        { text: 'Recusar', style: 'destructive', onPress: () => void run(id, () => api.orders.decline(id)) },
      ]),
  };
}
