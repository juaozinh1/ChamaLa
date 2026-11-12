import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, EmptyState, FormInput, Screen, SectionTitle, Text } from '../../components';
import { useAction, useRequest } from '../../hooks';
import { api } from '../../services';
import { spacing, typography } from '../../theme';
import { AddressForm, addressSchema } from '../../utils';
import { makeStyles } from '../../theme/dynamic';

export function AddressesScreen() {
  const styles = useStyles();
  const request = useRequest(() => api.account.addresses());
  const { control, handleSubmit, reset } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: { label: '', line: '' },
  });
  const [add, adding] = useAction(async (values: AddressForm) => {
    await api.account.addAddress(values);
    reset();
    await request.refetch();
  }, 'Não foi possível salvar');
  const [remove] = useAction(async (id: string) => {
    await api.account.removeAddress(id);
    await request.refetch();
  }, 'Não foi possível remover');

  return (
    <Screen title="Endereços salvos" loading={request.loading && !request.data} error={request.error} onRetry={request.refetch}>
      {(request.data ?? []).map((address) => (
        <Card key={address.id}>
          <View style={styles.row}>
            <View style={styles.flex}>
              <Text style={styles.label}>📍 {address.label}</Text>
              <Text style={styles.line}>{address.line}</Text>
            </View>
            <Button title="Remover" size="sm" variant="dangerOutline" fullWidth={false} onPress={() => remove(address.id)} />
          </View>
        </Card>
      ))}
      {request.data && request.data.length === 0 ? <EmptyState emoji="📍" title="Nenhum endereço salvo" message="Salve seus endereços para agendar mais rápido." /> : null}

      <SectionTitle title="Novo endereço" />
      <View>
        <FormInput control={control} name="label" label="Nome do endereço" placeholder="Ex: Casa, Trabalho" />
        <FormInput control={control} name="line" label="Endereço" placeholder="Rua, número e bairro" containerStyle={{ marginBottom: 0 }} />
      </View>
      <Button title="Adicionar endereço" variant="outline" loading={adding} onPress={handleSubmit((v) => add(v))} />
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  label: { ...typography.body, fontWeight: '700', color: colors.text },
  line: { ...typography.body, fontSize: 14, color: colors.textMuted, marginTop: 2 },
}));
