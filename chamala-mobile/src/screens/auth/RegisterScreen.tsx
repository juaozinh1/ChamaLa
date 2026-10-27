import { ScreenPlaceholder } from '../../components/ScreenPlaceholder';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { useSession } from '../../contexts/SessionContext';

// TODO: implementar a tela conforme o protótipo (Figma: register).
export function RegisterScreen({
  navigation,
}: NativeStackScreenProps<AuthStackParamList, 'Register'>) {
  const { signIn } = useSession();
  return (
    <ScreenPlaceholder
      title="Criar conta"
      figmaScreen="register"
      description="Cadastro do cliente: nome, e-mail, senha e bairro/cidade."
      actions={[
        { label: 'Criar conta', onPress: () => signIn('CLIENT') },
        { label: 'Voltar', onPress: () => navigation.goBack(), variant: 'secondary' },
      ]}
    />
  );
}
