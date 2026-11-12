import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Button, FormInput, Screen, SwitchRow } from '../../components';
import { useAction, useRequest } from '../../hooks';
import { useAppNavigation } from '../../navigation/hooks';
import { api } from '../../services';
import type { AppStackParamList } from '../../types';
import { parseCurrency, ServiceForm, serviceSchema } from '../../utils';

export function ServiceFormScreen() {
  const navigation = useAppNavigation();
  const { params } = useRoute<RouteProp<AppStackParamList, 'ServiceForm'>>();
  const existing = useRequest(() => api.professional.services());
  const service = existing.data?.services.find((s) => s.id === params.serviceId);
  const [active, setActive] = useState(true);
  const { control, handleSubmit, reset } = useForm<ServiceForm>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { title: '', price: '' },
  });

  const filled = useRef(false);
  useEffect(() => {
    if (service && !filled.current) {
      filled.current = true;
      reset({ title: service.title, price: String(service.price).replace('.', ',') });
      setActive(service.active);
    }
  }, [service, reset]);

  const [save, saving] = useAction(async (values: ServiceForm) => {
    await api.professional.saveService({ id: params.serviceId, title: values.title.trim(), price: parseCurrency(values.price), active });
    navigation.goBack();
  }, 'Não foi possível salvar');

  const [remove, removing] = useAction(async () => {
    if (params.serviceId) await api.professional.deleteService(params.serviceId);
    navigation.goBack();
  }, 'Não foi possível excluir');

  const confirmRemove = () =>
    Alert.alert('Excluir serviço?', 'Ele deixará de aparecer no seu perfil.', [
      { text: 'Voltar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => void remove() },
    ]);

  return (
    <Screen
      title={params.serviceId ? 'Editar serviço' : 'Novo serviço'}
      loading={Boolean(params.serviceId) && existing.loading && !existing.data}
      error={existing.error}
      onRetry={existing.refetch}
      footer={
        <>
          <Button title="Salvar serviço" loading={saving} onPress={handleSubmit((v) => save(v))} />
          {params.serviceId ? <Button title="Excluir serviço" variant="dangerOutline" loading={removing} onPress={confirmRemove} /> : null}
        </>
      }
    >
      <FormInput control={control} name="title" label="Nome do serviço" placeholder="Ex: Instalação de chuveiro" />
      <FormInput control={control} name="price" label="Preço fixo (R$)" placeholder="150,00" keyboardType="decimal-pad" containerStyle={{ marginBottom: 0 }} />
      <SwitchRow title="Serviço ativo" subtitle="Serviços pausados não aparecem para os clientes" value={active} onValueChange={setActive} />
    </Screen>
  );
}
