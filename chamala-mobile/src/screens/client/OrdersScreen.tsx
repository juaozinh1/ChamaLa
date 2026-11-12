import { useState } from 'react';
import { Button, EmptyState, OrderCard, Screen, Tabs } from '../../components';
import { useRequest } from '../../hooks';
import { useAppNavigation } from '../../navigation/hooks';
import { api } from '../../services';
import { isActive } from '../../utils';

const TABS = [
  { key: 'active', label: 'Ativos' },
  { key: 'history', label: 'Histórico' },
];

export function OrdersScreen() {
  const navigation = useAppNavigation();
  const [tab, setTab] = useState('active');
  const orders = useRequest(() => api.orders.list());

  const all = orders.data ?? [];
  const visible = all
    .filter((o) => (tab === 'active' ? isActive(o.status) : !isActive(o.status)))
    .sort((a, b) => {
      const diff = new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
      return tab === 'active' ? diff : -diff;
    });

  return (
    <Screen
      large
      title="Meus Pedidos"
      loading={orders.loading && !orders.data}
      error={orders.error}
      onRetry={orders.refetch}
      refreshing={orders.refreshing}
      onRefresh={orders.refresh}
    >
      <Tabs tabs={TABS} activeKey={tab} onChange={setTab} />
      {visible.map((order) => {
        const canCancel = ['pending', 'confirmed', 'quote_requested'].includes(order.status);
        const canReview = order.status === 'completed' && !order.reviewed;
        return (
          <OrderCard
            key={order.id}
            order={order}
            viewer="client"
            onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
            action={
              canCancel ? (
                <Button title="Cancelar" size="sm" variant="dangerOutline" fullWidth={false} onPress={() => navigation.navigate('CancelOrder', { orderId: order.id })} />
              ) : canReview ? (
                <Button title="Avaliar" size="sm" variant="outline" fullWidth={false} onPress={() => navigation.navigate('ReviewService', { orderId: order.id })} />
              ) : undefined
            }
          />
        );
      })}
      {orders.data && visible.length === 0 ? (
        <EmptyState
          emoji={tab === 'active' ? '🗓️' : '📋'}
          title={tab === 'active' ? 'Nenhum pedido ativo' : 'Nenhum pedido no histórico'}
          message={tab === 'active' ? 'Quando você contratar um serviço, ele aparece aqui.' : 'Pedidos concluídos ou cancelados aparecem aqui.'}
        />
      ) : null}
    </Screen>
  );
}
