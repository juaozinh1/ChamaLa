import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertBanner, Button, FormInput, Screen, Text } from '../../components';
import { USE_MOCKS } from '../../config/env';
import { useAuth } from '../../contexts/AuthContext';
import { useAction } from '../../hooks';
import { useAuthNavigation } from '../../navigation/hooks';
import { spacing, typography } from '../../theme';
import { LoginForm, loginSchema } from '../../utils';
import { makeStyles } from '../../theme/dynamic';

// O Figma não tem a tela de login: esta segue o estilo do cadastro (pendência registrada).
export function LoginScreen() {
  const styles = useStyles();
  const navigation = useAuthNavigation();
  const { signIn } = useAuth();
  const { control, handleSubmit } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  const [submit, loading] = useAction(
    (values: LoginForm) => signIn(values.email, values.password),
    'Não foi possível entrar',
  );

  return (
    <Screen
      title="Entrar"
      footer={
        <>
          <Button title="Entrar" loading={loading} onPress={handleSubmit((v) => submit(v))} />
          <Button title="Criar conta" variant="outline" onPress={() => navigation.navigate('Welcome')} />
        </>
      }
    >
      <Text style={styles.title}>Bem-vindo de volta</Text>
      <Text style={styles.muted}>Entre com seu e-mail e senha para continuar.</Text>
      <View>
        <FormInput control={control} name="email" label="E-mail" placeholder="seu@email.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
        <FormInput control={control} name="password" label="Senha" placeholder="Sua senha" secureTextEntry autoCapitalize="none" containerStyle={{ marginBottom: spacing.sm }} />
        <Button title="Esqueci minha senha" variant="link" fullWidth={false} style={styles.forgot} onPress={() => navigation.navigate('ForgotPassword')} />
      </View>
      {USE_MOCKS ? (
        <AlertBanner message="Modo de testes: entre com cliente@teste.com ou profissional@teste.com (senha 12345678)." />
      ) : null}
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  title: { ...typography.title, color: colors.primary },
  muted: { ...typography.body, color: colors.textMuted, marginTop: -spacing.sm },
  forgot: { alignSelf: 'flex-end' },
}));
