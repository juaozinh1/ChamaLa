import { useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertBanner, Button, FormInput, Screen } from '../../components';
import { useAction, useRequest } from '../../hooks';
import { api } from '../../services';
import { PaymentForm, paymentSchema } from '../../utils';

export function PaymentDataScreen() {
  const request = useRequest(() => api.professional.paymentData());
  const { control, handleSubmit, reset } = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { holderName: '', pixKey: '' },
  });
  const filled = useRef(false);
  useEffect(() => {
    if (request.data && !filled.current) {
      filled.current = true;
      reset(request.data);
    }
  }, [request.data, reset]);

  const [save, saving] = useAction(async (values: PaymentForm) => {
    await api.professional.savePaymentData(values);
    Alert.alert('Dados salvos', 'Seus dados de pagamento foram atualizados.');
  }, 'Não foi possível salvar');

  return (
    <Screen
      title="Dados de pagamento"
      loading={request.loading && !request.data}
      error={request.error}
      onRetry={request.refetch}
      footer={<Button title="Salvar dados" loading={saving} onPress={handleSubmit((v) => save(v))} />}
    >
      <AlertBanner message="Informe onde você quer receber. O repasse dos pagamentos será ativado quando a integração de pagamentos estiver pronta." />
      <FormInput control={control} name="holderName" label="Nome do titular" autoCapitalize="words" />
      <FormInput control={control} name="pixKey" label="Chave Pix" placeholder="CPF, e-mail, telefone ou chave aleatória" autoCapitalize="none" containerStyle={{ marginBottom: 0 }} />
    </Screen>
  );
}
