import React from 'react';
import { Image, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Alert } from 'react-native';
import { AlertBanner, Badge, Button, Card, InfoRow, Screen, Text } from '../../components';
import { useCurrentUser } from '../../contexts/AuthContext';
import { useAction, useRequest } from '../../hooks';
import { useAppNavigation } from '../../navigation/hooks';
import { api } from '../../services';
import { radius, spacing, typography } from '../../theme';
import type { AppStackParamList, Order } from '../../types';
import {
  computeCancellation, formatCurrency, formatDateTime, formatTime, formatWeekdayDate,
  formatWeekdayDateTime, formatWeekdayDayAt, statusInfo,
} from '../../utils';
import { makeStyles, useColors } from '../../theme/dynamic';

export function OrderDetailScreen() {
  const styles = useStyles();
  const colors = useColors();
  const navigation = useAppNavigation();
  const { role } = useCurrentUser();
  const { params } = useRoute<RouteProp<AppStackParamList, 'OrderDetail'>>();
  const request = useRequest(() => api.orders.get(params.orderId), [params.orderId]);
  const order = request.data;
  const isClient = role === 'client';

  const [act, busy] = useAction(async (fn: () => Promise<Order>) => {
    request.setData(await fn());
  });

  const confirmDecline = (title: string, fn: () => Promise<Order>) =>
    Alert.alert(title, 'Essa ação não pode ser desfeita.', [
      { text: 'Voltar', style: 'cancel' },
      { text: 'Confirmar', style: 'destructive', onPress: () => void act(fn) },
    ]);

  if (!order) {
    return <Screen title="Pedido" loading={request.loading} error={request.error} onRetry={request.refetch} />;
  }

  const { label, badge } = statusInfo(order.status, role);
  const other = isClient ? order.professionalName : order.clientName;
  const status = order.status;
  const addressVisible = isClient || status === 'confirmed' || status === 'completed';
  const bothAccepted = Boolean(order.contract.clientAcceptedAt && order.contract.professionalAcceptedAt);
  const pendingParty = !order.contract.clientAcceptedAt ? 'cliente' : 'profissional';
  const calc = computeCancellation(order);
  const hasValue = order.total > 0;
  const reschedule = order.reschedule?.status === 'pending' ? order.reschedule : null;

  const openContract = () => navigation.navigate('Contract', { orderId: order.id });
  const openCancel = () => navigation.navigate('CancelOrder', { orderId: order.id });
  const openReschedule = () => navigation.navigate('ProposeNewDate', { orderId: order.id });

  let footer: React.ReactNode = null;
  if (isClient) {
    if (status === 'confirmed') {
      footer = (
        <>
          <Button title="Ver contrato" onPress={openContract} />
          {!reschedule ? <Button title="Propor nova data" variant="outline" onPress={openReschedule} /> : null}
          <Button title="Cancelar pedido" variant="dangerOutline" onPress={openCancel} />
        </>
      );
    } else if (status === 'pending' || status === 'quote_requested') {
      footer = <Button title="Cancelar pedido" variant="dangerOutline" onPress={openCancel} />;
    } else if (status === 'quote_sent') {
      footer = (
        <>
          <Button title="Aceitar orçamento" loading={busy} onPress={() => act(() => api.orders.respondQuote(order.id, true))} />
          <Button title="Recusar orçamento" variant="outline" disabled={busy} onPress={() => confirmDecline('Recusar orçamento?', () => api.orders.respondQuote(order.id, false))} />
        </>
      );
    } else if (status === 'completed') {
      footer = (
        <>
          {!order.reviewed ? <Button title="Avaliar serviço" onPress={() => navigation.navigate('ReviewService', { orderId: order.id })} /> : null}
          <Button title="Ver contrato" variant="outline" onPress={openContract} />
        </>
      );
    }
  } else if (status === 'pending') {
    footer = (
      <>
        <Button title="Aceitar pedido" loading={busy} onPress={() => act(() => api.orders.accept(order.id))} />
        <Button title="Recusar pedido" variant="neutral" disabled={busy} onPress={() => confirmDecline('Recusar pedido?', () => api.orders.decline(order.id))} />
      </>
    );
  } else if (status === 'quote_requested') {
    footer = (
      <>
        <Button title="Responder orçamento" onPress={() => navigation.navigate('RespondQuote', { orderId: order.id })} />
        <Button title="Recusar pedido" variant="outline" disabled={busy} onPress={() => confirmDecline('Recusar pedido?', () => api.orders.decline(order.id))} />
      </>
    );
  } else if (status === 'confirmed') {
    footer = (
      <>
        <Button title="Marcar como concluído" loading={busy} onPress={() => act(() => api.orders.complete(order.id))} />
        <Button title="Ver contrato" variant="outline" onPress={openContract} />
        <View style={styles.footerRow}>
          {!reschedule ? <Button title="Propor nova data" size="sm" variant="neutral" fullWidth={false} style={styles.flex} onPress={openReschedule} /> : null}
          <Button title="Cancelar pedido" size="sm" variant="dangerOutline" fullWidth={false} style={styles.flex} onPress={openCancel} />
        </View>
      </>
    );
  } else if (status === 'completed') {
    footer = <Button title="Ver contrato" variant="outline" onPress={openContract} />;
  }

  return (
    <Screen
      title={`Pedido #${order.code}`}
      error={request.error}
      onRetry={request.refetch}
      refreshing={request.refreshing}
      onRefresh={request.refresh}
      footer={footer}
    >
      <Badge label={label} status={badge} />

      <Card>
        <Text style={styles.title}>{order.serviceTitle}</Text>
        <Text style={styles.muted}>
          {other}
          {order.specialty ? ` · ${order.specialty}` : ''}
        </Text>
        <View style={styles.rows}>
          <InfoRow label="Data" value={formatWeekdayDate(order.scheduledAt)} />
          <InfoRow label="Horário" value={formatTime(order.scheduledAt)} />
          <InfoRow label="Endereço" value={addressVisible ? order.address : `${order.neighborhood} (endereço completo após o aceite)`} />
          {order.hours ? <InfoRow label="Duração" value={`${order.hours}h`} /> : null}
        </View>
      </Card>

      {order.description ? (
        <Card>
          <Text style={styles.section}>Descrição do cliente</Text>
          <Text style={styles.muted}>{order.description}</Text>
          {order.photos.length > 0 ? (
            <View style={styles.photos}>
              {order.photos.map((uri) => (
                <Image key={uri} source={{ uri }} style={styles.photo} accessibilityIgnoresInvertColors />
              ))}
            </View>
          ) : null}
        </Card>
      ) : null}

      {order.notes ? (
        <Card>
          <Text style={styles.section}>Observações</Text>
          <Text style={styles.muted}>{order.notes}</Text>
        </Card>
      ) : null}

      <Card>
        <InfoRow label="Valor do serviço" value={hasValue ? formatCurrency(order.total) : 'Aguardando orçamento'} />
        {order.discount > 0 ? <InfoRow label="Desconto aplicado" value={`- ${formatCurrency(order.discount)}`} valueColor={colors.success} /> : null}
        <InfoRow label="Sinal pago no agendamento" value={formatCurrency(order.depositPaid)} />
        {status !== 'quote_requested' ? (
          <InfoRow
            label="Contrato"
            value={bothAccepted ? 'Aceito pelas duas partes' : `Aguardando aceite do ${pendingParty}`}
            valueColor={bothAccepted ? colors.success : colors.gold}
          />
        ) : null}
      </Card>

      {status === 'quote_sent' && order.quote ? (
        <Card>
          <Text style={styles.section}>{isClient ? 'Orçamento recebido' : 'Orçamento enviado'}</Text>
          <InfoRow label="Valor" value={formatCurrency(order.total)} />
          <InfoRow label="Validade" value={`${order.quote.validityDays} dias`} />
          {order.quote.message ? <Text style={[styles.muted, styles.gap]}>{order.quote.message}</Text> : null}
          {!isClient ? <Text style={[styles.muted, styles.gap]}>Aguardando a resposta do cliente.</Text> : null}
        </Card>
      ) : null}

      {status === 'confirmed' ? (
        calc.free ? (
          <AlertBanner
            variant="warning"
            icon={false}
            message={`Cancelamento sem multa até ${formatWeekdayDayAt(calc.freeUntil)}. Depois disso, multa de ${order.policy.penaltyPercent}% (${formatCurrency((order.total * order.policy.penaltyPercent) / 100)}), conforme o contrato.`}
          />
        ) : (
          <AlertBanner
            variant="danger"
            icon={false}
            message={`O prazo de cancelamento sem multa já passou. Cancelar agora gera multa de ${order.policy.penaltyPercent}% (${formatCurrency(calc.fee)}).`}
          />
        )
      ) : null}

      {reschedule ? (
        <Card>
          <Text style={styles.section}>Proposta de nova data</Text>
          <Text style={styles.muted}>
            {reschedule.proposedBy === role ? 'Você propôs' : `${isClient ? 'O profissional' : 'O cliente'} propôs`}{' '}
            {formatWeekdayDateTime(reschedule.scheduledAt)}.
          </Text>
          {reschedule.message ? <Text style={[styles.muted, styles.gap]}>“{reschedule.message}”</Text> : null}
          {reschedule.proposedBy !== role ? (
            <View style={[styles.footerRow, styles.gap]}>
              <Button title="Aceitar" size="sm" fullWidth={false} style={styles.flex} loading={busy} onPress={() => act(() => api.orders.respondReschedule(order.id, true))} />
              <Button title="Recusar" size="sm" variant="neutral" fullWidth={false} style={styles.flex} disabled={busy} onPress={() => act(() => api.orders.respondReschedule(order.id, false))} />
            </View>
          ) : (
            <Text style={[styles.muted, styles.gap]}>Aguardando a resposta da outra parte.</Text>
          )}
        </Card>
      ) : null}

      {status === 'cancelled' && order.cancellation ? (
        <AlertBanner
          variant="danger"
          title="Pedido cancelado"
          message={`Cancelado por ${order.cancellation.by === 'client' ? 'cliente' : 'profissional'} em ${formatDateTime(order.cancellation.at)}. Motivo: ${order.cancellation.reason}.${order.cancellation.fee > 0 ? ` Multa: ${formatCurrency(order.cancellation.fee)}.` : ''}`}
        />
      ) : null}
      {status === 'declined' ? <AlertBanner variant="danger" title="Pedido recusado" message="Este pedido foi recusado e não será realizado." /> : null}
      {status === 'completed' ? <AlertBanner variant="success" title="Serviço concluído" message={order.reviewed ? 'Obrigado pela avaliação!' : isClient ? 'Conte como foi o serviço avaliando o profissional.' : 'Serviço registrado como concluído.'} /> : null}
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  flex: { flex: 1 },
  title: { ...typography.subtitle, fontWeight: '700', color: colors.text },
  muted: { ...typography.body, fontSize: 14, color: colors.textMuted, marginTop: 2 },
  section: { ...typography.body, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  rows: { marginTop: spacing.md },
  gap: { marginTop: spacing.md },
  footerRow: { flexDirection: 'row', gap: spacing.md },
  photos: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  photo: { width: 64, height: 64, borderRadius: radius.md },
}));
