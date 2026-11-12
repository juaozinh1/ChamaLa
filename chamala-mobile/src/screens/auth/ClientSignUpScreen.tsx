import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormInput, Screen, Text } from '../../components';
import { useAuth } from '../../contexts/AuthContext';
import { useAction } from '../../hooks';
import { spacing, typography } from '../../theme';
import { ClientSignUpForm, clientSignUpSchema, maskPhone } from '../../utils';
import { makeStyles } from '../../theme/dynamic';

// O cadastro de cliente não aparece nos prints: segue o estilo do cadastro de profissional.
export function ClientSignUpScreen() {
  const styles = useStyles();
  const { signUpClient } = useAuth();
  const { control, handleSubmit } = useForm<ClientSignUpForm>({
    resolver: zodResolver(clientSignUpSchema),
    defaultValues: { name: '', phone: '', email: '', password: '' },
  });
  const [submit, loading] = useAction((values: ClientSignUpForm) => signUpClient(values), 'Não foi possível criar a conta');

  return (
    <Screen
      title="Cadastro de Cliente"
      footer={
        <>
          <Button title="Criar Conta" loading={loading} onPress={handleSubmit((v) => submit(v))} />
          <Text style={styles.terms}>
            Ao continuar, você concorda com os <Text style={styles.link}>Termos de Serviço</Text>.
          </Text>
        </>
      }
    >
      <View>
        <FormInput control={control} name="name" label="Nome Completo" placeholder="Ex: Vinícius Silva" autoCapitalize="words" />
        <FormInput control={control} name="phone" label="Telefone / WhatsApp" placeholder="(11) 98765-4321" keyboardType="phone-pad" mask={maskPhone} />
        <FormInput control={control} name="email" label="E-mail" placeholder="seu@email.com" keyboardType="email-address" autoCapitalize="none" />
        <FormInput control={control} name="password" label="Senha" placeholder="Mínimo 8 caracteres" secureTextEntry autoCapitalize="none" containerStyle={{ marginBottom: 0 }} />
      </View>
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  terms: { ...typography.caption, fontSize: 14, color: colors.textMuted, textAlign: 'center', paddingBottom: spacing.xs },
  link: { color: colors.primary, textDecorationLine: 'underline' },
}));
