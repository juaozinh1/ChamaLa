import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AlertBanner, Button, Card, Chip, InfoRow, LoadingView, Text } from '../../components';
import { useCurrentUser } from '../../contexts/AuthContext';
import { useAction, useRequest } from '../../hooks';
import { useAppNavigation } from '../../navigation/hooks';
import { api } from '../../services';
import { radius, spacing, typography } from '../../theme';
import type { AppStackParamList } from '../../types';
import { computeCancellation, formatCurrency, formatTimeLeft, formatWeekdayDayAt } from '../../utils';
import { makeStyles, useColors } from '../../theme/dynamic';

const CLIENT_REASONS = ['Imprevisto', 'Resolvi de outro jeito', 'Mudei a data', 'Outro'];
const PRO_REASONS = ['Imprevisto', 'Não atendo mais essa região', 'Cliente não respondeu', 'Outro'];

/** Folha de baixo (modal): mostra a multa antes de confirmar o cancelamento. */
export function CancelOrderScreen() {
  const styles = useStyles();
  const colors = useColors();
  const navigation = useAppNavigation();
  const insets = useSafeAreaInsets();
  const { role } = useCurrentUser();
  const { params } = useRoute<RouteProp<AppStackParamList, 'CancelOrder'>>();
  const request = useRequest(() => api.orders.get(params.orderId), [params.orderId]);
  const [reason, setReason] = useState('Imprevisto');
  const [cancel, loading] = useAction(async () => {
    await api.orders.cancel(params.orderId, reason);
    navigation.goBack();
  }, 'Não foi possível cancelar');

  const order = request.data;
  const isClient = role === 'client';
  // Multa só vale para pedidos já confirmados e quando quem cancela é o cliente.
  const chargeable = isClient && order?.status === 'confirmed';
  const calc = order ? computeCancellation(order) : null;
  const fee = chargeable && calc ? calc.fee : 0;
  const reasons = isClient ? CLIENT_REASONS : PRO_REASONS;

  return (
    <View style={styles.root}>
      <Pressable style={styles.backdrop} accessibilityLabel="Fechar" onPress={() => navigation.goBack()} />
      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
        <View style={styles.handle} />
        {!order || !calc ? (
          <View style={styles.loading}>
            <LoadingView />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Cancelar pedido?</Text>

            {chargeable ? (
              calc.free ? (
                <AlertBanner variant="success" icon={false} title="Cancelamento sem multa" message={`Você pode cancelar sem custo até ${formatWeekdayDayAt(calc.freeUntil)}.`} />
              ) : (
                <AlertBanner
                  variant="danger"
                  icon={false}
                  title={calc.hoursLeft > 0 ? `${formatTimeLeft(calc.hoursLeft)} para o serviço` : formatTimeLeft(calc.hoursLeft)}
                  message={`O cancelamento sem multa vai até ${order.policy.freeCancelHours} h antes. Pelo contrato, a multa é de ${order.policy.penaltyPercent}% do valor.`}
                />
              )
            ) : (
              <AlertBanner icon={false} message={isClient ? 'Este pedido ainda não foi confirmado, então não há multa.' : 'O cliente será avisado do cancelamento.'} />
            )}

            {chargeable ? (
              <Card>
                <InfoRow label="Valor do serviço" value={formatCurrency(order.total)} />
                <InfoRow label={`Multa (${order.policy.penaltyPercent}%)`} value={formatCurrency(fee)} valueColor={fee > 0 ? colors.danger : colors.text} />
                <InfoRow label="Sinal a devolver" value={formatCurrency(calc.refund)} />
              </Card>
            ) : null}

            <View>
              <Text style={styles.label}>Motivo</Text>
              <View style={styles.chips}>
                {reasons.map((r) => (
                  <Chip key={r} label={r} selected={reason === r} onPress={() => setReason(r)} />
                ))}
              </View>
            </View>

            <Button
              title={fee > 0 ? `Cancelar e registrar multa de ${formatCurrency(fee)}` : 'Cancelar pedido'}
              variant="dangerOutline"
              loading={loading}
              onPress={() => cancel()}
            />
            <Button title="Manter pedido" disabled={loading} onPress={() => navigation.goBack()} />
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  root: { flex: 1, justifyContent: 'flex-end', backgroundColor: colors.overlay },
  backdrop: { flex: 1 },
  sheet: {
    maxHeight: '90%',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, marginBottom: spacing.md },
  loading: { height: 200 },
  content: { gap: spacing.lg, paddingBottom: spacing.sm },
  title: { ...typography.title, fontSize: 22, color: colors.text },
  label: { ...typography.body, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
}));
