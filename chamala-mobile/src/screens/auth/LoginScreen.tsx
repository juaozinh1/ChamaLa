import { ScreenPlaceholder } from '../../components/ScreenPlaceholder';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { useSession } from '../../contexts/SessionContext';

// TODO: implementar a tela conforme o protótipo (Figma: login).
export function LoginScreen({
  navigation,
}: NativeStackScreenProps<AuthStackParamList, 'Login'>) {
  const { signIn } = useSession();
  return (
    <ScreenPlaceholder
      title="Entrar"
      figmaScreen="login"
      description="E-mail e senha. Até a fase 2, os botões abaixo simulam o login de cada papel."
      actions={[
        { label: 'Entrar como cliente', onPress: () => signIn('CLIENT') },
        {
          label: 'Entrar como profissional',
          onPress: () => signIn('PROFESSIONAL'),
          variant: 'secondary',
        },
        { label: 'Voltar', onPress: () => navigation.goBack(), variant: 'secondary' },
      ]}
    />
  );
}
