import { Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertBanner, Button, FormInput, Screen, Text } from '../../components';
import { useAction } from '../../hooks';
import { useAuthNavigation } from '../../navigation/hooks';
import { api } from '../../services';
import { typography } from '../../theme';
import { ForgotPasswordForm, forgotPasswordSchema } from '../../utils';
import { makeStyles } from '../../theme/dynamic';

export function ForgotPasswordScreen() {
  const styles = useStyles();
  const navigation = useAuthNavigation();
  const { control, handleSubmit } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });
  const [submit, loading] = useAction(async (values: ForgotPasswordForm) => {
    await api.auth.forgotPassword(values.email);
    Alert.alert('Confira seu e-mail', 'Se o e-mail estiver cadastrado, enviaremos o link para criar uma nova senha.');
    navigation.goBack();
  }, 'Não foi possível enviar o link');

  return (
    <Screen
      title="Recuperar senha"
      footer={
        <>
          <Button title="Enviar link" loading={loading} onPress={handleSubmit((v) => submit(v))} />
          <Button title="Voltar para o login" variant="outline" onPress={() => navigation.goBack()} />
        </>
      }
    >
      <Text style={styles.title}>Esqueceu a senha?</Text>
      <Text style={styles.text}>Informe o e-mail da sua conta. Enviaremos um link para criar uma nova senha.</Text>
      <FormInput control={control} name="email" label="E-mail" placeholder="seu@email.com" keyboardType="email-address" autoCapitalize="none" containerStyle={{ marginBottom: 0 }} />
      <AlertBanner icon={false} message="O link vale por 30 minutos. Se o e-mail não estiver cadastrado, nada será enviado." />
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  title: { ...typography.title, color: colors.primary },
  text: { ...typography.body, color: colors.textMuted },
}));
