import { useState } from 'react';
import { EmptyState, OrderCard, RequestCard, Screen, Tabs } from '../../components';
import { useOrderActions, useRequest } from '../../hooks';
import { useAppNavigation } from '../../navigation/hooks';
import { api } from '../../services';
import type { Order } from '../../types';

const TABS = [
  { key: 'new', label: 'Novas' },
  { key: 'agenda', label: 'Agenda' },
  { key: 'history', label: 'Histórico' },
];

const bucket = (o: Order) =>
  o.status === 'pending' || o.status === 'quote_requested' ? 'new' : o.status === 'confirmed' || o.status === 'quote_sent' ? 'agenda' : 'history';

const EMPTY: Record<string, { emoji: string; title: string; message: string }> = {
  new: { emoji: '📭', title: 'Nenhuma solicitação nova', message: 'Novos pedidos de clientes aparecem aqui.' },
  agenda: { emoji: '🗓️', title: 'Agenda vazia', message: 'Serviços confirmados e orçamentos em andamento aparecem aqui.' },
  history: { emoji: '📋', title: 'Histórico vazio', message: 'Serviços concluídos, recusados ou cancelados aparecem aqui.' },
};

// A aba Solicitações não aparece nos prints: esta é uma proposta (novas, agenda e histórico).
export function RequestsScreen() {
  const navigation = useAppNavigation();
  const [tab, setTab] = useState('new');
  const orders = useRequest(() => api.orders.list());
  const actions = useOrderActions(() => orders.refetchSilent());

  const visible = (orders.data ?? [])
    .filter((o) => bucket(o) === tab)
    .sort((a, b) => {
      const diff = new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
      return tab === 'history' ? -diff : diff;
    });
  const empty = EMPTY[tab];

  return (
    <Screen
      large
      title="Solicitações"
      loading={orders.loading && !orders.data}
      error={orders.error}
      onRetry={orders.refetch}
      refreshing={orders.refreshing}
      onRefresh={orders.refresh}
    >
      <Tabs tabs={TABS} activeKey={tab} onChange={setTab} />
      {visible.map((order) =>
        tab === 'new' ? (
          <RequestCard
            key={order.id}
            order={order}
            busy={actions.busyId === order.id}
            onOpen={() => navigation.navigate('OrderDetail', { orderId: order.id })}
            onAccept={() => actions.accept(order.id)}
            onDecline={() => actions.decline(order.id)}
            onRespondQuote={() => navigation.navigate('RespondQuote', { orderId: order.id })}
          />
        ) : (
          <OrderCard key={order.id} order={order} viewer="professional" onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })} />
        ),
      )}
      {orders.data && visible.length === 0 ? <EmptyState {...empty} /> : null}
    </Screen>
  );
}
