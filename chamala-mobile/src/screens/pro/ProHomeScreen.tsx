import { ScreenPlaceholder } from '../../components/ScreenPlaceholder';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { ProTabParamList } from '../../navigation/types';

// TODO: implementar a tela conforme o protótipo (Figma: pro-home).
export function ProHomeScreen({
  navigation,
}: BottomTabScreenProps<ProTabParamList, 'ProHomeTab'>) {
  return (
    <ScreenPlaceholder
      title="Painel"
      figmaScreen="pro-home"
      description="Disponibilidade on/off e novas solicitações para aceitar ou recusar."
      actions={[
        {
          label: 'Ver solicitações',
          onPress: () => navigation.navigate('ProRequestsTab'),
        },
        {
          label: 'Verificação',
          onPress: () => navigation.navigate('ProVerifyTab'),
          variant: 'secondary',
        },
      ]}
    />
  );
}
