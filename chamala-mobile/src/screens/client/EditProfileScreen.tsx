import { ScreenPlaceholder } from '../../components/ScreenPlaceholder';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type {
  ClientProfileStackParamList,
  ClientTabParamList,
} from '../../navigation/types';

// TODO: implementar a tela conforme o protótipo (Figma: edit-profile).
export function EditProfileScreen({
  navigation,
}: CompositeScreenProps<
  NativeStackScreenProps<ClientProfileStackParamList, 'EditProfile'>,
  BottomTabScreenProps<ClientTabParamList>
>) {
  return (
    <ScreenPlaceholder
      title="Editar perfil"
      figmaScreen="edit-profile"
      description="Dados pessoais e troca de senha."
      actions={[{ label: 'Salvar', onPress: () => navigation.goBack() }]}
    />
  );
}
