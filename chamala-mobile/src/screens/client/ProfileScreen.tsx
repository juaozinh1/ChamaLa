import { ScreenPlaceholder } from '../../components/ScreenPlaceholder';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type {
  ClientProfileStackParamList,
  ClientTabParamList,
} from '../../navigation/types';
import { useSession } from '../../contexts/SessionContext';

// TODO: implementar a tela conforme o protótipo (Figma: profile).
export function ProfileScreen({
  navigation,
}: CompositeScreenProps<
  NativeStackScreenProps<ClientProfileStackParamList, 'Profile'>,
  BottomTabScreenProps<ClientTabParamList>
>) {
  const { signOut } = useSession();
  return (
    <ScreenPlaceholder
      title="Perfil"
      figmaScreen="profile"
      description="Menu da conta: dados, pedidos, avaliações, acessibilidade e sair."
      actions={[
        { label: 'Editar perfil', onPress: () => navigation.navigate('EditProfile') },
        {
          label: 'Meus pedidos',
          onPress: () => navigation.navigate('OrdersTab'),
          variant: 'secondary',
        },
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
