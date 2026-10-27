import { ScreenPlaceholder } from '../../components/ScreenPlaceholder';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { ClientTabParamList } from '../../navigation/types';

// TODO: implementar a tela conforme o protótipo (Figma: orders).
export function OrdersScreen({
  navigation,
}: BottomTabScreenProps<ClientTabParamList, 'OrdersTab'>) {
  return (
    <ScreenPlaceholder
      title="Meus pedidos"
      figmaScreen="orders"
      description="Histórico com status pendente, confirmado, concluído e cancelado."
      actions={[
        {
          label: 'Buscar serviços',
          onPress: () => navigation.navigate('HomeTab', { screen: 'Home' }),
        },
      ]}
    />
  );
}
