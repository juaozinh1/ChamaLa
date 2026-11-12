import { View } from 'react-native';
import { Text } from './Text';
import { Button } from './Button';
import { Card } from './Card';
import type { Order } from '../types';
import { formatCurrency, formatDateTime } from '../utils/format';
import { spacing, typography } from '../theme';
import { makeStyles } from '../theme/dynamic';

type RequestCardProps = {
  order: Order;
  onOpen?: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
  /** Abre a tela de resposta, para pedidos de orçamento. */
  onRespondQuote?: () => void;
  busy?: boolean;
};

/** Solicitação nova recebida pelo profissional (Painel e aba Solicitações). */
export function RequestCard({ order, onOpen, onAccept, onDecline, onRespondQuote, busy }: RequestCardProps) {
  const styles = useStyles();
  const isQuote = order.status === 'quote_requested';

  return (
    <Card
      onPress={onOpen}
      accessibilityLabel={`${order.serviceTitle}, ${order.clientName}, ${formatDateTime(order.scheduledAt)}`}
    >
      <View style={styles.top}>
        <Text style={styles.title} numberOfLines={2}>
          {order.serviceTitle}
        </Text>
        <Text style={styles.price}>{isQuote ? 'Orçamento' : formatCurrency(order.total)}</Text>
      </View>
      <Text style={styles.line}>👤 {order.clientName}</Text>
      <Text style={styles.line}>
        📅 {formatDateTime(order.scheduledAt)} • 📍 {order.neighborhood}
      </Text>
      <View style={styles.actions}>
        {isQuote ? (
          <Button title="Responder orçamento" size="sm" fullWidth={false} style={styles.flex} onPress={onRespondQuote} />
        ) : (
          <>
            <Button title="Aceitar" size="sm" fullWidth={false} style={styles.flex} loading={busy} onPress={onAccept} />
            <Button title="Recusar" size="sm" variant="neutral" fullWidth={false} style={styles.flex} disabled={busy} onPress={onDecline} />
          </>
        )}
      </View>
    </Card>
  );
}

const useStyles = makeStyles((colors) => ({
  top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.sm },
  title: { ...typography.subtitle, fontSize: 17, fontWeight: '700', color: colors.text, flex: 1 },
  price: { ...typography.subtitle, fontWeight: '700', color: colors.primary },
  line: { ...typography.body, color: colors.textMuted, marginTop: spacing.xs },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  flex: { flex: 1 },
}));
