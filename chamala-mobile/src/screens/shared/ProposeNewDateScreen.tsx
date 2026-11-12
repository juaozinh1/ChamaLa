import { useMemo, useState } from 'react';
import { Alert, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { AlertBanner, Button, Card, Chip, DatePickerModal, Input, Screen, Text } from '../../components';
import { TIME_SLOTS } from '../../config/env';
import { useAction, useRequest } from '../../hooks';
import { useAppNavigation } from '../../navigation/hooks';
import { api } from '../../services';
import { spacing, typography } from '../../theme';
import type { AppStackParamList } from '../../types';
import { addDays, combineDateTime, formatChipDay, formatWeekdayDateTime, isSameDay, startOfDay } from '../../utils';
import { makeStyles } from '../../theme/dynamic';

/** Próximos 4 dias úteis depois da data atual (pula domingos e datas passadas). */
function suggestedDays(current: Date): Date[] {
  const tomorrow = addDays(startOfDay(new Date()), 1);
  const days: Date[] = [];
  let cursor = addDays(startOfDay(current), 1);
  while (days.length < 4) {
    if (cursor.getDay() !== 0 && cursor.getTime() >= tomorrow.getTime()) days.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return days;
}

export function ProposeNewDateScreen() {
  const styles = useStyles();
  const navigation = useAppNavigation();
  const { params } = useRoute<RouteProp<AppStackParamList, 'ProposeNewDate'>>();
  const request = useRequest(() => api.orders.get(params.orderId), [params.orderId]);
  const order = request.data;
  const [day, setDay] = useState<Date | null>(null);
  const [custom, setCustom] = useState<Date | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [time, setTime] = useState('09:00');
  const [message, setMessage] = useState('');

  const suggestions = useMemo(() => (order ? suggestedDays(new Date(order.scheduledAt)) : []), [order]);

  const [send, loading] = useAction(async () => {
    if (!day) {
      Alert.alert('Escolha a nova data', 'Selecione um dia para enviar a proposta.');
      return;
    }
    await api.orders.proposeReschedule(params.orderId, {
      scheduledAt: combineDateTime(day, time),
      message: message.trim() || undefined,
    });
    Alert.alert('Proposta enviada', 'A outra parte precisa aceitar a nova data.');
    navigation.goBack();
  }, 'Não foi possível enviar');

  return (
    <Screen
      title="Propor nova data"
      loading={request.loading && !order}
      error={request.error}
      onRetry={request.refetch}
      footer={<Button title="Enviar proposta" loading={loading} onPress={() => send()} />}
    >
      {order ? (
        <>
          <Card>
            <Text style={styles.caption}>Data atual</Text>
            <Text style={styles.current}>{formatWeekdayDateTime(order.scheduledAt)}</Text>
          </Card>

          <View>
            <Text style={styles.label}>Nova data</Text>
            <View style={styles.chips}>
              {suggestions.map((d) => (
                <Chip
                  key={d.toISOString()}
                  label={formatChipDay(d)}
                  selected={day ? isSameDay(day, d) : false}
                  onPress={() => {
                    setDay(d);
                    setCustom(null);
                  }}
                />
              ))}
              <Chip
                label={custom ? formatChipDay(custom) : 'Outra data'}
                selected={Boolean(custom && day && isSameDay(day, custom))}
                onPress={() => setPickerOpen(true)}
              />
            </View>
          </View>

          <View>
            <Text style={styles.label}>Horário</Text>
            <View style={styles.chips}>
              {TIME_SLOTS.map((slot) => (
                <Chip key={slot} label={slot} selected={time === slot} onPress={() => setTime(slot)} />
              ))}
            </View>
          </View>

          <Input label="Mensagem (opcional)" placeholder="Ex: Surgiu um compromisso na quinta." value={message} onChangeText={setMessage} containerStyle={{ marginBottom: 0 }} />
          <AlertBanner icon={false} message="A outra parte precisa aceitar a nova data. Reagendar não gera multa e fica registrado no contrato." />

          <DatePickerModal
            visible={pickerOpen}
            selected={day}
            from={addDays(new Date(), 1)}
            onClose={() => setPickerOpen(false)}
            onSelect={(d) => {
              setDay(d);
              setCustom(d);
            }}
          />
        </>
      ) : null}
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  caption: { ...typography.caption, color: colors.textMuted },
  current: { ...typography.subtitle, fontWeight: '700', color: colors.text, marginTop: 2 },
  label: { ...typography.body, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
}));
