import { ScreenPlaceholder } from '../../components/ScreenPlaceholder';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type {
  ClientHomeStackParamList,
  ClientTabParamList,
} from '../../navigation/types';

// TODO: implementar a tela conforme o protótipo (Figma: provider).
export function ProviderScreen({
  navigation,
  route,
}: CompositeScreenProps<
  NativeStackScreenProps<ClientHomeStackParamList, 'Provider'>,
  BottomTabScreenProps<ClientTabParamList>
>) {
  return (
    <ScreenPlaceholder
      title="Perfil do profissional"
      figmaScreen="provider"
      description="Especialidade, nota, avaliações, serviços com preço fixo e política de cancelamento."
      actions={[
        {
          label: 'Agendar serviço',
          onPress: () =>
            navigation.navigate('Booking', {
              professionalId: route.params.professionalId,
            }),
        },
        { label: 'Voltar', onPress: () => navigation.goBack(), variant: 'secondary' },
      ]}
    />
  );
}
