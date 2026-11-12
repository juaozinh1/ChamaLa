import { useState } from 'react';
import { Alert, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Button, Card, DateField, Input, PhotoTile, Screen, Select, Text, TextArea } from '../../components';
import { TIME_SLOTS } from '../../config/env';
import { useAction, useRequest } from '../../hooks';
import { useAppNavigation } from '../../navigation/hooks';
import { api } from '../../services';
import { spacing, typography } from '../../theme';
import type { AppStackParamList } from '../../types';
import { addDays, combineDateTime } from '../../utils';
import { pickPhotos } from '../../utils/pickers';
import { makeStyles } from '../../theme/dynamic';

const MAX_PHOTOS = 3;
const TIME_OPTIONS = TIME_SLOTS.map((t) => ({ label: t, value: t }));

export function RequestQuoteScreen() {
  const styles = useStyles();
  const navigation = useAppNavigation();
  const { params } = useRoute<RouteProp<AppStackParamList, 'RequestQuote'>>();
  const detail = useRequest(() => api.catalog.professional(params.professionalId), [params.professionalId]);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [date, setDate] = useState<Date | null>(() => addDays(new Date(), 2));
  const [time, setTime] = useState<string | undefined>('14:00');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<{ description?: string; address?: string; time?: string }>({});

  const pro = detail.data;

  const addPhotos = async () => {
    const files = await pickPhotos(MAX_PHOTOS - photos.length);
    if (files.length) setPhotos((current) => [...current, ...files.map((f) => f.uri)].slice(0, MAX_PHOTOS));
  };

  const [send, loading] = useAction(async () => {
    const next: typeof errors = {};
    if (description.trim().length < 10) next.description = 'Descreva o que precisa ser feito (mínimo 10 caracteres)';
    if (address.trim().length < 8) next.address = 'Informe o endereço completo';
    if (!time) next.time = 'Escolha um horário';
    setErrors(next);
    if (Object.keys(next).length || !pro || !date || !time) return;

    const order = await api.orders.createQuoteRequest({
      professionalId: pro.id,
      description: description.trim(),
      photos,
      scheduledAt: combineDateTime(date, time),
      address: address.trim(),
    });
    Alert.alert('Pedido enviado!', 'O profissional vai responder com o valor. Você acompanha em "Pedidos".');
    navigation.reset({
      index: 1,
      routes: [{ name: 'ClientTabs', params: { screen: 'Orders' } }, { name: 'OrderDetail', params: { orderId: order.id } }],
    });
  }, 'Não foi possível enviar o pedido');

  return (
    <Screen
      title="Pedir orçamento"
      loading={detail.loading && !pro}
      error={detail.error}
      onRetry={detail.refetch}
      footer={<Button title="Enviar pedido de orçamento" loading={loading} onPress={() => send()} />}
    >
      {pro ? (
        <>
          <Card>
            <Text style={styles.name}>
              {pro.name} · {pro.specialty}
            </Text>
            <Text style={styles.muted}>
              {pro.verified ? 'Verificado · ' : ''}★ {pro.rating.toFixed(1).replace('.', ',')} · {pro.distanceKm.toFixed(1).replace('.', ',')} km
            </Text>
          </Card>

          <TextArea
            label="O que precisa ser feito?"
            placeholder="Descreva o serviço com o máximo de detalhes"
            value={description}
            onChangeText={(t) => {
              setDescription(t);
              setErrors((e) => ({ ...e, description: undefined }));
            }}
            error={errors.description}
            maxLength={500}
            minHeight={110}
          />

          <View>
            <Text style={styles.label}>Fotos do problema (até {MAX_PHOTOS})</Text>
            <View style={styles.photos}>
              {photos.map((uri, index) => (
                <PhotoTile key={uri} uri={uri} size={84} onRemove={() => setPhotos((cur) => cur.filter((_, i) => i !== index))} />
              ))}
              {photos.length < MAX_PHOTOS ? <PhotoTile size={84} label="+ Foto" onPress={addPhotos} /> : null}
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.flex}>
              <DateField label="Data desejada" value={date} onChange={setDate} />
            </View>
            <View style={styles.flex}>
              <Select
                label="Horário"
                options={TIME_OPTIONS}
                value={time}
                onChange={(v) => {
                  setTime(v);
                  setErrors((e) => ({ ...e, time: undefined }));
                }}
                error={errors.time}
              />
            </View>
          </View>

          <Input
            label="Endereço"
            placeholder="Rua, número e bairro"
            value={address}
            onChangeText={(t) => {
              setAddress(t);
              setErrors((e) => ({ ...e, address: undefined }));
            }}
            error={errors.address}
            helperText="O endereço exato só é mostrado ao profissional depois que você aceitar o orçamento."
          />
        </>
      ) : null}
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  flex: { flex: 1 },
  row: { flexDirection: 'row', gap: spacing.md },
  photos: { flexDirection: 'row', gap: spacing.md },
  name: { ...typography.subtitle, fontSize: 17, fontWeight: '700', color: colors.text },
  muted: { ...typography.body, fontSize: 14, color: colors.textMuted, marginTop: 2 },
  label: { ...typography.body, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
}));
