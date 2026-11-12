import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { Badge } from './Badge';
import { Card } from './Card';
import type { Order, UserRole } from '../types';
import { formatCurrency, formatDateTime, formatWeekdayDateTime } from '../utils/format';
import { isActive, statusInfo } from '../utils/orderStatus';
import { spacing, typography } from '../theme';
import { makeStyles } from '../theme/dynamic';

type OrderCardProps = {
  order: Order;
  /** Quem está vendo: define o nome exibido (profissional para o cliente e vice-versa) e o rótulo do status. */
  viewer: UserRole;
  onPress?: () => void;
  /** Botões à direita do valor (ex.: Cancelar, Avaliar). */
  action?: ReactNode;
};

/** Cartão de pedido, como em "Meus Pedidos". */
export function OrderCard({ order, viewer, onPress, action }: OrderCardProps) {
  const styles = useStyles();
  const { label, badge } = statusInfo(order.status, viewer);
  const other = viewer === 'client' ? order.professionalName : order.clientName;
  const hasPrice = order.total > 0;

  return (
    <Card
      onPress={onPress}
      accessibilityLabel={`${order.serviceTitle}, ${label}, ${other}, ${formatDateTime(order.scheduledAt)}`}
    >
      <View style={styles.top}>
        <Text style={styles.title} numberOfLines={2}>
          {order.serviceTitle}
        </Text>
        <Badge label={label} status={badge} />
      </View>
      <Text style={styles.line}>👤 {other}</Text>
      <Text style={styles.line}>📅 {formatWeekdayDateTime(order.scheduledAt)}</Text>
      <View style={styles.divider} />
      <View style={styles.bottom}>
        <Text style={[styles.price, !hasPrice && styles.priceMuted]}>
          {hasPrice ? formatCurrency(order.total) : isActive(order.status) ? 'Aguardando valor' : '—'}
        </Text>
        {action}
      </View>
    </Card>
  );
}

const useStyles = makeStyles((colors) => ({
  top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.sm },
  title: { ...typography.subtitle, fontSize: 17, fontWeight: '700', color: colors.text, flex: 1 },
  line: { ...typography.body, color: colors.textMuted, marginTop: spacing.xs },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginVertical: spacing.md },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  price: { ...typography.subtitle, fontWeight: '700', color: colors.primary },
  priceMuted: { color: colors.textMuted, fontWeight: '600', fontSize: 15 },
}));
