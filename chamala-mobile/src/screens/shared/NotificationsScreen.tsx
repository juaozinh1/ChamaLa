import { Alert } from 'react-native';
import { Screen, SwitchRow } from '../../components';
import { useRequest } from '../../hooks';
import { api } from '../../services';
import type { NotificationPrefs } from '../../types';
import { getErrorMessage } from '../../utils';

const OPTIONS: { key: keyof NotificationPrefs; title: string; subtitle: string }[] = [
  { key: 'orders', title: 'Atualizações de pedidos', subtitle: 'Confirmações, mudanças de data e cancelamentos' },
  { key: 'messages', title: 'Mensagens', subtitle: 'Avisos quando alguém falar com você' },
  { key: 'promotions', title: 'Novidades e promoções', subtitle: 'Ofertas e novidades do app' },
];

export function NotificationsScreen() {
  const request = useRequest(() => api.account.notificationPrefs());
  const prefs = request.data;

  const toggle = async (key: keyof NotificationPrefs, value: boolean) => {
    if (!prefs) return;
    const previous = prefs;
    const next = { ...prefs, [key]: value };
    request.setData(next);
    try {
      await api.account.saveNotificationPrefs(next);
    } catch (e) {
      request.setData(previous);
      Alert.alert('Não foi possível salvar', getErrorMessage(e));
    }
  };

  return (
    <Screen title="Notificações" loading={request.loading && !prefs} error={request.error} onRetry={request.refetch}>
      {prefs
        ? OPTIONS.map((o) => (
            <SwitchRow key={o.key} title={o.title} subtitle={o.subtitle} value={prefs[o.key]} onValueChange={(v) => toggle(o.key, v)} />
          ))
        : null}
    </Screen>
  );
}
