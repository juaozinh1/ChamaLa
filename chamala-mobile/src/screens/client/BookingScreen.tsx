import { ScreenPlaceholder } from '../../components/ScreenPlaceholder';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type {
  ClientHomeStackParamList,
  ClientTabParamList,
} from '../../navigation/types';

// TODO: implementar a tela conforme o protótipo (Figma: booking).
export function BookingScreen({
  navigation,
  route,
}: CompositeScreenProps<
  NativeStackScreenProps<ClientHomeStackParamList, 'Booking'>,
  BottomTabScreenProps<ClientTabParamList>
>) {
  void route.params.professionalId;
  return (
    <ScreenPlaceholder
      title="Agendar"
      figmaScreen="booking"
      description="Data, horário (08h a 15h), endereço e observações. O contrato é gerado no aceite."
      actions={[
        {
          label: 'Confirmar solicitação',
          onPress: () => navigation.navigate('OrdersTab'),
        },
        { label: 'Voltar', onPress: () => navigation.goBack(), variant: 'secondary' },
      ]}
    />
  );
}
