import { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Avatar, Button, Card, Chip, DateField, InfoRow, Input, Screen, Text, TextArea } from '../../components';
import { PROMO_DISCOUNT_PERCENT, TIME_SLOTS } from '../../config/env';
import { useAction, useRequest } from '../../hooks';
import { useAppNavigation } from '../../navigation/hooks';
import { api } from '../../services';
import { spacing, typography } from '../../theme';
import type { AppStackParamList } from '../../types';
import { addDays, combineDateTime, formatCurrency, round2 } from '../../utils';
import { makeStyles, useColors } from '../../theme/dynamic';

const HOURS = [1, 2, 3, 4];

export function BookingScreen() {
  const styles = useStyles();
  const colors = useColors();
  const navigation = useAppNavigation();
  const { params } = useRoute<RouteProp<AppStackParamList, 'Booking'>>();
  const detail = useRequest(() => api.catalog.professional(params.professionalId), [params.professionalId]);
  const addresses = useRequest(() => api.account.addresses());
  const [date, setDate] = useState<Date | null>(() => addDays(new Date(), 1));
  const [time, setTime] = useState('09:00');
  const [hours, setHours] = useState(2);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [addressError, setAddressError] = useState<string>();
  const prefilled = useRef(false);

  useEffect(() => {
    if (!prefilled.current && addresses.data?.length) {
      prefilled.current = true;
      setAddress(addresses.data[0].line);
    }
  }, [addresses.data]);

  const pro = detail.data;
  const service = pro?.services.find((s) => s.id === params.serviceId);
  const price = service ? service.price : round2((pro?.hourlyRate ?? 0) * hours);
  const discount = service ? 0 : round2((price * PROMO_DISCOUNT_PERCENT) / 100);
  const total = round2(price - discount);

  const [confirm, loading] = useAction(async () => {
    if (!pro || !date) return;
    if (address.trim().length < 8) {
      setAddressError('Informe o endereço completo do serviço');
      return;
    }
    const scheduledAt = combineDateTime(date, time);
    if (new Date(scheduledAt).getTime() <= Date.now()) {
      Alert.alert('Horário indisponível', 'Escolha uma data e um horário futuros.');
      return;
    }
    const order = await api.orders.createBooking({
      professionalId: pro.id,
      serviceId: service?.id,
      scheduledAt,
      hours: service ? undefined : hours,
      address: address.trim(),
      notes: notes.trim() || undefined,
    });
    Alert.alert('Agendamento enviado!', 'O profissional vai confirmar o seu pedido. Você acompanha o status em "Pedidos".');
    navigation.reset({
      index: 1,
      routes: [{ name: 'ClientTabs', params: { screen: 'Orders' } }, { name: 'OrderDetail', params: { orderId: order.id } }],
    });
  }, 'Não foi possível agendar');

  return (
    <Screen
      title="Agendar Serviço"
      loading={detail.loading && !pro}
      error={detail.error}
      onRetry={detail.refetch}
      footer={<Button title="Confirmar Agendamento" loading={loading} onPress={() => confirm()} />}
    >
      {pro ? (
        <>
          <Card>
            <View style={styles.pro}>
              <Avatar name={pro.name} emoji={pro.emoji} size={52} />
              <View style={styles.flex}>
                <Text style={styles.name}>{pro.name}</Text>
                <Text style={styles.muted}>
                  {service ? service.title : pro.specialty} • {service ? formatCurrency(service.price) : `R$ ${pro.hourlyRate}/h`}
                </Text>
              </View>
            </View>
          </Card>

          <View>
            <DateField label="Data" value={date} onChange={setDate} />
            <Text style={styles.label}>Horário</Text>
            <View style={styles.slots}>
              {TIME_SLOTS.map((slot) => (
                <Chip key={slot} label={slot} shape="rounded" selected={time === slot} onPress={() => setTime(slot)} style={styles.slot} />
              ))}
            </View>
          </View>

          {!service ? (
            <View>
              <Text style={styles.label}>Duração estimada</Text>
              <View style={styles.slots}>
                {HOURS.map((h) => (
                  <Chip key={h} label={`${h}h`} shape="rounded" selected={hours === h} onPress={() => setHours(h)} style={styles.hour} />
                ))}
              </View>
            </View>
          ) : null}

          <Input
            label="Endereço do serviço"
            placeholder="Rua, número e bairro"
            value={address}
            onChangeText={(text) => {
              setAddress(text);
              setAddressError(undefined);
            }}
            error={addressError}
            containerStyle={{ marginBottom: 0 }}
          />
          <TextArea label="Observações (opcional)" placeholder="Ex: trazer materiais, portão do fundo..." minHeight={96} value={notes} onChangeText={setNotes} />

          <Card>
            <Text style={styles.summary}>Resumo</Text>
            <InfoRow label={service ? service.title : `Serviço (${hours}h)`} value={formatCurrency(price)} />
            {discount > 0 ? <InfoRow label={`Desconto (${PROMO_DISCOUNT_PERCENT}%)`} value={`- ${formatCurrency(discount)}`} valueColor={colors.success} /> : null}
            <View style={styles.divider} />
            <InfoRow label="Total" value={formatCurrency(total)} />
          </Card>
        </>
      ) : null}
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  flex: { flex: 1 },
  pro: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  name: { ...typography.subtitle, fontSize: 17, fontWeight: '700', color: colors.text },
  muted: { ...typography.body, fontSize: 14, color: colors.textMuted },
  label: { ...typography.body, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  slots: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  slot: { width: '31.5%' },
  hour: { width: '23%' },
  summary: { ...typography.subtitle, fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginVertical: spacing.sm },
}));
