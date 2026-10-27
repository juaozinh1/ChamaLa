import { ScreenPlaceholder } from '../../components/ScreenPlaceholder';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type {
  ClientHomeStackParamList,
  ClientTabParamList,
} from '../../navigation/types';

// TODO: implementar a tela conforme o protótipo (Figma: home).
export function HomeScreen({
  navigation,
}: CompositeScreenProps<
  NativeStackScreenProps<ClientHomeStackParamList, 'Home'>,
  BottomTabScreenProps<ClientTabParamList>
>) {
  return (
    <ScreenPlaceholder
      title="Início"
      figmaScreen="home"
      description="Busca, categorias em destaque e profissionais próximos."
      actions={[
        {
          label: 'Ver categoria Limpeza',
          onPress: () => navigation.navigate('CategoryDetail', { categoryId: 1 }),
        },
        {
          label: 'Todas as categorias',
          onPress: () => navigation.navigate('Categories'),
          variant: 'secondary',
        },
        {
          label: 'Meus pedidos',
          onPress: () => navigation.navigate('OrdersTab'),
          variant: 'secondary',
        },
      ]}
    />
  );
}
