import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertBanner, Button, FormInput, FormSelect, ProgressSteps, Screen, Text } from '../../components';
import { useAuth } from '../../contexts/AuthContext';
import { useAction, useRequest } from '../../hooks';
import { api } from '../../services';
import { spacing, typography } from '../../theme';
import { maskPhone, ProfessionalSignUpForm, professionalSignUpSchema } from '../../utils';
import { makeStyles } from '../../theme/dynamic';

export const SIGNUP_STEPS = ['Criação de Conta', 'Verificação'];

export function ProfessionalSignUpScreen() {
  const styles = useStyles();
  const { signUpProfessional } = useAuth();
  const categories = useRequest(() => api.catalog.categories());
  const { control, handleSubmit } = useForm<ProfessionalSignUpForm>({
    resolver: zodResolver(professionalSignUpSchema),
    defaultValues: { name: '', phone: '', email: '', password: '', specialtyId: '', area: '' },
  });
  const [submit, loading] = useAction(
    (values: ProfessionalSignUpForm, startVerification: boolean) => signUpProfessional(values, { startVerification }),
    'Não foi possível criar a conta',
  );

  const options = (categories.data ?? []).map((c) => ({ label: c.name, value: c.id }));

  return (
    <Screen
      title="Cadastro de Profissional"
      footer={
        <>
          <Button title="Criar Conta e Acessar" loading={loading} onPress={handleSubmit((v) => submit(v, false))} />
          <Button title="Criar Conta + Fazer Verificação agora" variant="outline" disabled={loading} onPress={handleSubmit((v) => submit(v, true))} />
          <Text style={styles.terms}>
            Ao continuar, você concorda com os <Text style={styles.link}>Termos de Serviço</Text>.
          </Text>
        </>
      }
    >
      <ProgressSteps steps={SIGNUP_STEPS} currentStep={0} />
      <AlertBanner message="Após criar sua conta, você já poderá acessar o app. A verificação de identidade e qualificações é feita em uma segunda etapa." />
      <View>
        <FormInput control={control} name="name" label="Nome Completo" placeholder="Ex: Carlos Mendes" autoCapitalize="words" />
        <FormInput control={control} name="phone" label="Telefone / WhatsApp" placeholder="(11) 98765-4321" keyboardType="phone-pad" mask={maskPhone} />
        <FormInput control={control} name="email" label="E-mail" placeholder="carlos@email.com" keyboardType="email-address" autoCapitalize="none" />
        <FormInput control={control} name="password" label="Senha" placeholder="Mínimo 8 caracteres" secureTextEntry autoCapitalize="none" />
        <FormSelect control={control} name="specialtyId" label="Especialidade Principal" placeholder="Selecione sua especialidade" options={options} />
        <FormInput control={control} name="area" label="Área de Atuação (Bairro/Cidade)" placeholder="Ex: Camaragibe, Pernambuco" containerStyle={{ marginBottom: 0 }} />
      </View>
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  terms: { ...typography.caption, fontSize: 14, color: colors.textMuted, textAlign: 'center', paddingBottom: spacing.xs },
  link: { color: colors.primary, textDecorationLine: 'underline' },
}));
