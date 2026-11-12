import { useState } from 'react';
import { Alert, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { AlertBanner, Badge, Button, Card, Chip, InfoRow, Input, Screen, Text } from '../../components';
import { useAction, useRequest } from '../../hooks';
import { useAppNavigation } from '../../navigation/hooks';
import { api } from '../../services';
import { spacing, typography } from '../../theme';
import type { AppStackParamList } from '../../types';
import { formatCurrency, formatWeekdayDateTime, parseCurrency, round2 } from '../../utils';
import { makeStyles } from '../../theme/dynamic';

const VALIDITY = [3, 7, 15];

export function RespondQuoteScreen() {
  const styles = useStyles();
  const navigation = useAppNavigation();
  const { params } = useRoute<RouteProp<AppStackParamList, 'RespondQuote'>>();
  const request = useRequest(() => api.orders.get(params.orderId), [params.orderId]);
  const [value, setValue] = useState('');
  const [validity, setValidity] = useState(7);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string>();

  const order = request.data;
  const price = parseCurrency(value);
  const { freeCancelHours, penaltyPercent, depositPercent } = order?.policy ?? { freeCancelHours: 24, penaltyPercent: 15, depositPercent: 0 };
  const deposit = Number.isFinite(price) ? round2((price * depositPercent) / 100) : 0;

  const [send, sending] = useAction(async () => {
    if (!Number.isFinite(price) || price <= 0) {
      setError('Informe o valor do serviço');
      return;
    }
    await api.orders.sendQuote(params.orderId, { price, validityDays: validity, message: message.trim() || undefined });
    Alert.alert('Orçamento enviado', 'O cliente vai analisar e responder.');
    navigation.goBack();
  }, 'Não foi possível enviar');

  const [decline, declining] = useAction(async () => {
    await api.orders.decline(params.orderId);
    navigation.goBack();
  }, 'Não foi possível recusar');

  const confirmDecline = () =>
    Alert.alert('Recusar pedido?', 'O cliente será avisado.', [
      { text: 'Voltar', style: 'cancel' },
      { text: 'Recusar', style: 'destructive', onPress: () => void decline() },
    ]);

  return (
    <Screen
      title="Responder orçamento"
      loading={request.loading && !order}
      error={request.error}
      onRetry={request.refetch}
      footer={
        <>
          <Button title="Enviar orçamento" loading={sending} onPress={() => send()} />
          <Button title="Recusar pedido" variant="outline" loading={declining} disabled={sending} onPress={confirmDecline} />
        </>
      }
    >
      {order ? (
        <>
          <Card>
            <View style={styles.top}>
              <Text style={styles.name}>{order.clientName}</Text>
              <Badge label="Orçamento" status="warning" />
            </View>
            {order.description ? <Text style={styles.quote}>“{order.description}”</Text> : null}
            <InfoRow label="Bairro" value={`${order.neighborhood} · ${order.distanceKm.toFixed(1).replace('.', ',')} km`} />
            <InfoRow label="Data desejada" value={formatWeekdayDateTime(order.scheduledAt)} />
            <InfoRow label="Fotos" value={order.photos.length ? `${order.photos.length} anexada${order.photos.length > 1 ? 's' : ''}` : 'Nenhuma'} />
          </Card>

          <Input
            label="Valor do serviço (R$)"
            placeholder="180,00"
            keyboardType="decimal-pad"
            value={value}
            onChangeText={(t) => {
              setValue(t);
              setError(undefined);
            }}
            error={error}
            containerStyle={{ marginBottom: 0 }}
          />

          <View>
            <Text style={styles.label}>Validade do orçamento</Text>
            <View style={styles.chips}>
              {VALIDITY.map((d) => (
                <Chip key={d} label={`${d} dias`} selected={validity === d} onPress={() => setValidity(d)} />
              ))}
            </View>
          </View>

          <Input label="Mensagem para o cliente (opcional)" placeholder="Ex: Inclui troca do sifão e do cano." value={message} onChangeText={setMessage} containerStyle={{ marginBottom: 0 }} />

          <AlertBanner
            icon={false}
            message={`Sua política vale para este pedido: cancelamento sem multa até ${freeCancelHours} h antes; depois, ${penaltyPercent}%.${depositPercent > 0 ? ` Sinal de ${depositPercent}% (${formatCurrency(deposit)}).` : ''}`}
          />
        </>
      ) : null}
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  name: { ...typography.subtitle, fontWeight: '700', color: colors.text, flex: 1 },
  quote: { ...typography.body, color: colors.textMuted, marginVertical: spacing.md },
  label: { ...typography.body, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  chips: { flexDirection: 'row', gap: spacing.sm },
}));
