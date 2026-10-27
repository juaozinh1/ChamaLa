import { ScreenPlaceholder } from '../../components/ScreenPlaceholder';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { ProTabParamList } from '../../navigation/types';

// TODO: implementar a tela conforme o protótipo (Figma: orders (profissional)).
export function ProRequestsScreen({
  navigation,
}: BottomTabScreenProps<ProTabParamList, 'ProRequestsTab'>) {
  return (
    <ScreenPlaceholder
      title="Solicitações"
      figmaScreen="orders (profissional)"
      description="Pedidos recebidos, orçamentos a responder e seus status."
      actions={[
        { label: 'Voltar ao painel', onPress: () => navigation.navigate('ProHomeTab') },
      ]}
    />
  );
}
