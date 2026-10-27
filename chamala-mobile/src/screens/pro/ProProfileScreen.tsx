import { ScreenPlaceholder } from '../../components/ScreenPlaceholder';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { ProProfileStackParamList, ProTabParamList } from '../../navigation/types';
import { useSession } from '../../contexts/SessionContext';

// TODO: implementar a tela conforme o protótipo (Figma: pro-profile).
export function ProProfileScreen({
  navigation,
}: CompositeScreenProps<
  NativeStackScreenProps<ProProfileStackParamList, 'ProProfile'>,
  BottomTabScreenProps<ProTabParamList>
>) {
  const { signOut } = useSession();
  return (
    <ScreenPlaceholder
      title="Perfil do profissional"
      figmaScreen="pro-profile"
      description="Conta do profissional, serviços, política de cancelamento e sair."
      actions={[
        { label: 'Verificação', onPress: () => navigation.navigate('ProVerifyTab') },
        {
          label: 'Acessibilidade',
          onPress: () => navigation.navigate('Accessibility'),
          variant: 'secondary',
        },
        { label: 'Sair da conta', onPress: () => signOut(), variant: 'secondary' },
      ]}
    />
  );
}
