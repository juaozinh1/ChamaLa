import {  } from 'react-native';
import { Card, EmptyState, OrderCard, Screen, Text } from '../../components';
import { useRequest } from '../../hooks';
import { useAppNavigation } from '../../navigation/hooks';
import { api } from '../../services';
import { typography } from '../../theme';
import { formatCurrency, pluralize } from '../../utils';
import { makeStyles } from '../../theme/dynamic';

export function ServicesDoneScreen() {
  const styles = useStyles();
  const navigation = useAppNavigation();
  const request = useRequest(() => api.orders.list());
  const done = (request.data ?? [])
    .filter((o) => o.status === 'completed')
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
  const total = done.reduce((sum, o) => sum + o.total, 0);

  return (
    <Screen
      title="Serviços Realizados"
      loading={request.loading && !request.data}
      error={request.error}
      onRetry={request.refetch}
      refreshing={request.refreshing}
      onRefresh={request.refresh}
    >
      {done.length > 0 ? (
        <Card>
          <Text style={styles.total}>{formatCurrency(total)}</Text>
          <Text style={styles.muted}>
            {done.length} {pluralize(done.length, 'serviço concluído', 'serviços concluídos')}
          </Text>
        </Card>
      ) : null}
      {done.map((order) => (
        <OrderCard key={order.id} order={order} viewer="professional" onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })} />
      ))}
      {request.data && done.length === 0 ? <EmptyState emoji="📋" title="Nenhum serviço concluído" message="Os serviços que você concluir aparecem aqui." /> : null}
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  total: { ...typography.title, color: colors.primary },
  muted: { ...typography.body, fontSize: 14, color: colors.textMuted },
}));
