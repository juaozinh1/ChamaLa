import { ScreenPlaceholder } from '../../components/ScreenPlaceholder';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { useSession } from '../../contexts/SessionContext';

// TODO: implementar a tela conforme o protótipo (Figma: pro-register).
export function ProRegisterScreen({
  navigation,
}: NativeStackScreenProps<AuthStackParamList, 'ProRegister'>) {
  const { signIn } = useSession();
  return (
    <ScreenPlaceholder
      title="Cadastro de profissional"
      figmaScreen="pro-register"
      description="Etapa 1 de 2: dados pessoais, especialidade principal, área de atuação e aceite dos termos."
      actions={[
        { label: 'Continuar para verificação', onPress: () => signIn('PROFESSIONAL') },
        { label: 'Voltar', onPress: () => navigation.goBack(), variant: 'secondary' },
      ]}
    />
  );
}
